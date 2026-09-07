/**
 * Render a label-filter `<select>` into `root`: a leading "All
 * labels" option (`value=""`) plus one option per entry in `labels`.
 * Thin and stateless, matching `render.ts`'s style — the caller holds
 * the selected-label state and re-invokes this after every change.
 */
export function renderLabelFilter(
  root: HTMLElement,
  labels: string[],
  selected: string,
  onChange: (label: string) => void,
): void {
  root.replaceChildren();

  const select = document.createElement("select");
  select.className = "label-filter";

  const all = document.createElement("option");
  all.value = "";
  all.textContent = "All labels";
  select.append(all);

  for (const label of labels) {
    const opt = document.createElement("option");
    opt.value = label;
    opt.textContent = label;
    select.append(opt);
  }

  select.value = selected;

  select.addEventListener("change", () => {
    onChange(select.value);
  });

  root.append(select);
}
