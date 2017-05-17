const fs = require('fs')
const path = require('path')

const target_dirs = fs.readdirSync(path.resolve('./tests'))


const tests = {}

// Preload all test data
for(const dir of target_dirs){
  const ext = dir.substring(dir.lastIndexOf('.')+1)
  const base = dir.substring(0, dir.length - ext.length-1)

  if(!tests.hasOwnProperty(base)){
    tests[base] = {passed:false}
  }

  tests[base][ext] = fs.readFileSync(path.resolve('./tests/' + dir)).toString()
}

