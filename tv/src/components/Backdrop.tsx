import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';

import { backdrops } from '../data/images';
import { colors } from '../theme';

// Explicit size, not absoluteFill: Android release builds otherwise draw
// bundled images at their density-scaled size, zoomed in from the corner.
const { width, height } = Dimensions.get('window');
export const FULL = { position: 'absolute' as const, left: 0, top: 0, width, height };

/**
 * Two stacked photos: the new one fades in over the old. Never accessible:
 * the tile already names the place, and the UI tree stays one id per element.
 */
export function Backdrop({ slug }: { slug: string }) {
  const [shown, setShown] = useState({ under: slug, over: slug });
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (slug === shown.over) return;
    setShown((s) => ({ under: s.over, over: slug }));
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants">
      <Image source={backdrops[shown.under]} style={FULL} resizeMode="cover" accessible={false} />
      <Animated.Image source={backdrops[shown.over]} style={[FULL, { opacity: fade }]} resizeMode="cover" accessible={false} />
      <LinearGradient
        colors={['rgba(11,16,22,0.92)', 'rgba(11,16,22,0.55)', 'rgba(11,16,22,0)']}
        locations={[0, 0.38, 0.7]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(11,16,22,0.55)', 'rgba(11,16,22,0)', 'rgba(11,16,22,0)', colors.ink]}
        locations={[0, 0.18, 0.5, 0.86]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
