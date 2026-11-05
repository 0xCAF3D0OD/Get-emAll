import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';

// Écran rempli au lot suivant.
export default function Progres() {
  return (
    <Screen>
      <AppText variant="display" accessibilityRole="header">
        Progres
      </AppText>
    </Screen>
  );
}
