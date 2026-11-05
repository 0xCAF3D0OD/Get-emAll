import { render, screen } from '@testing-library/react-native';

import Index from '../../app/index';

test("l'écran d'accueil provisoire s'affiche", async () => {
  await render(<Index />);
  expect(screen.getByText("get'emall")).toBeTruthy();
});
