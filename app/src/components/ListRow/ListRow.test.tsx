import { fireEvent, render, screen } from '@testing-library/react-native';

import { ListRow } from '.';

test('ligne touchable : rôle bouton, libellé complet', async () => {
  const onPress = jest.fn();
  await render(<ListRow title="Classement de la semaine" subtitle="Tu es 4e" onPress={onPress} />);
  await fireEvent.press(screen.getByRole('button', { name: 'Classement de la semaine, Tu es 4e' }));
  expect(onPress).toHaveBeenCalled();
});

test('ligne simple : pas de bouton', async () => {
  await render(<ListRow title="Recruteur" />);
  expect(screen.queryByRole('button')).toBeNull();
  expect(screen.getByText('Recruteur')).toBeTruthy();
});
