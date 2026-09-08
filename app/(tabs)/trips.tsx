import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../../src/components/EmptyState';
import { ChevronRightIcon, MapIcon } from '../../src/components/icons';
import { destinationsById } from '../../src/data/destinations';
import { useAppState } from '../../src/state/AppState';
import { colors, font, radius, spacing } from '../../src/theme/theme';

export default function TripsScreen() {
  const router = useRouter();
  const { trips } = useAppState();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
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
                  onPress={() => router.push(`/destination/${trip.destinationId}`)}
                  style={styles.row}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
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
