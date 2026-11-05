import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/theme';

export type ChoiceCardProps = {
  selected: boolean;
  onPress: () => void;
  accessibilityLabel: string;
  children: ReactNode;
  /** Rond de sélection : à gauche (A3), en haut à droite (A4) ou absent (grille d'avatars). */
  radio?: 'left' | 'corner' | 'none';
  style?: ViewStyle;
};

/** Rond de sélection : contour inkMuted, point primaire quand coché. */
export function RadioDot({ checked }: { checked: boolean }) {
  return (
    <View style={[styles.dot, checked && { borderColor: colors.primary }]}>
      {checked ? <View style={styles.dotInner} /> : null}
    </View>
  );
}

/**
 * Carte sélectionnable (rôle radio). Sélection unique : fond primaryLight, bordure et ombre
 * primaires et rond coché sur la même carte (décision C1).
 */
export function ChoiceCard({
  selected,
  onPress,
  accessibilityLabel,
  children,
  radio = 'left',
  style,
}: ChoiceCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: selected, selected }}
      onPress={onPress}
      style={[
        styles.card,
        selected ? styles.selected : styles.idle,
        radio === 'left' && styles.rowLayout,
        style,
      ]}
    >
      {radio === 'left' ? <RadioDot checked={selected} /> : null}
      {radio === 'corner' ? (
        <View style={styles.corner}>
          <RadioDot checked={selected} />
        </View>
      ) : null}
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    borderWidth: 3,
    padding: spacing.lg,
    minHeight: spacing.touch,
  },
  idle: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    boxShadow: `0px 4px 0px 0px ${colors.border}`,
  },
  selected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    boxShadow: `0px 4px 0px 0px ${colors.primary}`,
  },
  rowLayout: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  corner: { position: 'absolute', top: spacing.md, right: spacing.md },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.inkMuted,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.primary },
});
