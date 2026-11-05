from pathlib import Path

import pytest

from getemall.settings import ConfigError, Env, LogFormat, load_settings
from tests.conftest import make_settings


def test_secret_from_file(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    secret = tmp_path / "db"
    secret.write_text("postgresql+psycopg://getemall_app:fictif01@db/getemall\n")
    monkeypatch.setenv("GETEMALL_DATABASE_URL_FILE", str(secret))
    monkeypatch.chdir(tmp_path)  # aucun .env lu
    settings = load_settings()
    assert settings.url_for("app") == "postgresql+psycopg://getemall_app:fictif01@db/getemall"
    # Sans adresse propre, le worker et les migrations prennent celle de l'API.
    assert settings.url_for("worker") == settings.url_for("app")


def test_missing_database_url_is_named(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("GETEMALL_DATABASE_URL", raising=False)
    monkeypatch.chdir(tmp_path)
    with pytest.raises(ConfigError, match="GETEMALL_DATABASE_URL : variable obligatoire absente"):
        load_settings()


@pytest.mark.parametrize(
    "origin", ["*", "https://getthemall.ch/", "getthemall.ch", "https://*.getthemall.ch"]
)
def test_cors_origins_must_be_exact(origin: str) -> None:
    with pytest.raises(ValueError, match="origine exacte"):
        make_settings(cors_origins=[origin])


def test_json_logs_outside_dev() -> None:
    assert make_settings().log_format_or_default is LogFormat.CONSOLE
    assert make_settings(env=Env.STAGING).log_format_or_default is LogFormat.JSON
