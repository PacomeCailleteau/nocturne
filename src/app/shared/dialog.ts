import { Component, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { LocaleStore } from '../core/i18n/locale-store';

@Component({
  selector: 'app-dialog',
  template: `<dialog #dialog [attr.aria-label]="heading()" (close)="closed.emit()">
    <div class="dialog-heading">
      <h2>{{ heading() }}</h2>
      <button
        type="button"
        class="icon-button"
        [attr.aria-label]="locale.t('close')"
        (click)="close()"
      >
        ×
      </button>
    </div>
    <ng-content />
  </dialog>`,
})
export class DialogComponent {
  readonly heading = input.required<string>();
  readonly closed = output<void>();
  readonly locale = inject(LocaleStore);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  open(): void {
    this.dialog().nativeElement.showModal();
  }
  close(): void {
    this.dialog().nativeElement.close();
  }
}
