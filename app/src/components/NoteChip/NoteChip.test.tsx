import { render, screen } from '@testing-library/react-native';

import '@/i18n';

import { NoteChip } from '.';

test('la note est écrite en toutes lettres', async () => {
  await render(
    <>
      <NoteChip note="solide" />
      <NoteChip note="a_travailler" />
    </>,
  );
  expect(screen.getByLabelText('Solide')).toBeTruthy();
  expect(screen.getByLabelText('À travailler')).toBeTruthy();
});
