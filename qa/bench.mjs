import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
const b = await chromium.launch({ channel: 'chrome' }); const lines = [];
for (const [name, url] of [['stretchly', 'https://hovancik.net/stretchly/'], ['stretchclock', 'https://www.stretchclock.com/'], ['workrave', 'https://workrave.org/']]) {
  for (const [w, h] of [[390, 844], [1280, 800]]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, isMobile: w < 600 }); const host = new URL(url).hostname.replace(/^www\./, ''), hosts = new Set(); let n = 0;
    p.on('request', (r) => { const hh = new URL(r.url()).hostname; if (!hh.endsWith(host) && !r.url().startsWith('data:')) { hosts.add(hh); n++; } });
    try { await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 }); await p.waitForTimeout(4500); await p.screenshot({ path: `bench/${name}-${w}.png` }); if (w === 1280) lines.push(`${name} ${url} title="${await p.title()}" third-party requests ${n}, hosts ${hosts.size}: ${[...hosts].slice(0, 8).join(' ')}`); }
    catch (e) { lines.push(`${name} ${w} fail ${e.message.slice(0, 80)}`); }
    await p.close();
  }
}
writeFileSync('bench/third-party.txt', lines.join('\n') + '\n'); console.log(lines.join('\n')); await b.close();
