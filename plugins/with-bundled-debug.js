// Bundle JS into *debug* builds too, on both platforms.
//
// React Native leaves debug builds unbundled (they expect Metro), which is
// right for a local dev loop but wrong for a cloud device: a share link or a
// test run has no Metro, and the app red-screens with "No script URL provided".
// The app still tries Metro first when it is running, so `vibeview dev` is
// unaffected; the embedded bundle is the fallback.
//
// Android: emptying Gradle's `debuggableVariants` makes it bundle every variant.
// iOS: Expo's "Bundle React Native code and images" phase exports
// SKIP_BUNDLING=1 for Debug, then sources ios/.xcode.env.local as the
// documented override — so this plugin writes that file. It unsets the skip
// and tells react-native-xcode.sh to bundle as Release: that script reads
// CONFIGURATION only to pick a dev vs production bundle (and the simulator
// skip), and a *dev* bundle cannot run embedded — its devtools client throws
// "Cannot create devtools websocket connections in embedded environments".
// Nothing else in the build reads the overridden value; Xcode's own
// configuration is untouched.
const { withAppBuildGradle, withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const MARKER = '// debuggableVariants = ["liteDebug", "prodDebug"]';

function withBundledDebugAndroid(config) {
  return withAppBuildGradle(config, (mod) => {
    const gradle = mod.modResults.contents;
    if (gradle.includes('debuggableVariants = []')) return mod;
    if (!gradle.includes(MARKER)) {
      throw new Error('with-bundled-debug: expected the commented debuggableVariants line in app/build.gradle');
    }
    mod.modResults.contents = gradle.replace(MARKER, `${MARKER}\n    debuggableVariants = []`);
    return mod;
  });
}

function withBundledDebugIos(config) {
  return withDangerousMod(config, [
    'ios',
    (mod) => {
      const file = path.join(mod.modRequest.platformProjectRoot, '.xcode.env.local');
      fs.writeFileSync(
        file,
        '# Written by plugins/with-bundled-debug.js: embed a production JS bundle in Debug builds.\n' +
          'unset SKIP_BUNDLING\n' +
          'export CONFIGURATION=Release\n',
      );
      return mod;
    },
  ]);
}

module.exports = function withBundledDebug(config) {
  return withBundledDebugIos(withBundledDebugAndroid(config));
};
