import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChevronLeftIcon, HeartIcon, ShareIcon, StarIcon } from '../../src/components/icons';
import { destinationsById } from '../../src/data/destinations';
import { useAppState } from '../../src/state/AppState';
import { colors, font, radius, spacing } from '../../src/theme/theme';

export default function DestinationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { isSaved, toggleSaved, addTrip } = useAppState();

  const destination = typeof id === 'string' ? destinationsById[id] : undefined;

  if (!destination) {
    return (
      <SafeAreaView style={styles.missing}>
        <Text style={styles.missingText}>That destination doesn’t exist.</Text>
      </SafeAreaView>
    );
  }

  const saved = isSaved(destination.id);

  const onShare = () => {
    Share.share({
      message: `${destination.name}, ${destination.country} — from $${destination.priceFrom} on Atlas`,
    }).catch(() => {});
  };

  const onPlanTrip = () => {
    addTrip(destination.id, destination.name);
    Alert.alert('Added to Trips', `${destination.name} is on your Trips list.`);
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <ScrollView
        testID="destination-scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={[styles.hero, { height: height * 0.46 }]}>
          <Image source={destination.photo} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.25)', 'transparent', 'transparent', 'rgba(0,0,0,0.7)']}
            locations={[0, 0.3, 0.55, 1]}
            style={StyleSheet.absoluteFill}
          />

          <View style={[styles.heroButtons, { top: insets.top + 8 }]}>
            <Pressable
              testID="back-button"
              accessibilityLabel="Back"
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => router.back()}
              style={styles.circleButton}
            >
              <ChevronLeftIcon />
            </Pressable>
            <Pressable
              testID="share-button"
              accessibilityLabel="Share"
              accessibilityRole="button"
              hitSlop={8}
              onPress={onShare}
              style={styles.circleButton}
            >
              <ShareIcon />
            </Pressable>
          </View>

          <View style={styles.heroCaption}>
            <Text style={styles.heroRegion}>
              {destination.country} · {destination.region}
            </Text>
            <Text testID="destination-name" style={styles.heroName}>
              {destination.name}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.meta}>
            <View style={styles.metaRating}>
              <StarIcon size={12} />
              <Text testID="destination-rating" style={styles.ratingValue}>
                {destination.rating.toFixed(1)}
              </Text>
              <Text style={styles.reviews}>
                {destination.reviews.toLocaleString('en-US')} reviews
              </Text>
            </View>
            <Text style={styles.metaItem}>{destination.bestTime}</Text>
            <Text style={styles.metaItem}>{destination.priceBand}</Text>
          </View>

          <View style={styles.tags}>
            {destination.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.blurb}>{destination.blurb}</Text>

          <Text style={styles.sectionTitle}>Top experiences</Text>
          <View style={styles.tiles}>
            {destination.experiences.map((exp) => (
              <View key={exp.title} testID={`experience-${exp.title}`} style={styles.tile}>
                <Image source={exp.photo} style={StyleSheet.absoluteFill} contentFit="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.65)']}
                  locations={[0.4, 1]}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.tileTitle}>{exp.title}</Text>
                <Text style={styles.tileMeta}>{exp.meta}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.price}>
          <Text style={styles.priceLabel}>from</Text>
          <View style={styles.priceLine}>
            <Text testID="destination-price" style={styles.priceValue}>
              ${destination.priceFrom}
            </Text>
            <Text style={styles.priceNights}>{destination.nights} nights</Text>
          </View>
        </View>

        <Pressable
          testID="save-button"
          accessibilityLabel={saved ? 'Saved' : 'Save'}
          accessibilityRole="button"
          accessibilityState={{ selected: saved }}
          onPress={() => toggleSaved(destination.id)}
          style={[styles.ghostButton, saved && styles.ghostButtonSaved]}
        >
          <HeartIcon size={18} color={saved ? colors.amber : colors.ink} filled={saved} />
        </Pressable>

        <Pressable
          testID="plan-trip-button"
          accessibilityLabel="Plan trip"
          accessibilityRole="button"
          onPress={onPlanTrip}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryText}>Plan trip</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.mist },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mist,
  },
  missingText: { fontFamily: font.semibold, fontSize: 14, color: colors.secondary },
  hero: { backgroundColor: colors.border },
  heroButtons: {
    position: 'absolute',
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCaption: { position: 'absolute', left: 16, right: 16, bottom: 16 },
  heroRegion: {
    color: 'rgba(255,255,255,0.9)',
    fontFamily: font.bold,
    fontSize: 11,
    letterSpacing: 0.22,
  },
  heroName: {
    color: '#FFFFFF',
    fontFamily: font.extrabold,
    fontSize: 34,
    letterSpacing: -1.36,
    marginTop: 2,
  },
  body: { paddingHorizontal: spacing.screen, paddingTop: 14 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  metaRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingValue: {
    fontFamily: font.extrabold,
    fontSize: 13,
    color: colors.ink,
    fontVariant: ['tabular-nums'],
  },
  reviews: {
    fontFamily: font.semibold,
    fontSize: 11,
    color: colors.secondary,
    fontVariant: ['tabular-nums'],
  },
  metaItem: { fontFamily: font.bold, fontSize: 11, color: colors.inkSoft },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 12 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.lagoonTint,
  },
  tagText: { fontFamily: font.bold, fontSize: 11, color: colors.lagoon },
  blurb: { fontFamily: font.medium, fontSize: 12.5, lineHeight: 19, color: colors.body },
  sectionTitle: {
    fontFamily: font.extrabold,
    fontSize: 14,
    color: colors.ink,
    letterSpacing: -0.14,
    marginTop: 16,
    marginBottom: 8,
  },
  tiles: { flexDirection: 'row', gap: 10 },
  tile: {
    flex: 1,
    aspectRatio: 1.15,
    borderRadius: radius.md,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: colors.border,
  },
  tileTitle: { color: '#FFFFFF', fontFamily: font.bold, fontSize: 12 },
  tileMeta: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: font.semibold,
    fontSize: 10.5,
    marginTop: 1,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.screen,
    paddingTop: 12,
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
  price: { flex: 1 },
  priceLabel: { fontFamily: font.semibold, fontSize: 10, color: colors.secondary },
  priceLine: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  priceValue: {
    fontFamily: font.extrabold,
    fontSize: 18,
    color: colors.ink,
    letterSpacing: -0.36,
    fontVariant: ['tabular-nums'],
  },
  priceNights: { fontFamily: font.semibold, fontSize: 10.5, color: colors.secondary },
  ghostButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostButtonSaved: {
    borderColor: colors.amberBorder,
    backgroundColor: colors.amberTint,
  },
  primaryButton: {
    height: 44,
    paddingHorizontal: 22,
    borderRadius: radius.md,
    backgroundColor: colors.lagoon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#FFFFFF', fontFamily: font.extrabold, fontSize: 13 },
});
