import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DestinationDetail } from '../../src/components/DestinationDetail';
import { destinationsById } from '../../src/data/destinations';
import { useIsSplit } from '../../src/layout/AdaptiveLayout';
import { useAppState } from '../../src/state/AppState';
import { colors, font } from '../../src/theme/theme';

/**
 * The phone page for one destination. In the two-pane layout the detail pane
 * shows destinations instead, so if the window grows into two panes while
 * this page is open (opening iPhone Duo), the page hands its destination to
 * the pane and gets out of the way.
 */
export default function DestinationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const split = useIsSplit();
  const { select } = useAppState();

  const destination = typeof id === 'string' ? destinationsById[id] : undefined;

  useEffect(() => {
    if (!split || !destination) return;
    select(destination.id);
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, [split, destination, select, router]);

  if (!destination) {
    return (
      <SafeAreaView style={styles.missing}>
        <Text style={styles.missingText}>That destination doesn’t exist.</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {!split && <StatusBar style="light" />}
      <DestinationDetail destination={destination} variant="screen" onBack={() => router.back()} />
    </>
  );
}

const styles = StyleSheet.create({
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mist,
  },
  missingText: { fontFamily: font.semibold, fontSize: 14, color: colors.secondary },
});
