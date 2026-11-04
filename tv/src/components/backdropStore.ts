/**
 * The focused destination, outside React state: tiles call setFocused() on
 * focus, and only the backdrop and the title block re-render. A focus move
 * never re-renders the 24 tiles (keeps focus settling fast on the Android
 * emulator).
 */
type Listener = (slug: string) => void;

let current = '';
const listeners = new Set<Listener>();

export function setFocused(slug: string): void {
  if (slug === current) return;
  current = slug;
  listeners.forEach((l) => l(slug));
}

export function getFocused(): string {
  return current;
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}
