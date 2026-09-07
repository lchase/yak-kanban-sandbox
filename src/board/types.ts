/** A single kanban card. */
export interface Card {
  id: string;
  title: string;
  /** Free-form labels used by the (not-yet-built) label filter — see issue 03. */
  labels: string[];
}

/** One board column. `wipLimit` of `null` means "no limit". */
export interface Column {
  name: string;
  wipLimit: number | null;
  cards: Card[];
}

/** The whole board: an ordered list of columns. */
export interface Board {
  columns: Column[];
}
