// Makes site-build/src/og.png (1200x630) and a sample result card.
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.goto('http://localhost:8946/'); await p.waitForTimeout(400);
const og = await p.evaluate(async () => {
  const { svg, stills } = await import('./poses.js');
  await document.fonts.load('800 80px "Bricolage Grotesque"'); await document.fonts.load('400 30px "Atkinson Hyperlegible Next"');
  const cv = document.createElement('canvas'); cv.width = 1200; cv.height = 630; const x = cv.getContext('2d');
  x.fillStyle = '#e2eadf'; x.fillRect(0, 0, 1200, 630); x.fillStyle = '#173c36'; x.fillRect(0, 0, 1200, 14);
  x.fillStyle = '#173c36'; x.font = '800 104px "Bricolage Grotesque"'; x.fillText('Bedarf-o-', 70, 220); x.fillText('Meter', 70, 330);
  x.font = '400 34px "Atkinson Hyperlegible Next"'; x.fillText('Bedarf is German for need.', 74, 410); x.fillText('Three taps, then a gentle', 74, 470); x.fillText('60-second desk stretch.', 74, 515);
  const css = getComputedStyle(document.documentElement);
  const src = svg(stills('chest')[1]).replace('<svg', `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="484"`).replace('</svg>', '<style>line{stroke-linecap:round}.body line,.neck{stroke:#173c36;stroke-width:9}.head{fill:#e2eadf;stroke:#173c36;stroke-width:7}.nose{fill:#e2512e}.chair rect{fill:#c9cf7d}.chair line{stroke:#3f5a53;stroke-width:5}.floor{stroke:#3f5a53;stroke-width:3;stroke-dasharray:2 8}</style></svg>');
  const im = new Image(); im.src = 'data:image/svg+xml,' + encodeURIComponent(src); await im.decode();
  x.fillStyle = '#f6f9f3'; x.strokeStyle = '#173c36'; x.lineWidth = 6; x.beginPath(); x.roundRect(690, 70, 450, 490, 30); x.fill(); x.stroke();
  x.drawImage(im, 695, 76, 440, 484);
  return cv.toDataURL('image/png');
});
writeFileSync('../site-build/src/og.png', Buffer.from(og.split(',')[1], 'base64'));
await p.check('input[name=h][value="2"]'); await p.check('input[name=n][value="1"]'); await p.check('input[name=b][value="1"]');
await p.click('#start'); for (let i = 0; i < 4; i++) await p.click('#skip');
const card = await p.evaluate(async () => (await window.__card()).toDataURL('image/png'));
writeFileSync('card.png', Buffer.from(card.split(',')[1], 'base64'));
await b.close(); console.log('ok');
