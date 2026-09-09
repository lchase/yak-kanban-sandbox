#!/usr/bin/env bash
# Restore the pristine seeded state and remove anything a yak run or the
# harness left behind. Safe to run any number of times.
#
#   scripts/reset.sh [--github]
#
# By default this touches only local state (git, worktrees, .runs/,
# .harness/) plus the yak/* branches on origin. With --github it also
# closes the open qualifying-labelled issues, so a re-seed starts from a
# genuinely clean backlog instead of piling new issues on top of old.
set -euo pipefail
cd "$(dirname "$0")/.."

GITHUB=0
for arg in "$@"; do
  case "$arg" in
    --github) GITHUB=1 ;;
    *) echo "usage: reset.sh [--github]" >&2; exit 2 ;;
  esac
done

# The qualifying label the harness scans for (matches seed-issues.sh).
QUALIFYING_LABEL="yak"

if ! git rev-parse --verify --quiet seed >/dev/null; then
  echo "no 'seed' tag in this repo — nothing to reset to." >&2
  exit 1
fi

# 1. Get onto main at the seed commit, so the yak/* branches are not
#    checked out and can be deleted.
git checkout -q -B main seed

# 2. Drop any worktrees a `yak run --isolation worktree` created.
git worktree list --porcelain \
  | awk '/^worktree /{w=substr($0,10)} /^branch refs\/heads\/yak\//{print w}' \
  | while read -r wt; do
      [ -n "$wt" ] && git worktree remove --force "$wt" || true
    done
git worktree prune

# 3. Delete the yak/* branches themselves — local, then remote (a run's
#    open-pr step pushes one; deleting it also closes any open PR).
git for-each-ref --format='%(refname:short)' refs/heads/yak \
  | while read -r branch; do
      [ -n "$branch" ] && git branch -D "$branch" || true
    done

if git remote get-url origin >/dev/null 2>&1; then
  git ls-remote --heads origin 'refs/heads/yak/*' \
    | awk '{print $2}' | sed 's#^refs/heads/##' \
    | while read -r branch; do
        [ -n "$branch" ] && git push -q origin --delete "$branch" || true
      done
  git fetch -pq origin
fi

# 4. Hard reset the working tree and scrub untracked files.
git reset --hard seed
git clean -fd

# 5. Drop the harness + yak run state. Both dirs are gitignored, so the
#    `git clean` above leaves them — and a stale .runs/ journal would
#    make the next loop's observe phase see orphan runs.
rm -rf .runs .harness

# 6. (--github) Close the open qualifying-labelled issues. The harness
#    never closes an issue (spec §8.4), so without this a re-seed just
#    adds a second copy of each. Status labels and marker comments go
#    with the closed issue; nothing else to scrub.
if [ "$GITHUB" -eq 1 ]; then
  if ! git remote get-url origin >/dev/null 2>&1; then
    echo "--github: no 'origin' remote — skipping issue cleanup." >&2
  else
    repo="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
    gh issue list --repo "$repo" --state open --label "$QUALIFYING_LABEL" \
      --limit 200 --json number -q '.[].number' \
      | while read -r n; do
          [ -n "$n" ] || continue
          echo "  close issue #$n"
          gh issue close "$n" --repo "$repo" \
            --comment "Closed by scripts/reset.sh — sandbox loop reset." >/dev/null \
            || echo "    (close #$n failed — skipping)"
        done
  fi
fi

echo "reset to 'seed'."
