# Verification

Everything below ran on VibeView cloud devices against **preview** builds
(Release, JavaScript bundled, no Metro), driven with the `vibeview` CLI:
`press`, `type`, `ui-tree` and `screenshot`.

Devices: Apple TV 4K on tvOS 17.5, Apple TV on tvOS 26.4, Android TV on
Android 14 (API 34).

| # | Step | tvOS 17.5 | tvOS 26.4 | Android TV |
|---|---|---|---|---|
| 1 | Launch: focus on the first Featured tile (Kyoto) | ✓ | ✓ | ✓ |
| 2 | Down: row 2 scrolls to the top, focus on its first tile | ✓ | ✓ | ✓ |
| 3 | Down again: row 3, same | ✓ | ✓ | ✓ |
| 4 | Up from a row reaches the nav bar | ✓ | ✓ | ✓ |
| 5 | Focusing Search shows the Search tab (no Select) | ✓ | ✓ | ✓ |
| 6 | Focusing Saved shows the Saved tab | ✓ | ✓ | ✓ |
| 7 | Down into the Saved grid | ✓ | ✓ | ✓ |
| 8 | Select opens the destination, focus on Plan trip | ✓ | ✓ | ✓ |
| 9 | Back returns to the same Saved tile | ✓ | ✓ | ✓ |
| 10 | Back on a tab returns to Home, on the last Home tile used | ✓ | ✓ | ✓ |
| 11 | Search: down reaches the field | ✓ | ✓ | ✓ |
| 12 | Home row 3: open a place, Back returns to the same tile | ✓ | ✓ | ✓ |
| 13 | Search grid: open a place, Back returns to the same tile | ✓ | ✓ | ✓ |
| 14 | Saved: open, unsave, Back focuses the tile that took its place | ✓ | ✓ | ✓ |
| 15 | Saved: unsave the last place, Back shows the empty state with focus on Saved | ✓ | ✓ | ✓ |

Also checked:
- **Search typing:** `vibeview type kyo` into the field narrows the results to Kyoto.
  - On tvOS, typing goes through Apple's keyboard. **done** keeps the text; Menu cancels the edit, and the results follow the field.
  - On Android TV the field rests as a button: the D-pad moves on and off it. Select opens the keyboard, docked below the results, and closing the keyboard returns focus to the field.
- **Save:** Save on a destination toggles to "★ Saved", and the place appears in Saved.
- **Row ends:** right at the end of a row stays put. Down from the end of a row lands on the next row's remembered tile, or its first tile the first time.
- **Captures:** each was checked at the sizes vibeview.io shows them (460 and 330 CSS px wide).

Screenshots: `screenshots/atv-*.webp` (Apple TV) and `screenshots/andtv-*.webp`
(Android TV).
