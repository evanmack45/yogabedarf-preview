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

const ORDER = ['neck-turn', 'neck-tilt', 'chest', 'shoulder', 'twist', 'march', 'side-bend'];

// Four moves sized to the answers: the three upper-body moves that fit best,
// then one move for the legs (standing up after the longest sits). Head-to-toe order.
export function pickMoves({ h, n, b }) {
  const w = { 'neck-turn': 1 + n * 2, 'neck-tilt': n ? n * 2 + 0.5 : 0, chest: 1.2 + b * 2, shoulder: b ? b * 2 : 0, twist: 1 + b * 2 - 0.6 };
  const upper = ORDER.filter((id) => w[id] > 0).sort((a, c) => w[c] - w[a] || ORDER.indexOf(a) - ORDER.indexOf(c)).slice(0, MOVES_PER_SET - 1);
  const legs = h >= 3 ? 'side-bend' : 'march';
  return ORDER.filter((id) => upper.includes(id) || id === legs);
}

// Link state: #r=<hours><neck><back>, plus "d" once the 60 seconds are done.
export const encode = ({ h, n, b }, done) => `r=${h}${n}${b}${done ? 'd' : ''}`;
export function decode(hash) {
  const m = /^#?r=([0-3])([0-2])([0-2])(d?)$/.exec(hash || '');
  return m ? { a: { h: +m[1], n: +m[2], b: +m[3] }, done: m[4] === 'd' } : null;
}
