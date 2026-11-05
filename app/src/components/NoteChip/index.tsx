import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/Chip';
import type { NoteCritere } from '@/types/domain';

/** Pastille de note : le statut est écrit, avec un pictogramme (WCAG 1.4.1). */
export function NoteChip({ note, icon = true }: { note: NoteCritere; icon?: boolean }) {
  const { t } = useTranslation();
  const solide = note === 'solide';
  return (
    <View style={styles.centre}>
      <Chip
        kind="status"
        label={t(`entretien.bilan.notes.${note}`)}
        bg={solide ? 'successBg' : 'streakBg'}
        fg={solide ? 'success' : 'streakText'}
        icon={icon ? (solide ? 'check' : 'plus') : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({ centre: { alignSelf: 'center' } });
