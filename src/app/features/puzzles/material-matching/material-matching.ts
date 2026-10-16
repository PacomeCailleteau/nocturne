import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocaleStore } from '../../../core/i18n/locale-store';
import type { CaseEvidence } from '../../../domain/artwork';
import type { MaterialPuzzle } from '../../../domain/case-definition';
import { ArtworkImage } from '../../../shared/artwork-image';

@Component({
  selector: 'app-material-matching',
  imports: [ArtworkImage, FormsModule],
  templateUrl: './material-matching.html',
})
export class MaterialMatching {
  readonly puzzle = input.required<MaterialPuzzle>();
  readonly evidence = input.required<CaseEvidence>();
  readonly draft = input<Readonly<Record<string, string>> | null>(null);
  readonly disabled = input(false);
  readonly draftChange = output<Readonly<Record<string, string>>>();
  readonly locale = inject(LocaleStore);

  assign(reportId: string, itemId: string): void {
    const draft = { ...this.draft() };
    const previous = draft[reportId] ?? '';
    const otherReport = itemId
      ? Object.keys(draft).find((key) => key !== reportId && draft[key] === itemId)
      : undefined;
    if (otherReport) draft[otherReport] = previous;
    draft[reportId] = itemId;
    this.draftChange.emit(draft);
  }

  selectedArtworkId(reportId: string): number | undefined {
    return this.puzzle().items.find((item) => item.id === this.draft()?.[reportId])?.artworkId;
  }
}
