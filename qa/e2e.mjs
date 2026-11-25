// End-to-end checks for the Bedarf-o-Meter. Usage: node e2e.mjs <base url>
import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { hiddenTab } from './hidden-tab.mjs';
const base = process.argv[2] || 'http://localhost:8946/';
const origin = new URL(base).origin;
const L = await import(new URL('../site-build/src/logic.js', import.meta.url));
const data = JSON.parse(readFileSync(new URL('../site-build/data/moves.json', import.meta.url)));
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('ok  ', m); } else { fail++; console.log('FAIL', m); } };
const b = await chromium.launch({ channel: 'chrome' });

// Logic
const all = []; for (let h = 0; h < 4; h++) for (let n = 0; n < 3; n++) for (let bb = 0; bb < 3; bb++) all.push({ h, n, b: bb });
ok(all.every((a) => { const s = L.bedarf(a); return s >= 0 && s <= 100; }) && L.bedarf({ h: 3, n: 2, b: 2 }) === 100 && L.bedarf({ h: 0, n: 0, b: 0 }) === 8, 'score stays 0 to 100, max 100, min 8');
const LEGS = ['ankle', 'march', 'knee-hug', 'hamstring', 'side-bend', 'calf', 'quad'];
ok(data.moves.length >= 15, `${data.moves.length} moves (15 or more)`);
ok(all.every((a) => { const p = L.pickMoves(a); return p.length === 4 && new Set(p).size === 4 && p.some((id) => LEGS.includes(id)) && p.filter((id) => L.STANDING.includes(id)).length <= 1; }), 'every answer set gives 4 distinct moves, at least one for the legs, at most one standing');
ok(new Set(all.map((a) => L.pickMoves(a).join())).size === 36, 'all 36 answer sets get a different set of four');
{ let pairs = 0, same = 0, changed = 0; for (const a of all) for (const k of ['h', 'n', 'b']) for (let v = 0; v < (k === 'h' ? 4 : 3); v++) { if (v === a[k]) continue; const A = L.pickMoves(a), C = L.pickMoves({ ...a, [k]: v }); const d = A.filter((x) => !C.includes(x)).length; pairs++; changed += d; if (!d) same++; }
  ok(same === 0, `changing any one answer swaps at least one move (${pairs} changes, ${(changed / pairs).toFixed(1)} moves swapped on average)`); }
ok(all.every((a) => L.pickMoves(a).every((id, i, p) => !L.STANDING.includes(id) || i === p.length - 1)), 'a standing move always comes last');
const used = new Set(all.flatMap((a) => L.pickMoves(a))); ok(used.size === data.moves.length, `all ${data.moves.length} moves can be picked`);
for (const h of ['#r=', '#r=4', '#r=400', '#r=033', '#r=0000', '#r=012x', '#r=012dd', '#r=-12', '#garbage', '#r=0 1 2', '#R=012']) ok(L.decode(h) === null, `decode rejects ${h}`);
ok(all.every((a) => JSON.stringify(L.decode('#' + L.encode(a, true))) === JSON.stringify({ a, done: true })), 'encode and decode round-trip for all 36 answer sets');
ok(data.moves.every((m) => /comfortable|gently|slowly|few slow breaths/i.test(m.cue) && data.sources[m.source]), 'every cue is gentle and cites a source');

async function page(w, h, opts = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 600, hasTouch: w < 600, acceptDownloads: true, ...opts });
  await ctx.addInitScript(() => { window.__media = 0; if (navigator.mediaDevices) navigator.mediaDevices.getUserMedia = () => { window.__media++; return Promise.reject(new Error('blocked')); }; });
  const p = await ctx.newPage(); p.errs = []; p.foreign = [];
  p.on('pageerror', (e) => p.errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && p.errs.push(m.text()));
  p.on('request', (r) => { const u = r.url(); if (!u.startsWith(origin) && !/^(data|blob):/.test(u)) p.foreign.push(u); });
  return p;
}

for (const [w, h] of [[390, 844], [360, 640], [375, 667], [1280, 800]]) {
  const tag = `@${w}`, p = await page(w, h);
  await p.clock.install();
  await p.goto(base); await p.waitForTimeout(300);
  ok((await p.locator('meta[name=robots]').count()) === 0, `${tag} no noindex meta (the live site may be indexed)`);
  ok((await p.getAttribute('.foot a', 'href')) === 'https://www.afternic.com/domain/yogabedarf.com' && /for sale/.test(await p.textContent('.foot')), `${tag} for-sale footer`);
  const gl = await p.locator('.gloss').boundingBox();
  ok(/Bedarf is German for need/.test((await p.textContent('.gloss')).replace(/\s+/g, ' ')) && gl.y < h * 0.4, `${tag} "Bedarf is German for need" near the top (y ${Math.round(gl.y)})`);
  const st = await p.locator('#start').boundingBox();
  ok(st.y + st.height <= h, `${tag} start button in first screen (${Math.round(st.y + st.height)} of ${h})`);
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${tag} no sideways scroll`);
  ok((await p.textContent('#score')) === '8' && /Low Bedarf/.test(await p.textContent('#band')), `${tag} starts at 8%, Low Bedarf`);
  ok(/Stop if anything hurts/.test(await p.textContent('#setup')) && /not medical advice/.test(await p.textContent('#setup')), `${tag} safety line by the start button`);

  // answers
  await p.check('input[name=h][value="3"]');
  ok((await p.textContent('#score')) === '62' && /High Bedarf/.test(await p.textContent('#band')) && /Side bend/.test(await p.textContent('#plan')), `${tag} over 8 hours gives 62%, High, adds the standing side bend`);
  await p.check('input[name=n][value="2"]'); await p.check('input[name=b][value="2"]');
  ok((await p.textContent('#score')) === '100' && /Maximum/.test(await p.textContent('#band')) && new URL(p.url()).hash === '#r=322', `${tag} all maxed gives 100% and #r=322`);
  // keyboard on radios
  await p.focus('input[name=b][value="2"]'); await p.keyboard.press('ArrowLeft');
  ok((await p.inputValue('input[name=b]:checked')) === '1' && (await p.textContent('#score')) === '94', `${tag} arrow keys change an answer (94%)`);

  // session with a fake clock
  await p.click('#start'); await p.clock.runFor(300);
  ok(await p.isVisible('#session') && (await p.textContent('#count')) === 'Move 1 of 4', `${tag} start opens move 1 of 4`);
  ok(/Stop if anything hurts/.test(await p.textContent('#session')), `${tag} safety line during the session`);
  const plan = L.pickMoves({ h: 3, n: 2, b: 1 }).map((id) => data.moves.find((m) => m.id === id));
  ok((await p.textContent('#mname')) === plan[0].name && (await p.getAttribute('#msrc', 'href')) === data.sources[plan[0].source].url, `${tag} move shows its name and cited source`);
  const svgA = await p.innerHTML('#stage'); await p.clock.runFor(2700); const svgB = await p.innerHTML('#stage'); await p.clock.runFor(4100);
  ok((await p.textContent('#secs')) === '8' && svgA !== svgB, `${tag} after 7 s: 8 seconds left and the figure moved`);
  await p.click('#pause'); await p.clock.runFor(5000);
  ok((await p.textContent('#secs')) === '8' && (await p.textContent('#pause')) === 'Resume', `${tag} pause holds the clock`);
  await p.click('#pause'); await p.clock.runFor(8500);
  ok((await p.textContent('#count')) === 'Move 2 of 4' && (await p.textContent('#mname')) === plan[1].name, `${tag} timer moves on to move 2 after 15 s`);
  await p.click('#skip');
  ok((await p.textContent('#count')) === 'Move 3 of 4', `${tag} next move skips ahead`);
  await p.click('#still');
  ok((await p.getAttribute('#still', 'aria-pressed')) === 'true' && (await p.locator('#stage .pair svg').count() === 2 || await p.locator('#stage .pair.art img').count() === 1), `${tag} still pictures shows start and stretch side by side (drawn pair or one art picture)`);
  await p.evaluate(() => document.activeElement.blur()); await p.keyboard.press('Space'); const s1 = await p.textContent('#secs'); await p.clock.runFor(3000);
  ok((await p.textContent('#pause')) === 'Resume' && (await p.textContent('#secs')) === s1, `${tag} space bar pauses`);
  await p.keyboard.press('Space');
  await p.clock.runFor(31000);
  ok(await p.isVisible('#done') && /100%|94%/.test(await p.textContent('#d-score')) && new URL(p.url()).hash === '#r=321d', `${tag} 60 seconds end on the done screen with #r=321d`);
  ok(await p.locator('#done-meter .meter').count() === 1, `${tag} done screen shows the meter`);
  // save card
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#save')]);
  const buf = readFileSync(await dl.path());
  ok(dl.suggestedFilename() === 'bedarf-94.png' && buf.readUInt32BE(16) === 1080 && buf.readUInt32BE(20) === 1350, `${tag} result card PNG 1080x1350 (${dl.suggestedFilename()})`);
  await p.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
  await p.click('#copy'); await p.clock.runFor(100);
  const clip = await p.evaluate(() => navigator.clipboard.readText().catch(() => ''));
  ok((/^My Bedarf is 94%\. Fully fossilized, apparently\. Yours\? http/.test(clip) && clip.endsWith('#r=321d')) || /Copy this and send it on/.test(await p.textContent('#msg')), `${tag} copy gives a share line plus the link (${clip})`);
  await p.click('#again');
  ok(await p.isVisible('#setup') && new URL(p.url()).hash === '#r=321', `${tag} measure again returns to the meter`);
  // stop and escape
  await p.click('#start'); await p.clock.runFor(1000); await p.evaluate(() => document.activeElement.blur()); await p.keyboard.press('Escape');
  ok(await p.isVisible('#setup'), `${tag} Escape stops a session`);
  ok(await p.evaluate(() => localStorage.length === 0 && sessionStorage.length === 0 && document.cookie === '' && window.__media === 0), `${tag} no storage, cookies, camera or mic`);
  ok(p.foreign.length === 0, `${tag} no third-party requests ${p.foreign.join(' ')}`);
  ok(p.errs.length === 0, `${tag} no console errors ${p.errs.join(' ')}`);
  await p.context().close();
}

// background tab: frames stop while hidden, the clock does not
{
  const r = await hiddenTab(b, base, 20000);
  ok(r.count === 'Move 2 of 4' && r.secs === '9' && !r.done, `hidden tab for 20 s after 1 s lands on move 2 with 9 s left (${JSON.stringify(r)})`);
  const r2 = await hiddenTab(b, base, 70000);
  ok(r2.done, `hidden tab past the end shows the done screen on return (${JSON.stringify(r2)})`);
}
// reduced motion
{
  const p = await page(390, 844, { reducedMotion: 'reduce' });
  await p.clock.install(); await p.goto(base); await p.click('#start'); await p.clock.runFor(400);
  const a = await p.innerHTML('#stage'); await p.clock.runFor(4000); const c = await p.innerHTML('#stage');
  ok((await p.getAttribute('#still', 'aria-pressed')) === 'true' && await p.locator('#stage .pair svg').count() === 2 && a === c, 'reduced motion: still pictures, nothing animates');
  ok((await p.evaluate(() => getComputedStyle(document.querySelector('.needle')).transitionDuration)) === '0s', 'reduced motion: the needle does not sweep');
  ok((await p.textContent('#secs')) === '11', 'reduced motion: the timer still counts');
  await p.context().close();
}
// shared links
{
  const p = await page(390, 844);
  await p.goto(base + '#r=322d'); await p.waitForTimeout(200);
  ok(/did the 60 seconds/.test(await p.textContent('#friend')) && (await p.textContent('#score')) === '100' && (await p.inputValue('input[name=h]:checked')) === '3', 'shared done link sets the same answers and says they finished');
  await p.goto(base + '#r=010'); await p.reload(); await p.waitForTimeout(200);
  ok(/shared a Bedarf of 22%/.test(await p.textContent('#friend')), 'shared unfinished link shows the score');
  await p.context().close();
}
for (const hsh of ['#r=', '#r=999', '#r=012dd', '#garbage', '#%3Cscript%3E', '#r=0120']) {
  const p = await page(390, 844);
  await p.goto(base + hsh); await p.waitForTimeout(200);
  ok(/did not work/.test(await p.textContent('#friend')) && (await p.textContent('#score')) === '8' && p.errs.length === 0, `bad link ${hsh} starts fresh with a note`);
  await p.context().close();
}
{
  const p = await page(1280, 800);
  await p.goto(base + '#moves'); await p.waitForTimeout(200);
  ok(await p.isHidden('#friend') && new URL(p.url()).hash === '#moves', '#moves anchor is not treated as a bad link');
  await p.context().close();
}
// r3 art: the three art pictures in the moves list, then the stage in still mode, then the share cards
{
  const p = await page(390, 844);
  await p.goto(base + '#moves'); await p.waitForTimeout(500);
  const imgs = await p.$$eval('.mlist .pair.art img', (els) => els.map((e) => ({ w: e.getAttribute('width'), h: e.getAttribute('height'), lazy: e.loading, fp: e.getAttribute('fetchpriority'), ss: !!e.srcset, alt: e.alt.length > 20 })));
  ok(imgs.length === 12 && imgs.every((i) => i.w === '1024' && i.h === '740' && i.lazy === 'lazy' && !i.fp && i.ss && i.alt), 'r4: 12 moves show art in the list (srcset, width/height, lazy, alt, no fetchpriority)');
  ok((await p.locator('#m-chest .pair.art img').count()) === 1 && /put your arms out to the sides/.test(await p.textContent('#m-chest')), 'r4: chest opener uses the new arms-out-to-the-sides pair; cited NHS cue unchanged');
  ok((await p.locator('#m-neck-turn .pair svg').count()) === 2, 'r4: neck turn keeps the stick pair (the art turns the torso with the head)');
  ok(/turn your head toward your left shoulder/.test(await p.textContent('#m-neck-turn')), 'r4: neck turn copy is still the cited NHS head turn');
  ok((await p.locator('#m-neck-tilt .pair svg').count()) === 2, 'r4: neck tilt keeps the stick pair (no tilt art was made)');
  ok((await p.locator('#m-hamstring .pair svg').count()) === 2 && (await p.locator('#m-hamstring img').count()) === 0, 'r4: hamstring keeps the stick pair (painted pair rounds the back)');
  ok((await p.locator('#m-calf .pair.art img, #m-knee-hug .pair.art img, #m-shoulder-rolls .pair.art img').count()) === 3, 'r4: calf, knee-hug and shoulder-rolls keep their painted pairs');
  await p.locator('#m-ankle img').scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
  ok(await p.$eval('#m-ankle img', (e) => e.complete && e.naturalWidth > 0), 'r3: lazy art loads when scrolled to');
  await p.context().close();
}
{
  const p = await page(390, 844, { reducedMotion: 'reduce' });
  await p.goto(base); await p.click('#start'); await p.waitForTimeout(500); await p.click('#skip');
  await p.waitForFunction(() => document.querySelector('#mname')?.textContent === 'Chest opener' && document.querySelector('#stage .pair.art img')?.complete && document.querySelector('#stage .pair.art img')?.naturalWidth > 0, { timeout: 8000 });
  ok((await p.textContent('#mname')) === 'Chest opener' && await p.locator('#stage .pair.art img').count() === 1 && await p.$eval('#stage .pair.art img', (e) => e.complete && e.naturalWidth > 0), 'r4: still mode shows the chest-opener art (arms out to the sides)');
  await p.context().close();
}
for (const [hsh, score, odd] of [['#r=000', 8, false], ['#r=200', 50, false], ['#r=321d', 94, false], ['#r=322d', 100, false], ['#r=0120', 8, true]]) {
  const p = await page(1280, 800);
  await p.addInitScript(() => { window.__t = []; window.__img = []; const f = CanvasRenderingContext2D.prototype.fillText, d = CanvasRenderingContext2D.prototype.drawImage; CanvasRenderingContext2D.prototype.fillText = function (t, ...r) { window.__t.push(String(t)); return f.call(this, t, ...r); }; CanvasRenderingContext2D.prototype.drawImage = function (im, ...r) { window.__img.push(im.src ? im.src.slice(-60) : 'canvas'); return d.call(this, im, ...r); }; });
  await p.clock.install(); await p.goto(base + hsh); await p.click('#start'); await p.clock.runFor(61000);
  const dim = await p.evaluate(async () => { const c = await window.__card(); return [c.width, c.height]; });
  if (process.env.CARD_OUT) { const u = await p.evaluate(async () => (await window.__card()).toDataURL('image/png')); (await import('fs')).writeFileSync(`${process.env.CARD_OUT}/share-${hsh.replace(/[#=]/g, '')}${odd ? '-odd' : ''}.png`, Buffer.from(u.split(',')[1], 'base64')); }
  const t = await p.evaluate(() => window.__t.join('\n')), im = await p.evaluate(() => window.__img.join('\n'));
  ok(dim[0] === 1080 && dim[1] === 1350 && new RegExp(`My Bedarf is ${score}%\\. Yours\\?`).test(t), `r3 card ${hsh}${odd ? ' (odd link, starts fresh)' : ''}: 1080x1350, says ${score}%`);
  ok(/share-ground\.webp/.test(im), `r3 card ${hsh}: the screenprint ground is drawn into the canvas`);
  const lay = await p.evaluate(async () => window.__cardLayout());
  const want = Math.PI + (score / 100) * Math.PI, g = lay.gauge;
  ok(Math.abs(g.angle - want) < 0.02, `r3 card ${hsh}: needle angle ${g.angle.toFixed(3)} matches ${score}% (want ${want.toFixed(3)})`);
  ok(g.left >= 0 && g.right <= 1080 && g.top >= 0, `r3 card ${hsh}: gauge is uncropped (L${g.left.toFixed(0)} R${g.right.toFixed(0)} T${g.top.toFixed(0)})`);
  const tip = Math.atan2(g.tipY - g.cy, g.tipX - g.cx);
  ok(Math.abs(((tip - want + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 0.05, `r3 card ${hsh}: needle tip sits at the score angle`);
  if (score <= 25) ok(g.tipX < g.cx - 40, `r3 card ${hsh}: a low score points left, not into the red (tip x ${g.tipX.toFixed(0)}, hub ${g.cx})`);
  if (score >= 75) ok(g.tipX > g.cx + 40, `r3 card ${hsh}: a high score points right (tip x ${g.tipX.toFixed(0)})`);
  if (score === 50) ok(Math.abs(g.tipX - g.cx) < 16 && g.tipY < g.cy, `r3 card ${hsh}: mid score points up`);
  ok(!/localhost|127\.0\.0\.1/.test(t) && /yogabedarf\.com/.test(t), `r3 card ${hsh}: footer uses the canonical URL, no localhost`);
  ok(p.errs.length === 0, `r3 card ${hsh}: no console errors ${p.errs.join(' ')}`);
  await p.context().close();
}
// no JS
{
  const p = await page(390, 844, { javaScriptEnabled: false });
  await p.goto(base);
  ok(await p.locator('.mlist li').count() === data.moves.length && await p.locator('.mlist li a[href^="https://www."]').count() === data.moves.length, 'no JS: all moves listed with a cited source');
  ok(/need JavaScript/.test(await p.textContent('noscript')) && await p.isVisible('#setup'), 'no JS: says the timer needs JavaScript');
  const html = await p.content();
  ok(!/getUserMedia|camera\.|navigator\.geolocation/.test(readFileSync(new URL('../docs/app.js', import.meta.url), 'utf8')) && /no camera, no microphone/.test(html), 'no camera or mic code; page says so');
  await p.context().close();
}
{ const r = await (await fetch(base + 'robots.txt')).text(); ok(/Allow: \//.test(r) && /Sitemap:/.test(r), 'robots.txt allows all and names the sitemap'); }
await b.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
