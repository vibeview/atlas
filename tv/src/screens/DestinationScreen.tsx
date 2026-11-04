import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { FULL } from '../components/Backdrop';
import { Button } from '../components/Button';
import { ExperienceRow } from '../components/ExperienceRow';
import { backdrops } from '../data/images';
import { bySlug } from '../data/model';
import type { ScreenProps } from '../navigation';
import { useSaved } from '../state/SavedProvider';
import { colors, font, px, safe, type } from '../theme';

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

export function DestinationScreen({ route }: ScreenProps<'Destination'>) {
  const d = bySlug[route.params.slug];
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(d.slug);
  const [planned, setPlanned] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const plan = () => {
    setPlanned(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPlanned(false), 3000);
  };

  return (
    <View style={styles.screen}>
      <Image source={backdrops[d.slug]} style={FULL} resizeMode="cover" accessible={false} />
      <LinearGradient
        colors={['rgba(11,16,22,0.95)', 'rgba(11,16,22,0.8)', 'rgba(11,16,22,0.15)']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <View style={styles.main}>
          <Text style={styles.country}>{d.country.toUpperCase()}</Text>
          <Text style={styles.name}>{d.name}</Text>
          <View style={styles.metaRow}>
                <Text style={styles.meta}>{d.tags.join('  ·  ')}</Text>
          </View>
          <Text style={styles.description}>{d.description}</Text>
          <View style={styles.facts}>
            <Fact label="Best time" value={d.bestMonths} />
            <Fact label="Time zone" value={d.timeZone} />
            <Fact label="Nearest airport" value={d.airport} />
          </View>
          <View style={styles.buttons}>
            <Button testID="btn-plan-trip" label="Plan trip" tone="primary" onPress={plan} preferred />
            <Button testID="btn-save" label={saved ? '★ Saved' : 'Save'} active={saved} onPress={() => toggle(d.slug)} />
            {planned && <Text style={styles.toast}>Added to your trips</Text>}
          </View>
        </View>
        <View style={styles.side}>
          <Text style={styles.sideTitle}>Top experiences</Text>
          {d.experiences.map((e, i) => (
            <ExperienceRow key={e.title} experience={e} index={i} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  content: { flex: 1, flexDirection: 'row', paddingHorizontal: px(safe.x), paddingTop: px(150), paddingBottom: px(safe.y) },
  main: { width: px(1000) },
  // A panel, not text on the photo: the right side of a backdrop is where the
  // picture is brightest, and the lines must stay readable on every photo.
  side: {
    marginLeft: px(90),
    width: px(640),
    marginTop: px(40),
    alignSelf: 'flex-start',
    paddingHorizontal: px(40),
    paddingTop: px(36),
    paddingBottom: px(18),
    borderRadius: px(20),
    backgroundColor: 'rgba(11,16,22,0.8)',
  },
  country: { color: colors.textSoft, fontFamily: font.bold, fontSize: px(type.meta), letterSpacing: px(3) },
  name: { color: colors.text, fontFamily: font.extrabold, fontSize: px(type.heroName), lineHeight: px(type.heroName * 1.1), marginTop: px(6) },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: px(16) },
  meta: { color: colors.textSoft, fontFamily: font.semibold, fontSize: px(type.meta) },
  description: { color: colors.text, fontFamily: font.medium, fontSize: px(type.body), lineHeight: px(type.body * 1.5), marginTop: px(28) },
  facts: { flexDirection: 'row', marginTop: px(36) },
  fact: { marginRight: px(48), maxWidth: px(360) },
  factLabel: { color: colors.textMuted, fontFamily: font.semibold, fontSize: px(22), letterSpacing: px(1.5) },
  factValue: { color: colors.text, fontFamily: font.semibold, fontSize: px(26), marginTop: px(6) },
  buttons: { flexDirection: 'row', alignItems: 'center', marginTop: px(48) },
  toast: { color: colors.text, fontFamily: font.semibold, fontSize: px(26), marginLeft: px(12) },
  sideTitle: { color: colors.text, fontFamily: font.bold, fontSize: px(type.rowTitle), marginBottom: px(28) },
});
