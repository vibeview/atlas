# Content sources

Sources for the facts in `content/destinations.json`: airport and transfer,
time zone, and best months. All checked on 2026-11-04.

Ratings are illustrative app data, not sourced. Transfer times are typical
figures for normal traffic. Best months are the dry or mild season most
sources agree on, not a guarantee.

Time zones follow the IANA tz database (release 2026f). Each time-zone row
names the zone and links the tz source file that defines it. Notes:

- **Marrakech is `UTC+0`.** Morocco left its GMT+1 system for good at 02:00 on
  2026-09-20 (decree 2.26.530, Bulletin officiel 7521, 2026-06-29). The old
  rule (UTC+1, with UTC+0 during Ramadan) no longer applies, so there is no
  Ramadan exception to record. tz 2026c has the change.
- **Banff is `UTC-6`.** Alberta moved to permanent "Alberta Time" (UTC-6) on
  2026-11-01 and no longer changes its clocks. tz 2026c has the change.
- **Torres del Paine is `UTC-3`.** The Magallanes region (America/Punta_Arenas)
  stays on UTC-3 all year. It does not follow the rest of Chile's clock
  changes.
- **Queenstown** changes clocks in the southern summer (late September to
  early April). "in summer" in `timeZone` means the local summer.
- **Tulum (Quintana Roo)** has been on UTC-5 all year since 2015, and Mexico
  dropped daylight saving time in 2022.
- No daylight saving time in Japan, Indonesia, Türkiye, Vietnam, Colombia,
  South Africa or Tanzania.
- The EU countries (Greece, Italy, Portugal, Czechia, Croatia, Austria),
  Switzerland and Norway change clocks on the last Sundays of March and
  October. California still follows the US federal DST rules.

| Destination | Fact | Value | Source URL | Checked on |
|---|---|---|---|---|
| Kyoto | Airport and transfer | Osaka Kansai (KIX), 75 min by Haruka train | https://www.kansai-airport.or.jp/en/node/21536 | 2026-11-04 |
| Kyoto | Time zone | UTC+9 | IANA tz `Asia/Tokyo`: https://data.iana.org/time-zones/tzdb/asia | 2026-11-04 |
| Kyoto | Best months | March to May, October to November | https://www.japan.travel/en/destinations/kansai/kyoto/ | 2026-11-04 |
| Santorini | Airport and transfer | Santorini (JTR), 15 min by road to Fira | https://www.airporttransferportal.com/en/airport-guides/jtr | 2026-11-04 |
| Santorini | Time zone | UTC+2, UTC+3 in summer | IANA tz `Europe/Athens`: https://data.iana.org/time-zones/tzdb/europe | 2026-11-04 |
| Santorini | Best months | May to June, September to October | https://www.visitgreece.gr/islands/cyclades/santorini/ | 2026-11-04 |
| Bali | Airport and transfer | Bali Ngurah Rai (DPS), about 90 min by road to Ubud | https://pickyourtrail.com/blog/bali-airport-to-ubud | 2026-11-04 |
| Bali | Time zone | UTC+8 | IANA tz `Asia/Makassar`: https://data.iana.org/time-zones/tzdb/asia | 2026-11-04 |
| Bali | Best months | April to October | https://www.intrepidtravel.com/en/bali/best-time-to-visit-bali | 2026-11-04 |
| Lago di Braies | Airport and transfer | Innsbruck (INN), about 2 h by car | https://www.globotreks.com/destinations/italy/lago-di-braies/ | 2026-11-04 |
| Lago di Braies | Time zone | UTC+1, UTC+2 in summer | IANA tz `Europe/Rome`: https://data.iana.org/time-zones/tzdb/europe | 2026-11-04 |
| Lago di Braies | Best months | June to September | https://www.globotreks.com/destinations/italy/lago-di-braies/ | 2026-11-04 |
| Zermatt | Airport and transfer | Zurich (ZRH), about 3.5 h by train via Visp | https://www.thetrainline.com/en-us/train-times/zurich-airport-to-zermatt | 2026-11-04 |
| Zermatt | Time zone | UTC+1, UTC+2 in summer | IANA tz `Europe/Zurich`: https://data.iana.org/time-zones/tzdb/europe | 2026-11-04 |
| Zermatt | Best months | December to April, July to September | https://www.zermatt.ch/en | 2026-11-04 |
| Tulum | Airport and transfer | Tulum (TQO), about 40 min by road | https://thepointsguy.com/news/tulum-international-airport | 2026-11-04 |
| Tulum | Time zone | UTC-5 | IANA tz `America/Cancun`: https://data.iana.org/time-zones/tzdb/northamerica | 2026-11-04 |
| Tulum | Best months | November to April | https://shortform.com/pages/travel/best-time-to-visit/best-time-to-visit-tulum.html | 2026-11-04 |
| Porto | Airport and transfer | Porto (OPO), 30 min by metro (line E) | https://www.portugalvisitor.com/portugal-travel/porto-metro-line-e | 2026-11-04 |
| Porto | Time zone | UTC+0, UTC+1 in summer | IANA tz `Europe/Lisbon`: https://data.iana.org/time-zones/tzdb/europe | 2026-11-04 |
| Porto | Best months | May to June, September to October | https://www.visitportugal.com/en/destinos/porto-e-norte | 2026-11-04 |
| Istanbul | Airport and transfer | Istanbul (IST), about 1 h by road to Sultanahmet | https://www.istairport.com/en | 2026-11-04 |
| Istanbul | Time zone | UTC+3 | IANA tz `Europe/Istanbul`: https://data.iana.org/time-zones/tzdb/europe | 2026-11-04 |
| Istanbul | Best months | April to May, September to October | https://www.goturkiye.com/istanbul | 2026-11-04 |
| Marrakech | Airport and transfer | Marrakech Menara (RAK), 20 min by road to the medina | https://marrakechtaxi.netlify.app/marrakech-airport-transfer | 2026-11-04 |
| Marrakech | Time zone | UTC+0 (permanent from 2026-09-20) | IANA tz `Africa/Casablanca`: https://data.iana.org/time-zones/tzdb/africa; release notes: https://data.iana.org/time-zones/tzdb/NEWS | 2026-11-04 |
| Marrakech | Time zone (decree) | Decree 2.26.530, return to GMT on 2026-09-20 | https://medias24.com/2026/07/06/heure-legale-le-decret-actant-le-retour-au-gmt-publie-au-bulletin-officiel-1717173/ | 2026-11-04 |
| Marrakech | Best months | March to May, October to November | https://www.visitmorocco.com/en | 2026-11-04 |
| Hội An | Airport and transfer | Da Nang (DAD), about 45 min by road | https://www.vietnamairlines.com/en/useful-information/travel-guide/does-hoi-an-have-an-airport | 2026-11-04 |
| Hội An | Time zone | UTC+7 | IANA tz `Asia/Ho_Chi_Minh`: https://data.iana.org/time-zones/tzdb/asia | 2026-11-04 |
| Hội An | Best months | February to April | https://www.vietnamtourism.com/en/the-best-time-to-visit-hoi-an-weather-seasons-and-lantern-festivals | 2026-11-04 |
| Prague | Airport and transfer | Prague (PRG), 40 min by Airport Express bus | https://prague.eu/en/getting-to-prague | 2026-11-04 |
| Prague | Time zone | UTC+1, UTC+2 in summer | IANA tz `Europe/Prague`: https://data.iana.org/time-zones/tzdb/europe | 2026-11-04 |
| Prague | Best months | May to June, September | https://prague.eu/en/ | 2026-11-04 |
| Cartagena | Airport and transfer | Cartagena (CTG), 10 min by road | https://aeropuertocartagena.com.co/en/how-to-get-to-the-airport/ | 2026-11-04 |
| Cartagena | Time zone | UTC-5 | IANA tz `America/Bogota`: https://data.iana.org/time-zones/tzdb/southamerica | 2026-11-04 |
| Cartagena | Best months | December to April | https://www.roughguides.com/colombia/when-to-go/ | 2026-11-04 |
| Amalfi Coast | Airport and transfer | Naples (NAP), about 90 min by road to Positano | https://www.sirenuse.it/en/contacts | 2026-11-04 |
| Amalfi Coast | Time zone | UTC+1, UTC+2 in summer | IANA tz `Europe/Rome`: https://data.iana.org/time-zones/tzdb/europe | 2026-11-04 |
| Amalfi Coast | Best months | May to June, September to October | https://www.lonelyplanet.com/italy/campania/amalfi-coast | 2026-11-04 |
| Dubrovnik | Airport and transfer | Dubrovnik (DBV), 30 to 40 min by airport bus | https://www.visit-croatia.co.uk/croatia-destinations/dubrovnik/public-transport-in-dubrovnik/ | 2026-11-04 |
| Dubrovnik | Time zone | UTC+1, UTC+2 in summer | IANA tz `Europe/Zagreb` (a link to `Europe/Belgrade`): https://data.iana.org/time-zones/tzdb/backward | 2026-11-04 |
| Dubrovnik | Best months | May to June, September to October | https://www.lonelyplanet.com/croatia/dubrovnik | 2026-11-04 |
| Cape Town | Airport and transfer | Cape Town (CPT), 25 min by road to the city centre | https://www.blacklane.com/en/blog/travel/airports/cape-town-airport-guide-cpt/ | 2026-11-04 |
| Cape Town | Time zone | UTC+2 | IANA tz `Africa/Johannesburg`: https://data.iana.org/time-zones/tzdb/africa | 2026-11-04 |
| Cape Town | Best months | November to March | https://www.lonelyplanet.com/south-africa/cape-town | 2026-11-04 |
| Hạ Long Bay | Airport and transfer | Hanoi Nội Bài (HAN), about 2.5 h by road | https://www.vietnamdrive.com/transfers/hanoi/hanoi-to-halong/ | 2026-11-04 |
| Hạ Long Bay | Time zone | UTC+7 | IANA tz `Asia/Ho_Chi_Minh`: https://data.iana.org/time-zones/tzdb/asia | 2026-11-04 |
| Hạ Long Bay | Best months | March to April, October to November | https://www.highlightstravel.com/vietnam/halong-bay/best-time-to-visit | 2026-11-04 |
| Big Sur | Airport and transfer | Monterey (MRY), about 45 min by road | https://californiacrossings.com/closest-airports-to-big-sur/ | 2026-11-04 |
| Big Sur | Time zone | UTC-8, UTC-7 in summer | IANA tz `America/Los_Angeles`: https://data.iana.org/time-zones/tzdb/northamerica | 2026-11-04 |
| Big Sur | Best months | April to May, September to October | https://californiacrossings.com/best-time-to-visit-big-sur/ | 2026-11-04 |
| Zanzibar | Airport and transfer | Zanzibar (ZNZ), 15 min by road to Stone Town | https://airmundo.com/en/zanzibar-abeid-amani-karume-airport/transportation/ | 2026-11-04 |
| Zanzibar | Time zone | UTC+3 | IANA tz `Africa/Dar_es_Salaam` (a link to `Africa/Nairobi`): https://data.iana.org/time-zones/tzdb/backward | 2026-11-04 |
| Zanzibar | Best months | June to October | https://go2africa.com/destinations/zanzibar/when-to-go | 2026-11-04 |
| Banff | Airport and transfer | Calgary (YYC), about 90 min by road | https://www.banfflakelouise.com/node/69 | 2026-11-04 |
| Banff | Time zone | UTC-6 (permanent from 2026-11-01) | https://www.alberta.ca/albertas-new-time-system | 2026-11-04 |
| Banff | Time zone (tz database) | `America/Edmonton` at -06 all year | https://data.iana.org/time-zones/tzdb/northamerica; release notes: https://data.iana.org/time-zones/tzdb/NEWS | 2026-11-04 |
| Banff | Best months | June to September, December to March | https://parks.canada.ca/pn-np/ab/banff/visit | 2026-11-04 |
| Torres del Paine | Airport and transfer | Puerto Natales (PNT), about 2 h by road | https://www.swoop-patagonia.com/blog/148047-puerto-natales-airport | 2026-11-04 |
| Torres del Paine | Time zone | UTC-3 | IANA tz `America/Punta_Arenas`: https://data.iana.org/time-zones/tzdb/southamerica; decree thread: https://mm.icann.org/pipermail/tz/2022-April/031372.html | 2026-11-04 |
| Torres del Paine | Best months | November to March | https://helpcenter.lastorres.com/en/help-center-las-torres-patagonia/best-times-of-year-to-visit | 2026-11-04 |
| Hallstatt | Airport and transfer | Salzburg (SZG), about 1 h by road | https://viatovia.com/blog/salzburg-airport-to-hallstatt | 2026-11-04 |
| Hallstatt | Time zone | UTC+1, UTC+2 in summer | IANA tz `Europe/Vienna`: https://data.iana.org/time-zones/tzdb/europe | 2026-11-04 |
| Hallstatt | Best months | May to June, September to October | https://www.hallstatt.net/ | 2026-11-04 |
| Lofoten | Airport and transfer | Harstad/Narvik Evenes (EVE), about 3 h by road to Svolvær | https://norwayexplained.com/how-to-get-from-harstad-narvik-evenes-airport-to-harstad-narvik-lofoten-and-vesteralen/ | 2026-11-04 |
| Lofoten | Time zone | UTC+1, UTC+2 in summer | IANA tz `Europe/Oslo` (a link to `Europe/Berlin`): https://data.iana.org/time-zones/tzdb/backward | 2026-11-04 |
| Lofoten | Best months | June to August, February to March | https://www.responsibletravel.com/holidays/lofoten-islands/travel-guide/best-time-to-visit-lofoten-islands | 2026-11-04 |
| Plitvice Lakes | Airport and transfer | Zagreb (ZAG), about 2 h by road | https://www.visit-croatia.co.uk/croatia-destinations/plitvice-lakes/getting-to-plitvice-lakes-national-park/ | 2026-11-04 |
| Plitvice Lakes | Time zone | UTC+1, UTC+2 in summer | IANA tz `Europe/Zagreb` (a link to `Europe/Belgrade`): https://data.iana.org/time-zones/tzdb/backward | 2026-11-04 |
| Plitvice Lakes | Best months | April to June, September to October | https://np-plitvicka-jezera.hr/en/ | 2026-11-04 |
| Queenstown | Airport and transfer | Queenstown (ZQN), about 15 min by road | https://www.newzealand.com/int/feature/queenstown-airport-new-zealand/ | 2026-11-04 |
| Queenstown | Time zone | UTC+12, UTC+13 in summer | IANA tz `Pacific/Auckland`: https://data.iana.org/time-zones/tzdb/australasia | 2026-11-04 |
| Queenstown | Best months | December to March, June to August | https://www.lonelyplanet.com/new-zealand/queenstown | 2026-11-04 |

## Weaker sources

These rows rest on travel guides or on official pages that describe the
seasons without naming months. Replace them with a primary source when one
turns up:

- Best months for Kyoto, Santorini, Zermatt, Porto, Istanbul, Marrakech,
  Prague, Banff, Hallstatt and Plitvice: the linked tourism-board page
  describes the seasons but does not state these months. The months are the common shoulder or dry season
  across travel guides. Amalfi Coast, Dubrovnik, Cape Town and Queenstown
  link a Lonely Planet destination page.
- Transfer times for Bali, Lago di Braies, Tulum, Marrakech, Hallstatt and
  Big Sur come from transfer companies and travel guides. They differ by
  10 to 30 minutes between sources.
- Puerto Natales (PNT) has domestic flights only, mostly in the October to
  April season. Out of season, use Punta Arenas (PUQ), about 3 h by road to
  Puerto Natales.
- A few pages (Kansai Airport, newzealand.com, Le Sirenuse, vietnamdrive.com,
  Medias24) block scripted requests (HTTP 403). Open them in a browser to
  check.
