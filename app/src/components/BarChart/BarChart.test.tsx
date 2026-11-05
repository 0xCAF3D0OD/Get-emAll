import { render, screen } from '@testing-library/react-native';

import { BarChart } from '.';

test('le graphique a une description textuelle complète', async () => {
  await render(
    <BarChart
      description="lundi 20, aujourd’hui 30"
      bars={[
        { label: 'L', value: 20 },
        { label: 'Auj.', value: 30, highlight: true },
      ]}
    />,
  );
  expect(screen.getByRole('image', { name: 'lundi 20, aujourd’hui 30' })).toBeTruthy();
});
