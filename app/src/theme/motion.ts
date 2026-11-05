import { Easing } from 'react-native-reanimated';

/** PROMPT.md « Mouvement ». Avec la réduction des animations : fondus de 150 ms au plus. */
export const motion = {
  fast: 150,
  standard: 250,
  panel: 350,
  expression: 200,
  reducedFade: 150,
  enter: Easing.bezier(0.2, 0.8, 0.2, 1),
} as const;
