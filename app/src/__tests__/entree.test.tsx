import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';

import Accueil from '../../app/(onboarding)/accueil';
import ChoixAvatar from '../../app/(onboarding)/avatar';
import ChoixOffre from '../../app/(onboarding)/offre';
import ChoixRecruteur from '../../app/(onboarding)/recruteur';
import { useProfil } from '@/store/profil';
import { renderScreen } from '@/test/render';

beforeEach(() => jest.clearAllMocks());

test('A1 accueil : titre, illustration décrite, Commencer mène au choix de l’avatar', async () => {
  await renderScreen(<Accueil />);
  expect(screen.getByRole('header', { name: /Entraîne-toi aux entretiens/ })).toBeTruthy();
  expect(screen.getByRole('image', { name: /quatre recruteurs/ })).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Commencer' }));
  expect(router.push).toHaveBeenCalledWith('/avatar');
});

test('A2 avatar : 11 choix en groupe radio, un seul coché', async () => {
  await renderScreen(<ChoixAvatar />);
  const radios = screen.getAllByRole('radio');
  expect(radios).toHaveLength(11);
  await fireEvent.press(screen.getByRole('radio', { name: 'Avatar avec foulard' }));
  expect(useProfil.getState().avatar).toBe('avatar-07');
  expect(
    screen.getAllByRole('radio').filter((r) => r.props.accessibilityState?.checked),
  ).toHaveLength(1);
});

test('A3 offre : offres du suivi, carte surlignée = carte cochée', async () => {
  await renderScreen(<ChoixOffre />);
  await waitFor(() => expect(screen.getByRole('radio', { name: /\[Autre poste\]/ })).toBeTruthy());
  await fireEvent.press(screen.getByRole('radio', { name: /\[Autre poste\]/ }));
  expect(screen.getByRole('radio', { name: /\[Autre poste\]/ })).toBeChecked();
  expect(screen.getByRole('radio', { name: /Pas d’offre précise/ })).not.toBeChecked();
});

test('A4 recruteur : présentation du recruteur choisi, puis première leçon', async () => {
  await renderScreen(<ChoixRecruteur />);
  await fireEvent.press(screen.getByRole('radio', { name: /^Nadia/ }));
  expect(screen.getByText(/Nadia relance chaque réponse floue/)).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Commencer ma première leçon' }));
  expect(useProfil.getState().entreeTerminee).toBe(true);
  expect(router.push).toHaveBeenCalledWith('/lecon/points-forts');
});
