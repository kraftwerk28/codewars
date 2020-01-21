eval(require('fs').readFileSync(__dirname + '/index.js', 'utf-8'));

// should return true
// console.log([1, 1, 1].sameStructureAs([2, 2, 2]));
// console.log([1, [1, 1]].sameStructureAs([2, [2, 2]]));

// // should return false
// console.log([1, [1, 1]].sameStructureAs([[2, 2], 2]));
// console.log([1, [1, 1]].sameStructureAs([[2], 2]));

// // should return true
// console.log([[[], []]].sameStructureAs([[[], []]]));

// // should return false
// console.log([[[], []]].sameStructureAs([[1, 1]]));

console.log([1,[1,1]].sameStructureAs([2,[2]]))
