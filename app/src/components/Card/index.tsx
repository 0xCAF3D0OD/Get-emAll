import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius, shadows, spacing } from '@/theme';

export type CardProps = ViewProps & {
  /** Ombre de carte (4 px, couleur border). Les cartes de la maquette en ont quand elles sont touchables. */
  raised?: boolean;
  tone?: 'surface' | 'primaryLight' | 'successBg' | 'errorBg' | 'streakBg' | 'warningBg';
  padded?: boolean;
};

export function Card({
  raised = false,
  tone = 'surface',
  padded = true,
  style,
  ...rest
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors[tone] },
        padded && styles.padded,
        raised && shadows.card,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.card },
  padded: { padding: spacing.xl },
});
