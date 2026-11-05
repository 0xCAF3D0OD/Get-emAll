import { ChartNoAxesColumn, Mic, Route, User, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { colors, radius, spacing } from '@/theme';

export type TabKey = 'parcours' | 'entrainement' | 'progres' | 'profil';

export const tabIcons: Record<TabKey, LucideIcon> = {
  parcours: Route,
  entrainement: Mic,
  progres: ChartNoAxesColumn,
  profil: User,
};

export type TabBarProps = {
  tabs: { key: TabKey; label: string }[];
  active: TabKey;
  onSelect: (key: TabKey) => void;
};

/** 4 onglets, icône + libellé toujours visibles, actif sur fond primaryLight, zone de 56. */
export function TabBar({ tabs, active, onSelect }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      accessibilityRole="tablist"
      style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}
    >
      {tabs.map(({ key, label }) => {
        const selected = key === active;
        const Icon = tabIcons[key];
        const tint = selected ? colors.primary : colors.inkMuted;
        return (
          <Pressable
            key={key}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected }}
            onPress={() => onSelect(key)}
            style={styles.tab}
          >
            <View style={[styles.iconZone, selected && { backgroundColor: colors.primaryLight }]}>
              <Icon size={26} color={tint} aria-hidden />
            </View>
            <AppText
              variant="tab"
              numberOfLines={1}
              color={selected ? 'primary' : 'inkMuted'}
              weight="bold"
            >
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 2,
    borderTopColor: colors.borderStrong,
    paddingTop: spacing.sm,
  },
  tab: { flex: 1, alignItems: 'center', gap: 2, minHeight: 56, justifyContent: 'center' },
  iconZone: {
    width: 56,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
