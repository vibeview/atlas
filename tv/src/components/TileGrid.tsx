import React from 'react';
import { StyleSheet, View } from 'react-native';

import type { Destination } from '../data/model';
import { px, tile } from '../theme';
import { Tile } from './Tile';

type Props = {
  items: Destination[];
  idPrefix: 'search-tile' | 'saved-tile';
  onOpen(slug: string): void;
  preferredSlug?: string;
};

/** Tiles in rows of four; wraps. Used by Search and Saved. */
export function TileGrid({ items, idPrefix, onOpen, preferredSlug }: Props) {
  return (
    <View style={styles.grid}>
      {items.map((d) => (
        <View key={d.slug} style={styles.cell}>
          <Tile destination={d} idPrefix={idPrefix} onPress={() => onOpen(d.slug)} preferred={d.slug === preferredSlug} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { marginRight: px(tile.gap), marginBottom: px(tile.gap + 12) },
});
