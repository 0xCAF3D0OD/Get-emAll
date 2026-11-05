import { render, screen } from '@testing-library/react-native';

import { AppText } from '@/components/AppText';

import { Card } from '.';

test('regroupe son contenu et peut porter un libellé accessible', async () => {
  await render(
    <Card accessible accessibilityLabel="Ligue Argent" raised>
      <AppText>Ligue Argent</AppText>
    </Card>,
  );
  expect(screen.getByLabelText('Ligue Argent')).toBeTruthy();
});
