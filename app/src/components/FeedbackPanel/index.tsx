import { Check, X } from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { RecruiterAvatar } from '@/components/Avatar/RecruiterAvatar';
import { Button } from '@/components/Button';
import { Confetti } from '@/components/Confetti';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, motion, radius, spacing } from '@/theme';
import type { RecruiterId } from '@/types/characters';

export type FeedbackPanelProps = {
  variant: 'success' | 'error';
  recruiter: RecruiterId;
  title: string;
  /** Pastille à droite du titre, ex. « 3 d'affilée · +5 XP » (réussite). */
  badge?: string;
  explanation: string;
  /** Mention sous l'explication, ex. « Cette question reviendra… » (erreur). */
  note?: string;
  buttonLabel: string;
  onContinue: () => void;
};

/**
 * Panneau de retour qui monte du bas (350 ms). Réussite : avatar « impressionne » qui sautille,
 * coche en rebond, confettis une fois. Erreur : avatar « decu », seulement l'entrée du panneau.
 * Région annoncée poliment par le lecteur d'écran.
 */
export function FeedbackPanel({
  variant,
  recruiter,
  title,
  badge,
  explanation,
  note,
  buttonLabel,
  onContinue,
}: FeedbackPanelProps) {
  const reduced = useReducedMotion();
  const ok = variant === 'success';
  const enter = useSharedValue(0);
  const hop = useSharedValue(0);
  const pop = useSharedValue(ok && !reduced ? 0 : 1);

  useEffect(() => {
    enter.value = withTiming(1, {
      duration: reduced ? motion.reducedFade : motion.panel,
      easing: motion.enter,
    });
    if (ok && !reduced) {
      pop.value = withSequence(
        withTiming(0, { duration: motion.fast }),
        withSpring(1, { damping: 6, stiffness: 220 }),
      );
      hop.value = withSequence(
        withTiming(0, { duration: motion.panel }),
        withTiming(-10, { duration: 160 }),
        withTiming(0, { duration: 160 }),
        withTiming(-6, { duration: 140 }),
        withTiming(0, { duration: 140 }),
      );
    }
  }, [enter, hop, pop, ok, reduced]);

  const panelStyle = useAnimatedStyle(() =>
    reduced ? { opacity: enter.value } : { transform: [{ translateY: (1 - enter.value) * 320 }] },
  );
  const hopStyle = useAnimatedStyle(() => ({ transform: [{ translateY: hop.value }] }));
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));

  const ink = ok ? 'successText' : 'errorText';
  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      style={[styles.panel, { backgroundColor: colors[ok ? 'successBg' : 'errorBg'] }, panelStyle]}
    >
      <View style={styles.head}>
        <Animated.View style={hopStyle}>
          <RecruiterAvatar id={recruiter} expression={ok ? 'impressionne' : 'decu'} size={56} />
        </Animated.View>
        <View style={styles.title} accessible accessibilityRole="header" accessibilityLabel={title}>
          <Animated.View style={popStyle}>
            {ok ? (
              <Check size={26} strokeWidth={3.25} color={colors.success} aria-hidden />
            ) : (
              <X size={26} strokeWidth={3.25} color={colors.errorDark} aria-hidden />
            )}
          </Animated.View>
          <AppText variant="h1" color={ok ? 'success' : 'errorDark'}>
            {title}
          </AppText>
        </View>
        {badge ? (
          <View style={styles.badge}>
            <AppText variant="caption" weight="heavy" color="success">
              {badge}
            </AppText>
          </View>
        ) : null}
        {ok ? (
          <View style={styles.confetti} pointerEvents="none">
            <Confetti />
          </View>
        ) : null}
      </View>
      <AppText variant="body" color={ink}>
        {explanation}
      </AppText>
      {note ? (
        <AppText variant="caption" color={ink}>
          {note}
        </AppText>
      ) : null}
      <Button variant={ok ? 'success' : 'danger'} label={buttonLabel} onPress={onContinue} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1 },
  badge: {
    marginLeft: 'auto',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  confetti: { position: 'absolute', left: 0, right: 0, top: 20, bottom: -20 },
});
