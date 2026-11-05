"""Commandes : `getemall api`, `getemall worker`, `getemall migrate`."""

import argparse
import asyncio
import sys

import uvicorn

from getemall.log import configure_logging, get_logger
from getemall.settings import ConfigError, Settings, load_settings

log = get_logger("getemall")


def _api(settings: Settings) -> None:
    from getemall.api.app import create_app
    from getemall.runtime import Runtime

    app = create_app(settings, Runtime.create(settings, "app"))
    uvicorn.run(app, host=settings.api_host, port=settings.api_port, log_config=None)


def _worker(settings: Settings) -> None:
    from getemall.worker.app import run_worker

    asyncio.run(run_worker(settings))


def _migrate(settings: Settings) -> None:
    from getemall.db.schema import sync_role_passwords, upgrade

    upgrade(settings)
    roles = sync_role_passwords(settings)
    log.info("migrated", roles_with_password=roles)


COMMANDS = {"api": _api, "worker": _worker, "migrate": _migrate}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="getemall", description="API et worker de Get'emAll")
    parser.add_argument("command", choices=sorted(COMMANDS))
    args = parser.parse_args(argv)
    try:
        settings = load_settings()
    except ConfigError as exc:
        print(f"Configuration invalide :\n{exc}", file=sys.stderr)
        return 2
    configure_logging(settings)
    COMMANDS[args.command](settings)
    return 0


if __name__ == "__main__":
    sys.exit(main())
