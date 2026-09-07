# Add "filter cards by label"

## What we want

Cards already carry a `labels: string[]`. Add the ability to filter the
board to a single label: pick a label and every column shows only its
cards that carry it; clear the filter and the full board returns.

## Scope

- A pure function in `src/board/` — e.g. `filterByLabel(board, label):
  Board` — that returns a new board view without mutating the original.
- Its own unit tests: label present in some columns, label absent
  everywhere, empty-string / unknown label, original board untouched.
- A thin UI control (a `<select>` of the labels currently in use) wired
  through `src/ui/`.
- Collecting the set of labels in use is part of the job.

## Out of scope

- Multi-label / AND-OR filters. One label at a time.
- Persisting the active filter (see issue 04 for persistence).

## Notes for the implementer

This is a feature, not a bug — there is no failing test yet. Expect the
workflow to run design + design-review + docs steps: the shape of the
filter API and where label-collection lives are real choices.
