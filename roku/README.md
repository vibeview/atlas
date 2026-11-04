# Atlas for Roku

Atlas for Roku: the same four screens as [`tv/`](../tv/) (Home,
Destination, Search, Saved), written as a plain BrightScript and SceneGraph
channel with no framework and no build step beyond zipping. The content
(`data/` and `images/destinations/`) is generated from the repo's
`content/` by `npm --prefix ../scripts run export`, and is committed,
because `vibeview` uploads only this folder.

## Run it with VibeView

```sh
vibeview build --platform roku      # package out/atlas.zip and upload it
vibeview dev --platform roku        # a live Roku session in your browser; r re-packages and reloads
```

`vibeview.json` carries no `appId`: your first upload creates the app in
your organization and writes its id back into the file. Its build command is
`sh package.sh`, which zips `manifest`, `source`, `components`,
`images`, `data` and `fonts` into `out/atlas.zip`, the layout Roku's
developer installer sideloads.

## How it is put together

```
manifest                  title, version, icons, splash, ui_resolutions=fhd
source/main.brs           entry point
components/AtlasScene     tabs under one top bar, the Destination screen, the saved list
components/HomeView       backdrop, title block, four rows
components/DestinationView, SearchView, SavedView
components/Tile, NavBar, NavItem, AtlasButton, TileGrid, Backdrop
components/theme.brs      colours, fonts and helpers shared by every component
data/destinations.json    generated: the 24 places, folded search keys, the three seeded saves
images/                   generated: photos, scrims, 9-patch pills; icons and splash from make-tv-art
fonts/                    Manrope, cut to the Latin ranges the content uses (scripts/subset-fonts.sh)
```

- **Focus is SceneGraph's own.** Tiles, top-bar items and buttons are small
  focusable components that hold real focus (`setFocus`) and draw their
  focused look from `focusedChild`. Views only decide, in `onKeyEvent`,
  which node gets focus next; a press a view does not use passes up to the
  scene. So the focus VibeView's UI tree reports is the focus on screen.
- **Same rules as `tv/`.** Focusing a top-bar item shows its tab. Up off a
  tab reaches the top bar. Back on Search or Saved returns to Home on the
  last Home tile; Back on Home leaves the channel. Back on a place returns to
  the tile it was opened from (in Saved, after an unsave, to the tile that
  took its place).
- **Same ids as `tv/`.** The node `id`s are the tv app's `testID`s, so
  a test recorded on Apple TV finds the same elements here:
  `tile-<slug>`, `search-tile-<slug>`, `saved-tile-<slug>`,
  `nav-home`, `nav-search`, `nav-saved`, `btn-plan-trip`, `btn-save`,
  and `search-field` (the keyboard's text box). Every tile has a label with
  the place's name.
- **Search** uses Roku's `MiniKeyboard`. Right or down off its edge moves
  into the results, left from the results' first column returns to it, and
  up from either reaches the top bar.

## Size and memory

- The zip is 3372033 bytes; the export fails above 3,500,000, which leaves
  headroom under Roku's sideload limit.
- Backdrops are 960×540 JPEGs, and 1280×720 for the six Featured places.
  Tiles are 480×270. Gradients and rounded pills are small PNGs that Posters
  scale and tint.
- Texture memory: Home holds two backdrop Posters (current and incoming)
  and Destination one. Every Poster sets `loadWidth`, `loadHeight` and
  `loadDisplayMode="limitSize"`, and Search and Saved load the tile photos
  at the same size as Home, so they share one texture each.

## Things worth knowing

- `tab` is a reserved word in BrightScript. A variable named `tab` fails
  the device compile, though BrighterScript does not flag it.
- Manrope has no ★, and SceneGraph has no font fallback, so the Save button
  reads "Saved" in amber here.
- Poster cannot clip corners, so tiles and their focus ring are square on
  Roku. The pills and buttons are tinted 9-patch images.
- Star ratings are kept in the data but not shown, as in `tv/`.

Verification: [`docs/verification.md`](docs/verification.md).

The photos are under the Unsplash License, not this repo's MIT licence: see
[`CREDITS.md`](../CREDITS.md). Manrope is under the SIL Open Font License
(`fonts/OFL.txt`).
