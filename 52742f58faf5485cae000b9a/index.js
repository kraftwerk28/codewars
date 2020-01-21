const AMOUNTS = {
  year: 60 * 60 * 24 * 365,
  day: 60 * 60 * 24,
  hour: 60 * 60,
  minute: 60,
  second: 1
};
function formatDuration(seconds) {
  if (seconds === 0) return 'now';
  const exprs = [];
  while (seconds > 0) {
    const closest = Object.entries(AMOUNTS).find(e => e[1] <= seconds);
    let cnt = 0;
    while (closest[1] <= seconds) {
      seconds -= closest[1];
      cnt++;
    }
    exprs.push(`${cnt} ${closest[0]}${cnt > 1 ? 's' : ''}`);
  }
  if (exprs.length === 1) return exprs[0];
  return exprs.slice(0, -1).join(', ') + ' and ' + exprs[exprs.length - 1];
}

console.log(formatDuration(3662));
