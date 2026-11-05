import { fireEvent, render, screen } from '@testing-library/react-native';

import { SpeechBubble } from '.';

test('question en titre et bouton réécouter nommé', async () => {
  const onReplay = jest.fn();
  await render(
    <SpeechBubble
      speaker="Lou demande"
      text="« Parlez-moi de vous. »"
      onReplay={onReplay}
      replayLabel="Réécouter la question"
    />,
  );
  expect(screen.getByRole('header', { name: '« Parlez-moi de vous. »' })).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Réécouter la question' }));
  expect(onReplay).toHaveBeenCalled();
});
