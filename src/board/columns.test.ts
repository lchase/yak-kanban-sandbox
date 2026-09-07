import { describe, expect, it } from "vitest";
import { columnIsAtCapacity, columnOf, findColumn } from "./columns.js";
import { addCard, createBoard, makeCard, moveCard } from "./board.js";

describe("findColumn / columnOf", () => {
  it("finds a column by name", () => {
    const board = createBoard();
    expect(findColumn(board, "Review")?.name).toBe("Review");
    expect(findColumn(board, "Nope")).toBeUndefined();
  });

  it("reports which column holds a card", () => {
    const board = createBoard();
    const card = makeCard("write the runbook");
    addCard(board, "Backlog", card);
    expect(columnOf(board, card.id)?.name).toBe("Backlog");
    moveCard(board, card.id, "In Progress");
    expect(columnOf(board, card.id)?.name).toBe("In Progress");
  });
});

describe("columnIsAtCapacity", () => {
  it("is never at capacity when wipLimit is null", () => {
    const board = createBoard();
    const backlog = findColumn(board, "Backlog")!;
    for (let i = 0; i < 10; i++) backlog.cards.push(makeCard(`c${i}`));
    expect(columnIsAtCapacity(backlog)).toBe(false);
  });

  it("is at capacity once the card count exceeds the limit", () => {
    const board = createBoard();
    const review = findColumn(board, "Review")!; // wipLimit 2
    review.cards.push(makeCard("a"), makeCard("b"), makeCard("c"));
    expect(columnIsAtCapacity(review)).toBe(true);
  });
});
