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


class VariableStack{
  constructor(){
    this.stack = [{}]
  }

  pushScope(){
    this.stack.push({})
  }

  popScope(){
    if(this.stack.length > 1){
      this.stack.pop()
    }
  }

  getVariable(name){
    let level = this.stack.length - 1;


    while(level >= 0){
      if(this.stack[level].hasOwnProperty(name)){
        return this.stack[level][name]
      }

      level--;
    }

    throw new Error(`No variable named '${name}'`)
  }

  setVariable(name,value){
    this.stack[this.stack.length - 1][name] = value
  }

}

const variable_stack = new VariableStack()


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
      variable_stack.pushScope()
      this.if_body.evaluate()
      variable_stack.popScope()

    }
    else {
      if (this.else_body !== null) {
        variable_stack.pushScope()
        this.else_body.evaluate()
        variable_stack.popScope()
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

class VariableNameSequenceNode extends Node{
  constructor(character_node, next) {
    super("Variable Name Sequence")
    this.character_node = character_node;
    this.next        = next;
  }

  evaluate() {
    if (!this.character_node) {
      return ''
    }
    if (!this.next) {
      return this.character_node.evaluate()
    }

    return this.character_node.evaluate() + this.next.evaluate()

  }
}

class VariableNode extends Node{
  constructor(name_node){
    super("Variable")
    this.name = name_node.evaluate();
  }

  evaluate(){
    return variable_stack.getVariable(this.name)
  }
}

class VariableAssignmentNode extends Node{
  constructor(var_node, value_node){
    super("Variable Assignment")
    this.var_node = var_node
    this.value = value_node
  }

  evaluate(){
    variable_stack.setVariable(this.var_node.name, this.value.value.evaluate())
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
}