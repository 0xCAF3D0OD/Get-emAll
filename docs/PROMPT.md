# Mission

Tu construis le **squelette design** de « jobA1 Entretien », une app mobile d'entraînement aux entretiens d'embauche, liée à la plateforme jobA1 (app.joba1.ch). L'utilisateur fait de courts exercices (choix de réponse, méthode STAR), puis passe un entretien simulé avec un recruteur dessiné qui réagit avec des expressions.

Le squelette = **navigation complète, système de design, composants et tous les écrans avec des données fictives**. Pas de backend, pas d'IA, pas d'enregistrement audio réel : tout est simulé avec des données locales typées, prêtes à être remplacées par des appels API.

La maquette de référence fait foi pour les couleurs, tailles, textes et dispositions : elle est dans `maquette/` (une image PNG par écran, 390 × 844 en @2x, nommée comme les écrans de ce document, par exemple `01-parcours.png`, `06b-entretien-reflexion.png`). Copie `maquette/` dans `docs/maquette/` et `assets/` tel quel à la racine du projet. Ouvre l'image de chaque écran avant de le coder. En cas de doute, applique les règles de ce document dans cet ordre : accessibilité (WCAG 2.2 AA), puis Apple HIG / Material 3, puis cohérence visuelle.

# Méthode de travail

1. Lis tout ce document. Pose-moi tes questions bloquantes **avant** d'écrire du code, en une seule liste.
2. Propose un plan en étapes (tokens, composants, navigation, écrans par lot). Attends ma validation.
3. Avance étape par étape, un commit par étape, message de commit clair en français.
4. Après chaque lot d'écrans : `npx tsc --noEmit`, lint et tests doivent passer, puis donne-moi la commande pour voir le résultat.
5. N'invente pas de fonctionnalité absente de ce document. Si quelque chose manque, mets un `TODO(maquette)` et signale-le.

# Stack imposée

- Expo SDK (dernière version stable), **TypeScript strict**, **Expo Router** (routes par fichiers).
- `react-native-reanimated` pour les animations, `react-native-svg` pour les icônes, `expo-image` pour les images.
- Polices via `@expo-google-fonts/fredoka` (500, 600) et `@expo-google-fonts/nunito` (400, 600, 700, 800), chargées avant l'affichage (splash screen maintenu).
- `expo-haptics` pour le retour haptique (réussite, erreur), désactivable dans les réglages.
- État : `zustand` (un store par domaine : profil, parcours, entretien, réglages).
- Textes : `i18next` + `react-i18next`, **français uniquement pour l'instant**, mais **aucun texte en dur** dans les composants (clés dans `src/i18n/fr.json`). Prévoir `de` et `en` vides.
- Qualité : ESLint + Prettier, Jest + `@testing-library/react-native`.
- Doit aussi tourner sur le web via `npx expo start --web` (même rendu, largeur max 430 px centrée).

# Arborescence attendue

```
app/
  _layout.tsx                 polices, thème, providers
  index.tsx                   redirige vers (onboarding) ou (tabs)
  (onboarding)/accueil.tsx
  (onboarding)/avatar.tsx
  (onboarding)/offre.tsx
  (onboarding)/recruteur.tsx
  (tabs)/_layout.tsx          barre d'onglets
  (tabs)/parcours.tsx
  (tabs)/entrainement.tsx
  (tabs)/progres.tsx
  (tabs)/profil.tsx
  lecon/[id].tsx              enchaîne exercices + retours
  entretien/micro.tsx         écran de pré-autorisation micro
  entretien/[recruteur].tsx   entretien simulé
  entretien/bilan.tsx
  entretien/reecoute.tsx
  classement.tsx
  suivi-joba1.tsx
src/
  theme/ (colors.ts, typography.ts, spacing.ts, radius.ts, shadows.ts, motion.ts, index.ts)
  components/ (un dossier par composant, avec son test)
  characters/ (registre des personnages et expressions)
  data/ (données fictives typées)
  store/
  i18n/
  types/
assets/
  characters/ scenes/ avatars/ icons/
```

# Tokens de design (valeurs exactes)

## Couleurs
| Token | Hex | Usage |
|---|---|---|
| `bg` | #FFF7EE | fond de tous les écrans |
| `surface` | #FFFFFF | cartes, pastilles, barre d'onglets |
| `surfaceMuted` | #F6F0E8 | pastille « à venir », séparateurs |
| `track` | #EFE7DC | fond des barres de progression |
| `border` | #EADFD0 | bordures, ombres de carte |
| `borderStrong` | #F1E8DC | bordure de la barre d'onglets, fond des segments |
| `ink` | #26243B | texte principal |
| `inkMuted` | #625C70 | texte secondaire (contraste AA vérifié sur bg) |
| `primary` | #2D4FCB | boutons, liens, étape en cours |
| `primaryDark` | #1F3A9E | ombre des boutons, texte sur primaryLight |
| `primaryLight` | #E9EEFF | sélection, onglet actif, anneau de focus |
| `primaryRing` | #C9D3FF | halo de sélection |
| `success` | #1E6B3F | texte et coche de réussite |
| `successBg` | #DDF1E4 | panneau de réussite, pastille « faite » |
| `successFill` | #9FD8B5 | étape terminée |
| `successDark` | #6FB68D | ombre, progression ORP |
| `error` | #A3261E | bordure et croix de mauvaise réponse |
| `errorDark` | #8C1D18 | titre et bouton du panneau d'erreur |
| `errorText` | #5C1A15 | texte du panneau d'erreur |
| `errorBg` | #FDE7E4 | panneau et carte d'erreur |
| `warningBg` | #FFE9B8 | pastille « relance », ampoule d'indice |
| `warningText` | #6B4500 | texte sur warningBg |
| `hintStroke` | #8A5A00 | contour de l'ampoule |
| `streak` | #FF9F6B | flamme de série |
| `streakBg` | #FFE6D6 | carte de série |
| `xp` | #FFC94D | éclair XP, médaille or |
| `lavender` | #B9A6E8 | décor |
| `lavenderBg` | #E6DEFA | fond avatar de Lou |
| `peachBg` | #FFE3D3 | fond avatar du candidat |
| `coral` | #FF8FA3 | confettis |

Vérifie par un test automatique que chaque paire texte/fond utilisée a un contraste ≥ 4,5:1 (texte normal) ou ≥ 3:1 (texte ≥ 18,66 px gras, icônes, bordures de composants), WCAG 1.4.3 et 1.4.11.

## Typographie
- Titres : Fredoka 600. `display` 26/32, `h1` 24/30, `h2` 22/28, `h3` 19/24, `h4` 18/24.
- Texte : Nunito. `bodyL` 17/24 (700 pour les questions), `body` 16/23, `bodyS` 15/21, `caption` 14/20, `micro` 13/18, `tab` 12/16.
- Sur-titres d'étape : Nunito 800, 12 px, majuscules, interlettrage 0.04em, couleur inkMuted.
- Respecter la taille de police système (Dynamic Type) : `allowFontScaling` actif, mises en page qui s'agrandissent sans couper le texte jusqu'à 200 % (WCAG 1.4.4).

## Espacements, rayons, ombres
- Grille de 4 px. Marges latérales d'écran : 20 px. Espace entre cartes : 12 à 16 px.
- Rayons : pastille 999, carte 22 à 24, bouton 18, carte d'étape 22, tuile d'icône 14, avatar rond.
- Ombre « bouton 3D » : décalage vertical 5 px, sans flou, couleur foncée du bouton (ex. primary → primaryDark). Au pressé : le bouton descend de 4 px et l'ombre passe à 1 px.
- Ombre de carte : décalage vertical 4 px, sans flou, couleur `border`.

## Cibles tactiles
Toute zone touchable fait **au moins 44 × 44 pt** (Apple HIG, WCAG 2.5.8). Boutons principaux : hauteur 52 à 56.

## Mouvement (`motion.ts`)
- Durées : rapide 150 ms, standard 250 ms, entrée de panneau 350 ms. Courbe d'entrée `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- **Toutes** les animations respectent `AccessibilityInfo.isReduceMotionEnabled` : si actif, pas de mouvement, seulement des fondus de 150 ms au maximum (WCAG 2.3.3).

# Personnages et assets

## Fichiers (je te les fournis, en PNG transparents de 600 px de haut)
```
assets/characters/{lou|marc|nadia|tom}/{neutre|ecoute|reflechit|ravi|dubitatif|impressionne|decu}.png
assets/avatars/avatar-01.png … avatar-11.png
assets/avatars/avatar-01-{fier|nerveux|concentre}.png
assets/scenes/{lou|marc|nadia|tom}.jpg     décor 1086 × 1448
assets/scenes/bureau.png                   bureau transparent, format 3:1
```
Si un fichier manque, affiche un rond de la couleur du personnage avec son initiale, et logue un `TODO(asset)`.

## Registre `src/characters/registry.ts`
- Recruteurs : `lou` (Recruteuse RH, bienveillante, Facile), `tom` (Fondateur de start-up, décontracté, Moyen), `marc` (Manager technique, précis, Moyen), `nadia` (RH senior, exigeante, Difficile). Chaque recruteur a : nom, rôle, niveau, couleur de fond d'avatar, décor, hauteur d'affichage dans la scène (Lou 270, Marc 250, Nadia 290, Tom 285) et une phrase de présentation.
- Type `Expression = 'neutre' | 'ecoute' | 'reflechit' | 'ravi' | 'dubitatif' | 'impressionne' | 'decu'`.
- Avatars : 11 entrées avec un `alt` descriptif (ex. « Avatar pêche, cheveux bouclés », « Avatar avec foulard », « Avatar en tenue de chantier »).

## Composant `Avatar`
Rond, fond coloré, l'image est agrandie et décalée pour cadrer **le visage** (pas le corps entier). Tailles 40, 44, 56, 80. Paramètres de cadrage par personnage dans le registre.

## Composant `Scene`
Trois calques superposés dans une zone de 392 px de haut à coins inférieurs arrondis (40 px) :
1. décor en `cover`, décalé vers le haut de 78 px ;
2. personnage centré, bas à 40 px du bas de la zone ;
3. bureau en pleine largeur, collé en bas, qui cache les jambes.
Transition d'expression : fondu enchaîné de 200 ms entre deux images.

# Composants à créer (avec test et états)

- `Button` : variantes `primary`, `success`, `danger`, `secondary` (fond blanc, bordure), `ghost` (lien). États : normal, pressé, désactivé, chargement. Toujours un libellé texte.
- `StatPill` : icône + valeur + unité, une seule ligne (`numberOfLines={1}`), largeur adaptée au contenu. Trois pastilles en haut du Parcours : série (« 12 jours »), XP (« 20 / 30 XP »), indices (« 3 indices »).
- `Card`, `ListRow` (avec chevron), `SectionTitle`.
- `Chip` : `done` (coche verte), `now` (primaire), `next` (neutre), `status` (couleurs passées en props).
- `ProgressBar` : `accessibilityRole="progressbar"` avec min, max, valeur et libellé.
- `SegmentedTabs` : rôle tablist, onglet sélectionné annoncé.
- `RouteStep` : marqueur carré arrondi 44 px (terminé : vert avec coche ; en cours : primaire avec halo de 6 px ; verrouillé : gris), titre, sous-titre, statut écrit en toutes lettres (« terminée », « en cours », « verrouillée »), avatar optionnel à droite, contenu dépliable pour l'étape en cours.
- `AnswerOption` : états neutre, sélectionnée, correcte (bordure verte + coche), incorrecte (fond errorBg, bordure error + croix). **Jamais la couleur seule** : icône + texte caché pour lecteur d'écran (« Ta réponse, incorrecte : … »), WCAG 1.4.1.
- `FeedbackPanel` : variantes `success` et `error`, avec avatar du recruteur (expression `impressionne` ou `decu`), titre avec icône, explication, bouton. Région `accessibilityLiveRegion="polite"`.
- `Confetti` : 8 rectangles de couleurs de la palette, une seule fois, 1,1 s, désactivé si réduction des animations.
- `ThinkingDots` : trois points qui pulsent (1,2 s en boucle), désactivés si réduction des animations.
- `TabBar` : 4 onglets (Parcours, Entraînement, Progrès, Profil), icône + libellé toujours visibles, onglet actif sur fond primaryLight, hauteur de zone 56.
- `LeaderboardRow` : rang (médailles or #FFC94D, argent #D9D4CC, bronze #E9A777 pour 1 à 3), avatar, pseudonyme, XP ; ligne de l'utilisateur surlignée et annoncée comme « toi ».
- `ScreenHeader` : bouton retour 44 px avec libellé accessible, titre, sous-titre optionnel.

# Écrans (route, contenu, comportement)

## Entrée (onboarding)
1. **Accueil** `/(onboarding)/accueil` : illustration des 4 recruteurs, titre « Entraîne-toi aux entretiens, 5 minutes par jour », texte « Des questions courtes adaptées à ton offre, puis un vrai entretien avec un recruteur. », bouton « Commencer » → Avatar, lien « J'ai déjà un compte ».
2. **Choix de l'avatar** `/(onboarding)/avatar` : indicateur « Étape 1 sur 3 », titre « Choisis ton personnage », texte « Il te représente pendant les entretiens. Tu pourras le changer dans ton profil. », grille 4 colonnes des 11 avatars (groupe radio accessible, sélection = bordure primaire + fond primaryLight + halo), bouton « Continuer ».
3. **Choix de l'offre** `/(onboarding)/offre` : « Étape 2 sur 3 », titre « Pour quel poste tu t'entraînes ? », offres venant du suivi jobA1 (cartes sélectionnables), séparateur « Ou », champ « Coller une autre offre » (lien ou texte, avec libellé visible, WCAG 3.3.2), lien « Pas d'offre précise ? Choisir un métier à la place », mention « L'offre sert seulement à préparer tes questions. Tes coordonnées ne sont jamais envoyées à l'IA. », bouton « Continuer ».
4. **Choix du recruteur** `/(onboarding)/recruteur` : « Étape 3 sur 3 », titre « Qui te fait passer l'entretien ? », sous-titre « Tu pourras en changer à tout moment. », 4 cartes sélectionnables (avatar, nom, rôle, niveau en texte + pictogramme), phrase de présentation du recruteur choisi, bouton « Commencer ma première leçon ».

## Onglets
5. **Parcours** `/(tabs)/parcours` : 3 `StatPill` ; carte « Tu t'entraînes pour l'offre [Poste] chez [Entreprise] » avec lien « Changer » ; titre « Ta route vers le poste » + « Étape 2 sur 5 » ; liste ordonnée de 5 `RouteStep` reliés par une ligne verticale :
   1. Candidature envoyée (terminée) ;
   2. Appel du recruteur (en cours) : 4 leçons en `Chip` (Ton pitch ✓, Ton parcours ✓, Tes points forts = en cours, Tes questions = à venir) + bouton « Continuer · Tes points forts » → leçon ; avatar de l'utilisateur ;
   3. Entretien RH avec Lou (verrouillée), avatar Lou ;
   4. Entretien technique avec Marc (verrouillée), avatar Marc ;
   5. L'offre : négocier ton salaire et tes conditions (verrouillée).
   **Pas de chemin en zigzag ni de boutons ronds façon Duolingo** : c'est volontaire.
6. **Entraînement** `/(tabs)/entrainement` : carte « Révisions · 6 questions que tu avais ratées », carte « Entretien rapide avec Lou · 3 questions · 5 min », grille « Par thème » (Questions pièges, Méthode STAR, Questions techniques, Négocier son salaire · marché suisse), choix de la langue de l'entretien (Français, Deutsch, English) en `SegmentedTabs`.
7. **Progrès** `/(tabs)/progres` : carte de série avec l'avatar en expression `fier`, 3 chiffres (XP de la semaine, leçons, entretiens), ligne « Classement de la semaine · Tu es 4e en ligue Argent » → Classement, graphique « XP par jour » (barres, avec une description textuelle complète pour le lecteur d'écran), compétences avec barres, derniers entretiens.
8. **Profil** `/(tabs)/profil` : avatar 80 + prénom + « Changer d'avatar » → écran avatar, section « Mon entraînement » (recruteur, offre visée, liens « Changer »), objectif quotidien, rappels et réglages (rappel quotidien, sons et vibrations, quitter le classement), liens « Confidentialité et données » et « Mon suivi jobA1 ».

## Leçon `/lecon/[id]`
9. **Exercice à choix** : en-tête avec fermer (44 px), barre de progression « 3/6 », indices restants (ampoule + nombre, **pas de vies ni de cœurs**) ; consigne « Choisis la réponse la plus convaincante » ; question ; 3 `AnswerOption` ; boutons « Passer » et « Vérifier » (désactivé tant que rien n'est choisi).
10. **Retour réussite** : réponses figées, `FeedbackPanel success` qui monte du bas (350 ms), coche qui apparaît en rebond, avatar du recruteur `impressionne` qui sautille, confettis une fois, haptique « success », titre « Juste ! », badge « 3 d'affilée · +5 XP », explication, bouton « Continuer ».
11. **Retour erreur** : réponse choisie en `incorrect`, bonne réponse en `correct`, `FeedbackPanel error` avec avatar `decu`, titre « Pas tout à fait », explication, mention « Cette question reviendra plus tard dans ta révision. », bouton « Compris ». Haptique « warning ». **Aucune animation festive**, juste l'entrée du panneau.
12. **Exercice méthode STAR** : « Remets ta réponse dans l'ordre », 4 cases S, T, A, R, morceaux à toucher pour les placer (pas de glisser-déposer obligatoire, WCAG 2.5.7), bouton « Vérifier ».

## Entretien
13. **Pré-autorisation micro** `/entretien/micro` : avatar Lou `ecoute`, titre « Lou va écouter ta réponse », 3 points (micro actif seulement au toucher ; audio transformé en texte puis supprimé ; possibilité de répondre par écrit), **un seul bouton « Continuer »** qui déclenche ensuite la demande système (Apple HIG).
14. **Entretien** `/entretien/[recruteur]` : `Scene` avec le recruteur ; en haut fermer, « Question 2 sur 5 », pause ; bulle « Lou demande » + question + bouton réécouter ; zone de réponse. Machine à états explicite :
    - `question` : expression `neutre` ;
    - `enregistrement` : expression `ecoute`, onde animée, minuteur « 0:42 sur 1:30 », grand bouton stop (96 px), liens « Répondre par écrit » et « Un indice » ;
    - `reflexion` : expression `reflechit` pendant 1,5 s, texte « Lou réfléchit » + `ThinkingDots`, rappel de ta réponse ;
    - `reaction` : expression selon le résultat (`ravi`, `impressionne`, `dubitatif` ou `decu`), petit saut du personnage, phrase de réaction, bouton « Question suivante ».
    Fournis un mode démo qui enchaîne ces états avec des données fictives.
15. **Compte-rendu** `/entretien/bilan` : avatar du recruteur `ravi`, « Entretien terminé ! », 3 chiffres (+40 XP, 5/5 questions, 6 min), évaluation par critère avec statut écrit (Solide / À travailler), « Le conseil de Lou », boutons « Continuer » et « Réécouter mes réponses ».
16. **Réécoute** `/entretien/reecoute` : liste des questions avec extrait de ta réponse et « Une réponse plus forte » dépliable (bouton avec `aria-expanded` équivalent).

## Autres
17. **Classement** `/classement` : onglets « Ma ligue » / « Mes amis », carte « Ligue Argent · se termine dans 3 jours · personne ne descend », liste ordonnée de 6 lignes avec séparateur « Les 5 premiers montent en ligue Or », ligne de l'utilisateur « Toi · visible comme « Pêche 27 » », mention « Ton nom n'est jamais affiché. Tu peux quitter le classement dans ton profil. ». **Pas de relégation, pas de pression** : public en recherche d'emploi.
18. **Suivi jobA1** `/suivi-joba1` : en-tête « Mon suivi jobA1 » + « Synchronisé avec app.joba1.ch · il y a 5 min » ; carte profil (80 % complet, ce qui manque, lien externe « Compléter sur jobA1 » annoncé comme ouvrant jobA1) ; carte « Recherches ORP de novembre · 6 sur 10 » ; liste des candidatures avec statut en `Chip` (Entretien, Relance conseillée, En attente) ; la candidature avec entretien prévu affiche « S'entraîner pour cet entretien » → Parcours avec cette offre.
    Crée une interface `JobA1Client` (méthodes `getProfile`, `getOrpProgress`, `getApplications`) avec une implémentation fictive. Aucune vraie requête réseau.

# Accessibilité (critères de validation)

- Chaque élément touchable a `accessibilityRole` et `accessibilityLabel` ; les images décoratives sont ignorées, les personnages ont un texte qui dit **qui** et **quelle émotion**.
- Ordre de lecture logique, titres marqués comme `header`.
- Le statut n'est jamais porté par la couleur seule (WCAG 1.4.1).
- Contraste vérifié par test (voir tokens).
- Fonctionne avec VoiceOver et TalkBack, et avec un texte agrandi à 200 %.
- Réduction des animations respectée partout.

# Données fictives

`src/data/` : utilisateur (prénom « Kevin », avatar-01, série 12 jours, record 15, XP semaine 180), offre « [Poste visé] chez [Entreprise] », leçons, questions et réponses de l'exercice « Quels sont vos principaux points forts pour ce poste ? », exercice STAR (déploiements de 2 h, pipeline GitLab CI, 10 minutes par déploiement), questions d'entretien de Lou, Marc, Nadia et Tom, classement, suivi jobA1. Tout est typé dans `src/types/`.

# Définition de « terminé »

- Tous les écrans ci-dessus existent et sont reliés par la navigation décrite.
- `tsc`, lint et tests passent ; chaque composant a au moins un test de rendu et un test d'accessibilité (rôle et libellé).
- L'app tourne sur iOS, Android (Expo Go) et web.
- Un fichier `DESIGN.md` documente les tokens, les composants et la machine à états de l'entretien.
- Une liste finale des `TODO(maquette)` et `TODO(asset)` restants.
