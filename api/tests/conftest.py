"""Les tests utilisent une vraie base PostgreSQL, distincte de celle de développement.

URL : GETEMALL_TEST_DATABASE_URL, par défaut la base locale `getemall_test`. Le schéma public
est recréé au début de la session, puis les migrations sont appliquées.
"""

import os
from collections.abc import AsyncIterator, Iterator

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import create_engine, text
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from sqlalchemy.pool import NullPool

from getemall.api.app import create_app
from getemall.db.schema import upgrade
from getemall.runtime import Runtime
from getemall.settings import Settings

TEST_DATABASE_URL = os.environ.get(
    "GETEMALL_TEST_DATABASE_URL",
    "postgresql+psycopg://postgres:postgres@localhost:5432/getemall_test",
)
UNREACHABLE_DATABASE_URL = "postgresql+psycopg://getemall@127.0.0.1:1/getemall"


def make_settings(**overrides: object) -> Settings:
    """Configuration de test, indépendante du .env du poste."""
    values: dict[str, object] = {
        "database_url": TEST_DATABASE_URL,
        "version": "test",
        "_env_file": None,
    }
    values.update(overrides)
    return Settings(**values)  # type: ignore[arg-type]


def admin_engine() -> AsyncEngine:
    """Le propriétaire des tables, pour préparer et vider les données des tests."""
    return create_async_engine(TEST_DATABASE_URL, poolclass=NullPool)


@pytest.fixture(scope="session")
def settings() -> Settings:
    return make_settings()


@pytest.fixture(scope="session", autouse=True)
def migrated_database(settings: Settings) -> Iterator[None]:
    engine = create_engine(settings.url_for("admin"))
    with engine.begin() as conn:
        conn.execute(text("drop schema public cascade"))
        conn.execute(text("create schema public"))
    engine.dispose()
    upgrade(settings)
    yield


@pytest.fixture(scope="session")
async def runtime(settings: Settings) -> AsyncIterator[Runtime]:
    rt = Runtime.create(settings)
    yield rt
    await rt.dispose()


@pytest.fixture
async def client(settings: Settings, runtime: Runtime) -> AsyncIterator[AsyncClient]:
    app = create_app(settings, runtime)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c


@pytest.fixture
async def clean_accounts() -> AsyncIterator[None]:
    yield
    engine = admin_engine()
    async with engine.begin() as conn:
        await conn.execute(text("truncate accounts restart identity cascade"))
    await engine.dispose()
