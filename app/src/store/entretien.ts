import { create } from 'zustand';

import type { Expression, RecruiterId } from '@/types/characters';
import type { Entretien, Reaction } from '@/types/domain';

/**
 * Machine à états de l'entretien (PROMPT.md §14) :
 * question → enregistrement → reflexion → reaction → (question suivante | termine).
 * « Répondre par écrit » passe de question ou enregistrement à ecrit, puis à reflexion.
 */
export type Phase = 'question' | 'enregistrement' | 'ecrit' | 'reflexion' | 'reaction' | 'termine';

export type EtatEntretien = {
  phase: Phase;
  rang: number;
  total: number;
  reponse: string;
  dureeSecondes: number;
  reaction: Reaction | null;
};

export type Evenement =
  | { type: 'parler' }
  | { type: 'ecrire' }
  | { type: 'terminerReponse'; reponse: string; dureeSecondes: number }
  | { type: 'reagir'; reaction: Reaction }
  | { type: 'suivante' };

export const etatInitial = (total: number): EtatEntretien => ({
  phase: 'question',
  rang: 1,
  total,
  reponse: '',
  dureeSecondes: 0,
  reaction: null,
});

/** Transitions autorisées ; tout autre événement laisse l'état inchangé. */
export function transition(e: EtatEntretien, ev: Evenement): EtatEntretien {
  switch (ev.type) {
    case 'parler':
      return e.phase === 'question' ? { ...e, phase: 'enregistrement' } : e;
    case 'ecrire':
      return e.phase === 'question' || e.phase === 'enregistrement' ? { ...e, phase: 'ecrit' } : e;
    case 'terminerReponse':
      return e.phase === 'enregistrement' || e.phase === 'ecrit'
        ? { ...e, phase: 'reflexion', reponse: ev.reponse, dureeSecondes: ev.dureeSecondes }
        : e;
    case 'reagir':
      return e.phase === 'reflexion' ? { ...e, phase: 'reaction', reaction: ev.reaction } : e;
    case 'suivante':
      if (e.phase !== 'reaction') return e;
      return e.rang >= e.total
        ? { ...e, phase: 'termine' }
        : { ...etatInitial(e.total), rang: e.rang + 1 };
  }
}

/** Expression du recruteur pour chaque phase. */
export function expressionPour(e: EtatEntretien): Expression {
  switch (e.phase) {
    case 'question':
      return 'neutre';
    case 'enregistrement':
    case 'ecrit':
      return 'ecoute';
    case 'reflexion':
      return 'reflechit';
    case 'reaction':
      return e.reaction?.expression ?? 'neutre';
    case 'termine':
      return 'ravi';
  }
}

type Store = EtatEntretien & {
  entretien: Entretien | null;
  recruteur: RecruiterId;
  demarrer: (entretien: Entretien) => void;
  envoyer: (ev: Evenement) => void;
};

export const useEntretien = create<Store>((set) => ({
  ...etatInitial(5),
  entretien: null,
  recruteur: 'lou',
  demarrer: (entretien) =>
    set({ ...etatInitial(entretien.questions.length), entretien, recruteur: entretien.recruteur }),
  envoyer: (ev) => set((s) => transition(s, ev)),
}));
