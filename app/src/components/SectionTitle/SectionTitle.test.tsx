import { render, screen } from '@testing-library/react-native';

import { SectionTitle } from '.';

test('est annoncé comme titre', async () => {
  await render(<SectionTitle>Par thème</SectionTitle>);
  expect(screen.getByRole('header', { name: 'Par thème' })).toBeTruthy();
});
