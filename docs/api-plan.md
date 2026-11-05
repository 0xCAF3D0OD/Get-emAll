# Plan de l'API Get'emAll (phase 1)

> Statut : **validé** le 2026-11-05 par Kevin, point par point, avec les précisions intégrées
> ci-dessous. Le cahier des charges technique est mis à jour à part : Python 3.13, cookie sur le
> web, copie de l'offre, SDK Anthropic, base séparée, OpenID Connect abandonné.

L'API vit dans `api/`, sur api.getthemall.ch, avec sa propre base PostgreSQL. Elle reprend la
pile et les conventions du backend jobA1 (dépôt job-bot). Elle se livre en 8 lots, un par PR ;
l'app passe d'un client fictif à un vrai client domaine par domaine.

## 1. Pile technique, reprise de jobA1

| Sujet | Get'emAll |
| --- | --- |
| Langage et paquets | Python 3.13, uv, paquet `getemall` dans `api/src/getemall` |
| API | FastAPI, Pydantic, `operation_id` sur chaque route, sous `/api/v1` ; l'app génère ses types depuis l'OpenAPI |
| Base | SQLAlchemy async, psycopg 3, Alembic (migrations numérotées depuis 0001), base `getemall` à part |
| Cloisonnement | RLS sur chaque table d'un compte, rôles `getemall_app` et `getemall_worker` sans privilège |
| Tâches de fond | Procrastinate, file dans PostgreSQL : transcription, analyse, effacement de l'audio, ligues |
| IA | SDK Anthropic derrière une interface (§6), consignes versionnées `llm/prompts/*-v1.md` |
| Réglages | pydantic-settings, variables et fichiers `_FILE` ; aucun secret dans le dépôt |
| Journaux | structlog JSON, sans contenu |
| Qualité | ruff (100 colonnes), mypy strict, pytest-asyncio, test de contrat contre l'OpenAPI |
| Jetons | `gea_` pour l'app, 256 bits, seule l'empreinte SHA-256 en base, révocables |

Le dossier `worker/` ne contient que l'image et sa commande : le worker exécute le même paquet
que l'API. Les règles de sécurité de jobA1 (`docs/regles-securite-donnees.md` de job-bot)
s'appliquent telles quelles ; chaque PR cite celles qu'elle touche (R-1).

## 2. Connexion « Se connecter avec jobA1 »

Schéma « code d'autorisation » d'OAuth 2, sans OpenID Connect : code de 60 s, PKCE et `state`.
Le jeton jobA1 ne quitte jamais le serveur Get'emAll ; l'app ne reçoit que le jeton Get'emAll.

1. **App** : « Se connecter avec jobA1 » ouvre `https://app.joba1.ch/connexion/getemall` avec un
   `state` et un `code_challenge` (PKCE, S256) tirés au hasard, et l'adresse de retour.
2. **jobA1** : la personne se connecte si besoin, puis voit la page de consentement (§3).
3. **jobA1** : « Autoriser » tire un code `jbc_…` (128 bits, une seule lecture, 60 s, empreinte
   seule en base) et renvoie vers l'adresse de retour avec `code` et `state`.
4. **App** : vérifie le `state`, puis envoie `code` et `code_verifier` à `POST /api/v1/connexion`.
5. **API Get'emAll** : appelle jobA1 de serveur à serveur
   (`POST /api/partenaires/getemall/echange`) avec son secret client, le code et le
   `code_verifier`.
6. **jobA1** : vérifie le secret, le code et le PKCE, brûle le code, puis rend un identifiant
   propre à Get'emAll (aléatoire, stable, jamais l'id du compte jobA1), un jeton de liaison
   `jbg_…` limité à la lecture du suivi, et les consentements donnés (§3).
7. **API Get'emAll** : retrouve ou crée le compte d'après cet identifiant, garde le jeton de
   liaison **chiffré** (il doit le renvoyer à jobA1, une empreinte ne suffit pas) et crée le
   jeton de l'appareil.

**Adresses de retour.** La liste est fixée par environnement dans la config de jobA1, jamais lue
dans la requête : une adresse absente de la liste est refusée.

| Environnement de jobA1 | Adresses acceptées |
| --- | --- |
| production | `https://getthemall.ch/connexion`, `getthemall://connexion` (mobile, phase 2) |
| staging | `https://staging.getthemall.ch/connexion` |
| dev | l'adresse locale d'Expo (`http://localhost:8081/connexion`) |

**Le jeton de l'app.**

- Web : cookie `HttpOnly`, `Secure`, `SameSite=Strict`, **sans attribut `Domain`**, posé par
  api.getthemall.ch. CORS avec l'origine exacte de l'app et `credentials`. Contrôle de l'en-tête
  `Origin` sur toute requête qui écrit. L'app web appelle `fetch` avec `credentials: 'include'`.
  À tester en staging dès le lot 3.
- Mobile : jeton Bearer dans le trousseau de l'appareil (expo-secure-store).

**Fin de la liaison.**

- Dans jobA1, Réglages › Connexions › Get'emAll › « Retirer » révoque le jeton de liaison.
  Get'emAll reçoit alors 401 et l'app propose de se reconnecter.
- Dans Get'emAll, « Se déconnecter » révoque le jeton de l'appareil. « Supprimer mes données »
  (`DELETE /me`) efface le compte et révoque aussi le jeton de liaison chez jobA1.
- Les échecs sont limités comme à la connexion de jobA1 (A-3) et journalisés sans le code ni le
  jeton (J-1, J-2).

**Phase de test.** L'accès est réservé à des testeurs invités : jobA1 n'accorde la connexion qu'aux
comptes que l'exploitant a marqués « testeur Get'emAll ».

## 3. Lecture du suivi jobA1

Get'emAll lit le suivi en direct, sans en garder de copie, sauf l'offre choisie pour
s'entraîner (§4). jobA1 ajoute deux routes en lecture seule, protégées par le jeton de liaison
et soumises à la RLS du compte.

| Route jobA1 | Ce qu'elle rend | Écran |
| --- | --- | --- |
| `GET /api/partenaires/getemall/suivi` | profil complété (%) et ce qui manque ; recherches ORP du mois (faites, objectif, date de remise) **si la case ORP est cochée** ; candidatures (id, poste, entreprise, statut, date d'entretien), 50 au plus | Suivi jobA1, Parcours |
| `GET /api/partenaires/getemall/candidatures/{id}/offre` | titre, entreprise, texte de l'annonce sans les contacts | « S'entraîner pour cet entretien » |

**Les données ORP sont sensibles.** Les compteurs ORP montrent qu'une personne est suivie par
l'ORP, proche des mesures d'aide sociale (nLPD art. 5 let. c ch. 5).

- La page de consentement de jobA1 le dit en clair, avec une case à part pour l'ORP.
- Si la case est refusée, la route ne rend pas ces champs et l'écran Suivi masque la carte ORP.

**Ce qui ne passe jamais** : nom, coordonnées, numéro AVS, l'id du compte jobA1, les noms des
recruteurs notés, les contacts, les CV et lettres, les données ORP au-delà des compteurs du mois
(X-4, X-5, I-1). Le texte de l'annonce passe par `llm/redact.py` avant d'être rendu.

jobA1 rend son statut de candidature tel quel ; l'API Get'emAll le ramène aux trois pastilles
de la maquette (entretien, relance, attente). Réponses servies avec `Cache-Control: no-store`
(X-6). Si jobA1 ne répond pas, l'écran affiche « Suivi indisponible pour l'instant ».

## 4. Base PostgreSQL séparée

La base `getemall` a son serveur, ses rôles et ses sauvegardes, aucune table de jobA1. Chaque
table annonce son niveau (D-1) et, si elle contient des données d'un compte, sa règle RLS (C-1).
Chaque table d'un compte entre dans l'export JSON et dans l'effacement, avec un test (V-2, V-3).

| Table | Contenu | Niveau | Conservation |
| --- | --- | --- | --- |
| `accounts` | identifiant propre à Get'emAll, créé le, dernière activité | Personnelle | jusqu'à suppression |
| `device_tokens` | empreinte du jeton `gea_`, appareil, dernière utilisation, révoqué le | Secret | 90 jours sans usage |
| `joba1_links` | jeton de liaison chiffré (AES-GCM, clé dans un secret), consentement ORP, révoqué le | Secret | jusqu'à révocation |
| `interview_profiles` | avatar, recruteur, langue, objectif XP, rappel, sons, classement, pseudonyme | Personnelle | jusqu'à suppression |
| `target_offers` | id de candidature jobA1 (facultatif), titre, entreprise, texte nettoyé, métier | Personnelle | jusqu'à suppression |
| `path_steps`, `lessons`, `exercises` | route vers le poste, contenu des leçons | Personnelle | avec l'offre |
| `attempts` | réponse, correct, indice utilisé | Personnelle | 12 mois |
| `question_bank` | questions relues par une personne RH, source, statut | Publique | sans limite |
| `interviews`, `interview_answers` | session de 5 questions ; transcription, critères, conseil, réaction | Sensible | 12 mois sans activité |
| `xp_events`, `leagues`, `league_members` | XP, ligue de la semaine | Personnelle | 12 mois |
| `consents` | type (micro, IA, classement), version, accepté le, retiré le | Personnelle | compte + 1 an |
| `ai_calls` | but, modèle, jetons, coût, durée, sans contenu | Personnelle | 12 mois |
| `procrastinate_*` | file des tâches | Technique | purge quotidienne |

**L'offre cible est copiée**, nettoyée, quand la personne choisit de s'entraîner. Elle entre
dans l'export et s'efface avec le compte.

**L'audio n'est jamais en base.** Il passe par un bucket S3 en Suisse :

- le worker l'efface dès la transcription faite ;
- une tâche Procrastinate, toutes les 10 minutes, efface tout audio de plus d'une heure ;
- une règle de cycle de vie d'un jour reste le dernier filet (S3 se compte en jours) ;
- le test « audio absent après 1 h » vise la tâche.

## 5. Analyse des réponses

Principe de `practice.py` (job-bot, docs/75) : **la plateforme tient le compte, l'IA ne fait que
formuler et évaluer**, et sa réponse est un JSON lu comme une entrée non fiable (I-2).

Repris tel quel :

- cinq questions numérotées par la plateforme ; l'état est en base, verrouillé pendant une
  écriture (`with_for_update`) ;
- des repères plutôt qu'une note : « solide » et « à travailler », comme la maquette ;
- la « réponse plus forte » n'invente jamais d'expérience : elle reprend ce que la personne a
  dit et met un repère « [ton exemple] » là où il manque un fait ;
- jamais de question illégale ou intrusive (religion, santé, projet d'enfant, origine) ;
- plafond vérifié avant de commencer, chaque appel compté dans `ai_calls` sans contenu (I-5) ;
- si l'IA échoue, la réponse est gardée et « Réessayer » relance l'étape.

Ce qui change :

| Sujet | jobA1 (docs/75) | Get'emAll |
| --- | --- | --- |
| Questions | inventées d'après les manques du profil | tirées de la banque relue, adaptées à l'offre |
| Relance | une par question au plus | aucune en phase 1 |
| Réponse | écrite | orale (90 s au plus) ou écrite |
| Après chaque réponse | la question suivante | une réaction : expression et phrase, en moins de 6 s |
| Recruteur | sans nom | Lou, Marc, Nadia ou Tom, une consigne par personnage |
| Contexte envoyé | offre, blocs du profil, questions difficiles | offre nettoyée, question, transcription ; aucun bloc du profil jobA1 |

**Deux appels par entretien.**

1. Après chaque réponse, le modèle rapide rend la réaction (`ravi`, `impressionne`,
   `dubitatif`, `decu`), la phrase et un repère par critère : structure, exemples concrets,
   clarté, mots de remplissage. En cas d'échec ou de délai : réaction neutre, analyse relancée en
   tâche de fond.
2. À la fin, le modèle complet rend le conseil et la réponse plus forte de chaque question. Les
   repères par critère du bilan sont calculés par la plateforme, sans IA.

Réponse orale : l'API pose l'audio dans le bucket et crée la tâche ; le worker transcrit avec
Whisper chez Infomaniak, efface l'audio, puis fait l'appel 1. L'app suit `GET /jobs/{id}`.

Consignes versionnées : `recruteur-lou-v1.md` (et Marc, Nadia, Tom), `reaction-v1.md`,
`bilan-v1.md`. Jeu de 30 réponses de référence notées à la main : au moins 25 verdicts justes.

## 6. Le fournisseur d'IA

- Une interface (`ChatModel`) avec deux appels : réaction et bilan. Seul l'adaptateur Anthropic
  connaît le SDK, `cache_control`, ses types et ses noms de modèle. Le reste du code ne parle
  qu'en « rapide » et « complet ».
- L'adaptateur Infomaniak, compatible OpenAI, doit se brancher sans toucher au reste. Un test
  vérifie qu'aucun module hors de l'adaptateur n'importe `anthropic`.
- Pendant la phase de test, les réponses partent aux États-Unis. La page Confidentialité et le
  consentement IA le disent, et l'accès est réservé à des testeurs invités (§2).

## 7. Remplacement des clients fictifs

- Les types de l'app sont générés depuis l'OpenAPI (`openapi-typescript`) ; un test de contrat
  vérifie que les deux restent d'accord.
- Une variable par domaine choisit la version (`EXPO_PUBLIC_API_SUIVI=http`…). Par défaut, tout
  reste fictif ; Jest et Playwright gardent les clients fictifs, un test Playwright de plus
  tourne contre le staging.
- Ordre : connexion et profil, suivi et offres, parcours et leçons, entretien, progrès et
  classement. À la fin, `fake.ts` ne sert plus qu'aux tests et à la démo.

## 8. Ce qui change dans jobA1

PR dans job-bot, avec `docs/140-connexion-getemall.md` et la migration 0074.

| Où | Quoi |
| --- | --- |
| Base | `partner_codes` (empreinte du code, `code_challenge`, adresse de retour, consentement ORP, expire à, utilisé le) et `partner_links` (identifiant propre à Get'emAll, empreinte du jeton `jbg_`, consentement ORP, dernière lecture, révoqué le), avec RLS ; marque « testeur Get'emAll » sur le compte |
| Config | secret client de Get'emAll et liste des adresses de retour, par environnement |
| Serveur | consentement, échange du code (secret client et PKCE), les deux routes de lecture, révocation |
| Interface | page « Autoriser Get'emAll » (case ORP à part), ligne « Connexions » des Réglages, d'après les maquettes de Kevin |
| Confidentialité | Get'emAll ajouté à la page Confidentialité (I-4, V-5) |
| Tests | code brûlé après une lecture, expiré après 60 s, PKCE faux refusé, adresse de retour hors liste refusée, second compte en 404 (C-4), champs ORP absents sans la case, aucune coordonnée rendue, export et suppression |

La base, l'échange et les routes avancent tout de suite ; l'interface attend les maquettes.

## 9. Lots et PR

| Lot | Dépôt | Contenu | Attend |
| --- | --- | --- | --- |
| 1. Socle de l'API | Get-emAll | `api/` : réglages, base et rôles, RLS, Alembic 0001, `/health`, Docker Compose de dév, CI | — |
| 2. Connexion côté jobA1 | job-bot | docs/140, migration 0074, échange, routes de lecture ; puis consentement et Connexions | maquettes pour l'interface |
| 3. Connexion côté Get'emAll | Get-emAll | `/connexion`, cookie web et Bearer mobile, `/me`, export, `DELETE /me` ; client réel de l'entrée ; test en staging | 1, 2 |
| 4. Suivi et offres | Get-emAll | `/joba1/suivi`, `/offres` ; carte ORP masquée sans consentement | 3 |
| 5. Parcours et leçons | Get-emAll | banque de questions et import relu, `/parcours`, `/lecons`, tentatives, indices, XP | 4, premières questions relues |
| 6. Entretien écrit | Get-emAll | `/entretiens`, réponses texte, réaction, bilan, `/jobs` ; consignes v1 et 30 références | 5 |
| 7. Entretien oral | Get-emAll | bucket, Whisper Infomaniak, tâche d'effacement toutes les 10 min, consentement micro | 6, contrat Infomaniak |
| 8. Progrès et classement | Get-emAll | `/progres`, `/classement`, ligues en tâche de fond | 6 |

Le déploiement (Helm, staging, ArgoCD) et l'observabilité feront un plan à part une fois le
lot 3 en place.
