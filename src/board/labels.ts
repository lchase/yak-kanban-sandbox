import type { Board, Column } from "./types.js";

/**
 * Collect every distinct label used across all cards on `board`,
 * sorted alphabetically. Does not mutate `board`.
 */
export function collectLabels(board: Board): string[] {
  const seen = new Set<string>();
  for (const column of board.columns) {
    for (const card of column.cards) {
      for (const label of card.labels) {
        seen.add(label);
      }
    }
  }
  return [...seen].sort();
}

/**
 * Return a new `Board` where each column keeps its `name`/`wipLimit`
 * but `cards` is filtered down to cards whose `labels` include
 * `label` exactly. Columns with no matching cards are kept, empty.
 *
 * Plain, total predicate: no special-casing of `label === ""` — an
 * empty string just matches cards that (normally) have no such
 * label. "Show everything" is a UI-level decision, not handled here.
 *
 * Does not mutate `board`, its columns, or its cards: new `Column`
 * objects and new `cards` arrays are built; `Card` objects themselves
 * are shared by reference (read-only, not cloned).
 */
export function filterByLabel(board: Board, label: string): Board {
  const columns: Column[] = board.columns.map((column) => ({
    ...column,
    cards: column.cards.filter((card) => card.labels.includes(label)),
  }));
  return { columns };
}
