import React from 'react';
import { StatusBar, Text, View } from 'react-native';

import { colors } from './theme';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar hidden />
      <Text style={{ color: colors.text, fontSize: 64 }} testID="atlas-ready">
        Atlas
      </Text>
    </View>
  );
}
