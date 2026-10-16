import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ANALYTICS_STYLES } from './analytics-styles';
import type { AnalyticsModel } from './analytics-types';
import { AnalyticsView } from './analytics-view';

export class AnalyticsElement extends HTMLElement {
  private readonly mount: HTMLDivElement;
  private root: Root | null = null;
  private currentModel: AnalyticsModel | null = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = ANALYTICS_STYLES;
    this.mount = document.createElement('div');
    shadow.append(style, this.mount);
  }

  set model(value: AnalyticsModel) {
    this.currentModel = value;
    this.render();
  }

  get model(): AnalyticsModel | null {
    return this.currentModel;
  }

  connectedCallback(): void {
    this.root = createRoot(this.mount);
    this.render();
  }

  disconnectedCallback(): void {
    this.root?.unmount();
    this.root = null;
  }

  private render(): void {
    if (this.currentModel && this.root)
      this.root.render(createElement(AnalyticsView, { model: this.currentModel }));
  }
}

export function registerAnalyticsElement(): void {
  if (!customElements.get('nocturne-analytics'))
    customElements.define('nocturne-analytics', AnalyticsElement);
}
