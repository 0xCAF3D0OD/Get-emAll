import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';

// Écran rempli au lot suivant.
export default function Micro() {
  return (
    <Screen>
      <AppText variant="display" accessibilityRole="header">
        Micro
      </AppText>
    </Screen>
  );
}
