import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { TabBar, type TabKey } from '@/components/TabBar';

const order: TabKey[] = ['parcours', 'entrainement', 'progres', 'profil'];

export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigateToTab }) => {
        const nom = state.routes[state.index]?.name ?? 'parcours';
        return (
          <TabBar
            tabs={order.map((key) => ({ key, label: t(`onglets.${key}`) }))}
            active={nom as TabKey}
            onSelect={(key) => {
              const route = state.routes.find((r) => r.name === key);
              if (route) navigateToTab(route.key);
            }}
          />
        );
      }}
    >
      {order.map((name) => (
        <Tabs.Screen key={name} name={name} options={{ title: t(`onglets.${name}`) }} />
      ))}
    </Tabs>
  );
}
