import { fireEvent, render, screen } from '@testing-library/react-native';

import '@/i18n';

import { FeedbackPanel } from '.';

test('réussite : titre, avatar impressionné, pastille, confettis, bouton', async () => {
  const onContinue = jest.fn();
  await render(
    <FeedbackPanel
      variant="success"
      recruiter="lou"
      title="Juste !"
      badge="3 d’affilée · +5 XP"
      explanation="Un fait concret."
      buttonLabel="Continuer"
      onContinue={onContinue}
    />,
  );
  expect(screen.getByRole('header', { name: 'Juste !' })).toBeTruthy();
  expect(screen.getByRole('image', { name: /Lou.*impressionnée/ })).toBeTruthy();
  expect(screen.getByText('3 d’affilée · +5 XP')).toBeTruthy();
  expect(screen.getByTestId('confetti', { includeHiddenElements: true })).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Continuer' }));
  expect(onContinue).toHaveBeenCalled();
});

test('erreur : avatar déçu, mention de révision, pas de confettis', async () => {
  await render(
    <FeedbackPanel
      variant="error"
      recruiter="lou"
      title="Pas tout à fait"
      explanation="Préfère un fait concret."
      note="Cette question reviendra plus tard dans ta révision."
      buttonLabel="Compris"
      onContinue={jest.fn()}
    />,
  );
  expect(screen.getByRole('image', { name: /Lou.*déçue/ })).toBeTruthy();
  expect(screen.getByText(/reviendra plus tard/)).toBeTruthy();
  expect(screen.queryByTestId('confetti', { includeHiddenElements: true })).toBeNull();
  expect(screen.getByRole('button', { name: 'Compris' })).toBeTruthy();
});
