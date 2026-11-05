import { fireEvent, render, screen } from '@testing-library/react-native';

import { RecordButton } from '.';

test('bouton nommé, 96 px, appelle onPress', async () => {
  const onPress = jest.fn();
  await render(
    <RecordButton state="recording" onPress={onPress} accessibilityLabel="Terminer ma réponse" />,
  );
  const b = screen.getByRole('button', { name: 'Terminer ma réponse' });
  await fireEvent.press(b);
  expect(onPress).toHaveBeenCalled();
});
