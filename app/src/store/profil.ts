import { create } from 'zustand';

import { profil as initial } from '@/data/fixtures';
import type { AvatarId, RecruiterId } from '@/types/characters';

type ProfilState = {
  prenom: string;
  avatar: AvatarId;
  recruteur: RecruiterId;
  /** null : « Pas d'offre précise » (choix du métier, TODO(maquette)). */
  offreId: string | null;
  /** Vrai une fois l'entrée (avatar, offre, recruteur) terminée. */
  entreeTerminee: boolean;
  setAvatar: (a: AvatarId) => void;
  setRecruteur: (r: RecruiterId) => void;
  setOffre: (id: string | null) => void;
  terminerEntree: () => void;
};

export const useProfil = create<ProfilState>((set) => ({
  prenom: initial.prenom,
  avatar: initial.avatar,
  recruteur: initial.recruteur,
  offreId: initial.offreId,
  entreeTerminee: false,
  setAvatar: (avatar) => set({ avatar }),
  setRecruteur: (recruteur) => set({ recruteur }),
  setOffre: (offreId) => set({ offreId }),
  terminerEntree: () => set({ entreeTerminee: true }),
}));
