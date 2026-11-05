import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, spacing } from '@/theme';
import type { Level } from '@/types/characters';

/** Niveau en pictogramme (●●○) et en texte : jamais le pictogramme seul. */
export function LevelDots({ level, label }: { level: Level; label: string }) {
  return (
    <View style={styles.row}>
      <View
        style={styles.dots}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        {[1, 2, 3].map((n) => (
          <View key={n} style={[styles.dot, n <= level ? styles.on : styles.off]} />
        ))}
      </View>
      <AppText variant="bodyS" weight="heavy">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dots: { flexDirection: 'row', gap: 3 },
  dot: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: colors.ink },
  on: { backgroundColor: colors.ink },
  off: { backgroundColor: 'transparent' },
});
