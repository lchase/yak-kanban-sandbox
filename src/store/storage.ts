/**
 * Minimal storage contract, satisfied by the real `localStorage` and by
 * fake in-memory stubs in tests. Keeping this narrow means tests never
 * need to touch the real browser API.
 */
export interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
