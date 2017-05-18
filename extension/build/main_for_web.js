/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const { stringParser } = __webpack_require__(4);
const { nodeFactory } = __webpack_require__(1);
const { stack_end, start_symbol, table, terminals } = __webpack_require__(3);

window.parser = function (string) {
  // Instantiate the generator function
  const gen = stringParser({
    string,
    start_symbol,
    stack_end,
    terminals,
    parse_table: table,
    node_factory: nodeFactory
  });

  let next = gen.next();
  let tree;

  let history = [];

  try {
    while (!next.done) {
      const { token, stack, remaining, tree_stack } = next.value;
      tree = tree_stack;

      history.push({
        remaining: remaining,
        stack: [...stack.filter(x => typeof x === 'string')].reverse().join(''),
        token: token
      });

      next = gen.next();
    }

    return {
      accepted: true,
      history,
      tree
    };
  } catch (e) {

    return {
      accepted: false,
      history,
      tree,
      error: e
    };
  }
};

// on accept state is when to redraw the tree in d3.js

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const nodes = __webpack_require__(2);

/**
 * Factory to create nodes and instantiate them correctly given a label and children.
 * Unfortunately there are 'magic numbers' being used to retrieve the correct information out of the child arrays,
 * but it works for this implementation.
 *
 * Please refer to the parse table (in parse_table.js) for more information about the production rules used.
 *
 * @param label
 * @param children
 * @return Node|null
 * @constructor
 */
function nodeFactory({ label, children = [] }) {
  switch (label) {

    case 'F':
      // Variable
      return new nodes.VariableNode(children[1]);
      console.log({ label, children });
      throw new Error();
      return null;
    case 'G':
      return new nodes.VariableAssignmentNode(children[0], children[2]);
    case 'H':
      if (children.length === 0) {
        return null;
      } else if (children.length === 1) {
        return new nodes.VariableNameSequenceNode(children[0]);
      } else {
        // length must be 2
        return new nodes.VariableNameSequenceNode(children[0], children[1]);
      }

      // Variable Name
      return null;

    case 'V':
      return new nodes.NumberNode(children[0]);
    case 'E':
      if (children[0] instanceof nodes.Node) {
        return new nodes.ExpressionNode(children[0]);
      }
      if (children[0] === '(') {
        return new nodes.BinaryExpressionNode(children[1], children[2], children[3]);
      }

      throw new Error("Problem resolving E");

    case 'N':
      return new nodes.PrintStatementNode(children[5]);

    case 'L':
      return new nodes.StatementNode(children[0]);

    // Since this is the right recursive step, we will give back another compound statement
    case 'R':
      let [child_1, child_2] = children;
      if (children.length > 0) {
        return new nodes.CompoundStatementNode(child_1, child_2);
      } else {
        return null;
      }

    case 'C':
      return new nodes.IfStatementNode(children[2], children[4], children[6]);

    case 'D':
      if (children.length > 0) {
        return children[5];
      }

      return null;

    case 'P':
      return new nodes.CompoundStatementNode(children[0], children[1]);

    case 'O':
      return new nodes.OperatorNode(children[0]);

    case 'M':
      if (children[0] === '"') {
        return new nodes.ValueNode(children[1]);
      } else {
        return new nodes.ValueNode(children[0]);
      }

    case 'T':
      return new nodes.LetterNode(children[0]);

    case 'W':
      if (children.length === 0) {
        return null;
      } else if (children.length === 1) {
        return new nodes.LetterSequence(children[0]);
      } else {
        // length must be 2
        return new nodes.LetterSequence(children[0], children[1]);
      }

    default:
      throw new Error(`No factory method found for '${label}'`);
  }
}

module.exports = { nodeFactory };

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * Almost all the production rules of the grammar have a node which represents it, I did take liberties in skipping
 * some nodes that had no effect on the outcome (eg D -> P).
 *
 * Every node has a method "evaluate" which will either :
 *  - return a value
 *  - print a statement
 *  - branch
 *
 *  Starting from a singular root node it is possible to evaluate the entire tree by evaluating the root
 *  which will in turn evaluate its children , and its children's children, etc.
 */

class VariableStack {
  constructor() {
    this.stack = [{}];
  }

  pushScope() {
    this.stack.push({});
  }

  popScope() {
    if (this.stack.length > 1) {
      this.stack.pop();
    }
  }

  getVariable(name) {
    let level = this.stack.length - 1;

    while (level >= 0) {
      if (this.stack[level].hasOwnProperty(name)) {
        return this.stack[level][name];
      }

      level--;
    }

    throw new Error(`No variable named '${name}'`);
  }

  setVariable(name, value) {
    this.stack[this.stack.length - 1][name] = value;
  }

}

const variable_stack = new VariableStack();

class Node {
  constructor(label) {
    this.label = label;
  }

  evaluate() {
    return null;
  }
}

class CompoundStatementNode extends Node {
  constructor(left, right) {
    super("Compound Statement");
    this.left = left;
    this.right = right;
  }

  evaluate() {
    this.left.evaluate();
    this.right && this.right.evaluate();
  }
}

class StatementNode extends Node {
  constructor(statement) {
    super("Statement");
    this.statement = statement;
  }

  evaluate() {
    this.statement && this.statement.evaluate();
  }
}

class PrintStatementNode extends Node {
  constructor(value) {
    super("Print Statement");
    this.value = value;
  }

  evaluate() {
    console.log(this.value.evaluate());
  }
}

class IfStatementNode extends Node {
  constructor(condition, if_body, else_body) {
    super("If Statement");
    this.condition = condition;
    this.if_body = if_body;
    this.else_body = else_body;
  }

  evaluate() {
    if (this.condition.evaluate()) {
      variable_stack.pushScope();
      this.if_body.evaluate();
      variable_stack.popScope();
    } else {
      if (this.else_body !== null) {
        variable_stack.pushScope();
        this.else_body.evaluate();
        variable_stack.popScope();
      }
    }
  }
}

class ExpressionNode extends Node {
  constructor(expression) {
    super("Expression");
    this.expression = expression;
  }

  evaluate() {
    return this.expression.evaluate();
  }
}

class BinaryExpressionNode extends Node {
  constructor(left, operator, right) {
    super("Binary Expression");
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  evaluate() {
    const [lhs, op, rhs] = [this.left.evaluate(), this.operator.evaluate(), this.right.evaluate()];
    switch (op) {
      case '+':
        return lhs + rhs;

      case '-':
        return lhs - rhs;

      case '*':
        return lhs * rhs;
    }
  }
}

class OperatorNode extends Node {
  constructor(operator) {
    super("Operator");
    this.operator = operator;
  }

  evaluate() {
    return this.operator;
  }
}

class NumberNode extends Node {
  constructor(value) {
    super("Number");
    this.value = +value; // +variable will cast to a number if possible
  }

  evaluate() {
    return this.value;
  }
}

class LetterSequence extends Node {
  constructor(letter_node, next) {
    super("Letter Sequence");
    this.letter_node = letter_node;
    this.next = next;
  }

  evaluate() {
    if (!this.letter_node) {
      return '';
    }
    if (!this.next) {
      return this.letter_node.evaluate();
    }

    return this.letter_node.evaluate() + this.next.evaluate();
  }
}

class LetterNode extends Node {
  constructor(letter) {
    super("Letter");
    this.letter = letter;
  }

  evaluate() {
    return this.letter;
  }
}

class ValueNode extends Node {
  constructor(value) {
    super("Value");
    this.value = value;
  }

  evaluate() {
    return this.value.evaluate();
  }
}

class VariableNameSequenceNode extends Node {
  constructor(character_node, next) {
    super("Variable Name Sequence");
    this.character_node = character_node;
    this.next = next;
  }

  evaluate() {
    if (!this.character_node) {
      return '';
    }
    if (!this.next) {
      return this.character_node.evaluate();
    }

    return this.character_node.evaluate() + this.next.evaluate();
  }
}

class VariableNode extends Node {
  constructor(name_node) {
    super("Variable");
    this.name = name_node.evaluate();
  }

  evaluate() {
    return variable_stack.getVariable(this.name);
  }
}

class VariableAssignmentNode extends Node {
  constructor(var_node, value_node) {
    super("Variable Assignment");
    this.var_node = var_node;
    this.value = value_node;
  }

  evaluate() {
    variable_stack.setVariable(this.var_node.name, this.value.value.evaluate());
  }
}

module.exports = {
  Node,
  LetterSequence,
  LetterNode,
  NumberNode,
  ExpressionNode,
  BinaryExpressionNode,
  OperatorNode,
  IfStatementNode,
  CompoundStatementNode,
  StatementNode,
  PrintStatementNode,
  ValueNode,
  VariableNameSequenceNode,
  VariableNode,
  VariableAssignmentNode
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

const stack_end = '$';
const start_symbol = 'P';

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
    '@': ['F', '=', 'M']
  },
  F: {
    '@': ['@', 'H']
  },

  H: {

    'a': ['T', 'H'],
    'b': ['T', 'H'],
    'c': ['T', 'H'],
    'd': ['T', 'H'],
    'e': ['T', 'H'],
    'f': ['T', 'H'],
    'g': ['T', 'H'],
    'h': ['T', 'H'],
    'i': ['T', 'H'],
    'j': ['T', 'H'],
    'k': ['T', 'H'],
    'l': ['T', 'H'],
    'm': ['T', 'H'],
    'n': ['T', 'H'],
    'o': ['T', 'H'],
    'p': ['T', 'H'],
    'q': ['T', 'H'],
    'r': ['T', 'H'],
    's': ['T', 'H'],
    't': ['T', 'H'],
    'u': ['T', 'H'],
    'v': ['T', 'H'],
    'w': ['T', 'H'],
    'x': ['T', 'H'],
    'y': ['T', 'H'],
    'z': ['T', 'H'],
    '=': [],
    ';': [],
    '{': [],
    '+': [],
    '-': [],
    '*': [],
    ')': []
  },

  R: {
    'p': ['L', 'R'],
    'i': ['L', 'R'],
    '@': ['L', 'R'],
    '}': [],
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
    '@': ['F']
  },

  C: {
    'i': ['i', 'f', 'E', '{', 'P', '}', 'D']
  },

  D: {
    'p': [],
    'i': [],
    'e': ['e', 'l', 's', 'e', '{', 'P', '}'],
    '}': [],
    [stack_end]: []
  },

  E: {
    '(': ['(', 'E', 'O', 'E', ')'],
    '0': ['V'],
    '1': ['V'],
    '2': ['V'],
    '3': ['V'],
    '@': ['F']
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
    'd': ['d'],
    'e': ['e'],
    'f': ['f'],
    'g': ['g'],
    'h': ['h'],
    'i': ['i'],
    'j': ['j'],
    'k': ['k'],
    'l': ['l'],
    'm': ['m'],
    'n': ['n'],
    'o': ['o'],
    'p': ['p'],
    'q': ['q'],
    'r': ['r'],
    's': ['s'],
    't': ['t'],
    'u': ['u'],
    'v': ['v'],
    'w': ['w'],
    'x': ['x'],
    'y': ['y'],
    'z': ['z']
  },
  W: {
    '"': [],
    'a': ['T', 'W'],
    'b': ['T', 'W'],
    'c': ['T', 'W'],
    'd': ['T', 'W'],
    'e': ['T', 'W'],
    'f': ['T', 'W'],
    'g': ['T', 'W'],
    'h': ['T', 'W'],
    'i': ['T', 'W'],
    'j': ['T', 'W'],
    'k': ['T', 'W'],
    'l': ['T', 'W'],
    'm': ['T', 'W'],
    'n': ['T', 'W'],
    'o': ['T', 'W'],
    'p': ['T', 'W'],
    'q': ['T', 'W'],
    'r': ['T', 'W'],
    's': ['T', 'W'],
    't': ['T', 'W'],
    'u': ['T', 'W'],
    'v': ['T', 'W'],
    'w': ['T', 'W'],
    'x': ['T', 'W'],
    'y': ['T', 'W'],
    'z': ['T', 'W']
  }
};

// Create a hash map of terminals where all the values are true, so it can be looked up in O(1)
const terminals = ['+-*=@', '{}', '()', 'abcdefghijklmnopqrstuvwxyz', '0123', 'if', 'else', 'print', ';', '"'].reduce((obj, next) => {
  next.split('').forEach(x => obj[x] = true);
  return obj;
}, {});

module.exports = {
  stack_end,
  start_symbol,
  table,
  terminals
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * Helper class to create a placeholder token that will eventually resolve a particular node based on the
 * label and children.
 * @param label
 * @param size
 */
class ActionToken {
  constructor({ label, size }) {
    this.label = label;
    this.size = size;
  }

  // Overriding to hide it from output
  toString() {
    return '';
  }
}

/**
 *
 * This function is a generator function. If you're familiar with python generators yielding, the same concept applies.
 * Otherwise refer to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator
 *
 * The general strategy of this function is to grab the current token, and then start a second loop where it checks
 * against the symbol on the top of the stack.
 * If it is a ...
 *  - ActionToken : generate a node out of the token and the correct amount of children, and loop again
 *  - Matching Terminal : remove the terminal off the stack and exit the loop
 *
 * @param string
 * @param parse_table
 * @param terminals
 * @param start_symbol
 * @param stack_end
 * @param node_factory
 */
function* stringParser({ string, parse_table, terminals, start_symbol, node_factory, stack_end }) {
  const input_string = string.replace(/\s+/g, '');
  const input_stack = [stack_end, ...input_string.split('').reverse()];
  const stack = [stack_end, start_symbol];
  const parsed = [];
  const tree_stack = [];

  while (input_stack.length > 0) {
    const token = input_stack.pop();

    while (true) {

      // If the top of the stack is not an ActionToken, yield the current status of the parser
      if (!(stack[stack.length - 1] instanceof ActionToken)) {
        const remaining = input_string.substring(parsed.length) + stack_end;
        yield { token, stack, remaining, tree_stack };
      }

      let symbol = stack.pop();

      // If we encounter an ActionToken, convert it into a node via the factory and keep looping through symbols
      if (symbol instanceof ActionToken) {
        const children = [];

        for (let i = 0; i < symbol.size; i++) {
          children.push(tree_stack.pop());
        }

        children.reverse();
        const n = node_factory({ label: symbol.label, children });
        tree_stack.push(n);
        continue;
      }

      // If the token and symbol match (Matching terminals), add it to the tree stack and break the loop
      if (token === symbol) {
        if (terminals[token] === true) {
          tree_stack.push(token);
          break;
        }

        if (token === stack_end) {
          break;
        }
      }

      // If the symbol is a variable, attempt to resolve it or fail if there is no production rule for it
      else if (parse_table.hasOwnProperty(symbol)) {
          // If variable has a transition to another rule
          if (parse_table[symbol].hasOwnProperty(token)) {
            const next = [...parse_table[symbol][token]].reverse();
            const action_token = new ActionToken({ label: symbol, size: next.length });
            stack.push(action_token);
            stack.push(...next);
          } else {
            throw new Error(`There is no transition for the production rule: [${symbol},${token}]`);
          }
        } else {
          // If none of the cases were encountered, something is very wrong, so bail.
          throw new Error(`No rules encountered when attempting to resolve Symbol '${symbol}' with token '${token}'`);
        }
    }

    parsed.push(token);
  }
}

module.exports = {
  stringParser
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);