import { Briefcase } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { useOffres } from '@/api';
import { AppText } from '@/components/AppText';
import { CandidateAvatar } from '@/components/Avatar/CandidateAvatar';
import { RecruiterAvatar } from '@/components/Avatar/RecruiterAvatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { CheckboxRow } from '@/components/Checkbox';
import { IconTile } from '@/components/IconTile';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { recruiters } from '@/characters/registry';
import { profil as donnees } from '@/data/fixtures';
import { useProfil } from '@/store/profil';
import { useReglages } from '@/store/reglages';
import { colors, radius, spacing } from '@/theme';

const objectifs = [10, 20, 30, 50] as const;

export default function Profil() {
  const { t } = useTranslation();
  const { prenom, avatar, recruteur, offreId } = useProfil();
  const reglages = useReglages();
  const { data: offres = [] } = useOffres();
  const offre = offres.find((o) => o.id === offreId);
  const niveau = t(`personnages.niveaux.${recruiters[recruteur].level}`);

  const ligne = (opts: {
    leading: React.ReactNode;
    caption: string;
    value: string;
    changeLabel: string;
    onChange: () => void;
  }) => (
    <View style={styles.trainRow}>
      {opts.leading}
      <View style={styles.flex}>
        <AppText variant="micro" color="inkMuted">
          {opts.caption}
        </AppText>
        <AppText variant="bodyS" weight="heavy" numberOfLines={1}>
          {opts.value}
        </AppText>
      </View>
      <Button
        variant="ghost"
        labelVariant="bodyS"
        label={t('commun.changer')}
        accessibilityLabel={opts.changeLabel}
        onPress={opts.onChange}
      />
    </View>
  );

  return (
    <Screen edges={['top']}>
      <View style={styles.head}>
        <CandidateAvatar
          id={avatar}
          size={96}
          bg="streakBg"
          framing="full"
          initial={prenom.charAt(0)}
        />
        <View style={styles.flex}>
          <AppText variant="display" accessibilityRole="header">
            {prenom}
          </AppText>
          <Button
            variant="ghost"
            labelVariant="bodyS"
            label={t('profil.changerAvatar')}
            onPress={() => router.push('/avatar')}
            style={styles.left}
          />
        </View>
      </View>

      <Card style={styles.block}>
        <SectionTitle>{t('profil.monEntrainement')}</SectionTitle>
        {ligne({
          leading: <RecruiterAvatar id={recruteur} size={40} framing="full" decorative />,
          caption: t('profil.recruteur'),
          value: `${t(`personnages.recruteurs.${recruteur}.nom`)} · ${niveau}`,
          changeLabel: t('profil.changerRecruteur'),
          onChange: () => router.push('/recruteur'),
        })}
        <View style={styles.rule} />
        {ligne({
          leading: <IconTile icon={Briefcase} size={40} />,
          caption: t('profil.offre'),
          value: offre ? `${offre.titre} · ${offre.entreprise}` : t('entree.offre.metier'),
          changeLabel: t('profil.changerOffre'),
          onChange: () => router.push('/offre'),
        })}
      </Card>

      <Card style={styles.block}>
        <SectionTitle>{t('profil.objectif')}</SectionTitle>
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel={t('profil.objectif')}
          style={styles.goals}
        >
          {objectifs.map((n) => {
            const on = reglages.objectifXp === n;
            return (
              <Pressable
                key={n}
                accessibilityRole="radio"
                accessibilityLabel={t('profil.objectifLu', { n })}
                accessibilityState={{ checked: on, selected: on }}
                onPress={() => reglages.set({ objectifXp: n })}
                style={[styles.goal, on ? styles.goalOn : styles.goalOff]}
              >
                <AppText variant="body" weight="heavy" color={on ? 'white' : 'ink'} align="center">
                  {n}
                </AppText>
                <AppText variant="tab" weight="semi" color={on ? 'white' : 'ink'} align="center">
                  XP
                </AppText>
              </Pressable>
            );
          })}
        </View>
        {/* TODO(maquette) : seule la durée de 20 XP (5 min) figure dans la maquette. */}
        <AppText variant="caption" color="ink">
          {t(`profil.objectifDuree.${reglages.objectifXp}`)}
        </AppText>
      </Card>

      <Card style={styles.block}>
        <SectionTitle>{t('profil.reglages')}</SectionTitle>
        {/* Décision B2 : le choix est enregistré, les rappels partiront en phase 2. */}
        <CheckboxRow
          title={t('profil.rappel')}
          subtitle={t('profil.rappelSous', { heure: donnees.rappelHeure })}
          checked={reglages.rappel}
          onChange={(v) => reglages.set({ rappel: v })}
        />
        <View style={styles.rule} />
        <CheckboxRow
          title={t('profil.sons')}
          subtitle={t('profil.sonsSous')}
          checked={reglages.sons}
          onChange={(v) => reglages.set({ sons: v })}
        />
        {/* TODO(maquette) : « Quitter le classement » est annoncé sur l'écran 13 mais absent ici. */}
        <View style={styles.rule} />
        <ListRow
          title={t('profil.confidentialite')}
          onPress={() =>
            router.push({ pathname: '/a-dessiner', params: { ecran: 'confidentialite' } })
          }
        />
        <View style={styles.rule} />
        <ListRow title={t('profil.suivi')} onPress={() => router.push('/profil/suivi-joba1')} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  left: { alignSelf: 'flex-start', marginLeft: -spacing.xs },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  block: { gap: spacing.sm },
  trainRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rule: { height: 2, backgroundColor: colors.borderStrong },
  goals: { flexDirection: 'row', gap: spacing.sm },
  goal: {
    flex: 1,
    borderRadius: radius.button,
    paddingVertical: spacing.sm,
    minHeight: 56,
    borderWidth: 2,
    justifyContent: 'center',
  },
  goalOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  goalOff: { backgroundColor: colors.bg, borderColor: colors.borderStrong },
});
