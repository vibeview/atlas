import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, font } from '../theme/theme';

export function EmptyState({
  icon,
  title,
  body,
  testID,
}: {
  icon?: React.ReactNode;
  title: string;
  body: string;
  testID?: string;
}) {
  return (
    <View testID={testID} style={styles.wrap}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingTop: 72,
    paddingHorizontal: 32,
    gap: 6,
  },
  title: {
    fontFamily: font.extrabold,
    fontSize: 16,
    color: colors.ink,
    marginTop: 8,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: font.medium,
    fontSize: 13,
    color: colors.secondary,
    textAlign: 'center',
    lineHeight: 19,
  },
});
