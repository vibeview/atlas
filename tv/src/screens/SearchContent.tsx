import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { SearchField } from '../components/SearchField';
import { TileGrid } from '../components/TileGrid';
import { destinations } from '../data/model';
import { searchDestinations } from '../lib/search';
import { colors, font, px, safe, type } from '../theme';

// The grid's ScrollView clips its content: give the focused tile's 10% lift
// room on every side.
const lift = { paddingHorizontal: px(40), paddingTop: px(24), paddingBottom: px(60) };

type Props = { onOpen(slug: string): void; preferredSlug: string | null };

/** The search field above a grid: every place until you type, then the matches. */
export function SearchContent({ onOpen, preferredSlug }: Props) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchDestinations(destinations, query), [query]);

  return (
    <View style={styles.screen}>
      <View style={styles.body}>
        <SearchField value={query} onChangeText={setQuery} />
        <ScrollView contentContainerStyle={lift} style={[styles.results, { marginHorizontal: -px(40) }]} showsVerticalScrollIndicator={false}>
          {query.trim() === '' ? (
            <>
              <Text style={styles.heading}>All places</Text>
              <TileGrid items={destinations} idPrefix="search-tile" onOpen={onOpen} preferredSlug={preferredSlug ?? undefined} />
            </>
          ) : results.length === 0 ? (
            <Text style={styles.hint}>No places match “{query.trim()}”.</Text>
          ) : (
            <TileGrid items={results} idPrefix="search-tile" onOpen={onOpen} preferredSlug={preferredSlug ?? undefined} />
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  // The nav bar sits over every tab; content starts below it.
  body: { flex: 1, paddingHorizontal: px(safe.x), paddingTop: px(160) },
  results: { marginTop: px(24) },
  heading: { color: colors.text, fontFamily: font.semibold, fontSize: px(type.rowTitle), marginBottom: px(20) },
  hint: { color: colors.textSoft, fontFamily: font.medium, fontSize: px(type.body) },
});
