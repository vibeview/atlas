import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TVFocusGuideView, View } from 'react-native';

import type { RootStackParamList } from '../navigation';
import { colors, font, px, safe, type } from '../theme';

type Item = { key: 'Home' | 'Search' | 'Saved'; id: string; label: string };
const ITEMS: Item[] = [
  { key: 'Home', id: 'nav-home', label: 'Home' },
  { key: 'Search', id: 'nav-search', label: 'Search' },
  { key: 'Saved', id: 'nav-saved', label: 'Saved' },
];

function NavItem({ item, current, onPress }: { item: Item; current: boolean; onPress(): void }) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      testID={item.id}
      accessibilityLabel={item.label}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.item, focused && styles.itemFocused]}
    >
      <Text style={[styles.label, current && styles.current, focused && styles.labelFocused]}>{item.label}</Text>
    </Pressable>
  );
}

/** The top bar: wordmark, then Home / Search / Saved. */
export function NavBar({ current }: { current: Item['key'] }) {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const go = (key: Item['key']) => {
    if (key === current) return;
    if (key === 'Home') nav.popToTop();
    else nav.navigate(key);
  };
  return (
    <View style={styles.bar}>
      <Text style={styles.brand}>Atlas</Text>
      <TVFocusGuideView autoFocus style={styles.items}>
        {ITEMS.map((item) => (
          <NavItem key={item.key} item={item} current={item.key === current} onPress={() => go(item.key)} />
        ))}
      </TVFocusGuideView>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: px(safe.x),
    paddingTop: px(safe.y),
  },
  brand: { color: colors.text, fontFamily: font.extrabold, fontSize: px(36), marginRight: px(48) },
  items: { flexDirection: 'row' },
  item: { paddingHorizontal: px(24), paddingVertical: px(10), borderRadius: px(999), marginRight: px(8) },
  itemFocused: { backgroundColor: colors.text },
  label: { color: colors.textSoft, fontFamily: font.semibold, fontSize: px(type.nav) },
  current: { color: colors.text },
  labelFocused: { color: colors.ink },
});
