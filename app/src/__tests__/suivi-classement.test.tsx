import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Linking } from 'react-native';

import Classement from '../../app/(tabs)/progres/classement';
import Suivi from '../../app/(tabs)/profil/suivi-joba1';
import { useProfil } from '@/store/profil';
import { renderScreen } from '@/test/render';

beforeEach(() => jest.clearAllMocks());

test('13 classement : ligue sans relégation, pseudonymes, ligne « toi », seuil de montée', async () => {
  await renderScreen(<Classement />);
  await waitFor(() => expect(screen.getByRole('header', { name: 'Ligue Argent' })));
  expect(screen.getByText(/personne ne descend/)).toBeTruthy();
  expect(screen.getByLabelText('1re place, Renard 12, 420 XP')).toBeTruthy();
  expect(screen.getByLabelText('4e place, toi, visible comme Pêche 27, 320 XP')).toBeTruthy();
  expect(screen.getByText('Les 5 premiers montent en ligue Or')).toBeTruthy();
  expect(screen.queryByText('Kevin')).toBeNull();
  await fireEvent.press(screen.getByLabelText('Mes amis'));
  await waitFor(() => expect(screen.getByText('Tes amis apparaîtront ici.')));
});

test('12 suivi jobA1 : progressions lues, liens externes annoncés, entraînement pour l’entretien', async () => {
  const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  useProfil.getState().setOffre(null);
  await renderScreen(<Suivi />);
  await waitFor(() => expect(screen.getByRole('header', { name: 'Ton profil' })));
  expect(screen.getByRole('progressbar', { name: 'Ton profil' })).toBeTruthy();
  const completer = screen.getByRole('button', { name: 'Compléter sur jobA1' });
  expect(completer.props.accessibilityHint).toBe('ouvre jobA1 dans le navigateur');
  await fireEvent.press(completer);
  expect(open).toHaveBeenCalledWith('https://app.joba1.ch');
  expect(
    screen.getByLabelText(/^\[Poste 2\], \[Entreprise 2\].*Statut : Relance conseillée/),
  ).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'S’entraîner pour cet entretien' }));
  expect(useProfil.getState().offreId).toBe('offre-1');
  expect(router.navigate).toHaveBeenCalledWith('/parcours');
});
