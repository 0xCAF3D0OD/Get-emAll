/**
 * Types du domaine, calqués sur l'API décrite dans le cahier technique (/api/v1).
 * Ils seront remplacés par les types générés depuis le schéma OpenAPI.
 */
import type { AvatarId, Expression, RecruiterId } from './characters';

export type Langue = 'fr' | 'de' | 'en';

/** GET /me */
export type Profil = {
  prenom: string;
  avatar: AvatarId;
  recruteur: RecruiterId;
  offreId: string | null;
  langue: Langue;
  objectifXp: 10 | 20 | 30 | 50;
  rappel: boolean;
  rappelHeure: string;
  sons: boolean;
  classementActif: boolean;
  pseudonyme: string;
};

/** POST /offres ; une offre reprise du suivi jobA1 ou collée. */
export type Offre = {
  id: string;
  titre: string;
  entreprise: string;
  ajouteeLe: string;
  candidatureId?: string;
};

export type StatutEtape = 'terminee' | 'en_cours' | 'verrouillee';
export type StatutLecon = 'faite' | 'en_cours' | 'a_venir';
export type TypeEtape = 'candidature' | 'appel' | 'rh' | 'technique' | 'offre';

export type LeconResume = { id: string; titre: string; statut: StatutLecon };

export type EtapeParcours = {
  rang: 1 | 2 | 3 | 4 | 5;
  type: TypeEtape;
  statut: StatutEtape;
  titre: string;
  sousTitre: string;
  recruteur?: RecruiterId;
  lecons?: LeconResume[];
  dureeLecon?: number;
};

/** GET /parcours */
export type Parcours = { offre: Offre; etapes: EtapeParcours[] };

export type OptionReponse = { id: string; texte: string };

export type ExerciceChoix = {
  id: string;
  type: 'choix';
  consigne: string;
  question: string;
  options: OptionReponse[];
  bonneReponse: string;
  explicationJuste: string;
  explicationFausse: Record<string, string>;
};

export type LettreStar = 'S' | 'T' | 'A' | 'R';
export type ExerciceStar = {
  id: string;
  type: 'star';
  consigne: string;
  morceaux: { id: string; texte: string; lettre: LettreStar }[];
  explicationJuste: string;
  explicationFausse: string;
};

export type Exercice = ExerciceChoix | ExerciceStar;

/** GET /lecons/{id} */
export type Lecon = {
  id: string;
  titre: string;
  recruteur: RecruiterId;
  exercices: Exercice[];
};

/** POST /exercices/{id}/tentatives */
export type ResultatTentative = { correct: boolean; xp: number; serie: number };

export type QuestionEntretien = { id: string; texte: string; indice: string };

/** POST /entretiens */
export type Entretien = {
  id: string;
  recruteur: RecruiterId;
  questions: QuestionEntretien[];
  dureeMaxReponse: number;
};

export type NoteCritere = 'solide' | 'a_travailler';
export type Critere = 'structure' | 'exemples' | 'clarte' | 'remplissage';

/** GET /jobs/{id} une fois « termine » : réaction du recruteur à une réponse. */
export type Reaction = {
  expression: Extract<Expression, 'ravi' | 'impressionne' | 'dubitatif' | 'decu'>;
  phrase: string;
};

export type ReponseRelue = {
  rang: number;
  question: string;
  extrait: string;
  note: NoteCritere;
  reponsePlusForte: string;
};

/** GET /entretiens/{id}/bilan */
export type Bilan = {
  recruteur: RecruiterId;
  xp: number;
  questionsRepondues: number;
  questionsTotal: number;
  dureeMin: number;
  criteres: { critere: Critere; note: NoteCritere }[];
  conseil: string;
  reponses: ReponseRelue[];
};

/** GET /progres */
export type Progres = {
  serie: number;
  record: number;
  xpSemaine: number;
  lecons: number;
  entretiens: number;
  xpObjectifJour: number;
  xpAujourdhui: number;
  indices: number;
  xpParJour: { jour: string; xp: number; aujourdhui?: boolean }[];
  competences: { nom: string; progression: number }[];
  derniersEntretiens: { recruteur: RecruiterId; date: string; note: string }[];
  rangLigue: number;
  ligue: NiveauLigue;
};

export type NiveauLigue = 'bronze' | 'argent' | 'or';

/** GET /classement */
export type Classement = {
  ligue: NiveauLigue;
  finDansJours: number;
  montent: number;
  membres: { rang: number; pseudonyme: string; avatar: AvatarId; xp: number; moi?: boolean }[];
};

/** jobA1 : profil, recherches ORP, candidatures (lecture seule, via API). */
export type ProfilJobA1 = { completion: number; manque: string; synchroIlYaMin: number };
export type ProgressionOrp = { mois: string; faites: number; objectif: number; finLe: string };
export type StatutCandidature = 'entretien' | 'relance' | 'attente';
export type Candidature = {
  id: string;
  poste: string;
  entreprise: string;
  statut: StatutCandidature;
  detail: string;
  offreId?: string;
};
