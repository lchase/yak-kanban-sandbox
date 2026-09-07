import { describe, expect, it } from "vitest";
import { columnOf, findColumn } from "./columns.js";
import { addCard, createBoard, makeCard, moveCard } from "./board.js";

describe("createBoard", () => {
  it("has the four standard columns in order", () => {
    expect(createBoard().columns.map((c) => c.name)).toEqual([
      "Backlog",
      "In Progress",
      "Review",
      "Done",
    ]);
  });
});

describe("addCard", () => {
  it("adds a card to the named column", () => {
    const board = createBoard();
    const card = makeCard("ship it");
    addCard(board, "Backlog", card);
    expect(findColumn(board, "Backlog")!.cards).toContain(card);
  });

  it("throws for an unknown column", () => {
    const board = createBoard();
    expect(() => addCard(board, "Elsewhere", makeCard("x"))).toThrow(
      /no such column/,
    );
  });
});

describe("moveCard", () => {
  it("moves a card between two non-Done columns", () => {
    const board = createBoard();
    const card = makeCard("triage");
    addCard(board, "Backlog", card);

    moveCard(board, card.id, "In Progress");

    expect(findColumn(board, "In Progress")!.cards).toContain(card);
    expect(findColumn(board, "Backlog")!.cards).not.toContain(card);
    expect(columnOf(board, card.id)?.name).toBe("In Progress");
  });

  it("throws when the card is not on the board", () => {
    const board = createBoard();
    expect(() => moveCard(board, "ghost", "Done")).toThrow(/not on the board/);
  });

  it("throws when the target column is unknown", () => {
    const board = createBoard();
    const card = makeCard("x");
    addCard(board, "Backlog", card);
    expect(() => moveCard(board, card.id, "Archive")).toThrow(/no such column/);
  });
});
