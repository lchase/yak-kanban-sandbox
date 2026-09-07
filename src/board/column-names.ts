export const BACKLOG = "Backlog";
export const IN_PROGRESS = "In Progress";
export const REVIEW = "Review";
export const DONE = "Done";

export type ColumnName =
  | typeof BACKLOG
  | typeof IN_PROGRESS
  | typeof REVIEW
  | typeof DONE;
