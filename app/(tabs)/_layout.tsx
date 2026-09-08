import { Tabs } from 'expo-router';
import React from 'react';

import { CompassIcon, HeartIcon, MapIcon, PersonIcon } from '../../src/components/icons';
import { colors, font } from '../../src/theme/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.lagoon,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.hairline,
        },
        tabBarLabelStyle: {
          fontFamily: font.bold,
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarButtonTestID: 'tab-explore',
          tabBarAccessibilityLabel: 'Explore',
          tabBarIcon: ({ color }) => <CompassIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarButtonTestID: 'tab-saved',
          tabBarAccessibilityLabel: 'Saved',
          tabBarIcon: ({ color }) => <HeartIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarButtonTestID: 'tab-trips',
          tabBarAccessibilityLabel: 'Trips',
          tabBarIcon: ({ color }) => <MapIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarButtonTestID: 'tab-profile',
          tabBarAccessibilityLabel: 'Profile',
          tabBarIcon: ({ color }) => <PersonIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
