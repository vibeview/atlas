import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Destination } from '../data/destinations';
import { colors, font, radius } from '../theme/theme';
import { HeartIcon, StarIcon } from './icons';

type Props = {
  destination: Destination;
  saved: boolean;
  onPress: () => void;
  onToggleSaved: () => void;
  /** Shown in the detail pane of the two-pane layout. */
  selected?: boolean;
  /** `rail` is the fixed-width horizontal card; `grid` is sized by its grid. */
  variant?: 'rail' | 'grid';
  /** Width of a `grid` card in points; its height follows the 3:4 shape. */
  width?: number;
};

export function DestinationCard({
  destination,
  saved,
  onPress,
  onToggleSaved,
  selected = false,
  variant = 'rail',
  width,
}: Props) {
  // Grid cards get explicit points: React Native 0.88 leaves a card with a
  // percentage width and an aspect ratio at zero height inside a wrapping row.
  const size =
    variant === 'grid' && width !== undefined ? { width, height: (width * 4) / 3 } : null;
  return (
    <Pressable
      testID={`destination-card-${destination.id}`}
      accessibilityLabel={`${destination.name}, ${destination.country}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.card, variant === 'rail' ? styles.rail : size]}
    >
      <Image source={destination.photo} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.65)']}
        locations={[0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.ratingPill}>
        <StarIcon size={10} />
        <Text style={styles.ratingText}>{destination.rating.toFixed(1)}</Text>
      </View>

      <Pressable
        testID={`card-save-${destination.id}`}
        accessibilityLabel={saved ? `Saved ${destination.name}` : `Save ${destination.name}`}
        accessibilityRole="button"
        hitSlop={8}
        onPress={onToggleSaved}
        style={styles.heartButton}
      >
        <HeartIcon size={14} color={saved ? colors.amber : colors.ink} filled={saved} />
      </Pressable>

      <View style={styles.caption}>
        <Text style={styles.name} numberOfLines={1}>
          {destination.name}
        </Text>
        <Text style={styles.country}>{destination.country}</Text>
      </View>

      {selected && <View pointerEvents="none" style={styles.selectedRing} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  rail: {
    width: 150,
    aspectRatio: 3 / 4,
  },
  selectedRing: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.lg,
    borderWidth: 2.5,
    borderColor: colors.lagoon,
  },
  ratingPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.overlay,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  ratingText: {
    color: '#FFFFFF',
    fontFamily: font.extrabold,
    fontSize: 10.5,
    fontVariant: ['tabular-nums'],
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  caption: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
  },
  name: {
    color: '#FFFFFF',
    fontFamily: font.extrabold,
    fontSize: 14,
    letterSpacing: -0.28,
  },
  country: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: font.semibold,
    fontSize: 10.5,
    marginTop: 1,
  },
});
