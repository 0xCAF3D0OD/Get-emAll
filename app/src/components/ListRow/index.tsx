import { ChevronRight } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, spacing } from '@/theme';

export type ListRowProps = {
  title: string;
  subtitle?: string;
  /** Pictogramme ou avatar à gauche (décoratif). */
  leading?: ReactNode;
  /** Contenu à droite à la place du chevron (ex. case à cocher, lien « Changer »). */
  trailing?: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  chevron?: boolean;
};

/** Ligne de liste, touchable avec chevron si onPress est fourni. Hauteur ≥ 44. */
export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  chevron = !!onPress,
}: ListRowProps) {
  const content = (
    <>
      {leading ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {leading}
        </View>
      ) : null}
      <View style={styles.texts}>
        <AppText variant="body" weight="heavy">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color="inkMuted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {trailing}
      {chevron ? <ChevronRight size={24} color={colors.inkMuted} aria-hidden /> : null}
    </>
  );

  if (!onPress) return <View style={styles.row}>{content}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (subtitle ? `${title}, ${subtitle}` : title)}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    minHeight: spacing.touch + 12,
    paddingVertical: spacing.sm,
  },
  texts: { flex: 1, gap: 2 },
});
