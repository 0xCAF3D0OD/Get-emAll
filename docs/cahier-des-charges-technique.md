# Cahier des charges technique : jobA1 Entretien

Nov 5, 2026 · @jacque

## Contexte et objectifs

jobA1 Entretien est une app d'entraînement aux entretiens d'embauche, liée à jobA1 (app.joba1.ch). Elle est d'abord livrée en **application web** pour être testée, puis publiée sur l'App Store et Google Play avec le même code.

- **Objectif produit** : préparer un candidat à un entretien précis, en 5 minutes par jour, avec des exercices courts puis un entretien simulé contre un recruteur dessiné qui réagit.
- **Public** : personnes en recherche d'emploi en Suisse, souvent suivies par un ORP, de tous âges et de tous niveaux numériques. Première cible : métiers de bureau et IT ; autres secteurs plus tard.
- **Lien avec jobA1** : mêmes comptes, offres et candidatures reprises du suivi jobA1, objectifs ORP affichés.
- **Référence visuelle** : la maquette « App entretien jobA1 » (22 écrans, PNG fournis dans `maquette/`) et le prompt de squelette `PROMPT.md`.
- **Mesure du succès de la phase de test** : 5 testeurs terminent l'entrée, une leçon et un entretien sans aide ; taux d'abandon par écran mesuré.

## Périmètre et phases

Le projet avance en trois phases ; seule la phase 1 est engagée, les phases 2 et 3 dépendent des résultats des tests.

| Phase | Livrable | Inclus | Exclu |
| --- | --- | --- | --- |
| 1. Web de test | App web (PWA) sur getthemall.ch | Les 22 écrans de la maquette, IA réelle (voix et analyse), comptes jobA1, métriques, français | Stores, notifications push natives, autres métiers, allemand et anglais |
| 2. Stores | Apps iOS et Android (même code Expo) | Comptes développeur, notifications, publication, suppression de compte dans l'app | Nouveaux contenus |
| 3. Élargissement | Contenus et recruteurs par secteur | Santé, bâtiment, vente, restauration, logistique ; allemand et anglais | Paiement, vidéo |

**Hors périmètre pour toutes les phases** : paiement, messagerie entre utilisateurs, vidéo, animation vectorielle Rive (reportée, les expressions restent des images).

## Architecture générale

Trois services dans le cluster (API, worker, app web statique), une base partagée avec jobA1, et trois services externes.

&#91;embedded content: architecture · app, API, worker, base, stockage, 3 services externes\]

L'API répond vite et délègue tout ce qui est lent (transcription, analyse) au worker ; l'app suit l'avancement de la tâche jusqu'à la réaction du recruteur.

## Stack technique

Un seul langage côté app (TypeScript), une seule base (PostgreSQL), pas de Redis en phase 1.

| Couche | Choix | Raison |
| --- | --- | --- |
| App (web, puis iOS et Android) | Expo (SDK stable), React Native, TypeScript strict, Expo Router | Un code pour 3 plateformes ; export web statique en phase 1 |
| Animations | react-native-reanimated | Fluide, respecte la réduction des animations |
| État et données côté app | zustand + TanStack Query | Cache des appels API, mode hors ligne léger |
| Textes | i18next (fr ; de et en prévus) | Aucun texte en dur |
| Enregistrement audio | expo-audio (web : MediaRecorder) | Micro actif seulement au toucher |
| API | Python 3.12 + FastAPI + Pydantic (à confirmer selon le backend jobA1) | Écosystème IA le plus riche |
| Tâches de fond | Procrastinate (file d'attente dans PostgreSQL) | Pas de Redis à maintenir |
| Base | PostgreSQL 16, schéma `entretien` dans la base jobA1 | Jointures directes avec profil et candidatures |
| Fichiers temporaires | Stockage S3 compatible (bucket en Suisse) | Audio supprimé après transcription |
| Transcription | Whisper via Infomaniak AI Tools | Traité en Suisse, pas de GPU à gérer |
| Analyse des réponses | API Claude pendant la mise au point ; Infomaniak AI Tools (modèle open source) ensuite | Qualité d'abord ; bascule vers la Suisse une fois le produit validé |
| Authentification | « Se connecter avec jobA1 » : code à usage unique échangé contre un jeton Bearer, sur le modèle du jeton de l'extension | Un seul compte |

## Fonctionnalités et écrans

La phase 1 livre les 22 écrans de la maquette, branchés sur de vraies données. Le détail visuel de chaque écran est dans `PROMPT.md`.

| Domaine | Écrans | Comportement attendu |
| --- | --- | --- |
| Entrée | Accueil, choix de l'avatar, de l'offre, du recruteur | Connexion jobA1 ; offres reprises du suivi ou collées (lien ou texte) ; choix enregistrés dans le profil |
| Parcours | Route vers le poste (5 étapes) | Étapes débloquées dans l'ordre ; leçons générées selon l'offre |
| Leçons | Choix de réponse, méthode STAR, retour réussite, retour erreur | 6 exercices par leçon ; XP ; 3 indices par jour, sans vies ; questions ratées remises en révision |
| Entretien | Pré-autorisation micro, entretien (Lou, Marc, Nadia, Tom), réflexion puis réaction, compte-rendu, réécoute | 5 questions ; réponse à l'oral ou par écrit ; analyse IA par critère ; réaction du recruteur sous 6 s |
| Entraînement libre | Révisions, entretien rapide, thèmes, langue | Hors parcours ; langue de l'entretien choisie ici |
| Progrès | Série, XP, compétences, classement | Série de jours ; ligue hebdomadaire sans relégation, pseudonymes, désactivable |
| Profil et jobA1 | Profil, suivi jobA1 | Profil complété à X %, recherches ORP du mois, candidatures ; « S'entraîner pour cet entretien » |

**Gamification retenue** : XP, série de jours, indices, ligues. **Rejetée** : vies, perte de progression, relégation, notifications culpabilisantes.

## Modèle de données PostgreSQL

Toutes les tables vivent dans le schéma `entretien` de la base jobA1 et référencent l'utilisateur jobA1 ; aucune copie du profil ni des candidatures. Migrations versionnées avec Alembic.

| Table | Colonnes principales | Remarque |
| --- | --- | --- |
| `profil_entretien` | user\_id (clé jobA1), avatar, recruteur, offre\_id, langue, objectif\_xp, rappel, sons, classement\_actif, pseudonyme | 1 ligne par utilisateur |
| `offre_cible` | id, user\_id, candidature\_id (jobA1, optionnel), titre, entreprise, texte\_offre, metier | Offre collée ou reprise de jobA1 |
| `etape_parcours` | id, offre\_id, rang (1 à 5), type, statut | Route vers le poste |
| `lecon` / `exercice` | id, etape\_id, type (choix, star), contenu JSON, ordre | Contenu généré ou tiré de la banque |
| `tentative` | id, exercice\_id, user\_id, reponse, correct, indice\_utilise, cree\_le | Base des révisions |
| `question_banque` | id, metier, theme, niveau, langue, enonce, bonnes/mauvaises réponses, explication, source (web, utilisateur, RH), statut (proposée, publiée), valide\_par | Relue par une personne RH |
| `entretien` | id, user\_id, recruteur, offre\_id, statut, debut, fin, score\_global | Une session de 5 questions |
| `reponse_entretien` | id, entretien\_id, rang, question, transcription, duree\_s, criteres JSON, conseil, expression\_reaction | Jamais d'audio stocké |
| `xp_evenement` | id, user\_id, source, points, cree\_le | Somme = XP ; série calculée par jour |
| `ligue` / `ligue_membre` | semaine, niveau ; user\_id, xp\_semaine | Recalcul par tâche de fond |
| `consentement` | user\_id, type (micro, IA, classement), version, accepte\_le | Preuve nLPD |
| `job` | file Procrastinate | Transcription et analyse |

## API

API REST JSON versionnée sous `/api/v1`, décrite en OpenAPI ; les types TypeScript de l'app sont générés depuis ce schéma. Toutes les routes exigent un jeton jobA1 valide.

| Méthode et route | Rôle |
| --- | --- |
| `GET /me` · `PATCH /me` | Profil entretien (avatar, recruteur, langue, réglages) |
| `GET /joba1/suivi` | Profil jobA1 (complétion), recherches ORP du mois, candidatures |
| `POST /offres` | Créer une offre cible (depuis jobA1, lien ou texte) |
| `GET /parcours` | Route vers le poste de l'offre active |
| `GET /lecons/{id}` · `POST /exercices/{id}/tentatives` | Contenu d'une leçon ; envoi d'une réponse, retour correct ou non + explication + XP |
| `POST /indices` | Consommer un indice (3 par jour) |
| `POST /entretiens` | Démarrer un entretien (recruteur, offre) ; renvoie la première question |
| `POST /entretiens/{id}/reponses` | Envoyer une réponse (audio en multipart ou texte) ; renvoie un `job_id` |
| `GET /jobs/{id}` | Suivi : `transcription` puis `analyse` puis `termine` (sondage toutes les 1 s, ou SSE) |
| `GET /entretiens/{id}/bilan` | Compte-rendu par critère, conseil, XP |
| `GET /progres` · \`GET /classement?type=ligue | amis\` |
| `DELETE /me` | Suppression des données entretien (exigée par Apple en phase 2) |

Limites : 60 requêtes par minute par utilisateur ; 10 entretiens et 50 réponses analysées par jour en phase 1, pour plafonner le coût IA.

## Traitement IA

Une réponse orale doit recevoir la réaction du recruteur en moins de 6 secondes ; la pause « il réfléchit » de l'écran couvre ce délai.

1. L'app envoie l'audio (max 90 s, Opus ou AAC) ou le texte.
2. L'API stocke l'audio dans le bucket temporaire et crée une tâche.
3. La tâche transcrit avec Whisper chez Infomaniak (en Suisse), puis **supprime l'audio immédiatement** (règle de cycle de vie du bucket en filet de sécurité : 1 heure).
4. Le texte et l'offre sont envoyés au modèle avec un prompt système par recruteur (ton de Lou, Marc, Nadia, Tom).
5. Le modèle renvoie un JSON validé par schéma : note par critère (structure, exemples concrets, clarté, mots de remplissage), conseil en 1 à 2 phrases, phrase de réaction, expression (`ravi`, `impressionne`, `dubitatif`, `decu`).
6. L'app affiche la réaction et l'expression.

**Génération de contenu** : les questions d'entretien et les exercices sont tirés de la banque relue ; le modèle ne fait que les adapter à l'offre, jamais inventer une « bonne réponse » non relue.

**Règles** :

- Aucune donnée d'identification (nom, adresse, AVS, coordonnées) n'est envoyée au modèle ; l'offre est nettoyée des contacts.
- Fournisseur choisi par configuration (API compatible OpenAI) : API Claude pendant la mise au point du produit ; bascule vers Infomaniak AI Tools quand le produit est validé, si son modèle donne au moins 25 bons verdicts sur les 30 réponses de référence. Ce test utilise le million de crédits gratuits d'Infomaniak (valable un mois, à activer seulement au moment de la comparaison). Contrat de traitement des données signé avec chaque fournisseur ; pas d'entraînement sur les données.
- Chaque appel est journalisé (durée, coût, tokens), sans le contenu.
- En cas d'échec du modèle : réaction neutre de repli et analyse relancée en tâche de fond.

## Sécurité, confidentialité et nLPD

Les données de demandeurs d'emploi sont sensibles : hébergement en Suisse, minimisation et suppression sur demande.

- **Hébergement** : serveurs, base et bucket en Suisse (Infomaniak ou Exoscale). Transcription en Suisse (Infomaniak) ; l'analyse passe par l'API Claude pendant la mise au point, transfert hors de Suisse listé dans la politique de confidentialité, puis bascule vers Infomaniak.
- **Authentification** : pas d'OpenID Connect, jobA1 n'en expose pas. Comme l'app vit sur getthemall.ch, elle ne peut pas lire le cookie de jobA1. Bouton « Se connecter avec jobA1 » : redirection vers jobA1, qui renvoie un code à usage unique (60 s), échangé côté serveur contre un jeton Bearer révocable par appareil, sur le modèle du jeton de l'extension. Même mécanisme sur le web et sur mobile.
- **Transport et stockage** : HTTPS partout (TLS 1.2 minimum, HSTS), base et sauvegardes chiffrées.
- **Minimisation** : pas d'audio conservé, transcriptions supprimées après 12 mois d'inactivité, pseudonymes dans le classement.
- **Consentements** : micro, traitement IA et classement, datés et versionnés ; retrait possible à tout moment.
- **Droits** : export JSON et suppression des données depuis le profil.
- **Documents** : politique de confidentialité, conditions d'utilisation, registre des traitements.
- **Application web** : en-têtes CSP stricts, protection CSRF, validation de toutes les entrées (Pydantic), dépendances scannées en CI.
- **Secrets** : jamais dans le dépôt ; Sealed Secrets ou Vault sur le cluster.

## Accessibilité et exigences qualité

Niveau visé : WCAG 2.2 AA sur le web et sur mobile.

| Exigence | Règle | Vérification |
| --- | --- | --- |
| Contraste texte 4,5:1, composants 3:1 | WCAG 1.4.3, 1.4.11 | Test automatique sur les tokens |
| Statut jamais porté par la couleur seule | WCAG 1.4.1 | Revue des écrans retour, parcours, candidatures |
| Texte agrandi à 200 % sans perte | WCAG 1.4.4 | Test manuel iOS, Android, navigateur |
| Cibles tactiles ≥ 44 px | WCAG 2.5.8, Apple HIG | Lint de composants |
| Pas de glisser-déposer obligatoire | WCAG 2.5.7 | Exercice STAR au toucher |
| Champs avec libellé visible | WCAG 3.3.2 | Revue |
| Réduction des animations respectée | WCAG 2.3.3 | Test avec réglage système actif |
| Lecteurs d'écran | VoiceOver, TalkBack, NVDA | Parcours complet sans voir l'écran |
| Clavier sur le web | WCAG 2.1.1, 2.4.7 | Tout atteignable, focus visible |

**Performance (web)** : premier affichage < 2,5 s en 4G (LCP), bundle initial < 500 Ko compressé, images en WebP. **Compatibilité** : Safari iOS 16+, Chrome Android 110+, Chrome, Firefox et Edge de bureau récents.

## Infrastructure, CI/CD et observabilité

Tout tourne en conteneurs sur un cluster Kubernetes en Suisse, déployé en GitOps. C'est volontairement plus robuste que jobA1 (un VPS en Docker Compose) ; jobA1 migrera vers cette infrastructure si le nombre de clients le justifie.

- **Environnements** : `dev` (local, Docker Compose), `staging` (staging.getthemall.ch), `prod` (getthemall.ch, API sur api.getthemall.ch).
- **Déploiement** : images Docker (app web statique servie par nginx, API, worker) ; chart Helm ; ArgoCD synchronise depuis le dépôt de config.
- **CI GitHub Actions** à chaque pull request : typage, lint, tests unitaires, tests d'accessibilité, scan des dépendances et de l'image, build, déploiement automatique en staging.
- **Phase 2** : EAS Build et EAS Submit pour les stores, EAS Update pour les correctifs sans nouvelle validation.
- **Sauvegardes** : PostgreSQL quotidien + journaux en continu, rétention 30 jours, test de restauration mensuel.

**Observabilité**

| Quoi | Outil | Indicateurs |
| --- | --- | --- |
| Erreurs app et API | Sentry | Taux de crash, erreurs par version |
| Métriques serveur | Prometheus + Grafana | Latence p95 API < 300 ms (hors IA), délai réponse → réaction < 6 s, taille de file, coût IA par jour |
| Journaux | Loki | JSON structurés, sans contenu de réponse |
| Usage produit | PostHog hébergé en Suisse, sans cookies tiers | Entonnoir d'entrée, leçons terminées, entretiens terminés, abandon par écran, rétention J1, J7 |
| Alertes | Alertmanager | API en erreur > 2 %, file bloquée > 5 min, coût IA > plafond journalier |

## Tests et critères d'acceptation

La phase 1 est acceptée quand toutes les cases ci-dessous sont cochées.

**Tests automatiques**

- App : Jest + Testing Library (rendu et accessibilité de chaque composant), Playwright sur le web pour les 3 parcours critiques.
- API : pytest, couverture ≥ 80 % sur la logique métier, tests de contrat contre le schéma OpenAPI.
- IA : jeu de 30 réponses de référence notées à la main ; l'analyse doit donner le même verdict sur au moins 25.

**Critères d'acceptation**

- [ ] Connexion avec un compte jobA1 et reprise d'une candidature
- [ ] Entrée complète : avatar, offre, recruteur
- [ ] Une leçon de 6 exercices avec retours réussite et erreur
- [ ] Un entretien de 5 questions à l'oral et à l'écrit, réaction en moins de 6 s dans 95 % des cas
- [ ] Compte-rendu et réécoute corrects
- [ ] Audio absent du stockage 1 heure après la réponse (vérifié par test)
- [ ] Export et suppression des données fonctionnels
- [ ] Audit WCAG 2.2 AA sans défaut bloquant
- [ ] Tableaux Grafana et PostHog en place
- [ ] Test avec 5 personnes en recherche d'emploi, comptes-rendus et corrections faites

## Jalons

La phase 1 tient en 13 semaines, du 16 novembre 2026 au 13 février 2027 ; la décision de passer aux stores se prend sur le résultat du test.

&#91;embedded content: jalons · phase 1 du 16 novembre au 13 février, puis stores\]

Chaque jalon se termine par une démo en staging. La décision phase 2 se base sur les critères d'acceptation ci-dessus ; ces dates sont une proposition à ajuster.

## Risques et questions ouvertes

| Risque | Impact | Parade |
| --- | --- | --- |
| Analyse IA jugée injuste ou fausse | Perte de confiance, abandon | Banque relue par une personne RH, jeu de référence, signalement « avis contesté » |
| Coût IA qui dérape | Budget | Plafonds par utilisateur et par jour, alertes, modèle plus léger pour les exercices |
| Micro sur le web (Safari iOS) | Entretien oral impossible | Réponse écrite toujours proposée, test précoce sur Safari |
| Délai de réaction > 6 s | Expérience cassée | Pause « réfléchit », réponse en flux, repli neutre |
| Ressemblance visuelle avec Duolingo | Image, droits | Route vers le poste, style Headspace propre, pas d'élément de leur marque |
| Contenu limité aux métiers IT et bureau | Public restreint | Phase 3 par secteur |

**Questions ouvertes**

- [ ] Langage du backend jobA1 : Python confirmé, ou passer l'API en TypeScript ?
- [ ] jobA1 n'expose pas d'OpenID Connect (vérifié dans job-bot) : session cookie en phase 1, jeton « app » en phase 2.
- [ ] Quand basculer l'analyse de Claude vers Infomaniak : une fois le produit validé, si son modèle atteint 25 bons verdicts sur 30.
- [ ] Banque de questions : départ avec des questions fréquentes et témoignages trouvés en ligne (reformulés, source notée), enrichie ensuite par les questions et témoignages des utilisateurs. Relecture par une personne RH ou ORP encore à trouver.
- [ ] Domaine : getthemall.ch (acheté).
