import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';

import Entrainement from '../../app/(tabs)/entrainement';
import Parcours from '../../app/(tabs)/parcours';
import Profil from '../../app/(tabs)/profil';
import Progres from '../../app/(tabs)/progres';
import { useReglages } from '@/store/reglages';
import { renderScreen } from '@/test/render';

beforeEach(() => jest.clearAllMocks());

test('01 parcours : statistiques lues en phrases, route de 5 étapes, reprise de la leçon', async () => {
  await renderScreen(<Parcours />);
  expect(screen.getByLabelText('Série de 12 jours')).toBeTruthy();
  expect(screen.getByLabelText('3 indices restants')).toBeTruthy();
  await waitFor(() => expect(screen.getByText('Étape 2 sur 5')).toBeTruthy());
  expect(screen.getByRole('header', { name: 'Appel du recruteur' })).toBeTruthy();
  // Le statut des leçons n'est jamais porté par la couleur seule.
  expect(screen.getByLabelText('Ton pitch, faite')).toBeTruthy();
  expect(screen.getByLabelText('Tes points forts, en cours')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Continuer · Tes points forts' }));
  expect(router.push).toHaveBeenCalledWith('/lecon/points-forts');
  await fireEvent.press(screen.getByRole('button', { name: 'Changer d’offre' }));
  expect(router.push).toHaveBeenCalledWith('/offre');
});

test('10 entraînement : révisions, entretien rapide, allemand et anglais inactifs', async () => {
  await renderScreen(<Entrainement />);
  expect(screen.getByRole('header', { name: 'Entraînement libre' })).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: /^Entretien rapide avec Lou/ }));
  expect(router.push).toHaveBeenCalledWith({
    pathname: '/entretien/micro',
    params: { recruteur: 'lou' },
  });
  expect(screen.getAllByRole('button', { name: /Questions pièges/ })).toHaveLength(1);
  await fireEvent.press(screen.getByLabelText(/Deutsch/));
  expect(useReglages.getState().langue).toBe('fr');
});

test('09 progrès : série, graphique décrit en texte, accès au classement', async () => {
  await renderScreen(<Progres />);
  await waitFor(() => expect(screen.getByRole('header', { name: 'Tes progrès' })).toBeTruthy());
  expect(screen.getByRole('image', { name: /XP par jour cette semaine : lundi 20/ })).toBeTruthy();
  expect(screen.getByLabelText('Ton personnage, l’air fier')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: /^Classement de la semaine/ }));
  expect(router.push).toHaveBeenCalledWith('/progres/classement');
});

test('11 profil : objectif en groupe radio, réglages en cases à cocher', async () => {
  await renderScreen(<Profil />);
  await fireEvent.press(screen.getByRole('radio', { name: '30 XP par jour' }));
  expect(useReglages.getState().objectifXp).toBe(30);
  expect(screen.getByRole('radio', { name: '30 XP par jour' })).toBeChecked();
  expect(screen.getByText('Environ 8 minutes par jour.')).toBeTruthy();
  const rappel = screen.getByRole('checkbox', { name: /Rappel quotidien/ });
  const avant = useReglages.getState().rappel;
  await fireEvent.press(rappel);
  expect(useReglages.getState().rappel).toBe(!avant);
  await fireEvent.press(screen.getByRole('button', { name: 'Mon suivi jobA1' }));
  expect(router.push).toHaveBeenCalledWith('/profil/suivi-joba1');
});
