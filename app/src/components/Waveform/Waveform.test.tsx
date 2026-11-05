import { render, screen } from '@testing-library/react-native';

import { Waveform } from '.';

test('onde décorative, cachée au lecteur d’écran', async () => {
  await render(<Waveform />);
  expect(screen.queryByTestId('waveform')).toBeNull();
  expect(screen.getByTestId('waveform', { includeHiddenElements: true })).toBeTruthy();
});
