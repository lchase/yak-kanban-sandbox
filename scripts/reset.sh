#!/usr/bin/env bash
# Restore the pristine seeded state and remove anything a yak run left
# behind. Safe to run any number of times.
set -euo pipefail
cd "$(dirname "$0")/.."

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

echo "reset to 'seed'."
