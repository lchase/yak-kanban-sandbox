# RUNBOOK — one full acceptance loop

The loop this repo exists to support:

```
seed issues  →  ticks drive yak runs  →  inspect PRs  →  reset to pristine
```

## 0. Prerequisites

- `gh` authenticated for the target repo (`gh auth status`).
- `yak` on `PATH` (`yak --version`).
- `yak-harness` built and on `PATH` (see the yak-harness repo).
- Node 22+.
- This repo cloned. Run `npm install` once.

## 1. Confirm the pristine state

On the `seed` tag, the three workflow checks must behave like this:

```bash
git checkout seed
npm install
npm run typecheck   # exits 0
npm run build       # exits 0
npm test            # exits 1 — src/board/known-bugs.test.ts is RED by design
```

`known-bugs.test.ts` pins issues 01 and 02. Every other test passes. If
anything else is red, the checkout is not pristine — run
`scripts/reset.sh`.

## 2. Seed the backlog

```bash
scripts/seed-issues.sh lchase/yak-kanban-sandbox
```

Creates the `yak` label and five issues (bodies from `issues/`), each
labelled `yak` and nothing else — i.e. "qualified by a human, not yet
launched" in the harness state machine (spec §8).

## 3. Point the harness at the checkout

Copy the example config and set `yakRepoPath` to this checkout's
absolute path:

```bash
cp harness.config.example.json harness.config.json
# edit yakRepoPath
```

## 4. Drive the ticks

Either run a tick by hand, repeatedly:

```bash
yak-harness tick --config harness.config.json
```

or install a local cron line and watch:

```
*/5 * * * * yak-harness tick --config /ABS/PATH/harness.config.json
```

Watch the label state machine move on each issue:
`yak` → `yak:running` → (`yak:waiting` for the gated ones) → `yak:pr-open`.
`.harness/tick.log` gets one JSON line per tick.

Expected per issue:

| issue | expected path |
|---|---|
| 01 Done duplicate | hands-free — `confirm-scope` and `design-review` skip; straight to `yak:pr-open` |
| 02 WIP off-by-one | stops at `yak:waiting` on a `confirm-scope` gate (assess confidence < 0.85); answer the gate comment to resume |
| 03 filter by label | design + design-review + docs steps fire; multi-subtask build |
| 04 localStorage | `design-review` is a real decision (where persistence lives) |
| 05 extract constants | minimal chore path |

## 5. Answer any gates

For an issue sitting in `yak:waiting`, the harness has posted the gate
prompt as an issue comment. Reply in a comment following the `key: value`
contract shown, from an account that is OWNER / MEMBER / COLLABORATOR.
The next tick parses it and resumes the run.

## 6. Inspect the PRs

Each finished run opens a PR against `main`. For issues 01 and 02 the
PR should turn `known-bugs.test.ts` green. Review, then either merge
(harness moves the issue to `yak:done`) or close.

## 7. Reset

```bash
scripts/reset.sh
```

`git reset --hard seed && git clean -fd`, plus pruning any `yak/*`
worktrees and branches the runs created. Re-runnable any number of
times. Close or delete the seeded issues manually if you want a fully
clean slate (the harness never closes issues — spec §10 invariant 10).

## Smoke-testing the workflow without the harness

Independent of the tick loop, a single run against this checkout should
drive the localized bug to green:

```bash
yak run <path-to>/implement-change.yaml --isolation worktree \
  --input issueRef=lchase/yak-kanban-sandbox#1
```

> **Status:** pending the `implement-change` workflow YAML and
> `yak run --input` landing in yak. The sandbox, its defects, and its
> issues do not depend on either.
