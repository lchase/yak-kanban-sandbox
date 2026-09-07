import {
  addCard,
  BACKLOG,
  createBoard,
  IN_PROGRESS,
  makeCard,
  moveCard,
} from "../board/index.js";
import { renderBoard } from "./render.js";

const root = document.getElementById("board");
if (!root) throw new Error("missing #board mount point");

const board = createBoard();
addCard(board, BACKLOG, makeCard("Draft the RUNBOOK", ["docs"]));
addCard(board, BACKLOG, makeCard("Wire the harness config", ["infra"]));
addCard(board, IN_PROGRESS, makeCard("Fix the Done duplication", ["bug"]));

function paint(): void {
  renderBoard(root as HTMLElement, board, (cardId, toColumn) => {
    try {
      moveCard(board, cardId, toColumn);
    } catch (err) {
      alert((err as Error).message);
    }
    paint();
  });
}

paint();
