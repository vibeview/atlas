# TV content

`destinations.json` is the one source for the TV apps (`tv/`, `roku/`).
`scripts/export.mjs` writes sized copies into each app; never edit those by
hand. Run `npm --prefix scripts run check` after any change.

```
{
  "rows": [ { "id": "popular" | "cities" | "coast" | "mountains", "title": string, "slugs": [6 slugs] } ],
  "destinations": [ Destination × 24 ]
}
```

A destination appears in exactly one row. `popular` (shown as "Featured")
holds six of the phone app's seven destinations; its title never claims live
data.

| Field | Rule |
|---|---|
| `slug` | lowercase-hyphenated; the photo master is `photos/<slug>.jpg` (1920 px wide) |
| `name`, `country` | plain text |
| `tagline` | one line |
| `description` | two or three sentences, not all built the same way |
| `tags` | 2 or 3 |
| `bestMonths` | e.g. "May to September" |
| `timeZone` | `UTC+2`, or `UTC+2, UTC+3 in summer` where clocks change |
| `airport` | nearest airport and the transfer, e.g. "Osaka Kansai (KIX), 75 min by train" |
| `rating` | illustrative app data, 4.0–5.0, one decimal; never shown on screen |
| `experiences` | three `{ title, line, icon }`, text only |
| `photo` | `{ unsplashId, photographer, url, checkedOn }`, free Unsplash License |

Facts (airport, transfer, time zone, best months) are sourced in
`../docs/content-sources.md`. Copy avoids: "come for … stay for",
"nestled", "hidden gem", "breathtaking", "vibrant", "whether you're",
"paradise", "something for everyone", and rhythm triplets.
