import { create } from 'zustand';

import { profil } from '@/data/fixtures';
import type { Langue, Profil } from '@/types/domain';

type ReglagesState = {
  objectifXp: Profil['objectifXp'];
  rappel: boolean;
  sons: boolean;
  classementActif: boolean;
  langue: Langue;
  set: (patch: Partial<Omit<ReglagesState, 'set'>>) => void;
};

export const useReglages = create<ReglagesState>((set) => ({
  objectifXp: profil.objectifXp,
  rappel: profil.rappel,
  sons: profil.sons,
  classementActif: profil.classementActif,
  langue: profil.langue,
  set: (patch) => set(patch),
}));
