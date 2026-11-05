import { fireEvent, render, screen } from '@testing-library/react-native';

import '@/i18n';

import { StepsHeader } from '.';

test('progression annoncée et retour libellé', async () => {
  const onBack = jest.fn();
  await render(<StepsHeader step={2} onBack={onBack} />);
  expect(screen.getByRole('progressbar')).toHaveAccessibilityValue({
    now: 2,
    max: 3,
    text: 'Étape 2 sur 3',
  });
  await fireEvent.press(screen.getByRole('button', { name: 'Retour' }));
  expect(onBack).toHaveBeenCalled();
});
