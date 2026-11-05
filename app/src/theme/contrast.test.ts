import { colors } from './colors';
import { contrastRatio } from './contrast';

/**
 * Paires texte/fond et éléments graphiques réellement utilisés dans l'app.
 * Texte normal : 4,5:1 (WCAG 1.4.3). Texte ≥ 18,66 px gras, icônes porteuses de sens,
 * contours de composants : 3:1 (WCAG 1.4.3 et 1.4.11).
 * Les icônes toujours accompagnées d'un texte (flamme, éclair, médailles, étape terminée)
 * ne sont pas soumises à 1.4.11 et ne figurent pas ici.
 */
const texte: [string, keyof typeof colors, keyof typeof colors][] = [
  ['texte principal sur le fond', 'ink', 'bg'],
  ['texte principal sur une carte', 'ink', 'surface'],
  ['texte secondaire sur le fond', 'inkMuted', 'bg'],
  ['texte secondaire sur une carte', 'inkMuted', 'surface'],
  ['texte secondaire sur pastille à venir', 'inkMuted', 'surfaceMuted'],
  ['libellé blanc sur bouton primaire', 'white', 'primary'],
  ['libellé blanc sur bouton réussite', 'white', 'success'],
  ['libellé blanc sur bouton erreur', 'white', 'errorDark'],
  ['lien sur le fond', 'primary', 'bg'],
  ['lien sur une carte', 'primary', 'surface'],
  ['onglet actif', 'primary', 'primaryLight'],
  ['texte sur sélection', 'primaryDark', 'primaryLight'],
  ['texte de réussite sur panneau', 'success', 'successBg'],
  ['texte de réussite sur le fond', 'success', 'bg'],
  ['texte de réussite sur une carte', 'success', 'surface'],
  ['titre du panneau d’erreur', 'errorDark', 'errorBg'],
  ['texte du panneau d’erreur', 'errorText', 'errorBg'],
  ['pastille relance', 'warningText', 'warningBg'],
  ['texte de série et « À travailler »', 'streakText', 'streakBg'],
  ['case S de STAR', 'ink', 'starS'],
  ['case T de STAR', 'ink', 'starT'],
  ['case A de STAR', 'ink', 'xp'],
  ['case R de STAR', 'ink', 'successFill'],
  ['rang sur médaille or', 'ink', 'medalGold'],
  ['rang sur médaille argent', 'ink', 'medalSilver'],
  ['rang sur médaille bronze', 'ink', 'medalBronze'],
  ['tuile questions techniques', 'inkMuted', 'infoBg'],
  ['tuile questions pièges', 'inkMuted', 'warningBg'],
  ['tuile méthode STAR', 'inkMuted', 'lavenderBg'],
  ['tuile salaire', 'inkMuted', 'successBg'],
  ['texte sur fond de ligue', 'inkMuted', 'leagueBg'],
  ['texte sur fond pêche', 'ink', 'peachBg'],
];

const graphique: [string, keyof typeof colors, keyof typeof colors][] = [
  ['bordure de réponse incorrecte', 'error', 'errorBg'],
  ['bordure de réponse correcte', 'success', 'surface'],
  ['bordure de sélection', 'primary', 'primaryLight'],
  ['contour des boutons radio', 'inkMuted', 'surface'],
  ['contour de l’ampoule d’indice', 'hintStroke', 'bg'],
  ['remplissage des barres de progression', 'primary', 'track'],
  ['anneau de focus', 'primary', 'bg'],
];

describe('contrastes des tokens', () => {
  test.each(texte)('%s ≥ 4,5:1', (_nom, avant, fond) => {
    expect(contrastRatio(colors[avant], colors[fond])).toBeGreaterThanOrEqual(4.5);
  });
  test.each(graphique)('%s ≥ 3:1', (_nom, avant, fond) => {
    expect(contrastRatio(colors[avant], colors[fond])).toBeGreaterThanOrEqual(3);
  });
});
