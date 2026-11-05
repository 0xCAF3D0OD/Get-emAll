import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, spacing } from '@/theme';

export type ScreenHeaderProps = {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  /** Libellé du bouton retour, « Retour » par défaut. */
  backLabel?: string;
  /** Contenu à la place du titre (ex. barre d'étapes de l'entrée). */
  children?: ReactNode;
};

/** Bouton retour 44 px avec libellé accessible, titre, sous-titre facultatif. */
export function ScreenHeader({ title, subtitle, onBack, backLabel, children }: ScreenHeaderProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={backLabel ?? t('commun.retour')}
          onPress={onBack}
          hitSlop={4}
          style={styles.back}
        >
          <ChevronLeft size={30} color={colors.ink} aria-hidden />
        </Pressable>
      ) : null}
      {children ?? (
        <View style={styles.texts}>
          {title ? (
            <AppText variant="display" accessibilityRole="header">
              {title}
            </AppText>
          ) : null}
          {subtitle ? (
            <AppText variant="bodyS" color="inkMuted">
              {subtitle}
            </AppText>
          ) : null}
        </View>
      )}
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
  texts: { flex: 1 },
});
