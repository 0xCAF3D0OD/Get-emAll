import { Check, Plus } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radius, spacing, type ColorToken } from '@/theme';

export type ChipKind = 'done' | 'now' | 'next' | 'status';

export type ChipProps = {
  label: string;
  kind?: ChipKind;
  /** Pour kind="status" : couleurs passées en props. */
  bg?: ColorToken;
  fg?: ColorToken;
  /** Pictogramme pour kind="status" (le statut n'est jamais porté par la couleur seule). */
  icon?: 'check' | 'plus';
  /** Texte lu par le lecteur d'écran, par ex. « Ton pitch, terminée ». */
  accessibilityLabel?: string;
};

const look: Record<Exclude<ChipKind, 'status'>, { bg: ColorToken; fg: ColorToken }> = {
  done: { bg: 'successBg', fg: 'success' },
  now: { bg: 'primaryLight', fg: 'primary' },
  next: { bg: 'surfaceMuted', fg: 'inkMuted' },
};

export function Chip({ label, kind = 'next', bg, fg, icon, accessibilityLabel }: ChipProps) {
  const c = kind === 'status' ? { bg: bg ?? 'surfaceMuted', fg: fg ?? 'inkMuted' } : look[kind];
  const pict = kind === 'done' ? 'check' : kind === 'status' ? icon : undefined;
  const Icon = pict === 'check' ? Check : pict === 'plus' ? Plus : null;
  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel ?? label}
      style={[styles.chip, { backgroundColor: colors[c.bg] }]}
    >
      {Icon ? <Icon size={18} strokeWidth={2.5} color={colors[c.fg]} aria-hidden /> : null}
      <AppText variant="bodyS" weight="heavy" color={c.fg}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    minHeight: 36,
  },
});
