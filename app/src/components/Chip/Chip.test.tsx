import { render, screen } from '@testing-library/react-native';

import { Chip } from '.';

test.each([
  ['done', 'Ton pitch, terminée'],
  ['now', 'Tes points forts, en cours'],
  ['next', 'Tes questions, à venir'],
] as const)('pastille %s : libellé accessible avec le statut écrit', async (kind, label) => {
  await render(<Chip kind={kind} label="x" accessibilityLabel={label} />);
  expect(screen.getByLabelText(label)).toBeTruthy();
});

test('pastille de statut avec couleurs en props', async () => {
  await render(<Chip kind="status" label="Relance conseillée" bg="warningBg" fg="warningText" />);
  expect(screen.getByText('Relance conseillée')).toBeTruthy();
});
