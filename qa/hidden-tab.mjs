// Simulates a background tab during a session: browsers stop requestAnimationFrame
// while hidden, then resume it. The timer must still show the right move and seconds.
// Usage: node hidden-tab.mjs <url>. Exported for e2e.mjs.
import { chromium } from 'playwright';
export async function hiddenTab(b, base, away = 20000) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.clock.install(); await p.goto(base + '#r=000'); await p.waitForTimeout(200);
  await p.click('#start'); await p.clock.runFor(1000);
  await p.evaluate(() => {
    const real = window.requestAnimationFrame.bind(window); window.__q = []; window.__real = real;
    window.requestAnimationFrame = (cb) => { window.__q.push(cb); return 0; };
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await p.clock.fastForward(away);
  await p.evaluate(() => {
    window.requestAnimationFrame = window.__real;
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
    window.__q.forEach((cb) => requestAnimationFrame(cb)); window.__q = [];
  });
  await p.clock.runFor(300);
  const out = { count: await p.textContent('#count'), secs: await p.textContent('#secs'), done: await p.isVisible('#done') };
  await p.context().close();
  return out;
}
if (process.argv[1].endsWith('hidden-tab.mjs')) {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const away of [20000, 70000]) console.log(`away ${away / 1000} s after 1 s:`, JSON.stringify(await hiddenTab(b, process.argv[2], away)));
  await b.close();
}
