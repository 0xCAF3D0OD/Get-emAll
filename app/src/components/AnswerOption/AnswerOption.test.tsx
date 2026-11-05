import { fireEvent, render, screen } from '@testing-library/react-native';

import '@/i18n';

import { AnswerOption } from '.';

test('avant vérification : radio touchable, cochée si sélectionnée', async () => {
  const onPress = jest.fn();
  await render(<AnswerOption text="« Oui »" state="selected" onPress={onPress} />);
  const radio = screen.getByRole('radio', { name: '« Oui »' });
  expect(radio).toBeChecked();
  await fireEvent.press(radio);
  expect(onPress).toHaveBeenCalled();
});

test('après vérification : le statut est dit en toutes lettres', async () => {
  await render(
    <>
      <AnswerOption text="A" state="incorrect" chosen />
      <AnswerOption text="B" state="correct" />
      <AnswerOption text="C" state="frozen" />
    </>,
  );
  expect(screen.getByLabelText('Ta réponse, incorrecte : A')).toBeTruthy();
  expect(screen.getByLabelText('Bonne réponse : B')).toBeTruthy();
  expect(screen.getByLabelText('C')).toBeTruthy();
  expect(screen.queryAllByRole('radio')).toHaveLength(0);
});
