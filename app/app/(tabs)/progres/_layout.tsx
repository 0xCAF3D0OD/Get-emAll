import { Stack } from 'expo-router';

/** Pile de l'onglet : l'écran ouvert depuis l'onglet garde la barre d'onglets visible. */
export default function PileOnglet() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
