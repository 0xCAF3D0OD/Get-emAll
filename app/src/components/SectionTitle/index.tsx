import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { spacing } from '@/theme';

export type SectionTitleProps = {
  children: string;
  /** « overline » : sur-titre en majuscules (PAR THÈME) ; « title » : titre h3 (Ta route vers le poste). */
  kind?: 'overline' | 'title';
  /** Élément à droite (ex. « Étape 2 sur 5 », lien « Tout voir »). */
  aside?: ReactNode;
};

export function SectionTitle({ children, kind = 'overline', aside }: SectionTitleProps) {
  return (
    <View style={styles.row}>
      <AppText
        accessibilityRole="header"
        variant={kind === 'overline' ? 'overline' : 'h2'}
        color={kind === 'overline' ? 'inkMuted' : 'ink'}
        style={styles.title}
      >
        {children}
      </AppText>
      {aside}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' },
  title: { flexShrink: 1 },
});
