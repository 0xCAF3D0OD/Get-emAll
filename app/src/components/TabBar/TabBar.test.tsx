import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TabBar } from '.';

test('4 onglets, actif annoncé, sélection au toucher', async () => {
  const onSelect = jest.fn();
  await render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      <TabBar
        active="parcours"
        onSelect={onSelect}
        tabs={[
          { key: 'parcours', label: 'Parcours' },
          { key: 'entrainement', label: 'Entraînement' },
          { key: 'progres', label: 'Progrès' },
          { key: 'profil', label: 'Profil' },
        ]}
      />
    </SafeAreaProvider>,
  );
  expect(screen.getAllByRole('tab')).toHaveLength(4);
  expect(screen.getByRole('tab', { name: 'Parcours' })).toBeSelected();
  await fireEvent.press(screen.getByRole('tab', { name: 'Profil' }));
  expect(onSelect).toHaveBeenCalledWith('profil');
});
