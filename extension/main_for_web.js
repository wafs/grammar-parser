const {stringParser}                              = require('../parser.js')
const {nodeFactory}                               = require('../node_factory.js')
const {stack_end, start_symbol, table, terminals} = require('../parse_table.js')




window.parser = function(string){
// Instantiate the generator function
  const gen = stringParser({
    string,
    start_symbol,
    stack_end,
    terminals,
    parse_table : table,
    node_factory: nodeFactory
  })

  let next = gen.next()
  let tree;

  let history = []

  try {
    while (!next.done) {
      const {token, stack, remaining,tree_stack} = next.value
      tree = tree_stack;


      history.push({
        remaining: remaining,
        stack    : [...(stack.filter(x => typeof x === 'string'))].reverse().join(''),
        token    : token
      })

      next = gen.next()
    }


    return {
      accepted : true,
      history,
      tree
    }

  }catch (e){

    return {
      accepted : false,
      history,
      tree,
      error : e
    }

  }
}

// on accept state is when to redraw the tree in d3.js
