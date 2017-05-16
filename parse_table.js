const END_OF_STACK = '$'
const START_SYMBOL = 'P'

const table = {
  P: {
    'p': ['L', 'R'],
    'i': ['L', 'R'],
  },
  L: {
    'p': ['N', ';'],
    'i': ['C']
  },
  R: {
    'p'           : ['L', 'R'],
    'i'           : ['L', 'R'],
    '}'           : [],
    [END_OF_STACK]: []
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
    '3': ['E']
  },

  C: {
    'i': ['i', 'f', 'E', '{', 'P', '}', 'D']
  },

  D: {
    'p'           : [],
    'i'           : [],
    'e'           : ['e', 'l', 's', 'e', '{', 'P', '}'],
    '}'           : [],
    [END_OF_STACK]: []
  },

  E: {
    '(': ['(', 'E', 'O', 'E', ')'],
    '0': ['V'],
    '1': ['V'],
    '2': ['V'],
    '3' : ['V']
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
    '3' : ['3']
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

const terminals = [
  '+-*',
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
  END_OF_STACK,
  START_SYMBOL,
  table,
  terminals
}