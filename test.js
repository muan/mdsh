var fs = require('fs')
var tomd = require('./index.js')

fs.readFile('./test.md', function(err, data) {
  console.log(tomd(data.toString()))
})
