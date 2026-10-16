import { afterEach, describe, expect, it } from 'vitest';
import { CASES } from '../../app/data/cases';
import { createGameState } from '../../app/domain/game-state';
import { submitPuzzle } from '../../app/domain/game-transitions';
import { projectAnalytics } from '../../app/features/analytics/analytics-model';
import { AnalyticsElement, registerAnalyticsElement } from './analytics-element';

const mounted: AnalyticsElement[] = [];
function mount(): AnalyticsElement {
  registerAnalyticsElement();
  const element = document.createElement('nocturne-analytics') as AnalyticsElement;
  element.model = projectAnalytics(CASES, createGameState(CASES), new Map(), 'fr');
  document.body.append(element);
  mounted.push(element);
  return element;
}
function button(element: AnalyticsElement, text: string): HTMLButtonElement {
  return [...element.shadowRoot!.querySelectorAll('button')].find((item) => item.textContent?.includes(text))!;
}

afterEach(() => mounted.splice(0).forEach((element) => element.remove()));

describe('React analytics custom element', () => {
  it('registers once and renders real controls inside one isolated mount', async () => {
    const element = mount();
    const constructor = customElements.get('nocturne-analytics');
    registerAnalyticsElement();
    expect(customElements.get('nocturne-analytics')).toBe(constructor);
    await expect.poll(() => element.shadowRoot!.querySelectorAll('.tabs button').length).toBe(4);
    expect(element.shadowRoot!.children).toHaveLength(2);
    expect(element.shadowRoot!.querySelectorAll('svg')).toHaveLength(0);
    expect(element.shadowRoot!.textContent).not.toContain('Young Woman with a Water Pitcher');
  });

  it('updates data and locale through the real property while retaining React presentation selections', async () => {
    const element = mount();
    await expect.poll(() => !!button(element, 'Étoiles par épreuve')).toBe(true);
    button(element, 'Étoiles par épreuve').click();
    const select = element.shadowRoot!.querySelector('select')!;
    select.value = CASES[0].id;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await expect.poll(() => element.shadowRoot!.querySelectorAll('.panel').length).toBe(1);
    let state = createGameState(CASES);
    state = submitPuzzle(state, CASES[0], CASES[0].puzzles[0].id, CASES[0].puzzles[0].answer);
    element.model = projectAnalytics(CASES, state, new Map(), 'en');
    await expect.poll(() => element.shadowRoot!.querySelector('h2')?.textContent).toBe('Stars by puzzle');
    expect(element.shadowRoot!.querySelector('select')!.value).toBe(CASES[0].id);
    expect(element.shadowRoot!.textContent).toContain('3 / 3');
    expect(element.shadowRoot!.querySelector('svg')).not.toBeNull();
    button(element, 'Hide the values').click();
    await expect.poll(() => element.shadowRoot!.querySelectorAll('table').length).toBe(0);
  });

  it('unmounts the real DOM on disconnect and creates a fresh interactive root on reconnect', async () => {
    const element = mount();
    await expect.poll(() => !!button(element, 'Types d’œuvres')).toBe(true);
    button(element, 'Types d’œuvres').click();
    await expect.poll(() => element.shadowRoot!.querySelector('h2')?.textContent).toBe('Types d’œuvres');
    element.remove();
    expect(element.shadowRoot!.querySelectorAll('button')).toHaveLength(0);
    element.model = projectAnalytics(CASES, createGameState(CASES), new Map(), 'en');
    document.body.append(element);
    await expect.poll(() => element.shadowRoot!.querySelector('h2')?.textContent).toBe('Timeline');
    button(element, 'Compatible candidates').click();
    await expect.poll(() => element.shadowRoot!.querySelector('h2')?.textContent).toBe('Compatible candidates');
    expect(element.shadowRoot!.querySelectorAll('.tabs button')).toHaveLength(4);
    expect(element.shadowRoot!.querySelectorAll('table')).toHaveLength(3);
  });
});
