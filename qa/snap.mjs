// Static HTML of the session and done states in docs/qa-snap/ for impeccable. Not deployed.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const fix = (s) => s.replaceAll('href="style.css"', 'href="../style.css"').replaceAll('url(fonts', 'url(../fonts');
const strip = () => p.evaluate(() => { document.querySelectorAll('script').forEach((s) => s.remove()); return '<!doctype html>' + document.documentElement.outerHTML; });
mkdirSync('../docs/qa-snap', { recursive: true });
await p.clock.install(); await p.goto('http://localhost:8946/'); await p.check('input[name=h][value="2"]'); await p.click('#start'); await p.clock.runFor(2500);
writeFileSync('../docs/qa-snap/session.html', fix(await strip()));
await p.goto('http://localhost:8946/'); await p.check('input[name=n][value="1"]'); await p.click('#start'); for (let i = 0; i < 4; i++) await p.click('#skip');
writeFileSync('../docs/qa-snap/done.html', fix(await strip()));
await b.close();
