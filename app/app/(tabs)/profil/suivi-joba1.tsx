import { router } from 'expo-router';
import { ExternalLink } from 'lucide-react-native';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';

import { useSuiviJobA1 } from '@/api';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useProfil } from '@/store/profil';
import { colors, spacing, type ColorToken } from '@/theme';
import type { StatutCandidature } from '@/types/domain';

/** Adresse publique de jobA1, ouverte dans le navigateur (aucune requête de l'app). */
const JOBA1_URL = 'https://app.joba1.ch';

const couleurs: Record<StatutCandidature, { bg: ColorToken; fg: ColorToken }> = {
  entretien: { bg: 'primaryLight', fg: 'primaryDark' },
  relance: { bg: 'warningBg', fg: 'warningText' },
  attente: { bg: 'surfaceMuted', fg: 'inkMuted' },
};

/** Lecture seule du suivi jobA1 (profil, recherches ORP, candidatures), par API. */
export default function SuiviJobA1() {
  const { t } = useTranslation();
  const { data } = useSuiviJobA1();
  const setOffre = useProfil((s) => s.setOffre);
  const lien = <ExternalLink size={20} color={colors.primary} strokeWidth={2.5} aria-hidden />;

  return (
    <Screen edges={['top']}>
      <ScreenHeader
        title={t('suivi.titre')}
        subtitle={data ? t('suivi.synchro', { n: data.profil.synchroIlYaMin }) : undefined}
        onBack={() => router.back()}
      />
      {data ? (
        <>
          <Card style={styles.bloc}>
            <View style={styles.tete}>
              <AppText
                variant="bodyL"
                weight="heavy"
                accessibilityRole="header"
                style={styles.flex}
              >
                {t('suivi.profil')}
              </AppText>
              <AppText variant="body" weight="heavy" color="primary">
                {t('suivi.complet', { n: data.profil.completion })}
              </AppText>
            </View>
            <ProgressBar
              value={data.profil.completion}
              max={100}
              label={t('suivi.profil')}
              valueText={t('suivi.completLu', { n: data.profil.completion })}
            />
            <AppText variant="caption" color="inkMuted">
              {data.profil.manque}
            </AppText>
            <Button
              variant="ghost"
              iconAfter
              icon={lien}
              labelVariant="bodyS"
              label={t('suivi.completer')}
              accessibilityHint={t('commun.ouvreJobA1')}
              onPress={() => void Linking.openURL(JOBA1_URL)}
              style={styles.gauche}
            />
          </Card>

          <Card style={styles.bloc}>
            <View
              style={styles.tete}
              accessible
              accessibilityRole="header"
              accessibilityLabel={`${t('suivi.orp', { mois: data.orp.mois })}, ${t('suivi.orpLu', { n: data.orp.faites, objectif: data.orp.objectif })}`}
            >
              <AppText variant="body" weight="heavy" style={styles.flex}>
                {t('suivi.orp', { mois: data.orp.mois })}
              </AppText>
              <AppText variant="body" weight="heavy">
                {t('suivi.orpCompte', { n: data.orp.faites, objectif: data.orp.objectif })}
              </AppText>
            </View>
            <ProgressBar
              value={data.orp.faites}
              max={data.orp.objectif}
              color="successDark"
              label={t('suivi.orp', { mois: data.orp.mois })}
              valueText={t('suivi.orpLu', { n: data.orp.faites, objectif: data.orp.objectif })}
            />
            <AppText variant="caption" color="inkMuted">
              {t('suivi.orpReste', {
                n: data.orp.objectif - data.orp.faites,
                date: data.orp.finLe,
              })}
            </AppText>
          </Card>

          <Card style={styles.bloc}>
            <View style={styles.tete}>
              <AppText
                variant="bodyL"
                weight="heavy"
                accessibilityRole="header"
                style={styles.flex}
              >
                {t('suivi.candidatures')}
              </AppText>
              <Button
                variant="ghost"
                iconAfter
                icon={lien}
                labelVariant="bodyS"
                label={t('suivi.toutVoir')}
                accessibilityLabel={t('suivi.toutVoirLu')}
                accessibilityHint={t('commun.ouvreJobA1')}
                onPress={() => void Linking.openURL(JOBA1_URL)}
              />
            </View>
            {data.candidatures.map((c) => {
              const statut = t(`suivi.statuts.${c.statut}`);
              return (
                <Fragment key={c.id}>
                  <View style={styles.filet} />
                  <View
                    style={styles.candidature}
                    accessible
                    accessibilityLabel={t('suivi.candidatureLu', {
                      poste: c.poste,
                      entreprise: c.entreprise,
                      detail: c.detail,
                      statut,
                    })}
                  >
                    <View style={styles.flex}>
                      <AppText variant="bodyS" weight="heavy">
                        {c.poste}
                      </AppText>
                      <AppText variant="micro" color="inkMuted">
                        {`${c.entreprise} · ${c.detail}`}
                      </AppText>
                    </View>
                    <Chip kind="status" label={statut} {...couleurs[c.statut]} />
                  </View>
                  {c.statut === 'entretien' && c.offreId ? (
                    <Button
                      label={t('suivi.entrainer')}
                      onPress={() => {
                        setOffre(c.offreId ?? null);
                        router.navigate('/parcours');
                      }}
                    />
                  ) : null}
                </Fragment>
              );
            })}
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bloc: { gap: spacing.md },
  tete: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  gauche: { alignSelf: 'flex-start', marginLeft: -spacing.xs },
  filet: { height: 2, backgroundColor: colors.borderStrong },
  candidature: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
