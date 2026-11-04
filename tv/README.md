# Atlas TV

Atlas for Apple TV and Android TV: Expo 57 on
[react-native-tvos](https://github.com/react-native-tvos/react-native-tvos),
TypeScript and React Navigation. It is a sibling of the phone app, not a
target inside it: react-native-tvos follows React Native on its own
schedule, so it has its own `package.json`. The content (`src/data/` and
`assets/destinations/`) is generated from the repo's `content/` by
`npm --prefix ../scripts run export`, and is committed, because a cloud build
uploads only this folder.

## Build and run with VibeView

`vibeview.json` has two profiles per platform:

| Profile | What it is |
| --- | --- |
| `development` | Debug build that loads its JavaScript from Metro, for `vibeview dev` |
| `preview` | Release build with the JavaScript inside, for share links, tests and samples |

```sh
npm ci
vibeview build --cloud --profile preview --platform all   # Apple TV + Android TV
vibeview dev --platform tvos --standalone                  # run the newest preview build
vibeview dev --platform androidtv                          # Metro dev loop on a cloud Android TV
```

`vibeview.json` carries no `appId`: your first build creates the app in your
organization and writes its id back into the file.

The Android TV build carries x86 and x86_64 code (`-PreactNativeArchitectures=x86,x86_64`).
Those are the architectures of the Android TV emulators.

## Things worth knowing

- **One React Native.**
  - `package.json` overrides `react-native` to the react-native-tvos package.
  - Without it, `@react-native-tvos/virtualized-lists` pulls upstream React Native in beside it, because its peer range is an exact version. The Release build then crashes at launch ("View config getter callback for component `RCTText` must be a function").
- **Initial focus.** `hasTVPreferredFocus` only acts when the prop changes. Screens therefore clear it and set it again 450 ms after each transition (`MainScreen.tsx`).
- **Images on Android.** Bundled images get explicit width and height. With `absoluteFill` alone, Android release builds draw them zoomed in from the top-left corner.
- **Rows.** Rows are `ScrollView` + `map`, not virtualised lists, so every tile is in the UI tree.
- **Test ids.** `testID` becomes the accessibility identifier on tvOS and the resource id on Android TV:
  - tiles: `tile-<slug>` on Home, `search-tile-<slug>` on Search, `saved-tile-<slug>` on Saved;
  - top bar: `nav-home`, `nav-search`, `nav-saved`;
  - buttons: `btn-plan-trip`, `btn-save`;
  - the search field: `search-field`.

## Tests

`npm test` runs the search and saved-state tests (node:test). `npm run typecheck` runs tsc.
