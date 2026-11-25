// Stick-figure poses, front view. Each move is a list of keyframes [pose, seconds].
// A pose is the seated (or standing) base with a few joints moved. Shared by build and page.
const SEATED = {
  hd: [100, 46], nose: 0, nk: [100, 66], sl: [80, 74], sr: [120, 74], el: [74, 106], er: [126, 106], hl: [86, 140], hr: [114, 140],
  pv: [100, 136], il: [91, 138], ir: [109, 138], kl: [82, 160], kr: [118, 160], fl: [80, 204], fr: [120, 204], chair: true,
};
const STAND = {
  hd: [100, 30], nose: 0, nk: [100, 50], sl: [80, 58], sr: [120, 58], el: [74, 90], er: [126, 90], hl: [72, 120], hr: [128, 120],
  pv: [100, 120], il: [92, 122], ir: [108, 122], kl: [90, 164], kr: [110, 164], fl: [88, 206], fr: [112, 206], chair: false,
};
const P = (base, mods) => ({ ...base, ...mods });

const armsOut = { el: [57, 80], hl: [36, 82], er: [143, 80], hr: [164, 82] };
const crossed = { el: [88, 100], hl: [114, 78], er: [112, 100], hr: [86, 78] };

export const MOVES = {
  'neck-turn': [[P(SEATED, {}), 1], [P(SEATED, { nose: -7 }), 5], [P(SEATED, {}), 1.5], [P(SEATED, { nose: 7 }), 5], [P(SEATED, {}), 2.5]],
  'neck-tilt': [[P(SEATED, { el: [88, 96], hl: [118, 76] }), 1], [P(SEATED, { el: [88, 96], hl: [118, 76], hd: [89, 49] }), 5], [P(SEATED, {}), 1.5], [P(SEATED, { er: [112, 96], hr: [82, 76], hd: [111, 49] }), 5], [P(SEATED, {}), 2.5]],
  chest: [[P(SEATED, armsOut), 1.5], [P(SEATED, { ...armsOut, el: [57, 74], hl: [36, 70], er: [143, 74], hr: [164, 70], sl: [79, 71], sr: [121, 71], hd: [100, 42], nk: [100, 63] }), 5], [P(SEATED, armsOut), 2], [P(SEATED, { ...armsOut, el: [57, 74], hl: [36, 70], er: [143, 74], hr: [164, 70], sl: [79, 71], sr: [121, 71], hd: [100, 42], nk: [100, 63] }), 5], [P(SEATED, armsOut), 1.5]],
  shoulder: [[P(SEATED, {}), 1], [P(SEATED, { er: [100, 82], hr: [66, 80], el: [88, 104], hl: [100, 88] }), 6], [P(SEATED, {}), 1.5], [P(SEATED, { el: [100, 82], hl: [134, 80], er: [112, 104], hr: [100, 88] }), 6], [P(SEATED, {}), 0.5]],
  twist: [[P(SEATED, crossed), 1], [P(SEATED, { ...crossed, sl: [86, 74], sr: [118, 75], nose: -6, hd: [98, 46] }), 5], [P(SEATED, crossed), 1.5], [P(SEATED, { ...crossed, sl: [82, 75], sr: [114, 74], nose: 6, hd: [102, 46] }), 5], [P(SEATED, crossed), 2.5]],
  march: [[P(SEATED, { hl: [70, 140], hr: [130, 140], el: [72, 110], er: [128, 110] }), 1], ...[0, 1, 2].flatMap(() => [
    [P(SEATED, { hl: [70, 140], hr: [130, 140], el: [72, 110], er: [128, 110], kl: [84, 136], fl: [82, 178] }), 2], [P(SEATED, { hl: [70, 140], hr: [130, 140], el: [72, 110], er: [128, 110] }), 0.8],
    [P(SEATED, { hl: [70, 140], hr: [130, 140], el: [72, 110], er: [128, 110], kr: [116, 136], fr: [118, 178] }), 2], [P(SEATED, { hl: [70, 140], hr: [130, 140], el: [72, 110], er: [128, 110] }), 0.8]]), [P(SEATED, {}), 0.2]],
  'side-bend': [[P(STAND, {}), 1.5], ...[0, 1].flatMap(() => [
    [P(STAND, { hd: [86, 34], nk: [94, 52], sl: [76, 62], sr: [114, 54], el: [68, 94], hl: [64, 128], er: [118, 86], hr: [122, 116] }), 2.5], [P(STAND, {}), 1],
    [P(STAND, { hd: [114, 34], nk: [106, 52], sl: [86, 54], sr: [124, 62], er: [132, 94], hr: [136, 128], el: [82, 86], hl: [78, 116] }), 2.5], [P(STAND, {}), 1]]), [P(STAND, {}), 0.5]],
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
function mix(a, b, u) {
  const o = { chair: b.chair };
  for (const key of Object.keys(b)) {
    if (key === 'chair') continue;
    o[key] = Array.isArray(b[key]) ? [a[key][0] + (b[key][0] - a[key][0]) * u, a[key][1] + (b[key][1] - a[key][1]) * u] : a[key] + (b[key] - a[key]) * u;
  }
  return o;
}

// The two poses to show side by side when motion is off: start and the main stretch.
export const stills = (id) => [MOVES[id][0][0], MOVES[id][1][0]];

const f = (n) => Math.round(n * 10) / 10;
export function svg(p, cls = '') {
  const L = (a, b, c = '') => `<line class="${c}" x1="${f(p[a][0])}" y1="${f(p[a][1])}" x2="${f(p[b][0])}" y2="${f(p[b][1])}"/>`;
  const chair = p.chair ? '<g class="chair"><rect x="72" y="74" width="56" height="64" rx="6"/><rect x="66" y="138" width="68" height="10" rx="3"/><line x1="70" y1="148" x2="70" y2="208"/><line x1="130" y1="148" x2="130" y2="208"/></g>' : '';
  const [hx, hy] = p.hd;
  return `<svg class="fig ${cls}" viewBox="0 0 200 220" aria-hidden="true">${chair}<line class="floor" x1="20" y1="210" x2="180" y2="210"/>`
    + `<g class="body">${L('nk', 'pv')}${L('sl', 'sr')}${L('il', 'ir')}${L('sl', 'el')}${L('el', 'hl')}${L('sr', 'er')}${L('er', 'hr')}${L('il', 'kl')}${L('kl', 'fl')}${L('ir', 'kr')}${L('kr', 'fr')}${L('nk', 'hd', 'neck')}</g>`
    + `<circle class="head" cx="${f(hx)}" cy="${f(hy)}" r="15"/><circle class="nose" cx="${f(hx + p.nose)}" cy="${f(hy + 3)}" r="2.6"/></svg>`;
}
