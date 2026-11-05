"""Contrôles de santé communs à l'API et au worker (/healthz, /readyz)."""

from dataclasses import dataclass

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine

from getemall.db.schema import current_revision, head_revision
from getemall.log import get_logger

log = get_logger(__name__)


@dataclass
class DatabaseCheck:
    ok: bool
    revision: str | None
    head: str | None

    @property
    def up_to_date(self) -> bool:
        return self.ok and self.revision is not None and self.revision == self.head


async def check_database(engine: AsyncEngine) -> DatabaseCheck:
    head = head_revision()
    try:
        async with engine.connect() as conn:
            await conn.execute(text("select 1"))
            revision = await current_revision(conn)
    except Exception as exc:
        # Seul le type d'erreur est journalisé : le message peut contenir l'hôte ou l'utilisateur.
        log.warning("database_unreachable", error=type(exc).__name__)
        return DatabaseCheck(ok=False, revision=None, head=head)
    return DatabaseCheck(ok=True, revision=revision, head=head)


def health_router() -> APIRouter:
    """Points d'entrée d'exploitation, hors de /api et sans authentification."""
    router = APIRouter(include_in_schema=False)

    @router.get("/healthz")
    async def healthz() -> dict[str, str]:
        return {"status": "ok"}

    @router.get("/readyz")
    async def readyz(request: Request) -> JSONResponse:
        check = await check_database(request.app.state.runtime.engine)
        if not check.ok:
            reason = "base de données injoignable"
        elif not check.up_to_date:
            reason = f"migration attendue {check.head}, trouvée {check.revision}"
        else:
            return JSONResponse({"status": "ready", "revision": check.revision})
        return JSONResponse({"status": "not_ready", "reason": reason}, status_code=503)

    return router
