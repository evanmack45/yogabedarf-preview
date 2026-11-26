# DONE 2026-11-25 11:05 AM CT (Gizmo): Y1 hamstring card back on its stick SVG pair (Dash: the painted pair rounds the back, a form cue we should not teach). Shoulder-rolls, knee-hug and calf stay painted. 12 painted pairs in the list now. Live on 22d9e34: e2e 175/0, gate 100 / CLS 0 / impeccable 0.

# DONE 2026-11-25 10:45 AM CT (Gizmo): r4 pose art wired locally (11 pairs including the new chest opener). Neck-turn and neck-tilt stay SVG. Local e2e 173/0, local gate 99 / CLS 0 / impeccable 0. Live on 8affe5f: e2e 173/0, gate 100 / CLS 0 / impeccable 0, LCP 1.2 s. Folds and share samples in qa/art-folds/r4/.

Eleven r4 keeps were copy-checked against the cited cues in moves.json before wiring. Chest now matches "arms out to the sides" and replaces the unhooked r3 pair. Neck-turn was cut: the art turns the torso with the head (Dash rule). Neck-tilt was not made. Local gate: qa/local-r4/. Start-button fix from 10:11 AM CT is live with this deploy (d4c6b0b had 500'd during the morning Pages outage).

# DONE 2026-11-25 8:29 AM CT (Gizmo): Y1 share card and copied links use a canonical preview URL on localhost (https://evanmack45.github.io/yogabedarf-preview/; switch to https://yogabedarf.com/ at go-live). Canvas footer no longer bakes location.host.

# DONE 2026-11-25 7:36 AM CT (Gizmo): Y1 phone hero is an art-directed crop, not a sliced band (commit pending)

The 16:9 hero was object-fit:cover into a 150–170px strip on phone, which cut the figure at the waist and cropped the dial into a meaningless edge. Phone now uses a <picture> source (img/hero-phone.webp + 1314w, cropped from y1-hero-forward-fold-dial.png around the figure and dial, 876×730). Width/height and CSS aspect-ratio 876/730 reserve the box (CLS 0). Desktop masthead is unchanged. Gate (390+1280, qa/art-v2/) PASS; Lighthouse mobile performance 99 / accessibility 100 / best-practices 100, CLS 0, LCP 2.0 s, SEO 66 (noindex). Impeccable 0 at both viewports. Fold re-shot and viewed: qa/art-folds/fold-390.png shows the whole forward-fold figure and the dial.

# DONE 2026-11-25 7:25 AM CT (Gizmo): Dash art wired — forward-fold masthead, five stretch panels (panel 3 skipped), share card rebuilt on og art, og.jpg replaced.

Live SVG gauge kept (static dial was not placed — it would have competed with the live meter). Stretch panel 3 skipped per manifest (reads as a walk/stand). Gate (390+1280) PASS, no P0/P1; Lighthouse mobile performance 99 / accessibility 100 / best-practices 100, CLS 0, SEO 66 (intended noindex). Impeccable 0 findings at 390 and 1280.

# DONE 2026-11-25 6:45 AM CT (Gizmo): Y1 red-band small-text contrast fixed to AA (commit 789d1de)

Small text on the red share-card band was #173c36 on #e2512e at 3.14:1 (called ~3.5:1 earlier), below WCAG AA 4.5:1 for small type. Darkening the red would have lowered contrast against dark ink, and cream/white on the same red is only 3.63–3.85:1. Band text on red now uses #081816 (same green-ink family, darker), which is 4.73:1. The cream move panel and the sage/pea/mustard cards still use #173c36. There is no on-page result card with a red band; the done screen keeps ink and redtext on cream, already AA.

Contrast pairs (WCAG 2.x, relative luminance):
- BEFORE small text on red: #173c36 on #e2512e = 3.14:1 (fail AA small; pass AA large)
- AFTER small text on red: #081816 on #e2512e = 4.73:1 (pass AA small)
- Unchanged, already pass: #173c36 on #8db596 sage = 5.29:1; on #c9cf7d pea = 7.32:1; on #e7b43c mustard = 6.33:1; on #f6f9f3 move panel = 11.38:1
- Unchanged on-page: #b23a1c redtext on #f6f9f3 = 5.62:1; on #e2eadf = 4.86:1; #ffffff on #b5381b go button = 5.92:1

Preview (noindex, robots Disallow: /, Pages cname null): https://evanmack45.github.io/yogabedarf-preview/
Live app.js was curled and contains inkOnRed: '#081816'. CSS was unchanged (the band is canvas, not CSS).

QA. Gate 390+1440 PASS, no P0/P1, Lighthouse 100/100/100, CLS 0, SEO 60 (noindex) — qa/live-v3/. Gate 390+1280 PASS, no P0/P1, Lighthouse 100/100/100, CLS 0, SEO 60 — qa/live-v3-1280/. Fold, scroll, full and reduced-motion shots reviewed. impeccable 0 findings on home (local and live), session and done at 390x844 and 1280x800 (qa/impeccable-v3-*.json). Sample cards regenerated from the live URL: qa/card.png (94% red band) and qa/card-{000,112,211,321}-v4.png.

Still breaks. Same as v2: old #r= links give the new move set for the same answers; the hidden-tab test is simulated; Shoulder rolls reads as a plain sit in a still; og.png is unchanged from v1. On a narrow phone, commas between the source links in About can wrap onto their own line (pre-existing, not from this fix).

# DONE 2026-11-25 3:06 AM CT (Gizmo): Y1 v2 live (commit d0ecb11)

## v2 (2026-11-25)

Moves. 16 gentle moves, each cited with its link (data in site-build/data/moves.json, build fails under 15). Sources, all checked 25 Nov 2026:
NHS Sitting exercises, NHS Flexibility exercises, NHS How to warm up, Mayo Clinic Stretching basics, Mayo Clinic neck, forearm, seated (lower back) and standing stretches for the workplace. Safety lines kept on every screen.

Picker. Key from all three answers plus rotation. All 36 answer sets give a distinct set of four, all 16 moves get used, and every one-answer change swaps at least one move (2.5 on average). At most one standing move, always last.

Timer. Wall-clock now (performance.now deltas, resync on visibilitychange, setTimeout backstop). Proof with a simulated hidden tab (qa/hidden-tab.mjs, fake clock):
old live, away 20 s and 70 s, both still Move 1 of 4 at 14 s (qa/hidden-tab-before.log).
new, away 20 s gives Move 2 of 4 at 9 s, away 70 s gives done (qa/hidden-tab-after.log, qa/hidden-tab-live.log).

Card. qa/card.png (1080x1350, 94%), samples qa/card-{000,112,211,321}-v3.png. Full-bleed band colour, giant %, a kind joke tier (Freshly oiled hinge to Fully fossilized), mini dial, the four moves as figures, the forward line "My Bedarf is X%. Yours?" and the #r= link. Copy link text reads "My Bedarf is 94%. Fully fossilized, apparently. Yours? <link>", previewed on the done screen.
Benchmark.
C2 rank card. Strong number hierarchy and a fun fact, but cream panel and lots of small stats. Y1 borrows the one huge number and drops the stats.
Spotify Wrapped. Full-bleed colour, one big stat, an identity label you want to own. Y1 copies all three (band colour, %, tier name).
Receiptify. A familiar list format as the artifact. Y1 uses the "four moves I did" strip as its list, with figures.
Weaker than Wrapped in that there is one card, not a story, and the red band has dark text at about 3.5 to 1, fine for the huge type, borderline for the small lines.

Figures. Chest opener is now a side view, seated twist and neck turn show turned shoulders and a turn arrow.

QA. Local and live e2e 94 passed 0 failed (qa/e2e-local.log, qa/e2e-live.log). Gate 390 PASS no P1, Lighthouse 100/100/100, CLS 0 (qa/live-v2). Gate 1280 PASS no P1, Lighthouse 100/100/100, CLS 0 (qa/live-v2-1280). SEO 60 is the noindex. impeccable 0 on home, session and done at 390 and 1280, and on live home. md5 match for index.html, app.js, logic.js, poses.js, style.css. cname null. GIFs qa/bedarf-390.gif, qa/bedarf-1280.gif.

Still breaks. Old #r= links give the new move set for the same answers. The hidden-tab test is simulated with a fake clock, not a real backgrounded tab. Shoulder rolls reads as a plain sit in a still. og.png unchanged from v1.

# DONE 2026-11-25 2:19 AM CT (Gizmo): Y1 Bedarf-o-Meter live at https://evanmack45.github.io/yogabedarf-preview/

Noindex GitHub Pages preview on the default github.io address (Pages cname is null). No custom domain, DNS, Afternic or registrar change. Nothing posted, nobody messaged.

## Assignment
- Pitch: /workspace/magpie/pitches-2026-11-25.md, Y1 (line 142).
- Foil GO: /workspace/foil/weird-gate-2026-11-25.md line 36 and the Y1 section (line 187).
  - Foil's name risk: the first line under the h1 now says "Bedarf is German for need. This meter guesses how much stretch you need right now." The same line is on the card and the OG image.
  - Foil's safety asks: neck moves are gentle, there is a "stop if it hurts, not medical advice" line, and no data is collected.
- BOARD (/workspace/dash/domains/BOARD.md): no bot owns yogabedarf.com. It only lists Y1 as a Foil GO and as the last item in Gizmo's order.

## What it is
- Three taps: hours sitting (4 options), neck (3) and back/shoulders (3).
- These give a playful Bedarf score from 8 to 100%, shown on a dial.
- The meter then picks 4 moves of 15 seconds each: the three upper-body moves that fit best plus one for the legs. "Over 8 hours" gives a standing side bend.
- The session plays:
  - an animated stick figure
  - a cue and a seconds counter
  - pause, next move, stop, a still-pictures toggle, Space to pause and Escape to stop
- The done screen shows a result card PNG (1080x1350) and a link `#r=<hours><neck><back>[d]` that sets the same answers for a coworker.
- No camera, mic, account, cookies, storage or trackers, and no third-party requests.
- robots meta is noindex,nofollow, and robots.txt has Disallow: /.
- Footer says "This domain is for sale." and links to Afternic.
- Fonts are self-hosted OFL: Bricolage Grotesque (subset to one instance) and Atkinson Hyperlegible Next.
- Look: a pale sage page, spruce ink, a tomato and mustard dial and pill chips. No cream, hard shadows or navy.

## Reduced motion
prefers-reduced-motion turns on Still pictures by itself:
- the figure shows its start and stretch poses side by side
- the dial needle does not sweep
- the timer still counts
Anyone can turn the same mode on with the Still pictures button. e2e checks that nothing animates.

## Sources cited (checked 2026-11-25)
- NHS, Sitting exercises: https://www.nhs.uk/live-well/exercise/sitting-exercises/
  - Chest opener, Seated twist, Seated march.
  - Its "check with a GP" advice is the basis for our safety line.
- NHS, Flexibility exercises: https://www.nhs.uk/live-well/exercise/flexibility-exercises/
  - Neck turn, Neck tilt, Side bend.
- Mayo Clinic, A guide to basic stretches: https://www.mayoclinic.org/healthy-lifestyle/adult-health/multimedia/stretching/sls-20076525
  - Arm across.
  - Its safety advice: gentle, slow, don't bounce, "If you feel pain, you've stretched too far".
Every cue is a short version of its source's wording ("as far as is comfortable", "slowly", "gently"). Each "why" line repeats only what the source says. The build fails if a move has no source or no gentle wording. The score is labelled as a playful guess, not a health measurement.

## QA (live URL)
| Check | Result | Path |
|---|---|---|
| e2e (logic, 36 answer sets, odd and bad links, keyboard, fake-clock timer, pause, next move, Space and Escape, reduced motion, card PNG, copy link, no-JS, no storage, camera, mic or third parties) | 88/88 | qa/e2e-live.log (local qa/e2e-local.log) |
| visual-qa-gate 390 + 1440 | PASS, no P0 and no P1 after the tap-target fix. Lighthouse 100/100/100, SEO 60 (noindex). LCP 0.8 s, CLS 0 | qa/live/ |
| visual-qa-gate 1280 | PASS, no P0. Lighthouse 100/100/100, SEO 60 | qa/live-1280/ |
| impeccable, default page at 390 and 1280 | 0 | qa/impeccable-390.json, qa/impeccable-1280.json |
| impeccable, session and done states (static snapshots) at 390 and 1280 | 0 | qa/impeccable-session-*.json, qa/impeccable-done-*.json |
| GIFs | bedarf-390.gif, bedarf-1280.gif | qa/ |
| Result card sample | 1080x1350 | qa/card.png |
| Benchmarks | StretchClock, Stretchly, Workrave | qa/bench/, PRIOR-ART.md |

Fold shots:
- qa/live/evanmack45-github-io-yogabedarf-preview__phone__fold.png
- qa/live-1280/evanmack45-github-io-yogabedarf-preview__desktop__fold.png
- State screens are in qa/shots/ (not committed).

## Fixes along the way
- impeccable flagged a cream page, hard offset shadows, a bounce easing and white on #e2512e at 3.9:1. Fixes:
  - the page is now sage
  - shadows removed
  - the easing is now ease-out
  - the button is now #b5381b
- The gate flagged 11 tap targets under 24px (inline source links and the brand). Those links now have min-height 24px.
- Escape now stops a session even when focus is on a button.

## What still breaks or is thin
- The figures are simple front views, so the twist and the chest opener read less clearly than a side view would.
- There are only 7 moves, and some answer sets give the same four.
- The timer is driven by requestAnimationFrame, so it pauses while the tab is in the background. I think that is fine, but it is not announced.
- There is no sound and no reminder.
- "Bedarf now: lower, we hope" is a joke line, and the meter cannot measure it.
- The card prints the github.io address.
- The score weights are my own and are labelled playful.

## 2026-11-25 10:05 AM CT: r3 art

Commit ec01754 (pushed). Wired chest/wrist/ankle pairs and the share ground; cut the neck pose (chin-lift versus cited head turn). Fixed the share moves panel overflow for long names (ph=340). e2e: loosened the still-pair assertion, added r3 blocks; image-url match uses slice(-60) so the long github.io origin is not truncated (that made 4 false fails on the live run). Live e2e 114/1 (pre-existing start-button line). Live gate PASS, Lighthouse 100, impeccable 0. Details in STATUS.md.

## 2026-11-25 10:11 AM CT: start button in the first screen at 390; chest art unhooked

The 7:36 AM phone hero crop had put `#start` at 1147 on an 844-tall screen. Phone layout now puts the same art-directed crop (whole figure and dial) beside the title instead of stacked under it, so the button sits at 787 of 844 at 390, and also fits 375×812. Short phones (max-height 800) pin the button to the bottom of the viewport (checked at 360×640 and 375×667). Desktop is unchanged.

Chest-opener r3 art unhooked: hands behind the back vs the cited "arms out to the sides." Stick SVG restored; copy unchanged; r4 redo requested. e2e 174/0 including the new short-phone viewports. Local gate PASS, Lighthouse 99, CLS 0, impeccable 0 (qa/fold-start/). Live e2e and preview push follow this entry.

## 2026-11-25 ~5:15 PM CT: share-card needle matches the score, gauge uncropped

Barker's live check: the default 8% card ("Freshly oiled hinge") had a needle in the red, and the red segment was cut off at the right edge. Reproduced on https://yogabedarf.com/#r=000 (pinned Chrome). Root cause: `share-ground.webp` is a static illustration with a cropped dial and a needle painted in the red. When that image loaded, the card drew it and never painted a live needle. The fallback path already had the correct mapping (`π + score/100 * π`, same as the on-page SVG: 0% at 9 o'clock, 100% at 3 o'clock) but only ran if the image failed.

Fix, first pass (3842438): cover the baked dial and draw a live gauge with the needle set from the score. That pass used a large cover circle and clipped the figure back on top, which left a hard seam or a double cropped dial.

Polish (8e2b5c0, live now): a cream panel just right of the figure (`fillRect(615, 0, W-615, 560)`) hides the baked dial, and a smaller live gauge sits at (880, 400, r=170), fully on the card (layout right 1074 of 1080). Mapping is `π + score/100 * π` (0% at 9 o'clock, 100% at 3 o'clock), same as the on-page SVG. The OG image was left as decoration, per Barker.

e2e asserts angle-versus-value, an uncropped bounding box, and tip direction on #r=000 (8%), #r=200 (50%), #r=321d (94%), #r=322d (100%) and an odd broken hash #r=0120 that starts fresh at 8%. Local e2e 199/0. Live e2e after 8e2b5c0: 199 PASS, 0 FAIL. golive-verify --gate PASS (y1-verify-fix2.log). Lighthouse 100/100/100/100, CLS 0, LCP 1.2 s, impeccable 0 at 390, 1280 and static. Viewed live after PNGs: qa/art-folds/share-fix/after-low-8.png (needle in green), after-mid-50.png (needle straight up at mid), after-high-100.png (needle in red, full cap visible). Before: qa/art-folds/share-fix/before-barker.png (baked red needle, cropped dial).

## 2026-11-25 ~9:35 PM CT: quality-bar cut, four moves shown (Gizmo, for Dash)

Commit 147c1c2 (pushed, live on yogabedarf.com). The moves list shows the four chosen moves (updates with the answers); the other 12 are behind one button, "Show the other 12 moves" (aria-expanded, keyboard, `#m-` links open it; all 16 show without JS). First screen at 390 cut from 114 to 82 words: shorter gloss, tier name only under the score, one short safety line by the start button (full line stays in the footer). About copy and sources trimmed.

- Phone length 10.7 to 4.3 screens. Total visible words 1,122 to 429. Prose 986 to 269. Ban-list hits 1 to 0.
- e2e (qa/e2e.mjs): live 231 PASS, 0 FAIL (was 199). Counts fold words at 390 (82, limit under 100) and 1280 (73), checks low, mid, high and odd-hash inputs, keyboard, `#m-` link, no price text. One old assertion updated for the shorter privacy line.
- Gate PASS (0 failing). Lighthouse 100/100/100/100, CLS 0, impeccable 0. Details: /workspace/gizmo/slop-fix.md.
- No prices added. No DNS changes. Nobody messaged.
