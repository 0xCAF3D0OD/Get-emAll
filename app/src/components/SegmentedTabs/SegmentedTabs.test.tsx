import { fireEvent, render, screen } from '@testing-library/react-native';

import { SegmentedTabs } from '.';

test('liste d’onglets : le sélectionné est annoncé, un inactif ne réagit pas', async () => {
  const onChange = jest.fn();
  await render(
    <SegmentedTabs
      label="Langue de l'entretien"
      value="fr"
      onChange={onChange}
      segments={[
        { key: 'fr', label: 'Français' },
        { key: 'de', label: 'Deutsch', disabled: true, disabledHint: 'bientôt' },
      ]}
    />,
  );
  expect(screen.getByLabelText("Langue de l'entretien")).toHaveProp('accessibilityRole', 'tablist');
  expect(screen.getByRole('tab', { name: 'Français' })).toBeSelected();
  const de = screen.getByRole('tab', { name: 'Deutsch, bientôt' });
  expect(de).toBeDisabled();
  await fireEvent.press(de);
  expect(onChange).not.toHaveBeenCalled();
});
