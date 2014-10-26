var fs = require('fs')
var mdsh = require('./index.js')

fs.readFile('./readme.md', function(err, data) {
  console.log(mdsh(data.toString()))
})
