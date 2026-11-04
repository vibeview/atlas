import { Dimensions } from 'react-native';

/**
 * Atlas TV design tokens: the phone app's palette on a dark TV background.
 * Lagoon teal fills buttons only (too low-contrast as text on ink); amber is
 * for ratings and Saved. Sizes are in 1080p points and set the minimums the
 * site's thumbnails need (spec "Look").
 */
export const colors = {
  ink: '#0B1016',
  inkRaised: '#151C25',
  inkLine: '#243041',
  text: '#F4F6F8',
  textSoft: '#B8C0CC',
  textMuted: '#8792A2',
  lagoon: '#0E7C86',
  lagoonBright: '#139AA6',
  amber: '#F2A541',
  focusBorder: '#FFFFFF',
} as const;

export const font = {
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extrabold: 'Manrope_800ExtraBold',
} as const;

/** 5% title-safe margins on a 1920×1080 screen. */
export const safe = { x: 96, y: 54 } as const;

export const space = { xs: 8, sm: 16, md: 24, lg: 40, xl: 64 } as const;

export const type = {
  heroName: 96,
  tagline: 40,
  meta: 28,
  tileLabel: 26,
  rowTitle: 30,
  body: 28,
  nav: 28,
} as const;

export const tile = {
  width: 400,
  height: 225,
  radius: 14,
  gap: 32,
  focusScale: 1.1,
  focusBorder: 8,
} as const;

/**
 * Design units are 1920×1080. Apple TV lays out at 1920 points wide, Android
 * TV usually at 960 dp, so every size goes through px().
 */
const SCALE = Dimensions.get('window').width / 1920;
export const px = (n: number): number => Math.round(n * SCALE);
