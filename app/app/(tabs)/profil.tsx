import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';

// Écran rempli au lot suivant.
export default function Profil() {
  return (
    <Screen>
      <AppText variant="display" accessibilityRole="header">
        Profil
      </AppText>
    </Screen>
  );
}
