import { render, screen } from '@testing-library/react-native';

import '@/i18n';

import { Scene } from '.';

test('le personnage de la scène est décrit, le décor est ignoré', async () => {
  await render(<Scene recruiter="nadia" expression="ecoute" width={390} />);
  expect(screen.getByRole('image', { name: 'Nadia, à l’écoute' })).toBeTruthy();
  expect(screen.getAllByRole('image')).toHaveLength(1);
});
