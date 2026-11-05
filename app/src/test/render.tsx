import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '@/i18n';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

/** Rend un écran avec ses fournisseurs (requêtes, zones sûres, textes). */
export function renderScreen(ui: ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <SafeAreaProvider initialMetrics={metrics}>{ui}</SafeAreaProvider>
    </QueryClientProvider>,
  );
}
