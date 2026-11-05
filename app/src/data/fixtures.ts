/**
 * Données fictives typées. Les crochets ([Poste visé]…) viennent de la maquette :
 * ce sont des emplacements, remplacés par les vraies données de l'API.
 */
import type {
  Bilan,
  Candidature,
  Classement,
  Entretien,
  ExerciceChoix,
  Lecon,
  Offre,
  Parcours,
  Profil,
  ProfilJobA1,
  Progres,
  ProgressionOrp,
  Reaction,
} from '@/types/domain';
import type { RecruiterId } from '@/types/characters';

export const profil: Profil = {
  prenom: 'Kevin',
  avatar: 'avatar-01',
  recruteur: 'lou',
  offreId: 'offre-1',
  langue: 'fr',
  objectifXp: 20,
  rappel: true,
  rappelHeure: '18 h 00',
  sons: true,
  classementActif: true,
  pseudonyme: 'Pêche 27',
};

export const offres: Offre[] = [
  {
    id: 'offre-1',
    titre: '[Poste visé]',
    entreprise: '[Entreprise]',
    ajouteeLe: '[date]',
    candidatureId: 'cand-1',
  },
  { id: 'offre-2', titre: '[Autre poste]', entreprise: '[Entreprise]', ajouteeLe: '[date]' },
];

export const parcours: Parcours = {
  offre: offres[0] as Offre,
  etapes: [
    {
      rang: 1,
      type: 'candidature',
      statut: 'terminee',
      titre: 'Candidature envoyée',
      sousTitre: 'Ton CV et ton message de motivation',
    },
    {
      rang: 2,
      type: 'appel',
      statut: 'en_cours',
      titre: 'Appel du recruteur',
      sousTitre: '4 leçons · 3 min chacune',
      dureeLecon: 3,
      lecons: [
        { id: 'pitch', titre: 'Ton pitch', statut: 'faite' },
        { id: 'parcours', titre: 'Ton parcours', statut: 'faite' },
        { id: 'points-forts', titre: 'Tes points forts', statut: 'en_cours' },
        { id: 'questions', titre: 'Tes questions', statut: 'a_venir' },
      ],
    },
    {
      rang: 3,
      type: 'rh',
      statut: 'verrouillee',
      titre: 'Entretien RH avec Lou',
      sousTitre: 'Motivation, parcours, points faibles',
      recruteur: 'lou',
    },
    {
      rang: 4,
      type: 'technique',
      statut: 'verrouillee',
      titre: 'Entretien technique avec Marc',
      sousTitre: 'Questions de métier, cas pratique',
      recruteur: 'marc',
    },
    {
      rang: 5,
      type: 'offre',
      statut: 'verrouillee',
      titre: 'L’offre',
      sousTitre: 'Négocier ton salaire et tes conditions',
    },
  ],
};

const choixPointsForts = (id: string): ExerciceChoix => ({
  id,
  type: 'choix',
  consigne: 'Choisis la réponse la plus convaincante',
  question: '« Quels sont vos principaux points forts pour ce poste ? »',
  options: [
    { id: 'a', texte: '« Je suis perfectionniste et très motivé. »' },
    {
      id: 'b',
      texte:
        '« J’automatise : j’ai réduit le temps de déploiement de mon équipe en passant à la CI/CD. »',
    },
    { id: 'c', texte: '« Je m’adapte à tout, je sais tout faire. »' },
  ],
  bonneReponse: 'b',
  explicationJuste:
    'Un fait concret et son résultat convainquent plus qu’un adjectif. Le recruteur peut le vérifier et te relancer dessus.',
  explicationFausse: {
    a: '« Perfectionniste » est la réponse que les recruteurs entendent le plus. Elle ne prouve rien. Préfère un fait concret avec son résultat, comme la réponse cochée.',
    c: '« Je sais tout faire » ne se vérifie pas et inquiète le recruteur. Préfère un fait concret avec son résultat, comme la réponse cochée.',
  },
});

export const lecons: Record<string, Lecon> = {
  'points-forts': {
    id: 'points-forts',
    titre: 'Tes points forts',
    recruteur: 'lou',
    exercices: [
      // TODO(maquette) : seuls les exercices 3 (choix) et 5 (STAR) sont dessinés ; les autres reprennent ces modèles.
      { ...choixPointsForts('ex-1') },
      { ...choixPointsForts('ex-2') },
      { ...choixPointsForts('ex-3') },
      { ...choixPointsForts('ex-4') },
      {
        id: 'ex-5',
        type: 'star',
        consigne: 'Remets ta réponse dans l’ordre',
        morceaux: [
          {
            id: 'r',
            texte: '10 minutes par déploiement, plus aucun échec en trois mois.',
            lettre: 'R',
          },
          {
            id: 'a',
            texte: 'J’ai monté un pipeline GitLab CI avec tests automatiques.',
            lettre: 'A',
          },
          {
            id: 's',
            texte: 'Nos déploiements prenaient deux heures et échouaient souvent.',
            lettre: 'S',
          },
          { id: 't', texte: 'On m’a confié de les fiabiliser.', lettre: 'T' },
        ],
        explicationJuste:
          'Situation, tâche, action, résultat : le recruteur suit ton histoire et retient le chiffre de la fin.',
        explicationFausse:
          'Commence par la situation, puis ce qu’on t’a demandé, ce que tu as fait, et termine par le résultat chiffré.',
      },
      { ...choixPointsForts('ex-6') },
    ],
  },
};

export const questionsEntretien: Record<RecruiterId, Entretien['questions']> = {
  lou: [
    {
      id: 'lou-1',
      texte: 'Parlez-moi de vous.',
      indice: 'Présent, passé, futur : ton poste actuel, ton parcours, puis pourquoi ce poste.',
    },
    {
      id: 'lou-2',
      texte: 'Racontez-moi un incident en production que vous avez dû gérer.',
      indice: 'Méthode STAR : situation, tâche, action, résultat chiffré.',
    },
    {
      id: 'lou-3',
      texte: 'Pourquoi notre entreprise ?',
      indice: 'Cite un fait précis sur l’entreprise et relie-le à ton expérience.',
    },
    {
      id: 'lou-4',
      texte: 'Quel est votre principal point faible ?',
      indice: 'Un vrai point faible, et ce que tu fais déjà pour progresser.',
    },
    {
      id: 'lou-5',
      texte: 'Avez-vous des questions pour nous ?',
      indice: 'Prépare deux questions sur l’équipe ou les premiers mois.',
    },
  ],
  marc: [
    {
      id: 'marc-1',
      texte: 'Décrivez l’architecture du dernier projet sur lequel vous avez travaillé.',
      indice: 'Commence par le schéma général, puis ta part.',
    },
    {
      id: 'marc-2',
      texte: 'Comment mettriez-vous en place un pipeline CI/CD pour une nouvelle équipe ?',
      indice: 'Étapes, outils, et comment tu mesures que ça marche.',
    },
    {
      id: 'marc-3',
      texte: 'Comment diagnostiquez-vous un service devenu lent ?',
      indice: 'Mesurer d’abord, puis isoler, puis corriger.',
    },
    {
      id: 'marc-4',
      texte: 'Quelle erreur technique vous a le plus appris ?',
      indice: 'L’erreur, sa cause, et ce que tu as changé depuis.',
    },
    {
      id: 'marc-5',
      texte: 'Comment documentez-vous votre travail ?',
      indice: 'Pour qui, où, et un exemple concret.',
    },
  ],
  nadia: [
    {
      id: 'nadia-1',
      texte: 'Pourquoi quittez-vous votre poste actuel ?',
      indice: 'Reste positif : ce que tu cherches, pas ce que tu fuis.',
    },
    {
      id: 'nadia-2',
      texte: 'Où vous voyez-vous dans cinq ans ?',
      indice: 'Une direction réaliste, liée au poste.',
    },
    {
      id: 'nadia-3',
      texte: 'Pourquoi devrions-nous vous choisir plutôt qu’un autre candidat ?',
      indice: 'Deux atouts prouvés par des faits, liés à l’offre.',
    },
    {
      id: 'nadia-4',
      texte: 'Racontez un désaccord avec un collègue.',
      indice: 'Le désaccord, ton écoute, la solution trouvée.',
    },
    {
      id: 'nadia-5',
      texte: 'Quelles sont vos prétentions salariales ?',
      indice: 'Une fourchette basée sur le marché suisse pour ce poste.',
    },
  ],
  tom: [
    {
      id: 'tom-1',
      texte: 'Raconte-moi ce que tu as construit dont tu es le plus fier.',
      indice: 'Le problème, ce que tu as fait, l’impact.',
    },
    {
      id: 'tom-2',
      texte: 'Tu as déjà travaillé dans une petite équipe ?',
      indice: 'Un exemple où tu as dû toucher à tout.',
    },
    {
      id: 'tom-3',
      texte:
        'On bouge vite ici. Comment tu gères quand les priorités changent en cours de sprint ?',
      indice: 'Un exemple réel et comment tu as prévenu l’équipe.',
    },
    {
      id: 'tom-4',
      texte: 'Qu’est-ce que tu apprends en ce moment ?',
      indice: 'Un sujet précis et pourquoi.',
    },
    {
      id: 'tom-5',
      texte: 'Pourquoi une start-up ?',
      indice: 'Ce qui te plaît vraiment dans ce rythme.',
    },
  ],
};

// TODO(maquette) : les phrases de réaction ne sont pas dessinées ; textes provisoires.
export const reactionsDemo: Reaction[] = [
  {
    expression: 'impressionne',
    phrase: 'Très clair, et le résultat chiffré à la fin fait la différence.',
  },
  { expression: 'ravi', phrase: 'Merci, c’est exactement ce que je voulais entendre.' },
  { expression: 'dubitatif', phrase: 'Je ne suis pas sûre de voir ce que vous avez fait, vous.' },
  { expression: 'decu', phrase: 'C’est un peu court. Avez-vous un exemple précis ?' },
];

export const reponseDemo =
  '« En mars, notre cluster de production est tombé pendant une mise à jour. J’ai… »';

export const bilan: Bilan = {
  recruteur: 'lou',
  xp: 40,
  questionsRepondues: 5,
  questionsTotal: 5,
  dureeMin: 6,
  criteres: [
    { critere: 'structure', note: 'solide' },
    { critere: 'exemples', note: 'solide' },
    { critere: 'clarte', note: 'a_travailler' },
    { critere: 'remplissage', note: 'a_travailler' },
  ],
  conseil:
    'Ton incident était bien raconté. Termine par le résultat chiffré, sans repartir dans les détails techniques.',
  reponses: [
    {
      rang: 1,
      question: 'Parlez-moi de vous.',
      extrait: '« Je suis ingénieur DevOps junior, formé à 42 Lausanne… »',
      note: 'solide',
      reponsePlusForte:
        'Termine par le lien avec le poste : « … et c’est pour ça que votre équipe plateforme m’attire. »',
    },
    {
      rang: 2,
      question: 'Racontez-moi un incident en production que vous avez dû gérer.',
      extrait: '« Alors euh… c’était un déploiement qui a cassé, et donc… »',
      note: 'a_travailler',
      reponsePlusForte:
        'Situation en une phrase, puis ton action précise, puis le résultat chiffré : « Le service est revenu en 12 minutes, et on a ajouté un test pour éviter que ça se reproduise. »',
    },
    {
      rang: 3,
      question: 'Pourquoi notre entreprise ?',
      extrait: '« Votre plateforme tourne sur Kubernetes, c’est ce que je pratique… »',
      note: 'solide',
      reponsePlusForte:
        'Ajoute ce que tu apporterais : « … et j’ai déjà migré deux services vers Kubernetes. »',
    },
    {
      rang: 4,
      question: 'Quel est votre principal point faible ?',
      extrait: '« Je prends parfois trop de choses en même temps… »',
      note: 'solide',
      reponsePlusForte:
        'Donne l’outil que tu utilises déjà : « Je note tout dans un tableau de priorités chaque lundi. »',
    },
    {
      rang: 5,
      question: 'Avez-vous des questions pour nous ?',
      extrait: '« Comment se passent les trois premiers mois ? »',
      note: 'solide',
      reponsePlusForte:
        'Ajoute une question sur l’équipe : « Avec qui travaillerais-je au quotidien ? »',
    },
  ],
};

export const progres: Progres = {
  serie: 12,
  record: 15,
  xpSemaine: 180,
  lecons: 9,
  entretiens: 3,
  xpObjectifJour: 30,
  xpAujourdhui: 20,
  indices: 3,
  xpParJour: [
    { jour: 'L', xp: 20 },
    { jour: 'M', xp: 30 },
    { jour: 'M', xp: 10 },
    { jour: 'J', xp: 40 },
    { jour: 'V', xp: 30 },
    { jour: 'S', xp: 20 },
    { jour: 'Auj.', xp: 30, aujourdhui: true },
  ],
  competences: [
    { nom: 'Se présenter', progression: 100 },
    { nom: 'Méthode STAR', progression: 60 },
    { nom: 'Questions pièges', progression: 30 },
  ],
  derniersEntretiens: [
    { recruteur: 'lou', date: 'Hier', note: '3 critères solides sur 4' },
    { recruteur: 'marc', date: 'Lundi', note: '2 critères solides sur 4' },
  ],
  rangLigue: 4,
  ligue: 'argent',
};

export const classementLigue: Classement = {
  ligue: 'argent',
  finDansJours: 3,
  montent: 5,
  membres: [
    { rang: 1, pseudonyme: 'Renard 12', avatar: 'avatar-10', xp: 420 },
    { rang: 2, pseudonyme: 'Colibri 7', avatar: 'avatar-05', xp: 385 },
    { rang: 3, pseudonyme: 'Loutre 31', avatar: 'avatar-11', xp: 350 },
    { rang: 4, pseudonyme: 'Pêche 27', avatar: 'avatar-01', xp: 320, moi: true },
    { rang: 5, pseudonyme: 'Hibou 58', avatar: 'avatar-07', xp: 290 },
    { rang: 6, pseudonyme: 'Panda 3', avatar: 'avatar-09', xp: 240 },
  ],
};

export const profilJobA1: ProfilJobA1 = {
  completion: 80,
  manque: 'Il manque 2 compétences et ton certificat de travail le plus récent.',
  synchroIlYaMin: 5,
};

export const orp: ProgressionOrp = {
  mois: 'novembre',
  faites: 6,
  objectif: 10,
  finLe: '30 novembre',
};

export const candidatures: Candidature[] = [
  {
    id: 'cand-1',
    poste: '[Poste visé]',
    entreprise: '[Entreprise]',
    statut: 'entretien',
    detail: 'entretien le jeudi 12 novembre',
    offreId: 'offre-1',
  },
  {
    id: 'cand-2',
    poste: '[Poste 2]',
    entreprise: '[Entreprise 2]',
    statut: 'relance',
    detail: 'envoyée il y a 9 jours',
  },
  {
    id: 'cand-3',
    poste: '[Poste 3]',
    entreprise: '[Entreprise 3]',
    statut: 'attente',
    detail: 'envoyée il y a 3 jours',
  },
];
