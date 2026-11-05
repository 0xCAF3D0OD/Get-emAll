import { useTranslation } from 'react-i18next';

import { recruiters } from '@/characters/registry';
import { useCharacterLabel } from '@/characters/useCharacterLabel';
import type { ColorToken } from '@/theme';
import type { Expression, RecruiterId } from '@/types/characters';

import { Avatar, type AvatarSize } from '.';

export function RecruiterAvatar({
  id,
  expression = 'neutre',
  size,
  bg,
  decorative = false,
}: {
  id: RecruiterId;
  expression?: Expression;
  size?: AvatarSize;
  bg?: ColorToken;
  decorative?: boolean;
}) {
  const { t } = useTranslation();
  const label = useCharacterLabel();
  const r = recruiters[id];
  return (
    <Avatar
      image={r.expressions[expression]}
      face={r.face}
      size={size}
      bg={bg ?? r.avatarBg}
      initial={t(`personnages.recruteurs.${id}.nom`).charAt(0)}
      accessibilityLabel={decorative ? undefined : label.recruiter(id, expression)}
      transition={200}
    />
  );
}
