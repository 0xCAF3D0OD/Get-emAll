import type { ColorToken } from '@/theme';

export type RecruiterId = 'lou' | 'tom' | 'marc' | 'nadia';
export type Expression =
  'neutre' | 'ecoute' | 'reflechit' | 'ravi' | 'dubitatif' | 'impressionne' | 'decu';
/** Expressions disponibles pour l'avatar du candidat (avatar-01 seulement pour l'instant). */
export type AvatarExpression = 'fier' | 'nerveux' | 'concentre';
export type Level = 1 | 2 | 3;
export type AvatarId =
  | 'avatar-01'
  | 'avatar-02'
  | 'avatar-03'
  | 'avatar-04'
  | 'avatar-05'
  | 'avatar-06'
  | 'avatar-07'
  | 'avatar-08'
  | 'avatar-09'
  | 'avatar-10'
  | 'avatar-11';

/** Cadrage du visage dans un avatar rond : centre vertical et hauteur du carré, en fraction de l'image. */
export type FaceCrop = { cy: number; s: number };

export type ImageAsset = { source: number; width: number; height: number };

export type Recruiter = {
  id: RecruiterId;
  /** Accord des adjectifs (« ravie », « ravi ») dans les textes alternatifs. */
  genre: 'f' | 'm';
  level: Level;
  avatarBg: ColorToken;
  /** Hauteur d'affichage dans la scène, en px. */
  sceneHeight: number;
  face: FaceCrop;
  scene: number;
  expressions: Record<Expression, ImageAsset>;
};

export type Avatar = {
  id: AvatarId;
  face: FaceCrop;
  image: ImageAsset;
  expressions?: Partial<Record<AvatarExpression, ImageAsset>>;
};
