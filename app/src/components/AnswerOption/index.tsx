import { Check, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { RadioDot } from '@/components/ChoiceCard';
import { colors, radius, spacing } from '@/theme';

/**
 * neutral / selected : avant la vérification (rond de sélection).
 * frozen : après la vérification, réponse non concernée.
 * correct / incorrect : après la vérification, avec coche ou croix.
 */
export type AnswerState = 'neutral' | 'selected' | 'frozen' | 'correct' | 'incorrect';

export type AnswerOptionProps = {
  text: string;
  state: AnswerState;
  /** Vrai si c'est la réponse que la personne a choisie (fond vert quand elle est juste). */
  chosen?: boolean;
  onPress?: () => void;
};

/**
 * Réponse d'un exercice à choix. Le statut n'est jamais porté par la couleur seule :
 * icône + phrase lue (« Ta réponse, incorrecte : … »), WCAG 1.4.1.
 */
export function AnswerOption({ text, state, chosen = false, onPress }: AnswerOptionProps) {
  const { t } = useTranslation();
  const avant = state === 'neutral' || state === 'selected';
  const label =
    state === 'incorrect'
      ? t('lecon.reponse.incorrecte', { texte: text })
      : state === 'correct'
        ? t(chosen ? 'lecon.reponse.correcte' : 'lecon.reponse.bonne', { texte: text })
        : text;

  const contenu = (
    <>
      {avant ? <RadioDot checked={state === 'selected'} /> : null}
      {state === 'correct' ? (
        <Check size={26} strokeWidth={3} color={colors.success} aria-hidden />
      ) : null}
      {state === 'incorrect' ? (
        <X size={26} strokeWidth={3} color={colors.error} aria-hidden />
      ) : null}
      <AppText variant="body" color={state === 'frozen' ? 'inkMuted' : 'ink'} style={styles.text}>
        {text}
      </AppText>
    </>
  );

  const look = [
    styles.card,
    state === 'neutral' && styles.neutral,
    state === 'selected' && styles.selected,
    state === 'frozen' && styles.frozen,
    state === 'correct' && [styles.correct, chosen && styles.correctChosen],
    state === 'incorrect' && styles.incorrect,
  ];

  if (!avant) {
    return (
      <View accessible accessibilityLabel={label} style={look}>
        {contenu}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: state === 'selected', selected: state === 'selected' }}
      onPress={onPress}
      style={look}
    >
      {contenu}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    borderRadius: radius.cardSm,
    borderWidth: 2,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: spacing.touch,
  },
  text: { flex: 1 },
  neutral: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    boxShadow: `0px 5px 0px 0px ${colors.border}`,
    minHeight: 78,
  },
  selected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderWidth: 3,
    boxShadow: `0px 5px 0px 0px ${colors.primary}`,
    minHeight: 78,
  },
  frozen: { backgroundColor: colors.surface, borderColor: colors.border },
  correct: { backgroundColor: colors.surface, borderColor: colors.success, borderWidth: 3 },
  correctChosen: { backgroundColor: colors.successBg },
  incorrect: { backgroundColor: colors.errorBg, borderColor: colors.error, borderWidth: 3 },
});
