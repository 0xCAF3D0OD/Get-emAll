import { fireEvent, render, screen } from '@testing-library/react-native';

import '@/i18n';

import { StarExercise, type Morceau } from '.';

const morceaux: Morceau[] = [
  { id: 'r', texte: 'Résultat chiffré', lettre: 'R' },
  { id: 's', texte: 'La situation', lettre: 'S' },
];

test('cases vides annoncées, morceaux touchables, case remplie retirable', async () => {
  const onPlace = jest.fn();
  const onRemove = jest.fn();
  await render(
    <StarExercise
      morceaux={morceaux}
      cases={{ S: 's', T: null, A: null, R: null }}
      onPlace={onPlace}
      onRemove={onRemove}
    />,
  );
  expect(screen.getByLabelText('Tâche, case vide')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Placer : Résultat chiffré' }));
  expect(onPlace).toHaveBeenCalledWith('r');
  await fireEvent.press(screen.getByRole('button', { name: 'Situation : La situation' }));
  expect(onRemove).toHaveBeenCalledWith('S');
});

test('après vérification, chaque case dit si le morceau est bien placé', async () => {
  await render(
    <StarExercise
      morceaux={morceaux}
      cases={{ S: 'r', T: null, A: null, R: 's' }}
      onPlace={jest.fn()}
      onRemove={jest.fn()}
      verified
    />,
  );
  expect(screen.getByLabelText('Situation, mal placé : Résultat chiffré')).toBeTruthy();
});
