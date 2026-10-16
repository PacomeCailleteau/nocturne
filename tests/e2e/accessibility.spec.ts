import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { mockMuseum } from './helpers';

test('checks all six puzzle interfaces, artwork, notebook and React analyses with accessible values', async ({ page }) => {
  test.setTimeout(60000);
  await mockMuseum(page);
  const routes = [
    '/',
    '/#/cases/the-silent-frame',
    '/#/cases/the-silent-frame/puzzles/silent-fragment',
    '/#/cases/the-silent-frame/puzzles/silent-chronology',
    '/#/cases/the-silent-frame/puzzles/silent-report',
    '/#/cases/the-silent-frame/puzzles/silent-label',
    '/#/cases/ink-after-midnight/puzzles/ink-materials',
    '/#/cases/the-last-inventory/puzzles/inventory-arrangement',
    '/#/artworks/437881',
    '/#/notebook',
    '/#/analytics',
  ];
  for (const route of routes) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations, route).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
  }
  const analytics = page.locator('nocturne-analytics');
  for (const label of ['Candidates compatibles', 'Étoiles par épreuve']) {
    await analytics.getByRole('button', { name: label, exact: true }).click();
    await expect(analytics.getByRole('img').first()).toBeVisible();
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('native rules dialog keeps background controls inert and restores its trigger', async ({ page, isMobile }) => {
  await mockMuseum(page);
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
  const trigger = page.getByRole('button', { name: 'Règles du jeu', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((element) => document.activeElement === document.body || element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('plays without storage and retries a dated backup into real response values', async ({ page }) => {
  await mockMuseum(page);
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Unavailable', 'SecurityError'); } });
  });
  await page.route('https://collectionapi.metmuseum.org/public/collection/v1/objects/437881', (route) => route.abort('failed'));
  await page.goto('/#/artworks/437881');
  await expect(page.locator('.global-notice')).toBeVisible();
  await expect(page.locator('.artwork-detail-copy')).toContainText('Copie de secours du 2026-10-16');
  await page.unroute('https://collectionapi.metmuseum.org/public/collection/v1/objects/437881');
  await mockMuseum(page, { 437881: { title: 'Recovered museum title' } });
  await page.getByRole('button', { name: /Réessayer/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Recovered museum title');
  await expect(page.locator('.artwork-detail-copy')).toContainText('Données du Met');
  await page.goto('/#/cases/the-silent-frame/puzzles/silent-fragment');
  for (let hint = 0; hint < 3; hint++) await page.getByTestId('request-hint').click();
  await expect(page.locator('.feedback.success')).toContainText('1 / 3');
});

test('supports enlarged text, reduced motion, a mobile menu and loaded local typography', async ({ page, isMobile }, testInfo) => {
  await mockMuseum(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('16px "DM Sans"') && document.fonts.check('40px "Cormorant Garamond"'))).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('nocturne-home.jpg'), fullPage: true, type: 'jpeg', quality: 85 });
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter((element) => { const bounds = element.getBoundingClientRect(); return bounds.right > innerWidth + 1 || bounds.left < -1; }).map((element) => ({ tag: element.tagName, class: element.className, width: element.getBoundingClientRect().width })));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), JSON.stringify(overflow)).toBe(true);
  if (isMobile) {
    await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
    await page.getByRole('link', { name: 'Les analyses', exact: true }).click();
  } else await page.getByRole('link', { name: 'Les analyses', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'L’observatoire' })).toBeVisible();
  await page.locator('nocturne-analytics').getByRole('button', { name: 'Étoiles par épreuve', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
