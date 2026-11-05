"""Configuration : uniquement des variables d'environnement préfixées GETEMALL_.

Chaque secret accepte une variante `_FILE` (chemin d'un fichier qui contient la valeur), pour
les Secrets Kubernetes montés en fichier. Aucun secret dans le dépôt (règle S-1).
"""

import os
from enum import StrEnum
from pathlib import Path
from typing import Any

from pydantic import Field, SecretStr, ValidationError, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_PREFIX = "GETEMALL_"

# Variables dont la valeur peut être lue depuis un fichier (GETEMALL_<NOM>_FILE).
SECRET_FIELDS = (
    "database_url",
    "worker_database_url",
    "migrate_database_url",
)


class Env(StrEnum):
    DEV = "dev"
    STAGING = "staging"
    PROD = "prod"


class LogFormat(StrEnum):
    CONSOLE = "console"
    JSON = "json"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix=ENV_PREFIX,
        # .env dans api/ en développement ; en staging et en production, aucun fichier.
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Trois accès à la base (docs/api-plan.md §1) : l'API (rôle getemall_app), le worker
    # (getemall_worker) et `getemall migrate` (le propriétaire des tables). Vides : l'adresse
    # de l'API.
    database_url: SecretStr
    worker_database_url: SecretStr | None = None
    migrate_database_url: SecretStr | None = None
    env: Env = Env.DEV
    api_host: str = "127.0.0.1"
    api_port: int = Field(default=8000, ge=1, le=65535)
    worker_http_port: int = Field(default=8001, ge=1, le=65535)
    log_level: str = "INFO"
    log_format: LogFormat | None = None
    # Origines exactes de l'app web, avec cookies (docs/api-plan.md §2) : jamais « * ».
    cors_origins: list[str] = Field(default_factory=list)
    version: str = "dev"

    @field_validator("cors_origins")
    @classmethod
    def _exact_origins(cls, origins: list[str]) -> list[str]:
        for origin in origins:
            if (
                "*" in origin
                or origin.endswith("/")
                or not origin.startswith(("https://", "http://"))
            ):
                raise ValueError(f"origine exacte attendue, sans « * » ni « / » final : {origin}")
        return origins

    def url_for(self, access: str) -> str:
        """L'adresse de la base pour l'API (`app`), le worker ou le propriétaire (`admin`)."""
        chosen = {"worker": self.worker_database_url, "admin": self.migrate_database_url}.get(
            access
        )
        return (chosen or self.database_url).get_secret_value()

    @property
    def log_format_or_default(self) -> LogFormat:
        if self.log_format is not None:
            return self.log_format
        return LogFormat.CONSOLE if self.env is Env.DEV else LogFormat.JSON


def libpq(url: str) -> str:
    """URL sans le suffixe de pilote SQLAlchemy, pour psycopg et procrastinate."""
    return url.replace("postgresql+psycopg://", "postgresql://", 1)


class ConfigError(Exception):
    """Configuration invalide : le message nomme les variables fautives."""


def _values_from_files() -> dict[str, Any]:
    values: dict[str, Any] = {}
    for field in SECRET_FIELDS:
        var = f"{ENV_PREFIX}{field.upper()}_FILE"
        path = os.environ.get(var)
        if not path:
            continue
        try:
            values[field] = Path(path).read_text(encoding="utf-8").strip()
        except OSError as exc:
            raise ConfigError(f"{var} : impossible de lire {path} ({exc.strerror})") from exc
    return values


def load_settings() -> Settings:
    try:
        return Settings(**_values_from_files())
    except ValidationError as exc:
        lines = []
        for err in exc.errors():
            loc = err["loc"]
            name = f"{ENV_PREFIX}{str(loc[0]).upper()}" if loc else "configuration"
            msg = "variable obligatoire absente" if err["type"] == "missing" else err["msg"]
            lines.append(f"{name} : {msg.removeprefix('Value error, ')}")
        raise ConfigError("\n".join(lines)) from exc
