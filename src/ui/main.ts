import {
  addCard,
  collectLabels,
  createBoard,
  filterByLabel,
  makeCard,
  moveCard,
} from "../board/index.js";
import { renderLabelFilter } from "./label-filter.js";
import { renderBoard } from "./render.js";

const filterRoot = document.getElementById("label-filter");
const root = document.getElementById("board");
if (!filterRoot) throw new Error("missing #label-filter mount point");
if (!root) throw new Error("missing #board mount point");

const board = createBoard();
addCard(board, "Backlog", makeCard("Draft the RUNBOOK", ["docs"]));
addCard(board, "Backlog", makeCard("Wire the harness config", ["infra"]));
addCard(board, "In Progress", makeCard("Fix the Done duplication", ["bug"]));

// "" means "no filter, show everything" (UI-owned sentinel — matches the
// move-to select's own convention). `filterByLabel` itself has no such
// special case, so callers must skip it when `selectedLabel` is "".
let selectedLabel = "";

function paint(): void {
  const labels = collectLabels(board);

  renderLabelFilter(
    filterRoot as HTMLElement,
    labels,
    selectedLabel,
    (label) => {
      selectedLabel = label;
      paint();
    },
  );

  const view = selectedLabel ? filterByLabel(board, selectedLabel) : board;

  // NOTE: `moveCard` always operates on the original, unfiltered `board`,
  // never on `view` — a card moved while a filter is active must still
  // land in the real column on the real board, even if that column is
  // currently hidden by the filter.
  renderBoard(root as HTMLElement, view, (cardId, toColumn) => {
    try {
      moveCard(board, cardId, toColumn);
    } catch (err) {
      alert((err as Error).message);
    }
    paint();
  });
}

paint();
