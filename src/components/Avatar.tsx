import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, font } from '../theme/theme';

export function Avatar({ size = 34, initials = 'AM' }: { size?: number; initials?: string }) {
  return (
    <View
      testID="avatar"
      accessibilityLabel={`Profile ${initials}`}
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.34 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.lagoon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontFamily: font.extrabold,
  },
});
