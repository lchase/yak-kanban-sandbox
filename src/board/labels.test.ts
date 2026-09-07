import { describe, expect, it } from "vitest";
import { addCard, createBoard, makeCard } from "./board.js";
import { collectLabels, filterByLabel } from "./labels.js";

describe("filterByLabel", () => {
  it("keeps only cards that carry the given label", () => {
    const board = createBoard();
    const bug = makeCard("fix bug", ["bug"]);
    const docs = makeCard("write docs", ["docs"]);
    addCard(board, "Backlog", bug);
    addCard(board, "Backlog", docs);

    const filtered = filterByLabel(board, "bug");

    expect(filtered.columns.find((c) => c.name === "Backlog")!.cards).toEqual(
      [bug],
    );
  });

  it("returns empty cards for a label absent from all cards", () => {
    const board = createBoard();
    addCard(board, "Backlog", makeCard("x", ["docs"]));

    const filtered = filterByLabel(board, "bug");

    for (const column of filtered.columns) {
      expect(column.cards).toEqual([]);
    }
  });

  it("returns empty cards for an unknown/garbage label", () => {
    const board = createBoard();
    addCard(board, "Backlog", makeCard("x", ["docs"]));

    const filtered = filterByLabel(board, "not-a-real-label-🦖");

    expect(
      filtered.columns.flatMap((c) => c.cards),
    ).toEqual([]);
  });

  it("keeps empty columns present when board has no labels at all", () => {
    const board = createBoard();

    const filtered = filterByLabel(board, "anything");

    expect(filtered.columns.map((c) => c.name)).toEqual(
      board.columns.map((c) => c.name),
    );
    for (const column of filtered.columns) {
      expect(column.cards).toEqual([]);
    }
  });

  it("does not mutate the original board, columns, or cards", () => {
    const board = createBoard();
    const bug = makeCard("fix bug", ["bug"]);
    addCard(board, "Backlog", bug);
    const originalColumns = board.columns;
    const originalBacklogCards = board.columns[0]!.cards;

    filterByLabel(board, "docs");

    expect(board.columns).toBe(originalColumns);
    expect(board.columns[0]!.cards).toBe(originalBacklogCards);
    expect(board.columns[0]!.cards).toEqual([bug]);
    expect(bug.labels).toEqual(["bug"]);
  });
});

describe("collectLabels", () => {
  it("returns a sorted, deduped list of every label used", () => {
    const board = createBoard();
    addCard(board, "Backlog", makeCard("a", ["bug", "docs"]));
    addCard(board, "In Progress", makeCard("b", ["docs", "infra"]));
    addCard(board, "Review", makeCard("c", ["bug"]));

    expect(collectLabels(board)).toEqual(["bug", "docs", "infra"]);
  });

  it("returns an empty array for a board with no labels", () => {
    const board = createBoard();
    addCard(board, "Backlog", makeCard("no labels"));

    expect(collectLabels(board)).toEqual([]);
  });

  it("dedups labels repeated across cards and columns", () => {
    const board = createBoard();
    addCard(board, "Backlog", makeCard("a", ["bug"]));
    addCard(board, "In Progress", makeCard("b", ["bug"]));

    expect(collectLabels(board)).toEqual(["bug"]);
  });

  it("does not mutate the input board", () => {
    const board = createBoard();
    addCard(board, "Backlog", makeCard("a", ["bug"]));
    const originalColumns = board.columns;

    collectLabels(board);

    expect(board.columns).toBe(originalColumns);
    expect(board.columns[0]!.cards[0]!.labels).toEqual(["bug"]);
  });
});
