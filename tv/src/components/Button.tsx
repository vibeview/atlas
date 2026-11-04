import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, font, px, type } from '../theme';

type Props = {
  testID: string;
  label: string;
  onPress(): void;
  tone?: 'primary' | 'secondary';
  active?: boolean;
  preferred?: boolean;
};

/** Lagoon fill for the main action; focus turns the button white. */
export function Button({ testID, label, onPress, tone = 'secondary', active, preferred }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      testID={testID}
      accessibilityLabel={label}
      hasTVPreferredFocus={preferred}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.base, tone === 'primary' ? styles.primary : styles.secondary, focused && styles.focused]}
    >
      <Text style={[styles.label, active && !focused && styles.active, focused && styles.labelFocused]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { paddingHorizontal: px(40), paddingVertical: px(18), borderRadius: px(14), marginRight: px(20) },
  primary: { backgroundColor: colors.lagoon },
  secondary: { backgroundColor: 'rgba(255,255,255,0.14)' },
  focused: { backgroundColor: colors.text, transform: [{ scale: 1.06 }] },
  label: { color: colors.text, fontFamily: font.bold, fontSize: px(30) },
  active: { color: colors.amber },
  labelFocused: { color: colors.ink },
});
