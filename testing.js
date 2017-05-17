const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec;


const target_dirs = fs.readdirSync(path.resolve('./tests'))


const tests = {}

// Preload all test data

target_dirs.forEach(x => {

})


for(const dir of target_dirs){
  const ext = dir.substring(dir.lastIndexOf('.')+1)

  if(ext === 'out') {
    const base = dir.substring(0, dir.length - ext.length - 1)
    tests[base] = fs.readFileSync(path.resolve('./tests/' + dir)).toString()
  }
}

console.log('Running tests...')

for(const key in tests){
  const target = tests[key]
  exec(`node main.js tests/${key}.in eval`, (error, stdout,stderr) => {
    if (error) {
//      console.log({stderr})
      return;
    }

    const passed = stdout.trim() === target

    console.log(`${key}:\nExpected: ${target}\nReceived: ${stdout.trim()},Passed: ${passed}\n\n`)
  });
}
