import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';

// Écran rempli au lot suivant.
export default function EntretienEcran() {
  return (
    <Screen>
      <AppText variant="display" accessibilityRole="header">
        Entretien
      </AppText>
    </Screen>
  );
}
