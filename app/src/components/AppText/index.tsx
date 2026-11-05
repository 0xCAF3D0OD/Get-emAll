import { Text, type TextProps } from 'react-native';

import { colors, typography, type ColorToken, type TypographyToken } from '@/theme';

export type AppTextProps = TextProps & {
  variant?: TypographyToken;
  color?: ColorToken;
  /** Graisse Nunito à appliquer par-dessus la variante (texte). */
  weight?: 'regular' | 'semi' | 'bold' | 'heavy';
  align?: 'left' | 'center' | 'right';
};

const weights = {
  regular: 'Nunito_400Regular',
  semi: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  heavy: 'Nunito_800ExtraBold',
} as const;

/**
 * Texte de l'app. Respecte la taille de police système (allowFontScaling) :
 * les mises en page doivent s'agrandir sans couper le texte jusqu'à 200 % (WCAG 1.4.4).
 */
export function AppText({
  variant = 'body',
  color = 'ink',
  weight,
  align,
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      allowFontScaling
      style={[
        typography[variant],
        { color: colors[color] },
        weight ? { fontFamily: weights[weight] } : null,
        align ? { textAlign: align } : null,
        style,
      ]}
      {...rest}
    />
  );
}
