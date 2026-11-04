import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { NavBar } from '../components/NavBar';
import { TileGrid } from '../components/TileGrid';
import { bySlug } from '../data/model';
import type { ScreenProps } from '../navigation';
import { useSaved } from '../state/SavedProvider';
import { colors, font, px, safe, type } from '../theme';

// The grid's ScrollView clips its content: give the focused tile's 10% lift
// room on every side.
const liftOuter = { marginHorizontal: -px(40), marginTop: -px(24) };
const lift = { paddingHorizontal: px(40), paddingTop: px(24), paddingBottom: px(60) };

export function SavedScreen({ navigation }: ScreenProps<'Saved'>) {
  const { saved } = useSaved();
  const items = saved.map((slug) => bySlug[slug]).filter(Boolean);
  return (
    <View style={styles.screen}>
      <NavBar current="Saved" />
      <View style={styles.body}>
        <Text style={styles.heading}>Saved places</Text>
        {items.length === 0 ? (
          <Text style={styles.empty}>Nothing saved yet. Press Save on a place to keep it here.</Text>
        ) : (
          <ScrollView style={liftOuter} contentContainerStyle={lift} showsVerticalScrollIndicator={false}>
            <TileGrid
              items={items}
              idPrefix="saved-tile"
              preferredSlug={items[0].slug}
              onOpen={(slug) => navigation.navigate('Destination', { slug })}
            />
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  body: { flex: 1, paddingHorizontal: px(safe.x), paddingTop: px(48) },
  heading: { color: colors.text, fontFamily: font.extrabold, fontSize: px(56), marginBottom: px(36) },
  empty: { color: colors.textSoft, fontFamily: font.medium, fontSize: px(type.body) },
});
