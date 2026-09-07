import {
  addCard as boardAddCard,
  createBoard,
  makeCard,
  moveCard as boardMoveCard,
  type Board,
  type Card,
} from "../board/index.js";
import { loadBoard, saveBoard } from "./persistence.js";
import type { Storage } from "./storage.js";

let board: Board | null = null;
let storage: Storage | null = null;

function seedDemoBoard(): Board {
  const fresh = createBoard();
  boardAddCard(fresh, "Backlog", makeCard("Draft the RUNBOOK", ["docs"]));
  boardAddCard(fresh, "Backlog", makeCard("Wire the harness config", ["infra"]));
  boardAddCard(fresh, "In Progress", makeCard("Fix the Done duplication", ["bug"]));
  return fresh;
}

/**
 * Load a board from `storage`, falling back to a fresh board with demo
 * cards if storage is empty or corrupt. Persists the fallback
 * immediately so a subsequent load sees the same board.
 */
export function initBoard(store: Storage): Board {
  storage = store;
  const loaded = loadBoard(store);
  if (loaded) {
    board = loaded;
    return board;
  }
  board = seedDemoBoard();
  saveBoard(store, board);
  return board;
}

function requireState(): { board: Board; storage: Storage } {
  if (!board || !storage) {
    throw new Error("store not initialized — call initBoard() first");
  }
  return { board, storage };
}

/** Add a card, then persist the board. */
export function addCard(columnName: string, card: Card): void {
  const state = requireState();
  boardAddCard(state.board, columnName, card);
  saveBoard(state.storage, state.board);
}

/** Move a card, then persist the board. */
export function moveCard(cardId: string, toColumnName: string): void {
  const state = requireState();
  boardMoveCard(state.board, cardId, toColumnName);
  saveBoard(state.storage, state.board);
}
