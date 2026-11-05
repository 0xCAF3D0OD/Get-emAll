import { Image } from 'expo-image';
import { Trophy } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { useProgres } from '@/api';
import { AppText } from '@/components/AppText';
import { RecruiterAvatar } from '@/components/Avatar/RecruiterAvatar';
import { BarChart } from '@/components/BarChart';
import { Card } from '@/components/Card';
import { IconTile } from '@/components/IconTile';
import { ListRow } from '@/components/ListRow';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { avatarById } from '@/characters/registry';
import { useCharacterLabel } from '@/characters/useCharacterLabel';
import { useProfil } from '@/store/profil';
import { spacing } from '@/theme';

const joursLus = ['L', 'M1', 'M2', 'J', 'V', 'S', 'Auj.'] as const;

export default function Progres() {
  const { t } = useTranslation();
  const label = useCharacterLabel();
  const { data: p } = useProgres();
  const avatar = avatarById(useProfil((s) => s.avatar));
  const fier = avatar.expressions?.fier ?? avatar.image;
  if (!p) return <Screen edges={['top']}>{null}</Screen>;

  const detail = p.xpParJour
    .slice(0, -1)
    .map((d, i) => `${t(`progres.jours.${joursLus[i] ?? 'L'}`)} ${d.xp}`)
    .join(', ');
  const auj = p.xpParJour.at(-1)?.xp ?? 0;

  return (
    <Screen edges={['top']}>
      <AppText variant="display" accessibilityRole="header">
        {t('progres.titre')}
      </AppText>

      <Card tone="streakBg" style={styles.serie}>
        <Image
          source={fier.source}
          contentFit="contain"
          accessible
          accessibilityLabel={label.candidate('fier')}
          style={{ height: 90, width: (90 * fier.width) / fier.height }}
        />
        <View style={styles.flex}>
          <AppText variant="display" color="streakText" style={styles.serieChiffre}>
            {t('progres.serie', { n: p.serie })}
          </AppText>
          <AppText variant="bodyS">{t('progres.serieTexte', { record: p.record })}</AppText>
        </View>
      </Card>

      <View style={styles.stats}>
        {[
          { v: p.xpSemaine, l: t('progres.xpSemaine'), c: 'primary' as const },
          { v: p.lecons, l: t('progres.lecons'), c: 'ink' as const },
          { v: p.entretiens, l: t('progres.entretiens'), c: 'ink' as const },
        ].map((s) => (
          <Card key={s.l} style={styles.stat} accessible accessibilityLabel={`${s.v} ${s.l}`}>
            <AppText variant="h2" color={s.c} align="center">
              {s.v}
            </AppText>
            <AppText variant="micro" color="inkMuted" align="center">
              {s.l}
            </AppText>
          </Card>
        ))}
      </View>

      <Card padded={false} style={styles.rowCard}>
        <ListRow
          title={t('progres.classement')}
          subtitle={t('progres.classementSous', {
            rang: p.rangLigue,
            ligue: t(`progres.ligues.${p.ligue}`),
          })}
          leading={<IconTile icon={Trophy} bg="warningBg" fg="hintStroke" size={48} />}
          onPress={() => router.push('/progres/classement')}
        />
      </Card>

      <Card style={styles.block}>
        <AppText variant="body" weight="heavy" accessibilityRole="header">
          {t('progres.xpJour')}
        </AppText>
        <BarChart
          description={t('progres.xpJourLu', { detail, auj })}
          bars={p.xpParJour.map((d) => ({ label: d.jour, value: d.xp, highlight: d.aujourdhui }))}
        />
      </Card>

      <Card style={styles.block}>
        <AppText variant="body" weight="heavy" accessibilityRole="header">
          {t('progres.competences')}
        </AppText>
        {p.competences.map((c) => {
          const statut =
            c.progression >= 100
              ? t('progres.maitrise')
              : c.progression > 0
                ? t('progres.enCours', { p: c.progression })
                : t('progres.aCommencer');
          return (
            <View key={c.nom} style={styles.comp}>
              <View style={styles.compHead}>
                <AppText variant="bodyS" weight="semi" style={styles.flex}>
                  {c.nom}
                </AppText>
                <AppText
                  variant="bodyS"
                  weight="heavy"
                  color={c.progression >= 100 ? 'success' : 'primary'}
                >
                  {statut}
                </AppText>
              </View>
              <ProgressBar value={c.progression} max={100} label={c.nom} valueText={statut} />
            </View>
          );
        })}
      </Card>

      {/* TODO(maquette) : « Derniers entretiens » est coupé en bas de la maquette 09. */}
      <SectionTitle>{t('progres.derniers')}</SectionTitle>
      <Card padded={false} style={styles.rowCard}>
        {p.derniersEntretiens.map((e, i) => (
          <ListRow
            key={i}
            title={t('progres.avec', {
              nom: t(`personnages.recruteurs.${e.recruteur}.nom`),
              date: e.date,
            })}
            subtitle={e.note}
            leading={<RecruiterAvatar id={e.recruteur} size={44} decorative />}
            onPress={() => router.push('/entretien/bilan')}
          />
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  serie: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl, padding: spacing.lg },
  serieChiffre: { fontSize: 30, lineHeight: 36 },
  stats: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, paddingHorizontal: spacing.sm, paddingVertical: spacing.md },
  rowCard: { paddingHorizontal: spacing.lg },
  block: { gap: spacing.lg },
  comp: { gap: spacing.sm },
  compHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
