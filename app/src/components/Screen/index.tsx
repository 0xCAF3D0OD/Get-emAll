import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

export type ScreenProps = {
  children: ReactNode;
  /** Zone fixée en bas (bouton principal), séparée par un filet comme dans la maquette. */
  footer?: ReactNode;
  /** Filet au-dessus du pied (A3, A4, leçon). */
  footerRule?: boolean;
  scroll?: boolean;
  /** Pas de marge haute (onglets : la barre du bas gère le bas). */
  edges?: ('top' | 'bottom')[];
  contentStyle?: ViewStyle;
  /** Contenu superposé (panneau de retour, confettis). */
  overlay?: ReactNode;
};

/** Gabarit d'écran : fond bg, marges de 20, défilement, pied fixe facultatif. */
export function Screen({
  children,
  footer,
  footerRule = false,
  scroll = true,
  edges = ['top', 'bottom'],
  contentStyle,
  overlay,
}: ScreenProps) {
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, contentStyle]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.fill, contentStyle]}>{children}</View>
  );
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      {body}
      {footer ? <View style={[styles.footer, footerRule && styles.rule]}>{footer}</View> : null}
      {overlay}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  fill: { flex: 1 },
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.bg,
  },
  rule: { borderTopWidth: 2, borderTopColor: colors.borderStrong },
});
