import { render, screen } from '@testing-library/react-native';

import { AppText } from '.';

test('affiche le texte et marque les titres comme header', async () => {
  await render(
    <AppText variant="h1" accessibilityRole="header">
      Bonjour
    </AppText>,
  );
  expect(screen.getByRole('header', { name: 'Bonjour' })).toBeTruthy();
});
