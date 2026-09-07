# Design: filter cards by label (issue 03)

## Options considered

**1. Where does label collection live?**
- (a) Inline in the UI layer (`src/ui/`), computed each render.
- (b) A pure helper `collectLabels(board)` next to `filterByLabel`, in
  `src/board/`, e.g. `src/board/labels.ts`.

**2. `filterByLabel` return shape**
- (a) Return a `Board` with only matching columns/cards (drop empty
  columns entirely).
- (b) Return a `Board` with the same columns (same names, same
  `wipLimit`), but each column's `cards` filtered — empty columns kept
  as empty sections.

**3. Meaning of "no filter" / empty string**
- (a) `filterByLabel(board, "")` is special-cased to mean "no filter,
  return board unchanged".
- (b) `filterByLabel` has no special case: it's a plain predicate
  (`card.labels.includes(label)`). `""` behaves like any other label
  that (normally) matches nothing. "Show everything" is a UI-level
  decision (don't call the filter at all), not a board-level concept.

## Choice

- **1b** — `collectLabels(board): string[]` lives in `src/board/labels.ts`,
  next to `filterByLabel`, exported from `src/board/index.ts`. Both are
  pure board-shape concerns (dedup + sort labels seen across all
  columns/cards); the UI just renders the list, it shouldn't own the
  logic for deriving it. Keeps `src/ui/` thin per existing convention
  (see `render.ts`'s stateless style).

- **2b** — filtering keeps every column, with its `name`/`wipLimit`
  intact, just filters `cards`. Column headers (`"Review (0/2)"`) and
  WIP-limit context stay visible and truthful while filtered; dropping
  columns would make the board layout jump around and hide capacity
  info the user still needs while filtering. Matches "every column
  shows only its cards that carry it" from the issue.

- **3b** — `filterByLabel` stays a dumb, total, pure predicate filter
  with no magic empty-string case. This keeps its contract simple and
  its unit tests uniform (present / absent / unknown / empty-string
  are all just "does any card have this exact label" — no branching).
  The UI owns the "no filter selected" state (a synthetic "All labels"
  `<option value="">`): when that option is chosen it re-renders with
  the *original* `board`, not the output of `filterByLabel`. This
  avoids overloading one function with two different semantics
  (filter vs. clear) and matches how `render.ts` already treats
  `onMove`/`paint` as UI-owned control flow.

## Resulting shapes (for the review/implementation pass)

```ts
// src/board/labels.ts
export function collectLabels(board: Board): string[];   // sorted, deduped
export function filterByLabel(board: Board, label: string): Board; // new Board, new Column objects, new cards arrays; Card objects themselves are shared (read-only), not cloned
```

UI: a `<select>` in `src/ui/` populated from `collectLabels(board)`
plus a leading "All labels" (`value=""`) option, `change` handler
re-invokes `paint()` with the chosen label held in local state; `paint`
calls `filterByLabel` only when a non-empty label is active.

## Immutability

`filterByLabel` must not mutate `board`: it builds new column objects
(`{ ...column, cards: column.cards.filter(...) }`) and a new top-level
`{ columns: [...] }`. Card objects are shared by reference between the
original and filtered views (filtering doesn't change cards, so this
is safe and cheap) — tests should assert the *original* board's
columns/cards arrays and lengths are untouched, not that every object
is a fresh deep clone.
