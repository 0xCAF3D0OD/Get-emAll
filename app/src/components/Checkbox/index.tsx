import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, spacing } from '@/theme';

/** Ligne avec case à cocher (maquette 11) : toute la ligne est touchable. */
export function CheckboxRow({
  title,
  subtitle,
  checked,
  onChange,
}: {
  title: string;
  subtitle?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={styles.row}
    >
      <View style={styles.texts}>
        <AppText variant="bodyS" weight="heavy">
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="micro" color="inkMuted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={[styles.box, checked ? styles.on : styles.off]}>
        {checked ? <Check size={22} strokeWidth={3.5} color={colors.white} aria-hidden /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    minHeight: spacing.touch + 4,
    paddingVertical: spacing.sm,
  },
  texts: { flex: 1, gap: 2 },
  box: { width: 28, height: 28, borderRadius: 2, alignItems: 'center', justifyContent: 'center' },
  on: { backgroundColor: colors.primary },
  off: { borderWidth: 2, borderColor: colors.inkMuted, backgroundColor: colors.surface },
});
