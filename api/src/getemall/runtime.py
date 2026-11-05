"""Ressources partagées par l'API, le worker et les commandes ponctuelles."""

from dataclasses import dataclass

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker

from getemall.db.base import Access, create_engine, create_sessionmaker
from getemall.settings import Settings


@dataclass
class Runtime:
    settings: Settings
    engine: AsyncEngine
    sessionmaker: async_sessionmaker[AsyncSession]

    @classmethod
    def create(cls, settings: Settings, access: Access = "app") -> "Runtime":
        """`access` : l'API (`app`), le worker, ou une commande du propriétaire (`admin`)."""
        engine = create_engine(settings, access)
        return cls(settings=settings, engine=engine, sessionmaker=create_sessionmaker(engine))

    async def dispose(self) -> None:
        await self.engine.dispose()
