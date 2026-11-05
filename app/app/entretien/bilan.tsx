import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { useBilan } from '@/api';
import { AppText } from '@/components/AppText';
import { RecruiterAvatar } from '@/components/Avatar/RecruiterAvatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { NoteChip } from '@/components/NoteChip';
import { Screen } from '@/components/Screen';
import { colors, radius, spacing } from '@/theme';

export default function Bilan() {
  const { t } = useTranslation();
  const { data: b } = useBilan('dernier');
  if (!b) return <Screen>{null}</Screen>;
  const nom = t(`personnages.recruteurs.${b.recruteur}.nom`);

  const stats = [
    {
      v: `+${b.xp}`,
      l: t('entretien.bilan.xp'),
      lu: t('entretien.bilan.xpLu', { n: b.xp }),
      c: 'primary' as const,
    },
    {
      v: `${b.questionsRepondues}/${b.questionsTotal}`,
      l: t('entretien.bilan.questions'),
      lu: t('entretien.bilan.questionsLu', { n: b.questionsRepondues, total: b.questionsTotal }),
      c: 'ink' as const,
    },
    {
      v: t('entretien.bilan.min', { n: b.dureeMin }),
      l: t('entretien.bilan.duree'),
      lu: t('entretien.bilan.dureeLu', { n: b.dureeMin }),
      c: 'ink' as const,
    },
  ];

  return (
    <Screen>
      <View style={styles.tete}>
        <RecruiterAvatar id={b.recruteur} expression="ravi" size={120} bg="warningBg" />
        <AppText variant="display" align="center" accessibilityRole="header">
          {t('entretien.bilan.titre')}
        </AppText>
        <AppText variant="bodyS" color="inkMuted" align="center">
          {t('entretien.bilan.sous', { nom })}
        </AppText>
      </View>

      <View style={styles.stats}>
        {stats.map((s) => (
          <Card key={s.l} style={styles.stat} accessible accessibilityLabel={s.lu}>
            <AppText variant="h2" color={s.c} align="center">
              {s.v}
            </AppText>
            <AppText variant="micro" color="inkMuted" align="center">
              {s.l}
            </AppText>
          </Card>
        ))}
      </View>

      <Card style={styles.criteres}>
        {b.criteres.map((c, i) => (
          <View
            key={c.critere}
            accessible
            accessibilityLabel={`${t(`entretien.bilan.criteres.${c.critere}`)} : ${t(`entretien.bilan.notes.${c.note}`)}`}
            style={[styles.critere, i > 0 && styles.filet]}
          >
            <AppText variant="bodyS" weight="semi" style={styles.flex}>
              {t(`entretien.bilan.criteres.${c.critere}`)}
            </AppText>
            <NoteChip note={c.note} />
          </View>
        ))}
      </Card>

      <View style={styles.conseil}>
        <AppText variant="overline" color="primary" accessibilityRole="header">
          {t('entretien.bilan.conseil', { nom })}
        </AppText>
        <AppText variant="bodyS">{b.conseil}</AppText>
      </View>

      <Button label={t('commun.continuer')} onPress={() => router.back()} />
      {/* Décision B1 : pas d'audio conservé, on relit les réponses écrites. */}
      <Button
        variant="ghost"
        labelVariant="bodyS"
        label={t('entretien.bilan.relire')}
        onPress={() => router.push('/entretien/reecoute')}
        style={styles.lien}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  tete: { alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  stats: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.sm },
  criteres: { paddingVertical: spacing.xs },
  critere: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 54,
  },
  filet: { borderTopWidth: 2, borderTopColor: colors.borderStrong },
  flex: { flex: 1 },
  conseil: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  lien: { alignSelf: 'center' },
});
