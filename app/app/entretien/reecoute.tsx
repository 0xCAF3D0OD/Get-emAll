import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { useBilan } from '@/api';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { NoteChip } from '@/components/NoteChip';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radius, spacing } from '@/theme';

/** Relecture des réponses (décision B1 : pas de bouton ▶, aucun audio n'est gardé). */
export default function Reecoute() {
  const { t } = useTranslation();
  const { data: b } = useBilan('dernier');
  const [ouverts, setOuverts] = useState<number[]>([]);
  const basculer = (rang: number) =>
    setOuverts((o) => (o.includes(rang) ? o.filter((r) => r !== rang) : [...o, rang]));

  return (
    <Screen>
      <ScreenHeader title={t('entretien.reecoute.titre')} onBack={() => router.back()} />
      {b?.reponses.map((r) => {
        const ouvert = ouverts.includes(r.rang);
        return (
          <Card key={r.rang} style={styles.carte}>
            <View style={styles.tete}>
              <AppText variant="overline" color="inkMuted" style={styles.flex}>
                {t('entretien.reecoute.question', { n: r.rang })}
              </AppText>
              <NoteChip note={r.note} icon={false} />
            </View>
            <AppText variant="body" weight="heavy" accessibilityRole="header">
              {r.question}
            </AppText>
            <AppText
              variant="bodyS"
              color="inkMuted"
              accessibilityLabel={t('entretien.reecoute.extraitLu', { texte: r.extrait })}
            >
              {r.extrait}
            </AppText>
            {ouvert ? (
              <View style={styles.conseil}>
                <AppText variant="overline" color="primary">
                  {t('entretien.reecoute.plusForte')}
                </AppText>
                <AppText variant="bodyS">{r.reponsePlusForte}</AppText>
              </View>
            ) : null}
            <Button
              variant="ghost"
              labelVariant="bodyS"
              label={t(ouvert ? 'entretien.reecoute.masquer' : 'entretien.reecoute.voir')}
              expanded={ouvert}
              onPress={() => basculer(r.rang)}
              style={styles.lien}
            />
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  carte: { gap: spacing.sm },
  tete: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  flex: { flex: 1 },
  conseil: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.button,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  lien: { alignSelf: 'flex-start', marginLeft: -spacing.xs },
});
