import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Destination } from '../data/destinations';
import { colors, font, radius } from '../theme/theme';
import { StarIcon } from './icons';

export function DestinationRow({
  destination,
  onPress,
}: {
  destination: Destination;
  onPress: () => void;
}) {
  return (
    <Pressable
      testID={`destination-row-${destination.id}`}
      accessibilityLabel={`${destination.name}, ${destination.country}`}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.row}
    >
      <Image source={destination.photo} style={styles.thumb} contentFit="cover" />
      <View style={styles.text}>
        <Text style={styles.name}>{destination.name}</Text>
        <Text style={styles.meta}>
          {destination.country} · from ${destination.priceFrom}
        </Text>
      </View>
      <View style={styles.rating}>
        <StarIcon size={10} />
        <Text style={styles.ratingText}>{destination.rating.toFixed(1)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  thumb: {
    width: 54,
    height: 54,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  text: { flex: 1 },
  name: {
    fontFamily: font.extrabold,
    fontSize: 13,
    color: colors.ink,
    letterSpacing: -0.13,
  },
  meta: {
    fontFamily: font.semibold,
    fontSize: 11,
    color: colors.secondary,
    marginTop: 2,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontFamily: font.extrabold,
    fontSize: 11,
    color: colors.ink,
    fontVariant: ['tabular-nums'],
  },
});
