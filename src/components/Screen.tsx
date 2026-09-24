import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAdaptiveLayout, useTopTrailingBlock } from '../layout/AdaptiveLayout';
import { colors } from '../theme/theme';

/**
 * A tab screen's frame: pads for the top safe area, and never less than a
 * little breathing room. iPhone Duo's displays have no top inset (the status
 * bar sits in a corner block instead), and content flush with the top edge
 * would run into the display's rounded corners.
 */
export function Screen({ children }: { children: React.ReactNode }) {
  const top = useScreenTop();
  return <View style={[styles.screen, { paddingTop: top }]}>{children}</View>;
}

function useScreenTop(): number {
  const insets = useSafeAreaInsets();
  const layout = useAdaptiveLayout();
  // Below a horizontal fold the pane does not reach the display's corners.
  const minTop = layout.mode === 'split' && layout.axis === 'column' ? 0 : 16;
  return Math.max(insets.top, minTop);
}

/**
 * The top of a tab screen's content: grows, when a status-bar block sits in
 * the top trailing corner (iPhone Duo), so that what follows starts below
 * the block instead of running under it. Rows inside stay beside the block
 * on their own (they are narrower than the screen, or make room for it).
 */
export function ScreenHeader({ children }: { children: React.ReactNode }) {
  const block = useTopTrailingBlock();
  const top = useScreenTop();
  const depth = block.bottom > 0 ? Math.max(0, block.bottom - top) : 0;
  return <View style={depth > 0 ? { minHeight: depth + CORNER_GAP } : null}>{children}</View>;
}

/** Space between the corner block and the content below it. */
const CORNER_GAP = 8;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.mist },
});
