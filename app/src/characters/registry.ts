/* Registre des personnages et avatars. Généré à partir de assets/ ; tailles en px. */
import type { Avatar, AvatarId, Expression, Recruiter, RecruiterId } from '@/types/characters';

export const expressions: Expression[] = [
  'neutre',
  'ecoute',
  'reflechit',
  'ravi',
  'dubitatif',
  'impressionne',
  'decu',
];

export const recruiters: Record<RecruiterId, Recruiter> = {
  lou: {
    id: 'lou',
    genre: 'f',
    level: 1,
    avatarBg: 'lavenderBg',
    sceneHeight: 270,
    face: { cy: 0.27, s: 0.55 },
    scene: require('../../assets/scenes/lou.jpg'),
    expressions: {
      neutre: {
        source: require('../../assets/characters/lou/neutre.png'),
        width: 373,
        height: 600,
      },
      ecoute: {
        source: require('../../assets/characters/lou/ecoute.png'),
        width: 373,
        height: 600,
      },
      reflechit: {
        source: require('../../assets/characters/lou/reflechit.png'),
        width: 373,
        height: 600,
      },
      ravi: {
        source: require('../../assets/characters/lou/ravi.png'),
        width: 373,
        height: 600,
      },
      dubitatif: {
        source: require('../../assets/characters/lou/dubitatif.png'),
        width: 373,
        height: 600,
      },
      impressionne: {
        source: require('../../assets/characters/lou/impressionne.png'),
        width: 373,
        height: 600,
      },
      decu: {
        source: require('../../assets/characters/lou/decu.png'),
        width: 373,
        height: 600,
      },
    },
  },
  tom: {
    id: 'tom',
    genre: 'm',
    level: 2,
    avatarBg: 'infoBg',
    sceneHeight: 285,
    face: { cy: 0.21, s: 0.5 },
    scene: require('../../assets/scenes/tom.jpg'),
    expressions: {
      neutre: {
        source: require('../../assets/characters/tom/neutre.png'),
        width: 250,
        height: 600,
      },
      ecoute: {
        source: require('../../assets/characters/tom/ecoute.png'),
        width: 251,
        height: 600,
      },
      reflechit: {
        source: require('../../assets/characters/tom/reflechit.png'),
        width: 251,
        height: 600,
      },
      ravi: {
        source: require('../../assets/characters/tom/ravi.png'),
        width: 251,
        height: 600,
      },
      dubitatif: {
        source: require('../../assets/characters/tom/dubitatif.png'),
        width: 251,
        height: 600,
      },
      impressionne: {
        source: require('../../assets/characters/tom/impressionne.png'),
        width: 251,
        height: 600,
      },
      decu: {
        source: require('../../assets/characters/tom/decu.png'),
        width: 251,
        height: 600,
      },
    },
  },
  marc: {
    id: 'marc',
    genre: 'm',
    level: 2,
    avatarBg: 'warningBg',
    sceneHeight: 250,
    face: { cy: 0.28, s: 0.58 },
    scene: require('../../assets/scenes/marc.jpg'),
    expressions: {
      neutre: {
        source: require('../../assets/characters/marc/neutre.png'),
        width: 546,
        height: 600,
      },
      ecoute: {
        source: require('../../assets/characters/marc/ecoute.png'),
        width: 547,
        height: 600,
      },
      reflechit: {
        source: require('../../assets/characters/marc/reflechit.png'),
        width: 547,
        height: 600,
      },
      ravi: {
        source: require('../../assets/characters/marc/ravi.png'),
        width: 547,
        height: 600,
      },
      dubitatif: {
        source: require('../../assets/characters/marc/dubitatif.png'),
        width: 547,
        height: 600,
      },
      impressionne: {
        source: require('../../assets/characters/marc/impressionne.png'),
        width: 547,
        height: 600,
      },
      decu: {
        source: require('../../assets/characters/marc/decu.png'),
        width: 547,
        height: 600,
      },
    },
  },
  nadia: {
    id: 'nadia',
    genre: 'f',
    level: 3,
    avatarBg: 'successBg',
    sceneHeight: 290,
    face: { cy: 0.22, s: 0.45 },
    scene: require('../../assets/scenes/nadia.jpg'),
    expressions: {
      neutre: {
        source: require('../../assets/characters/nadia/neutre.png'),
        width: 236,
        height: 600,
      },
      ecoute: {
        source: require('../../assets/characters/nadia/ecoute.png'),
        width: 236,
        height: 600,
      },
      reflechit: {
        source: require('../../assets/characters/nadia/reflechit.png'),
        width: 236,
        height: 600,
      },
      ravi: {
        source: require('../../assets/characters/nadia/ravi.png'),
        width: 236,
        height: 600,
      },
      dubitatif: {
        source: require('../../assets/characters/nadia/dubitatif.png'),
        width: 236,
        height: 600,
      },
      impressionne: {
        source: require('../../assets/characters/nadia/impressionne.png'),
        width: 236,
        height: 600,
      },
      decu: {
        source: require('../../assets/characters/nadia/decu.png'),
        width: 236,
        height: 600,
      },
    },
  },
};

export const recruiterOrder: RecruiterId[] = ['lou', 'tom', 'marc', 'nadia'];

export const avatars: Avatar[] = [
  {
    id: 'avatar-01',
    face: { cy: 0.3, s: 0.6 },
    image: { source: require('../../assets/avatars/avatar-01.png'), width: 480, height: 600 },
    expressions: {
      fier: {
        source: require('../../assets/avatars/avatar-01-fier.png'),
        width: 480,
        height: 600,
      },
      nerveux: {
        source: require('../../assets/avatars/avatar-01-nerveux.png'),
        width: 480,
        height: 600,
      },
      concentre: {
        source: require('../../assets/avatars/avatar-01-concentre.png'),
        width: 480,
        height: 600,
      },
    },
  },
  {
    id: 'avatar-02',
    face: { cy: 0.25, s: 0.55 },
    image: { source: require('../../assets/avatars/avatar-02.png'), width: 309, height: 600 },
  },
  {
    id: 'avatar-03',
    face: { cy: 0.26, s: 0.55 },
    image: { source: require('../../assets/avatars/avatar-03.png'), width: 439, height: 600 },
  },
  {
    id: 'avatar-04',
    face: { cy: 0.27, s: 0.55 },
    image: { source: require('../../assets/avatars/avatar-04.png'), width: 253, height: 600 },
  },
  {
    id: 'avatar-05',
    face: { cy: 0.3, s: 0.7 },
    image: { source: require('../../assets/avatars/avatar-05.png'), width: 686, height: 600 },
  },
  {
    id: 'avatar-06',
    face: { cy: 0.24, s: 0.5 },
    image: { source: require('../../assets/avatars/avatar-06.png'), width: 284, height: 600 },
  },
  {
    id: 'avatar-07',
    face: { cy: 0.22, s: 0.48 },
    image: { source: require('../../assets/avatars/avatar-07.png'), width: 270, height: 600 },
  },
  {
    id: 'avatar-08',
    face: { cy: 0.22, s: 0.48 },
    image: { source: require('../../assets/avatars/avatar-08.png'), width: 263, height: 600 },
  },
  {
    id: 'avatar-09',
    face: { cy: 0.24, s: 0.5 },
    image: { source: require('../../assets/avatars/avatar-09.png'), width: 402, height: 600 },
  },
  {
    id: 'avatar-10',
    face: { cy: 0.27, s: 0.6 },
    image: { source: require('../../assets/avatars/avatar-10.png'), width: 485, height: 600 },
  },
  {
    id: 'avatar-11',
    face: { cy: 0.24, s: 0.55 },
    image: { source: require('../../assets/avatars/avatar-11.png'), width: 305, height: 600 },
  },
];

export const avatarById = (id: AvatarId): Avatar =>
  avatars.find((a) => a.id === id) ?? (avatars[0] as Avatar);

export const scenes = {
  bureau: { source: require('../../assets/scenes/bureau.png'), width: 1086, height: 351 },
  decor: { width: 1086, height: 1448 },
} as const;
