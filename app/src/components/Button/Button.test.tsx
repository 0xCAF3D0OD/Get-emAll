import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from '.';

describe('Button', () => {
  test('a le rôle bouton, son libellé, et réagit au toucher', async () => {
    const onPress = jest.fn();
    await render(<Button label="Continuer" onPress={onPress} />);
    const bouton = screen.getByRole('button', { name: 'Continuer' });
    await fireEvent.press(bouton);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('désactivé : annoncé comme tel et sans effet', async () => {
    const onPress = jest.fn();
    await render(<Button label="Vérifier" onPress={onPress} disabled />);
    const bouton = screen.getByRole('button', { name: 'Vérifier' });
    expect(bouton).toBeDisabled();
    await fireEvent.press(bouton);
    expect(onPress).not.toHaveBeenCalled();
  });

  test('chargement : annoncé occupé', async () => {
    await render(<Button label="Envoyer" loading />);
    expect(screen.getByRole('button', { name: 'Envoyer' })).toBeBusy();
  });

  test.each(['success', 'danger', 'secondary', 'ghost'] as const)('variante %s', async (v) => {
    await render(<Button label="Compris" variant={v} />);
    expect(screen.getByRole('button', { name: 'Compris' })).toBeTruthy();
  });
});
