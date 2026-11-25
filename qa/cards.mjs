// Saves sample result cards. Usage: node cards.mjs <url>
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
const base = process.argv[2] || 'http://localhost:8946/';
const b = await chromium.launch({ channel: 'chrome' });
for (const r of ['321', '000', '112', '211']) {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.clock.install(); await p.goto(`${base}#r=${r}`); await p.click('#start'); await p.clock.runFor(61000);
  const url = await p.evaluate(async () => (await window.__card()).toDataURL('image/png'));
  writeFileSync(`card-${r}${process.argv[3] || ''}.png`, Buffer.from(url.split(',')[1], 'base64')); await p.close();
}
await b.close();
