import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

/**
 * True once a screen's transition has settled, false right after it gains or
 * regains focus. hasTVPreferredFocus only acts when the prop changes, so a
 * screen passes this to the element that should take focus on arrival.
 */
export function useArrivalFocus(delayMs = 450): boolean {
  const navigation = useNavigation();
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    const settle = () => {
      setArmed(false);
      if (t) clearTimeout(t);
      t = setTimeout(() => setArmed(true), delayMs);
    };
    settle();
    const unsubscribe = navigation.addListener('focus', settle);
    return () => {
      unsubscribe();
      if (t) clearTimeout(t);
    };
  }, [navigation, delayMs]);
  return armed;
}
