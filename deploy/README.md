# deploy

- `compose.dev.yml` : la base PostgreSQL du poste de développement (base `getemall` et base
  des tests `getemall_test`), sur le port 5433 de l'ordinateur seulement.

Le déploiement (images, Helm, staging, ArgoCD) fera l'objet d'un plan à part, une fois la
connexion (lot 3) en place (docs/api-plan.md §9).
