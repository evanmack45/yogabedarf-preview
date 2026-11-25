// Stick-figure poses. Each move is a list of keyframes [pose, seconds].
// A pose is a base (front or side view, seated or standing) with a few joints moved.
// gl/gr are fingertips and tl/tr are toes, so wrists and ankles can bend.
// arrow (-1 to 1) draws a curved turn arrow; prop is 'chair', 'side' (chair in profile) or 'wall'.
// Shared by the build, the page and the share card.
const SEATED = {
  hd: [100, 46], nose: 0, nk: [100, 66], sl: [80, 74], sr: [120, 74], el: [74, 106], er: [126, 106], hl: [86, 140], hr: [114, 140],
  pv: [100, 136], il: [91, 138], ir: [109, 138], kl: [82, 160], kr: [118, 160], fl: [80, 204], fr: [120, 204], arrow: 0, prop: 'chair',
};
const STAND = {
  hd: [100, 30], nose: 0, nk: [100, 50], sl: [80, 58], sr: [120, 58], el: [74, 90], er: [126, 90], hl: [72, 120], hr: [128, 120],
  pv: [100, 120], il: [92, 122], ir: [108, 122], kl: [90, 164], kr: [110, 164], fl: [88, 206], fr: [112, 206], arrow: 0, prop: '',
};
// Side views face right. Near and far limbs share points unless a move splits them.
const SIDE = {
  hd: [92, 44], nose: 9, nk: [92, 64], sl: [92, 72], sr: [92, 72], el: [98, 104], er: [98, 104], hl: [122, 128], hr: [122, 128],
  pv: [90, 136], il: [90, 136], ir: [90, 136], kl: [132, 138], kr: [132, 138], fl: [134, 204], fr: [134, 204], tl: [148, 204], tr: [148, 204], arrow: 0, prop: 'side',
};
const SIDE_STAND = {
  hd: [96, 28], nose: 9, nk: [96, 48], sl: [96, 56], sr: [96, 56], el: [98, 88], er: [98, 88], hl: [100, 118], hr: [100, 118],
  pv: [96, 118], il: [96, 118], ir: [96, 118], kl: [98, 162], kr: [98, 162], fl: [96, 204], fr: [96, 204], tl: [110, 204], tr: [110, 204], arrow: 0, prop: 'wall',
};
const P = (base, mods) => ({ ...base, ...mods });
const rep = (n, frames) => Array.from({ length: n }, () => frames).flat();

const armsOut = { el: [57, 80], hl: [36, 82], er: [143, 80], hr: [164, 82] };
const crossed = { el: [88, 100], hl: [114, 78], er: [112, 100], hr: [86, 78] };
// Chest opener from the side: arms reach back, chest lifts forward.
const chestA = P(SIDE, { el: [74, 86], hl: [54, 92], er: [74, 86], hr: [54, 92] });
const chestB = P(SIDE, { nk: [102, 62], sl: [102, 70], sr: [102, 70], hd: [106, 40], el: [76, 78], hl: [52, 74], er: [76, 78], hr: [52, 74] });
// Seated twist, front view: hips stay square, shoulders and head turn, the arrow shows which way.
const twistL = P(SEATED, { ...crossed, sl: [88, 72], sr: [122, 77], el: [94, 98], hl: [116, 80], er: [114, 102], hr: [90, 80], nose: -9, hd: [97, 46], arrow: -1 });
const twistR = P(SEATED, { ...crossed, sl: [78, 77], sr: [112, 72], el: [86, 102], hl: [110, 80], er: [106, 98], hr: [84, 80], nose: 9, hd: [103, 46], arrow: 1 });
// Arms forward from the side, for the wrist moves.
const reach = { sl: [94, 72], el: [118, 78], hl: [146, 80], gl: [158, 80], sr: [94, 72], er: [116, 86], hr: [138, 88], gr: [146, 90] };

export const MOVES = {
  'chin-down': [[P(SIDE, {}), 1], [P(SIDE, { hd: [109, 60], nk: [95, 67] }), 6], [P(SIDE, {}), 1.5], [P(SIDE, { hd: [109, 60], nk: [95, 67] }), 5], [P(SIDE, {}), 1.5]],
  'neck-turn': [[P(SEATED, {}), 1], [P(SEATED, { nose: -9, arrow: -0.6 }), 5], [P(SEATED, {}), 1.5], [P(SEATED, { nose: 9, arrow: 0.6 }), 5], [P(SEATED, {}), 2.5]],
  'neck-tilt': [[P(SEATED, { el: [88, 96], hl: [118, 76] }), 1], [P(SEATED, { el: [88, 96], hl: [118, 76], hd: [89, 49] }), 5], [P(SEATED, {}), 1.5], [P(SEATED, { er: [112, 96], hr: [82, 76], hd: [111, 49] }), 5], [P(SEATED, {}), 2.5]],
  'shoulder-rolls': [[P(SEATED, { el: [74, 108], hl: [72, 138], er: [126, 108], hr: [128, 138] }), 1], ...rep(4, [
    [P(SEATED, { el: [74, 104], hl: [72, 134], er: [126, 104], hr: [128, 134], sl: [80, 64], sr: [120, 64] }), 1.2],
    [P(SEATED, { el: [74, 110], hl: [72, 140], er: [126, 110], hr: [128, 140], sl: [80, 78], sr: [120, 78] }), 1.2]]), [P(SEATED, { el: [74, 108], hl: [72, 138], er: [126, 108], hr: [128, 138] }), 1]],
  chest: [[P(SIDE, {}), 1], [chestA, 2], [chestB, 5], [chestA, 1.5], [chestB, 4], [P(SIDE, {}), 1.5]],
  shoulder: [[P(SEATED, {}), 1], [P(SEATED, { er: [100, 82], hr: [66, 80], el: [88, 104], hl: [100, 88] }), 6], [P(SEATED, {}), 1.5], [P(SEATED, { el: [100, 82], hl: [134, 80], er: [112, 104], hr: [100, 88] }), 6], [P(SEATED, {}), 0.5]],
  twist: [[P(SEATED, crossed), 1], [twistL, 5], [P(SEATED, crossed), 1.5], [twistR, 5], [P(SEATED, crossed), 2.5]],
  'wrist-down': [[P(SIDE, reach), 1.5], [P(SIDE, { ...reach, gl: [152, 96], er: [118, 84], hr: [146, 92], gr: [150, 100] }), 6], [P(SIDE, reach), 1.5], [P(SIDE, { ...reach, gl: [152, 96], er: [118, 84], hr: [146, 92], gr: [150, 100] }), 5], [P(SIDE, reach), 1]],
  'wrist-circles': [[P(SIDE, { ...reach, er: [118, 78], hr: [146, 80], gr: [156, 80] }), 1.5], ...rep(3, [
    [P(SIDE, { ...reach, er: [118, 78], hr: [146, 80], gl: [150, 70], gr: [150, 70] }), 0.9],
    [P(SIDE, { ...reach, er: [118, 78], hr: [146, 80], gl: [158, 80], gr: [158, 80] }), 0.9],
    [P(SIDE, { ...reach, er: [118, 78], hr: [146, 80], gl: [150, 90], gr: [150, 90] }), 0.9],
    [P(SIDE, { ...reach, er: [118, 78], hr: [146, 80], gl: [140, 80], gr: [140, 80] }), 0.9]]), [P(SIDE, reach), 1.5]],
  ankle: [[P(SIDE, { hl: [96, 140], hr: [96, 140], el: [92, 106], er: [92, 106] }), 1], ...rep(3, [
    [P(SIDE, { hl: [96, 140], hr: [96, 140], el: [92, 106], er: [92, 106], kr: [136, 132], fr: [176, 128], tr: [186, 138] }), 1.6],
    [P(SIDE, { hl: [96, 140], hr: [96, 140], el: [92, 106], er: [92, 106], kr: [136, 132], fr: [176, 128], tr: [182, 116] }), 1.6]]), [P(SIDE, { hl: [96, 140], hr: [96, 140], el: [92, 106], er: [92, 106] }), 1]],
  march: [[P(SEATED, { hl: [70, 140], hr: [130, 140], el: [72, 110], er: [128, 110] }), 1], ...rep(3, [
    [P(SEATED, { hl: [70, 140], hr: [130, 140], el: [72, 110], er: [128, 110], kl: [84, 136], fl: [82, 178] }), 2], [P(SEATED, { hl: [70, 140], hr: [130, 140], el: [72, 110], er: [128, 110] }), 0.8],
    [P(SEATED, { hl: [70, 140], hr: [130, 140], el: [72, 110], er: [128, 110], kr: [116, 136], fr: [118, 178] }), 2], [P(SEATED, { hl: [70, 140], hr: [130, 140], el: [72, 110], er: [128, 110] }), 0.8]]), [P(SEATED, {}), 0.2]],
  'knee-hug': [[P(SIDE, {}), 1], [P(SIDE, { kr: [120, 100], fr: [140, 140], tr: [152, 140], el: [108, 104], er: [108, 104], hl: [122, 112], hr: [122, 112] }), 6], [P(SIDE, {}), 1.5],
    [P(SIDE, { kr: [120, 100], fr: [140, 140], tr: [152, 140], el: [108, 104], er: [108, 104], hl: [122, 112], hr: [122, 112] }), 5], [P(SIDE, {}), 1.5]],
  hamstring: [[P(SIDE, { pv: [104, 136], il: [104, 136], ir: [104, 136], kl: [140, 138], fl: [142, 204], tl: [156, 204], kr: [146, 168], fr: [180, 200], tr: [184, 188], hl: [132, 132], hr: [132, 132], el: [112, 104], er: [112, 104], hd: [104, 44], nk: [104, 64], sl: [104, 72], sr: [104, 72] }), 1.5],
    [P(SIDE, { pv: [104, 136], il: [104, 136], ir: [104, 136], kl: [140, 138], fl: [142, 204], tl: [156, 204], kr: [146, 168], fr: [180, 200], tr: [184, 188], hl: [150, 150], hr: [150, 150], el: [128, 116], er: [128, 116], hd: [134, 54], nk: [122, 70], sl: [120, 76], sr: [120, 76] }), 6],
    [P(SIDE, { pv: [104, 136], il: [104, 136], ir: [104, 136], kl: [140, 138], fl: [142, 204], tl: [156, 204], kr: [146, 168], fr: [180, 200], tr: [184, 188], hl: [132, 132], hr: [132, 132], el: [112, 104], er: [112, 104], hd: [104, 44], nk: [104, 64], sl: [104, 72], sr: [104, 72] }), 1.5],
    [P(SIDE, { pv: [104, 136], il: [104, 136], ir: [104, 136], kl: [140, 138], fl: [142, 204], tl: [156, 204], kr: [146, 168], fr: [180, 200], tr: [184, 188], hl: [150, 150], hr: [150, 150], el: [128, 116], er: [128, 116], hd: [134, 54], nk: [122, 70], sl: [120, 76], sr: [120, 76] }), 5], [P(SIDE, {}), 1]],
  'side-bend': [[P(STAND, {}), 1.5], ...rep(2, [
    [P(STAND, { hd: [86, 34], nk: [94, 52], sl: [76, 62], sr: [114, 54], el: [68, 94], hl: [64, 128], er: [118, 86], hr: [122, 116] }), 2.5], [P(STAND, {}), 1],
    [P(STAND, { hd: [114, 34], nk: [106, 52], sl: [86, 54], sr: [124, 62], er: [132, 94], hr: [136, 128], el: [82, 86], hl: [78, 116] }), 2.5], [P(STAND, {}), 1]]), [P(STAND, {}), 0.5]],
  calf: [[P(SIDE_STAND, { el: [126, 62], hl: [152, 64], er: [126, 62], hr: [152, 64] }), 1.5],
    [P(SIDE_STAND, { hd: [124, 32], nk: [118, 52], sl: [116, 58], sr: [116, 58], el: [134, 62], hl: [152, 62], er: [134, 62], hr: [152, 62], pv: [100, 118], il: [100, 118], ir: [100, 118], kr: [126, 158], fr: [124, 204], tr: [138, 204], kl: [82, 162], fl: [62, 204], tl: [76, 204] }), 6],
    [P(SIDE_STAND, { el: [126, 62], hl: [152, 64], er: [126, 62], hr: [152, 64] }), 1.5],
    [P(SIDE_STAND, { hd: [124, 32], nk: [118, 52], sl: [116, 58], sr: [116, 58], el: [134, 62], hl: [152, 62], er: [134, 62], hr: [152, 62], pv: [100, 118], il: [100, 118], ir: [100, 118], kl: [126, 158], fl: [124, 204], tl: [138, 204], kr: [82, 162], fr: [62, 204], tr: [76, 204] }), 5], [P(SIDE_STAND, {}), 1]],
  quad: [[P(SIDE_STAND, { er: [124, 78], hr: [152, 84] }), 1.5],
    [P(SIDE_STAND, { er: [124, 78], hr: [152, 84], kl: [96, 162], fl: [72, 134], tl: [66, 124], el: [86, 92], hl: [72, 132] }), 6],
    [P(SIDE_STAND, { er: [124, 78], hr: [152, 84] }), 1.5],
    [P(SIDE_STAND, { er: [124, 78], hr: [152, 84], kl: [96, 162], fl: [72, 134], tl: [66, 124], el: [86, 92], hl: [72, 132] }), 5], [P(SIDE_STAND, {}), 1]],
};

// Total seconds per move is MOVE_SECONDS; keyframes are scaled to fit.
export function poseAt(id, t, total = 15) {
  const kf = MOVES[id], sum = kf.reduce((s, k) => s + k[1], 0), k = total / sum;
  let acc = 0;
  for (let i = 0; i < kf.length; i++) {
    const hold = kf[i][1] * k, move = Math.min(1.2, hold * 0.45);
    if (t < acc + hold || i === kf.length - 1) {
      const prev = kf[(i - 1 + kf.length) % kf.length][0], cur = kf[i][0];
      const u = i === 0 ? 1 : Math.min(1, Math.max(0, (t - acc) / move));
      return mix(prev, cur, ease(u));
    }
    acc += hold;
  }
}
const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2);
const tips = (p) => ({ gl: p.gl ?? p.hl, gr: p.gr ?? p.hr, tl: p.tl ?? p.fl, tr: p.tr ?? p.fr });
function mix(a, b, u) {
  const A = { ...a, ...tips(a) }, B = { ...b, ...tips(b) }, o = { prop: b.prop };
  for (const key of Object.keys(B)) {
    if (key === 'prop') continue;
    o[key] = Array.isArray(B[key]) ? [A[key][0] + (B[key][0] - A[key][0]) * u, A[key][1] + (B[key][1] - A[key][1]) * u] : A[key] + (B[key] - A[key]) * u;
  }
  return o;
}

// The two poses to show side by side when motion is off: start and the main stretch.
export const stills = (id) => [MOVES[id][0][0], MOVES[id][1][0]];
export const peak = (id) => MOVES[id][1][0];

// Generated art for three moves (start and stretch in one image, 1024x740). Other moves keep the drawn pair.
// hamstring is not listed: the r4 pair rounds the back, a form cue we should not teach (Dash 11:00 AM); the stick SVG stays.
// neck-turn is not listed: the r4 pair turns the whole torso, not just the head. neck-tilt was not made. Both stay as stick SVGs.
const POSE_ART = {
  'chin-down': 'A faceless figure sitting tall, then lowering the chin toward the chest.',
  chest: 'A faceless figure sitting upright, then sitting away from the chair back with both arms out to the sides and the chest lifted.',
  'shoulder-rolls': 'A faceless figure sitting with arms hanging, then lifting the shoulders toward the ears.',
  shoulder: 'A faceless figure sitting upright, then holding one arm across the body at the elbow.',
  twist: 'A faceless figure sitting upright, then crossing the arms and turning the upper body.',
  'wrist-down': 'A faceless figure sitting upright, then holding one arm out and pulling the hand downward.',
  'wrist-circles': 'Seated figure in profile, then the same figure with both forearms held out in front and the wrists loose.',
  ankle: 'Seated figure in profile, then the same figure with one leg straightened out in front.',
  march: 'A faceless figure sitting upright, then lifting one knee as in a seated march.',
  'knee-hug': 'A faceless figure sitting tall, then hugging one knee toward the chest.',
  calf: 'A faceless figure standing with hands on a chair, then stepping one straight leg back, heel down.',
  quad: 'A faceless figure standing and holding a chair, then drawing one ankle up toward the body.',
};
export const hasArt = (id) => id in POSE_ART;
export const artPair = (id, lazy = false, sizes = '(max-width: 520px) 240px, 380px') => `<div class="pair art"><img src="img/pose-${id}-512.webp" srcset="img/pose-${id}-512.webp 512w, img/pose-${id}-1024.webp 1024w" sizes="${sizes}" width="1024" height="740" alt="${POSE_ART[id]}"${lazy ? ' loading="lazy"' : ''} decoding="async"></div>`;


const f = (n) => Math.round(n * 10) / 10;
// Presentation attributes are inline so the SVG also draws as a standalone image (the share card).
const INK = '#173c36', INK2 = '#3f5a53', PAPER = '#f6f9f3', RED = '#e2512e', PEA = '#c9cf7d';
export function svg(p, cls = '') {
  p = { ...p, ...tips(p) };
  const L = (a, b, c = '') => `<line class="${c}" x1="${f(p[a][0])}" y1="${f(p[a][1])}" x2="${f(p[b][0])}" y2="${f(p[b][1])}"/>`;
  const props = {
    chair: `<g class="chair"><rect x="72" y="74" width="56" height="64" rx="6" fill="${PEA}"/><rect x="66" y="138" width="68" height="10" rx="3" fill="${PEA}"/><g stroke="${INK2}" stroke-width="5"><line x1="70" y1="148" x2="70" y2="208"/><line x1="130" y1="148" x2="130" y2="208"/></g></g>`,
    side: `<g class="chair"><rect x="70" y="70" width="10" height="72" rx="4" fill="${PEA}"/><rect x="70" y="138" width="62" height="10" rx="3" fill="${PEA}"/><g stroke="${INK2}" stroke-width="5"><line x1="76" y1="148" x2="76" y2="208"/><line x1="126" y1="148" x2="126" y2="208"/></g></g>`,
    wall: `<g class="chair"><rect x="156" y="24" width="12" height="186" rx="3" fill="${PEA}"/></g>`,
  };
  const [hx, hy] = p.hd, a = p.arrow || 0;
  const arrow = Math.abs(a) > 0.25 ? (() => {
    const s = Math.sign(a), y = hy - 26, x0 = hx - 22 * s, x1 = hx + 22 * s;
    return `<g class="turn" fill="none" stroke="${RED}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="${f(Math.min(1, (Math.abs(a) - 0.25) * 2))}"><path d="M ${f(x0)} ${f(y + 6)} Q ${f(hx)} ${f(y - 12)} ${f(x1)} ${f(y + 6)}"/><path d="M ${f(x1 - 9 * s)} ${f(y + 3)} L ${f(x1)} ${f(y + 6)} L ${f(x1 + 1 * s)} ${f(y - 4)}"/></g>`;
  })() : '';
  return `<svg class="fig ${cls}" viewBox="0 0 200 220" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${props[p.prop] || ''}<line class="floor" x1="20" y1="210" x2="180" y2="210" stroke="${INK2}" stroke-width="3" stroke-dasharray="2 8"/>`
    + `<g class="body" stroke="${INK}" stroke-width="9" stroke-linecap="round">${L('nk', 'pv')}${L('sl', 'sr')}${L('il', 'ir')}${L('sl', 'el')}${L('el', 'hl')}${L('hl', 'gl')}${L('sr', 'er')}${L('er', 'hr')}${L('hr', 'gr')}${L('il', 'kl')}${L('kl', 'fl')}${L('fl', 'tl')}${L('ir', 'kr')}${L('kr', 'fr')}${L('fr', 'tr')}${L('nk', 'hd', 'neck')}</g>`
    + `${arrow}<circle class="head" cx="${f(hx)}" cy="${f(hy)}" r="15" fill="${PAPER}" stroke="${INK}" stroke-width="7"/><circle class="nose" cx="${f(hx + p.nose)}" cy="${f(hy + 3)}" r="2.6" fill="${RED}"/></svg>`;
}
