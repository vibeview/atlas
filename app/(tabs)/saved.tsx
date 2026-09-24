import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../../src/components/Screen';
import { Chip } from '../../src/components/Chip';
import { DestinationCard } from '../../src/components/DestinationCard';
import { EmptyState } from '../../src/components/EmptyState';
import { HeartIcon } from '../../src/components/icons';
import { destinationsById } from '../../src/data/destinations';
import { useHighlightedId, useOpenDestination } from '../../src/layout/useOpenDestination';
import { useAppState } from '../../src/state/AppState';
import { colors, font, spacing } from '../../src/theme/theme';

const COLLECTIONS = [
  { id: 'all', label: 'All places' },
  { id: 'summer-2027', label: 'Summer 2027' },
  { id: 'someday', label: 'Someday' },
];

/** Which saved places belong to each collection chip. */
const COLLECTION_MEMBERS: Record<string, string[]> = {
  'summer-2027': ['santorini', 'porto', 'lago-di-braies'],
  someday: ['kyoto', 'bali', 'zermatt'],
};

export default function SavedScreen() {
  const open = useOpenDestination();
  const highlighted = useHighlightedId();
  const { saved, isSaved, toggleSaved } = useAppState();
  const [collection, setCollection] = useState('all');

  const places = useMemo(() => {
    const ids =
      collection === 'all'
        ? saved
        : saved.filter((id) => COLLECTION_MEMBERS[collection]?.includes(id));
    return ids.map((id) => destinationsById[id]).filter(Boolean);
  }, [saved, collection]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text testID="saved-title" style={styles.title}>
            Saved
          </Text>
          <Text testID="saved-subtitle" style={styles.subtitle}>
            {saved.length} {saved.length === 1 ? 'place' : 'places'} · 2 collections
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {COLLECTIONS.map((c) => (
            <Chip
              key={c.id}
              testID={`collection-${c.id}`}
              label={c.label}
              active={collection === c.id}
              onPress={() => setCollection(c.id)}
            />
          ))}
        </ScrollView>

        {saved.length === 0 ? (
          <EmptyState
            testID="saved-empty"
            icon={<HeartIcon size={40} color={colors.muted} />}
            title="Nothing saved yet"
            body="Places you save on Explore show up here."
          />
        ) : places.length === 0 ? (
          <EmptyState
            testID="saved-collection-empty"
            icon={<HeartIcon size={40} color={colors.muted} />}
            title="Nothing in this collection"
            body="Saved places in this collection show up here."
          />
        ) : (
          <View testID="saved-grid" style={styles.grid}>
            {places.map((d) => (
              <DestinationCard
                key={d.id}
                variant="grid"
                destination={d}
                saved={isSaved(d.id)}
                selected={highlighted === d.id}
                onPress={() => open(d.id)}
                onToggleSaved={() => toggleSaved(d.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.screen, paddingBottom: 28 },
  header: { marginTop: 10 },
  title: {
    fontFamily: font.extrabold,
    fontSize: 24,
    color: colors.ink,
    letterSpacing: -0.72,
  },
  subtitle: {
    fontFamily: font.semibold,
    fontSize: 11,
    color: colors.secondary,
    marginTop: 3,
  },
  chips: { gap: 6, paddingVertical: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 2,
  },
});
