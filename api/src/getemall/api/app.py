"""Application FastAPI.

Routes métier sous /api/v1 ; /healthz et /readyz à la racine pour l'exploitation.
"""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from getemall.api.middleware import RequestContextMiddleware
from getemall.db.base import connected_as_admin
from getemall.health import health_router
from getemall.log import get_logger
from getemall.runtime import Runtime
from getemall.settings import Env, Settings

log = get_logger(__name__)
PREFIX = "/api/v1"


class AdminConnection(RuntimeError):
    """L'API s'est connectée avec un rôle qui passe outre la RLS (règle C-3)."""


async def check_access(runtime: Runtime) -> None:
    """Hors du développement, l'API refuse de démarrer connectée en administrateur."""
    try:
        async with runtime.sessionmaker() as session:
            admin = await connected_as_admin(session)
    except SQLAlchemyError:
        return  # base injoignable : /readyz le dira
    if not admin:
        return
    if runtime.settings.env is not Env.DEV:
        raise AdminConnection("l'API se connecte en administrateur : utiliser le rôle getemall_app")
    log.warning("api_connected_as_admin")


def create_app(settings: Settings, runtime: Runtime) -> FastAPI:
    @asynccontextmanager
    async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
        await check_access(runtime)
        yield
        await runtime.dispose()

    dev = settings.env is Env.DEV
    app = FastAPI(
        title="API Get'emAll",
        version=settings.version,
        lifespan=lifespan,
        # La documentation interactive n'est servie qu'en développement.
        docs_url=f"{PREFIX}/docs" if dev else None,
        redoc_url=None,
        openapi_url=f"{PREFIX}/openapi.json" if dev else None,
    )
    app.state.runtime = runtime
    app.add_middleware(RequestContextMiddleware)
    if settings.cors_origins:
        # Origines exactes, avec cookies (docs/api-plan.md §2) ; jamais « * ».
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.cors_origins,
            allow_credentials=True,
            allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE"],
            allow_headers=["Content-Type", "Authorization", "X-Request-ID"],
        )
    app.include_router(health_router())
    app.include_router(api_router())
    return app


def api_router() -> APIRouter:
    router = APIRouter(prefix=PREFIX)

    @router.get("/version", operation_id="version")
    async def version() -> dict[str, str]:
        return {"version": "v1"}

    return router
