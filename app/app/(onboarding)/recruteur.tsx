import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ChoiceCard } from '@/components/ChoiceCard';
import { LevelDots } from '@/components/LevelDots';
import { Screen } from '@/components/Screen';
import { StepsHeader } from '@/components/StepsHeader';
import { recruiterOrder, recruiters } from '@/characters/registry';
import { useProfil } from '@/store/profil';
import { spacing } from '@/theme';

export default function ChoixRecruteur() {
  const { t } = useTranslation();
  const recruteur = useProfil((s) => s.recruteur);
  const setRecruteur = useProfil((s) => s.setRecruteur);
  const entreeTerminee = useProfil((s) => s.entreeTerminee);
  const terminerEntree = useProfil((s) => s.terminerEntree);

  const commencer = () => {
    if (entreeTerminee) return router.back();
    terminerEntree();
    router.replace('/parcours');
    router.push('/lecon/points-forts');
  };

  return (
    <Screen
      footerRule
      footer={
        <Button
          label={entreeTerminee ? t('commun.continuer') : t('entree.recruteur.commencer')}
          onPress={commencer}
        />
      }
    >
      <StepsHeader step={3} onBack={() => router.back()} />
      <View style={styles.intro}>
        <AppText variant="display" accessibilityRole="header">
          {t('entree.recruteur.titre')}
        </AppText>
        <AppText variant="bodyL" color="inkMuted">
          {t('entree.recruteur.texte')}
        </AppText>
      </View>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={t('entree.recruteur.groupe')}
        style={styles.grid}
      >
        {recruiterOrder.map((id) => {
          const r = recruiters[id];
          const img = r.expressions.neutre;
          const nom = t(`personnages.recruteurs.${id}.nom`);
          const role = t(`personnages.recruteurs.${id}.role`);
          const niveau = t(`personnages.niveaux.${r.level}`);
          return (
            <View key={id} style={styles.cell}>
              <ChoiceCard
                radio="corner"
                selected={recruteur === id}
                onPress={() => setRecruteur(id)}
                accessibilityLabel={`${nom}, ${role}, ${t('personnages.niveauLu', { niveau, n: r.level })}`}
                style={styles.card}
              >
                <Image
                  source={img.source}
                  contentFit="contain"
                  style={{ height: 84, width: (84 * img.width) / img.height }}
                />
                <AppText variant="h1" align="center">
                  {nom}
                </AppText>
                <AppText variant="bodyS" color="inkMuted" align="center">
                  {role}
                </AppText>
                <LevelDots level={r.level} label={niveau} />
              </ChoiceCard>
            </View>
          );
        })}
      </View>
      <Card>
        <AppText variant="bodyL" accessibilityLiveRegion="polite">
          {t(`personnages.recruteurs.${recruteur}.presentation`)}
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm, marginTop: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.sm / 2 - 2 },
  cell: { width: '50%', padding: spacing.sm / 2 + 2 },
  card: { alignItems: 'center', gap: 4, paddingTop: spacing.lg, flex: 1 },
});
