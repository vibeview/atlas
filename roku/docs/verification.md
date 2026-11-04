# Verification

Everything below ran on a VibeView cloud Roku against the sideloaded
channel, driven with the `vibeview` CLI: `press`, `type`, `ui-tree`,
`screenshot` and `logs`.

| # | Step | Roku |
|---|---|---|
| 1 | Launch: focus on the first Featured tile (Kyoto) | ✓ |
| 2 | Down: row 2 slides to the top, focus on its first tile | ✓ |
| 3 | Down again: row 3, same | ✓ |
| 4 | Up from a row reaches the top bar | ✓ |
| 5 | Focusing Search shows the Search tab (no Select) | ✓ |
| 6 | Focusing Saved shows the Saved tab | ✓ |
| 7 | Down into the Saved grid | ✓ |
| 8 | Select opens the destination, focus on Plan trip | ✓ |
| 9 | Back returns to the same Saved tile | ✓ |
| 10 | Back on a tab returns to Home, on the last Home tile used | ✓ |
| 11 | Search: down reaches the keyboard | ✓ |
| 12 | Home row 3: open a place, Back returns to the same tile | ✓ |
| 13 | Search grid: open a place, Back returns to the same tile | ✓ |
| 14 | Saved: open, unsave, Back focuses the tile that took its place | ✓ |
| 15 | Saved: unsave the last place, Back shows the empty state with focus on Saved | ✓ |

Also checked:
- **Search typing:** `vibeview type kyo` into the keyboard narrows the
  results to Kyoto. Right off the keyboard's edge reaches the results, left
  returns to the keyboard, and up from the keyboard's top row or the results'
  first line reaches the top bar.
- **Save and Plan trip:** Save toggles to "Saved"; Plan trip shows "Added to
  your trips" for three seconds.
- **Back on Home** leaves the channel (`EXIT_USER_NAV` in the device log).
- **Texture memory:** every row scrolled to its end and every tab opened,
  with no blank Poster in the screenshots. The device log shows no script
  errors or warnings.

## Cross-TV replay

One test recorded on Apple TV (open Kyoto, Save, Back, move to the Saved
tab, then three checks: the button reads Saved, the Saved tab is focused,
Kyoto is in Saved), run unchanged on all three TVs in Smart mode. It passes
on Apple TV, Android TV and Roku. The recorded presses replay on every
platform: each Select finds its element by id (`tile-kyoto`, `btn-save`),
and the arrow presses replay as recorded. The checks only confirm; none
of them has to move focus.

Screenshots: `screenshots/roku-*.webp`.
