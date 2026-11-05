import { Lock } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { useOffres } from '@/api';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ChoiceCard } from '@/components/ChoiceCard';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { StepsHeader } from '@/components/StepsHeader';
import { useProfil } from '@/store/profil';
import { colors, spacing } from '@/theme';

type Choix = { kind: 'offre'; id: string } | { kind: 'coller' } | { kind: 'metier' };

export default function ChoixOffre() {
  const { t } = useTranslation();
  const { data: offres = [] } = useOffres();
  const offreId = useProfil((s) => s.offreId);
  const setOffre = useProfil((s) => s.setOffre);
  const entreeTerminee = useProfil((s) => s.entreeTerminee);
  const [choix, setChoix] = useState<Choix>(
    offreId ? { kind: 'offre', id: offreId } : { kind: 'metier' },
  );

  const continuer = () => {
    if (choix.kind === 'offre') {
      setOffre(choix.id);
      if (entreeTerminee) router.back();
      else router.push('/recruteur');
      return;
    }
    // TODO(maquette) : champ « Coller une autre offre » et choix du métier non dessinés.
    router.push({ pathname: '/a-dessiner', params: { ecran: choix.kind } });
  };

  const est = (c: Choix) =>
    c.kind === choix.kind && (c.kind !== 'offre' || (choix.kind === 'offre' && choix.id === c.id));

  const carte = (c: Choix, titre: string, sous: string) => (
    <ChoiceCard
      selected={est(c)}
      onPress={() => setChoix(c)}
      accessibilityLabel={`${titre}, ${sous}`}
    >
      <View style={styles.texts}>
        <AppText variant="bodyL" weight="heavy">
          {titre}
        </AppText>
        <AppText variant="body" color="inkMuted">
          {sous}
        </AppText>
      </View>
    </ChoiceCard>
  );

  return (
    <Screen footerRule footer={<Button label={t('commun.continuer')} onPress={continuer} />}>
      <StepsHeader step={2} onBack={() => router.back()} />
      <View style={styles.intro}>
        <AppText variant="display" accessibilityRole="header">
          {t('entree.offre.titre')}
        </AppText>
        <AppText variant="bodyL" color="inkMuted">
          {t('entree.offre.texte')}
        </AppText>
      </View>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={t('entree.offre.groupe')}
        style={styles.list}
      >
        <SectionTitle>{t('entree.offre.depuis')}</SectionTitle>
        {offres.map((o) =>
          carte(
            { kind: 'offre', id: o.id },
            `${o.titre} · ${o.entreprise}`,
            t('entree.offre.ajoutee', { date: o.ajouteeLe }),
          ),
        )}
        <SectionTitle>{t('entree.offre.ou')}</SectionTitle>
        {carte({ kind: 'coller' }, t('entree.offre.coller'), t('entree.offre.collerSous'))}
        {carte({ kind: 'metier' }, t('entree.offre.metier'), t('entree.offre.metierSous'))}
      </View>
      <View style={styles.mention}>
        <Lock size={22} color={colors.inkMuted} aria-hidden />
        <AppText variant="body" color="inkMuted" style={styles.mentionText}>
          {t('entree.offre.mention')}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm, marginTop: spacing.md },
  list: { gap: spacing.md },
  texts: { flex: 1, gap: 2 },
  mention: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  mentionText: { flex: 1 },
});
