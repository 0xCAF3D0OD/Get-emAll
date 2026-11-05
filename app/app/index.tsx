import { Redirect } from 'expo-router';

import { useProfil } from '@/store/profil';

/** Redirige vers l'entrée tant qu'elle n'est pas terminée, sinon vers le Parcours. */
export default function Index() {
  const entreeTerminee = useProfil((s) => s.entreeTerminee);
  return <Redirect href={entreeTerminee ? '/parcours' : '/accueil'} />;
}
