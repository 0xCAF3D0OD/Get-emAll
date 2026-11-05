import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import Lecon from '../../app/lecon/[id]';
import { useParcoursStore } from '@/store/parcours';
import { renderScreen } from '@/test/render';

const initial = useParcoursStore.getState();
beforeEach(() => {
  jest.clearAllMocks();
  useParcoursStore.setState(initial, true);
});

const ouvrir = async () => {
  await renderScreen(<Lecon />);
  await waitFor(() => expect(screen.getByRole('progressbar', { name: 'Exercice 1 sur 6' })));
};

test('02 → 03 : Vérifier inactif sans choix, puis réussite avec série et haptique', async () => {
  await ouvrir();
  expect(screen.getByRole('button', { name: 'Vérifier' })).toBeDisabled();
  await fireEvent.press(screen.getByRole('radio', { name: /J’automatise/ }));
  await fireEvent.press(screen.getByRole('button', { name: 'Vérifier' }));
  expect(screen.getByRole('header', { name: 'Juste !' })).toBeTruthy();
  expect(screen.getByText('3 d’affilée · +5 XP')).toBeTruthy();
  expect(screen.getByLabelText(/^Ta réponse, correcte/)).toBeTruthy();
  expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  expect(useParcoursStore.getState().xpAujourdhui).toBe(initial.xpAujourdhui + 5);
  await fireEvent.press(screen.getByRole('button', { name: 'Continuer' }));
  expect(screen.getByRole('progressbar', { name: 'Exercice 2 sur 6' })).toBeTruthy();
});

test('03b : erreur, bonne réponse montrée, question remise en révision', async () => {
  await ouvrir();
  await fireEvent.press(screen.getByRole('radio', { name: /perfectionniste/ }));
  await fireEvent.press(screen.getByRole('button', { name: 'Vérifier' }));
  expect(screen.getByRole('header', { name: 'Pas tout à fait' })).toBeTruthy();
  expect(screen.getByLabelText(/^Ta réponse, incorrecte/)).toBeTruthy();
  expect(screen.getByLabelText(/^Bonne réponse : « J’automatise/)).toBeTruthy();
  expect(screen.getByText(/comme la réponse cochée/)).toBeTruthy();
  expect(screen.getByText('Cette question reviendra plus tard dans ta révision.')).toBeTruthy();
  expect(Haptics.notificationAsync).toHaveBeenCalledWith('warning');
  expect(useParcoursStore.getState().aReviser).toContain('ex-1');
});

test('04 STAR : morceaux placés au toucher, Vérifier actif une fois les 4 cases remplies', async () => {
  await ouvrir();
  for (let i = 0; i < 4; i++) await fireEvent.press(screen.getByRole('button', { name: 'Passer' }));
  expect(screen.getByRole('header', { name: 'Remets ta réponse dans l’ordre' })).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Passer' })).toBeNull();
  for (const debut of ['Nos déploiements', 'On m’a confié', 'J’ai monté', '10 minutes']) {
    await fireEvent.press(screen.getByRole('button', { name: new RegExp(`^Placer : ${debut}`) }));
  }
  await fireEvent.press(screen.getByRole('button', { name: 'Vérifier' }));
  expect(screen.getByRole('header', { name: 'Juste !' })).toBeTruthy();
  expect(screen.getByLabelText(/^Résultat, bien placé/)).toBeTruthy();
});

test('fermer quitte la leçon', async () => {
  await ouvrir();
  await fireEvent.press(screen.getByRole('button', { name: 'Quitter la leçon' }));
  expect(router.back).toHaveBeenCalled();
});
