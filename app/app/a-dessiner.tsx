import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';

/**
 * TODO(maquette) : écran exigé par le cahier technique mais pas encore dessiné (décision B4).
 * Remplace temporairement : connexion jobA1, consentements, confidentialité, choix du métier,
 * collage d'une offre, quitter le classement, pause de l'entretien.
 */
export default function ADessiner() {
  const { t } = useTranslation();
  const { ecran } = useLocalSearchParams<{ ecran?: string }>();
  const nom = t(`aDessiner.ecrans.${ecran ?? 'inconnu'}`, { defaultValue: ecran ?? '' });
  return (
    <Screen>
      <ScreenHeader title={nom} onBack={() => router.back()} />
      <AppText variant="body" color="inkMuted">
        {t('aDessiner.texte')}
      </AppText>
    </Screen>
  );
}
