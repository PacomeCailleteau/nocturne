import { expect, test } from '@playwright/test';
import { mockMuseum } from './helpers';

test('keeps keyboard focus on the moved object including an enabled boundary arrow', async ({ page }) => {
  await mockMuseum(page);
  await page.goto('/#/cases/the-last-inventory/puzzles/inventory-arrangement');
  const head = page.locator('[data-order-id="work-544752"]');
  await head.getByRole('button').first().focus();
  await page.keyboard.press('Enter');
  await expect(head.locator('.order-position')).toHaveText('2');
  await expect(head.getByRole('button').first()).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(head.getByRole('button').last()).toBeFocused();
  await expect(page.locator('[data-order-id]').first()).toHaveAttribute('data-order-id', 'work-544752');
});

test('resumes the next unfinished puzzle and reaches the final through visible continuation controls', async ({ page }) => {
  await mockMuseum(page);
  await page.goto('/#/cases/the-silent-frame');
  await page.getByRole('link', { name: /Commencer l’enquête/ }).click();
  for (let hint = 0; hint < 3; hint++) await page.getByTestId('request-hint').click();
  await expect(page.getByRole('link', { name: /Explorer l’épreuve suivante/ })).toBeFocused();
  await page.getByRole('link', { name: 'Consulter le dossier' }).click();
  const resume = page.getByRole('link', { name: /Reprendre l’enquête/ });
  await expect(resume).toHaveAttribute('href', '#/cases/the-silent-frame/puzzles/silent-chronology');
  await resume.click();
  for (let puzzle = 1; puzzle < 4; puzzle++) {
    for (let hint = 0; hint < 3; hint++) await page.getByTestId('request-hint').click();
    if (puzzle < 3) await page.getByRole('link', { name: /Explorer l’épreuve suivante/ }).click();
  }
  const final = page.locator('.completion-links').getByRole('link', { name: /identification finale/ });
  await expect(final).toBeFocused();
  await final.click();
  await expect(page.locator('.final-section h2')).toBeInViewport();
  await page.locator('[data-candidate-id="436535"]').click();
  await page.getByRole('button', { name: 'Confirmer cette identification', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Affaire résolue', exact: true })).toBeFocused();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Affaire résolue', exact: true })).toBeVisible();
});
