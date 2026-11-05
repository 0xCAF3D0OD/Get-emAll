import { render, screen } from '@testing-library/react-native';

import '@/i18n';

import { LeaderboardRow } from '.';

test('ligne d’un autre membre : rang, pseudonyme, XP lus', async () => {
  await render(<LeaderboardRow rang={1} pseudonyme="Renard 12" avatar="avatar-10" xp={420} />);
  expect(screen.getByLabelText('1re place, Renard 12, 420 XP')).toBeTruthy();
});

test('ligne de la personne : annoncée comme « toi » avec son pseudonyme', async () => {
  await render(<LeaderboardRow rang={4} pseudonyme="Pêche 27" avatar="avatar-01" xp={320} moi />);
  expect(screen.getByLabelText('4e place, toi, visible comme Pêche 27, 320 XP')).toBeTruthy();
  expect(screen.getByText('Toi')).toBeTruthy();
});
