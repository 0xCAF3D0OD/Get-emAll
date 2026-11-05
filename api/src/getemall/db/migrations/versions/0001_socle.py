"""Socle : rôles sans privilège, droits précis, table des comptes (docs/api-plan.md §1, §4)

Revision ID: 0001
Revises:
Create Date: 2026-11-05

- Deux rôles de connexion : `getemall_app` (l'API) et `getemall_worker` (le worker, qui a les
  droits de l'API et écrira en plus les tables communes). Ni superutilisateur, ni contournement
  de la RLS (C-3).
- Droits précis : lire, ajouter, modifier, supprimer ; la version des migrations est en lecture
  seule. Les tables créées ensuite reçoivent les mêmes droits.
- `accounts`, famille « connexion » : un compte ne voit et ne modifie que sa ligne.

Les rôles valent pour tout le serveur PostgreSQL : ils ne sont jamais supprimés au retour
arrière.
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

APP = "getemall_app"
WORKER = "getemall_worker"
CURRENT = "nullif(current_setting('app.account_id', true), '')::bigint"


def upgrade() -> None:
    for role in (APP, WORKER):
        op.execute(
            f"do $$ begin if not exists (select 1 from pg_roles where rolname = '{role}') "
            f"then create role {role} nologin; end if; end $$"
        )
        op.execute(
            f"alter role {role} login nosuperuser nobypassrls nocreatedb nocreaterole inherit"
        )
    op.execute(f"grant {APP} to {WORKER}")
    # Le propriétaire peut endosser ces rôles (tests, poste de développement).
    op.execute(f"grant {WORKER} to current_user")

    op.execute(f"revoke all on schema public from {APP}")
    op.execute(f"grant usage on schema public to {APP}")
    op.execute(
        "alter default privileges in schema public "
        f"grant select, insert, update, delete on tables to {APP}"
    )
    op.execute(
        f"alter default privileges in schema public grant usage, select on sequences to {APP}"
    )

    op.create_table(
        "accounts",
        sa.Column("id", sa.BigInteger(), sa.Identity(), primary_key=True),
        sa.Column("subject", sa.Text(), nullable=False, unique=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.Column(
            "last_seen_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.execute("alter table accounts enable row level security")
    op.execute(
        f"create policy account_isolation on accounts using (id = {CURRENT}) "
        f"with check (id = {CURRENT})"
    )
    # La table de version existe déjà quand cette migration tourne : lecture seule pour l'API.
    op.execute(f"grant select on alembic_version to {APP}")


def downgrade() -> None:
    op.drop_table("accounts")
