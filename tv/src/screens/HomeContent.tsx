import React, { useCallback, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Backdrop } from '../components/Backdrop';
import { Row } from '../components/Row';
import { useFocusedSlug } from '../components/useFocusedSlug';
import { bySlug, rows } from '../data/model';
import { colors, font, px, safe, type } from '../theme';

export const FIRST = rows[0].slugs[0];

/** Name, country, tagline and tags of the focused place, over the backdrop. */
function TitleBlock() {
  const d = bySlug[useFocusedSlug(FIRST)];
  return (
    <View style={styles.title} pointerEvents="none">
      <Text style={styles.country}>{d.country.toUpperCase()}</Text>
      <Text style={styles.name} numberOfLines={1}>
        {d.name}
      </Text>
      <Text style={styles.tagline} numberOfLines={1}>
        {d.tagline}
      </Text>
      <Text style={styles.meta}>{d.tags.join('  ·  ')}</Text>
    </View>
  );
}

function HomeBackdrop() {
  return <Backdrop slug={useFocusedSlug(FIRST)} />;
}

type Props = { onOpen(slug: string): void; preferredSlug: string | null };

/**
 * Backdrop, title block and the four rows. When a row takes focus it scrolls
 * to the top of the rows area, so the row above is cut off whole instead of
 * leaving a strip of its tiles under the title block.
 */
export function HomeContent({ onOpen, preferredSlug }: Props) {
  const scroll = useRef<ScrollView>(null);
  const rowY = useRef<number[]>([]);
  const current = useRef(0);
  const focusRow = useCallback((i: number) => {
    if (i === current.current) return;
    current.current = i;
    scroll.current?.scrollTo({ y: rowY.current[i] ?? 0, animated: true });
  }, []);

  return (
    <View style={styles.screen}>
      <HomeBackdrop />
      <TitleBlock />
      <ScrollView
        ref={scroll}
        style={styles.rows}
        contentContainerStyle={styles.rowsContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        {rows.map((row, i) => (
          <Row
            key={row.id}
            row={row}
            onOpen={onOpen}
            onRowFocus={() => focusRow(i)}
            onLayout={(y) => (rowY.current[i] = y)}
            preferredSlug={preferredSlug && row.slugs.includes(preferredSlug) ? preferredSlug : undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  title: { position: 'absolute', left: px(safe.x), top: px(200), right: px(700) },
  country: { color: colors.textSoft, fontFamily: font.bold, fontSize: px(type.meta), letterSpacing: px(3) },
  name: { color: colors.text, fontFamily: font.extrabold, fontSize: px(type.heroName), lineHeight: px(type.heroName * 1.1), marginTop: px(6) },
  tagline: { color: colors.text, fontFamily: font.medium, fontSize: px(type.tagline), marginTop: px(4) },
  meta: { color: colors.textSoft, fontFamily: font.semibold, fontSize: px(type.meta), marginTop: px(20) },
  rows: { position: 'absolute', left: 0, right: 0, top: px(590), bottom: 0 },
  // Room below the last row so it too can scroll to the top of the area.
  rowsContent: { paddingBottom: px(520) },
});
