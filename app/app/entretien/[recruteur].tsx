import { router, useLocalSearchParams } from 'expo-router';
import { Keyboard, Lightbulb, Pause, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '@/api';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { RecordButton } from '@/components/RecordButton';
import { Scene } from '@/components/Scene';
import { Screen } from '@/components/Screen';
import { SpeechBubble } from '@/components/SpeechBubble';
import { ThinkingDots } from '@/components/ThinkingDots';
import { Waveform } from '@/components/Waveform';
import { recruiters } from '@/characters/registry';
import { reponseDemo } from '@/data/fixtures';
import { useParcoursStore } from '@/store/parcours';
import { expressionPour, useEntretien } from '@/store/entretien';
import { colors, radius, spacing } from '@/theme';
import type { RecruiterId } from '@/types/characters';

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/**
 * Entretien simulé. Machine à états dans src/store/entretien.ts :
 * question (neutre) → enregistrement (écoute) → reflexion (réfléchit, 1,5 s) → reaction.
 * Mode démo (?demo=1) : les états s'enchaînent seuls avec des données fictives.
 */
export default function EntretienEcran() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ recruteur: string; demo?: string }>();
  const id: RecruiterId =
    params.recruteur && params.recruteur in recruiters ? (params.recruteur as RecruiterId) : 'lou';
  const demo = params.demo === '1';
  const nom = t(`personnages.recruteurs.${id}.nom`);

  const e = useEntretien();
  const { entretien, demarrer, envoyer } = e;
  const utiliserIndice = useParcoursStore((s) => s.utiliserIndice);
  const indices = useParcoursStore((s) => s.indices);

  const [secondes, setSecondes] = useState(0);
  const [texte, setTexte] = useState('');
  const [indiceVisible, setIndiceVisible] = useState(false);
  const [saut, setSaut] = useState(0);
  const actif = useRef(true);

  // Démarrage.
  useEffect(() => {
    actif.current = true;
    void api.startEntretien(id).then((x) => {
      if (actif.current) demarrer(x);
    });
    return () => {
      actif.current = false;
    };
  }, [id, demarrer]);

  const max = entretien?.dureeMaxReponse ?? 90;
  // Tant que l'entretien de ce recruteur n'est pas chargé, aucune commande n'est proposée.
  const question = entretien?.recruteur === id ? entretien.questions[e.rang - 1] : undefined;

  const terminer = (reponse: string, duree: number) => {
    if (!entretien) return;
    envoyer({ type: 'terminerReponse', reponse, dureeSecondes: duree });
    void api.sendReponse(entretien.id, e.rang, { texte: reponse }).then((reaction) => {
      if (!actif.current) return;
      envoyer({ type: 'reagir', reaction });
      setSaut((n) => n + 1);
    });
  };

  // Minuteur pendant l'enregistrement (simulé : rien n'est enregistré).
  useEffect(() => {
    if (e.phase !== 'enregistrement') return;
    const timer = setInterval(() => setSecondes((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [e.phase, e.rang]);
  useEffect(() => {
    if (e.phase === 'enregistrement' && secondes >= max) terminer(reponseDemo, max);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondes, max, e.phase]);

  // Fin de l'entretien.
  useEffect(() => {
    if (e.phase === 'termine') router.replace('/entretien/bilan');
  }, [e.phase]);

  const parler = () => {
    setSecondes(0);
    envoyer({ type: 'parler' });
  };
  // Nouvelle question : on efface l'indice et le texte.
  const suivante = () => {
    setIndiceVisible(false);
    setTexte('');
    envoyer({ type: 'suivante' });
  };

  // Mode démo : enchaînement automatique.
  useEffect(() => {
    if (!demo || !entretien) return;
    const pas =
      e.phase === 'question'
        ? parler
        : e.phase === 'enregistrement'
          ? () => terminer(reponseDemo, 72)
          : e.phase === 'reaction'
            ? suivante
            : null;
    if (!pas) return;
    const timer = setTimeout(pas, e.phase === 'reaction' ? 3000 : 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo, entretien, e.phase, e.rang]);

  const montrerIndice = () => {
    if (indiceVisible || utiliserIndice()) setIndiceVisible(true);
  };

  const rondBouton = (label: string, Icon: typeof X, onPress: () => void) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.rond}
    >
      <Icon
        size={22}
        color={colors.ink}
        fill={Icon === Pause ? colors.ink : 'none'}
        strokeWidth={2.75}
        aria-hidden
      />
    </Pressable>
  );

  const liens = (
    <View style={styles.liens}>
      <Button
        variant="ghost"
        labelVariant="bodyS"
        icon={<Keyboard size={20} color={colors.primary} aria-hidden />}
        label={t('entretien.ecrire')}
        onPress={() => envoyer({ type: 'ecrire' })}
      />
      <Button
        variant="ghost"
        labelVariant="bodyS"
        icon={<Lightbulb size={20} color={colors.primary} aria-hidden />}
        label={t('entretien.indice')}
        disabled={!indiceVisible && indices <= 0}
        onPress={montrerIndice}
      />
    </View>
  );

  const taReponse = (
    <View style={styles.carte}>
      <AppText variant="overline" color="inkMuted">
        {t('entretien.taReponse')}
      </AppText>
      <AppText variant="bodyS" color="inkMuted">
        {e.reponse}
      </AppText>
    </View>
  );

  let zone: React.ReactNode = null;
  switch (e.phase) {
    case 'question':
      // TODO(maquette) : l'état « question » n'est pas dessiné ; même gabarit, bouton micro.
      zone = (
        <>
          <View style={styles.centre}>
            <RecordButton
              state="idle"
              accessibilityLabel={t('entretien.repondre')}
              onPress={parler}
            />
            <AppText variant="caption" color="inkMuted" align="center">
              {t('entretien.toucheRepondre')}
            </AppText>
          </View>
          {liens}
        </>
      );
      break;
    case 'enregistrement':
      zone = (
        <>
          <View style={styles.centre}>
            <Waveform />
            <AppText
              variant="bodyS"
              weight="heavy"
              align="center"
              accessibilityLabel={t('entretien.enregistrementLu', {
                temps: mmss(secondes),
                max: mmss(max),
              })}
            >
              {t('entretien.enregistrement', { temps: mmss(secondes), max: mmss(max) })}
            </AppText>
            <RecordButton
              state="recording"
              accessibilityLabel={t('entretien.terminer')}
              onPress={() => terminer(reponseDemo, secondes)}
            />
            <AppText variant="caption" color="inkMuted" align="center">
              {t('entretien.toucheTerminer')}
            </AppText>
          </View>
          {liens}
        </>
      );
      break;
    case 'ecrit':
      // TODO(maquette) : la saisie écrite n'est pas dessinée.
      zone = (
        <View style={styles.ecrit}>
          <TextInput
            accessibilityLabel={t('entretien.ecritLabel')}
            placeholder={t('entretien.ecritPlaceholder')}
            placeholderTextColor={colors.inkMuted}
            multiline
            value={texte}
            onChangeText={setTexte}
            style={styles.saisie}
          />
          <Button
            label={t('entretien.envoyer')}
            disabled={texte.trim().length === 0}
            onPress={() => terminer(texte.trim(), 0)}
          />
        </View>
      );
      break;
    case 'reflexion':
      zone = (
        <>
          <View style={styles.statut} accessibilityLiveRegion="polite">
            <AppText variant="bodyL" weight="heavy" color="inkMuted">
              {t('entretien.reflechit', { nom })}
            </AppText>
            <ThinkingDots />
          </View>
          {taReponse}
        </>
      );
      break;
    case 'reaction':
    case 'termine':
      zone = (
        <>
          <View style={styles.statutCol} accessibilityLiveRegion="polite">
            <AppText variant="bodyL" weight="heavy" color="success" align="center">
              {e.dureeSecondes > 0
                ? t('entretien.enregistree', { temps: mmss(e.dureeSecondes) })
                : t('entretien.envoyee')}
            </AppText>
            {/* TODO(maquette) : place et texte de la phrase de réaction non dessinés. */}
            {e.reaction ? (
              <AppText variant="body" align="center">
                {e.reaction.phrase}
              </AppText>
            ) : null}
          </View>
          {taReponse}
          <Button
            label={t(e.rang >= e.total ? 'entretien.voirBilan' : 'entretien.suivante')}
            onPress={suivante}
          />
        </>
      );
      break;
  }

  return (
    <Screen edges={['bottom']} contentStyle={styles.contenu}>
      <View>
        <Scene recruiter={id} expression={expressionPour(e)} bounceKey={saut} />
        <View style={[styles.barre, { top: insets.top + spacing.xl }]}>
          {rondBouton(t('entretien.quitter'), X, () => router.back())}
          <View style={styles.pastille}>
            <AppText variant="caption" weight="heavy">
              {t('entretien.questionSur', { n: e.rang, total: e.total })}
            </AppText>
          </View>
          {rondBouton(t('entretien.pause'), Pause, () =>
            router.push({ pathname: '/a-dessiner', params: { ecran: 'pause' } }),
          )}
        </View>
      </View>

      <View style={styles.bas}>
        {question ? (
          <SpeechBubble
            speaker={t('entretien.demande', { nom })}
            text={t('entretien.citation', { texte: question.texte })}
            replayLabel={t('entretien.reecouter')}
            // TODO(asset) : pas de voix enregistrée ; le lecteur d'écran relit la question.
            onReplay={() => AccessibilityInfo.announceForAccessibility(question.texte)}
          />
        ) : null}
        {indiceVisible && question ? (
          // TODO(maquette) : l'affichage de l'indice n'est pas dessiné.
          <View style={styles.indice} accessibilityLiveRegion="polite">
            <AppText variant="overline" color="warningText">
              {t('entretien.indiceTitre')}
            </AppText>
            <AppText variant="bodyS" color="warningText">
              {question.indice}
            </AppText>
          </View>
        ) : null}
        {question ? zone : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { paddingHorizontal: 0, paddingTop: 0, gap: 0, flexGrow: 1 },
  barre: {
    position: 'absolute',
    left: spacing.screen - 4,
    right: spacing.screen - 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rond: {
    width: spacing.touch,
    height: spacing.touch,
    borderRadius: spacing.touch / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastille: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    minHeight: 36,
    justifyContent: 'center',
  },
  bas: { flex: 1, paddingHorizontal: spacing.screen, marginTop: -26, gap: spacing.xl },
  centre: { alignItems: 'center', gap: spacing.md },
  liens: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto' },
  statut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: spacing.touch,
    marginTop: spacing.xl,
  },
  statutCol: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl },
  carte: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  ecrit: { gap: spacing.md },
  saisie: {
    minHeight: 140,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.lg,
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: colors.ink,
    textAlignVertical: 'top',
  },
  indice: {
    backgroundColor: colors.warningBg,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.xs,
  },
});
