/** Three places, one from each of three rows, so Saved is never empty in a capture. */
export const SEED_SAVED: readonly string[] = ['santorini', 'hoi-an', 'lofoten'];

export type SavedAction = { type: 'toggle'; slug: string } | { type: 'reset' };

export function savedReducer(state: readonly string[], action: SavedAction): string[] {
  if (action.type === 'reset') return [...SEED_SAVED];
  return state.includes(action.slug) ? state.filter((s) => s !== action.slug) : [...state, action.slug];
}

/**
 * The Saved tile to focus on return from a destination opened at `index`.
 * The place itself if still saved; after an unsave, the tile that moved into
 * its slot (or the new last one); null when Saved is now empty.
 */
export function returnTarget(saved: readonly string[], slug: string, index: number): string | null {
  if (saved.includes(slug)) return slug;
  if (saved.length === 0) return null;
  return saved[Math.min(index, saved.length - 1)];
}
