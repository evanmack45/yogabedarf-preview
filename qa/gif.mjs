// Frames for the walkthrough GIF. Usage: node gif.mjs <url> <dir> <w> <h>
import { chromium } from 'playwright';
import { mkdirSync, rmSync } from 'fs';
const [url, dir, w, h] = process.argv.slice(2); rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ channel: 'chrome' }); const m = +w < 600;
const p = await b.newPage({ viewport: { width: +w, height: +h }, isMobile: m, hasTouch: m, deviceScaleFactor: 1 });
let i = 0; const shot = () => p.screenshot({ path: `${dir}/f${String(i++).padStart(4, '0')}.png` });
const hold = async (n, ms = 50) => { for (let k = 0; k < n; k++) { await shot(); await p.waitForTimeout(ms); } };
await p.goto(url, { waitUntil: 'networkidle' });
await hold(10);
await p.check('input[name=h][value="3"]'); await hold(8, 40);
await p.check('input[name=n][value="1"]'); await hold(6, 40);
await p.check('input[name=b][value="1"]'); await hold(10, 40);
await p.click('#start'); await hold(40, 30);
await p.click('#skip'); await hold(30, 30);
await p.click('#still'); await hold(10);
await p.click('#skip'); await p.click('#skip'); await hold(8);
await p.click('#skip'); await p.waitForTimeout(300); await hold(24, 60);
console.log(dir, i, 'frames'); await b.close();
