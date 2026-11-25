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
