import { Lightbulb, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { ProgressBar } from '@/components/ProgressBar';
import { colors, spacing } from '@/theme';

export type LessonHeaderProps = {
  /** Numéro de l'exercice en cours (1 à total). */
  n: number;
  total: number;
  indices: number;
  onClose: () => void;
};

/** Fermer (44 px), progression « 3/6 », indices restants. Pas de vies ni de cœurs. */
export function LessonHeader({ n, total, indices, onClose }: LessonHeaderProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('lecon.fermer')}
        onPress={onClose}
        hitSlop={4}
        style={styles.close}
      >
        <X size={26} strokeWidth={2.5} color={colors.inkMuted} aria-hidden />
      </Pressable>
      <View style={styles.bar}>
        <ProgressBar
          value={n}
          max={total}
          height={16}
          label={t('lecon.progressionLu', { n, total })}
          valueText={t('lecon.progressionLu', { n, total })}
        />
      </View>
      <AppText
        variant="caption"
        weight="heavy"
        color="inkMuted"
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        {t('lecon.progression', { n, total })}
      </AppText>
      <View
        accessible
        accessibilityLabel={t('lecon.indicesLu', { n: indices })}
        style={styles.hints}
      >
        <Lightbulb size={22} color={colors.hintStroke} fill={colors.warningBg} aria-hidden />
        <AppText variant="body" weight="heavy">
          {indices}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: spacing.touch },
  close: {
    width: spacing.touch,
    height: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.sm,
  },
  bar: { flex: 1, marginLeft: spacing.xs },
  hints: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
});
