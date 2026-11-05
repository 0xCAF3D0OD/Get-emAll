"""Une famille pour chaque table (règle C-1).

`tests/test_policies.py` compare cette liste à la base elle-même : une nouvelle table qui n'y
est pas rangée, ou qui n'a pas les règles de sa famille, fait échouer les tests.

- **Personnelles** : chaque compte ne lit et n'écrit que ses lignes (`account_id`, règle
  `account_isolation`).
- **Connexion** : un compte ne voit que sa ligne ; un identifiant n'est reconnu que par une
  fonction qui ne rend que le numéro du compte.
- **Communes** : tout compte lit ; seul le worker écrit (banque de questions relue).
- **Techniques** : ni séparation ni contenu des comptes (file des tâches, version des
  migrations).
"""

from typing import Literal

Family = Literal["personal", "connection", "shared", "technical"]

PERSONAL: tuple[str, ...] = ()
CONNECTION = ("accounts",)
SHARED: tuple[str, ...] = ()
TECHNICAL = (
    "alembic_version",
    "procrastinate_events",
    "procrastinate_jobs",
    "procrastinate_periodic_defers",
    "procrastinate_workers",
)

FAMILIES: dict[str, Family] = {
    **dict.fromkeys(PERSONAL, "personal"),
    **dict.fromkeys(CONNECTION, "connection"),
    **dict.fromkeys(SHARED, "shared"),
    **dict.fromkeys(TECHNICAL, "technical"),
}
