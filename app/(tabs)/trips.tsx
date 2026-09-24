import { Image } from 'expo-image';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../../src/components/Screen';
import { EmptyState } from '../../src/components/EmptyState';
import { ChevronRightIcon, MapIcon } from '../../src/components/icons';
import { destinationsById } from '../../src/data/destinations';
import { useHighlightedId, useOpenDestination } from '../../src/layout/useOpenDestination';
import { useAppState } from '../../src/state/AppState';
import { colors, font, radius, spacing } from '../../src/theme/theme';

export default function TripsScreen() {
  const open = useOpenDestination();
  const highlighted = useHighlightedId();
  const { trips } = useAppState();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text testID="trips-title" style={styles.title}>
            Trips
          </Text>
          <Text style={styles.subtitle}>
            {trips.length} planned {trips.length === 1 ? 'trip' : 'trips'}
          </Text>
        </View>

        {trips.length === 0 ? (
          <EmptyState
            testID="trips-empty"
            icon={<MapIcon size={40} color={colors.muted} />}
            title="No trips planned"
            body="Plan a trip from any destination and it lands here."
          />
        ) : (
          <View testID="trips-list" style={styles.list}>
            {trips.map((trip) => {
              const destination = destinationsById[trip.destinationId];
              return (
                <Pressable
                  key={trip.id}
                  testID={`trip-${trip.destinationId}`}
                  accessibilityLabel={`${trip.title} · ${trip.dates}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: highlighted === trip.destinationId }}
                  onPress={() => open(trip.destinationId)}
                  style={[styles.row, highlighted === trip.destinationId && styles.rowSelected]}
                >
                  {destination ? (
                    <Image source={destination.photo} style={styles.thumb} contentFit="cover" />
                  ) : (
                    <View style={styles.thumb} />
                  )}
                  <View style={styles.text}>
                    <Text style={styles.name}>{trip.title}</Text>
                    <Text style={styles.meta}>{trip.dates}</Text>
                  </View>
                  <ChevronRightIcon />
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.screen, paddingBottom: 28 },
  header: { marginTop: 10, marginBottom: 14 },
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
  list: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
  rowSelected: { backgroundColor: colors.lagoonTint },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  text: { flex: 1 },
  name: {
    fontFamily: font.extrabold,
    fontSize: 13.5,
    color: colors.ink,
    letterSpacing: -0.13,
  },
  meta: {
    fontFamily: font.semibold,
    fontSize: 11.5,
    color: colors.secondary,
    marginTop: 2,
  },
});
