import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { CandidateAvatar } from '@/components/Avatar/CandidateAvatar';
import { colors, radius, spacing, type ColorToken } from '@/theme';
import type { AvatarId } from '@/types/characters';

export type LeaderboardRowProps = {
  rang: number;
  pseudonyme: string;
  avatar: AvatarId;
  xp: number;
  /** Ligne de la personne : surlignée et annoncée comme « toi ». */
  moi?: boolean;
};

const medailles: Record<number, ColorToken> = {
  1: 'medalGold',
  2: 'medalSilver',
  3: 'medalBronze',
};

/** Rang (médailles 1 à 3), avatar, pseudonyme, XP. Jamais le vrai nom. */
export function LeaderboardRow({ rang, pseudonyme, avatar, xp, moi = false }: LeaderboardRowProps) {
  const { t } = useTranslation();
  const medaille = medailles[rang];
  const place = rang === 1 ? t('classement.premiere') : t('classement.nieme', { n: rang });
  return (
    <View
      accessible
      accessibilityLabel={
        moi
          ? t('classement.rangMoiLu', { place, nom: pseudonyme, xp })
          : t('classement.rangLu', { place, nom: pseudonyme, xp })
      }
      style={[styles.row, moi && styles.moi]}
    >
      <View style={[styles.rang, medaille && { backgroundColor: colors[medaille] }]}>
        <AppText variant="bodyS" weight="heavy" color={medaille ? 'ink' : 'inkMuted'}>
          {rang}
        </AppText>
      </View>
      <CandidateAvatar id={avatar} size={40} decorative />
      <View style={styles.flex}>
        <AppText variant="bodyS" weight="heavy">
          {moi ? t('classement.toi') : pseudonyme}
        </AppText>
        {moi ? (
          <AppText variant="tab" weight="semi" color="primary">
            {t('classement.visible', { nom: pseudonyme })}
          </AppText>
        ) : null}
      </View>
      <AppText variant="bodyS" weight="heavy">
        {t('classement.xp', { n: xp })}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.cardSm,
    borderWidth: 2,
    borderColor: colors.surface,
    paddingHorizontal: spacing.md,
    minHeight: 58,
  },
  moi: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  rang: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
});
