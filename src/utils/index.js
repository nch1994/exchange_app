
export function formatMoney(s, n) {
  if (!s) return 0;
  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
  const l = s.split('.')[0].split('').reverse();

  // eslint-disable-next-line prefer-destructuring
  const r = s.split('.')[1];
  let t = '';
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
  }
  return t.split('').reverse().join('') + '.' + r;
}
