"""Rôles sans privilège, RLS sur chaque table d'un compte (règles C-1 à C-3)."""

import pytest
from sqlalchemy import text
from sqlalchemy.exc import DBAPIError

from getemall import accounts
from getemall.api.app import AdminConnection, check_access
from getemall.db.base import APP_ROLE, WORKER_ROLE
from getemall.db.models import Account
from getemall.db.policies import FAMILIES, TECHNICAL
from getemall.runtime import Runtime
from getemall.settings import Env
from tests.conftest import admin_engine, make_settings

INSERT_TWO = text("insert into accounts (subject) values ('fictif01'), ('fictif02') returning id")


async def _tables() -> dict[str, tuple[bool, set[str]]]:
    """Chaque table du schéma public : RLS active ?, noms de ses règles."""
    engine = admin_engine()
    async with engine.connect() as conn:
        rows = await conn.execute(
            text(
                "select c.relname, c.relrowsecurity, "
                "coalesce(array_agg(p.policyname) filter (where p.policyname is not null), '{}') "
                "from pg_class c join pg_namespace n on n.oid = c.relnamespace "
                "left join pg_policies p on p.tablename = c.relname and p.schemaname = n.nspname "
                "where n.nspname = 'public' and c.relkind = 'r' "
                "group by c.relname, c.relrowsecurity"
            )
        )
        found = {name: (rls, set(policies)) for name, rls, policies in rows}
    await engine.dispose()
    return found


async def test_every_table_has_a_family() -> None:
    tables = await _tables()
    assert set(tables) == set(FAMILIES), "ranger chaque table dans db/policies.py"


async def test_account_tables_have_row_security() -> None:
    for name, (rls, policies) in (await _tables()).items():
        if FAMILIES[name] in ("personal", "connection"):
            assert rls, f"{name} : RLS absente"
            assert "account_isolation" in policies, f"{name} : règle account_isolation absente"
        elif name not in TECHNICAL:
            assert rls, f"{name} : RLS absente"


async def test_roles_have_no_privilege() -> None:
    engine = admin_engine()
    async with engine.connect() as conn:
        rows = await conn.execute(
            text(
                "select rolname, rolsuper, rolbypassrls, rolcreatedb, rolcreaterole "
                "from pg_roles where rolname in (:a, :w)"
            ),
            {"a": APP_ROLE, "w": WORKER_ROLE},
        )
        found = {name: flags for name, *flags in rows}
    await engine.dispose()
    assert set(found) == {APP_ROLE, WORKER_ROLE}
    for flags in found.values():
        assert flags == [False, False, False, False]


async def test_an_account_sees_only_its_row(runtime: Runtime, clean_accounts: None) -> None:
    engine = admin_engine()
    async with engine.begin() as conn:
        ids = (await conn.execute(INSERT_TWO)).scalars().all()
    await engine.dispose()
    first, second = ids
    with accounts.use(first):
        async with runtime.sessionmaker() as session:
            subjects = (await session.execute(text("select subject from accounts"))).scalars().all()
            assert subjects == ["fictif01"]
            assert await session.get(Account, second) is None
    # Sans compte en cours, rien n'est visible.
    async with runtime.sessionmaker() as session:
        assert (await session.execute(text("select count(*) from accounts"))).scalar() == 0


async def test_an_account_cannot_write_another_row(runtime: Runtime, clean_accounts: None) -> None:
    engine = admin_engine()
    async with engine.begin() as conn:
        first, second = (await conn.execute(INSERT_TWO)).scalars().all()
    with accounts.use(first):
        async with runtime.sessionmaker.begin() as session:
            result = await session.execute(
                text("update accounts set subject = 'pris' where id = :id"), {"id": second}
            )
            assert result.rowcount == 0  # type: ignore[attr-defined]
    async with engine.connect() as conn:
        assert (
            await conn.execute(text("select subject from accounts where id = :id"), {"id": second})
        ).scalar() == "fictif02"
    await engine.dispose()


async def test_api_cannot_change_migration_version(runtime: Runtime) -> None:
    async with runtime.sessionmaker() as session:
        with pytest.raises(DBAPIError):
            await session.execute(text("update alembic_version set version_num = 'x'"))


async def test_api_refuses_admin_connection_outside_dev() -> None:
    # Les tests se connectent en superutilisateur : refusé hors du développement.
    runtime = Runtime.create(make_settings(env=Env.PROD))
    with pytest.raises(AdminConnection):
        await check_access(runtime)
    await runtime.dispose()
    dev = Runtime.create(make_settings())
    await check_access(dev)
    await dev.dispose()
