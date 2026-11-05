import { fireEvent, render, screen } from '@testing-library/react-native';

import '@/i18n';

import { ScreenHeader } from '.';

test('titre annoncé, bouton retour libellé', async () => {
  const onBack = jest.fn();
  await render(<ScreenHeader title="Classement" onBack={onBack} />);
  expect(screen.getByRole('header', { name: 'Classement' })).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Retour' }));
  expect(onBack).toHaveBeenCalled();
});
