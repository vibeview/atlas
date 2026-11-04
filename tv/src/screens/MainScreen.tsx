import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, StyleSheet, TVEventControl, View, useTVEventHandler } from 'react-native';

import { getFocused } from '../components/backdropStore';
import { isPress } from '../lib/remote';
import { returnTarget } from '../lib/saved';
import { useSaved } from '../state/SavedProvider';
import { NavBar, type Tab } from '../components/NavBar';
import type { ScreenProps } from '../navigation';
import { colors } from '../theme';
import { FIRST, HomeContent } from './HomeContent';
import { SavedContent } from './SavedContent';
import { SearchContent } from './SearchContent';

/**
 * Home, Search and Saved under one persistent nav bar. Focusing a nav item
 * shows its tab in place; all three stay mounted (hidden ones with display
 * none, which also takes their tiles out of focus) so a tab keeps its search
 * text, scroll and last focus. Back on Search or Saved returns to Home.
 */
export function MainScreen({ navigation }: ScreenProps<'Main'>) {
  const [tab, setTab] = useState<Tab>('Home');

  // The tile that takes focus: the first Featured tile on launch, the tile
  // that was opened on return from a destination. hasTVPreferredFocus only
  // acts when the prop changes, so it is cleared and set again once the
  // transition has settled.
  const { saved } = useSaved();
  const savedNow = useRef(saved);
  savedNow.current = saved;
  const opened = useRef<{ tab: Tab; slug: string; index: number }>({ tab: 'Home', slug: FIRST, index: 0 });
  const [preferred, setPreferred] = useState<{ tab: Tab; slug: string } | null>(null);
  // Saved emptied from the destination: the current nav item takes focus.
  const [navPreferred, setNavPreferred] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // While a return settles, the focus engine may park focus on a nav item
  // (the opened tile can be gone after an unsave). That focus must not switch
  // tabs.
  const settling = useRef(false);
  const settle = useCallback(() => {
    settling.current = true;
    setPreferred(null);
    setNavPreferred(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const o = opened.current;
      // An unsave on the destination removes the opened Saved tile: focus its
      // neighbour, or the nav bar when nothing is left.
      const slug = o.tab === 'Saved' ? returnTarget(savedNow.current, o.slug, o.index) : o.slug;
      if (slug) setPreferred({ tab: o.tab, slug });
      else setNavPreferred(true);
      settling.current = false;
    }, 450);
  }, []);
  // A remote press inside the window means the person has taken over: the
  // re-assert would pull focus back from where they just moved it (and the
  // guard would swallow their nav move), so the window ends at once.
  useTVEventHandler((evt) => {
    if (!settling.current || !isPress(evt?.eventType)) return;
    if (timer.current) clearTimeout(timer.current);
    settling.current = false;
  });
  useEffect(() => {
    settle(); // launch: the listener below may attach after the first focus event
    const unsubscribe = navigation.addListener('focus', settle);
    // Leaving for a destination: a pending re-assert must not fire behind it.
    const unblur = navigation.addListener('blur', () => timer.current && clearTimeout(timer.current));
    return () => {
      unsubscribe();
      unblur();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [navigation, settle]);

  const open = useCallback(
    (slug: string) => {
      opened.current = { tab, slug, index: tab === 'Saved' ? savedNow.current.indexOf(slug) : 0 };
      navigation.navigate('Destination', { slug });
    },
    [navigation, tab],
  );

  // Back on Search or Saved shows Home. On Home, Back leaves the app as usual:
  // tvOS only hands the Menu button to the app while it is enabled.
  useFocusEffect(
    useCallback(() => {
      if (tab === 'Home') {
        if (Platform.isTV && Platform.OS === 'ios') TVEventControl.disableTVMenuKey();
        return undefined;
      }
      if (Platform.isTV && Platform.OS === 'ios') TVEventControl.enableTVMenuKey();
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        // The focused element is about to be hidden: give focus to the Home
        // tile used last.
        opened.current = { tab: 'Home', slug: getFocused() || FIRST, index: 0 };
        setTab('Home');
        settle();
        return true;
      });
      return () => sub.remove();
    }, [tab, settle]),
  );

  const showTab = useCallback((t: Tab) => {
    if (!settling.current) setTab(t);
  }, []);

  const pref = (t: Tab) => (preferred && preferred.tab === t ? preferred.slug : null);
  const show = (t: Tab) => [StyleSheet.absoluteFill, tab === t ? null : styles.hidden];
  return (
    <View style={styles.screen}>
      <View style={show('Home')}>
        <HomeContent onOpen={open} preferredSlug={pref('Home')} />
      </View>
      <View style={show('Search')}>
        <SearchContent onOpen={open} preferredSlug={pref('Search')} />
      </View>
      <View style={show('Saved')}>
        <SavedContent onOpen={open} preferredSlug={pref('Saved')} />
      </View>
      <NavBar current={tab} onShow={showTab} preferCurrent={navPreferred} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  hidden: { display: 'none' },
});
