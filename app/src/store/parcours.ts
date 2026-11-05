import { create } from 'zustand';

import { progres } from '@/data/fixtures';

type ParcoursState = {
  /** 3 indices par jour, sans vies. */
  indices: number;
  xpAujourdhui: number;
  serieReponses: number;
  /** Exercices ratés, remis en révision. */
  aReviser: string[];
  utiliserIndice: () => boolean;
  enregistrer: (exerciceId: string, correct: boolean, xp: number) => void;
};

export const useParcoursStore = create<ParcoursState>((set, get) => ({
  indices: progres.indices,
  xpAujourdhui: progres.xpAujourdhui,
  serieReponses: 2,
  aReviser: [],
  utiliserIndice: () => {
    if (get().indices <= 0) return false;
    set((s) => ({ indices: s.indices - 1 }));
    return true;
  },
  enregistrer: (exerciceId, correct, xp) =>
    set((s) => ({
      xpAujourdhui: s.xpAujourdhui + xp,
      serieReponses: correct ? s.serieReponses + 1 : 0,
      aReviser: correct ? s.aReviser : [...new Set([...s.aReviser, exerciceId])],
    })),
}));
