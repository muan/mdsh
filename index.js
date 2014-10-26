var marked     = require('marked')
var c          = require('chalk')
var u          = require('unescape')
var wrap       = require('word-wrap')
var renderer   = new marked.Renderer()
var width      = process.stdout.columns
var Table      = require('cli-table')
var links      = []
module.exports = md

function md (text) {
  return marked(text, { renderer: renderer }) + appendix(links)
}

// Cool renderer

renderer.code = function(code, lang, escaped) {
  code = wrap(code, {width: width})
  return "\n" + c.yellow(code) + "\n"
}

renderer.blockquote = function(quote) {
  quote = wrap(quote, {indent: '> ', width: width, newline: "> "})
  return quote + "\n"
}

renderer.html = function(html) {
  return html
}

renderer.heading = function(text, level, raw) {
  text = many("#", level) + " " + text
  return "\n" + u(c.underline.bold.white(text)) + "\n"
}

renderer.hr = function() {
  return "\n" + many("*", width) + "\n"
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
      indent: item.match(/^- |^  /) ? "  " : prefix,
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
  var newtable = new Table({
    head: header.replace(/>>>/, "").split(",,,")
  })
  var arr = body.split(">>>")
  arr.map(function(row){
    if(!row) return
    newtable.push(row.split(",,,"))
  })
  return "\n" + newtable.toString() + "\n"
}

renderer.tablerow = function(content) {
  return content.replace(/,,,$/, '') + ">>>"
}

renderer.tablecell = function(content, flags) {
  return content + ",,,"
}

renderer.strong = function(text) {
  return c.bold(text)
}

renderer.em = function(text) {
  return c.green.italic(text)
}

renderer.codespan = function(text) {
  return c.yellow(text)
}

renderer.br = function() {
  return  "\n"
}

renderer.del = function(text) {
  return c.dim("~" + text + "~")
}

renderer.link = function(href, title, text) {
  text = text + " [" + links.length + "]"
  links.push(href)
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

function appendix(links) {
  var i = 0
  return renderer.hr() + "\n" + links.map(function(url) {
    return "[" + i++ + "] " + url
  }).join("\n") + "\n"
}