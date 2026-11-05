"""Moteur et sessions SQLAlchemy (asynchrones, pilote psycopg 3).

L'API se connecte en `getemall_app`, le worker en `getemall_worker` : ni superutilisateur, ni
contournement de la RLS (règle C-3). `getemall migrate` se connecte en propriétaire des tables.
"""

from contextvars import ContextVar
from functools import partial
from typing import Any, Literal

from sqlalchemy import event, text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from getemall.settings import Settings

APP_ROLE = "getemall_app"
WORKER_ROLE = "getemall_worker"
RESTRICTED = (APP_ROLE, WORKER_ROLE)
Access = Literal["app", "worker", "admin"]
# Le compte en cours (voir getemall.accounts), transmis à la base à chaque transaction.
ACCOUNT: ContextVar[int | None] = ContextVar("getemall_account", default=None)
# Le réglage de transaction lu par les règles RLS.
ACCOUNT_SETTING = "app.account_id"


class Base(DeclarativeBase):
    pass


class RoleMissing(RuntimeError):
    """Le rôle restreint n'existe pas : la séparation des comptes ne s'appliquerait pas."""


def _on_connect(dbapi_connection: Any, _record: Any, access: Access = "app") -> None:
    if access == "admin":
        return
    wanted = WORKER_ROLE if access == "worker" else APP_ROLE
    cursor = dbapi_connection.cursor()
    try:
        cursor.execute("select current_user")
        row = cursor.fetchone()
        if row is not None and row[0] == wanted:
            return
        # Connecté avec un autre rôle (tests, poste de développement) : on se restreint
        # soi-même, et l'on refuse de continuer si le rôle n'existe pas encore (base non migrée
        # mais déjà dotée de règles RLS).
        cursor.execute("select 1 from pg_roles where rolname = %s", (wanted,))
        if cursor.fetchone() is not None:
            cursor.execute(f"set role {wanted}")
            return
        cursor.execute("select 1 from pg_policies where policyname = 'account_isolation'")
        if cursor.fetchone() is not None:
            raise RoleMissing(
                f"rôle {wanted} absent : la séparation des comptes ne s'appliquerait pas"
            )
    finally:
        cursor.close()
        dbapi_connection.commit()


def _on_begin(connection: Any) -> None:
    account = ACCOUNT.get()
    connection.exec_driver_sql(
        f"select set_config('{ACCOUNT_SETTING}', %s, true)",
        ("" if account is None else str(account),),
    )


def create_engine(settings: Settings, access: Access = "app") -> AsyncEngine:
    # Aucune connexion n'est ouverte ici : l'application démarre même si la base est absente.
    engine = create_async_engine(
        settings.url_for(access), pool_pre_ping=True, connect_args={"connect_timeout": 3}
    )
    event.listen(engine.sync_engine, "connect", partial(_on_connect, access=access))
    event.listen(engine.sync_engine, "begin", _on_begin)
    return engine


def create_sessionmaker(engine: AsyncEngine) -> async_sessionmaker[AsyncSession]:
    return async_sessionmaker(engine, expire_on_commit=False)


async def connected_as_admin(session: AsyncSession) -> bool:
    """La connexion s'est faite avec un rôle qui passe outre la RLS, même restreint ensuite."""
    found = await session.scalar(
        text("select rolsuper or rolbypassrls from pg_roles where rolname = session_user")
    )
    return bool(found)
