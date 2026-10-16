import type { ArtworkReference, CaseDefinition, FactPredicate, InventoryConstraint, Localized, Puzzle, PuzzleAnswer } from './case-definition';

export function evaluatePredicate(artwork: Partial<ArtworkReference>, predicate: FactPredicate): boolean | undefined {
  const actual = artwork[predicate.field];
  if (actual === undefined || actual === '') return undefined;
  switch (predicate.operator) {
    case 'equals': return actual === predicate.value;
    case 'contains': return typeof actual === 'string' && typeof predicate.value === 'string' ? actual.toLowerCase().includes(predicate.value.toLowerCase()) : false;
    case 'at-least': return typeof actual === 'number' && typeof predicate.value === 'number' ? actual >= predicate.value : false;
    case 'at-most': return typeof actual === 'number' && typeof predicate.value === 'number' ? actual <= predicate.value : false;
  }
}

export function permutations<T>(values: readonly T[]): T[][] {
  if (!values.length) return [[]];
  return values.flatMap((value, index) => permutations(values.filter((_, i) => i !== index)).map((tail) => [value, ...tail]));
}

export function inventoryMatches(order: readonly string[], constraints: readonly InventoryConstraint[]): boolean {
  return constraints.every((constraint) => {
    if (constraint.kind === 'at') return order[constraint.position] === constraint.itemId;
    if (constraint.kind === 'not-at') return order[constraint.position] !== constraint.itemId;
    const left = order.indexOf(constraint.left);
    const right = order.indexOf(constraint.right);
    return left >= 0 && right >= 0 && (constraint.kind === 'before' ? left < right : Math.abs(left - right) === 1);
  });
}

export function answerMatches(puzzle: Puzzle, answer: PuzzleAnswer): boolean {
  if (typeof puzzle.answer === 'string') return answer === puzzle.answer;
  if (Array.isArray(puzzle.answer)) return Array.isArray(answer) && answer.length === puzzle.answer.length && puzzle.answer.every((id, index) => id === answer[index]);
  if (typeof answer !== 'object' || Array.isArray(answer)) return false;
  const expected = puzzle.answer as Readonly<Record<string, string>>;
  const actual = answer as Readonly<Record<string, string>>;
  return Object.keys(actual).length === Object.keys(expected).length && Object.entries(expected).every(([id, value]) => actual[id] === value);
}

export function compatibleCandidateIds(caseDefinition: CaseDefinition, clueIds: readonly string[], artworks: readonly ArtworkReference[]): number[] {
  const lookup = new Map(artworks.map((artwork) => [artwork.id, artwork]));
  const clues = caseDefinition.puzzles.map((puzzle) => puzzle.clue).filter((clue) => clueIds.includes(clue.id));
  return caseDefinition.candidateIds.filter((id) => {
    const artwork = lookup.get(id);
    return artwork !== undefined && clues.every((clue) => clue.predicates.every((predicate) => evaluatePredicate(artwork, predicate) === true));
  });
}

export function puzzleSolutions(puzzle: Puzzle, artworks: readonly ArtworkReference[]): PuzzleAnswer[] {
  const lookup = new Map(artworks.map((artwork) => [artwork.id, artwork]));
  if (puzzle.kind === 'fragment') return puzzle.options.filter((option) => option.artworkId === puzzle.fragment.artworkId).map((option) => option.id);
  if (puzzle.kind === 'contradiction') return puzzle.statements.filter((statement) => evaluatePredicate(lookup.get(statement.artworkId) ?? {}, statement.assertion) === false).map((statement) => statement.id);
  if (puzzle.kind === 'torn-label') return permutations(puzzle.fragments.map((fragment) => fragment.id)).filter((order) => order.every((id, index) => puzzle.fragments.find((fragment) => fragment.id === id)?.role === puzzle.template[index]));
  if (puzzle.kind === 'inventory') return permutations(puzzle.items.map((item) => item.id)).filter((order) => inventoryMatches(order, puzzle.constraints));
  if (puzzle.kind === 'chronology') return permutations(puzzle.items).filter((order) => order.every((item, index) => {
    if (!index) return true;
    const previous = lookup.get(order[index - 1].artworkId);
    const current = lookup.get(item.artworkId);
    return previous !== undefined && current !== undefined && previous.objectEndDate < current.objectBeginDate;
  })).map((order) => order.map((item) => item.id));
  return permutations(puzzle.items).filter((items) => puzzle.reports.every((report, index) => evaluatePredicate(lookup.get(items[index].artworkId) ?? {}, report.predicate) === true)).map((items) => Object.fromEntries(puzzle.reports.map((report, index) => [report.id, items[index].id])));
}

export function validateContent(cases: readonly CaseDefinition[], artworks: readonly ArtworkReference[]): string[] {
  const errors: string[] = [];
  const lookup = new Map(artworks.map((artwork) => [artwork.id, artwork]));
  const localized = (value: Localized, context: string) => {
    if (!value || !value.fr?.trim() || !value.en?.trim()) errors.push(`${context}: missing translation`);
  };
  const inspectText = (value: unknown, context: string): void => {
    if (!value || typeof value !== 'object') return;
    if ('fr' in value || 'en' in value) { localized(value as Localized, context); return; }
    for (const [key, child] of Object.entries(value)) inspectText(child, `${context}.${key}`);
  };
  if (lookup.size !== artworks.length) errors.push('Duplicate artwork ID');
  for (const artwork of artworks) {
    inspectText(artwork, `Artwork ${artwork.id}`);
    if (!artwork.isPublicDomain || !artwork.primaryImage || !artwork.image.path || !artwork.creditLine || !artwork.image.credit || !artwork.referencePath || !artwork.retrievedAt) errors.push(`Artwork ${artwork.id}: missing rights, image or provenance`);
    if (artwork.objectBeginDate > artwork.objectEndDate) errors.push(`Artwork ${artwork.id}: inverted dates`);
  }
  for (const caseDefinition of cases) {
    inspectText(caseDefinition, caseDefinition.id);
    const puzzleIds = caseDefinition.puzzles.map((puzzle) => puzzle.id);
    const clueIds = caseDefinition.puzzles.map((puzzle) => puzzle.clue.id);
    if (caseDefinition.puzzles.length !== 4 || new Set(puzzleIds).size !== 4 || new Set(clueIds).size !== 4) errors.push(`${caseDefinition.id}: expected four unique puzzles and clues`);
    if (!caseDefinition.candidateIds.includes(caseDefinition.targetArtworkId) || caseDefinition.witnessIds.includes(caseDefinition.targetArtworkId)) errors.push(`${caseDefinition.id}: invalid target role`);
    for (const id of [...caseDefinition.candidateIds, ...caseDefinition.witnessIds, caseDefinition.coverArtworkId]) if (!lookup.has(id)) errors.push(`${caseDefinition.id}: missing artwork ${id}`);
    for (const id of caseDefinition.candidateIds) if (!caseDefinition.candidateExplanations[id]) errors.push(`${caseDefinition.id}: missing candidate explanation ${id}`);
    for (const puzzle of caseDefinition.puzzles) {
      if (puzzle.hints.length !== 3) errors.push(`${puzzle.id}: expected three hints`);
      const referenced = [...puzzle.witnessIds, ...puzzle.pieces.flatMap((piece) => piece.artworkIds)];
      for (const id of referenced) if (!lookup.has(id) || !caseDefinition.witnessIds.includes(id)) errors.push(`${puzzle.id}: missing or undeclared witness ${id}`);
      if (!puzzle.pieces.some((piece) => piece.id === puzzle.clue.sourcePieceId)) errors.push(`${puzzle.id}: missing clue provenance`);
      if (puzzle.kind === 'fragment' && (!puzzle.fragment.path || !puzzle.fragment.alt.fr || !puzzle.fragment.alt.en || !puzzle.witnessIds.includes(puzzle.fragment.artworkId))) errors.push(`${puzzle.id}: invalid fragment`);
      if (puzzle.kind === 'fragment') {
        const { x, y, width, height } = puzzle.fragment.crop;
        if (![x, y, width, height].every(Number.isFinite) || x < 0 || y < 0 || width <= 0 || height <= 0 || x + width > 1 || y + height > 1) errors.push(`${puzzle.id}: invalid fragment crop`);
      }
      if (puzzle.kind === 'torn-label') {
        const source = lookup.get(puzzle.artworkId);
        const fields = { artist: 'artistDisplayName', title: 'title', date: 'objectDate', medium: 'medium' } as const;
        if (!source || puzzle.fragments.some((fragment) => fragment.text.en !== source[fields[fragment.role]])) errors.push(`${puzzle.id}: label text differs from its source`);
      }
      if (puzzle.kind === 'contradiction' && puzzle.statements.some((statement) => evaluatePredicate(lookup.get(statement.artworkId) ?? {}, statement.assertion) === undefined)) errors.push(`${puzzle.id}: undocumented assertion`);
      const solutions = puzzleSolutions(puzzle, artworks);
      if (solutions.length !== 1 || !answerMatches(puzzle, solutions[0])) errors.push(`${puzzle.id}: expected one canonical solution, found ${solutions.length}`);
    }
    for (const order of permutations(clueIds)) {
      for (let count = 0; count <= order.length; count++) {
        const compatible = compatibleCandidateIds(caseDefinition, order.slice(0, count), artworks);
        if (!compatible.includes(caseDefinition.targetArtworkId)) errors.push(`${caseDefinition.id}: inconsistent clue subset`);
        if (count === order.length && (compatible.length !== 1 || compatible[0] !== caseDefinition.targetArtworkId)) errors.push(`${caseDefinition.id}: non-unique conclusion`);
      }
    }
  }
  return [...new Set(errors)];
}

