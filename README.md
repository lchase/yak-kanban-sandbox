# yak-kanban-sandbox

A small, **deliberately-broken** kanban board. It is the acceptance
sandbox for the [yak](https://github.com/lchase/yak) `implement-change`
workflow and the
[yak-harness](https://github.com/lchase/yak-harness) tick loop:

```
seed issues  →  point a harness at this checkout  →  let ticks drive
             →  inspect the PRs  →  reset to pristine  →  repeat
```

Nothing here is meant to be good code. The bugs are the point.

## The board

A local-only kanban web app, no backend:

- Columns, cards, move a card between columns, a WIP limit per column.
- Board logic is pure, unit-tested TypeScript in `src/board/`; a thin
  DOM UI sits on top in `src/ui/`.
- Toolchain matches the workflow's `integrate` step, so all three
  checks are real: `npm test` (vitest), `npm run typecheck`
  (`tsc --noEmit`), `npm run build` (vite).

## Seeded problems

One per workflow shape. Each is a GitHub issue (body in `issues/`,
carrying the `yak` label) **and** a real defect or gap in the code.

| # | problem | kind | exercises |
|---|---|---|---|
| 01 | moving a card to Done leaves a copy in its old column | bug, localized | hands-free path — `confirm-scope` + `design-review` skip |
| 02 | WIP limit is off by one (accepts N+1) | bug, needs investigation | `assess.confidence < 0.85` → `confirm-scope` gate |
| 03 | add "filter cards by label" | feature | `design` + `design-review` + `docs` fire; build fan-out |
| 04 | persist the board to localStorage | feature, design fork | `design-review` is a genuine decision |
| 05 | extract column-name magic strings into a constants module | chore | `assess.kind = 'chore'`, minimal path |

Issues 01 and 02 ship with a failing test that pins the defect
(`src/board/known-bugs.test.ts`). Issues 03–05 have no test yet — the
workflow writes them.

## State on the `seed` tag

`seed` is the pristine tag. On it:

| command | result |
|---|---|
| `npm run typecheck` | passes |
| `npm run build` | passes |
| `npm test` | **fails** — only `known-bugs.test.ts` is red, by design |

## Running the loop

See **[`RUNBOOK.md`](RUNBOOK.md)** for the full walkthrough. In short:

```bash
npm install
scripts/seed-issues.sh lchase/yak-kanban-sandbox   # create the 5 issues
cp harness.config.example.json harness.config.json  # set yakRepoPath
yak-harness tick --config harness.config.json       # drive one step
scripts/reset.sh                                    # back to pristine
```

## Layout

```
src/board/     pure board logic + its tests
src/board/known-bugs.test.ts   the RED-by-design bug pins
src/ui/        thin DOM layer
issues/        one Markdown body per seeded issue
scripts/       seed-issues.sh, reset.sh
harness.config.example.json    template harness config
RUNBOOK.md     the full seed → tick → PR → reset walkthrough
```
