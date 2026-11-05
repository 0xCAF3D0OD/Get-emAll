import { render, screen } from '@testing-library/react-native';

import { ThinkingDots } from '.';

test('décoratif : caché aux lecteurs d’écran', async () => {
  await render(<ThinkingDots />);
  expect(screen.getByTestId('thinking-dots', { includeHiddenElements: true })).toHaveProp(
    'accessibilityElementsHidden',
    true,
  );
});
