import type { TextStyle } from 'react-native';

/** Familles chargées dans app/_layout.tsx (@expo-google-fonts). */
export const fonts = {
  title: 'Fredoka_600SemiBold',
  titleMedium: 'Fredoka_500Medium',
  body: 'Nunito_400Regular',
  bodySemi: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_700Bold',
  bodyHeavy: 'Nunito_800ExtraBold',
} as const;

type Style = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'textTransform'
>;

/** Tailles / interlignes en px, PROMPT.md « Typographie ». */
export const typography = {
  display: { fontFamily: fonts.title, fontSize: 26, lineHeight: 32 },
  h1: { fontFamily: fonts.title, fontSize: 24, lineHeight: 30 },
  h2: { fontFamily: fonts.title, fontSize: 22, lineHeight: 28 },
  h3: { fontFamily: fonts.title, fontSize: 19, lineHeight: 24 },
  h4: { fontFamily: fonts.title, fontSize: 18, lineHeight: 24 },
  bodyL: { fontFamily: fonts.body, fontSize: 17, lineHeight: 24 },
  question: { fontFamily: fonts.bodyBold, fontSize: 17, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 23 },
  bodyS: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21 },
  caption: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  micro: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  tab: { fontFamily: fonts.bodyBold, fontSize: 12, lineHeight: 16 },
  /** Sur-titre d'étape : Nunito 800, 12 px, majuscules, interlettrage 0.04em. */
  overline: {
    fontFamily: fonts.bodyHeavy,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 12 * 0.04,
    textTransform: 'uppercase',
  },
} satisfies Record<string, Style>;

export type TypographyToken = keyof typeof typography;
