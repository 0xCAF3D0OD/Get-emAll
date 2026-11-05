import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme';

export type ProgressBarProps = {
  value: number;
  max: number;
  min?: number;
  /** Libellé lu, ex. « Progression de la leçon ». */
  label: string;
  /** Texte de la valeur lu par le lecteur d'écran, ex. « 3 sur 6 ». */
  valueText?: string;
  color?: 'primary' | 'successDark';
  height?: number;
};

export function ProgressBar({
  value,
  max,
  min = 0,
  label,
  valueText,
  color = 'primary',
  height = 12,
}: ProgressBarProps) {
  const ratio = max > min ? Math.min(1, Math.max(0, (value - min) / (max - min))) : 0;
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min, max, now: value, text: valueText }}
      style={[styles.track, { height, borderRadius: radius.pill }]}
    >
      <View
        style={{
          width: `${ratio * 100}%`,
          height: '100%',
          borderRadius: radius.pill,
          backgroundColor: colors[color],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: colors.track, overflow: 'hidden', width: '100%' },
});
