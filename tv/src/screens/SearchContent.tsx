import React, { useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { TileGrid } from '../components/TileGrid';
import { destinations } from '../data/model';
import { searchDestinations } from '../lib/search';
import { colors, font, px, safe, type } from '../theme';

// The grid's ScrollView clips its content: give the focused tile's 10% lift
// room on every side.

const lift = { paddingHorizontal: px(40), paddingTop: px(24), paddingBottom: px(60) };

/**
 * A real text field, so every typing path reaches it (VibeView types only into
 * real fields). On tvOS selecting the field opens Apple's full-screen keyboard;
 * the results show when it closes. On Android TV the keyboard docks and the
 * results stay visible above it.
 */
type Props = { onOpen(slug: string): void; preferredSlug: string | null };

export function SearchContent({ onOpen, preferredSlug }: Props) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const results = useMemo(() => searchDestinations(destinations, query), [query]);

  return (
    <View style={styles.screen}>
      <View style={styles.body}>
        <TextInput
          testID="search-field"
          accessibilityLabel="Search places"
          value={query}
          onChangeText={setQuery}
          // tvOS: Menu cancels the edit and the field goes back to its old text
          // without a change event; take the field's final text so the
          // results always match what the field shows.
          onEndEditing={(e) => setQuery(e.nativeEvent.text)}
          placeholder="Search places or countries"
          placeholderTextColor={colors.textMuted}
          autoCorrect={false}
          autoCapitalize="none"
          disableFullscreenUI
          // Android TV: the keyboard opens on Select, not on focus, so the
          // D-pad can move past the field to the results.
          showSoftInputOnFocus={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.field, focused && styles.fieldFocused, Platform.OS === 'android' && styles.fieldAndroid]}
        />
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
  field: {
    width: px(900),
    color: colors.text,
    fontFamily: font.semibold,
    fontSize: px(36),
    paddingHorizontal: px(28),
    paddingVertical: px(18),
    borderRadius: px(14),
    backgroundColor: colors.inkRaised,
    borderWidth: px(4),
    borderColor: colors.inkLine,
  },
  fieldFocused: { borderColor: colors.focusBorder },
  fieldAndroid: { paddingVertical: px(12) },
  results: { marginTop: px(24) },
  heading: { color: colors.text, fontFamily: font.semibold, fontSize: px(type.rowTitle), marginBottom: px(20) },
  hint: { color: colors.textSoft, fontFamily: font.medium, fontSize: px(type.body) },
});
