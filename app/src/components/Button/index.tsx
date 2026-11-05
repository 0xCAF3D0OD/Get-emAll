import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { AppText } from '@/components/AppText';
import { colors, radius, shadows, spacing, type TypographyToken } from '@/theme';

export type ButtonVariant = 'primary' | 'success' | 'danger' | 'secondary' | 'ghost';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  /** Icône facultative avant le libellé (le libellé reste toujours visible). */
  icon?: ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: ViewStyle;
  /** Hauteur réduite (50) et libellé 16 pour les boutons placés dans une carte. */
  compact?: boolean;
  /** Variante typographique du libellé pour le bouton « ghost » (lien). */
  labelVariant?: TypographyToken;
};

const palette: Record<
  Exclude<ButtonVariant, 'ghost'>,
  { bg: string; shadow: string; text: 'white' | 'inkMuted' | 'ink'; border?: string }
> = {
  primary: { bg: colors.primary, shadow: colors.primaryDark, text: 'white' },
  success: { bg: colors.success, shadow: '#14502D', text: 'white' },
  danger: { bg: colors.errorDark, shadow: '#5E130F', text: 'white' },
  secondary: { bg: colors.surface, shadow: colors.border, text: 'inkMuted', border: colors.border },
};

/** Bouton 3D : ombre pleine de 5 px ; au pressé il descend de 4 px et l'ombre passe à 1 px. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  accessibilityLabel,
  accessibilityHint,
  style,
  compact = false,
  labelVariant,
}: ButtonProps) {
  const inactive = disabled || loading;

  if (variant === 'ghost') {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: inactive, busy: loading }}
        disabled={inactive}
        onPress={onPress}
        hitSlop={8}
        style={({ pressed }) => [styles.ghost, pressed && { opacity: 0.6 }, style]}
      >
        {icon}
        <AppText
          variant={labelVariant ?? 'body'}
          weight="heavy"
          color={inactive ? 'inkMuted' : 'primary'}
        >
          {label}
        </AppText>
      </Pressable>
    );
  }

  const p = palette[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={style}
    >
      {({ pressed }) => {
        const down = pressed && !inactive;
        const offset = inactive ? 0 : down ? shadows.buttonPressedOffset : shadows.buttonOffset;
        return (
          <View
            style={[
              styles.base,
              compact ? styles.compact : styles.tall,
              {
                backgroundColor: disabled ? colors.track : p.bg,
                borderColor: p.border ?? 'transparent',
                borderWidth: p.border ? 2 : 0,
                boxShadow: `0px ${offset}px 0px 0px ${p.shadow}`,
                transform: [{ translateY: down ? shadows.buttonTravel : 0 }],
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator
                color={variant === 'secondary' ? colors.inkMuted : colors.white}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              />
            ) : (
              icon
            )}
            <AppText
              variant={compact ? 'body' : 'bodyL'}
              weight="heavy"
              align="center"
              color={disabled ? 'inkMuted' : p.text}
            >
              {label}
            </AppText>
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.button,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tall: { minHeight: spacing.button, paddingVertical: spacing.md },
  compact: { minHeight: 50, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  ghost: {
    minHeight: spacing.touch,
    minWidth: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
});
