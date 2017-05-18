const nodes = require('./nodes.js')

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
function nodeFactory({label, children = []}) {
  switch (label) {

    case 'F':
      // Variable
      return new nodes.VariableNode(children[1]);
      console.log({label,children})
      throw new Error()
      return null
    case 'G':
      return new nodes.VariableAssignmentNode(children[0],children[2])
    case 'H':
      if(children.length === 0){
        return null
      }
      else if (children.length === 1) {
        return new nodes.VariableNameSequenceNode(children[0])

      }
      else { // length must be 2
        return new nodes.VariableNameSequenceNode(children[0], children[1])
      }




      // Variable Name
      return null

    case 'V':
      return new nodes.NumberNode(children[0])
    case 'E':
      if (children[0] instanceof nodes.Node) {
        return new nodes.ExpressionNode(children[0])
      }
      if (children[0] === '(') {
        return new nodes.BinaryExpressionNode(children[1], children[2], children[3])
      }

      throw new Error("Problem resolving E")

    case 'N':
      return new nodes.PrintStatementNode(children[5])

    case 'L':
      return new nodes.StatementNode(children[0])

    // Since this is the right recursive step, we will give back another compound statement
    case 'R':
      let [child_1, child_2] = children
      if (children.length > 0) {
        return new nodes.CompoundStatementNode(child_1, child_2)
      }
      else {
        return null
      }

    case 'C':
      return new nodes.IfStatementNode(children[2], children[4], children[6])

    case 'D':
      if (children.length > 0) {
        return children[5]
      }

      return null

    case 'P':
      return new nodes.CompoundStatementNode(children[0], children[1])

    case 'O':
      return new nodes.OperatorNode(children[0])

    case 'M':
      if (children[0] === '"') {
        return new nodes.ValueNode(children[1])
      }
      else {
        return new nodes.ValueNode(children[0])
      }

    case 'T':
      return new nodes.LetterNode(children[0])

    case 'W':
      if (children.length === 0) {
        return null

      }
      else if (children.length === 1) {
        return new nodes.LetterSequence(children[0])

      }
      else { // length must be 2
        return new nodes.LetterSequence(children[0], children[1])
      }

    default:
      throw new Error(`No factory method found for '${label}'`)
  }
}


module.exports = {nodeFactory}