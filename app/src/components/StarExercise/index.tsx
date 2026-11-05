import { Check, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radius, spacing, type ColorToken } from '@/theme';
import type { LettreStar } from '@/types/domain';

export const lettresStar: LettreStar[] = ['S', 'T', 'A', 'R'];

const teinte: Record<LettreStar, ColorToken> = {
  S: 'starS',
  T: 'starT',
  A: 'xp',
  R: 'successFill',
};

export type Morceau = { id: string; texte: string; lettre: LettreStar };

export type StarExerciseProps = {
  morceaux: Morceau[];
  /** Morceau placé dans chaque case (id), ou null. */
  cases: Record<LettreStar, string | null>;
  /** Touche d'un morceau libre : il va dans la première case vide. */
  onPlace: (morceauId: string) => void;
  /** Touche d'une case remplie : le morceau revient dans la liste. */
  onRemove: (lettre: LettreStar) => void;
  /** Après « Vérifier » : chaque case dit si le morceau est bien placé. */
  verified?: boolean;
};

/**
 * Exercice méthode STAR : 4 cases S, T, A, R, morceaux à toucher pour les placer.
 * Pas de glisser-déposer (WCAG 2.5.7).
 */
export function StarExercise({ morceaux, cases, onPlace, onRemove, verified }: StarExerciseProps) {
  const { t } = useTranslation();
  const parId = new Map(morceaux.map((m) => [m.id, m]));
  const places = new Set(Object.values(cases).filter(Boolean));
  const libres = morceaux.filter((m) => !places.has(m.id));

  return (
    <View style={styles.wrap}>
      <View style={styles.cases}>
        {lettresStar.map((l) => {
          const m = cases[l] ? parId.get(cases[l]) : undefined;
          const nom = t(`lecon.star.lettres.${l}`);
          const juste = m?.lettre === l;
          const label = !m
            ? t('lecon.star.caseVide', { nom })
            : verified
              ? t(juste ? 'lecon.star.juste' : 'lecon.star.faux', { nom, texte: m.texte })
              : t('lecon.star.casePleine', { nom, texte: m.texte });
          const lettre = (
            <View style={[styles.lettre, { backgroundColor: colors[teinte[l]] }]}>
              <AppText variant="bodyL" weight="heavy">
                {l}
              </AppText>
            </View>
          );
          const contenu = m ? (
            <View style={[styles.pleine, verified && (juste ? styles.juste : styles.faux)]}>
              {verified ? (
                juste ? (
                  <Check size={22} strokeWidth={3} color={colors.success} aria-hidden />
                ) : (
                  <X size={22} strokeWidth={3} color={colors.error} aria-hidden />
                )
              ) : null}
              <AppText variant="bodyS" style={styles.flex}>
                {m.texte}
              </AppText>
            </View>
          ) : (
            <View style={styles.vide}>
              <AppText variant="caption" color="inkMuted">
                {nom}
              </AppText>
            </View>
          );
          return m && !verified ? (
            <Pressable
              key={l}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityHint={t('lecon.star.retirer')}
              onPress={() => onRemove(l)}
              style={styles.ligne}
            >
              {lettre}
              {contenu}
            </Pressable>
          ) : (
            <View key={l} accessible accessibilityLabel={label} style={styles.ligne}>
              {lettre}
              {contenu}
            </View>
          );
        })}
      </View>

      <View style={styles.rule} />

      <View
        accessibilityRole="list"
        accessibilityLabel={t('lecon.star.morceaux')}
        style={styles.libres}
      >
        {libres.map((m) => (
          <Pressable
            key={m.id}
            accessibilityRole="button"
            accessibilityLabel={t('lecon.star.placer', { texte: m.texte })}
            accessibilityHint={t('lecon.star.placerIndice')}
            disabled={verified}
            onPress={() => onPlace(m.id)}
            style={({ pressed }) => [styles.morceau, pressed && styles.pressed]}
          >
            <AppText variant="bodyS">{m.texte}</AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  cases: { gap: spacing.md },
  ligne: { flexDirection: 'row', gap: spacing.md, minHeight: 48 },
  flex: { flex: 1 },
  lettre: {
    width: 44,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pleine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.button,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  juste: { borderColor: colors.success, backgroundColor: colors.successBg },
  faux: { borderColor: colors.error, backgroundColor: colors.errorBg },
  vide: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.borderDashed,
    borderRadius: radius.button,
    paddingHorizontal: spacing.lg,
    minHeight: 54,
  },
  rule: { height: 2, backgroundColor: colors.borderStrong },
  libres: { gap: spacing.md },
  morceau: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.cardSm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    boxShadow: `0px 5px 0px 0px ${colors.border}`,
  },
  pressed: { transform: [{ translateY: 3 }], boxShadow: `0px 2px 0px 0px ${colors.border}` },
});
