import { LinearGradient } from 'expo-linear-gradient';
import React, { memo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Destination } from '../data/model';
import { tiles } from '../data/images';
import { colors, font, px, tile, type } from '../theme';

type Props = {
  destination: Destination;
  idPrefix: 'tile' | 'search-tile' | 'saved-tile';
  onPress(): void;
  onFocus?(): void;
  preferred?: boolean;
};

/** A photo tile with the place name on it. Focus: lift, white border, shadow. */
export const Tile = memo(function Tile({ destination, idPrefix, onPress, onFocus, preferred }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      testID={`${idPrefix}-${destination.slug}`}
      accessibilityLabel={destination.name}
      hasTVPreferredFocus={preferred}
      onPress={onPress}
      onFocus={() => {
        setFocused(true);
        onFocus?.();
      }}
      onBlur={() => setFocused(false)}
      style={[styles.tile, focused && styles.focused]}
    >
      <Image source={tiles[destination.slug]} style={styles.photo} resizeMode="cover" accessible={false} />
      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.72)']} locations={[0.45, 1]} style={StyleSheet.absoluteFill} />
      <Text style={styles.name} numberOfLines={1}>
        {destination.name}
      </Text>
      {focused && <View style={styles.ring} pointerEvents="none" />}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  tile: {
    width: px(tile.width),
    height: px(tile.height),
    borderRadius: px(tile.radius),
    overflow: 'hidden',
    backgroundColor: colors.inkRaised,
  },
  focused: {
    transform: [{ scale: tile.focusScale }],
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: px(28),
    shadowOffset: { width: 0, height: px(14) },
    elevation: 12,
    zIndex: 2,
  },
  // Explicit size: Android release builds otherwise draw bundled images at
  // their density-scaled size, zoomed in from the top-left corner.
  photo: { position: 'absolute', left: 0, top: 0, width: px(tile.width), height: px(tile.height) },
  name: {
    position: 'absolute',
    left: px(20),
    right: px(20),
    bottom: px(16),
    color: colors.text,
    fontFamily: font.bold,
    fontSize: px(type.tileLabel),
  },
  ring: {
    ...(StyleSheet.absoluteFill as object),
    borderRadius: px(tile.radius),
    borderWidth: px(tile.focusBorder),
    borderColor: colors.focusBorder,
  },
});
