import { avatarById } from '@/characters/registry';
import { useCharacterLabel } from '@/characters/useCharacterLabel';
import type { ColorToken } from '@/theme';
import type { AvatarExpression, AvatarId } from '@/types/characters';

import { Avatar, type AvatarSize } from '.';

export function CandidateAvatar({
  id,
  expression,
  size,
  bg = 'peachBg',
  decorative = false,
  initial = '?',
}: {
  id: AvatarId;
  expression?: AvatarExpression;
  size?: AvatarSize;
  bg?: ColorToken;
  decorative?: boolean;
  initial?: string;
}) {
  const label = useCharacterLabel();
  const a = avatarById(id);
  const image = (expression && a.expressions?.[expression]) || a.image;
  return (
    <Avatar
      image={image}
      face={a.face}
      size={size}
      bg={bg}
      initial={initial}
      accessibilityLabel={decorative ? undefined : label.candidate(expression ?? 'neutre')}
    />
  );
}
