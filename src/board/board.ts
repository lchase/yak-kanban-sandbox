import { columnIsAtCapacity, columnOf, findColumn } from "./columns.js";
import type { Board, Card } from "./types.js";

/**
 * A fresh board with the four standard columns.
 *
 * NOTE (issue 05): the column names are magic strings, repeated here, in
 * {@link moveCard}, and in the UI. They want extracting into a shared
 * constants module.
 */
export function createBoard(): Board {
  return {
    columns: [
      { name: "Backlog", wipLimit: null, cards: [] },
      { name: "In Progress", wipLimit: 2, cards: [] },
      { name: "Review", wipLimit: 2, cards: [] },
      { name: "Done", wipLimit: null, cards: [] },
    ],
  };
}

let nextId = 1;

/** Make a card with a unique id. */
export function makeCard(title: string, labels: string[] = []): Card {
  return { id: `card-${nextId++}`, title, labels };
}

/**
 * Add `card` to the named column. Throws if the column is unknown or is
 * already at its WIP limit.
 */
export function addCard(board: Board, columnName: string, card: Card): void {
  const column = findColumn(board, columnName);
  if (!column) throw new Error(`no such column: ${columnName}`);
  if (columnIsAtCapacity(column)) {
    throw new Error(`column "${columnName}" is at its WIP limit`);
  }
  column.cards.push(card);
}

/**
 * Move the card with `cardId` to the column named `toColumnName`.
 * Throws if the card or the target column cannot be found.
 */
export function moveCard(
  board: Board,
  cardId: string,
  toColumnName: string,
): void {
  const from = columnOf(board, cardId);
  const to = findColumn(board, toColumnName);
  if (!from) throw new Error(`card not on the board: ${cardId}`);
  if (!to) throw new Error(`no such column: ${toColumnName}`);

  const card = from.cards.find((c) => c.id === cardId);
  if (!card) throw new Error(`card not on the board: ${cardId}`);

  if (columnIsAtCapacity(to)) {
    throw new Error(`column "${toColumnName}" is at its WIP limit`);
  }

  to.cards.push(card);
  from.cards = from.cards.filter((c) => c.id !== cardId);
}
