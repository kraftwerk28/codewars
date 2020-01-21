const TOKEN_TYPES = {
  operator: str => /[+\-*/%=]/.test(str),
  special: str => /[{}()[\]]/.test(str),
  constant: str => /[\d.]+/.test(str),
  identifier: str => true
};

const MATH = {
  '+': { operands: 2, prec: 14, func: (b, a) => a + b },
  '-': { operands: 2, prec: 14, func: (b, a) => a - b },
  '*': { operands: 2, prec: 15, func: (b, a) => a * b },
  '/': { operands: 2, prec: 15, func: (b, a) => a / b },
  '%': { operands: 2, prec: 15, func: (b, a) => a % b }
};

function getTokenType(tok) {
  const type = Object.entries(TOKEN_TYPES).find(([name, fn]) => fn(tok))[0];
  if (type === 'constant') return { type, value: +tok };
  return { type, value: tok };
}

const TOKEN_SPLIT_RE = /\s*([-+*\/\%=\(\)]|[A-Za-z_][A-Za-z0-9_]*|[0-9]*\.?[0-9]+)\s*/g;

class Interpreter {
  constructor() {
    this.vars = {};
    this.functions = {};
    this._tokens = [];
  }

  _tokenize(inputStr) {
    if (inputStr === '') return [];

    return inputStr
      .split(TOKEN_SPLIT_RE)
      .filter(s => !s.match(/^\s*$/))
      .map(token => getTokenType(token));
  }

  _poland(tokens) {
    const stack = [];
    while (tokens.length) {
      const tok = tokens.shift();
      if (tok.type === 'constant') {
        stack.push(tok.value);
      } else {
        const oper = MATH[tok.value];
        const operands = [];
        for (let i = 0; i < oper.operands; i++) {
          operands.push(stack.pop());
        }
        stack.push(oper.func(...operands));
      }
    }
    return stack[0];
  }

  _sy() {
    const queue = [];
    const stack = [];
    while (this._tokens.length) {
      const token = this._pop();
      switch (token.type) {
        case 'constant':
          queue.push(token);
          break;
        case 'operator':
          const oper = MATH[token.value];
          while (stack.length) {
            const last = stack[stack.length - 1];
            if (last.type !== 'operator') break;
            const anotherOper = MATH[last.value];
            if (anotherOper.prec >= oper.prec) {
              queue.push(last);
              stack.pop();
            } else {
              break;
            }
          }
          stack.push(token);
          break;
        case 'special':
          if (token.value === '(') {
            stack.push(token);
            continue;
          }
          if (token.value === ')') {
            while (stack[stack.length - 1].value !== '(') {
              queue.push(stack.pop());
            }
            stack.pop();
          }
          break;
        default:
          this._raise('Unexpected token found');
      }
    }
    while (stack.length) {
      queue.push(stack.pop());
    }
    return this._poland(queue);
  }

  _eval() {
    const first = this._tokens[0];
    if (first.type === 'identifier') {
      const varname = this._pop().value;
      this._expect('operator', '=');
      const rvalue = this._sy();
      this.vars[varname] = rvalue;
      return rvalue;
    } else {
      return this._sy();
    }
  }

  _expect(type, value) {
    const tok = this._pop();
    if (tok.type !== type) this._raise();
    if (typeof value !== 'undefined' && tok.value !== value) this._raise();
    return true;
  }

  _replaceVars() {
    this._tokens = this._tokens.map(t => {
      if (t.type !== 'identifier') return t;
      if (!Object.keys(this.vars).includes(t.value)) return t;
      return { type: 'constant', value: this.vars[t.value] };
    });
  }

  _raise(reason) {
    throw new Error(reason || 'Error parsing input');
  }

  _pop() {
    return this._tokens.shift();
  }

  input(expr) {
    this._tokens = this._tokenize(expr);
    if (!this._tokens.length) return '';
    this._replaceVars();
    return this._eval();
  }
}

module.exports = Interpreter;
