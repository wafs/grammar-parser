/**
 * Helper class to create a placeholder token that will eventually resolve a particular node based on the
 * label and children.
 * @param label
 * @param size
 */
class ActionToken {
  constructor({label, size}) {
    this.label = label
    this.size  = size
  }

  // Overriding to hide it from output
  toString(){
    return ''
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
function *stringParser({string, parse_table, terminals, start_symbol, node_factory, stack_end}) {
  const input_string = string.replace(/\s+/g, '')
  const input_stack  = [stack_end, ...input_string.split('').reverse()]
  const stack        = [stack_end,  start_symbol]
  const parsed       = []
  const tree_stack   = []


  while (input_stack.length > 0) {
    const token = input_stack.pop()

    while (true) {

      // If the top of the stack is not an ActionToken, yield the current status of the parser
      if(!(stack[stack.length-1] instanceof ActionToken)){
        const remaining = input_string.substring(parsed.length) + stack_end
        yield {token, stack, remaining, tree_stack}
      }

      let symbol = stack.pop()

      // If we encounter an ActionToken, convert it into a node via the factory and keep looping through symbols
      if (symbol instanceof ActionToken) {
        const children = []

        for(let i = 0; i < symbol.size; i++){
          children.push(tree_stack.pop())
        }

        children.reverse()
        const n = node_factory({label:symbol.label, children})
        tree_stack.push(n)
        continue
      }


      // If the token and symbol match (Matching terminals), add it to the tree stack and break the loop
      if (token === symbol) {
        if (terminals[token] === true) {
          tree_stack.push(token)
          break
        }

        if (token === stack_end) {
          break
        }
      }

      // If the symbol is a variable, attempt to resolve it or fail if there is no production rule for it
      else if (parse_table.hasOwnProperty(symbol)) {
        // If variable has a transition to another rule
        if (parse_table[symbol].hasOwnProperty(token)) {
          const next         = [...parse_table[symbol][token]].reverse()
          const action_token  = new ActionToken({label: symbol, size: next.length})
          stack.push(action_token)
          stack.push(...next)
        }
        else {
          throw new Error(`There is no transition for the production rule: [${symbol},${token}]`)
        }
      }
      else {
        // If none of the cases were encountered, something is very wrong, so bail.
        throw new Error(`No rules encountered when attempting to resolve Symbol '${symbol}' with token '${token}'`)
      }
    }

    parsed.push(token)

  }
}


module.exports = {
  stringParser
}