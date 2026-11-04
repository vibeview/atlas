import { useIsFocused } from '@react-navigation/native';
import React, { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TVFocusGuideView, View } from 'react-native';

import { colors, font, px, safe, type } from '../theme';

export type Tab = 'Home' | 'Search' | 'Saved';
type Item = { key: Tab; id: string; label: string };
const ITEMS: Item[] = [
  { key: 'Home', id: 'nav-home', label: 'Home' },
  { key: 'Search', id: 'nav-search', label: 'Search' },
  { key: 'Saved', id: 'nav-saved', label: 'Saved' },
];

type ItemProps = { item: Item; current: boolean; onShow(): void };

const NavItem = forwardRef<View, ItemProps>(function NavItem({ item, current, onShow }, ref) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      ref={ref}
      testID={item.id}
      accessibilityLabel={item.label}
      accessibilityState={{ selected: current }}
      onPress={onShow}
      onFocus={() => {
        setFocused(true);
        onShow();
      }}
      onBlur={() => setFocused(false)}
      style={[styles.item, focused && styles.itemFocused, !focused && current && styles.itemCurrent]}
    >
      <Text style={[styles.label, current && styles.current, focused && styles.labelFocused]}>{item.label}</Text>
    </Pressable>
  );
});

/**
 * The top bar, on every tab. Like the tvOS and Google TV tab bars, focusing an
 * item shows its tab; Select is not needed. The whole bar is a focus guide
 * pointing at the current item, so pressing up from anywhere below lands on
 * it. No autoFocus: on launch, focus belongs to the first tile.
 */
export function NavBar({ current, onShow }: { current: Tab; onShow(tab: Tab): void }) {
  const [target, setTarget] = useState<View | null>(null);
  // Under the Destination screen the bar stays mounted; its guide must not
  // catch focus and send it to a screen that is not on show.
  const onScreen = useIsFocused();
  return (
    <TVFocusGuideView style={styles.bar} destinations={onScreen && target ? [target] : undefined}>
      <Text style={styles.brand}>Atlas</Text>
      {ITEMS.map((item) => (
        <NavItem
          key={item.key}
          ref={item.key === current ? setTarget : undefined}
          item={item}
          current={item.key === current}
          onShow={() => onShow(item.key)}
        />
      ))}
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: px(safe.x),
    paddingTop: px(safe.y),
  },
  brand: { color: colors.text, fontFamily: font.extrabold, fontSize: px(36), marginRight: px(48) },
  item: { paddingHorizontal: px(24), paddingVertical: px(10), borderRadius: px(999), marginRight: px(8) },
  itemFocused: { backgroundColor: colors.text },
  itemCurrent: { backgroundColor: 'rgba(255,255,255,0.14)' },
  label: { color: colors.textSoft, fontFamily: font.semibold, fontSize: px(type.nav) },
  current: { color: colors.text },
  labelFocused: { color: colors.ink },
});
