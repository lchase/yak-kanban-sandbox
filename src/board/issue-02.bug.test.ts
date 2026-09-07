/**
 * Bug pin for issue 02 — RED on the `seed` tag by design.
 *
 * `*.bug.test.ts` files are excluded from `npm test` and run by
 * `npm run test:bugs`. Fixing issue 02 should make this pass; promote it
 * into the normal suite (rename to drop `.bug`) as the regression test.
 *
 * Do NOT `.skip` this to go green — that is the thing under test.
 */
import { describe, expect, it } from "vitest";
import { findColumn } from "./columns.js";
import { addCard, createBoard, makeCard, moveCard } from "./board.js";

describe("issue 02 — WIP limit enforcement", () => {
  it("rejects the card that would exceed a column's WIP limit", () => {
    const board = createBoard();
    const inProgress = findColumn(board, "In Progress")!; // wipLimit 2

    addCard(board, "In Progress", makeCard("a"));
    addCard(board, "In Progress", makeCard("b"));

    expect(() => addCard(board, "In Progress", makeCard("c"))).toThrow(
      /WIP limit/,
    );
    expect(inProgress.cards).toHaveLength(2);
  });

  it("rejects a move that would exceed the target column's WIP limit", () => {
    const board = createBoard();
    addCard(board, "Review", makeCard("a"));
    addCard(board, "Review", makeCard("b"));
    const third = makeCard("c");
    addCard(board, "Backlog", third);

    expect(() => moveCard(board, third.id, "Review")).toThrow(/WIP limit/);
    expect(findColumn(board, "Review")!.cards).toHaveLength(2);
  });
});
