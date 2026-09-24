import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type Trip = {
  id: string;
  destinationId: string;
  title: string;
  dates: string;
};

/**
 * Seeded so the demo looks the same on every launch. State is in memory only —
 * there is no persistence, so a fresh session always starts from here.
 */
const SEEDED_SAVED = ['santorini', 'kyoto', 'lago-di-braies', 'bali', 'porto', 'zermatt'];

const SEEDED_TRIPS: Trip[] = [
  { id: 'trip-santorini', destinationId: 'santorini', title: 'Santorini', dates: '12–17 Jun 2027' },
  { id: 'trip-kyoto', destinationId: 'kyoto', title: 'Kyoto', dates: 'Someday' },
];

/** What the detail pane shows before anything is picked. */
const DEFAULT_SELECTED = 'kyoto';

type AppStateValue = {
  saved: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  trips: Trip[];
  addTrip: (destinationId: string, title: string) => void;
  /**
   * The destination shown in the detail pane of the two-pane layout. Kyoto
   * until the traveller picks another, and kept across folds and rotations.
   */
  selectedId: string;
  /** Counts picks (even of the same place), so layouts can tell one happened. */
  selectionSeq: number;
  select: (id: string) => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<string[]>(SEEDED_SAVED);
  const [trips, setTrips] = useState<Trip[]>(SEEDED_TRIPS);
  const [selectedId, setSelectedId] = useState(DEFAULT_SELECTED);
  const [selectionSeq, setSelectionSeq] = useState(0);

  const isSaved = useCallback((id: string) => saved.includes(id), [saved]);

  const toggleSaved = useCallback((id: string) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const addTrip = useCallback((destinationId: string, title: string) => {
    setTrips((prev) =>
      prev.some((t) => t.destinationId === destinationId)
        ? prev
        : [...prev, { id: `trip-${destinationId}`, destinationId, title, dates: 'Someday' }],
    );
  }, []);

  const select = useCallback((id: string) => {
    setSelectedId(id);
    setSelectionSeq((n) => n + 1);
  }, []);

  const value = useMemo(
    () => ({ saved, isSaved, toggleSaved, trips, addTrip, selectedId, selectionSeq, select }),
    [saved, isSaved, toggleSaved, trips, addTrip, selectedId, selectionSeq, select],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
