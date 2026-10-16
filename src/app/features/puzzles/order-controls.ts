import { Component, computed, inject, input, output } from '@angular/core';
import { LocaleStore } from '../../core/i18n/locale-store';
import { ArtworkImage } from '../../shared/artwork-image';

export interface OrderItem {
  readonly id: string;
  readonly label: string;
  readonly detail?: string;
  readonly artworkId?: number;
}

export function completeOrder(
  itemIds: readonly string[],
  draft: readonly string[] | null,
): readonly string[] {
  const chosen = (draft ?? []).filter((id) => itemIds.includes(id));
  return [...chosen, ...itemIds.filter((id) => !chosen.includes(id))];
}

@Component({
  selector: 'app-order-controls',
  imports: [ArtworkImage],
  template: `<ol class="order-list">
    @for (item of ordered(); track item.id; let index = $index) {
      <li [attr.data-order-id]="item.id">
        <span class="order-position">{{ index + 1 }}</span>
        @if (item.artworkId; as id) {
          <app-artwork-image [artworkId]="id" [compact]="true" />
        }
        <div class="order-copy">
          @if (slotLabels()[index]; as slotLabel) {
            <span class="order-slot-label">{{ slotLabel }}</span>
          }
          <strong>{{ item.label }}</strong>
          @if (item.detail) {
            <small>{{ item.detail }}</small>
          }
        </div>
        <div class="order-buttons">
          <button
            type="button"
            class="icon-button"
            [attr.aria-label]="locale.t('moveEarlier') + ' : ' + item.label"
            [disabled]="disabled() || index === 0"
            (click)="move(index, -1)"
          >
            ↑</button
          ><button
            type="button"
            class="icon-button"
            [attr.aria-label]="locale.t('moveLater') + ' : ' + item.label"
            [disabled]="disabled() || index === ordered().length - 1"
            (click)="move(index, 1)"
          >
            ↓
          </button>
        </div>
      </li>
    }
  </ol>`,
})
export class OrderControls {
  readonly items = input.required<readonly OrderItem[]>();
  readonly order = input<readonly string[] | null>(null);
  readonly disabled = input(false);
  readonly slotLabels = input<readonly string[]>([]);
  readonly orderChange = output<readonly string[]>();
  readonly locale = inject(LocaleStore);
  readonly ordered = computed(() => {
    const items = this.items();
    const order = completeOrder(
      items.map((item) => item.id),
      this.order(),
    );
    return order.map((id) => items.find((item) => item.id === id)!);
  });

  move(index: number, direction: number): void {
    const order = this.ordered().map((item) => item.id);
    [order[index], order[index + direction]] = [order[index + direction], order[index]];
    this.orderChange.emit(order);
  }
}
