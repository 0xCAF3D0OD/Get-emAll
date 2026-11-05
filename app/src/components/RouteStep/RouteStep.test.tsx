import { render, screen } from '@testing-library/react-native';

import '@/i18n';

import { RouteStep } from '.';

test('le statut est écrit en toutes lettres', async () => {
  await render(
    <RouteStep
      rang={3}
      type="rh"
      statut="verrouillee"
      title="Entretien RH avec Lou"
      subtitle="Motivation"
    />,
  );
  expect(screen.getByLabelText(/Étape 3 · verrouillée\. Entretien RH avec Lou/)).toBeTruthy();
});

test('étape en cours : titre annoncé et contenu affiché', async () => {
  await render(
    <RouteStep
      rang={2}
      type="appel"
      statut="en_cours"
      title="Appel du recruteur"
      subtitle="4 leçons"
    >
      <></>
    </RouteStep>,
  );
  expect(screen.getByRole('header', { name: 'Appel du recruteur' })).toBeTruthy();
});
