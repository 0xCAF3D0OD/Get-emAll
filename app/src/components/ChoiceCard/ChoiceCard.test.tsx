import { fireEvent, render, screen } from '@testing-library/react-native';

import { AppText } from '@/components/AppText';

import { ChoiceCard } from '.';

test('rôle radio, état coché annoncé', async () => {
  const onPress = jest.fn();
  await render(
    <ChoiceCard selected accessibilityLabel="Lou, Facile" onPress={onPress}>
      <AppText>Lou</AppText>
    </ChoiceCard>,
  );
  const radio = screen.getByRole('radio', { name: 'Lou, Facile' });
  expect(radio).toBeChecked();
  await fireEvent.press(radio);
  expect(onPress).toHaveBeenCalled();
});
