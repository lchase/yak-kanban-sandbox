import { describe, expect, it } from "vitest";
import { columnOf, findColumn } from "./columns.js";
import { addCard, createBoard, makeCard, moveCard } from "./board.js";
import { BACKLOG, DONE, IN_PROGRESS, REVIEW } from "./column-names.js";

describe("createBoard", () => {
  it("has the four standard columns in order", () => {
    expect(createBoard().columns.map((c) => c.name)).toEqual([
      BACKLOG,
      IN_PROGRESS,
      REVIEW,
      DONE,
    ]);
  });
});

describe("addCard", () => {
  it("adds a card to the named column", () => {
    const board = createBoard();
    const card = makeCard("ship it");
    addCard(board, BACKLOG, card);
    expect(findColumn(board, BACKLOG)!.cards).toContain(card);
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
    addCard(board, BACKLOG, card);

    moveCard(board, card.id, IN_PROGRESS);

    expect(findColumn(board, IN_PROGRESS)!.cards).toContain(card);
    expect(findColumn(board, BACKLOG)!.cards).not.toContain(card);
    expect(columnOf(board, card.id)?.name).toBe(IN_PROGRESS);
  });

  it("throws when the card is not on the board", () => {
    const board = createBoard();
    expect(() => moveCard(board, "ghost", DONE)).toThrow(/not on the board/);
  });

  it("throws when the target column is unknown", () => {
    const board = createBoard();
    const card = makeCard("x");
    addCard(board, BACKLOG, card);
    expect(() => moveCard(board, card.id, "Archive")).toThrow(/no such column/);
  });
});
