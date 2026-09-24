import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useAppState } from '../state/AppState';
import { useIsSplit } from './AdaptiveLayout';

/**
 * Opens a destination: in the two-pane layout it fills the detail pane, on a
 * phone-sized window it pushes the destination page.
 */
export function useOpenDestination(): (id: string) => void {
  const router = useRouter();
  const split = useIsSplit();
  const { select } = useAppState();
  return useCallback(
    (id: string) => {
      select(id);
      if (!split) router.push(`/destination/${id}`);
    },
    [router, split, select],
  );
}

/** The destination highlighted in lists: the detail pane's, in two panes only. */
export function useHighlightedId(): string | null {
  const split = useIsSplit();
  const { selectedId } = useAppState();
  return split ? selectedId : null;
}
