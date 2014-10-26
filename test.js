var fs = require('fs')
var tomd = require('./index.js')

fs.readFile('./test.md', function(err, data) {
  var doo = tomd(data.toString())
  console.log(doo)
})
