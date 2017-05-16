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


class Node {
  constructor(label) {
    this.label = label
  }

  evaluate() {
    return null;
  }
}


class CompoundStatementNode extends Node {
  constructor(left, right) {
    super("Compound Statement");
    this.left  = left;
    this.right = right;
  }

  evaluate() {
    this.left.evaluate()
    this.right && this.right.evaluate()
  }
}

class StatementNode extends Node {
  constructor(statement) {
    super("Statement")
    this.statement = statement;
  }

  evaluate() {
    this.statement && this.statement.evaluate()
  }
}


class PrintStatementNode extends Node {
  constructor(value) {
    super("Print Statement")
    this.value = value;
  }

  evaluate() {
    console.log(this.value.evaluate())
  }
}

class IfStatementNode extends Node {
  constructor(condition,if_body,else_body) {
    super("If Statement")
    this.condition = condition;
    this.if_body   = if_body;
    this.else_body = else_body;
  }

  evaluate() {
    if (this.condition.evaluate()) {
      this.if_body.evaluate()
    }
    else {
      if (this.else_body !== null) {
        this.else_body.evaluate()
      }
    }
  }
}




class ExpressionNode extends Node {
  constructor(expression) {
    super("Expression")
    this.expression = expression
  }

  evaluate() {
    return this.expression.evaluate()
  }
}

class BinaryExpressionNode extends Node {
  constructor(left, operator, right) {
    super("Binary Expression")
    this.left     = left;
    this.operator = operator;
    this.right    = right;
  }

  evaluate() {
    const [lhs, op, rhs] = [this.left.evaluate(), this.operator.evaluate(), this.right.evaluate()];
    switch (op) {
      case '+':
        return lhs + rhs

      case '-':
        return lhs - rhs

      case '*':
        return lhs * rhs
    }
  }
}

class OperatorNode extends Node {
  constructor(operator) {
    super("Operator")
    this.operator = operator;
  }

  evaluate() {
    return this.operator
  }
}

class NumberNode extends Node {
  constructor(value) {
    super("Number")
    this.value = (+value); // +variable will cast to a number if possible
  }

  evaluate() {
    return this.value
  }
}

class LetterSequence extends Node {
  constructor(letter_node, next) {
    super("Letter Sequence")
    this.letter_node = letter_node;
    this.next        = next;
  }

  evaluate() {
    if (!this.letter_node) {
      return ''
    }
    if (!this.next) {
      return this.letter_node.evaluate()
    }

    return this.letter_node.evaluate() + this.next.evaluate()

  }
}

class LetterNode extends Node {
  constructor(letter) {
    super("Letter")
    this.letter = letter
  }

  evaluate() {
    return this.letter
  }
}

class ValueNode extends Node {
  constructor(value) {
    super("Value")
    this.value = value;
  }

  evaluate() {
    return this.value.evaluate()
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
  ValueNode
}