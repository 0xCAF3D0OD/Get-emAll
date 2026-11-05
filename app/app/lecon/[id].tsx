import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { api, useLecon } from '@/api';
import { AnswerOption, type AnswerState } from '@/components/AnswerOption';
import { AppText } from '@/components/AppText';
import { RecruiterAvatar } from '@/components/Avatar/RecruiterAvatar';
import { Button } from '@/components/Button';
import { FeedbackPanel } from '@/components/FeedbackPanel';
import { LessonHeader } from '@/components/LessonHeader';
import { Screen } from '@/components/Screen';
import { StarExercise, lettresStar } from '@/components/StarExercise';
import { useParcoursStore } from '@/store/parcours';
import { useReglages } from '@/store/reglages';
import { colors, radius, spacing } from '@/theme';
import type { Exercice, LettreStar } from '@/types/domain';

const XP_PAR_EXERCICE = 5;
type Etape = 'reponse' | 'juste' | 'faux';
type Cases = Record<LettreStar, string | null>;
const casesVides: Cases = { S: null, T: null, A: null, R: null };

export default function LeconEcran() {
  const { t } = useTranslation();
  const { id = 'points-forts' } = useLocalSearchParams<{ id: string }>();
  const { data: lecon } = useLecon(id);
  const { indices, serieReponses, enregistrer } = useParcoursStore();
  const sons = useReglages((s) => s.sons);

  const [rang, setRang] = useState(0);
  const [etape, setEtape] = useState<Etape>('reponse');
  const [choix, setChoix] = useState<string | null>(null);
  const [cases, setCases] = useState<Cases>(casesVides);

  if (!lecon) {
    return (
      <Screen>
        <ActivityIndicator
          color={colors.primary}
          accessibilityLabel={t('lecon.chargement')}
          style={styles.loading}
        />
      </Screen>
    );
  }

  const total = lecon.exercices.length;
  const ex: Exercice | undefined = lecon.exercices[rang];
  if (!ex) return null;
  const verifie = etape !== 'reponse';

  const suivant = () => {
    setEtape('reponse');
    setChoix(null);
    setCases(casesVides);
    // TODO(maquette) : l'écran de fin de leçon n'est pas dessiné ; retour au parcours.
    if (rang + 1 >= total) router.back();
    else setRang(rang + 1);
  };

  const pret = ex.type === 'choix' ? choix !== null : lettresStar.every((l) => cases[l]);

  const verifier = () => {
    const correct =
      ex.type === 'choix'
        ? choix === ex.bonneReponse
        : ex.morceaux.every((m) => cases[m.lettre] === m.id);
    enregistrer(ex.id, correct, correct ? XP_PAR_EXERCICE : 0);
    void api.postTentative(ex.id, correct);
    if (sons) {
      void Haptics.notificationAsync(
        correct
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning,
      );
    }
    setEtape(correct ? 'juste' : 'faux');
  };

  const placer = (morceauId: string) => {
    const libre = lettresStar.find((l) => !cases[l]);
    if (libre) setCases({ ...cases, [libre]: morceauId });
  };

  const etatReponse = (optionId: string): AnswerState => {
    if (ex.type !== 'choix') return 'neutral';
    if (!verifie) return choix === optionId ? 'selected' : 'neutral';
    if (optionId === ex.bonneReponse) return 'correct';
    if (optionId === choix) return 'incorrect';
    return 'frozen';
  };

  const explication =
    ex.type === 'choix'
      ? etape === 'juste'
        ? ex.explicationJuste
        : (ex.explicationFausse[choix ?? ''] ?? '')
      : etape === 'juste'
        ? ex.explicationJuste
        : ex.explicationFausse;

  const pied =
    etape === 'reponse' ? (
      <View style={styles.actions}>
        {ex.type === 'choix' ? (
          <Button variant="secondary" label={t('lecon.passer')} onPress={suivant} />
        ) : null}
        <View style={styles.flex}>
          <Button label={t('lecon.verifier')} disabled={!pret} onPress={verifier} />
        </View>
      </View>
    ) : (
      <FeedbackPanel
        variant={etape === 'juste' ? 'success' : 'error'}
        recruiter={lecon.recruteur}
        title={t(etape === 'juste' ? 'lecon.juste' : 'lecon.pasTout')}
        badge={
          etape === 'juste'
            ? t('lecon.affilee', { n: serieReponses, xp: XP_PAR_EXERCICE })
            : undefined
        }
        explanation={explication}
        note={etape === 'faux' ? t('lecon.revision') : undefined}
        buttonLabel={t(etape === 'juste' ? 'lecon.continuer' : 'lecon.compris')}
        onContinue={suivant}
      />
    );

  const nomRecruteur = t(`personnages.recruteurs.${lecon.recruteur}.nom`);

  return (
    <Screen footer={pied} footerRule={!verifie} footerFlush={verifie}>
      <LessonHeader n={rang + 1} total={total} indices={indices} onClose={() => router.back()} />

      <View style={styles.intro}>
        <AppText variant="h1" accessibilityRole="header">
          {ex.consigne}
        </AppText>
        {ex.type === 'star' ? (
          <AppText variant="bodyS" color="inkMuted">
            {t('lecon.star.sous')}
          </AppText>
        ) : null}
      </View>

      {ex.type === 'choix' ? (
        <>
          <View
            style={styles.questionRow}
            accessible
            accessibilityLabel={t('lecon.questionLu', {
              nom: nomRecruteur,
              question: ex.question,
            })}
          >
            {verifie ? null : (
              <RecruiterAvatar id={lecon.recruteur} size={84} bg="warningBg" decorative />
            )}
            <View style={styles.bulle}>
              <AppText variant="question">{ex.question}</AppText>
            </View>
          </View>
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel={t('lecon.reponses')}
            style={styles.options}
          >
            {ex.options.map((o) => (
              <AnswerOption
                key={o.id}
                text={o.texte}
                state={etatReponse(o.id)}
                chosen={o.id === choix}
                onPress={() => setChoix(o.id)}
              />
            ))}
          </View>
        </>
      ) : (
        <StarExercise
          morceaux={ex.morceaux}
          cases={cases}
          verified={verifie}
          onPlace={placer}
          onRemove={(l) => setCases({ ...cases, [l]: null })}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { marginTop: spacing.xxxl },
  flex: { flex: 1 },
  intro: { gap: spacing.xs, marginTop: spacing.md },
  questionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bulle: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  options: { gap: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.md },
});
