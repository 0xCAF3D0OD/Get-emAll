import { act, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import { Confetti } from '.';

test('décoratif et visible par défaut', async () => {
  await render(<Confetti />);
  expect(screen.getByTestId('confetti', { includeHiddenElements: true })).toHaveProp(
    'accessibilityElementsHidden',
    true,
  );
});

test('rien si les animations sont réduites', async () => {
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
  await render(<Confetti />);
  await act(async () => {});
  expect(screen.queryByTestId('confetti', { includeHiddenElements: true })).toBeNull();
});
