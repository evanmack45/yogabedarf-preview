# Visual QA gate

Result: PASS (no P0)

## http://localhost:8946/ — phone
Load 546ms · frames p50 16.7ms p95 16.7ms · fonts "Bricolage Grotesque" / "Atkinson Hyperlegible Next" · canvases 0
- no issues
Shots: localhost-8946__phone__fold.png, localhost-8946__phone__scroll025.png, localhost-8946__phone__scroll050.png, localhost-8946__phone__scroll075.png, localhost-8946__phone__scroll100.png, localhost-8946__phone__full.png, localhost-8946__phone__reduced-motion.png

## http://localhost:8946/ — desktop
Load 553ms · frames p50 16.7ms p95 16.8ms · fonts "Bricolage Grotesque" / "Atkinson Hyperlegible Next" · canvases 0
- no issues
Shots: localhost-8946__desktop__fold.png, localhost-8946__desktop__scroll025.png, localhost-8946__desktop__scroll050.png, localhost-8946__desktop__scroll075.png, localhost-8946__desktop__scroll100.png, localhost-8946__desktop__full.png, localhost-8946__desktop__reduced-motion.png

## http://localhost:8946/ — lighthouse-mobile
Lighthouse: {"performance":99,"accessibility":100,"best-practices":100,"seo":66} LCP 2.0 s CLS 0 TBT 0 ms weight Total size was 208 KiB
- no issues

Human/AI review still required: look at every *__fold.png and *__scroll*.png. This gate catches breakage, not blandness.