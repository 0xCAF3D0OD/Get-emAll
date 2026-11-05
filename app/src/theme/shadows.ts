import type { ViewStyle } from 'react-native';

import { colors } from './colors';

/** Ombres « pleines » : décalage vertical sans flou (boxShadow, iOS, Android et web). */
export const solidShadow = (color: string, offset: number): ViewStyle => ({
  boxShadow: `0px ${offset}px 0px 0px ${color}`,
});

export const shadows = {
  card: solidShadow(colors.border, 4),
  /** Bouton 3D : 5 px au repos, 1 px au pressé (le bouton descend de 4 px). */
  buttonOffset: 5,
  buttonPressedOffset: 1,
  buttonTravel: 4,
} as const;
