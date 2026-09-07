import { addCard, createBoard, makeCard, moveCard } from "../board/index.js";
import { renderBoard } from "./render.js";

const root = document.getElementById("board");
if (!root) throw new Error("missing #board mount point");

const board = createBoard();
addCard(board, "Backlog", makeCard("Draft the RUNBOOK", ["docs"]));
addCard(board, "Backlog", makeCard("Wire the harness config", ["infra"]));
addCard(board, "In Progress", makeCard("Fix the Done duplication", ["bug"]));

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
