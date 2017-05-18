const {stringParser}                              = require('./parser.js')
const {nodeFactory}                               = require('./node_factory.js')
const {stack_end, start_symbol, table, terminals} = require('./parse_table.js')
const fs                                          = require('fs')
const path                                        = require('path')

// Collect command line args
const [, , file_name, eval_mode] = process.argv
const input_string               = fs.readFileSync(path.resolve(file_name)).toString();

// To check for all terminals being valid we are going to create a set out of the input string, then
// we are going to check if they're all in the terminals. Bail if invalid terminal is found.
(function () {
  const string_set = [...new Set(input_string.replace(/\s+/g, '').split(''))]
  for (const entry of string_set) {
    if (terminals[entry] !== true) {
      console.log('ERROR_INVALID_SYMBOL')
      process.exit()
    }
  }
})()


// Instantiate the generator function
const gen = stringParser({
  string      : input_string,
  start_symbol,
  stack_end,
  terminals,
  parse_table : table,
  node_factory: nodeFactory
})

// Initialise the generator
let next = gen.next()

// To make the output pretty, we'll gather it all up then process it
const log = []

function dumpLog(){
  const max_pad_length = log[0][0].length
  log.forEach(x => {
    console.log(x[0] + " ".repeat(max_pad_length - x[0].length) + "\t" + x[1])
  })
}

// Loop until the generator has no more to yield (parsed through the whole string)
// or until it throws an error, to which we can conclude the string is rejected.
try {
  let tree;
  while (!next.done) {
    const {stack, remaining, tree_stack} = next.value

    tree = tree_stack;
    log.push([remaining, [...stack].reverse().join('')])
    next = gen.next()
  }


  if (eval_mode === 'eval') {
    tree[0].evaluate()
  }
  else {

    dumpLog();
    console.log('ACCEPTED')
  }
}
catch (e) {
  dumpLog();
  console.log({e})
  console.log('REJECTED')
}