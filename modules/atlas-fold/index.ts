import { requireNativeView } from 'expo';
import type { ComponentType } from 'react';
import { Platform, type ViewProps } from 'react-native';

/** A reserved region in window coordinates (points), margins included. */
export type ReservedRegion = {
  /** `division` is a fold; `occlusion` is hardware covering content (a camera). */
  kind: 'division' | 'occlusion';
  x: number;
  y: number;
  width: number;
  height: number;
  /** A fold is active when the device is partly folded, inactive when flat. */
  active: boolean;
};

export type FoldObserverProps = ViewProps & {
  onRegionsChange?: (event: { nativeEvent: { regions: ReservedRegion[] } }) => void;
};

function load(): ComponentType<FoldObserverProps> | null {
  if (Platform.OS !== 'ios') return null;
  try {
    return requireNativeView<FoldObserverProps>('AtlasFold');
  } catch {
    return null;
  }
}

/**
 * Renders nothing visible; reports the window's reserved regions. `null` on
 * platforms without the native view, where the app falls back to sizes alone.
 */
export const FoldObserver = load();
