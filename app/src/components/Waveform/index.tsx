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
import { colors } from '@/theme';

const BARS = [14, 24, 34, 22, 30, 18, 26, 12];

function Bar({ h, i, active }: { h: number; i: number; active: boolean }) {
  const s = useSharedValue(1);
  useEffect(() => {
    if (!active) {
      cancelAnimation(s);
      s.value = 1;
      return;
    }
    s.value = withDelay(
      i * 90,
      withRepeat(
        withSequence(withTiming(0.45, { duration: 320 }), withTiming(1, { duration: 320 })),
        -1,
      ),
    );
    return () => cancelAnimation(s);
  }, [active, i, s]);
  const style = useAnimatedStyle(() => ({ transform: [{ scaleY: s.value }] }));
  return <Animated.View style={[styles.bar, { height: h }, style]} />;
}

/** Onde décorative pendant l'enregistrement ; immobile si les animations sont réduites. */
export function Waveform({ active = true }: { active?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <View
      style={styles.row}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      testID="waveform"
    >
      {BARS.map((h, i) => (
        <Bar key={i} h={h} i={i} active={active && !reduced} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, height: 40 },
  bar: { width: 5, borderRadius: 3, backgroundColor: colors.primary },
});
