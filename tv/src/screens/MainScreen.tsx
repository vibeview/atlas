import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, StyleSheet, TVEventControl, View } from 'react-native';

import { getFocused } from '../components/backdropStore';
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
  // transition has settled (the pattern Marquee uses).
  const opened = useRef<{ tab: Tab; slug: string }>({ tab: 'Home', slug: FIRST });
  const [preferred, setPreferred] = useState<{ tab: Tab; slug: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const settle = useCallback(() => {
    setPreferred(null);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPreferred(opened.current), 450);
  }, []);
  useEffect(() => {
    settle(); // launch: the listener below may attach after the first focus event
    const unsubscribe = navigation.addListener('focus', settle);
    return () => {
      unsubscribe();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [navigation, settle]);

  const open = useCallback(
    (slug: string) => {
      opened.current = { tab, slug };
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
        opened.current = { tab: 'Home', slug: getFocused() || FIRST };
        setTab('Home');
        settle();
        return true;
      });
      return () => sub.remove();
    }, [tab, settle]),
  );

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
      <NavBar current={tab} onShow={setTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  hidden: { display: 'none' },
});
