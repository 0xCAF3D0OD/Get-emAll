"""Tables de Get'emAll (docs/api-plan.md §4).

Chaque table annonce son niveau (règle D-1) et sa famille dans `policies.py` (C-1).
"""

from datetime import datetime

from sqlalchemy import BigInteger, DateTime, Identity, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from getemall.db.base import Base


class Account(Base):
    """Un compte Get'emAll. Niveau : personnelle.

    `subject` est l'identifiant propre à Get'emAll que jobA1 rend à la connexion : jamais l'id
    du compte jobA1 (docs/api-plan.md §2). Famille « connexion » : un compte ne voit que sa
    ligne ; il n'est retrouvé par `subject` que par une fonction qui ne rend que son numéro.
    """

    __tablename__ = "accounts"

    id: Mapped[int] = mapped_column(BigInteger, Identity(), primary_key=True)
    subject: Mapped[str] = mapped_column(Text, unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    last_seen_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
