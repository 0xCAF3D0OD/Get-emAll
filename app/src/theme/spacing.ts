/** Grille de 4 px. */
export const space = (n: number) => n * 4;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  /** Marge latérale de tous les écrans. */
  screen: 20,
  /** Espace entre cartes (12 à 16). */
  cardGap: 12,
  /** Cible tactile minimale (Apple HIG, WCAG 2.5.8). */
  touch: 44,
  /** Hauteur des boutons principaux (52 à 56). */
  button: 56,
  /** Largeur maximale de l'app sur le web. */
  webMaxWidth: 430,
} as const;
