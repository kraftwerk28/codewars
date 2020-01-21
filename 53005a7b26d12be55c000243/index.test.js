const Interpreter = require('./');

const interpreter = new Interpreter();

// interpreter.input('1 + 2 + (4 * 1) - (-(3 * 2) + 1)');
// interpreter.input('x = 2')
// interpreter.input('4 + 2');
// interpreter.input('x = 2');
const res = interpreter.input('');
console.log(res);

