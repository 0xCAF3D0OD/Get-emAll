import { router } from 'expo-router';
import { Shield } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { useClassement } from '@/api';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { IconTile } from '@/components/IconTile';
import { LeaderboardRow } from '@/components/LeaderboardRow';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SegmentedTabs } from '@/components/SegmentedTabs';
import { colors, spacing } from '@/theme';

type Onglet = 'ligue' | 'amis';

/** Classement par ligue, sans relégation ni pression : public en recherche d'emploi. */
export default function Classement() {
  const { t } = useTranslation();
  const [onglet, setOnglet] = useState<Onglet>('ligue');
  const { data } = useClassement(onglet);
  const ligue = data ? t(`progres.ligues.${data.ligue}`) : '';
  const membres = data?.membres ?? [];

  return (
    <Screen edges={['top']}>
      <ScreenHeader title={t('classement.titre')} onBack={() => router.back()} />
      <SegmentedTabs<Onglet>
        look="soft"
        label={t('classement.onglets')}
        value={onglet}
        onChange={setOnglet}
        segments={[
          { key: 'ligue', label: t('classement.maLigue') },
          { key: 'amis', label: t('classement.mesAmis') },
        ]}
      />

      {onglet === 'amis' ? (
        // TODO(maquette) : l'onglet « Mes amis » n'est pas dessiné.
        <AppText variant="body" color="inkMuted" align="center">
          {t('classement.amisVide')}
        </AppText>
      ) : data ? (
        <>
          <Card style={styles.ligue}>
            <IconTile icon={Shield} bg="leagueBg" fg="inkMuted" size={48} />
            <View style={styles.flex}>
              <AppText variant="h3" accessibilityRole="header">
                {t('classement.ligue', { ligue })}
              </AppText>
              <AppText variant="caption" color="inkMuted">
                {t('classement.ligueSous', { n: data.finDansJours })}
              </AppText>
            </View>
          </Card>

          <View
            accessibilityRole="list"
            accessibilityLabel={t('classement.liste')}
            style={styles.liste}
          >
            {membres.map((m) => (
              <View key={m.rang} style={styles.liste}>
                <LeaderboardRow {...m} />
                {m.rang === data.montent && membres.length > data.montent ? (
                  <View style={styles.separateur}>
                    <View style={styles.trait} />
                    <AppText variant="caption" weight="heavy" color="success">
                      {t('classement.montent', {
                        n: data.montent,
                        ligue: t('progres.ligues.or'),
                      })}
                    </AppText>
                    <View style={styles.trait} />
                  </View>
                ) : null}
              </View>
            ))}
          </View>

          {/* TODO(maquette) : « quitter le classement » est annoncé mais absent du profil. */}
          <AppText variant="caption" color="inkMuted" align="center" style={styles.note}>
            {t('classement.note')}
          </AppText>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  ligue: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  liste: { gap: spacing.sm },
  separateur: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  trait: { flex: 1, height: 2, backgroundColor: colors.successFill },
  note: { marginTop: spacing.xxl },
});
