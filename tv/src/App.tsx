import {
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';

import type { RootStackParamList } from './navigation';
import { DestinationScreen } from './screens/DestinationScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SavedScreen } from './screens/SavedScreen';
import { SearchScreen } from './screens/SearchScreen';
import { SavedProvider } from './state/SavedProvider';
import { colors } from './theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.ink, card: colors.inkRaised, text: colors.text, primary: colors.lagoon },
};

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded] = useFonts({ Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold });
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);
  if (!fontsLoaded) return null;
  return (
    <SavedProvider>
      <StatusBar hidden />
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: colors.ink } }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Destination" component={DestinationScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Saved" component={SavedScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SavedProvider>
  );
}
