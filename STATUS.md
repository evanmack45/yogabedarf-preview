# yogabedarf.com STATUS

- State: Y1 art pass live on the noindex GitHub Pages preview (forward-fold masthead, stretch panels 1/2/4/5/6, rebuilt share card, og.jpg). Contrast fix from earlier today remains. Not on the custom domain. No DNS, Afternic or registrar change.
- Preview: https://evanmack45.github.io/yogabedarf-preview/
- Repo: https://github.com/evanmack45/yogabedarf-preview (Pages from main /docs, cname null)
- Last gate, 2026-11-25 7:25 AM CT (art wiring):
  - 390 + 1280 (qa/art-v1/): PASS, no P0/P1, Lighthouse performance 99 / accessibility 100 / best-practices 100, CLS 0, LCP 2.0 s, SEO 66 (intended noindex)
  - Impeccable: 0 findings at 390x844 and 1280x800 (qa/art-v1/impeccable-390.json, impeccable-1280.json)
  - Fold screenshots: qa/art-folds/fold-390.png, qa/art-folds/fold-1280.png
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
