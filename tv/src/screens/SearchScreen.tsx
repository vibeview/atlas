import React, { useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { NavBar } from '../components/NavBar';
import { TileGrid } from '../components/TileGrid';
import { destinations } from '../data/model';
import { searchDestinations } from '../lib/search';
import type { ScreenProps } from '../navigation';
import { colors, font, px, safe, type } from '../theme';

/**
 * A real text field, so every typing path reaches it (VibeView types only into
 * real fields). On tvOS selecting the field opens Apple's full-screen keyboard;
 * the results show when it closes. On Android TV the keyboard docks and the
 * results stay visible above it.
 */
export function SearchScreen({ navigation }: ScreenProps<'Search'>) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const results = useMemo(() => searchDestinations(destinations, query), [query]);

  return (
    <View style={styles.screen}>
      <NavBar current="Search" />
      <View style={styles.body}>
        <TextInput
          testID="search-field"
          accessibilityLabel="Search places"
          value={query}
          onChangeText={setQuery}
          placeholder="Search places or countries"
          placeholderTextColor={colors.textMuted}
          autoCorrect={false}
          autoCapitalize="none"
          disableFullscreenUI
          hasTVPreferredFocus
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.field, focused && styles.fieldFocused, Platform.OS === 'android' && styles.fieldAndroid]}
        />
        <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
          {query.trim() === '' ? (
            <Text style={styles.hint}>Type a place or a country.</Text>
          ) : results.length === 0 ? (
            <Text style={styles.hint}>No places match “{query.trim()}”.</Text>
          ) : (
            <TileGrid items={results} idPrefix="search-tile" onOpen={(slug) => navigation.navigate('Destination', { slug })} />
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  body: { flex: 1, paddingHorizontal: px(safe.x), paddingTop: px(48) },
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
  results: { marginTop: px(48) },
  hint: { color: colors.textSoft, fontFamily: font.medium, fontSize: px(type.body) },
});
