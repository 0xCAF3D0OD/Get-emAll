import { useTranslation } from 'react-i18next';

import type { AvatarExpression, Expression, RecruiterId } from '@/types/characters';

import { recruiters } from './registry';

/** Texte alternatif d'un personnage : qui, et quelle émotion. */
export function useCharacterLabel() {
  const { t } = useTranslation();
  return {
    recruiter: (id: RecruiterId, expression: Expression) =>
      t('personnages.alt', {
        nom: t(`personnages.recruteurs.${id}.nom`),
        expression: t(`personnages.expressions.${recruiters[id].genre}.${expression}`),
      }),
    candidate: (expression: AvatarExpression | 'neutre') =>
      // Le genre du candidat n'est pas connu : « l'air fier » s'accorde avec « air ».
      t('personnages.altCandidat', {
        expression: t(`personnages.expressionsCandidat.${expression}`),
      }),
  };
}
