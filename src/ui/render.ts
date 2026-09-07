import type { Board } from "../board/index.js";

/**
 * Render `board` into `root` as a set of column lists. Thin and
 * stateless — the caller re-invokes it after every board mutation.
 *
 * `onMove` is wired to each card's "move to" `<select>`.
 */
export function renderBoard(
  root: HTMLElement,
  board: Board,
  onMove: (cardId: string, toColumn: string) => void,
): void {
  root.replaceChildren();

  for (const column of board.columns) {
    const section = document.createElement("section");
    section.className = "column";

    const heading = document.createElement("h2");
    const limit = column.wipLimit === null ? "∞" : String(column.wipLimit);
    heading.textContent = `${column.name} (${column.cards.length}/${limit})`;
    section.append(heading);

    for (const card of column.cards) {
      const row = document.createElement("div");
      row.className = "card";
      row.textContent = card.title;

      const select = document.createElement("select");
      const stay = document.createElement("option");
      stay.textContent = "move to…";
      stay.value = "";
      select.append(stay);
      for (const target of board.columns) {
        if (target.name === column.name) continue;
        const opt = document.createElement("option");
        opt.value = target.name;
        opt.textContent = target.name;
        select.append(opt);
      }
      select.addEventListener("change", () => {
        if (select.value) onMove(card.id, select.value);
      });

      row.append(select);
      section.append(row);
    }

    root.append(section);
  }
}
