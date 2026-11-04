import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Experience } from '../data/model';
import { colors, font, px, type } from '../theme';

/** One of a place's top experiences: a numbered marker, a title and one line. Text only. */
export function ExperienceRow({ experience, index }: { experience: Experience; index: number }) {
  return (
    <View style={styles.row}>
      <View style={styles.marker}>
        <Text style={styles.number}>{String(index + 1).padStart(2, '0')}</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{experience.title}</Text>
        <Text style={styles.line}>{experience.line}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: px(22) },
  marker: {
    width: px(56),
    height: px(56),
    borderRadius: px(28),
    borderWidth: px(2),
    borderColor: colors.lagoonBright,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: px(22),
  },
  number: { color: colors.text, fontFamily: font.bold, fontSize: px(22) },
  text: { flex: 1 },
  title: { color: colors.text, fontFamily: font.bold, fontSize: px(type.body) },
  line: { color: colors.textSoft, fontFamily: font.medium, fontSize: px(24), marginTop: px(2) },
});
