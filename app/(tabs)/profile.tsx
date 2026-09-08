import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../../src/components/Avatar';
import { ChevronRightIcon } from '../../src/components/icons';
import { useAppState } from '../../src/state/AppState';
import { colors, font, radius, spacing } from '../../src/theme/theme';

const SETTINGS: { id: string; label: string; value?: string }[] = [
  { id: 'trip-preferences', label: 'Trip preferences' },
  { id: 'notifications', label: 'Notifications', value: 'On' },
  { id: 'currency', label: 'Currency', value: 'USD' },
  { id: 'units', label: 'Units', value: 'km' },
  { id: 'help', label: 'Help and feedback' },
];

export default function ProfileScreen() {
  const { saved, trips } = useAppState();

  // Ava's lifetime totals: four past trips and six older saves on top of what
  // the demo session holds, so a fresh launch reads 14 / 6 / 12 as designed.
  const PAST_TRIPS = 4;
  const OLDER_SAVES = 6;

  const stats = [
    { id: 'countries', value: 14, label: 'countries' },
    { id: 'trips', value: trips.length + PAST_TRIPS, label: 'trips' },
    { id: 'saved', value: saved.length + OLDER_SAVES, label: 'saved' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.identity}>
          <Avatar size={64} />
          <Text testID="profile-name" style={styles.name}>
            Ava Moreno
          </Text>
          <Text style={styles.since}>Exploring since 2021</Text>
        </View>

        <View testID="profile-stats" style={styles.stats}>
          {stats.map((s) => (
            <View key={s.id} testID={`stat-${s.id}`} style={styles.stat}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.list}>
          {SETTINGS.map((item, index) => (
            <Pressable
              key={item.id}
              testID={`setting-${item.id}`}
              accessibilityLabel={item.value ? `${item.label}, ${item.value}` : item.label}
              accessibilityRole="button"
              onPress={() => Alert.alert(item.label, 'Not part of the demo.')}
              style={[styles.row, index > 0 && styles.rowDivided]}
            >
              <Text style={styles.rowLabel}>{item.label}</Text>
              {item.value ? <Text style={styles.rowValue}>{item.value}</Text> : null}
              <ChevronRightIcon />
            </Pressable>
          ))}
        </View>

        <Pressable
          testID="sign-out-button"
          accessibilityLabel="Sign out"
          accessibilityRole="button"
          onPress={() => Alert.alert('Sign out', 'This is a demo — nobody is signed in.')}
          style={styles.signOut}
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.mist },
  content: { paddingHorizontal: spacing.screen, paddingBottom: 28 },
  identity: { alignItems: 'center', marginTop: 18, marginBottom: 14 },
  name: {
    fontFamily: font.extrabold,
    fontSize: 24,
    color: colors.ink,
    letterSpacing: -0.72,
    marginTop: 10,
  },
  since: {
    fontFamily: font.semibold,
    fontSize: 12,
    color: colors.secondary,
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: 12,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: {
    fontFamily: font.extrabold,
    fontSize: 20,
    color: colors.ink,
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontFamily: font.semibold,
    fontSize: 10.5,
    color: colors.secondary,
    marginTop: 1,
  },
  list: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    marginTop: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  rowDivided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
  rowLabel: {
    flex: 1,
    fontFamily: font.bold,
    fontSize: 12.5,
    color: colors.ink,
  },
  rowValue: {
    fontFamily: font.semibold,
    fontSize: 11.5,
    color: colors.secondary,
  },
  signOut: {
    height: 44,
    marginTop: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: {
    fontFamily: font.extrabold,
    fontSize: 12.5,
    color: colors.danger,
  },
});
