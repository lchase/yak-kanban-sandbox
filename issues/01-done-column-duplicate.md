# Moving a card to Done leaves a copy in its old column

## What happens

Drag (or `moveCard(...)`) a card from any column to **Done**. The card
appears in Done — but it is *also* still sitting in the column it came
from. Every other move (Backlog → In Progress, In Progress → Review, …)
removes the card from its source correctly; only Done is wrong.

## Repro

From a fresh clone:

```
npm install
npm test -- known-bugs
```

`issue 01 — moving a card to Done` fails: after `moveCard(board, id, "Done")`
the card exists twice on the board.

## Expected

A card exists in exactly one column at all times. Moving to Done behaves
like moving anywhere else: added to the target, removed from the source.

## Notes for the implementer

- Localized, high-confidence fix — the defect is a single early-return
  branch in `src/board/board.ts`.
- The bug-pinning test in `src/board/known-bugs.test.ts` already
  describes the expected behaviour; make it green without weakening it.
