/** Three places, one from each of three rows, so Saved is never empty in a capture. */
export const SEED_SAVED: readonly string[] = ['santorini', 'hoi-an', 'lofoten'];

export type SavedAction = { type: 'toggle'; slug: string } | { type: 'reset' };

export function savedReducer(state: readonly string[], action: SavedAction): string[] {
  if (action.type === 'reset') return [...SEED_SAVED];
  return state.includes(action.slug) ? state.filter((s) => s !== action.slug) : [...state, action.slug];
}
