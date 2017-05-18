const stack_end    = '$'
const start_symbol = 'P'

const table = {
  P: {
    'p': ['L', 'R'],
    'i': ['L', 'R'],
    '@': ['L', 'R']
  },
  L: {
    'p': ['N', ';'],
    'i': ['C'],
    '@': ['G', ';']
  },
  G: {
    '@': ['F', '=', 'M'],
  },
  F: {
    '@': ['@', 'H']
  },

  H : {

    'a': ['T', 'H'],
    'b': ['T', 'H'],
    'c': ['T', 'H'],
    'd': ['T', 'H'],
    '=': [],
    ';': [],
    '{': [],
    '+' : [],
    '-' : [],
    '*' : [],
    ')' : [],
  },

  R: {
    'p'        : ['L', 'R'],
    'i'        : ['L', 'R'],
    '@'        : ['L', 'R'],
    '}'        : [],
    [stack_end]: []
  },
  N: {
    'p': ['p', 'r', 'i', 'n', 't', 'M']
  },

  M: {
    '"': ['"', 'W', '"'],
    '(': ['E'],
    '0': ['E'],
    '1': ['E'],
    '2': ['E'],
    '3': ['E'],
    '@' : ['F']
  },

  C: {
    'i': ['i', 'f', 'E', '{', 'P', '}', 'D']
  },

  D: {
    'p'        : [],
    'i'        : [],
    'e'        : ['e', 'l', 's', 'e', '{', 'P', '}'],
    '}'        : [],
    [stack_end]: []
  },

  E: {
    '(': ['(', 'E', 'O', 'E', ')'],
    '0': ['V'],
    '1': ['V'],
    '2': ['V'],
    '3': ['V'],
    '@' : ['F']
  },

  O: {
    '+': ['+'],
    '-': ['-'],
    '*': ['*']
  },

  V: {
    '0': ['0'],
    '1': ['1'],
    '2': ['2'],
    '3': ['3']
  },
  T: {
    'a': ['a'],
    'b': ['b'],
    'c': ['c'],
    'd': ['d']
  },
  W: {
    '"': [],
    'a': ['T', 'W'],
    'b': ['T', 'W'],
    'c': ['T', 'W'],
    'd': ['T', 'W'],
  }
}

// Create a hash map of terminals where all the values are true, so it can be looked up in O(1)
const terminals = [
  '+-*=@',
  '{}',
  '()',
  'abcd',
  '0123',
  'if', 'else', 'print', ';', '"'
].reduce((obj, next) => {
  next.split('').forEach(x => obj[x] = true)
  return obj
}, {})

module.exports = {
  stack_end,
  start_symbol,
  table,
  terminals
}