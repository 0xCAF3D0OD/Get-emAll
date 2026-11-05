import { fireEvent, render, screen } from '@testing-library/react-native';

import { CheckboxRow } from '.';

test('rôle case à cocher, état annoncé, bascule au toucher', async () => {
  const onChange = jest.fn();
  await render(<CheckboxRow title="Sons et vibrations" checked onChange={onChange} />);
  const box = screen.getByRole('checkbox', { name: 'Sons et vibrations' });
  expect(box).toBeChecked();
  await fireEvent.press(box);
  expect(onChange).toHaveBeenCalledWith(false);
});
