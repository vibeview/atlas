import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/theme';

/**
 * A tab screen's frame: pads for the top safe area, and never less than a
 * little breathing room. iPhone Duo's displays have no top inset (the status
 * bar sits in a corner block instead), and content flush with the top edge
 * would run into the display's rounded corners.
 */
export function Screen({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.mist },
});
