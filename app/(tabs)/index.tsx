import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../../src/components/Avatar';
import { Chip } from '../../src/components/Chip';
import { DestinationCard } from '../../src/components/DestinationCard';
import { DestinationRow } from '../../src/components/DestinationRow';
import { SearchIcon } from '../../src/components/icons';
import {
  categories,
  destinationsById,
  popularIds,
  weekendIds,
  type Category,
  type Destination,
} from '../../src/data/destinations';
import { useAppState } from '../../src/state/AppState';
import { colors, font, radius, spacing } from '../../src/theme/theme';

function formatToday(): string {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
}

function matches(d: Destination, query: string, category: 'all' | Category): boolean {
  if (category !== 'all' && d.category !== category) return false;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
}

export default function ExploreScreen() {
  const router = useRouter();
  const { isSaved, toggleSaved } = useAppState();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | Category>('all');

  const popular = useMemo(
    () => popularIds.map((id) => destinationsById[id]).filter((d) => matches(d, query, category)),
    [query, category],
  );
  const weekend = useMemo(
    () => weekendIds.map((id) => destinationsById[id]).filter((d) => matches(d, query, category)),
    [query, category],
  );

  const open = (id: string) => router.push(`/destination/${id}`);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        testID="explore-scroll"
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>{formatToday()}</Text>
            <Text testID="explore-title" style={styles.title}>
              Where to next?
            </Text>
          </View>
          <Avatar />
        </View>

        <View style={styles.search}>
          <SearchIcon />
          <TextInput
            testID="search-input"
            accessibilityLabel="Search destinations"
            placeholder="Search destinations"
            placeholderTextColor={colors.secondary}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {categories.map((c) => (
            <Chip
              key={c.id}
              testID={`chip-${c.id}`}
              label={c.label}
              active={category === c.id}
              onPress={() => setCategory(c.id)}
            />
          ))}
        </ScrollView>

        {popular.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Popular this week</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
            >
              {popular.map((d) => (
                <DestinationCard
                  key={d.id}
                  destination={d}
                  saved={isSaved(d.id)}
                  onPress={() => open(d.id)}
                  onToggleSaved={() => toggleSaved(d.id)}
                />
              ))}
            </ScrollView>
          </>
        )}

        {weekend.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Weekend escapes</Text>
            <View testID="weekend-list">
              {weekend.map((d) => (
                <DestinationRow key={d.id} destination={d} onPress={() => open(d.id)} />
              ))}
            </View>
          </>
        )}

        {popular.length === 0 && weekend.length === 0 && (
          <Text testID="explore-no-results" style={styles.noResults}>
            No destinations match “{query.trim()}”.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  content: { paddingHorizontal: spacing.screen, paddingBottom: 28 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  date: {
    fontFamily: font.semibold,
    fontSize: 11,
    color: colors.secondary,
  },
  title: {
    fontFamily: font.extrabold,
    fontSize: 24,
    color: colors.ink,
    letterSpacing: -0.72,
    marginTop: 2,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontFamily: font.semibold,
    fontSize: 13,
    color: colors.ink,
    padding: 0,
  },
  chips: { gap: 6, paddingVertical: 12 },
  sectionTitle: {
    fontFamily: font.extrabold,
    fontSize: 14,
    color: colors.ink,
    letterSpacing: -0.14,
    marginTop: 6,
    marginBottom: 8,
  },
  rail: { gap: 10, paddingRight: 4 },
  noResults: {
    fontFamily: font.semibold,
    fontSize: 13,
    color: colors.secondary,
    paddingVertical: 32,
    textAlign: 'center',
  },
});
