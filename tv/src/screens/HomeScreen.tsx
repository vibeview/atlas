import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Backdrop } from '../components/Backdrop';
import { NavBar } from '../components/NavBar';
import { Row } from '../components/Row';
import { useFocusedSlug } from '../components/useFocusedSlug';
import { bySlug, rows } from '../data/model';
import type { ScreenProps } from '../navigation';
import { colors, font, px, safe, type } from '../theme';

const FIRST = rows[0].slugs[0];

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
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{d.tags.join('  ·  ')}</Text>
      </View>
    </View>
  );
}

function HomeBackdrop() {
  return <Backdrop slug={useFocusedSlug(FIRST)} />;
}

export function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  // The tile that takes focus: the first Featured tile on launch, the tile that
  // was opened on return. hasTVPreferredFocus only acts when the prop changes,
  // so it is cleared and set again once the screen transition has settled
  // (the pattern Marquee uses).
  const opened = useRef<string>(FIRST);
  const [preferred, setPreferred] = useState<string | null>(null);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    const settle = () => {
      setPreferred(null);
      if (t) clearTimeout(t);
      t = setTimeout(() => setPreferred(opened.current), 450);
    };
    settle(); // launch: the listener below may attach after the first focus event
    const unsubscribe = navigation.addListener('focus', settle);
    return () => {
      unsubscribe();
      if (t) clearTimeout(t);
    };
  }, [navigation]);
  const open = useCallback(
    (slug: string) => {
      opened.current = slug;
      navigation.navigate('Destination', { slug });
    },
    [navigation],
  );

  return (
    <View style={styles.screen}>
      <HomeBackdrop />
      <NavBar current="Home" />
      <TitleBlock />
      <ScrollView style={styles.rows} contentContainerStyle={styles.rowsContent} showsVerticalScrollIndicator={false}>
        {rows.map((row) => (
          <Row key={row.id} row={row} onOpen={open} preferredSlug={preferred && row.slugs.includes(preferred) ? preferred : undefined} />
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
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: px(20) },
  meta: { color: colors.textSoft, fontFamily: font.semibold, fontSize: px(type.meta) },
  rows: { position: 'absolute', left: 0, right: 0, top: px(590), bottom: 0 },
  rowsContent: { paddingBottom: px(200) },
});
