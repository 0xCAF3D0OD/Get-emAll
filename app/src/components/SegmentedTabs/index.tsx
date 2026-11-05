import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radius, spacing } from '@/theme';

export type Segment<K extends string> = {
  key: K;
  label: string;
  /** Segment visible mais inactif (ex. Deutsch et English en phase 1, décision B3). */
  disabled?: boolean;
  /** Indication lue pour un segment inactif, ex. « bientôt ». */
  disabledHint?: string;
};

export type SegmentedTabsProps<K extends string> = {
  segments: Segment<K>[];
  value: K;
  onChange: (key: K) => void;
  /** Libellé du groupe, lu par le lecteur d'écran. */
  label: string;
  /** « solid » : sélection pleine primaire (langue) ; « soft » : sélection blanche sur fond (classement). */
  look?: 'solid' | 'soft';
};

export function SegmentedTabs<K extends string>({
  segments,
  value,
  onChange,
  label,
  look = 'solid',
}: SegmentedTabsProps<K>) {
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={label}
      style={[styles.group, look === 'soft' ? styles.groupSoft : styles.groupSolid]}
    >
      {segments.map((s) => {
        const selected = s.key === value;
        return (
          <Pressable
            key={s.key}
            accessibilityRole="tab"
            accessibilityLabel={
              s.disabled && s.disabledHint ? `${s.label}, ${s.disabledHint}` : s.label
            }
            accessibilityState={{ selected, disabled: !!s.disabled }}
            disabled={s.disabled}
            onPress={() => onChange(s.key)}
            style={[
              styles.segment,
              selected &&
                (look === 'soft' ? styles.selectedSoft : { backgroundColor: colors.primary }),
            ]}
          >
            <AppText
              variant="bodyL"
              weight={selected || look === 'solid' ? 'bold' : 'semi'}
              align="center"
              color={
                selected
                  ? look === 'soft'
                    ? 'ink'
                    : 'white'
                  : look === 'soft'
                    ? 'inkMuted'
                    : 'ink'
              }
            >
              {s.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', borderRadius: radius.button + 4, padding: 4, gap: 4 },
  groupSolid: { backgroundColor: colors.surface },
  groupSoft: { backgroundColor: colors.borderStrong },
  segment: {
    flex: 1,
    minHeight: spacing.touch,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  selectedSoft: { backgroundColor: colors.surface },
});
