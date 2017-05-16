const {stringParser}                                 = require('./parser.js')
const {nodeFactory}                                  = require('./node_factory.js')
const {END_OF_STACK, START_SYMBOL, table, terminals} = require('./parse_table.js')


const input_string = `
if 1 {print "aaabbbb";}
if (0-2) {print 2;} else { print "b";}
if 2 {print (3 * (3 * 3));}
`

// Instantiate the generator function
const gen = stringParser({
  string      : input_string,
  start_symbol: START_SYMBOL,
  stack_end   : END_OF_STACK,
  terminals,
  parse_table : table,
  node_factory: nodeFactory
})

// Initialise the generator
let next = gen.next()

// To make the output pretty, we'll gather it all up then process it
const log = []

// Loop until the generator has no more to yield (parsed through the whole string)
// or until it throws an error, to which we can conclude the string is rejected.
try {
  let tree;
  while (!next.done) {
    const {stack, remaining, tree_stack} = next.value
    tree                                 = tree_stack;

    log.push([remaining, [...stack].reverse().join('')])
    next = gen.next()
  }

  if (log.length > 0) {
    const max_pad_length = log[0][0].length
    log.forEach(x => {
      console.log(x[0] + " ".repeat(max_pad_length - x[0].length) + "\t" + x[1])
    })
  }

  tree[0].evaluate()


  console.log('ACCEPTED')
}
catch (e) {
  console.log('REJECTED')
}



// on accept state is when to redraw the tree in d3.js
