# get'emall

Application d'entraînement aux entretiens d'embauche, liée à jobA1 par API uniquement (base séparée).
Domaine prévu : getthemall.ch. Identifiant d'app : `ch.getthemall.app`.

## Dossiers

| Dossier | Contenu |
| --- | --- |
| `app/` | App Expo (web, iOS, Android), TypeScript strict, Expo Router |
| `api/` | API (à venir) |
| `worker/` | Tâches de fond (à venir) |
| `deploy/` | Images, chart Helm (à venir) |
| `docs/` | Maquette de référence, PROMPT.md, cahier des charges technique |

## Lancer l'app

```bash
cd app
npm install
npx expo start --web   # ou --ios, --android avec Expo Go
```

Vérifications : `npm run typecheck`, `npm run lint`, `npm test`.
