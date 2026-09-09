# Atlas

A small travel app: find a place, open it, save it.

Atlas is **VibeView's demo app** — the one on the device in the screenshots on
[vibeview.io](https://vibeview.io) and in the live demo — and it doubles as the
public **reference project for VibeView cloud builds**. It is a plain Expo
project with no backend, no sign-in and no persistence, so every session starts
identical: the same six saved places, the same two trips, the same photos.

React Native + Expo (SDK 57), TypeScript, Expo Router. One codebase, iOS and
Android.

<!-- screenshot: docs/screenshots/atlas-explore.png — Explore, Destination, Saved, Profile -->
_Screenshots: Explore · Destination · Saved · Profile._

## Run it on VibeView

Atlas is built and run entirely through VibeView — no Mac, no Android Studio,
no local native toolchain.

```bash
npm install -g vibeview     # or run any command below with npx vibeview
vibeview login
```

**Live development** — stream the app from a cloud device with Metro
hot-reload. The `metroCommand` in `vibeview.json` starts Metro for you:

```bash
vibeview dev                      # defaultPlatform (ios)
vibeview dev --platform android
vibeview dev --build              # rebuild and upload first
```

**Cloud builds** — compile a simulator/emulator build in the cloud and drop it
into the app's Build history:

```bash
vibeview build --cloud --platform ios
vibeview build --cloud --platform android
vibeview build --cloud --platform all
```

Drop `--cloud` to build locally with the same commands from `vibeview.json`.

**Production builds and store submission** — a signed release artifact needs a
signing credential uploaded first (see the App Signing guide):

```bash
vibeview build --cloud --production --platform ios
vibeview submit --platform ios
vibeview submit --platform android --track internal
```

### `vibeview.json`

The build blocks follow the same shape as the Expo production defaults: there
is no `ios/` or `android/` directory in this repo, so each command runs
`npx expo prebuild` to generate one and then drives the native build tool
directly (`xcodebuild` for the simulator `.app`, Gradle for the debug `.apk`).
`npx expo run:*` is the wrong tool for a cloud build: it expects a booted
simulator or a connected Android device to install onto, and the builder has
neither. `npm ci` comes first because a cloud build starts from a clean
checkout with no `node_modules`; the iOS prebuild also runs `pod install`.

Both simulator builds embed the JavaScript bundle, which a stock debug build
does not: React Native expects Metro and shows a red "No script URL" screen
without it. On a cloud device there is no Metro unless you are running
`vibeview dev`, so share links and test runs need the bundle inside the app.
The small config plugin in `plugins/with-bundled-debug.js` takes care of it on
both platforms: it empties Gradle's `debuggableVariants` and writes an
`ios/.xcode.env.local` that makes the bundle step produce a production bundle
for Debug too (a dev bundle cannot run without its dev server). When Metro *is*
running the app still prefers it, so the dev loop is unchanged.

JSON has no comments, so two notes live here instead:

- **There is deliberately no `appId`.** The first `vibeview build` writes it
  back into `vibeview.json` itself — either linking to an app you pick, or
  creating one from the build. Committing someone else's app id would just get
  in the way.
- **`autoIncrement: true`** hands each production build the next build number
  through the `VIBEVIEW_BUILD_NUMBER` environment variable, which
  `app.config.ts` reads into the iOS `buildNumber` and the Android
  `versionCode`. It applies to production builds only and needs the platform
  linked to an app.

## Run locally

```bash
npm install
npx expo start
```

Then press `i` for an iOS simulator or `a` for an Android emulator. Other
scripts:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # expo lint
```

## Project structure

```
app/                        Expo Router routes
  _layout.tsx               fonts, splash, app state provider, stack
  (tabs)/_layout.tsx        the four tabs
  (tabs)/index.tsx          Explore — search, categories, rail, list
  (tabs)/saved.tsx          Saved — collections and a 2-column grid
  (tabs)/trips.tsx          Trips — planned trips
  (tabs)/profile.tsx        Profile — stats, settings, sign out
  destination/[id].tsx      Destination — hero, tags, experiences, sticky bar
src/
  components/               DestinationCard, DestinationRow, Chip, Avatar,
                            EmptyState, icons
  data/destinations.ts      the seven destinations
  state/AppState.tsx        saved places and trips (in memory, seeded)
  theme/theme.ts            colours, fonts, radii
assets/photos/              the seven bundled photos
app.config.ts               app name, ids, icon, splash, build number
vibeview.json               VibeView build and dev configuration
```

## Test ids

Every interactive element carries a stable `testID` and an
`accessibilityLabel`, so VibeView's recorder and AI agent can address it by
name rather than by coordinate.

| Test id | Element |
| --- | --- |
| `tab-explore`, `tab-saved`, `tab-trips`, `tab-profile` | the four tab bar buttons |
| `search-input` | Explore search field (label `Search destinations`) |
| `chip-all`, `chip-beaches`, `chip-mountains`, `chip-cities`, `chip-islands` | Explore category filters |
| `destination-card-<id>` | a photo card, e.g. `destination-card-santorini` |
| `card-save-<id>` | the heart on a photo card |
| `destination-row-<id>` | a Weekend escapes row |
| `explore-title`, `explore-scroll`, `weekend-list`, `explore-no-results` | Explore landmarks |
| `destination-name`, `destination-rating`, `destination-price` | Destination text |
| `back-button`, `share-button` | Destination hero buttons |
| `save-button` | Destination Save toggle (label `Save` / `Saved`) |
| `plan-trip-button` | Destination Plan trip button |
| `experience-<title>` | a Top experiences tile |
| `saved-title`, `saved-subtitle`, `saved-grid`, `saved-empty`, `saved-collection-empty` | Saved landmarks |
| `collection-all`, `collection-summer-2027`, `collection-someday` | Saved collection chips |
| `trips-title`, `trips-list`, `trips-empty`, `trip-<id>` | Trips landmarks |
| `profile-name`, `profile-stats`, `stat-countries`, `stat-trips`, `stat-saved` | Profile landmarks |
| `setting-trip-preferences`, `setting-notifications`, `setting-currency`, `setting-units`, `setting-help` | Profile settings rows |
| `sign-out-button` | Profile Sign out |

Destination ids are `santorini`, `kyoto`, `bali`, `lago-di-braies`, `porto`,
`zermatt` and `tulum`.

## Photo credits

The seven photos in `assets/photos/` are from [Unsplash](https://unsplash.com)
and used under the [Unsplash licence](https://unsplash.com/license). They are
bundled in the app so every session looks identical and loads instantly.

| File | Used for |
| --- | --- |
| `santorini.jpg` | Santorini, Greece |
| `kyoto.jpg` | Kyoto, Japan |
| `bali.jpg` | Bali, Indonesia |
| `dolomites.jpg` | Lago di Braies, Italy |
| `porto.jpg` | Porto, Portugal |
| `lake.jpg` | Zermatt, Switzerland |
| `beach.jpg` | Tulum, Mexico |

## Licence

MIT © 2026 ScriptX. See [LICENSE](./LICENSE).
