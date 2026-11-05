"""Migrations Alembic : configuration, application et vérification de la révision.

Les migrations voyagent dans le paquet (getemall/db/migrations). Elles ne sont jamais
appliquées au démarrage de l'API ou du worker : `getemall migrate` seulement.
"""

from pathlib import Path

from alembic import command
from alembic.config import Config
from alembic.script import ScriptDirectory
from sqlalchemy import Connection, create_engine, make_url, pool, text
from sqlalchemy.exc import ProgrammingError
from sqlalchemy.ext.asyncio import AsyncConnection

from getemall.db.base import APP_ROLE, WORKER_ROLE
from getemall.settings import Settings

MIGRATIONS_DIR = Path(__file__).parent / "migrations"


def alembic_config(settings: Settings) -> Config:
    config = Config()
    config.set_main_option("script_location", str(MIGRATIONS_DIR))
    # « % » doit être échappé dans les options Alembic (mots de passe encodés en URL).
    config.set_main_option("sqlalchemy.url", settings.url_for("admin").replace("%", "%%"))
    return config


def head_revision() -> str | None:
    return ScriptDirectory(str(MIGRATIONS_DIR)).get_current_head()


def upgrade(settings: Settings) -> None:
    command.upgrade(alembic_config(settings), "head")


def role_passwords(settings: Settings) -> dict[str, str]:
    """Les mots de passe des rôles de l'API et du worker, tirés de leur adresse de connexion."""
    wanted: dict[str, str] = {}
    for access, role in (("app", APP_ROLE), ("worker", WORKER_ROLE)):
        url = make_url(settings.url_for(access))
        if url.username == role and url.password:
            wanted[role] = str(url.password)
    return wanted


def set_role_password(conn: Connection, role: str, password: str) -> None:
    # Le mot de passe passe par un réglage de la transaction : jamais dans le texte d'une
    # requête, donc jamais dans un journal du serveur.
    conn.execute(text("select set_config('getemall.role_password', :p, true)"), {"p": password})
    conn.execute(
        text(
            "do $$ begin execute format('alter role %I password %L', "
            f"'{role}', current_setting('getemall.role_password')); end $$"
        )
    )


def sync_role_passwords(settings: Settings) -> list[str]:
    """Donne aux rôles de l'API et du worker le mot de passe de leur adresse de connexion."""
    wanted = role_passwords(settings)
    if not wanted:
        return []
    engine = create_engine(settings.url_for("admin"), poolclass=pool.NullPool)
    try:
        with engine.begin() as conn:
            for role, password in wanted.items():
                set_role_password(conn, role, password)
    finally:
        engine.dispose()
    return list(wanted)


async def current_revision(conn: AsyncConnection) -> str | None:
    try:
        result = await conn.execute(text("select version_num from alembic_version"))
    except ProgrammingError:
        await conn.rollback()
        return None
    return result.scalar_one_or_none()
