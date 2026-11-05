import {
  Briefcase,
  Check,
  CodeXml,
  Phone,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radius, spacing } from '@/theme';
import type { StatutEtape, TypeEtape } from '@/types/domain';

const icons: Record<TypeEtape, LucideIcon> = {
  candidature: Briefcase,
  appel: Phone,
  rh: Users,
  technique: CodeXml,
  offre: Trophy,
};

export type RouteStepProps = {
  rang: number;
  type: TypeEtape;
  statut: StatutEtape;
  title: string;
  subtitle: string;
  /** Avatar facultatif à droite. */
  aside?: ReactNode;
  /** Contenu dépliable de l'étape en cours (leçons, bouton). */
  children?: ReactNode;
  /** Couleur du trait vers l'étape suivante ; absent pour la dernière. */
  line?: 'done' | 'current' | 'locked';
};

/**
 * Étape de la route vers le poste : marqueur carré arrondi de 44 (terminé : vert avec coche ;
 * en cours : primaire avec halo de 6 ; verrouillé : gris), statut écrit en toutes lettres.
 */
export function RouteStep({
  rang,
  type,
  statut,
  title,
  subtitle,
  aside,
  children,
  line,
}: RouteStepProps) {
  const { t } = useTranslation();
  const Icon = statut === 'terminee' ? Check : icons[type];
  const current = statut === 'en_cours';
  const overline = t('parcours.etape', { n: rang, statut: t(`parcours.statuts.${statut}`) });
  const marker = (
    <View style={[styles.marker, markerLook[statut]]}>
      <Icon
        size={24}
        strokeWidth={statut === 'terminee' ? 3 : 2.25}
        color={statut === 'terminee' ? colors.success : current ? colors.white : colors.inkMuted}
        aria-hidden
      />
    </View>
  );

  const texts = (
    <View
      style={styles.texts}
      accessible={!current}
      accessibilityLabel={`${overline}. ${title}. ${subtitle}`}
    >
      <AppText variant="overline" color="inkMuted" accessibilityRole={current ? 'text' : undefined}>
        {overline}
      </AppText>
      <AppText
        variant="h4"
        color={statut === 'verrouillee' ? 'inkMuted' : 'ink'}
        accessibilityRole={current ? 'header' : undefined}
      >
        {title}
      </AppText>
      <AppText variant="caption" color="inkMuted">
        {subtitle}
      </AppText>
    </View>
  );

  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        {marker}
        {line ? <View style={[styles.line, { backgroundColor: lineColor[line] }]} /> : null}
      </View>
      {current ? (
        <View style={styles.card}>
          <View style={styles.head}>
            {texts}
            {aside}
          </View>
          {children}
        </View>
      ) : (
        <View style={[styles.head, styles.plain]}>
          {texts}
          {aside}
        </View>
      )}
    </View>
  );
}

const markerLook: Record<StatutEtape, object> = {
  terminee: { backgroundColor: colors.successFill },
  en_cours: {
    backgroundColor: colors.primary,
    boxShadow: `0px 0px 0px 6px ${colors.primaryLight}`,
  },
  verrouillee: { backgroundColor: colors.track },
};

const lineColor = { done: colors.successFill, current: colors.primaryRing, locked: colors.track };

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.lg },
  rail: { width: 44, alignItems: 'center' },
  marker: {
    width: 44,
    height: 44,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  line: { width: 6, flex: 1, marginVertical: -2, minHeight: 12 },
  plain: { paddingBottom: spacing.lg },
  head: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', flex: 1 },
  texts: { flex: 1, gap: 2 },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.step,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
    boxShadow: `0px 4px 0px 0px ${colors.border}`,
  },
});
