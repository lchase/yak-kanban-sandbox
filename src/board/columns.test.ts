import { describe, expect, it } from "vitest";
import { columnIsAtCapacity, columnOf, findColumn } from "./columns.js";
import { addCard, createBoard, makeCard, moveCard } from "./board.js";
import { BACKLOG, IN_PROGRESS, REVIEW } from "./column-names.js";

describe("findColumn / columnOf", () => {
  it("finds a column by name", () => {
    const board = createBoard();
    expect(findColumn(board, REVIEW)?.name).toBe(REVIEW);
    expect(findColumn(board, "Nope")).toBeUndefined();
  });

  it("reports which column holds a card", () => {
    const board = createBoard();
    const card = makeCard("write the runbook");
    addCard(board, BACKLOG, card);
    expect(columnOf(board, card.id)?.name).toBe(BACKLOG);
    moveCard(board, card.id, IN_PROGRESS);
    expect(columnOf(board, card.id)?.name).toBe(IN_PROGRESS);
  });
});

describe("columnIsAtCapacity", () => {
  it("is never at capacity when wipLimit is null", () => {
    const board = createBoard();
    const backlog = findColumn(board, BACKLOG)!;
    for (let i = 0; i < 10; i++) backlog.cards.push(makeCard(`c${i}`));
    expect(columnIsAtCapacity(backlog)).toBe(false);
  });

  it("is at capacity once the card count exceeds the limit", () => {
    const board = createBoard();
    const review = findColumn(board, REVIEW)!; // wipLimit 2
    review.cards.push(makeCard("a"), makeCard("b"), makeCard("c"));
    expect(columnIsAtCapacity(review)).toBe(true);
  });
});
