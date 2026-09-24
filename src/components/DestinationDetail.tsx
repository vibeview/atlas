import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  type LayoutChangeEvent,
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Destination } from '../data/destinations';
import { useAdaptiveLayout, useTopTrailingClearance } from '../layout/AdaptiveLayout';
import { useAppState } from '../state/AppState';
import { colors, font, radius, spacing } from '../theme/theme';
import { ChevronLeftIcon, HeartIcon, ShareIcon, StarIcon } from './icons';

type Props = {
  destination: Destination;
  /**
   * `screen`: the phone page, a full-bleed photo under the status bar with a
   * Back button. `pane`: the detail side of the two-pane layout, the photo
   * as a rounded card below the status bar and no Back button.
   */
  variant: 'screen' | 'pane';
  onBack?: () => void;
};

export function DestinationDetail({ destination, variant, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const { isSaved, toggleSaved, addTrip } = useAppState();
  const window = useWindowDimensions();
  const [measured, setMeasured] = useState(0);
  // Until the first layout pass, assume the view fills the window.
  const height = measured || window.height;
  const pane = variant === 'pane';
  // A status bar in the top trailing corner (iPhone Duo) would sit on Share.
  const cornerTaken = useTopTrailingClearance() > 0;
  // Above a horizontal fold the pane ends mid-display, where a full-width
  // bar would read as a stray toolbar; the booking row floats as a card.
  const layout = useAdaptiveLayout();
  const floatingCta = pane && layout.mode === 'split' && layout.axis === 'column';

  // Picking another place in the list fades the pane in, rather than
  // swapping it abruptly, and starts it from the top.
  const [fade] = useState(() => new Animated.Value(1));
  const scroll = useRef<ScrollViewInstance>(null);
  useEffect(() => {
    if (!pane) return;
    scroll.current?.scrollTo({ y: 0, animated: false });
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [destination.id, pane, fade]);

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

  const onLayout = (e: LayoutChangeEvent) => setMeasured(e.nativeEvent.layout.height);
  // The phone page gives the photo 46% of the screen; a pane is shorter than
  // the display, so its card takes a larger share of the pane, within limits.
  // Above a horizontal fold the pane is short, so the photo becomes a wide
  // banner that leaves the rating, tags and booking card in view.
  const heroHeight = floatingCta
    ? Math.round(Math.min(260, Math.max(140, height - insets.top - 240)))
    : pane
      ? Math.round(Math.min(440, Math.max(220, height * 0.5)))
      : Math.round(height * 0.46);

  const heroButtons = (
    <View
      style={[
        styles.heroButtons,
        pane ? styles.heroButtonsPane : { top: insets.top + 8 },
        cornerTaken && styles.heroButtonsLeading,
      ]}
    >
      {!pane && (
        <Pressable
          testID="back-button"
          accessibilityLabel="Back"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={styles.circleButton}
        >
          <ChevronLeftIcon />
        </Pressable>
      )}
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
  );

  return (
    <View style={styles.screen} onLayout={onLayout}>
      <Animated.View style={[styles.fill, { opacity: fade }]}>
        <ScrollView
          ref={scroll}
          testID={pane ? 'detail-pane-scroll' : 'destination-scroll'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: floatingCta ? 110 : 24 }}
        >
          <View
            style={[
              styles.hero,
              pane && [styles.heroPane, { marginTop: insets.top + 8 }],
              { height: heroHeight },
            ]}
          >
            <Image
              source={destination.photo}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={pane ? 180 : 0}
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.25)', 'transparent', 'transparent', 'rgba(0,0,0,0.7)']}
              locations={[0, 0.3, 0.55, 1]}
              style={StyleSheet.absoluteFill}
            />
            {heroButtons}
            <View style={[styles.heroCaption, pane && styles.heroCaptionPane]}>
              <Text style={styles.heroRegion}>
                {destination.country} · {destination.region}
              </Text>
              <Text
                testID="destination-name"
                style={[styles.heroName, pane && styles.heroNamePane]}
              >
                {destination.name}
              </Text>
            </View>
          </View>

          <View style={[styles.body, pane && styles.bodyPane]}>
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

            <Text style={[styles.blurb, pane && styles.blurbPane]}>{destination.blurb}</Text>

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

        {floatingCta ? (
          <View pointerEvents="box-none" style={styles.ctaDock}>
            <LinearGradient
              pointerEvents="none"
              colors={['rgba(243,245,247,0)', colors.mist]}
              locations={[0, 0.3]}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                styles.cta,
                pane && styles.ctaPane,
                floatingCta ? styles.ctaFloating : { paddingBottom: Math.max(insets.bottom, 12) },
              ]}
            >
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
                style={[
                  styles.ghostButton,
                  pane && styles.ctaButtonPane,
                  pane && { width: 42 },
                  saved && styles.ghostButtonSaved,
                ]}
              >
                <HeartIcon size={18} color={saved ? colors.amber : colors.ink} filled={saved} />
              </Pressable>

              <Pressable
                testID="plan-trip-button"
                accessibilityLabel="Plan trip"
                accessibilityRole="button"
                onPress={onPlanTrip}
                style={[styles.primaryButton, pane && styles.ctaButtonPane]}
              >
                <Text style={styles.primaryText}>Plan trip</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.cta,
              pane && styles.ctaPane,
              floatingCta ? styles.ctaFloating : { paddingBottom: Math.max(insets.bottom, 12) },
            ]}
          >
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
              style={[
                styles.ghostButton,
                pane && styles.ctaButtonPane,
                pane && { width: 42 },
                saved && styles.ghostButtonSaved,
              ]}
            >
              <HeartIcon size={18} color={saved ? colors.amber : colors.ink} filled={saved} />
            </Pressable>

            <Pressable
              testID="plan-trip-button"
              accessibilityLabel="Plan trip"
              accessibilityRole="button"
              onPress={onPlanTrip}
              style={[styles.primaryButton, pane && styles.ctaButtonPane]}
            >
              <Text style={styles.primaryText}>Plan trip</Text>
            </Pressable>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.mist },
  fill: { flex: 1 },
  hero: { backgroundColor: colors.border },
  heroPane: {
    marginHorizontal: spacing.screen,
    borderRadius: 22,
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
  heroButtons: {
    position: 'absolute',
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // No Back button in a pane, and iPhone Duo's status bar sits in the
  // top trailing corner, so Share moves to the leading corner.
  heroButtonsLeading: { justifyContent: 'flex-start', gap: 10 },
  heroButtonsPane: { top: 14, justifyContent: 'flex-start' },
  circleButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCaption: { position: 'absolute', left: 16, right: 16, bottom: 16 },
  heroCaptionPane: { left: 18, right: 18, bottom: 18 },
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
  heroNamePane: { fontSize: 38, letterSpacing: -1.52 },
  body: { paddingHorizontal: spacing.screen, paddingTop: 14 },
  bodyPane: { paddingHorizontal: spacing.screen + 4, paddingTop: 16 },
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
  blurbPane: { fontSize: 13.5, lineHeight: 21 },
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
  // Matches the tab bar across the fold: 6 + 42 + home indicator.
  ctaPane: { paddingHorizontal: spacing.screen + 4, paddingTop: 6 },
  ctaButtonPane: { height: 42 },
  ctaDock: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 36 },
  ctaFloating: {
    marginHorizontal: spacing.screen,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: radius.lg,
    borderTopWidth: 0,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    boxShadow: '0 4px 16px rgba(17, 24, 39, 0.08)',
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
