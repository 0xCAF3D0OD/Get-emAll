import { Image } from 'expo-image';
import { ChevronRight, RotateCcw } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/SectionTitle';
import { SegmentedTabs } from '@/components/SegmentedTabs';
import { recruiters } from '@/characters/registry';
import { useReglages } from '@/store/reglages';
import { colors, radius, spacing, type ColorToken } from '@/theme';
import type { Langue } from '@/types/domain';

const themes: { key: 'pieges' | 'star' | 'techniques' | 'salaire'; bg: ColorToken }[] = [
  { key: 'pieges', bg: 'warningBg' },
  { key: 'star', bg: 'lavenderBg' },
  { key: 'techniques', bg: 'infoBg' },
  { key: 'salaire', bg: 'successBg' },
];

export default function Entrainement() {
  const { t } = useTranslation();
  const langue = useReglages((s) => s.langue);
  const set = useReglages((s) => s.set);
  const lou = recruiters.lou.expressions.neutre;
  const revisions = 6;

  return (
    <Screen edges={['top']}>
      <View style={styles.intro}>
        <AppText variant="display" accessibilityRole="header">
          {t('entrainement.titre')}
        </AppText>
        <AppText variant="bodyS" color="inkMuted">
          {t('entrainement.texte')}
        </AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t('entrainement.revisions')}, ${t('entrainement.revisionsSous', { n: revisions })}`}
        // TODO(maquette) : l'écran de révision n'est pas dessiné ; il réutilise la leçon.
        onPress={() => router.push('/lecon/points-forts')}
        style={({ pressed }) => [styles.revisions, pressed && styles.pressed]}
      >
        <View style={styles.revIcon}>
          <RotateCcw size={26} color={colors.primary} strokeWidth={2.5} aria-hidden />
        </View>
        <View style={styles.flex}>
          <AppText variant="bodyL" weight="heavy" color="white">
            {t('entrainement.revisions')}
          </AppText>
          <AppText variant="caption" color="white">
            {t('entrainement.revisionsSous', { n: revisions })}
          </AppText>
        </View>
        <ChevronRight size={28} color={colors.white} aria-hidden />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t('entrainement.rapide', { nom: 'Lou' })}, ${t('entrainement.rapideSous')}`}
        onPress={() => router.push('/entretien/micro')}
        style={({ pressed }) => [styles.rapide, pressed && styles.pressed]}
      >
        <View style={styles.rapideTile}>
          <Image source={lou.source} contentFit="contain" style={styles.rapideImg} />
        </View>
        <View style={styles.flex}>
          <AppText variant="body" weight="heavy">
            {t('entrainement.rapide', { nom: t('personnages.recruteurs.lou.nom') })}
          </AppText>
          <AppText variant="caption" color="inkMuted">
            {t('entrainement.rapideSous')}
          </AppText>
        </View>
        <ChevronRight size={28} color={colors.inkMuted} aria-hidden />
      </Pressable>

      <SectionTitle>{t('entrainement.themes')}</SectionTitle>
      <View style={styles.grid}>
        {themes.map(({ key, bg }) => (
          <View key={key} style={styles.cell}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${t(`entrainement.theme.${key}.titre`)}, ${t(`entrainement.theme.${key}.sous`)}, ${t(`entrainement.theme.${key}.compte`)}`}
              // TODO(maquette) : l'écran d'un thème n'est pas dessiné ; il réutilise la leçon.
              onPress={() => router.push('/lecon/points-forts')}
              style={({ pressed }) => [
                styles.tile,
                { backgroundColor: colors[bg] },
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.tileTop}>
                <AppText variant="body" weight="heavy">
                  {t(`entrainement.theme.${key}.titre`)}
                </AppText>
                <AppText variant="micro" color="inkMuted">
                  {t(`entrainement.theme.${key}.sous`)}
                </AppText>
              </View>
              <AppText variant="micro" weight="heavy">
                {t(`entrainement.theme.${key}.compte`)}
              </AppText>
            </Pressable>
          </View>
        ))}
      </View>

      <SectionTitle>{t('entrainement.langue')}</SectionTitle>
      <SegmentedTabs<Langue>
        label={t('entrainement.langue')}
        value={langue}
        onChange={(l) => set({ langue: l })}
        segments={[
          { key: 'fr', label: t('entrainement.langues.fr') },
          // Décision B3 : visibles mais inactifs en phase 1.
          {
            key: 'de',
            label: t('entrainement.langues.de'),
            disabled: true,
            disabledHint: t('entrainement.bientot'),
          },
          {
            key: 'en',
            label: t('entrainement.langues.en'),
            disabled: true,
            disabledHint: t('entrainement.bientot'),
          },
        ]}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.xs },
  flex: { flex: 1 },
  pressed: { opacity: 0.85 },
  revisions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radius.card,
    padding: spacing.lg,
    boxShadow: `0px 5px 0px 0px ${colors.primaryDark}`,
  },
  revIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.tile,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rapide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    padding: spacing.lg,
    boxShadow: `0px 4px 0px 0px ${colors.border}`,
  },
  rapideTile: {
    width: 52,
    height: 52,
    borderRadius: radius.tile,
    backgroundColor: colors.lavenderBg,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  rapideImg: { width: 40, height: 48 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  cell: { width: '50%', padding: 6 },
  tile: {
    borderRadius: radius.card,
    padding: spacing.lg,
    minHeight: 138,
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  tileTop: { gap: spacing.xs },
});
