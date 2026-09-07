import { describe, expect, it } from "vitest";
import { createBoard, addCard, makeCard } from "../board/index.js";
import { loadBoard, saveBoard, STORAGE_KEY } from "./persistence.js";
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

describe("persistence", () => {
  it("round-trips a board through save/load", () => {
    const storage = new FakeStorage();
    const board = createBoard();
    addCard(board, "Backlog", makeCard("Write tests", ["docs"]));

    saveBoard(storage, board);

    expect(loadBoard(storage)).toEqual(board);
  });

  it("returns null when the key is missing", () => {
    const storage = new FakeStorage();

    expect(loadBoard(storage)).toBeNull();
  });

  it("returns null on corrupt JSON, never throws", () => {
    const storage = new FakeStorage();
    storage.setItem(STORAGE_KEY, "{not valid json");

    expect(() => loadBoard(storage)).not.toThrow();
    expect(loadBoard(storage)).toBeNull();
  });

  it("returns null when the JSON is valid but the wrong shape", () => {
    const storage = new FakeStorage();
    storage.setItem(STORAGE_KEY, JSON.stringify({ hello: "world" }));

    expect(loadBoard(storage)).toBeNull();
  });

  it("returns null when columns hold cards of the wrong shape", () => {
    const storage = new FakeStorage();
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        columns: [{ name: "Backlog", wipLimit: null, cards: [{ oops: true }] }],
      }),
    );

    expect(loadBoard(storage)).toBeNull();
  });
});
