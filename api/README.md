# api

API de Get'emAll : Python 3.13, FastAPI, SQLAlchemy async, Alembic, Procrastinate, la même pile
que jobA1. Plan : [docs/api-plan.md](../docs/api-plan.md).

## Lancer sur le poste

```bash
docker compose -f ../deploy/compose.dev.yml up -d   # PostgreSQL 16 sur le port 5433
cp .env.example .env
uv sync
uv run getemall migrate   # migrations, puis mot de passe des rôles tiré des adresses
uv run getemall api       # http://127.0.0.1:8000/healthz, documentation sur /api/v1/docs
uv run getemall worker
```

## Vérifier

```bash
uv run ruff format --check .
uv run ruff check .
uv run mypy src tests
GETEMALL_TEST_DATABASE_URL=postgresql+psycopg://getemall_owner:fictif-owner@localhost:5433/getemall_test uv run pytest -q
```

## Règles

- Les règles de sécurité des données de jobA1 (`docs/regles-securite-donnees.md` du dépôt
  job-bot) s'appliquent telles quelles ; chaque PR cite celles qu'elle touche (R-1).
- Une nouvelle table se range dans une famille de `db/policies.py` et annonce son niveau dans
  `db/models.py` (D-1, C-1) : `tests/test_database.py` échoue sinon.
- L'API se connecte en `getemall_app`, le worker en `getemall_worker` ; hors du développement,
  l'API refuse de démarrer connectée en administrateur (C-3).
- Les migrations ne tournent jamais au démarrage : `getemall migrate` seulement.
