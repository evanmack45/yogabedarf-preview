import { HOURS, NECK, BACK, MOVE_SECONDS, bedarf, band, pickMoves, encode, decode } from './logic.js';
import { poseAt, stills, svg } from './poses.js';

const $ = (id) => document.getElementById(id);
const { moves, sources } = JSON.parse($('moves-data').textContent);
const byId = Object.fromEntries(moves.map((m) => [m.id, m]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let still = reduce.matches;
let answers = { h: 0, n: 0, b: 0 }, plan = [], i = 0, t = 0, running = false, last = 0, raf = 0, finished = false;

function read() {
  const f = new FormData($('qs'));
  answers = { h: +(f.get('h') ?? 0), n: +(f.get('n') ?? 0), b: +(f.get('b') ?? 0) };
}
function setForm(a) { for (const k of ['h', 'n', 'b']) { const el = $('qs').querySelector(`input[name=${k}][value="${a[k]}"]`); if (el) el.checked = true; } }

function showMeter() {
  const s = bedarf(answers), bd = band(s);
  $('meter').style.setProperty('--v', s);
  $('meter').dataset.band = bd.key;
  $('score').textContent = s; $('band').textContent = bd.label; $('bandline').textContent = bd.line;
  plan = pickMoves(answers);
  $('plan').textContent = plan.map((id) => byId[id].name).join(', ');
}

$('qs').addEventListener('change', () => { read(); showMeter(); history.replaceState(null, '', `#${encode(answers, false)}`); $('friend').hidden = true; });

// Session
function view(name) { for (const v of ['setup', 'session', 'done']) $(v).hidden = v !== name; document.body.dataset.view = name; }
function drawMove() {
  const m = byId[plan[i]], s = sources[m.source];
  $('count').textContent = `Move ${i + 1} of ${plan.length}`;
  $('mname').textContent = m.name; $('cue').textContent = m.cue; $('why').textContent = m.why;
  $('msrc').href = s.url; $('msrc').textContent = s.name;
  $('live').textContent = `Move ${i + 1} of ${plan.length}: ${m.name}. ${m.cue}`;
  drawFigure();
}
function drawFigure() {
  const id = plan[i];
  $('stage').innerHTML = still ? `<div class="pair">${stills(id).map((p) => svg(p)).join('')}</div><p class="stillnote">Start, then stretch</p>` : svg(poseAt(id, t, MOVE_SECONDS), 'big');
  $('stage').classList.toggle('is-still', still);
}
function tick(now) {
  if (!running) return;
  const dt = Math.min(0.5, (now - last) / 1000); last = now; t += dt;
  if (t >= MOVE_SECONDS) { next(); if (!running) return; }
  const left = Math.max(1, Math.ceil(MOVE_SECONDS - t));
  if ($('secs').textContent !== String(left)) $('secs').textContent = left;
  $('bar').style.width = `${((i * MOVE_SECONDS + t) / (plan.length * MOVE_SECONDS)) * 100}%`;
  if (!still) drawFigure();
  raf = requestAnimationFrame(tick);
}
function play() { running = true; last = performance.now(); $('pause').textContent = 'Pause'; raf = requestAnimationFrame(tick); }
function pause() { running = false; cancelAnimationFrame(raf); $('pause').textContent = 'Resume'; }
function next() {
  i += 1; t = 0;
  if (i >= plan.length) { finish(); return; }
  $('secs').textContent = MOVE_SECONDS; drawMove();
}
function start() {
  read(); showMeter(); i = 0; t = 0; finished = false;
  view('session'); drawMove(); $('secs').textContent = MOVE_SECONDS; $('bar').style.width = '0%';
  $('mname').focus({ preventScroll: true }); $('app').scrollIntoView({ block: 'start' });
  play();
}
function finish() {
  running = false; cancelAnimationFrame(raf); finished = true;
  const s = bedarf(answers);
  $('d-score').textContent = `${s}%`;
  $('d-plan').textContent = `You did: ${plan.map((id) => byId[id].name).join(', ')}.`;
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
const link = () => `${location.origin}${location.pathname}#${encode(answers, finished)}`;
$('copy').addEventListener('click', async () => {
  const url = link();
  try { await navigator.clipboard.writeText(url); $('msg').textContent = 'Link copied. It holds your three answers and that you finished, nothing else.'; }
  catch { $('msg').textContent = `Copy this link: ${url}`; }
});

async function card() {
  await Promise.all([document.fonts.load('800 80px "Bricolage Grotesque"'), document.fonts.load('400 30px "Atkinson Hyperlegible Next"'), document.fonts.load('700 30px "Atkinson Hyperlegible Next"')]);
  const W = 1080, H = 1350, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const x = cv.getContext('2d'), s = bedarf(answers), bd = band(s);
  const C = { paper: '#e2eadf', ink: '#173c36', red: '#e2512e', mus: '#e7b43c', sage: '#8db596', pea: '#c9cf7d' };
  x.fillStyle = C.paper; x.fillRect(0, 0, W, H);
  x.fillStyle = C.ink; x.fillRect(0, 0, W, 16);
  x.textAlign = 'center'; x.fillStyle = C.ink;
  x.font = '800 92px "Bricolage Grotesque"'; x.fillText('Bedarf-o-Meter', W / 2, 150);
  x.font = '400 32px "Atkinson Hyperlegible Next"'; x.fillText('Bedarf is German for need.', W / 2, 205);
  const cx = W / 2, cy = 600, r = 300, segs = [[0, 25, C.sage], [25, 50, C.pea], [50, 75, C.mus], [75, 100, C.red]];
  x.lineWidth = 56; x.lineCap = 'butt';
  for (const [a, b, c] of segs) { x.strokeStyle = c; x.beginPath(); x.arc(cx, cy, r, Math.PI + (a / 100) * Math.PI, Math.PI + (b / 100) * Math.PI); x.stroke(); }
  const ang = Math.PI + (s / 100) * Math.PI;
  x.strokeStyle = C.ink; x.lineWidth = 14; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(ang) * (r - 50), cy + Math.sin(ang) * (r - 50)); x.stroke();
  x.fillStyle = C.ink; x.beginPath(); x.arc(cx, cy, 26, 0, 7); x.fill();
  x.font = '800 190px "Bricolage Grotesque"'; x.fillText(`${s}%`, cx, cy + 200);
  x.font = '700 48px "Atkinson Hyperlegible Next"'; x.fillStyle = bd.key === 'max' || bd.key === 'high' ? '#b8361a' : C.ink; x.fillText(bd.label, cx, cy + 270);
  x.fillStyle = C.ink; x.font = '400 34px "Atkinson Hyperlegible Next"';
  x.fillText(finished ? 'I did the 60 seconds:' : 'My 60 seconds:', cx, cy + 360);
  x.font = '700 34px "Atkinson Hyperlegible Next"'; x.fillText(plan.map((id) => byId[id].name).join(', '), cx, cy + 410);
  x.font = '400 30px "Atkinson Hyperlegible Next"'; x.fillText('Your turn? Same answers, same moves:', cx, 1160);
  x.font = '700 28px "Atkinson Hyperlegible Next"'; x.fillText(`${location.host}${location.pathname}#${encode(answers, finished)}`, cx, 1205);
  x.font = '400 24px "Atkinson Hyperlegible Next"'; x.fillStyle = '#4a5f59'; x.fillText('A playful score, not medical advice. Stop if it hurts.', cx, 1290);
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
