import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

import { SEED_SAVED, savedReducer } from '../lib/saved';

type Saved = { saved: string[]; isSaved(slug: string): boolean; toggle(slug: string): void };

const SavedContext = createContext<Saved | null>(null);

/** Saved places live in memory and reset to the seed on every launch. */
export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [saved, dispatch] = useReducer(savedReducer, [...SEED_SAVED]);
  const toggle = useCallback((slug: string) => dispatch({ type: 'toggle', slug }), []);
  const value = useMemo(() => ({ saved, isSaved: (slug: string) => saved.includes(slug), toggle }), [saved, toggle]);
  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved(): Saved {
  const v = useContext(SavedContext);
  if (!v) throw new Error('useSaved outside SavedProvider');
  return v;
}
