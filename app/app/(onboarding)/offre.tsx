import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';

// Écran rempli au lot suivant.
export default function ChoixOffre() {
  return (
    <Screen>
      <AppText variant="display" accessibilityRole="header">
        Offre
      </AppText>
    </Screen>
  );
}
