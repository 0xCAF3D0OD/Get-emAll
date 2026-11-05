import { render, screen } from '@testing-library/react-native';

import { LevelDots } from '.';

test('le niveau est écrit en toutes lettres', async () => {
  await render(<LevelDots level={2} label="Moyen" />);
  expect(screen.getByText('Moyen')).toBeTruthy();
});
