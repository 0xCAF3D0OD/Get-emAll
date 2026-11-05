import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { colors, radius, type ColorToken } from '@/theme';

/** Tuile d'icône décorative (carré arrondi 14). */
export function IconTile({
  icon: Icon,
  bg = 'primaryLight',
  fg = 'primary',
  size = 56,
}: {
  icon: LucideIcon;
  bg?: ColorToken;
  fg?: ColorToken;
  size?: number;
}) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.tile, { width: size, height: size, backgroundColor: colors[bg] }]}
    >
      <Icon size={size * 0.46} color={colors[fg]} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { borderRadius: radius.tile, alignItems: 'center', justifyContent: 'center' },
});
