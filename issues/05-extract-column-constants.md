# Extract column-name magic strings into a constants module

## What we want

The column names `"Backlog"`, `"In Progress"`, `"Review"`, `"Done"` are
string literals repeated across `src/board/board.ts` (in `createBoard`
and the Done special-case in `moveCard`), the tests, and `src/ui/`.

Pull them into one module — e.g. `src/board/column-names.ts` — exporting
named constants and, ideally, a `ColumnName` union type. Update every
call site to use them.

## Scope

- New constants module; a single source of truth for the four names.
- `moveCard`'s `toColumnName === "Done"` check uses the constant.
- `createBoard` builds its columns from the constants.
- No behaviour change — this is a pure refactor. Every existing test
  (including the still-red bug pins) must behave exactly as before.

## Notes for the implementer

`assess.kind = "chore"` — the minimal path. No design step, no new
tests beyond keeping the suite honest.
