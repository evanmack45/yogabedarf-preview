// Builds ../docs from data/moves.json and src/. Plain node, no dependencies.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { HOURS, NECK, BACK, bedarf, band, tier, pickMoves } from './src/logic.js';
import { MOVES, stills, svg, hasArt, artPair } from './src/poses.js';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'docs');
const SITE = 'https://yogabedarf.com/';
const CHAIR = `${SITE}chair-stretch-60-seconds/`;
const APP_LD = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Bedarf-o-Meter', url: SITE, description: 'Three taps measure your Bedarf (German for need), then a gentle 60-second stretch you can do in your chair. Moves from the NHS and Mayo Clinic.', applicationCategory: 'LifestyleApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };
const ldTag = `<script type="application/ld+json">${JSON.stringify(APP_LD).replace(/</g, '\\u003c')}</script>`;
const AFTERNIC = 'https://www.afternic.com/domain/yogabedarf.com';
const data = JSON.parse(readFileSync(join(here, 'data/moves.json'), 'utf8'));

// Boundary checks: every move needs a pose, a cited source and plain copy.
const fail = (m) => { throw new Error(`moves.json: ${m}`); };
for (const m of data.moves) {
  if (!MOVES[m.id]) fail(`no pose for ${m.id}`);
  if (!data.sources[m.source]?.url?.startsWith('https://www.')) fail(`bad source on ${m.id}`);
  if (!m.cue || !m.why || /[—<>]/.test(m.cue + m.why + m.name)) fail(`bad copy on ${m.id}`);
  if (!/comfortable|gently|slowly|few slow breaths/i.test(m.cue)) fail(`cue not gentle enough on ${m.id}`);
}
if (Object.keys(MOVES).length !== data.moves.length) fail('pose without a move');
if (data.moves.length < 15) fail('fewer than 15 moves');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const byId = Object.fromEntries(data.moves.map((m) => [m.id, m]));
const A0 = { h: 0, n: 0, b: 0 }, s0 = bedarf(A0), plan0 = pickMoves(A0);
const src = (m) => data.sources[m.source];
const group = (name, legend, opts) => `<fieldset class="q" data-q="${name}"><legend>${legend}</legend><div class="chips">${opts.map((o, i) => `<label class="chip"><input type="radio" name="${name}" value="${i}"${i === 0 ? ' checked' : ''}><span>${esc(o)}</span></label>`).join('')}</div></fieldset>`;
const ticks = [0, 25, 50, 75, 100].map((v) => { const a = Math.PI * (1 - v / 100), x = 120 + Math.cos(a) * 104, y = 124 - Math.sin(a) * 104, x2 = 120 + Math.cos(a) * 92, y2 = 124 - Math.sin(a) * 92; return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`; }).join('');
const arc = (from, to, cls) => { const p = (v) => { const a = Math.PI * (1 - v / 100); return `${(120 + Math.cos(a) * 98).toFixed(1)} ${(124 - Math.sin(a) * 98).toFixed(1)}`; }; return `<path class="${cls}" d="M ${p(from)} A 98 98 0 0 1 ${p(to)}"/>`; };
const SAFE = `Stop if anything hurts. This is not medical advice. If you are not sure these moves suit you, check with a doctor or physio first.`;
const SAFE_SHORT = 'Stop if anything hurts. This is not medical advice.'; // full line stays in the footer

const moveLI = (m) => `<li id="m-${m.id}">${hasArt(m.id) ? artPair(m.id, true, '(max-width: 520px) 240px, 150px') : `<div class="pair">${stills(m.id).map((p) => svg(p)).join('')}</div>`}<div><h3>${esc(m.name)}</h3><p>${esc(m.cue)}</p><p class="why">${esc(m.why)} <a href="${src(m).url}">${esc(src(m).name)}</a></p></div></li>`;
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${SITE}">
<meta property="og:url" content="${SITE}">
<title>Bedarf-o-Meter: how much stretch do you need?</title>
<meta name="description" content="Three taps measure your Bedarf (German for need), then a gentle 60-second stretch you can do in your chair. Moves from the NHS and Mayo Clinic.">
<meta property="og:title" content="Bedarf-o-Meter">
<meta property="og:description" content="Three taps, one score, one gentle 60-second desk stretch.">
<meta property="og:image" content="${SITE}og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="A big semicircular meter in green, mustard and red with a red needle in the red zone and a stylised person folded forward in front of it.">
<meta property="og:type" content="website">
<link rel="preload" as="image" href="img/hero-phone.webp" imagesrcset="img/hero-phone.webp 876w, img/hero-phone-1314.webp 1314w" imagesizes="100vw" media="(max-width: 899px)">
<link rel="preload" as="image" href="img/hero.webp" imagesrcset="img/hero-800.webp 800w, img/hero.webp 1280w, img/hero-1920.webp 1920w" imagesizes="100vw" media="(min-width: 900px)">
<meta name="theme-color" content="#e2eadf">
<link rel="preload" href="fonts/bricolage.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/atkinson.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="style.css">
${ldTag}
<script>document.documentElement.classList.add('js')</script>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M4 24a12 12 0 0 1 24 0' fill='none' stroke='%23173c36' stroke-width='5'/%3E%3Cline x1='16' y1='24' x2='24' y2='12' stroke='%23e2512e' stroke-width='3'/%3E%3C/svg%3E">
</head>
<body>
<header class="top">
  <a class="brand" href="./"><span>yoga</span>bedarf</a>
  <a class="toplink" href="#moves">The moves</a>
</header>
<main class="app" id="app">
  <div class="intro">
    <picture>
      <source media="(max-width: 899px)" srcset="img/hero-phone.webp 876w, img/hero-phone-1314.webp 1314w" sizes="100vw" width="876" height="730">
      <img class="intro-art" src="img/hero.webp" srcset="img/hero-800.webp 800w, img/hero.webp 1280w, img/hero-1920.webp 1920w" sizes="100vw" width="1280" height="714" alt="A person in a standing forward fold beside a huge meter dial whose needle points into the red zone, in sage, mustard and red on cream." fetchpriority="high" decoding="async">
    </picture>
    <div class="intro-copy">
    <h1>Bedarf-o-Meter</h1>
    <p class="gloss"><b lang="de">Bedarf</b> is German for <i>need</i>. Three taps measure yours.</p>
    <p class="friend" id="friend" hidden></p>
    </div>
  </div>
  <section class="setup" id="setup" aria-label="Your Bedarf">
    <div class="meter" id="meter" style="--v:${s0}">
      <svg class="gauge" viewBox="0 0 240 140" aria-hidden="true">${arc(0, 25, 'z1')}${arc(25, 50, 'z2')}${arc(50, 75, 'z3')}${arc(75, 100, 'z4')}<g class="ticks">${ticks}</g><g class="needle"><line x1="120" y1="124" x2="120" y2="40"/><circle cx="120" cy="124" r="9"/></g></svg>
      <p class="score"><span id="score">${s0}</span><small>%</small></p>
      <p class="band" id="band">${band(s0).label}</p>
      <p class="bandline" id="bandline">${tier(s0).name}</p>
    </div>
    <form class="qs" id="qs">
      ${group('h', 'Sitting today', HOURS)}
      ${group('n', 'Your neck', NECK)}
      ${group('b', 'Back and shoulders', BACK)}
      <p class="plan">Your four moves are <span id="plan">${((a) => `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`)(plan0.map((id) => esc(byId[id].name)))}</span>.</p>
      <button class="btn go" id="start" type="submit">Start my 60 seconds</button>
      <p class="safe">${SAFE_SHORT}</p>
    </form>
  </section>
  <section class="session" id="session" hidden aria-label="Stretch session">
    <div class="stage" id="stage"></div>
    <div class="cueside">
      <p class="count" id="count"></p>
      <h2 class="mname" id="mname" tabindex="-1"></h2>
      <p class="cue" id="cue"></p>
      <p class="why"><span id="why"></span> <a id="msrc" href="#"></a></p>
      <div class="clock"><span class="secs" id="secs">15</span><span class="unit">seconds</span></div>
      <div class="bar" aria-hidden="true"><i id="bar"></i></div>
      <p class="sr-only" id="live" aria-live="polite"></p>
      <div class="ctrls">
        <button class="btn" type="button" id="pause">Pause</button>
        <button class="btn" type="button" id="skip">Next move</button>
        <button class="btn ghost" type="button" id="stop">Stop</button>
        <button class="btn ghost" type="button" id="still" aria-pressed="false">Still pictures</button>
      </div>
      <p class="safe">${SAFE_SHORT}</p>
    </div>
  </section>
  <section class="done" id="done" hidden aria-label="Done">
    <div class="done-meter" id="done-meter" aria-hidden="true"></div>
    <div class="done-text">
    <h2 tabindex="-1" id="done-h">60 seconds, done.</h2>
    <p class="was">Your Bedarf was <b id="d-score"></b>, which makes you <b id="d-tier"></b>. It is lower now, we hope. The meter cannot check.</p>
    <p class="dplan" id="d-plan"></p>
    <p class="sharepre" id="d-share"></p>
    <div class="ctrls">
      <button class="btn go" type="button" id="save">Save result card</button>
      <button class="btn" type="button" id="copy">Copy link for a coworker</button>
      <button class="btn ghost" type="button" id="again">Measure again</button>
    </div>
    <p class="msg" id="msg" aria-live="polite"></p>
    </div>
  </section>
  <noscript><p class="msg">The meter and timer need JavaScript. All ${data.moves.length} moves are listed below, so you can still do them.</p></noscript>
</main>
<section class="moves" id="moves" aria-labelledby="moves-h">
  <h2 id="moves-h">The moves</h2>
  <p class="mlede">Your four moves, 15 seconds each. Go slowly and never bounce.</p>
  <ol class="mlist" id="picks">
  ${data.moves.filter((m) => plan0.includes(m.id)).map(moveLI).join('\n  ')}
  </ol>
  <p class="more-wrap"><button type="button" class="btn more" id="more-moves" aria-expanded="false" aria-controls="rest" data-n="${data.moves.length - plan0.length}">Show the other ${data.moves.length - plan0.length} moves</button></p>
  <ol class="mlist" id="rest">
  ${data.moves.filter((m) => !plan0.includes(m.id)).map(moveLI).join('\n  ')}
  </ol>
</section>
<section class="about" id="about" aria-labelledby="about-h">
  <ul class="stretch-row">
    <li><img src="img/stretch-1.webp" width="320" height="316" alt="Outlined figure tilting the neck to one side." loading="lazy" decoding="async"></li>
    <li><img src="img/stretch-2.webp" width="320" height="317" alt="Outlined figure bending to the side." loading="lazy" decoding="async"></li>
    <li><img src="img/stretch-4.webp" width="320" height="318" alt="Outlined figure in a seated twist." loading="lazy" decoding="async"></li>
    <li><img src="img/stretch-5.webp" width="320" height="319" alt="Outlined figure in a forward fold." loading="lazy" decoding="async"></li>
    <li><img src="img/stretch-6.webp" width="320" height="319" alt="Outlined figure stretching an arm across the chest." loading="lazy" decoding="async"></li>
  </ul>
  <h2 id="about-h">About the meter</h2>
  <p>The score is a playful guess from your three taps, not a health measurement. Each of the 36 answer sets gets its own four moves.</p>
  <p>The default four moves are also written out on the <a href="chair-stretch-60-seconds/">60-second chair stretch</a> page.</p>
  <p>Nothing leaves your browser. There is no camera, microphone, account, cookie or tracker. The link you copy holds only your three answers and whether you finished.</p>
  <p class="srchead">Sources, all checked on 25 November 2026:</p>
  <ul class="srcs">${Object.values(data.sources).map((s) => `<li><a href="${s.url}">${esc(s.name)}</a></li>`).join('')}</ul>
</section>
<footer class="foot">
  <p>${SAFE}</p>
  <p><a href="${AFTERNIC}">This domain is for sale.</a></p>
</footer>
<script type="application/json" id="moves-data">${JSON.stringify({ moves: data.moves, sources: data.sources }).replace(/</g, '\\u003c')}</script>
<script type="module" src="app.js"></script>
</body>
</html>
`;

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'fonts'), { recursive: true });

const chairMoves = plan0.map((id) => byId[id]);
const chairAnswer = 'This is a gentle 60-second stretch you can do in a chair. Four moves, 15 seconds each: Neck turn, Chest opener, Wrist circles and Ankle stretch. They come from the NHS and Mayo Clinic, named on each move. Stop if you feel sharp pain. This is not medical advice.';
if (chairAnswer.trim().split(/\s+/).length > 60) throw new Error('chair answer over 60 words');
if (chairMoves.map((m) => m.name).join(', ') !== 'Neck turn, Chest opener, Wrist circles, Ankle stretch') throw new Error('chair page must use the default four chair moves');
const chairList = chairMoves.map((m, i) => {
  const so = src(m);
  return `<li id="c-${m.id}"><h2><span class="c-n">${i + 1}</span> ${esc(m.name)} <span class="c-sec">15 seconds</span></h2><p>${esc(m.cue)}</p><p class="why">${esc(m.why)} <a href="${so.url}">${esc(so.name)}</a></p></li>`;
}).join('\n  ');
const CHAIR_LD = { '@context': 'https://schema.org', '@type': 'WebPage', name: 'A 60-second chair stretch', url: CHAIR, description: chairAnswer, isPartOf: { '@type': 'WebSite', name: 'yogabedarf', url: SITE } };
const chairHTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${CHAIR}">
<meta property="og:url" content="${CHAIR}">
<title>A 60-second chair stretch | yogabedarf</title>
<meta name="description" content="A gentle 60-second stretch you can do in a chair. Four moves from the NHS and Mayo Clinic. Stop if you feel sharp pain.">
<meta property="og:title" content="A 60-second chair stretch">
<meta property="og:description" content="Four gentle moves, 15 seconds each, from the NHS and Mayo Clinic.">
<meta property="og:image" content="${SITE}og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="website">
<script type="application/ld+json">${JSON.stringify(CHAIR_LD).replace(/</g, '\\u003c')}</script>
<link rel="stylesheet" href="../style.css">
</head>
<body class="chair-page">
<header class="top">
  <a class="brand" href="../"><span>yoga</span>bedarf</a>
  <a class="toplink" href="../">Open the meter</a>
</header>
<main class="chair">
  <h1>A 60-second chair stretch</h1>
  <p class="gloss" id="ch-answer">${chairAnswer}</p>
  <p class="safe" id="ch-safe">Stop if you feel sharp pain. This is not medical advice. If you are not sure these moves suit you, check with a doctor or physio first.</p>
  <ol class="chair-list" id="ch-list">
  ${chairList}
  </ol>
  <p>These are the four default moves on the meter, 15 seconds each, one minute in total. Your set can change when you change the three answers on the <a href="../">Bedarf-o-Meter</a>.</p>
</main>
<footer class="foot">
  <p>A playful score, not a health measurement.</p>
  <p><a href="${AFTERNIC}">This domain is for sale.</a></p>
</footer>
</body>
</html>`;

writeFileSync(join(out, 'index.html'), html);
mkdirSync(join(out, 'chair-stretch-60-seconds'), { recursive: true });
writeFileSync(join(out, 'chair-stretch-60-seconds/index.html'), chairHTML);
for (const f of ['style.css', 'app.js', 'logic.js', 'poses.js']) copyFileSync(join(here, 'src', f), join(out, f));
mkdirSync(join(out, 'img'), { recursive: true });
for (const f of readdirSync(join(here, 'src/img'))) copyFileSync(join(here, 'src/img', f), join(out, 'img', f));
copyFileSync(join(here, 'src/img/og.jpg'), join(out, 'og.jpg'));
for (const f of readdirSync(join(here, 'src/fonts'))) copyFileSync(join(here, 'src/fonts', f), join(out, 'fonts', f));
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}sitemap.xml\n`);
writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE}</loc></url><url><loc>${CHAIR}</loc></url></urlset>\n`);
writeFileSync(join(out, 'CNAME'), 'yogabedarf.com\n');
writeFileSync(join(out, '.nojekyll'), '');
console.log(`built ${out}: ${data.moves.length} moves, ${Object.keys(data.sources).length} sources`);
