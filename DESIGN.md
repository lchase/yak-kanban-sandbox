# Design: localStorage persistence for board

## Options

**A. Bake into src/board/`** — `addCard`/`moveCard` write-through to
localStorage on every mutation.
- Pro: single call site, hard to forget to persist.
- Con: pure logic module gets I/O side effect + storage dependency.
  Breaks existing storage-free unit tests (need mocking/stubbing
  localStorage in every board test, not just persistence tests).
  Also wrong layer: board logic shouldn't know browser exists (future
  server/CLI reuse of board/ becomes harder).

**B. Separate store/wrapper layer** (`src/store/`) — wraps a `Board`,
exposes same mutation API (`addCard`, `moveCard`, ...) by delegating to
`src/board/`, and persists to localStorage after each successful call.
Load/restore logic lives here too: try localStorage → parse/validate →
fall back to `createBoard()` + demo cards on missing/corrupt data,
catching all errors (never throws).
- Pro: `src/board/` stays pure, existing tests untouched. Persistence
  is isolated, testable with a fake storage stub, swappable later
  (e.g. IndexedDB, server sync) without touching board logic.
- Con: one more module/indirection; `main.ts` calls store instead of
  board functions directly.

## Choice

**Option B** — separate `src/store/` layer.

## Reason

Board logic (`src/board/`) is intentionally pure and unit-tested
without I/O — the issue itself flags that this must stay true. A
store layer that wraps mutations and persists after each one gives
write-through-on-every-mutation semantics (satisfies the requirement)
without touching board/. It's a thin wrapper: same function shapes,
plus a save call and a load-with-fallback on init. `main.ts` swaps its
`import { addCard, createBoard, moveCard } from "../board/index.js"`
for the store's equivalents — one integration point, no change to
`render.ts` or `board/`. Corrupt-data and round-trip tests target the
store module with a fake storage stub, independent of board tests.

Namespacing: single key, e.g. `"kanban-board"`, JSON-serialized
`Board`. Restore: `JSON.parse` wrapped in try/catch; any parse error
or shape mismatch falls back to `createBoard()` + demo cards, same as
today's `main.ts` seed — restore never throws.
