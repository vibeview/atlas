import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import type { ColorValue } from 'react-native';

type IconProps = {
  size?: number;
  /** Accepts a ColorValue so it can be driven straight from tab bar tint props. */
  color?: ColorValue;
  filled?: boolean;
};

export function CompassIcon({ size = 20, color = '#8A919E' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="m15.5 8.5-2 5-5 2 2-5z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

export function HeartIcon({ size = 20, color = '#8A919E', filled = false }: IconProps) {
  const d = 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={d}
        fill={filled ? color : 'none'}
        stroke={filled ? 'none' : color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function MapIcon({ size = 20, color = '#8A919E' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path d="M9 4v13.5M15 6.5V20" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

export function PersonIcon({ size = 20, color = '#8A919E' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path
        d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function StarIcon({ size = 12, color = '#F2A541' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"
        fill={color}
      />
    </Svg>
  );
}

export function SearchIcon({ size = 16, color = '#6B7280' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="m20 20-3.5-3.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 18, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="m14 6-6 6 6 6"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 14, color = '#9CA3AF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="m9 6 6 6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function ShareIcon({ size = 18, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3v12M8 7l4-4 4 4M5 13v6h14v-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
