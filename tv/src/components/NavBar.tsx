import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TVFocusGuideView, View } from 'react-native';

import type { RootStackParamList } from '../navigation';
import { colors, font, px, safe, type } from '../theme';

type Item = { key: 'Home' | 'Search' | 'Saved'; id: string; label: string };
const ITEMS: Item[] = [
  { key: 'Home', id: 'nav-home', label: 'Home' },
  { key: 'Search', id: 'nav-search', label: 'Search' },
  { key: 'Saved', id: 'nav-saved', label: 'Saved' },
];

type ItemProps = { item: Item; current: boolean; preferred?: boolean; onPress(): void };

const NavItem = forwardRef<View, ItemProps>(function NavItem({ item, current, preferred, onPress }, ref) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      ref={ref}
      testID={item.id}
      accessibilityLabel={item.label}
      hasTVPreferredFocus={preferred}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.item, focused && styles.itemFocused]}
    >
      <Text style={[styles.label, current && styles.current, focused && styles.labelFocused]}>{item.label}</Text>
    </Pressable>
  );
});

/**
 * The top bar: wordmark, then Home / Search / Saved. The whole bar is a focus
 * guide pointing at the current item, so pressing up from anywhere below lands
 * here even when no nav item is straight above. No autoFocus: on launch,
 * focus belongs to the first tile.
 */
export function NavBar({ current, focusOnArrival }: { current: Item['key']; focusOnArrival?: boolean }) {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [target, setTarget] = useState<View | null>(null);
  // Screens under the top one stay mounted; their guides must not catch focus
  // and send it to a screen that is not on show.
  const onShow = useIsFocused();
  const go = (key: Item['key']) => {
    if (key === current) return;
    if (key === 'Home') nav.popToTop();
    else nav.navigate(key);
  };
  return (
    <TVFocusGuideView style={styles.bar} destinations={onShow && target ? [target] : undefined}>
      <Text style={styles.brand}>Atlas</Text>
      {ITEMS.map((item) => (
        <NavItem
          key={item.key}
          ref={item.key === current ? setTarget : undefined}
          item={item}
          current={item.key === current}
          preferred={focusOnArrival && item.key === current}
          onPress={() => go(item.key)}
        />
      ))}
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: px(safe.x),
    paddingTop: px(safe.y),
  },
  brand: { color: colors.text, fontFamily: font.extrabold, fontSize: px(36), marginRight: px(48) },
  item: { paddingHorizontal: px(24), paddingVertical: px(10), borderRadius: px(999), marginRight: px(8) },
  itemFocused: { backgroundColor: colors.text },
  label: { color: colors.textSoft, fontFamily: font.semibold, fontSize: px(type.nav) },
  current: { color: colors.text },
  labelFocused: { color: colors.ink },
});
