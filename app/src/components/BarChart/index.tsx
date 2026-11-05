import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, spacing } from '@/theme';

export type Bar = { label: string; value: number; highlight?: boolean };

/**
 * Barres verticales avec valeur au-dessus. Le graphique est un dessin : la description
 * complète est donnée au lecteur d'écran par `description`.
 */
export function BarChart({
  bars,
  description,
  height = 80,
}: {
  bars: Bar[];
  description: string;
  height?: number;
}) {
  const max = Math.max(1, ...bars.map((b) => b.value));
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={description} style={styles.row}>
      {bars.map((b, i) => (
        <View key={i} style={styles.col}>
          <AppText variant="micro" weight="heavy" color={b.highlight ? 'primary' : 'ink'}>
            {b.value}
          </AppText>
          <View
            style={[
              styles.bar,
              {
                height: Math.max(12, (b.value / max) * height),
                backgroundColor: b.highlight ? colors.primary : colors.primaryRing,
              },
            ]}
          />
          <AppText
            variant="tab"
            weight={b.highlight ? 'heavy' : 'semi'}
            color={b.highlight ? 'primary' : 'inkMuted'}
          >
            {b.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  col: { flex: 1, alignItems: 'center', gap: spacing.xs },
  bar: { width: '100%', borderRadius: 10 },
});
