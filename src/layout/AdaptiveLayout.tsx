import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FoldObserver, type ReservedRegion } from '../../modules/atlas-fold';

export type Rect = { x: number; y: number; width: number; height: number };

/**
 * How the window is laid out right now.
 *
 * - `single`: one pane, the phone app (iPhone Duo's cover display, any
 *   ordinary iPhone, a narrow window).
 * - `split`: two panes. The list (the navigator) and the selected
 *   destination sit either side of the fold, never across it.
 */
export type AdaptiveLayout =
  | { mode: 'single' }
  | {
      mode: 'split';
      /** `row`: side by side (vertical fold). `column`: stacked (horizontal fold). */
      axis: 'row' | 'column';
      /** The list pane: leading (row) or bottom (column). */
      list: Rect;
      /** The gap between the panes: the fold and its margins, or a hairline. */
      gap: Rect;
      /** The destination pane: trailing (row) or top (column). */
      detail: Rect;
      /** True when the window has a fold, active or not (iPhone Duo inner display). */
      folded: boolean;
      /** True when the device is partly folded, not flat. */
      foldActive: boolean;
    };

/** A pane narrower than this cannot hold the phone layout comfortably. */
const MIN_PANE = 300;
/** Without a fold, a window this big is a tablet-class canvas. */
const SPLIT_MIN_WIDTH = 700;
const SPLIT_MIN_HEIGHT = 500;
/** Hairline between the panes when nothing physical separates them. */
const DIVIDER = StyleSheet.hairlineWidth;

function computeLayout(width: number, height: number, regions: ReservedRegion[]): AdaptiveLayout {
  const fold = regions.find(
    (r) =>
      r.kind === 'division' &&
      r.width > 0 &&
      r.height > 0 &&
      r.x < width &&
      r.y < height &&
      r.x + r.width > 0 &&
      r.y + r.height > 0,
  );

  if (fold) {
    const vertical = fold.height >= fold.width;
    if (vertical) {
      const leading = fold.x;
      const trailing = width - (fold.x + fold.width);
      if (leading >= MIN_PANE && trailing >= MIN_PANE) {
        return {
          mode: 'split',
          axis: 'row',
          list: { x: 0, y: 0, width: leading, height },
          gap: { x: fold.x, y: 0, width: fold.width, height },
          detail: { x: fold.x + fold.width, y: 0, width: trailing, height },
          folded: true,
          foldActive: fold.active,
        };
      }
    } else {
      const top = fold.y;
      const bottom = height - (fold.y + fold.height);
      if (top >= MIN_PANE && bottom >= MIN_PANE) {
        return {
          mode: 'split',
          axis: 'column',
          detail: { x: 0, y: 0, width, height: top },
          gap: { x: 0, y: fold.y, width, height: fold.height },
          list: { x: 0, y: fold.y + fold.height, width, height: bottom },
          folded: true,
          foldActive: fold.active,
        };
      }
    }
  }

  if (width >= SPLIT_MIN_WIDTH && height >= SPLIT_MIN_HEIGHT) {
    const listWidth = Math.round(Math.min(400, Math.max(320, width * 0.4)));
    return {
      mode: 'split',
      axis: 'row',
      list: { x: 0, y: 0, width: listWidth, height },
      gap: { x: listWidth, y: 0, width: DIVIDER, height },
      detail: { x: listWidth + DIVIDER, y: 0, width: width - listWidth - DIVIDER, height },
      folded: false,
      foldActive: false,
    };
  }

  return { mode: 'single' };
}

const AdaptiveLayoutContext = createContext<AdaptiveLayout>({ mode: 'single' });
/** Active occlusions (hardware or system chrome covering the window), window coordinates. */
const OcclusionContext = createContext<ReservedRegion[]>([]);
const NO_REGIONS: ReservedRegion[] = [];

function sameRegions(a: ReservedRegion[], b: ReservedRegion[]): boolean {
  return (
    a.length === b.length &&
    a.every(
      (r, i) =>
        r.kind === b[i].kind &&
        r.x === b[i].x &&
        r.y === b[i].y &&
        r.width === b[i].width &&
        r.height === b[i].height &&
        r.active === b[i].active,
    )
  );
}

/**
 * Watches the window size and the display's reserved regions, and decides
 * between the phone layout and the two-pane layout.
 */
export function AdaptiveLayoutProvider({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [regions, setRegions] = useState<ReservedRegion[]>([]);

  const onRegionsChange = useCallback((event: { nativeEvent: { regions: ReservedRegion[] } }) => {
    const next = event.nativeEvent.regions;
    setRegions((prev) => (sameRegions(prev, next) ? prev : next));
  }, []);

  const layout = useMemo(() => computeLayout(width, height, regions), [width, height, regions]);
  const occlusions = useMemo(() => {
    const active = regions.filter((r) => r.kind === 'occlusion' && r.active);
    return active.length ? active : NO_REGIONS;
  }, [regions]);

  // One line per layout change, so a device log shows how the app read the
  // display (size, fold, posture) without a debugger attached.
  useEffect(() => {
    const fold = regions.find((r) => r.kind === 'division');
    console.log(
      `[Atlas] layout ${layout.mode}${layout.mode === 'split' ? ` ${layout.axis}` : ''}` +
        ` window=${Math.round(width)}x${Math.round(height)}` +
        (fold
          ? ` fold=${Math.round(fold.x)},${Math.round(fold.y)} ${Math.round(fold.width)}x${Math.round(fold.height)}${fold.active ? ' active' : ''}`
          : ' fold=none') +
        ` insets=${insets.top},${insets.right},${insets.bottom},${insets.left}` +
        ` occlusions=${regions.filter((r) => r.kind === 'occlusion' && r.active).length}`,
    );
  }, [layout, regions, width, height, insets]);

  return (
    <AdaptiveLayoutContext.Provider value={layout}>
      <OcclusionContext.Provider value={occlusions}>
        {FoldObserver && (
          <FoldObserver
            pointerEvents="none"
            style={StyleSheet.absoluteFill}
            onRegionsChange={onRegionsChange}
          />
        )}
        {children}
      </OcclusionContext.Provider>
    </AdaptiveLayoutContext.Provider>
  );
}

export function useAdaptiveLayout(): AdaptiveLayout {
  return useContext(AdaptiveLayoutContext);
}

/** The status-bar block at the top trailing corner of the list pane. */
export type CornerBlock = {
  /** How far in from the pane's trailing edge it reaches, in points. */
  width: number;
  /** How far down from the pane's top it reaches, in points. */
  bottom: number;
};

const NO_CORNER: CornerBlock = { width: 0, bottom: 0 };

/**
 * iPhone Duo keeps the status bar in a block at the top trailing corner of
 * each display. Safe-area insets report that block as a full-height trailing
 * inset; the reserved region says it is only as tall as the status bar, so
 * only what sits beside it needs to make room.
 */
export function useTopTrailingBlock(): CornerBlock {
  const layout = useAdaptiveLayout();
  const occlusions = useContext(OcclusionContext);
  const { width, height } = useWindowDimensions();
  const pane = layout.mode === 'split' ? layout.list : { x: 0, y: 0, width, height };
  const right = pane.x + pane.width;
  let block = NO_CORNER;
  for (const o of occlusions) {
    const atTop = o.y <= pane.y + 8 && o.y + o.height > pane.y;
    const atTrailingEdge = o.x < right && o.x + o.width >= right - 1;
    // A block that also reaches the leading edge is a full-width status bar
    // (ordinary iPhones on iOS 27.2), already covered by the top safe area.
    const corner = o.x > pane.x;
    if (atTop && atTrailingEdge && corner) {
      block = {
        width: Math.max(block.width, right - o.x),
        bottom: Math.max(block.bottom, o.y + o.height - pane.y),
      };
    }
  }
  return block;
}

/** How far in from its trailing edge the list pane's top is covered, in points. */
export function useTopTrailingClearance(): number {
  return useTopTrailingBlock().width;
}

export function useIsSplit(): boolean {
  return useAdaptiveLayout().mode === 'split';
}
