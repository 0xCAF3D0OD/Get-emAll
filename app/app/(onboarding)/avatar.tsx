import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { StepsHeader } from '@/components/StepsHeader';
import { avatars } from '@/characters/registry';
import { useProfil } from '@/store/profil';
import { colors, radius, spacing } from '@/theme';

export default function ChoixAvatar() {
  const { t } = useTranslation();
  const avatar = useProfil((s) => s.avatar);
  const setAvatar = useProfil((s) => s.setAvatar);
  const entreeTerminee = useProfil((s) => s.entreeTerminee);

  return (
    <Screen
      footer={
        <Button
          label={t('commun.continuer')}
          // Depuis le profil (« Changer d'avatar »), on revient simplement en arrière.
          onPress={() => (entreeTerminee ? router.back() : router.push('/offre'))}
        />
      }
    >
      <StepsHeader step={1} onBack={() => router.back()} />
      <View style={styles.intro}>
        <AppText variant="display" accessibilityRole="header">
          {t('entree.avatar.titre')}
        </AppText>
        <AppText variant="bodyL" color="inkMuted">
          {t('entree.avatar.texte')}
        </AppText>
      </View>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={t('entree.avatar.groupe')}
        style={styles.grid}
      >
        {avatars.map((a) => {
          const selected = a.id === avatar;
          return (
            <View key={a.id} style={styles.cell}>
              <Pressable
                accessibilityRole="radio"
                accessibilityLabel={t(`personnages.avatars.${a.id}`)}
                accessibilityState={{ checked: selected, selected }}
                onPress={() => setAvatar(a.id)}
                style={[styles.tile, selected ? styles.tileSelected : styles.tileIdle]}
              >
                <Image source={a.image.source} contentFit="contain" style={styles.image} />
              </Pressable>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm, marginTop: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 },
  cell: { width: '25%', padding: 5 },
  tile: {
    aspectRatio: 80 / 103,
    borderRadius: radius.cardSm,
    borderWidth: 3,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileIdle: { backgroundColor: colors.surface, borderColor: colors.borderStrong },
  // Sélection : bordure primaire, fond primaryLight et halo.
  tileSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    boxShadow: `0px 0px 0px 4px ${colors.primaryRing}`,
  },
  image: { width: '100%', height: '100%' },
});
