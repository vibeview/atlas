import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAdaptiveLayout } from '../layout/AdaptiveLayout';
import { colors } from '../theme/theme';

/**
 * A tab screen's frame: pads for the top safe area, and never less than a
 * little breathing room. iPhone Duo's displays have no top inset (the status
 * bar sits in a corner block instead), and content flush with the top edge
 * would run into the display's rounded corners.
 */
export function Screen({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const layout = useAdaptiveLayout();
  // Below a horizontal fold the pane does not reach the display's corners.
  const minTop = layout.mode === 'split' && layout.axis === 'column' ? 0 : 16;
  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, minTop) }]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.mist },
});
