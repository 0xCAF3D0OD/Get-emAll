import { Volume2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radius, spacing } from '@/theme';

export type SpeechBubbleProps = {
  /** Sur-titre, ex. « Lou demande ». */
  speaker: string;
  text: string;
  /** Bouton haut-parleur pour réécouter la question. */
  onReplay?: () => void;
  replayLabel?: string;
};

/** Bulle de question de l'entretien : sur-titre, question, bouton réécouter (44 px). */
export function SpeechBubble({ speaker, text, onReplay, replayLabel }: SpeechBubbleProps) {
  return (
    <View style={styles.bubble}>
      <View style={styles.head}>
        <AppText variant="overline" color="inkMuted" style={styles.flex}>
          {speaker}
        </AppText>
        {onReplay ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={replayLabel}
            onPress={onReplay}
            hitSlop={4}
            style={styles.replay}
          >
            <Volume2 size={24} color={colors.primary} strokeWidth={2.5} aria-hidden />
          </Pressable>
        ) : null}
      </View>
      <AppText variant="bubble" accessibilityRole="header">
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg + 2,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg + 2,
    boxShadow: `0px 5px 0px 0px ${colors.border}`,
  },
  head: { flexDirection: 'row', alignItems: 'center', minHeight: spacing.touch },
  flex: { flex: 1 },
  replay: {
    width: spacing.touch,
    height: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.sm,
  },
});
