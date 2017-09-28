const PJSON = require("./pseudo_json")
const markdownIt = require("markdown-it")

function parseData(str) {
  let tag = /^\s*(\w+)\s*(,\s*)?/.exec(str), obj
  if (!tag) return null
  if (tag[0].length == str.length) {
    obj = {}
  } else if (tag[2]) {
    try { obj = PJSON.parse("{" + str.slice(tag[0].length) + "}") }
    catch(_) { return null }
  } else {
    obj = {}
    try { obj.args = PJSON.parse("[" + str.slice(tag[0].length) + "]") }
    catch(_) { return null }
  }
  obj._ = tag[1]
  return obj
}

function parseBlockMeta(state, startLine, endLine) {
  let pos = state.bMarks[startLine] + state.tShift[startLine]
  let max = state.eMarks[startLine]
  // Check for code block indentation or end of input
  if (state.sCount[startLine] - state.blkIndent >= 4 || pos + 4 > max) return false

  // Test for `{{` opening marker
  if (state.src.charCodeAt(pos) != 123 || state.src.charCodeAt(pos + 1) != 123) return false

  let content = state.src.slice(pos + 2, max), single

  if (single = /\}\}\s*/.exec(content)) {
    let data = parseData(content.slice(0, single.index))
    if (!data) return false
    let token = state.push("meta_" + data._, null, 0)
    token.map = [startLine, startLine + 1]
    token.data = data
    state.line++
    return true
  }

  let data = parseData(content)
  if (!data) return false

  let line = startLine + 1, depth = 0
  for (; line < endLine; line++) {
    if (line == endLine) throw new SyntaxError("Unterminated meta block")
    let start = state.bMarks[line] + state.tShift[line]
    let after = state.src.slice(start, start + 2)
    if (after == "{{" && !/\}\}\s*$/.test(state.src.slice(start, state.eMarks[line]))) depth++
    else if (after == "}}") {
      if (depth) depth--
      else break
    }
  }

  let token = state.push("meta_" + data._ + "_open", null, 1)
  token.map = [startLine, line + 1]
  token.data = data
  state.md.block.tokenize(state, startLine + 1, line)
  state.push("meta_" + data._ + "_close", null, -1).data = data
  state.line = line + 1

  return true
}

function parseInlineMeta(state, silent) {
  if (state.src.charCodeAt(state.pos) != 91) return false // '['

  let max = state.posMax
  let end = state.md.helpers.parseLinkLabel(state, state.pos, false)
  if (end < 0) return false

  let pos = end + 1
  if (pos >= max || state.src.charCodeAt(pos) != 123) return false // '{'

  let metaEnd = pos + 1, depth = 0
  for (;; metaEnd++) {
    if (metaEnd == max) return false
    let code = state.src.charCodeAt(metaEnd)
    if (code == 125) { // '}'
      if (depth) depth--
      else break
    } else if (code == 123) {
      depth++
    }
  }

  let data = parseData(state.src.slice(pos + 1, metaEnd))
  if (!data) return false

  state.pos++
  state.posMax = end
  if (!silent) state.push("meta_" + data._ + "_open", null, 1).data = data
  state.md.inline.tokenize(state)
  if (!silent) state.push("meta_" + data._ + "_close", null, -1).data = data
  state.pos = metaEnd + 1
  state.posMax = max

  return true
}

function parseIndexTerm(state, silent) {
  let max = state.posMax
  // Check for opening '(('
  if (state.pos >= max + 4 || state.src.charCodeAt(state.pos) != 40 || state.src.charCodeAt(state.pos + 1) != 40) return false

  let start = state.pos + 2, end = start
  for (;; end++) {
    if (end >= max - 1) return false
    if (state.src.charCodeAt(end) == 41 && state.src.charCodeAt(end + 1)) break
  }

  let term = state.src.slice(start, end)

  if (!silent) state.push("meta_index", null, 0).data = {_: "index", args: [term]}
  state.pending += term
  state.pos = end + 2
  return true
}

let TERMINATOR_RE = /[\n!#$%&*+\-:<=>@\[\\\]^_`{}~]|\(\(/

function newText(state, silent) {
  let len = state.src.slice(state.pos, state.posMax).search(TERMINATOR_RE)
  if (len == 0) return false
  if (len == -1) len = state.posMax - state.pos
  if (!silent) state.pending += state.src.slice(state.pos, state.pos + len)
  state.pos += len
  return true
}

function plugin(md) {
  md.block.ruler.before("code", "meta", parseBlockMeta)
  md.inline.ruler.before("link", "meta", parseInlineMeta)
  md.inline.ruler.at("text", newText)
  md.inline.ruler.before("strikethrough", "index_term", parseIndexTerm)
}

module.exports = markdownIt().use(plugin)
