import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Keyboard, Mic, Trash2, type LucideIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { recruiters } from '@/characters/registry';
import { useCharacterLabel } from '@/characters/useCharacterLabel';
import { Screen } from '@/components/Screen';
import { useProfil } from '@/store/profil';
import { colors, radius, spacing } from '@/theme';
import type { RecruiterId } from '@/types/characters';

const points: { key: 'micro' | 'audio' | 'ecrit'; icon: LucideIcon }[] = [
  { key: 'micro', icon: Mic },
  { key: 'audio', icon: Trash2 },
  { key: 'ecrit', icon: Keyboard },
];

/**
 * Pré-autorisation du micro (Apple HIG) : on explique avant la demande système,
 * avec un seul bouton « Continuer ».
 */
export default function Micro() {
  const { t } = useTranslation();
  const label = useCharacterLabel();
  const choisi = useProfil((s) => s.recruteur);
  const params = useLocalSearchParams<{ recruteur?: RecruiterId }>();
  const id = params.recruteur && params.recruteur in recruiters ? params.recruteur : choisi;
  const img = recruiters[id].expressions.ecoute;
  const nom = t(`personnages.recruteurs.${id}.nom`);

  const continuer = () => {
    // Phase 2 : la demande système d'accès au micro partira ici. Le squelette n'enregistre rien.
    router.replace(`/entretien/${id}`);
  };

  return (
    <Screen footer={<Button label={t('commun.continuer')} onPress={continuer} />}>
      <View style={[styles.carte, { backgroundColor: colors[recruiters[id].avatarBg] }]}>
        <Image
          source={img.source}
          contentFit="contain"
          accessible
          accessibilityRole="image"
          accessibilityLabel={label.recruiter(id, 'ecoute')}
          style={{ height: 224, width: (224 * img.width) / img.height }}
        />
      </View>
      <AppText variant="display" accessibilityRole="header" style={styles.titre}>
        {t('entretien.micro.titre', { nom })}
      </AppText>
      <View style={styles.points}>
        {points.map(({ key, icon: Icon }) => (
          <View key={key} style={styles.point}>
            <View style={styles.tuile} accessibilityElementsHidden importantForAccessibility="no">
              <Icon size={18} color={colors.primary} strokeWidth={2.25} />
            </View>
            <AppText variant="body" style={styles.flex}>
              {t(`entretien.micro.points.${key}`)}
            </AppText>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  carte: {
    marginTop: spacing.xxxl,
    height: 260,
    borderRadius: radius.scene,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  titre: { marginTop: spacing.lg },
  points: { gap: spacing.md },
  point: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  tuile: {
    width: 36,
    height: 36,
    borderRadius: radius.tile - 4,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
});
