import { render, screen } from '@testing-library/react-native';

import { ProgressBar } from '.';

test('rôle progressbar avec min, max, valeur et libellé', async () => {
  await render(
    <ProgressBar value={3} max={6} label="Progression de la leçon" valueText="3 sur 6" />,
  );
  const barre = screen.getByRole('progressbar', { name: 'Progression de la leçon' });
  expect(barre).toHaveAccessibilityValue({ min: 0, max: 6, now: 3, text: '3 sur 6' });
});
