import type { Board, Column } from "../board/index.js";
import type { Storage } from "./storage.js";

/** Single namespaced key the whole board is stored under. */
export const STORAGE_KEY = "kanban-board";

/** Serialize a board to a JSON string. */
export function serializeBoard(board: Board): string {
  return JSON.stringify(board);
}

function isCard(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const card = value as Record<string, unknown>;
  return (
    typeof card["id"] === "string" &&
    typeof card["title"] === "string" &&
    Array.isArray(card["labels"])
  );
}

function isColumn(value: unknown): value is Column {
  if (typeof value !== "object" || value === null) return false;
  const column = value as Record<string, unknown>;
  return (
    typeof column["name"] === "string" &&
    (column["wipLimit"] === null || typeof column["wipLimit"] === "number") &&
    Array.isArray(column["cards"]) &&
    column["cards"].every(isCard)
  );
}

function isBoard(value: unknown): value is Board {
  if (typeof value !== "object" || value === null) return false;
  const board = value as Record<string, unknown>;
  return Array.isArray(board["columns"]) && board["columns"].every(isColumn);
}

/**
 * Parse `raw` as a `Board`, validating its shape. Returns `null` on any
 * parse error or shape mismatch — never throws.
 */
export function deserializeBoard(raw: string): Board | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    return isBoard(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Persist `board` to `storage`. Never throws — errors are swallowed. */
export function saveBoard(storage: Storage, board: Board): void {
  try {
    storage.setItem(STORAGE_KEY, serializeBoard(board));
  } catch (err) {
    console.error("failed to save board", err);
  }
}

/**
 * Load a board from `storage`, or `null` if absent, corrupt, or the
 * wrong shape. Never throws.
 */
export function loadBoard(storage: Storage): Board | null {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    return deserializeBoard(raw);
  } catch (err) {
    console.error("failed to load board", err);
    return null;
  }
}
