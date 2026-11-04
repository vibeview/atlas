import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, font, px } from '../theme';

type Props = { value: string; onChangeText(text: string): void };

const PLACEHOLDER = 'Search places or countries';

/**
 * The search field.
 *
 * tvOS: a plain TextInput. Selecting it opens Apple's full-screen keyboard;
 * Menu cancels the edit and the field goes back to its old text without a
 * change event, so the field's final text is taken on end-editing.
 *
 * Android TV: an EditText keeps D-pad focus once it has it, so the field rests
 * as a focusable button (same id) and Select turns it into a live input with
 * the keyboard. Closing the keyboard turns it back, so the D-pad can move on
 * to the results. Either way the field is a real text field while typing,
 * which is what VibeView types into.
 */
export function SearchField({ value, onChangeText }: Props) {
  const [focused, setFocused] = useState(false);
  if (Platform.OS !== 'android') {
    return (
      <TextInput
        testID="search-field"
        accessibilityLabel="Search places"
        value={value}
        onChangeText={onChangeText}
        onEndEditing={(e) => onChangeText(e.nativeEvent.text)}
        placeholder={PLACEHOLDER}
        placeholderTextColor={colors.textMuted}
        autoCorrect={false}
        autoCapitalize="none"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.box, styles.text, focused && styles.focused]}
      />
    );
  }
  return <AndroidSearchField value={value} onChangeText={onChangeText} />;
}

function AndroidSearchField({ value, onChangeText }: Props) {
  const [editing, setEditing] = useState(false);
  const [focused, setFocused] = useState(false);
  const [returnFocus, setReturnFocus] = useState(false);
  const input = useRef<TextInput>(null);

  useEffect(() => {
    if (!editing) return;
    const t = setTimeout(() => input.current?.focus(), 50);
    const sub = Keyboard.addListener('keyboardDidHide', () => finish());
    return () => {
      clearTimeout(t);
      sub.remove();
    };
  }, [editing]); // eslint-disable-line react-hooks/exhaustive-deps

  const finish = () => {
    input.current?.blur();
    setEditing(false);
    // hasTVPreferredFocus acts on a change: hand focus back to the button.
    setReturnFocus(false);
    setTimeout(() => setReturnFocus(true), 50);
  };

  if (editing) {
    return (
      <TextInput
        ref={input}
        testID="search-input"
        accessibilityLabel="Search places"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={finish}
        placeholder={PLACEHOLDER}
        placeholderTextColor={colors.textMuted}
        autoCorrect={false}
        autoCapitalize="none"
        disableFullscreenUI
        style={[styles.box, styles.text, styles.focused, styles.android]}
      />
    );
  }
  return (
    <Pressable
      testID="search-field"
      accessibilityLabel="Search places"
      accessibilityRole="search"
      hasTVPreferredFocus={returnFocus}
      onPress={() => setEditing(true)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.box, styles.android, focused && styles.focused]}
    >
      <View pointerEvents="none">
        <Text style={[styles.text, !value && styles.placeholder]} numberOfLines={1}>
          {value || PLACEHOLDER}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: px(900),
    paddingHorizontal: px(28),
    paddingVertical: px(18),
    borderRadius: px(14),
    backgroundColor: colors.inkRaised,
    borderWidth: px(4),
    borderColor: colors.inkLine,
    justifyContent: 'center',
  },
  android: { paddingVertical: px(12), minHeight: px(88) },
  text: { color: colors.text, fontFamily: font.semibold, fontSize: px(36) },
  placeholder: { color: colors.textMuted },
  focused: { borderColor: colors.focusBorder },
});
