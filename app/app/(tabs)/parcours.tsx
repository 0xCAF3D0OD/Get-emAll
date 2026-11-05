import { Briefcase } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { useParcours } from '@/api';
import { AppText } from '@/components/AppText';
import { CandidateAvatar } from '@/components/Avatar/CandidateAvatar';
import { RecruiterAvatar } from '@/components/Avatar/RecruiterAvatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { IconTile } from '@/components/IconTile';
import { RouteStep } from '@/components/RouteStep';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { StatPill } from '@/components/StatPill';
import { progres } from '@/data/fixtures';
import { useParcoursStore } from '@/store/parcours';
import { useProfil } from '@/store/profil';
import { spacing } from '@/theme';
import type { EtapeParcours } from '@/types/domain';

const chipKind = { faite: 'done', en_cours: 'now', a_venir: 'next' } as const;

export default function Parcours() {
  const { t } = useTranslation();
  const { data } = useParcours();
  const avatar = useProfil((s) => s.avatar);
  const indices = useParcoursStore((s) => s.indices);
  const xp = useParcoursStore((s) => s.xpAujourdhui);
  const etapes = data?.etapes ?? [];
  const enCours = etapes.find((e) => e.statut === 'en_cours');

  const line = (i: number): 'done' | 'current' | 'locked' | undefined => {
    const e = etapes[i];
    if (!e || i === etapes.length - 1) return undefined;
    return e.statut === 'terminee' ? 'done' : e.statut === 'en_cours' ? 'current' : 'locked';
  };

  const contenuEnCours = (e: EtapeParcours) => {
    const suivante = e.lecons?.find((l) => l.statut === 'en_cours');
    return (
      <>
        <View style={styles.chips}>
          {e.lecons?.map((l) => (
            <Chip
              key={l.id}
              kind={chipKind[l.statut]}
              label={l.titre}
              accessibilityLabel={`${l.titre}, ${t(`parcours.lecons.${l.statut}`)}`}
            />
          ))}
        </View>
        {suivante ? (
          <Button
            compact
            label={t('parcours.continuer', { lecon: suivante.titre })}
            onPress={() => router.push(`/lecon/${suivante.id}`)}
          />
        ) : null}
      </>
    );
  };

  return (
    <Screen edges={['top']}>
      <View style={styles.pills}>
        <StatPill
          kind="streak"
          value={String(progres.serie)}
          unit={t('parcours.stats.serie')}
          accessibilityLabel={t('parcours.stats.serieLu', { n: progres.serie })}
        />
        <StatPill
          kind="xp"
          value={String(xp)}
          unit={t('parcours.stats.xp', { objectif: progres.xpObjectifJour })}
          accessibilityLabel={t('parcours.stats.xpLu', { n: xp, objectif: progres.xpObjectifJour })}
        />
        <StatPill
          kind="hints"
          value={String(indices)}
          unit={t('parcours.stats.indices')}
          accessibilityLabel={t('parcours.stats.indicesLu', { n: indices })}
        />
      </View>

      {data ? (
        <Card style={styles.offre}>
          <IconTile icon={Briefcase} size={44} />
          <View style={styles.offreTexts}>
            <AppText variant="micro" color="inkMuted" numberOfLines={1}>
              {t('parcours.offre.intro')}
            </AppText>
            <AppText variant="bodyS" weight="heavy" numberOfLines={1}>
              {t('parcours.offre.titre', {
                poste: data.offre.titre,
                entreprise: data.offre.entreprise,
              })}
            </AppText>
          </View>
          <Button
            variant="ghost"
            labelVariant="caption"
            label={t('parcours.offre.changer')}
            accessibilityLabel={t('parcours.offre.changerLu')}
            onPress={() => router.push('/offre')}
          />
        </Card>
      ) : null}

      <SectionTitle
        kind="title"
        aside={
          enCours ? (
            <AppText variant="caption" weight="semi" color="inkMuted" style={styles.aside}>
              {t('parcours.etapeSur', { n: enCours.rang, total: etapes.length })}
            </AppText>
          ) : null
        }
      >
        {t('parcours.route')}
      </SectionTitle>

      <View accessibilityRole="list" accessibilityLabel={t('parcours.listeLu')}>
        {etapes.map((e, i) => (
          <RouteStep
            key={e.rang}
            rang={e.rang}
            type={e.type}
            statut={e.statut}
            title={e.titre}
            subtitle={e.sousTitre}
            line={line(i)}
            aside={
              e.recruteur ? (
                <RecruiterAvatar id={e.recruteur} size={44} bg="lavenderBg" decorative />
              ) : e.statut === 'en_cours' ? (
                <CandidateAvatar id={avatar} size={44} decorative />
              ) : null
            }
          >
            {e.statut === 'en_cours' ? contenuEnCours(e) : null}
          </RouteStep>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  offre: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  offreTexts: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  aside: { marginLeft: 'auto' },
});
