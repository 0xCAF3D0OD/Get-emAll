import { render, screen } from '@testing-library/react-native';

import '@/i18n';

import { CandidateAvatar } from './CandidateAvatar';
import { RecruiterAvatar } from './RecruiterAvatar';

test('un recruteur dit qui et quelle émotion', async () => {
  await render(<RecruiterAvatar id="lou" expression="impressionne" />);
  expect(screen.getByRole('image', { name: 'Lou, impressionnée' })).toBeTruthy();
});

test('accord au masculin', async () => {
  await render(<RecruiterAvatar id="marc" expression="decu" />);
  expect(screen.getByRole('image', { name: 'Marc, déçu' })).toBeTruthy();
});

test('un avatar décoratif est caché aux lecteurs d’écran', async () => {
  await render(<CandidateAvatar id="avatar-03" decorative />);
  expect(screen.queryByRole('image')).toBeNull();
});
