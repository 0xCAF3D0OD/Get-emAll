"""Le compte en cours, transmis à la base au début de chaque transaction (règle C-6).

La base ne montre à une requête que les lignes de ce compte (RLS) : le code ne filtre jamais
« à la main » à la place de la base (C-2).
"""

from collections.abc import Iterator
from contextlib import contextmanager

from getemall.db.base import ACCOUNT


def current() -> int | None:
    return ACCOUNT.get()


@contextmanager
def use(account: int | None) -> Iterator[None]:
    token = ACCOUNT.set(account)
    try:
        yield
    finally:
        ACCOUNT.reset(token)
