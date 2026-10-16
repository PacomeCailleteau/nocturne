import { Component, computed, inject, input, output } from '@angular/core';
import { LocaleStore } from '../../../core/i18n/locale-store';
import type { CaseEvidence } from '../../../domain/artwork';
import type { InventoryPuzzle } from '../../../domain/case-definition';
import { inventoryMatches } from '../../../domain/content-validation';
import { OrderControls, type OrderItem } from '../order-controls';

@Component({
  selector: 'app-inventory',
  imports: [OrderControls],
  templateUrl: './inventory.html',
})
export class Inventory {
  readonly puzzle = input.required<InventoryPuzzle>();
  readonly evidence = input.required<CaseEvidence>();
  readonly draft = input<readonly string[] | null>(null);
  readonly disabled = input(false);
  readonly incorrect = input(false);
  readonly draftChange = output<readonly string[]>();
  readonly locale = inject(LocaleStore);
  readonly items = computed<readonly OrderItem[]>(() =>
    this.puzzle().items.map((item) => {
      const facts = this.evidence().byId.get(item.artworkId)!.facts;
      return {
        id: item.id,
        artworkId: item.artworkId,
        label: facts.title || this.locale.t('unknown'),
        detail: facts.medium || this.locale.t('unknown'),
      };
    }),
  );
  readonly slotLabels = computed(() =>
    this.puzzle().slots.map((slot) => this.locale.pick(slot.label)),
  );
  readonly violatedConstraint = computed(() => {
    if (!this.incorrect()) return undefined;
    const puzzle = this.puzzle();
    const order = this.draft() ?? puzzle.items.map((item) => item.id);
    const index = puzzle.constraints.findIndex(
      (constraint) => !inventoryMatches(order, [constraint]),
    );
    return index >= 0 ? puzzle.constraintText[index] : undefined;
  });
}
