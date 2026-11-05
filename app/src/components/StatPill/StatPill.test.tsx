import { render, screen } from '@testing-library/react-native';

import { StatPill } from '.';

test('annonce une phrase complète', async () => {
  await render(
    <StatPill kind="streak" value="12" unit="jours" accessibilityLabel="Série de 12 jours" />,
  );
  expect(screen.getByLabelText('Série de 12 jours')).toBeTruthy();
  expect(screen.getByText('12')).toBeTruthy();
});
