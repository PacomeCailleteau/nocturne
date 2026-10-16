import { expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ARTWORKS } from '../../src/app/data/cases';

export async function mockMuseum(page: Page, overrides: Readonly<Record<number, Record<string, unknown>>> = {}): Promise<void> {
  await page.route('https://images.metmuseum.org/**', async (route) => {
    const url = route.request().url();
    const artwork = ARTWORKS.find((item) => [item.primaryImage, item.primaryImageSmall].some((value) => new URL(value).href === url));
    if (!artwork) { await route.abort(); return; }
    await route.fulfill({ contentType: 'image/webp', body: await readFile(resolve('public/artworks', `${artwork.id}.webp`)) });
  });
  await page.route('https://collectionapi.metmuseum.org/public/collection/v1/objects/*', async (route) => {
    const id = Number(route.request().url().split('/').at(-1));
    const source = JSON.parse(await readFile(resolve('tests/fixtures/met', `${id}.json`), 'utf8'));
    await route.fulfill({ json: { ...source, ...overrides[id] } });
  });
}

export async function arrange(page: Page, ids: readonly string[]): Promise<void> {
  for (let target = 0; target < ids.length; target++) {
    let current = await page.locator('[data-order-id]').evaluateAll((items, id) => items.findIndex((item) => item.getAttribute('data-order-id') === id), ids[target]);
    while (current > target) {
      const earlier = page.locator(`[data-order-id="${ids[target]}"] button`).first();
      await earlier.focus();
      await page.keyboard.press('Enter');
      current--;
    }
  }
}

export async function openPuzzle(page: Page, id: string): Promise<void> {
  await page.goto(`/#/cases/the-silent-frame/puzzles/${id}`);
  await expect(page.locator('app-puzzle-renderer')).toBeVisible();
}

export async function assistFirstCase(page: Page): Promise<void> {
  for (const id of ['silent-fragment', 'silent-chronology', 'silent-report', 'silent-label']) {
    await openPuzzle(page, id);
    for (let hint = 0; hint < 3; hint++) await page.getByTestId('request-hint').click();
    await expect(page.locator('.feedback.success')).toBeVisible();
  }
  await page.goto('/#/cases/the-silent-frame');
  await expect(page.locator('.final-candidates')).toBeVisible();
}
