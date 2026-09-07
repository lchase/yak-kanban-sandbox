# Persist the board to localStorage

## What we want

The board currently resets on every page load. Persist it: on any
mutation, save; on load, restore the saved board if there is one,
otherwise start from `createBoard()` + the demo cards.

## The design fork

Where does persistence live? This is a genuine decision the workflow's
design-review step should weigh:

- **In the board modules** — `addCard` / `moveCard` write through to
  storage. Simple call sites, but the pure logic layer gains an I/O
  dependency and the unit tests need storage stubbed.
- **In a wrapper / store layer** — the `src/board/` functions stay pure;
  a `src/ui/` (or `src/store/`) layer observes mutations and persists.
  Keeps the tested core clean; the wiring is a little more ceremony.

Pick one, justify it, and keep the pure board tests free of
`localStorage`.

## Scope

- Save / load / clear against `localStorage` under a single namespaced
  key. Corrupt or absent stored data falls back to a fresh board, never
  throws.
- Tests for the serialize/deserialize round-trip and the corrupt-data
  fallback (a fake storage object is fine — do not require a browser).

## Out of scope

- Migrations / versioned schemas. A version field is welcome; a
  migration framework is not.
- Syncing across tabs.
