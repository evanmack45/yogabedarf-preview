// Pure logic for the Bedarf-o-Meter. No DOM, shared by the page, the build and the tests.
export const HOURS = ['Under 2 hours', '2 to 5 hours', '5 to 8 hours', 'Over 8 hours'];
export const NECK = ['Fine', 'A bit stiff', 'Very stiff'];
export const BACK = ['Fine', 'A bit tight', 'Very tight'];
export const MOVE_SECONDS = 15, MOVES_PER_SET = 4;

// A playful score from three taps. Not a health measurement.
export function bedarf({ h, n, b }) {
  return Math.min(100, [8, 30, 50, 62][h] + [0, 14, 22][n] + [0, 10, 16][b]);
}

export function band(score) {
  if (score < 25) return { key: 'low', label: 'Low Bedarf', line: 'You are in decent shape. Stretch anyway, it is only a minute.' };
  if (score < 50) return { key: 'some', label: 'Some Bedarf', line: 'A little stiff. One minute should help you feel looser.' };
  if (score < 75) return { key: 'high', label: 'High Bedarf', line: 'Desk-shaped. Time for the 60 seconds.' };
  return { key: 'max', label: 'Maximum Bedarf', line: 'Fully crumbled. Go gently.' };
}

// Head-to-toe order. Standing moves come last, after the seated ones.
export const ORDER = ['chin-down', 'neck-turn', 'neck-tilt', 'shoulder-rolls', 'chest', 'shoulder', 'twist', 'wrist-down', 'wrist-circles', 'ankle', 'march', 'knee-hug', 'hamstring', 'side-bend', 'calf', 'quad'];
export const STANDING = ['side-bend', 'calf', 'quad'];
const POOLS = {
  neck: ['neck-turn', 'chin-down', 'neck-tilt'],
  upper: ['chest', 'twist', 'shoulder', 'shoulder-rolls'],
  hands: ['wrist-circles', 'wrist-down'],
  // Legs by hours sitting. Longer sitting brings in the standing moves.
  legs: [['ankle', 'march'], ['march', 'knee-hug', 'ankle'], ['hamstring', 'calf', 'knee-hug', 'quad'], ['quad', 'side-bend', 'calf', 'hamstring']],
};

// Four moves sized to the answers. Stiffer neck means more neck moves, tighter back means
// more upper-body moves, longer sitting brings in bigger leg moves. Each answer set also turns the
// pools to a different start, so neighbouring answers get visibly different sets.
export function pickMoves({ h, n, b }) {
  const key = h * 9 + n * 3 + b, taken = { neck: 0, upper: 0, hands: 0, legs: 0 };
  const pool = (c) => (c === 'legs' ? POOLS.legs[h] : POOLS[c]);
  const want = ['legs', 'upper'];
  if (n >= 1) want.push('neck');
  if (n === 2) want.push('neck');
  if (b === 2) want.push('upper');
  if (h >= 2) want.push('legs');
  want.push('hands', ...(b === 0 ? ['neck', 'legs', 'upper'] : ['upper', 'neck', 'legs']));
  const out = [];
  for (const c of want) {
    if (out.length === MOVES_PER_SET) break;
    const ps = pool(c), id = ps[(key + taken[c] * 2 + (c === 'upper' ? n : c === 'neck' ? b : 0)) % ps.length];
    taken[c]++;
    if (!out.includes(id) && !(STANDING.includes(id) && out.some((x) => STANDING.includes(x)))) out.push(id);
  }
  for (const id of ORDER) if (out.length < MOVES_PER_SET && !out.includes(id) && !STANDING.includes(id)) out.push(id);
  return ORDER.filter((id) => out.includes(id));
}

// Funny but kind names for the score, for the result card.
export function tier(score) {
  if (score < 15) return { name: 'Freshly oiled hinge', line: 'Barely any Bedarf. Stretch anyway and show off a little.' };
  if (score < 35) return { name: 'Slightly crumpled', line: 'Nothing a minute cannot smooth out.' };
  if (score < 55) return { name: 'Chair adjacent', line: 'You and the chair are getting close. Time for a little space.' };
  if (score < 75) return { name: 'Part human, part chair', line: 'The chair is winning. Gently take yourself back.' };
  if (score < 90) return { name: 'Desk shaped', line: 'Your spine has opinions today. Go slowly.' };
  return { name: 'Fully fossilized', line: 'Ancient, majestic and very ready for a stretch.' };
}

// Link state: #r=<hours><neck><back>, plus "d" once the 60 seconds are done.
export const encode = ({ h, n, b }, done) => `r=${h}${n}${b}${done ? 'd' : ''}`;
export function decode(hash) {
  const m = /^#?r=([0-3])([0-2])([0-2])(d?)$/.exec(hash || '');
  return m ? { a: { h: +m[1], n: +m[2], b: +m[3] }, done: m[4] === 'd' } : null;
}
