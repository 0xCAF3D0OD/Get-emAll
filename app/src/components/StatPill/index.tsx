import { Flame, Lightbulb, Zap } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radius, spacing } from '@/theme';

export type StatPillProps = {
  kind: 'streak' | 'xp' | 'hints';
  value: string;
  unit: string;
  /** Phrase complète pour le lecteur d'écran, ex. « Série de 12 jours ». */
  accessibilityLabel: string;
};

const icons = {
  streak: <Flame size={20} color={colors.streakText} fill={colors.streak} aria-hidden />,
  xp: <Zap size={20} color={colors.ink} fill={colors.xp} aria-hidden />,
  hints: <Lightbulb size={20} color={colors.hintStroke} fill={colors.warningBg} aria-hidden />,
};

/** Icône + valeur + unité sur une seule ligne ; les pastilles se partagent la largeur. */
export function StatPill({ kind, value, unit, accessibilityLabel }: StatPillProps) {
  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={styles.pill}>
      {icons[kind]}
      <AppText variant="bodyS" numberOfLines={1}>
        <AppText variant="bodyS" weight="heavy">
          {value}
        </AppText>{' '}
        <AppText variant="bodyS" color="inkMuted">
          {unit}
        </AppText>
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    justifyContent: 'center',
    flexGrow: 1,
    paddingHorizontal: spacing.sm + 2,
    minHeight: spacing.touch,
    paddingVertical: spacing.sm,
  },
});
