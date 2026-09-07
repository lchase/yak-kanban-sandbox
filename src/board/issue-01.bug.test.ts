/**
 * Bug pin for issue 01 — RED on the `seed` tag by design.
 *
 * `*.bug.test.ts` files are excluded from `npm test` (so a single-issue
 * fix can turn the suite green) and run by `npm run test:bugs`. Fixing
 * issue 01 should make this pass; promote it into the normal suite
 * (rename to drop `.bug`) as the regression test.
 *
 * Do NOT `.skip` this to go green — that is the thing under test.
 */
import { describe, expect, it } from "vitest";
import { columnOf, findColumn } from "./columns.js";
import { addCard, createBoard, makeCard, moveCard } from "./board.js";
import { BACKLOG, DONE } from "./column-names.js";

describe("issue 01 — moving a card to Done", () => {
  it("moves the card to Done without leaving a copy in its old column", () => {
    const board = createBoard();
    const card = makeCard("finish the feature");
    addCard(board, BACKLOG, card);

    moveCard(board, card.id, DONE);

    expect(findColumn(board, DONE)!.cards).toContain(card);
    expect(findColumn(board, BACKLOG)!.cards).not.toContain(card);
    expect(columnOf(board, card.id)?.name).toBe(DONE);
    // The card must exist exactly once across the whole board.
    const copies = board.columns
      .flatMap((c) => c.cards)
      .filter((c) => c.id === card.id);
    expect(copies).toHaveLength(1);
  });
});
