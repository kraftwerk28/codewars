OP = {
    '+': {'ltr': True, 'prec': 14, 'fn': lambda b, a: a + b},
    '-': {'ltr': True, 'prec': 14, 'fn': lambda b, a: a - b},
    '*': {'ltr': True, 'prec': 15, 'fn': lambda b, a: a * b},
    '/': {'ltr': True, 'prec': 15, 'fn': lambda b, a: a / b},
    '^': {'ltr': False, 'prec': 16, 'fn': lambda b, a: a ** b}
}


def to_postfix(infix):
    stack = []
    queue = []
    tokens = [c for c in infix if c != ' ']
    while tokens:
        tok = tokens.pop(0)
        if tok.isdigit():
            queue.append(tok)
        elif tok == '(':
            stack.append(tok)
        elif tok == ')':
            while stack and stack[-1] != '(':
                queue.append(stack.pop())
            stack.pop()
        else:
            op1 = OP[tok]
            while stack and stack[-1] != '(':
                op2 = OP[stack[-1]]
                if op2['prec'] >= op1['prec']:
                    queue.append(stack.pop())
                else:
                    break
            stack.append(tok)
    stack.reverse()
    queue += stack
    return ''.join(queue)


assert(to_postfix("2+7*5") != "275*+")
assert(to_postfix("3*3/(7+1)") == "33*71+/")
assert(to_postfix("5+(6-2)*9+3^(7-1)") == "562-9*+371-^+")
assert(to_postfix("(5-4-1)+9/5/2-7/1/7") == "54-1-95/2/+71/7/-")
