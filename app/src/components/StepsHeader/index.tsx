import { ChevronLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radius, spacing } from '@/theme';

/** En-tête de l'entrée : retour, 3 segments de progression, « Étape n sur 3 ». */
export function StepsHeader({
  step,
  total = 3,
  onBack,
}: {
  step: number;
  total?: number;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const label = t('entree.etape', { n: step, total });
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('commun.retour')}
        onPress={onBack}
        style={styles.back}
      >
        <ChevronLeft size={30} color={colors.ink} aria-hidden />
      </Pressable>
      <View
        style={styles.bars}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={t('entree.progression')}
        accessibilityValue={{ min: 0, max: total, now: step, text: label }}
      >
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[styles.bar, { backgroundColor: i < step ? colors.primary : colors.track }]}
          />
        ))}
      </View>
      <AppText variant="body" weight="heavy" color="inkMuted" importantForAccessibility="no">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: spacing.touch },
  back: {
    width: spacing.touch,
    height: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.sm,
  },
  bars: { flex: 1, flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.sm },
  bar: { flex: 1, height: 8, borderRadius: radius.pill },
});
