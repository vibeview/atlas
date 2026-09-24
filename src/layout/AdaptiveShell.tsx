import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DestinationDetail } from '../components/DestinationDetail';
import { destinationsById } from '../data/destinations';
import { useAppState } from '../state/AppState';
import { colors } from '../theme/theme';
import { useAdaptiveLayout } from './AdaptiveLayout';

/**
 * Lays the app out as one pane or two.
 *
 * The navigator (tabs and the phone destination page) is always the first
 * child, whatever the layout, so opening, folding or rotating iPhone Duo
 * never remounts it: the tab, search text and scroll positions survive. In
 * the two-pane layout it becomes the list pane beside the fold, and the
 * selected destination fills the pane on the other side.
 *
 * Each pane has its own safe-area provider, so a pane only pads for the
 * edges of the display it actually touches.
 */
/**
 * A style a View accepts. Not `ViewStyle`: expo/types widens that for the web
 * (`position: 'fixed' | 'sticky'`), and React Native 0.88's View no longer
 * takes the widened type.
 */
type PaneStyle = ViewProps['style'];

export function AdaptiveShell({ children }: { children: React.ReactNode }) {
  const layout = useAdaptiveLayout();
  const split = layout.mode === 'split';
  useContinuity(split);

  let root: PaneStyle = styles.fill;
  let listPane: PaneStyle = styles.fill;
  let gap: PaneStyle = styles.hidden;
  let detailPane: PaneStyle = styles.hidden;

  if (layout.mode === 'split') {
    const row = layout.axis === 'row';
    // `column-reverse` puts the destination above a horizontal fold and the
    // list below it without reordering (and so remounting) the children.
    root = { flex: 1, flexDirection: row ? 'row' : 'column-reverse' };
    listPane = row ? { width: layout.list.width } : { height: layout.list.height };
    gap = row
      ? { width: layout.gap.width, backgroundColor: colors.mist, alignItems: 'center' }
      : { height: layout.gap.height, backgroundColor: colors.mist, justifyContent: 'center' };
    detailPane = styles.fill;
  }

  const row = layout.mode === 'split' && layout.axis === 'row';

  return (
    <View style={[styles.base, root]}>
      <View style={[styles.pane, listPane]}>
        <SafeAreaProvider>{children}</SafeAreaProvider>
      </View>
      <View style={gap} testID="pane-divider">
        {split && <View style={row ? styles.dividerV : styles.dividerH} />}
      </View>
      <View style={[styles.pane, detailPane]}>
        {split && (
          <SafeAreaProvider>
            <DetailPane />
          </SafeAreaProvider>
        )}
      </View>
    </View>
  );
}

function DetailPane() {
  const { selectedId } = useAppState();
  const destination = destinationsById[selectedId];
  if (!destination) return null;
  return (
    <>
      {/* The status bar sits over this pane's photo (iPhone Duo keeps it in
          the top trailing corner), so it is light while there are two panes. */}
      <StatusBar style="light" />
      <DestinationDetail destination={destination} variant="pane" />
    </>
  );
}

/**
 * Keeps what the traveller was looking at when the layout changes. Growing
 * into two panes is handled by the destination page itself (it hands its
 * destination to the pane). Shrinking back to one pane, the destination they
 * picked in the pane reopens as the phone page, so closing iPhone Duo keeps
 * it on screen rather than dropping back to the list.
 */
function useContinuity(split: boolean) {
  const router = useRouter();
  const { selectedId, selectionSeq } = useAppState();
  const wasSplit = useRef(split);
  const lastSeq = useRef(selectionSeq);
  const pickedWhileSplit = useRef(false);

  useEffect(() => {
    if (selectionSeq === lastSeq.current) return;
    lastSeq.current = selectionSeq;
    if (split) pickedWhileSplit.current = true;
  }, [selectionSeq, split]);

  useEffect(() => {
    const before = wasSplit.current;
    wasSplit.current = split;
    if (split && !before) pickedWhileSplit.current = false;
    if (!split && before && pickedWhileSplit.current) {
      pickedWhileSplit.current = false;
      router.push(`/destination/${selectedId}`);
    }
    // Only a layout change should reopen the page, not a new selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [split]);
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.mist },
  fill: { flex: 1 },
  pane: { overflow: 'hidden' },
  hidden: { display: 'none' },
  dividerV: { flex: 1, width: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  dividerH: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});
