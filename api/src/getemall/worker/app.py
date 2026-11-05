"""Processus worker : file procrastinate et petit serveur HTTP (/healthz, /readyz).

Le worker exécute le même paquet que l'API (docs/api-plan.md §1) ; il se connecte en
`getemall_worker`. Les tâches (transcription, analyse, effacement de l'audio, ligues)
arrivent avec leurs lots. Arrêt sur SIGTERM ou SIGINT : la tâche en cours a
SHUTDOWN_GRACE_SECONDS pour finir.
"""

import asyncio
import contextlib
import signal

import procrastinate
import uvicorn
from fastapi import FastAPI

from getemall.api.middleware import RequestContextMiddleware
from getemall.health import health_router
from getemall.log import get_logger
from getemall.runtime import Runtime
from getemall.settings import Settings, libpq

log = get_logger(__name__)

SHUTDOWN_GRACE_SECONDS = 20
QUEUE = "default"


def build_procrastinate_app(settings: Settings) -> procrastinate.App:
    return procrastinate.App(
        connector=procrastinate.PsycopgConnector(conninfo=libpq(settings.url_for("worker")))
    )


def build_http_app(runtime: Runtime) -> FastAPI:
    app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
    app.state.runtime = runtime
    app.add_middleware(RequestContextMiddleware)
    app.include_router(health_router())
    return app


async def run_worker(settings: Settings) -> None:
    runtime = Runtime.create(settings, "worker")
    queue = build_procrastinate_app(settings)
    server = uvicorn.Server(
        uvicorn.Config(
            build_http_app(runtime),
            host=settings.api_host,
            port=settings.worker_http_port,
            log_config=None,
        )
    )
    stop = asyncio.Event()
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGTERM, signal.SIGINT):
        loop.add_signal_handler(sig, stop.set)
    http = asyncio.create_task(server.serve())
    try:
        async with queue.open_async():
            work = asyncio.create_task(
                queue.run_worker_async(queues=[QUEUE], install_signal_handlers=False)
            )
            log.info("worker_started")
            await stop.wait()
            work.cancel()
            with contextlib.suppress(asyncio.CancelledError, TimeoutError):
                await asyncio.wait_for(work, SHUTDOWN_GRACE_SECONDS)
    finally:
        server.should_exit = True
        await http
        await runtime.dispose()
        log.info("worker_stopped")
