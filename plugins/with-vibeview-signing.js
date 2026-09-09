// Release signing for VibeView cloud production builds.
//
// A production build runs Gradle with four properties that point at the
// keystore uploaded to your VibeView organization (see
// https://vibeview.io/docs/app-signing, "Android: signing config"). A managed
// Expo project has no checked-in android/app/build.gradle to paste that block
// into, so this plugin appends it at prebuild time. The `hasProperty` guard
// keeps every other build (local, simulator, `vibeview dev`) exactly as it
// was: without the properties the block is inert.
const { withAppBuildGradle } = require('expo/config-plugins');

const BLOCK = `
// VibeView production signing (added by plugins/with-vibeview-signing.js)
if (project.hasProperty('VIBEVIEW_STORE_FILE')) {
    android {
        signingConfigs {
            release {
                storeFile file(VIBEVIEW_STORE_FILE)
                storePassword VIBEVIEW_STORE_PASSWORD
                keyAlias VIBEVIEW_KEY_ALIAS
                keyPassword VIBEVIEW_KEY_PASSWORD
            }
        }
        buildTypes.release.signingConfig signingConfigs.release
    }
}
`;

module.exports = function withVibeViewSigning(config) {
  return withAppBuildGradle(config, (mod) => {
    if (!mod.modResults.contents.includes('VIBEVIEW_STORE_FILE')) {
      mod.modResults.contents = mod.modResults.contents.trimEnd() + '\n' + BLOCK;
    }
    return mod;
  });
};
