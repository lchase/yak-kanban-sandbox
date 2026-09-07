import type { Board, Column } from "./types.js";

/** The column a card with `cardId` currently sits in, or `undefined`. */
export function columnOf(board: Board, cardId: string): Column | undefined {
  return board.columns.find((col) => col.cards.some((c) => c.id === cardId));
}

/** Look a column up by its display name. */
export function findColumn(board: Board, name: string): Column | undefined {
  return board.columns.find((col) => col.name === name);
}

/**
 * Is `column` full — i.e. would accepting one more card break its WIP limit?
 *
 * NOTE (issue 02): this is off by one. A column with `wipLimit: 3` holding
 * exactly 3 cards reports `false` here, so `addCard` lets a 4th in.
 */
export function columnIsAtCapacity(column: Column): boolean {
  if (column.wipLimit === null) return false;
  return column.cards.length > column.wipLimit;
}
