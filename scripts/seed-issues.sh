#!/usr/bin/env bash
# Create one GitHub issue per file in issues/, each carrying the `yak`
# qualifying label. Idempotent-ish: skips a title that already has an
# open issue.
#
#   scripts/seed-issues.sh [owner/repo]
#
# Defaults the repo to the current checkout's `origin`.
set -euo pipefail
cd "$(dirname "$0")/.."

REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
echo "seeding issues into $REPO"

# The qualifying label the harness scans for (spec §8).
gh label create yak --repo "$REPO" \
  --color FFD966 --description "qualified for yak-harness" 2>/dev/null || true

existing="$(gh issue list --repo "$REPO" --state open --limit 200 \
  --json title -q '.[].title')"

for f in issues/*.md; do
  title="$(sed -n 's/^# //p' "$f" | head -1)"
  body="$(sed '1{/^# /d;}; 2{/^$/d;}' "$f")"

  if grep -Fxq "$title" <<<"$existing"; then
    echo "  skip (already open): $title"
    continue
  fi

  echo "  create: $title"
  gh issue create --repo "$REPO" --label yak \
    --title "$title" --body "$body" >/dev/null
done

echo "done."
