var marked     = require('marked')
var c          = require('chalk')
var u          = require('unescape')
var wrap       = require('word-wrap')
var renderer   = new marked.Renderer()
var width      = process.stdout.columns
module.exports = md

function md (text) {
  return marked(text, { renderer: renderer })
}

// Cool renderer

renderer.code = function(code, lang, escaped) {
  var lines = wrap(code, {indent: "\r ", width: (width - 3)}).split(/\n/)
  var max = Math.max.apply(Math, lines.map(function(l) { return l.length }))
  var lines = lines.map(function(line) {
    if(!line) return null
    if(line.length < max) {
      line = line + (new Array(max - line.length + 1).join(" "))
    }
    return line + " "
  }).filter(function(val) { return val !== null })
  code = lines.join("\n")
  return "\n" + c.inverse(code) + "\n"
}

renderer.blockquote = function(quote) {
  quote = wrap(quote, {indent: '> ', width: width, newline: "> "})
  return quote + "\n"
}

renderer.html = function(html) {
  return html + "\n"
}

renderer.heading = function(text, level, raw) {
  text = new Array(level + 1).join("#") + " " + text
  return "\n" + c.underline.white(text) + "\n"
}

renderer.hr = function() {
  return "<hr>\n"
}

renderer.list = function(body, ordered) {
  var i = 1
  var items = body.split("\n").length
  var indentation = ordered ? (items.toString().length + 2) : 2

  body = body.split("\n").map(function(item) {
    var ilength = i.toString().length
    var prefix = ordered ? (i + "." + many(" ", indentation - (ilength) - 1)) : "- "
    i++
    return wrap(item, {
      indent: prefix, 
      width: width, newline: "\n" + many(" ", indentation)}
    )
  }).join("\n")
  return "\n" + body + "\n"
}

renderer.listitem = function(text) {
  return u(text) + "\n"
}

renderer.paragraph = function(text) {
  return "\n" + u(wrap(text.split("\n").join(""), {indent: "\r", width: width})) + "\n"
}

renderer.table = function(header, body) {
  return header + "\n"
}

renderer.tablerow = function(content) {
  return content + "\n"
}

renderer.tablecell = function(content, flags) {
  return content + "\n"
}

renderer.strong = function(text) {
  return text + "\n"
}

renderer.em = function(text) {
  return text + "\n"
}

renderer.codespan = function(text) {
  return c.inverse(padded(text))
}

renderer.br = function() {
  return  "<br>\n"
}

renderer.del = function(text) {
  return c.dim("~" + text + "~")
}

renderer.link = function(href, title, text) {
  return c.cyan(text)
}

renderer.image = function(href, title, text) {
  text = "✖ IMG[" + title + "] ✖"
  return c.bgRed.white(padded(text))
}

function padded(text) {
  return " " + text + " "
}

function many(str, times) {
  return (new Array(times + 1)).join(str)
}