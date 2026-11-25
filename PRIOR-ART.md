# Prior art for Y1 Bedarf-o-Meter (2026-11-25)

## GitHub (gh search, read 2026-11-25)
- hovancik/stretchly: 6,663 stars, BSD-2, pushed 2026-11-23. A desktop break-reminder app you have to install.
- rcaelers/workrave: 1,855 stars, GPL-3. A desktop break and RSI app.
- slgobinath/safeeyes: 1,781 stars, GPL-3. A desktop app for eye-strain breaks.
- rookwood101/stretch-break-web: BSD-2. A Firefox extension inspired by stretchly.
- wolfdenpublishing/stretchtimer (MIT) and oberprah/stepwise. Tiny stretch-routine timers with no guidance or sources.

Decision: build our own. None of these is a no-install web page with a score and cited, gentle seated moves, and the page is small.

## X (full-archive search)
- https://x.com/345marcel/status/2117301702088937749 (2026-11-02): 90,223 views and 2,972 likes for "Every evening go through these 4 stretches". People share short stretch sets.
- https://x.com/amypeniston/status/1998134275150065722: "shoulders, neck & back tight from sitting all day? here are my TOP 5 *seated* stretches". Same three body areas as our taps.
- https://x.com/ruvugiro15379/status/2055533350429901113 (3,296 views): "Sitting all day killing your glutes?"
- Pitch evidence (Magpie, Foil-verified):
  - stretchly at 6,663 stars
  - r/yoga "isn't crumbling" post, 1,523 score (2026-10-17)
  - r/InternetIsBeautiful stretch guides, 5,184 score (2015)

## Benchmarks (screens in qa/bench/ at 390 and 1280; third-party counts in qa/bench/third-party.txt)
| Site | What it does well | Cost to the user |
|---|---|---|
| StretchClock (stretchclock.com) | The best match: a browser break reminder with guided desk exercises | Pricing, account, "See Pricing" as the main button; 10 third-party requests |
| Stretchly (hovancik.net/stretchly) | Well loved, open source | Desktop install; reminds you but does not coach the stretch |
| Workrave (workrave.org) | Long-running RSI breaks | Desktop install; 6 third-party requests (Font Awesome, Google Fonts, jsDelivr) |

Best prior art: StretchClock.

Where the Bedarf-o-Meter beats it:
- No install, no account, no price, no camera or mic, and 0 third-party requests (checked in e2e).
- A score in 3 taps, as the pitch asks, sized to neck, back and hours sitting.
- A shareable result card PNG and a link that sets the same answers for a coworker.
- Each move links its NHS or Mayo Clinic source on the page, and the safety line stays visible during the session.
- A still-pictures mode that turns on by itself when reduced motion is set.

Where it loses: StretchClock has 100+ exercises and real reminders. We have 7 moves and no reminder.
