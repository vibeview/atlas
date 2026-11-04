import { useEffect, useState } from 'react';

import { getFocused, subscribe } from './backdropStore';

export function useFocusedSlug(initial: string): string {
  const [slug, setSlug] = useState(getFocused() || initial);
  useEffect(() => subscribe(setSlug), []);
  return slug;
}
