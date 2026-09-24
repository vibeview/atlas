import type { ExpoConfig } from 'expo/config';

// The build number comes from VibeView cloud builds: set `autoIncrement: true`
// in vibeview.json and every production build receives the next number as
// VIBEVIEW_BUILD_NUMBER. See https://vibeview.io/docs/cloud-builds
const buildNumber = process.env.VIBEVIEW_BUILD_NUMBER ?? '1';

const config: ExpoConfig = {
  name: 'Atlas',
  slug: 'atlas',
  version: '1.1.2',
  // Every orientation: iPhone Duo's inner display is landscape when open, and
  // iOS 27 resizes iPhone apps like iPad apps.
  orientation: 'default',
  icon: './assets/images/icon.png',
  scheme: 'atlas',
  userInterfaceStyle: 'light',
  ios: {
    bundleIdentifier: 'io.vibeview.atlas',
    buildNumber,
    supportsTablet: true,
  },
  android: {
    package: 'io.vibeview.atlas',
    versionCode: parseInt(buildNumber, 10),
    adaptiveIcon: {
      backgroundColor: '#0E7C86',
      foregroundImage: './assets/images/android-icon-foreground.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    './plugins/with-bundled-debug',
    './plugins/with-vibeview-signing',
    'expo-router',
    'expo-font',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#0E7C86',
        image: './assets/images/splash-icon.png',
        imageWidth: 140,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
