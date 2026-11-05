/**
 * Interfaces des clients d'API. Les implémentations fictives (fake.ts) seront remplacées
 * par des appels à api.getthemall.ch (/api/v1). Aucune requête réseau dans le squelette.
 */
import type { RecruiterId } from '@/types/characters';
import type {
  Bilan,
  Candidature,
  Classement,
  Entretien,
  Lecon,
  Offre,
  Parcours,
  Profil,
  ProfilJobA1,
  Progres,
  ProgressionOrp,
  Reaction,
  ResultatTentative,
} from '@/types/domain';

/** API get'emall. */
export interface EntretienClient {
  getMe(): Promise<Profil>;
  patchMe(patch: Partial<Profil>): Promise<Profil>;
  getOffres(): Promise<Offre[]>;
  getParcours(): Promise<Parcours>;
  getLecon(id: string): Promise<Lecon>;
  postTentative(exerciceId: string, correct: boolean): Promise<ResultatTentative>;
  startEntretien(recruteur: RecruiterId): Promise<Entretien>;
  /** Renvoie la réaction une fois la tâche (transcription puis analyse) terminée. */
  sendReponse(entretienId: string, rang: number, reponse: { texte?: string }): Promise<Reaction>;
  getBilan(entretienId: string): Promise<Bilan>;
  getProgres(): Promise<Progres>;
  getClassement(type: 'ligue' | 'amis'): Promise<Classement>;
}

/** Lecture du suivi jobA1, par API uniquement (base séparée, décision A2). */
export interface JobA1Client {
  getProfile(): Promise<ProfilJobA1>;
  getOrpProgress(): Promise<ProgressionOrp>;
  getApplications(): Promise<Candidature[]>;
}
