import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { recruiters } from '@/characters/registry';
import { colors, radius, spacing } from '@/theme';
import type { RecruiterId } from '@/types/characters';

// Hauteurs relevées sur la maquette A1 (en pt).
const groupe: { id: RecruiterId; h: number }[] = [
  { id: 'marc', h: 112 },
  { id: 'nadia', h: 167 },
  { id: 'lou', h: 162 },
  { id: 'tom', h: 155 },
];

export default function Accueil() {
  const { t } = useTranslation();
  return (
    <Screen
      footer={
        <View style={styles.actions}>
          <Button label={t('entree.accueil.commencer')} onPress={() => router.push('/avatar')} />
          <Button
            variant="ghost"
            label={t('entree.accueil.compte')}
            // TODO(maquette) : écran « Se connecter avec jobA1 » non dessiné.
            onPress={() => router.push({ pathname: '/a-dessiner', params: { ecran: 'connexion' } })}
          />
        </View>
      }
    >
      <AppText variant="h4" color="ink">
        {t('app.marque')}
      </AppText>
      <View
        style={styles.illustration}
        accessible
        accessibilityRole="image"
        accessibilityLabel={t('entree.accueil.illustration')}
      >
        <View style={styles.sun} />
        <View style={styles.floor} />
        <View style={styles.group}>
          {groupe.map(({ id, h }) => {
            const img = recruiters[id].expressions.neutre;
            return (
              <Image
                key={id}
                source={img.source}
                contentFit="contain"
                style={{ height: h, width: (h * img.width) / img.height }}
              />
            );
          })}
        </View>
      </View>
      <AppText variant="display" accessibilityRole="header" style={styles.title}>
        {t('entree.accueil.titre')}
      </AppText>
      <AppText variant="bodyL" color="inkMuted">
        {t('entree.accueil.texte')}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  illustration: {
    aspectRatio: 350 / 380,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.scene,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  sun: {
    position: 'absolute',
    top: '10%',
    width: '63%',
    aspectRatio: 1,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  floor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: colors.primaryRing,
  },
  group: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, marginBottom: 30 },
  title: { fontSize: 30, lineHeight: 36, marginTop: spacing.sm },
  actions: { gap: spacing.md },
});
