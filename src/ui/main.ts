import { initBoard, moveCard } from "../store/index.js";
import { renderBoard } from "./render.js";

const root = document.getElementById("board");
if (!root) throw new Error("missing #board mount point");

const board = initBoard(localStorage);

function paint(): void {
  renderBoard(root as HTMLElement, board, (cardId, toColumn) => {
    try {
      moveCard(cardId, toColumn);
    } catch (err) {
      alert((err as Error).message);
    }
    paint();
  });
}

paint();
