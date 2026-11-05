import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';

import Entretien from '../../app/entretien/[recruteur]';
import Bilan from '../../app/entretien/bilan';
import Micro from '../../app/entretien/micro';
import Reecoute from '../../app/entretien/reecoute';
import { useParcoursStore } from '@/store/parcours';
import { renderScreen } from '@/test/render';

const params = useLocalSearchParams as jest.Mock;
const parcours = useParcoursStore.getState();

beforeEach(() => {
  jest.clearAllMocks();
  params.mockReturnValue({});
  useParcoursStore.setState(parcours, true);
});

test('05 micro : explication avant la demande système, un seul bouton', async () => {
  params.mockReturnValue({ recruteur: 'lou' });
  await renderScreen(<Micro />);
  expect(screen.getByRole('header', { name: 'Lou va écouter ta réponse' })).toBeTruthy();
  expect(screen.getByRole('image', { name: 'Lou, à l’écoute' })).toBeTruthy();
  expect(screen.getAllByRole('button')).toHaveLength(1);
  await fireEvent.press(screen.getByRole('button', { name: 'Continuer' }));
  expect(router.replace).toHaveBeenCalledWith('/entretien/lou');
});

const ouvrir = async () => {
  params.mockReturnValue({ recruteur: 'lou' });
  await renderScreen(<Entretien />);
  await waitFor(() => expect(screen.getByRole('header', { name: /Parlez-moi de vous\./ })));
  expect(screen.getByText('Question 1 sur 5')).toBeTruthy();
  // La scène se dessine une fois sa largeur mesurée.
  await fireEvent(screen.getByTestId('scene'), 'layout', {
    nativeEvent: { layout: { x: 0, y: 0, width: 390, height: 392 } },
  });
};

test('06 → 06b : question, enregistrement, réflexion puis réaction', async () => {
  await ouvrir();
  expect(screen.getByRole('header', { name: /Parlez-moi de vous\./ })).toBeTruthy();
  expect(screen.getByRole('image', { name: 'Lou, attentive' })).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Répondre à voix haute' }));
  expect(screen.getByRole('image', { name: 'Lou, à l’écoute' })).toBeTruthy();
  expect(screen.getByLabelText(/^Enregistrement en cours, 0:00 sur 1:30/)).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Terminer ma réponse' }));
  expect(screen.getByText('Lou réfléchit')).toBeTruthy();
  expect(screen.getByRole('image', { name: 'Lou, pensive' })).toBeTruthy();
  await waitFor(() => expect(screen.getByRole('button', { name: 'Question suivante' })), {
    timeout: 4000,
  });
  expect(screen.getByRole('image', { name: 'Lou, impressionnée' })).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Question suivante' }));
  expect(screen.getByText('Question 2 sur 5')).toBeTruthy();
});

test('06 : réponse écrite et indice', async () => {
  await ouvrir();
  await fireEvent.press(screen.getByRole('button', { name: 'Un indice' }));
  expect(screen.getByText(/Présent, passé, futur/)).toBeTruthy();
  expect(useParcoursStore.getState().indices).toBe(parcours.indices - 1);
  await fireEvent.press(screen.getByRole('button', { name: 'Répondre par écrit' }));
  expect(screen.getByRole('button', { name: 'Envoyer ma réponse' })).toBeDisabled();
  await fireEvent.changeText(screen.getByLabelText('Ta réponse écrite'), 'Je suis DevOps.');
  await fireEvent.press(screen.getByRole('button', { name: 'Envoyer ma réponse' }));
  expect(screen.getByText('Je suis DevOps.')).toBeTruthy();
}, 10000);

test('07 compte-rendu : chiffres lus, notes écrites, relecture', async () => {
  await renderScreen(<Bilan />);
  await waitFor(() => expect(screen.getByRole('header', { name: 'Entretien terminé !' })));
  expect(screen.getByLabelText('40 XP gagnés')).toBeTruthy();
  expect(screen.getByLabelText('Clarté et rythme : À travailler')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Relire mes réponses' }));
  expect(router.push).toHaveBeenCalledWith('/entretien/reecoute');
});

test('08 relecture : « Une réponse plus forte » dépliable, état annoncé', async () => {
  await renderScreen(<Reecoute />);
  await waitFor(() =>
    expect(screen.getAllByRole('button', { name: 'Voir une réponse plus forte' })),
  );
  const bouton = screen.getAllByRole('button', { name: 'Voir une réponse plus forte' })[1]!;
  expect(bouton).not.toBeExpanded();
  await fireEvent.press(bouton);
  const masquer = screen.getByRole('button', { name: 'Masquer le conseil' });
  expect(masquer).toBeExpanded();
  expect(screen.getByText(/Le service est revenu en 12 minutes/)).toBeTruthy();
});
