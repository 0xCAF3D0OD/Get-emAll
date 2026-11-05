import { expect, test } from '@playwright/test';

test('entrée : de l’accueil à la première leçon', async ({ page }) => {
  await page.goto('/accueil');
  await page.getByRole('button', { name: 'Commencer' }).click();
  await page.getByRole('radio', { name: 'Avatar avec foulard' }).click();
  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.getByRole('radio', { name: /\[Poste visé\]/ }).click();
  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.getByRole('radio', { name: /^Lou/ }).click();
  await page.getByRole('button', { name: 'Commencer ma première leçon' }).click();
  await expect(page).toHaveURL(/\/lecon\/points-forts/);
  await expect(page.getByRole('progressbar', { name: 'Exercice 1 sur 6' })).toBeVisible();
});

test('leçon : choisir, vérifier, réussite puis exercice suivant', async ({ page }) => {
  await page.goto('/lecon/points-forts');
  const verifier = page.getByRole('button', { name: 'Vérifier' });
  await expect(verifier).toBeDisabled();
  await page.getByRole('radio', { name: /J’automatise/ }).click();
  await verifier.click();
  await expect(page.getByRole('heading', { name: 'Juste !' })).toBeVisible();
  await page.getByRole('button', { name: 'Continuer' }).click();
  await expect(page.getByRole('progressbar', { name: 'Exercice 2 sur 6' })).toBeVisible();
});

test('entretien : répondre, réaction de Lou, puis relecture du compte-rendu', async ({ page }) => {
  await page.goto('/entretien/lou');
  await page.getByRole('button', { name: 'Répondre à voix haute' }).click();
  await expect(page.getByText(/^Enregistrement · 0:0\d sur 1:30$/)).toBeVisible();
  await page.getByRole('button', { name: 'Terminer ma réponse' }).click();
  await expect(page.getByText('Lou réfléchit')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Question suivante' })).toBeVisible({
    timeout: 5000,
  });
  await expect(page.getByRole('img', { name: 'Lou, impressionnée' })).toBeVisible();
  await page.goto('/entretien/bilan');
  await page.getByRole('button', { name: 'Relire mes réponses' }).click();
  const voir = page.getByRole('button', { name: 'Voir une réponse plus forte' }).first();
  await expect(voir).toHaveAttribute('aria-expanded', 'false');
  await voir.click();
  await expect(page.getByRole('button', { name: 'Masquer le conseil' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
});
