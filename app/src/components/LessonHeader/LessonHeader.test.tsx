import { fireEvent, render, screen } from '@testing-library/react-native';

import '@/i18n';

import { LessonHeader } from '.';

test('fermer, progression lue et indices restants', async () => {
  const onClose = jest.fn();
  await render(<LessonHeader n={3} total={6} indices={3} onClose={onClose} />);
  await fireEvent.press(screen.getByRole('button', { name: 'Quitter la leçon' }));
  expect(onClose).toHaveBeenCalled();
  expect(screen.getByRole('progressbar', { name: 'Exercice 3 sur 6' })).toBeTruthy();
  expect(screen.getByLabelText('3 indices restants')).toBeTruthy();
});
