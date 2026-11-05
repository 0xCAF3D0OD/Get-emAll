// Modules natifs simulés pour les tests. Reanimated passe par son résolveur Jest (package.json).
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));
