# yogabedarf.com STATUS

- State: Y1 art pass live on the noindex GitHub Pages preview (forward-fold masthead, stretch panels 1/2/4/5/6, rebuilt share card, og.jpg). Contrast fix from earlier today remains. Not on the custom domain. No DNS, Afternic or registrar change.
- Preview: https://evanmack45.github.io/yogabedarf-preview/
- Repo: https://github.com/evanmack45/yogabedarf-preview (Pages from main /docs, cname null)
- Last gate, 2026-11-25 7:36 AM CT (phone hero crop):
  - 390 + 1280 (qa/art-v2/): PASS, no P0/P1, Lighthouse performance 99 / accessibility 100 / best-practices 100, CLS 0, LCP 2.0 s, SEO 66 (intended noindex)
  - Impeccable: 0 findings at 390x844 and 1280x800 (qa/art-v2/impeccable-390.json, impeccable-1280.json)
  - Fold screenshots: qa/art-folds/fold-390.png (re-shot and viewed: whole figure and dial), qa/art-folds/fold-1280.png
- Phone hero: <picture> source img/hero-phone.webp (876×730 crop of the original fold-and-dial art). Desktop masthead unchanged.
- Art cuts: static dial not placed (live gauge stays); stretch panel 3 skipped (walk/stand).


- State: Y1 contrast fix live on the noindex GitHub Pages preview. Not on the custom domain. No DNS, Afternic or registrar change.
- Preview: https://evanmack45.github.io/yogabedarf-preview/
- Repo: https://github.com/evanmack45/yogabedarf-preview (Pages from main /docs, cname null)
- Commits: 789d1de (contrast fix in site-build/src/app.js and docs/app.js); follow-up commit for LOG, STATUS and QA.
- Last gate, 2026-11-25 6:45 AM CT:
  - 390 + 1440 (qa/live-v3/): PASS, no P0/P1, Lighthouse performance 100 / accessibility 100 / best-practices 100, CLS 0, LCP 1.2 s, SEO 60 (intended noindex)
  - 390 + 1280 (qa/live-v3-1280/): PASS, no P0/P1, Lighthouse 100/100/100, CLS 0, LCP 1.2 s, SEO 60
- impeccable: 0 findings on home (local and live), session and done, at 390x844 and 1280x800
- Contrast: small text on the red share-card band is now #081816 on #e2512e = 4.73:1 (was #173c36 on #e2512e = 3.14:1)
- Open risks:
  - Old #r= links resolve to the new v2 move set for the same answers
  - Hidden-tab timer proof is a simulated clock, not a real backgrounded tab
  - Shoulder rolls still reads as a plain sit in a still frame
  - og.png is still the v1 image
  - Source-list commas can wrap onto their own line on a narrow phone
  - Prices and go-live still wait on Dash / Evan; this preview stays noindex

## Start button in the first screen, 2026-11-25 10:11 AM CT

The start button is back in the first screen at 390×844 (bottom at 787 of 844). It also fits 375×812 naturally. On short phones (360×640, 375×667, and other phone widths with height ≤ 800) the button is pinned to the bottom of the viewport so it stays in the first screen, without shrinking the hero further.

How: the art-directed phone crop (figure + dial, `hero-phone.webp`, aspect 876/730) is kept, but on viewports under 900px it sits beside the title instead of in a full-width stack under it. Desktop masthead is unchanged. Gaps on phone are slightly tighter. Cited copy was not changed.

- Local e2e (qa/e2e.mjs): **174 passed, 0 failed**, including 360×640 and 375×667 (start in first screen, gloss near the top, no sideways scroll).
- Local gate (qa/fold-start/, Result PASS): Lighthouse **99 / 100 / 100 / SEO 66** (noindex), CLS 0, LCP 2.0 s. Impeccable 0 at 390, 1280 and static. Shots viewed (phone fold, desktop fold, reduced-motion).
- Extra short-phone shots (viewed): qa/fold-start/fold-360x640.png, fold-375x667.png, fold-375x812.png. art-folds/fold-390.png and fold-1280.png updated.

### Chest-opener art

The r3 painted pair does not match the cited NHS cue ("put your arms out to the sides… push your chest forward and up"). It shows hands clasped behind the back. Cropping cannot fix that. The stick SVG is the same side-view "arms reach back" idea, but a polished wrong pose would fight the copy, so the painted pair is unhooked and the stick pair is back on `#m-chest` and in the stage. Copy is unchanged. Requested as `Y1-r4-chest-opener` in ART-REQUESTS-r4.md (front or three-quarter view, arms clearly out to the sides). The webp files stay in `src/img/` unused.


## r3 art wired, live preview, 2026-11-25 10:05 AM CT

Wired from art/incoming/r3. Commit ec01754 (pushed to yogabedarf-preview, noindex kept, no DNS or go-live).

- Wired: chest opener, wrist circles and ankle stretch start/stretch pairs (`pose-*-512/1024.webp`, srcset, width 1024 height 740, aspect kept) in the `#moves` list (lazy, no fetchpriority) and in the stage still mode. Share PNG is now drawn on `share-ground.webp` (screenprint ground; number left of the figure, moves panel over the cream/band seam, CTA on the band). Canonical-URL fallback and the no-localhost assert kept.
- CUT, not wired: the neck pose. Dash says it is a chin-lift. The move is the cited NHS "turn your head toward your left shoulder"; no NHS or Mayo source for a chin-lift (only WebMD). The SVG pair and the copy stay. Options: re-do the pose as a head turn (ART-REQUESTS-r4 slot 1) or add a WebMD-cited chin-lift move.
- Caveats: the ground's red needle is static, so a low score (8%) sits under a needle pointing high (the old og crop did the same; the dial is cropped at the right edge, so no live needle could be overlaid). Chest art has the arms behind the back versus the "arms out to the sides" cue. The ankle art is subtle.
- Live e2e (qa/art-folds/r3/e2e-live.log): 114 pass, 1 fail. The one fail is "@390 start button in first screen (1147 of 844)", present before r3: it comes from the 7:36 AM phone hero crop. Not fixed; open item. Cards on four inputs, one odd link (#r=0120): 1080x1350, ground drawn, canonical footer.
- Live gate (qa/art-folds/r3/gate-live/, Result PASS): Lighthouse 100 / 100 / 100 / SEO 63 (noindex), CLS 0, LCP 1.2 s. Impeccable 0 at 390, 1280 and static. Local gate: qa/r3/gate-local (99, CLS 0).
- Live captures (viewed): qa/art-folds/r3/live-moves-{chest,wrist-circles,ankle}-{390,1280}.png, live-stage-still-{390,1280}.png, share-{r000,r321d,r322d,r0120-odd}.png (generated on the live page with window.__card()).

## Canonical share URL, 2026-11-25 8:29 AM CT

Share-card footer and copied links fall back to `https://evanmack45.github.io/yogabedarf-preview/` on localhost, 127.0.0.1, or file: URLs (switch to `https://yogabedarf.com/` at go-live).

