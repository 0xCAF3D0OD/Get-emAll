import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, spacing } from '@/theme';

const CYCLE = 1200;

function Dot({ index, reduced }: { index: number; reduced: boolean }) {
  const v = useSharedValue(0.35);
  useEffect(() => {
    if (reduced) {
      cancelAnimation(v);
      v.value = 1;
      return;
    }
    v.value = withDelay(
      index * (CYCLE / 6),
      withRepeat(
        withSequence(
          withTiming(1, { duration: CYCLE / 3 }),
          withTiming(0.35, { duration: CYCLE / 3 }),
          withTiming(0.35, { duration: CYCLE / 3 }),
        ),
        -1,
      ),
    );
    return () => cancelAnimation(v);
  }, [index, reduced, v]);
  const style = useAnimatedStyle(() => ({
    opacity: v.value,
    transform: [{ scale: 0.8 + v.value * 0.2 }],
  }));
  return <Animated.View style={[styles.dot, style]} />;
}

/** Trois points qui pulsent (1,2 s en boucle), immobiles si les animations sont réduites. */
export function ThinkingDots() {
  const reduced = useReducedMotion();
  return (
    <View
      style={styles.row}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      testID="thinking-dots"
    >
      {[0, 1, 2].map((i) => (
        <Dot key={i} index={i} reduced={reduced} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
});
