import { HOURS, NECK, BACK, MOVE_SECONDS, bedarf, band, tier, pickMoves, encode, decode } from './logic.js';
import { poseAt, stills, peak, svg, hasArt, artPair } from './poses.js';

const $ = (id) => document.getElementById(id);
const { moves, sources } = JSON.parse($('moves-data').textContent);
const byId = Object.fromEntries(moves.map((m) => [m.id, m]));
const list = (a) => `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let still = reduce.matches;
let answers = { h: 0, n: 0, b: 0 }, plan = [], i = 0, t = 0, running = false, raf = 0, finished = false;
// Wall-clock timer: time comes from timestamps, not from counting frames, so a background
// tab (where frames stop) still lands on the right move when you come back.
let base = 0, runStart = 0, backstop = 0;
const now = () => performance.now();
const elapsed = () => base + (running ? now() - runStart : 0);

function read() {
  const f = new FormData($('qs'));
  answers = { h: +(f.get('h') ?? 0), n: +(f.get('n') ?? 0), b: +(f.get('b') ?? 0) };
}
function setForm(a) { for (const k of ['h', 'n', 'b']) { const el = $('qs').querySelector(`input[name=${k}][value="${a[k]}"]`); if (el) el.checked = true; } }

function showMeter() {
  const s = bedarf(answers), bd = band(s);
  $('meter').style.setProperty('--v', s);
  $('meter').dataset.band = bd.key;
  $('score').textContent = s; $('band').textContent = bd.label; $('bandline').textContent = `${tier(s).name}. ${tier(s).line}`;
  plan = pickMoves(answers);
  $('plan').textContent = list(plan.map((id) => byId[id].name));
}

$('qs').addEventListener('change', () => { read(); showMeter(); history.replaceState(null, '', `#${encode(answers, false)}`); $('friend').hidden = true; });

// Session
function view(name) { for (const v of ['setup', 'session', 'done']) $(v).hidden = v !== name; document.body.dataset.view = name; }
function drawMove() {
  const m = byId[plan[i]], s = sources[m.source];
  $('count').textContent = `Move ${i + 1} of ${plan.length}`;
  $('mname').textContent = m.name; $('cue').textContent = m.cue; $('why').textContent = m.why;
  $('msrc').href = s.url; $('msrc').textContent = s.name;
  $('live').textContent = `Move ${i + 1} of ${plan.length}, ${m.name}. ${m.cue}`;
  drawFigure();
}
function drawFigure() {
  const id = plan[i];
  $('stage').innerHTML = still ? `${hasArt(id) ? artPair(id) : `<div class="pair">${stills(id).map((p) => svg(p)).join('')}</div>`}<p class="stillnote">Start, then stretch</p>` : svg(poseAt(id, t, MOVE_SECONDS), 'big');
  $('stage').classList.toggle('is-still', still);
}
const TOTAL = () => plan.length * MOVE_SECONDS * 1000;
// Puts the screen where the clock says we are: which move, how many seconds left.
function sync() {
  if (finished || $('session').hidden) return;
  const e = elapsed();
  if (e >= TOTAL()) { finish(); return; }
  const idx = Math.floor(e / (MOVE_SECONDS * 1000));
  t = (e - idx * MOVE_SECONDS * 1000) / 1000;
  if (idx !== i) { i = idx; drawMove(); }
  const left = Math.max(1, Math.ceil(MOVE_SECONDS - t));
  if ($('secs').textContent !== String(left)) $('secs').textContent = left;
  $('bar').style.width = `${(e / TOTAL()) * 100}%`;
  if (!still) drawFigure();
}
function tick() { if (!running) return; sync(); if (running) raf = requestAnimationFrame(tick); }
function arm() { clearTimeout(backstop); if (running) backstop = setTimeout(sync, TOTAL() - elapsed() + 50); }
function play() { running = true; runStart = now(); $('pause').textContent = 'Pause'; cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); arm(); }
function pause() { base = elapsed(); running = false; cancelAnimationFrame(raf); clearTimeout(backstop); $('pause').textContent = 'Resume'; }
function next() {
  base = Math.min(TOTAL(), (i + 1) * MOVE_SECONDS * 1000); if (running) runStart = now();
  if (base >= TOTAL()) { finish(); return; }
  $('secs').textContent = MOVE_SECONDS; sync(); arm();
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' || !running) return;
  sync(); cancelAnimationFrame(raf); if (running) raf = requestAnimationFrame(tick);
});
function start() {
  read(); showMeter(); i = 0; t = 0; base = 0; finished = false; $('friend').hidden = true;
  view('session'); drawMove(); $('secs').textContent = MOVE_SECONDS; $('bar').style.width = '0%';
  $('mname').focus({ preventScroll: true }); $('app').scrollIntoView({ block: 'start' });
  play();
}
function finish() {
  running = false; cancelAnimationFrame(raf); clearTimeout(backstop); finished = true;
  const s = bedarf(answers);
  $('d-score').textContent = `${s}%`; $('d-tier').textContent = tier(s).name; $('d-share').textContent = shareLine();
  $('d-plan').textContent = `You did ${list(plan.map((id) => byId[id].name))}.`;
  history.replaceState(null, '', `#${encode(answers, true)}`);
  const copy = $('meter').cloneNode(true); copy.removeAttribute('id'); copy.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id')); copy.classList.add('mini');
  $('done-meter').replaceChildren(copy);
  view('done'); $('msg').textContent = ''; $('done-h').focus({ preventScroll: true }); $('app').scrollIntoView({ block: 'start' });
}
$('qs').addEventListener('submit', (e) => { e.preventDefault(); start(); });
$('pause').addEventListener('click', () => (running ? pause() : play()));
$('skip').addEventListener('click', () => { next(); if (!finished && !running) drawFigure(); });
$('stop').addEventListener('click', () => { pause(); view('setup'); $('start').focus({ preventScroll: true }); });
$('still').addEventListener('click', () => { still = !still; $('still').setAttribute('aria-pressed', String(still)); drawFigure(); });
$('still').setAttribute('aria-pressed', String(still));
reduce.addEventListener?.('change', (e) => { still = e.matches; $('still').setAttribute('aria-pressed', String(still)); if (!$('session').hidden) drawFigure(); });
document.addEventListener('keydown', (e) => {
  if ($('session').hidden) return;
  if (e.key === 'Escape') { $('stop').click(); return; }
  if (e.key === ' ' && !e.target.closest('button, a, input')) { e.preventDefault(); running ? pause() : play(); }
});
$('again').addEventListener('click', () => { view('setup'); history.replaceState(null, '', `#${encode(answers, false)}`); $('start').focus({ preventScroll: true }); });

// Share
// Switch to https://yogabedarf.com/ at go-live.
const CANONICAL = 'https://yogabedarf.com/';
const isLocalPage = () => location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const publicPage = () => (isLocalPage() ? CANONICAL : `${location.origin}${location.pathname}`).replace(/index\.html$/, '').replace(/\/?$/, '/');
const publicLink = (hash) => `${publicPage()}${hash.startsWith('#') ? hash : '#' + hash}`;
const publicFooter = (hash) => publicLink(hash).replace(/^https?:\/\//, '');
const link = () => publicLink(`#${encode(answers, finished)}`);
const shareLine = () => `My Bedarf is ${bedarf(answers)}%. ${tier(bedarf(answers)).name}, apparently. Yours?`;
$('copy').addEventListener('click', async () => {
  const text = `${shareLine()} ${link()}`;
  try { await navigator.clipboard.writeText(text); $('msg').textContent = 'Copied. Paste it to a coworker. The link holds your three answers, nothing else.'; }
  catch { $('msg').textContent = `Copy this and send it on. ${text}`; }
});

const svgImg = (p) => new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg(p).replace('<svg ', '<svg width="400" height="440" '))}`; });
function wrap(x, text, maxW) {
  const words = text.split(' '), lines = []; let cur = '';
  for (const w of words) { const t = cur ? `${cur} ${w}` : w; if (x.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  return [...lines, cur];
}
const CARD = { sage: '#8db596', pea: '#c9cf7d', mus: '#e7b43c', red: '#e2512e', ink: '#173c36', inkOnRed: '#081816', paper: '#f6f9f3' };
// 0% at the left (9 o'clock), 100% at the right (3 o'clock), same as the on-page SVG needle.
const needleAngle = (score) => Math.PI + (Math.max(0, Math.min(100, Number(score) || 0)) / 100) * Math.PI;
function drawGauge(ctx, score, dx, dy, dr) {
  const C = CARD, segs = [[0, 25, C.sage], [25, 50, C.pea], [50, 75, C.mus], [75, 100, C.red]];
  const stroke = Math.round(dr * 0.26);
  ctx.save();
  ctx.lineCap = 'butt';
  ctx.lineWidth = stroke;
  for (const [a, b, c] of segs) { ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(dx, dy, dr, needleAngle(a), needleAngle(b)); ctx.stroke(); }
  ctx.strokeStyle = C.ink; ctx.lineWidth = 7;
  for (const t of [25, 50, 75]) {
    const a = needleAngle(t);
    ctx.beginPath();
    ctx.moveTo(dx + Math.cos(a) * (dr - stroke * 0.55), dy + Math.sin(a) * (dr - stroke * 0.55));
    ctx.lineTo(dx + Math.cos(a) * (dr + stroke * 0.45), dy + Math.sin(a) * (dr + stroke * 0.45));
    ctx.stroke();
  }
  const ang = needleAngle(score), tipR = dr - stroke * 0.15;
  ctx.strokeStyle = C.ink; ctx.lineWidth = Math.round(dr * 0.09); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(dx + Math.cos(ang) * tipR, dy + Math.sin(ang) * tipR); ctx.stroke();
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(dx, dy, Math.round(dr * 0.12), 0, 7); ctx.fill();
  ctx.restore();
  const pad = stroke / 2 + 2;
  return { score, angle: ang, cx: dx, cy: dy, r: dr, tipR, tipX: dx + Math.cos(ang) * tipR, tipY: dy + Math.sin(ang) * tipR, left: dx - dr - pad, right: dx + dr + pad, top: dy - dr - pad, bottom: dy + pad };
}
async function card() {
  await Promise.all([document.fonts.load('800 80px "Bricolage Grotesque"'), document.fonts.load('400 30px "Atkinson Hyperlegible Next"'), document.fonts.load('700 30px "Atkinson Hyperlegible Next"')]);
  const W = 1080, H = 1350, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const x = cv.getContext('2d'), s = bedarf(answers), bd = band(s), tr = tier(s), C = CARD;
  const bg = { low: C.sage, some: C.pea, high: C.mus, max: C.red }[bd.key];
  // Darker ink on the red band only: #173c36 on #e2512e is 3.14:1 (fails WCAG AA for small text).
  // #081816 on #e2512e is 4.73:1. Text on the cream move panel stays C.ink.
  const bandInk = bg === C.red ? C.inkOnRed : C.ink;
  // Ground: Dash's cream screenprint (figure top right, cream mid, flat bottom strip).
  // The baked dial on that art is cropped and its needle sits in the red, so we
  // cover it and draw a full live dial whose needle tracks the score.
  const STRIP = 1012;
  x.fillStyle = '#f7ecd6'; x.fillRect(0, 0, W, H);
  let art = null;
  try {
    art = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = 'img/share-ground.webp'; });
    x.drawImage(art, 0, 0, W, H);
    x.fillStyle = '#f7ecd6'; x.beginPath(); x.arc(955, 421, 380, 0, 7); x.fill();
  } catch { art = null; }
  const gauge = drawGauge(x, s, 800, 400, 220);
  if (art) {
    x.save(); x.beginPath(); x.rect(400, 70, 230, 500); x.clip(); x.drawImage(art, 0, 0, W, H); x.restore();
  }
  lastLayout = { gauge, score: s, W, H };
  x.fillStyle = bg; x.fillRect(0, STRIP, W, H - STRIP);
  // type on the cream: left of the figure, then the full width under the dial
  x.fillStyle = C.ink; x.textAlign = 'left';
  x.font = '700 40px "Atkinson Hyperlegible Next"'; x.fillText('My Bedarf today', 72, 112);
  x.font = '400 28px "Atkinson Hyperlegible Next"'; x.fillText('Bedarf is German for need', 72, 156);
  let ns = 240; x.font = `800 ${ns}px "Bricolage Grotesque"`;
  const nw = x.measureText(`${s}%`).width; if (nw > 372) ns = Math.floor((ns * 372) / nw);
  x.font = `800 ${ns}px "Bricolage Grotesque"`; const nb = 196 + ns * 0.78; x.fillText(`${s}%`, 56, nb);
  x.font = '800 54px "Bricolage Grotesque"'; let y = nb + 66;
  for (const l of wrap(x, tr.name, 372)) { x.fillText(l, 72, y); y += 56; }
  x.font = '400 34px "Atkinson Hyperlegible Next"'; y = Math.max(y, 580) + 26;
  for (const l of wrap(x, tr.line, W - 144)) { x.fillText(l, 72, y); y += 42; }
  // the four moves, a paper panel that straddles the cream and the band strip
  const top = 724, ph = 340;
  x.fillStyle = C.paper; x.beginPath(); x.roundRect(48, top, W - 96, ph, 28); x.fill();
  x.strokeStyle = C.ink; x.lineWidth = 3; x.stroke();
  x.fillStyle = C.ink; x.font = '700 32px "Atkinson Hyperlegible Next"'; x.fillText(finished ? 'The four moves I did' : 'My four moves', 80, top + 56);
  const figs = await Promise.all(plan.map((id) => svgImg(peak(id))));
  const cw = (W - 160) / 4;
  figs.forEach((im, k) => {
    const cx = 80 + k * cw; x.drawImage(im, cx + (cw - 180) / 2, top + 74, 180, 198);
    x.textAlign = 'center'; x.font = '700 25px "Atkinson Hyperlegible Next"';
    wrap(x, byId[plan[k]].name, cw - 14).forEach((l, j) => x.fillText(l, cx + cw / 2, top + 296 + j * 28));
    x.textAlign = 'left';
  });
  // the line people forward, on the band strip
  x.fillStyle = bandInk; x.font = '800 66px "Bricolage Grotesque"'; x.fillText(`My Bedarf is ${s}%. Yours?`, 72, top + ph + 92);
  x.font = '400 28px "Atkinson Hyperlegible Next"'; x.fillText('Same answers, same moves, one minute', 72, top + ph + 138);
  x.font = '700 28px "Atkinson Hyperlegible Next"'; x.fillText(publicFooter(`#${encode(answers, finished)}`), 72, top + ph + 178);
  x.font = '400 22px "Atkinson Hyperlegible Next"'; x.fillText('A playful score, not medical advice. Stop if it hurts.', 72, H - 34);
  return cv;
}
$('save').addEventListener('click', async () => {
  try {
    const cv = await card(), blob = await new Promise((ok) => cv.toBlob(ok, 'image/png'));
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `bedarf-${bedarf(answers)}.png`;
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    $('msg').textContent = 'Result card saved.';
  } catch { $('msg').textContent = 'Could not make the image here. The link still works.'; }
});
window.__card = card;
window.__cardLayout = async () => { await card(); return lastLayout; };
let lastLayout = null;

// Load state from the link
function fromHash() {
  const d = decode(location.hash);
  if (d) {
    setForm(d.a); read(); showMeter();
    const f = $('friend'); f.hidden = false;
    f.textContent = d.done ? `A coworker scored ${bedarf(d.a)}% and did the 60 seconds. Same answers are set. Your turn.` : `Someone shared a Bedarf of ${bedarf(d.a)}%. Same answers are set. Change them to fit you.`;
  } else {
    read(); showMeter();
    if (location.hash && !['#moves', '#about'].includes(location.hash) && !location.hash.startsWith('#m-')) {
      const f = $('friend'); f.hidden = false; f.textContent = 'That link did not work, so the meter starts fresh.';
    }
  }
  view('setup');
}
fromHash();
