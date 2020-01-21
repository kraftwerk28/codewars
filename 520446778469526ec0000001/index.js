Array.prototype.sameStructureAs = function(other) {
  const eq = (a, b) =>
    a.every((sub, idx) => {
      const [x, y] = [sub, b[idx]];
      if (Array.isArray(x) && Array.isArray(y))
        return x.length === y.length ? eq(x, y) : false;
      return typeof x !== 'object' && typeof y !== 'object';
    });
  if (!Array.isArray(this) || !Array.isArray(other)) return false;
  return eq(this, other);
};
