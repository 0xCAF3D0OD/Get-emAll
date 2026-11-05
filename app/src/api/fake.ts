import * as data from '@/data/fixtures';
import type { Classement, Profil } from '@/types/domain';

import type { EntretienClient, JobA1Client } from './clients';

const wait = <T>(value: T, ms = 120): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));

let me: Profil = { ...data.profil };
let reaction = 0;

export const fakeEntretienClient: EntretienClient = {
  getMe: () => wait(me),
  patchMe: (patch) => {
    me = { ...me, ...patch };
    return wait(me);
  },
  getOffres: () => wait(data.offres),
  getParcours: () => wait(data.parcours),
  getLecon: (id) => {
    const lecon = data.lecons[id] ?? data.lecons['points-forts'];
    return lecon ? wait(lecon) : Promise.reject(new Error(`Leçon inconnue : ${id}`));
  },
  postTentative: (_id, correct) => wait({ correct, xp: correct ? 5 : 0, serie: correct ? 3 : 0 }),
  startEntretien: (recruteur) =>
    wait({
      id: `entretien-${recruteur}`,
      recruteur,
      questions: data.questionsEntretien[recruteur],
      dureeMaxReponse: 90,
    }),
  // Mode démo : les réactions tournent dans l'ordre ; la pause « réfléchit » couvre le délai.
  sendReponse: () => wait(data.reactionsDemo[reaction++ % data.reactionsDemo.length]!, 1500),
  getBilan: () => wait(data.bilan),
  getProgres: () => wait(data.progres),
  getClassement: (type): Promise<Classement> =>
    // TODO(maquette) : l'onglet « Mes amis » n'est pas dessiné, aucun moyen d'ajouter un ami.
    wait(type === 'ligue' ? data.classementLigue : { ...data.classementLigue, membres: [] }),
};

export const fakeJobA1Client: JobA1Client = {
  getProfile: () => wait(data.profilJobA1),
  getOrpProgress: () => wait(data.orp),
  getApplications: () => wait(data.candidatures),
};

/** Remet l'état fictif à zéro (tests). */
export const resetFakes = () => {
  me = { ...data.profil };
  reaction = 0;
};
