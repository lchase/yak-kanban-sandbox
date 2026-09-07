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
import { BACKLOG, IN_PROGRESS, REVIEW } from "./column-names.js";

describe("issue 02 — WIP limit enforcement", () => {
  it("rejects the card that would exceed a column's WIP limit", () => {
    const board = createBoard();
    const inProgress = findColumn(board, IN_PROGRESS)!; // wipLimit 2

    addCard(board, IN_PROGRESS, makeCard("a"));
    addCard(board, IN_PROGRESS, makeCard("b"));

    expect(() => addCard(board, IN_PROGRESS, makeCard("c"))).toThrow(
      /WIP limit/,
    );
    expect(inProgress.cards).toHaveLength(2);
  });

  it("rejects a move that would exceed the target column's WIP limit", () => {
    const board = createBoard();
    addCard(board, REVIEW, makeCard("a"));
    addCard(board, REVIEW, makeCard("b"));
    const third = makeCard("c");
    addCard(board, BACKLOG, third);

    expect(() => moveCard(board, third.id, REVIEW)).toThrow(/WIP limit/);
    expect(findColumn(board, REVIEW)!.cards).toHaveLength(2);
  });
});
