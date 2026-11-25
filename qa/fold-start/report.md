# Visual QA gate

Result: PASS (no P0)

## http://127.0.0.1:8946/ — phone
Load 542ms · frames p50 16.7ms p95 16.8ms · fonts "Bricolage Grotesque" / "Atkinson Hyperlegible Next" · canvases 0
- no issues
Shots: 127-0-0-1-8946__phone__fold.png, 127-0-0-1-8946__phone__scroll025.png, 127-0-0-1-8946__phone__scroll050.png, 127-0-0-1-8946__phone__scroll075.png, 127-0-0-1-8946__phone__scroll100.png, 127-0-0-1-8946__phone__full.png, 127-0-0-1-8946__phone__reduced-motion.png

## http://127.0.0.1:8946/ — desktop
Load 539ms · frames p50 16.7ms p95 16.7ms · fonts "Bricolage Grotesque" / "Atkinson Hyperlegible Next" · canvases 0
- no issues
Shots: 127-0-0-1-8946__desktop__fold.png, 127-0-0-1-8946__desktop__scroll025.png, 127-0-0-1-8946__desktop__scroll050.png, 127-0-0-1-8946__desktop__scroll075.png, 127-0-0-1-8946__desktop__scroll100.png, 127-0-0-1-8946__desktop__full.png, 127-0-0-1-8946__desktop__reduced-motion.png

## http://127.0.0.1:8946/ — lighthouse-mobile
Lighthouse: {"performance":99,"accessibility":100,"best-practices":100,"seo":66} LCP 2.0 s CLS 0 TBT 0 ms weight Total size was 205 KiB
- no issues

Human/AI review still required: look at every *__fold.png and *__scroll*.png. This gate catches breakage, not blandness.