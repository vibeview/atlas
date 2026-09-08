/**
 * Atlas design tokens.
 *
 * Lagoon teal is the only action colour; amber is reserved for ratings and
 * saved hearts. The app is light-appearance only (see `userInterfaceStyle`
 * in app.config.ts), so there is no dark palette.
 */
export const colors = {
  ink: '#111827',
  inkSoft: '#374151',
  body: '#4B5563',
  secondary: '#6B7280',
  muted: '#8A919E',
  mist: '#F3F5F7',
  card: '#FFFFFF',
  border: '#E2E5EA',
  hairline: '#E9ECF0',
  lagoon: '#0E7C86',
  lagoonTint: '#E6F2F3',
  amber: '#F2A541',
  amberTint: '#FFF7E8',
  amberBorder: '#F6D9A8',
  danger: '#B42318',
  overlay: 'rgba(0,0,0,0.35)',
} as const;

export const font = {
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extrabold: 'Manrope_800ExtraBold',
} as const;

export const radius = {
  sm: 12,
  md: 14,
  lg: 16,
  pill: 999,
} as const;

export const spacing = {
  screen: 16,
} as const;
