# WIP limit is off by one — a column accepts one card too many

## What happens

"In Progress" and "Review" have a WIP limit of 2. In practice each will
hold **3** cards before it starts rejecting them. The limit is being
treated as "you may exceed it by one".

## Repro

```
npm install
npm run test:bugs
```

`src/board/issue-02.bug.test.ts` fails: a third `addCard` into a limit-2
column does not throw, and a `moveCard` into a full column is allowed.
(`npm test` excludes the `*.bug.test.ts` pins, so it is green at `seed`.)

## Expected

A column with `wipLimit: N` holds at most `N` cards. The `(N+1)`-th
`addCard` / `moveCard` into it throws (`/WIP limit/`) and leaves the
column unchanged. `wipLimit: null` stays unlimited.

## Notes for the implementer

- Worth a quick look before committing to a fix: is the intended
  semantics "limit = max cards" (most likely) or "limit = max *new*
  cards this cycle"? Confirm against `columnIsAtCapacity` in
  `src/board/columns.ts` and the column config in `createBoard`.
- Low confidence that the one-line comparison flip is the whole story —
  check every caller of `columnIsAtCapacity`.
- When fixed, promote `src/board/issue-02.bug.test.ts` into the normal
  suite (rename to `src/board/wip-limit.test.ts`, drop the `.bug`).
