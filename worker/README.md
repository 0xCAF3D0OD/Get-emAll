# worker

Le worker exécute le même paquet Python que l'API (`api/`, paquet `getemall`) : il n'a pas de
code à lui (docs/api-plan.md §1). Ce dossier recevra son image et sa commande avec le plan de
déploiement.

```bash
cd api
uv run getemall worker   # file procrastinate + /healthz et /readyz sur le port 8001
```

Il se connecte en `getemall_worker` (`GETEMALL_WORKER_DATABASE_URL`).
