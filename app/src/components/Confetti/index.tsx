import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors } from '@/theme';

const DURATION = 1100;
const pieces = [
  { x: 0.06, color: colors.coral, rot: 30, drift: -10 },
  { x: 0.18, color: colors.primaryRing, rot: -20, drift: 8 },
  { x: 0.32, color: colors.successFill, rot: 45, drift: -6 },
  { x: 0.44, color: colors.xp, rot: -35, drift: 12 },
  { x: 0.56, color: colors.lavender, rot: 25, drift: -12 },
  { x: 0.68, color: colors.streak, rot: -15, drift: 6 },
  { x: 0.8, color: colors.primaryRing, rot: 40, drift: -8 },
  { x: 0.92, color: colors.coral, rot: -30, drift: 10 },
];

function Piece({ p, t }: { p: (typeof pieces)[number]; t: SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({
    opacity: t.value < 0.8 ? 1 : (1 - t.value) * 5,
    transform: [
      { translateY: -30 * t.value + 50 * t.value * t.value },
      { translateX: p.drift * t.value },
      { rotate: `${p.rot * (1 + t.value)}deg` },
    ],
  }));
  return (
    <Animated.View
      style={[styles.piece, { left: `${p.x * 100}%`, backgroundColor: p.color }, style]}
    />
  );
}

/** 8 rectangles de la palette, une seule fois, 1,1 s. Rien si les animations sont réduites. */
export function Confetti() {
  const reduced = useReducedMotion();
  const t = useSharedValue(0);
  useEffect(() => {
    if (!reduced) t.value = withTiming(1, { duration: DURATION });
  }, [reduced, t]);
  if (reduced) return null;
  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      testID="confetti"
    >
      {pieces.map((p, i) => (
        <Piece key={i} p={p} t={t} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute', top: '40%', width: 8, height: 14, borderRadius: 2 },
});
