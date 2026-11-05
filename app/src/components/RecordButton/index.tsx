import { Mic } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, shadows } from '@/theme';

export type RecordButtonProps = {
  /** « idle » : micro pour commencer ; « recording » : carré pour terminer. */
  state: 'idle' | 'recording';
  onPress: () => void;
  accessibilityLabel: string;
};

const SIZE = 96;

/** Grand bouton rond de 96 px, halo primaryLight, ombre 3D primaryDark. */
export function RecordButton({ state, onPress, accessibilityLabel }: RecordButtonProps) {
  return (
    <View style={styles.halo}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            boxShadow: `0px ${pressed ? shadows.buttonPressedOffset : shadows.buttonOffset}px 0px 0px ${colors.primaryDark}`,
            transform: [{ translateY: pressed ? shadows.buttonTravel : 0 }],
          },
        ]}
      >
        {state === 'recording' ? (
          <View style={styles.stop} />
        ) : (
          <Mic size={36} color={colors.white} strokeWidth={2.5} aria-hidden />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  halo: {
    width: SIZE + 20,
    height: SIZE + 20,
    borderRadius: (SIZE + 20) / 2,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stop: { width: 18, height: 18, borderRadius: 4, backgroundColor: colors.white },
});
