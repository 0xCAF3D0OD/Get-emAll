# DESIGN.md — squelette de get'emall

Référence visuelle : la maquette (`docs/maquette/`). Règles : `docs/PROMPT.md` et
`docs/cahier-des-charges-technique.md`. Ce document décrit ce qui est codé dans `app/` et ce
qui reste à dessiner.

## Lancer et vérifier

```bash
cd app
npm install
npx expo start --web        # ou --ios / --android avec Expo Go
npm run typecheck           # TypeScript strict
npm run lint                # ESLint, 0 avertissement
npm run format:check        # Prettier
npm test                    # Jest + React Native Testing Library
npm run e2e                 # Playwright (export web statique, iPhone 13, Chromium)
```

Aucun appel réseau réel : `src/api/fake.ts` implémente les clients typés de `src/api/clients.ts`
avec les données de `src/data/fixtures.ts`. Aucun enregistrement audio n'est conservé.

## Tokens (`src/theme/`)

### Couleurs (`colors.ts`)

Valeurs exactes de la maquette (table « Tokens de design » du PROMPT).

| Groupe                | Tokens                                                                                                                                                                      |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fonds                 | `bg` #FFF7EE, `surface` #FFFFFF, `surfaceMuted` #F6F0E8, `track` #EFE7DC                                                                                                    |
| Bordures              | `border` #EADFD0, `borderStrong` #F1E8DC                                                                                                                                    |
| Texte                 | `ink` #26243B, `inkMuted` #625C70, `white`                                                                                                                                  |
| Primaire              | `primary` #2D4FCB, `primaryDark` #1F3A9E, `primaryLight` #E9EEFF, `primaryRing` #C9D3FF                                                                                     |
| Réussite              | `success` #1E6B3F, `successBg` #DDF1E4, `successFill` #9FD8B5, `successDark` #6FB68D                                                                                        |
| Erreur                | `error` #A3261E, `errorDark` #8C1D18, `errorText` #5C1A15, `errorBg` #FDE7E4                                                                                                |
| Avertissement         | `warningBg` #FFE9B8, `warningText` #6B4500, `hintStroke` #8A5A00                                                                                                            |
| Jeu                   | `streak` #FF9F6B, `streakBg` #FFE6D6, `xp` #FFC94D, `coral` #FF8FA3                                                                                                         |
| Décor                 | `lavender` #B9A6E8, `lavenderBg` #E6DEFA, `peachBg` #FFE3D3                                                                                                                 |
| Ajoutés (décision D)  | `starS` #A9D3F2, `starT` #C9B8EE, `infoBg` #DCEBFA, `streakText` #9A3F0E, `leagueBg` #EDEAF2                                                                                |
| Décidés le 05.11.2026 | `borderDashed` #958A7B (pointillé STAR, 3,2:1 sur bg), `successText` #1E4D31 (explication de réussite), `successShadow` #134A2B, `errorShadow` #5C1A15 (ombres des boutons) |
| Médailles             | `medalGold` #FFC94D, `medalSilver` #D9D4CC, `medalBronze` #E9A777                                                                                                           |

Les contrastes de chaque paire réellement utilisée sont testés (`contrast.test.ts`) :
4,5:1 pour le texte, 3:1 pour les contours et icônes porteuses de sens.

### Typographie (`typography.ts`)

Fredoka pour les titres, Nunito pour le texte. Tailles en px (interligne) :

| Token      | Police      | Taille                                    |
| ---------- | ----------- | ----------------------------------------- |
| `display`  | Fredoka 600 | 26 (32)                                   |
| `h1`       | Fredoka 600 | 24 (30)                                   |
| `h2`       | Fredoka 600 | 22 (28)                                   |
| `h3`       | Fredoka 600 | 19 (24)                                   |
| `h4`       | Fredoka 600 | 18 (24)                                   |
| `bodyL`    | Nunito 400  | 17 (24)                                   |
| `question` | Nunito 700  | 17 (24), questions des exercices          |
| `bubble`   | Nunito 700  | 18 (25), question de la bulle d'entretien |
| `body`     | Nunito 400  | 16 (23)                                   |
| `bodyS`    | Nunito 400  | 15 (21)                                   |
| `caption`  | Nunito 400  | 14 (20)                                   |
| `micro`    | Nunito 400  | 13 (18)                                   |
| `tab`      | Nunito 700  | 12 (16)                                   |
| `overline` | Nunito 800  | 12 (16), majuscules, interlettrage 0,04em |

`AppText` prend `variant`, `weight` (regular, semi, bold, heavy) et `color` (token). Les tailles
ont été mesurées sur les PNG de la maquette (2x) : la maquette utilise souvent une taille de
moins que le texte du PROMPT, et c'est la maquette qui a été suivie.

### Espacements, rayons, ombres, mouvement

- `spacing` (grille de 4) : xs 4, sm 8, md 12, lg 16, xl 20, xxl 24, xxxl 32 ; `screen` 20,
  `cardGap` 12, `touch` 44 (cible minimale), `button` 56, `webMaxWidth` 430.
- `radius` : pill 999, card 24, cardSm 22, step 22, button 18, tile 14, scene 40.
- `shadows` : ombres pleines sans flou (`solidShadow(couleur, décalage)`) ; carte 4 px ;
  bouton 3D 5 px au repos, 1 px au pressé, le bouton descend de 4 px.
- `motion` : fast 150, standard 250, panel 350, expression 200 ms ; courbe
  `bezier(0.2, 0.8, 0.2, 1)`. Avec « réduire les animations », tout devient un fondu de 150 ms
  au plus (`useReducedMotion`).

## Composants (`src/components/`)

Chaque composant a son dossier, son test et des libellés accessibles en français.

| Composant                                         | Rôle                                                                                                          |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `AnswerOption`                                    | Réponse d'un QCM : neutre, sélectionnée, figée, correcte, incorrecte ; annonce « Ta réponse, incorrecte : … » |
| `AppText`                                         | Tout texte de l'app, typographie par token                                                                    |
| `Avatar` (+ `CandidateAvatar`, `RecruiterAvatar`) | Personnage par id et expression ; cadrage `face` ou `full`                                                    |
| `BarChart`                                        | XP de la semaine (7 barres, valeurs au-dessus)                                                                |
| `Button`                                          | Bouton 3D `primary`, `success`, `danger`, `secondary`, `ghost` (lien) ; `compact`, `loading`, `expanded`      |
| `Card`                                            | Carte blanche, bordure et ombre pleine                                                                        |
| `Checkbox`                                        | Case à cocher avec titre et détail (consentements)                                                            |
| `Chip`                                            | Pastille (niveau, statut de candidature)                                                                      |
| `ChoiceCard`                                      | Carte de choix à sélection unique (offre, recruteur, avatar)                                                  |
| `Confetti`                                        | Confettis de réussite (désactivés si animations réduites)                                                     |
| `FeedbackPanel`                                   | Panneau bas de réussite ou d'erreur, montée 350 ms, annoncé au lecteur d'écran                                |
| `IconTile`                                        | Icône sur pastille colorée                                                                                    |
| `LeaderboardRow`                                  | Ligne du classement : médaille, rang, avatar, pseudo, XP, « Toi »                                             |
| `LessonHeader`                                    | Fermer, barre « Exercice n sur total », indices restants                                                      |
| `LevelDots`                                       | Niveau 1 à 3 du recruteur                                                                                     |
| `ListRow`                                         | Ligne de réglage ou de lien avec icône et chevron                                                             |
| `NoteChip`                                        | Note sous la scène (« Ton micro sert seulement… »)                                                            |
| `ProgressBar`                                     | Barre de progression accessible (`progressbar`)                                                               |
| `RecordButton`                                    | Bouton micro 96 px avec halo pendant l'enregistrement                                                         |
| `RouteStep`                                       | Étape du parcours : terminée, en cours, à venir                                                               |
| `Scene`                                           | Bureau illustré de l'entretien (calques, largeur mesurée par `onLayout`)                                      |
| `Screen`                                          | Gabarit d'écran : fond, marges, défilement, pied fixe                                                         |
| `ScreenHeader`                                    | Titre d'écran, retour, sous-titre                                                                             |
| `SectionTitle`                                    | Titre de section avec lien facultatif                                                                         |
| `SegmentedTabs`                                   | Onglets segmentés (classement, réglages)                                                                      |
| `SpeechBubble`                                    | Bulle du recruteur                                                                                            |
| `StarExercise`                                    | Exercice STAR : placer S, T, A, R dans l'ordre                                                                |
| `StatPill`                                        | Pastille série / XP / ligue                                                                                   |
| `StepsHeader`                                     | Points d'étapes de l'entrée                                                                                   |
| `TabBar`                                          | Barre d'onglets du bas                                                                                        |
| `ThinkingDots`                                    | Trois points « réfléchit »                                                                                    |
| `Waveform`                                        | Onde d'enregistrement (décorative, masquée au lecteur d'écran)                                                |

## Écrans et routes (`app/`, Expo Router)

| Route                                         | Écran (maquette)                                  |
| --------------------------------------------- | ------------------------------------------------- |
| `/accueil`, `/offre`, `/recruteur`, `/avatar` | Entrée (01 à 04)                                  |
| `/parcours`                                   | Parcours (07)                                     |
| `/entrainement`                               | Entraînement (08)                                 |
| `/progres`, `/progres/classement`             | Progrès (09), classement (13)                     |
| `/profil`, `/profil/suivi-joba1`              | Profil (10), suivi jobA1 (14)                     |
| `/lecon/[id]`                                 | Leçon : réponse, juste, faux (11, 11b, 12)        |
| `/entretien/micro`                            | Autorisation du micro (05)                        |
| `/entretien/[recruteur]`                      | Entretien simulé (06, 06b)                        |
| `/entretien/bilan`, `/entretien/reecoute`     | Bilan et relecture des réponses                   |
| `/a-dessiner?ecran=…`                         | Écran exigé mais pas encore dessiné (décision B4) |

`?demo=1` sur l'entretien fait défiler les états sans micro (utile pour les captures).

## Machine à états de l'entretien (`src/store/entretien.ts`)

```
question ──parler──▶ enregistrement ──terminerReponse──▶ reflexion ──reagir──▶ reaction
   │                     │                                  ▲                    │
   └──ecrire──▶ ecrit ◀──┘                                  │                    ├─suivante─▶ question (rang + 1)
                  └──────────terminerReponse────────────────┘                    └─suivante─▶ termine (dernière question)
```

- Toute autre transition laisse l'état inchangé (testé dans `entretien.test.ts`).
- Expression du recruteur : question → `neutre`, enregistrement et écrit → `ecoute`,
  réflexion → `reflechit`, réaction → expression de la réaction (`impressionne`, `dubitatif`,
  `decu`, `ravi`…), terminé → `ravi`.
- L'enregistrement s'arrête seul à la durée maximale ; « Répondre par écrit » reste possible.
- `termine` remplace l'écran par `/entretien/bilan`.

## Accessibilité

Cibles de 44 px au moins ; libellé, rôle et état sur chaque élément interactif ; panneaux de
résultat et réactions en zone annoncée (`accessibilityLiveRegion`) ; décor masqué au lecteur
d'écran ; animations réduites respectées ; contrastes testés ; espaces insécables avant
`? ! : ;` et à l'intérieur des guillemets « » pour éviter les retours à la ligne isolés.

## Reste à dessiner : liste des TODO

`grep -rn "TODO(" app src` les retrouve tous dans le code.

### TODO(maquette)

1. Accueil : écran « Se connecter avec jobA1 » (`app/(onboarding)/accueil.tsx`).
2. Offre : champ « Coller une autre offre » et choix du métier pour « Pas d'offre précise »
   (`app/(onboarding)/offre.tsx`, `src/store/profil.ts`).
3. Écrans exigés par le cahier mais non dessinés (B4), servis par `/a-dessiner` : connexion,
   confidentialité et données, choisir un métier, coller une offre, pause, consentements,
   mes amis.
4. Leçon : écran de fin de leçon (retour au parcours en attendant).
5. Leçon : seuls les exercices 3 (choix) et 5 (STAR) sont dessinés ; les autres reprennent ces
   modèles (`src/data/fixtures.ts`). Le retour d'un exercice STAR n'est pas dessiné non plus.
6. Entretien : état « question » avant de parler (gabarit de 06 avec le bouton micro).
7. Entretien : saisie d'une réponse écrite.
8. Entretien : place et texte de la phrase de réaction ; textes provisoires dans les données.
9. Entretien : affichage d'un indice.
10. Entraînement : écran de révision et écran d'un thème (ils réutilisent la leçon).
11. Progrès : « Derniers entretiens » est coupé en bas de la maquette 09.
12. Classement : onglet « Mes amis » et moyen d'ajouter un ami (`src/api/fake.ts`).
13. Classement : « Quitter le classement » est annoncé sur l'écran 13 mais absent du profil.
14. Profil : seule la durée de l'objectif 20 XP (5 min) figure dans la maquette.

### TODO(asset)

1. Voix des recruteurs : aucune voix enregistrée ; « Réécouter » fait relire la question par le
   lecteur d'écran.
2. Avatars : si une image manque, l'avatar affiche l'initiale et avertit en console.
3. Présentations de Tom, Marc et Nadia : textes provisoires, seule celle de Lou est dessinée.

## Teintes de la maquette hors tokens

Tranché le 05.11.2026 : toutes les teintes relevées pendant le squelette ont désormais un token.

| Où                                         | Maquette | Token                                        |
| ------------------------------------------ | -------- | -------------------------------------------- |
| Cases vides de l'exercice STAR (pointillé) | #CFC3B3  | `borderDashed` #958A7B, pour atteindre 3:1   |
| Texte d'explication du panneau de réussite | #1E4D31  | `successText` (le titre reste en `success`)  |
| Ombre du bouton de réussite                | #134A2B  | `successShadow`                              |
| Ombre du bouton d'erreur                   | #5C1A15  | `errorShadow`                                |
| Question dans la bulle de l'entretien      | 18 px    | variante `bubble` (`question` reste à 17 px) |
