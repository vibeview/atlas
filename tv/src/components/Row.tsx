import React from 'react';
import { ScrollView, StyleSheet, Text, TVFocusGuideView, View } from 'react-native';

import { bySlug, type Row as RowData } from '../data/model';
import { colors, font, px, safe, tile, type } from '../theme';
import { setFocused } from './backdropStore';
import { Tile } from './Tile';

type Props = {
  row: RowData;
  onOpen(slug: string): void;
  /** The tile that should take focus: the first Popular tile, or the one just closed. */
  preferredSlug?: string;
};

/**
 * One row of six tiles. A plain ScrollView + map, never a virtualised list,
 * so every tile is in the UI tree for focus walks and replay. The focus guide
 * returns focus to the last tile used when you come back to the row.
 */
export function Row({ row, onOpen, preferredSlug }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{row.title}</Text>
      <TVFocusGuideView autoFocus>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.track}>
          {row.slugs.map((slug) => (
            <View key={slug} style={styles.slot}>
              <Tile
                destination={bySlug[slug]}
                idPrefix="tile"
                preferred={slug === preferredSlug}
                onFocus={() => setFocused(slug)}
                onPress={() => onOpen(slug)}
              />
            </View>
          ))}
        </ScrollView>
      </TVFocusGuideView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: px(28) },
  title: {
    color: colors.text,
    fontFamily: font.semibold,
    fontSize: px(type.rowTitle),
    marginLeft: px(safe.x),
    marginBottom: px(6),
  },
  // Vertical padding leaves room for the focused tile's lift and shadow.
  track: { paddingHorizontal: px(safe.x), paddingVertical: px(22) },
  slot: { marginRight: px(tile.gap) },
});
