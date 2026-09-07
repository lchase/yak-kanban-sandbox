/**
 * Bug-pinning tests. These are RED on the `seed` tag by design — each one
 * reproduces a defect described in a seeded GitHub issue. A workflow run
 * that fixes an issue turns its test green; `npm test` is fully green only
 * once every seeded bug is fixed.
 *
 *   - issue 01 → "moves a card to Done without leaving a copy behind"
 *   - issue 02 → "enforces the WIP limit exactly (no N+1)"
 *
 * Do NOT `.skip` these to make CI pass — that is the thing under test.
 */
import { describe, expect, it } from "vitest";
import { columnOf, findColumn } from "./columns.js";
import { addCard, createBoard, makeCard, moveCard } from "./board.js";

describe("issue 01 — moving a card to Done", () => {
  it("moves the card to Done without leaving a copy in its old column", () => {
    const board = createBoard();
    const card = makeCard("finish the feature");
    addCard(board, "Backlog", card);

    moveCard(board, card.id, "Done");

    expect(findColumn(board, "Done")!.cards).toContain(card);
    expect(findColumn(board, "Backlog")!.cards).not.toContain(card);
    expect(columnOf(board, card.id)?.name).toBe("Done");
    // The card must exist exactly once across the whole board.
    const copies = board.columns
      .flatMap((c) => c.cards)
      .filter((c) => c.id === card.id);
    expect(copies).toHaveLength(1);
  });
});

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
