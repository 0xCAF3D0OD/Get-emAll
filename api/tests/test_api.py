from httpx import ASGITransport, AsyncClient

from getemall.api.app import create_app
from getemall.runtime import Runtime
from getemall.settings import Env
from tests.conftest import UNREACHABLE_DATABASE_URL, make_settings


async def test_healthz(client: AsyncClient) -> None:
    response = await client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


async def test_readyz_reports_the_revision(client: AsyncClient) -> None:
    response = await client.get("/readyz")
    assert response.status_code == 200
    assert response.json() == {"status": "ready", "revision": "0002"}


async def test_readyz_without_database() -> None:
    settings = make_settings(database_url=UNREACHABLE_DATABASE_URL)
    runtime = Runtime.create(settings)
    app = create_app(settings, runtime)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        response = await c.get("/readyz")
    await runtime.dispose()
    assert response.status_code == 503
    # Ni hôte ni utilisateur dans la réponse (J-3).
    assert response.json() == {"status": "not_ready", "reason": "base de données injoignable"}


async def test_security_headers_and_no_store(client: AsyncClient) -> None:
    response = await client.get("/api/v1/version")
    assert response.status_code == 200
    assert (
        response.headers["content-security-policy"] == "default-src 'none'; frame-ancestors 'none'"
    )
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["referrer-policy"] == "no-referrer"
    assert response.headers["cache-control"] == "no-store"
    assert response.headers["x-request-id"]


async def test_request_id_is_kept_only_when_valid(client: AsyncClient) -> None:
    kept = await client.get("/healthz", headers={"X-Request-ID": "abc-123"})
    assert kept.headers["x-request-id"] == "abc-123"
    replaced = await client.get("/healthz", headers={"X-Request-ID": "a b\nc"})
    assert replaced.headers["x-request-id"] != "a b\nc"


async def test_docs_only_in_dev() -> None:
    for env, expected in ((Env.DEV, 200), (Env.PROD, 404)):
        settings = make_settings(env=env)
        runtime = Runtime.create(settings)
        app = create_app(settings, runtime)
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
            assert (await c.get("/api/v1/openapi.json")).status_code == expected
        await runtime.dispose()


async def test_cors_exact_origin_with_credentials() -> None:
    settings = make_settings(cors_origins=["https://staging.getthemall.ch"])
    runtime = Runtime.create(settings)
    app = create_app(settings, runtime)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        allowed = await c.options(
            "/api/v1/version",
            headers={
                "Origin": "https://staging.getthemall.ch",
                "Access-Control-Request-Method": "POST",
            },
        )
        other = await c.options(
            "/api/v1/version",
            headers={"Origin": "https://example.ch", "Access-Control-Request-Method": "POST"},
        )
    await runtime.dispose()
    assert allowed.headers["access-control-allow-origin"] == "https://staging.getthemall.ch"
    assert allowed.headers["access-control-allow-credentials"] == "true"
    assert "access-control-allow-origin" not in other.headers
