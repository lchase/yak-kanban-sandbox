import { beforeEach, describe, expect, it } from "vitest";
import { makeCard } from "../board/index.js";
import { addCard, initBoard, moveCard } from "./boardStore.js";
import { loadBoard, STORAGE_KEY } from "./persistence.js";
import type { Storage } from "./storage.js";

class FakeStorage implements Storage {
  private data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.has(key) ? this.data.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }
}

describe("boardStore", () => {
  let storage: FakeStorage;

  beforeEach(() => {
    storage = new FakeStorage();
  });

  it("falls back to a fresh board with demo cards on empty storage, and persists it", () => {
    const board = initBoard(storage);

    expect(board.columns.find((c) => c.name === "Backlog")?.cards.length).toBe(2);
    expect(board.columns.find((c) => c.name === "In Progress")?.cards.length).toBe(1);

    const persisted = loadBoard(storage);
    expect(persisted).toEqual(board);
  });

  it("falls back to a fresh board on corrupt storage, and persists it", () => {
    storage.setItem(STORAGE_KEY, "not json");

    const board = initBoard(storage);

    expect(board.columns.length).toBeGreaterThan(0);
    expect(loadBoard(storage)).toEqual(board);
  });

  it("loads a previously-persisted board instead of seeding demo cards", () => {
    const first = initBoard(storage);
    addCard("Backlog", makeCard("Extra card"));

    const second = initBoard(storage);

    expect(second).toEqual(first);
  });

  it("persists after addCard", () => {
    initBoard(storage);
    addCard("Backlog", makeCard("New task", ["x"]));

    const persisted = loadBoard(storage);
    expect(
      persisted?.columns.find((c) => c.name === "Backlog")?.cards.some(
        (c) => c.title === "New task",
      ),
    ).toBe(true);
  });

  it("persists after moveCard", () => {
    const board = initBoard(storage);
    const cardId = board.columns.find((c) => c.name === "In Progress")!.cards[0]!
      .id;

    moveCard(cardId, "Review");

    const persisted = loadBoard(storage);
    expect(
      persisted?.columns.find((c) => c.name === "Review")?.cards.some(
        (c) => c.id === cardId,
      ),
    ).toBe(true);
  });
});
