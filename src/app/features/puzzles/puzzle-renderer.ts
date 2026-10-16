import { Component, computed, inject, input, output } from '@angular/core';
import type { Puzzle, PuzzleAnswer, LabelRole } from '../../domain/case-definition';
import type { CaseEvidence } from '../../domain/artwork';
import { LocaleStore } from '../../core/i18n/locale-store';
import { ArtworkImage } from '../../shared/artwork-image';
import { OrderControls } from './order-controls';
import type { OrderItem } from './order-controls';
import { MaterialMatching } from './material-matching/material-matching';
import { Inventory } from './inventory/inventory';

@Component({
  selector: 'app-puzzle-renderer',
  imports: [ArtworkImage, OrderControls, MaterialMatching, Inventory],
  templateUrl: './puzzle-renderer.html',
})
export class PuzzleRenderer {
  readonly puzzle = input.required<Puzzle>();
  readonly evidence = input.required<CaseEvidence>();
  readonly draft = input<PuzzleAnswer | null>(null);
  readonly disabled = input(false);
  readonly incorrect = input(false);
  readonly draftChange = output<PuzzleAnswer>();
  readonly locale = inject(LocaleStore);
  readonly arrayDraft = computed(() =>
    Array.isArray(this.draft()) ? (this.draft() as readonly string[]) : null,
  );
  readonly mappingDraft = computed(() => {
    const draft = this.draft();
    return draft !== null && typeof draft === 'object' && !Array.isArray(draft)
      ? (draft as Readonly<Record<string, string>>)
      : null;
  });
  readonly chronologyItems = computed<readonly OrderItem[]>(() => {
    const puzzle = this.puzzle();
    if (puzzle.kind !== 'chronology') return [];
    return [...puzzle.items.slice(1), ...puzzle.items.slice(0, 1)].map((item) => {
      const facts = this.evidence().byId.get(item.artworkId)!.facts;
      return {
        id: item.id,
        artworkId: item.artworkId,
        label: facts.title ?? this.locale.t('unknown'),
        detail: `${this.locale.t('numericDates')} : ${facts.objectBeginDate ?? '?'} — ${facts.objectEndDate ?? '?'}`,
      };
    });
  });
  readonly labelItems = computed<readonly OrderItem[]>(() => {
    const puzzle = this.puzzle();
    return puzzle.kind === 'torn-label'
      ? (this.arrayDraft() ?? []).flatMap((id) => {
          const fragment = puzzle.fragments.find((item) => item.id === id);
          return fragment ? [{ id, label: this.locale.pick(fragment.text) }] : [];
        })
      : [];
  });

  addFragment(id: string): void {
    const draft = [...(this.arrayDraft() ?? [])];
    const empty = draft.indexOf('');
    if (empty >= 0) draft[empty] = id;
    else draft.push(id);
    this.draftChange.emit(draft);
  }
  removeFragment(id: string): void {
    this.draftChange.emit((this.arrayDraft() ?? []).filter((item) => item !== id));
  }
  roleLabel(role: LabelRole): string {
    return this.locale.t(role === 'date' ? 'date' : role);
  }
}
