import { etatInitial, expressionPour, transition, type EtatEntretien } from './entretien';

const reaction = { expression: 'impressionne', phrase: 'Bien.' } as const;

test('parcours complet d’une question à l’oral', () => {
  let e: EtatEntretien = etatInitial(2);
  expect(expressionPour(e)).toBe('neutre');
  e = transition(e, { type: 'parler' });
  expect(e.phase).toBe('enregistrement');
  expect(expressionPour(e)).toBe('ecoute');
  e = transition(e, { type: 'terminerReponse', reponse: 'x', dureeSecondes: 72 });
  expect(e.phase).toBe('reflexion');
  expect(expressionPour(e)).toBe('reflechit');
  e = transition(e, { type: 'reagir', reaction });
  expect(expressionPour(e)).toBe('impressionne');
  e = transition(e, { type: 'suivante' });
  expect(e).toMatchObject({ phase: 'question', rang: 2, reaction: null });
});

test('réponse par écrit', () => {
  let e = transition(etatInitial(1), { type: 'ecrire' });
  expect(e.phase).toBe('ecrit');
  e = transition(e, { type: 'terminerReponse', reponse: 'texte', dureeSecondes: 0 });
  expect(e.phase).toBe('reflexion');
});

test('la dernière question termine l’entretien', () => {
  let e = etatInitial(1);
  e = transition(e, { type: 'parler' });
  e = transition(e, { type: 'terminerReponse', reponse: '', dureeSecondes: 1 });
  e = transition(e, { type: 'reagir', reaction });
  expect(transition(e, { type: 'suivante' }).phase).toBe('termine');
});

test('un événement hors séquence ne change rien', () => {
  const e = etatInitial(3);
  expect(transition(e, { type: 'suivante' })).toBe(e);
  expect(transition(e, { type: 'reagir', reaction })).toBe(e);
});
