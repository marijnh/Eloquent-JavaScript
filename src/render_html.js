let fs = require("fs"), mold = new (require("mold"))
let CodeMirror = require("codemirror/addon/runmode/runmode.node.js")
require("codemirror/mode/javascript/javascript.js")
require("codemirror/mode/xml/xml.js")
require("codemirror/mode/css/css.js")
require("codemirror/mode/htmlmixed/htmlmixed.js")

let tokens = require("./markdown").parse(fs.readFileSync(process.argv[2], "utf8"), {})

function escapeChar(ch) {
  return ch == "<" ? "&lt;" : ch == ">" ? "&gt;" : ch == "&" ? "&amp;" : "&quot;"
}
function escape(str) { return str.replace(/[<>&"]/g, escapeChar) }

function hashContent(token, firstLast) {
  let text = ""
  if (token.children) {
    for (let i = 0; i < token.children.length; i++)
      if (token.children[i].type == "text") text += token.children[i].content
  } else {
    text = token.content
  }
  if (firstLast) text = startAndEnd(text)

  let sum = require("crypto").createHash("sha1")
  sum.update(text)
  return sum.digest("base64").slice(0, 10)
}

function startAndEnd(text) {
  var words = text.split(/\W+/);
  if (!words[0]) words.shift();
  if (!words[words.length - 1]) words.pop();
  if (words.length <= 6) return words.join(" ");
  return words.slice(0, 3).join(" ") + " " + words.slice(words.length - 3).join(" ");
}

function highlight(lang, text) {
  if (lang == "html") lang = "text/html"
  let result = ""
  CodeMirror.runMode(text, lang, (text, style) => {
    let esc = escape(text)
    result += style ? `<span class="${style.replace(/^|\s+/g, "$&cm-")}">${esc}</span>` : esc
  })
  return result
}

let renderer = {
  code_inline(token) { return `<code>${escape(token.content)}</code>` },

  fence(token) {
    let focus = false, sandbox = null, lang = token.info.replace(/\s*\b(focus|sandbox-\w+)\b/g, (_, word) => {
      if (word == "focus") focus = true
      else sandbox = word.slice(8)
      return ""
    }) || "javascript"
    return `\n\n<pre class="snippet cm-s-default" data-language=${lang} ${focus ? " data-focus=true" : ""}${sandbox ? ` data-sandbox="${sandbox}"` : ""}id="c_${hashContent(token)}">${highlight(lang, token.content)}</pre>`
  },

  hardbreak() { return "<br>" },

  softbreak() { return " " },

  text(token) { return escape(token.content) },

  paragraph_open(token, array, index) { return `\n\n<p id="p_${hashContent(array[index + 1], true)}">` },

  paragraph_close() { return "</p>" },

  heading_open(token, array, index) { return `\n\n<${token.tag} id="h_${hashContent(array[index + 1])}">` },

  heading_close(token) { return `</${token.tag}>` },

  strong_open() { return "<strong>" },

  strong_close() { return "</strong>" },

  em_open() { return "<em>" },

  em_close() { return "</em>" },

  link_open(token) {
    let alt = token.attrGet("alt"), href= token.attrGet("href")
    return `<a href="${escape(href)}"${alt ? ` alt="${escape(alt)}"` : ""}>`
  },

  link_close() { return "</a>" },

  inline(token) { return renderArray(token.children) },

  meta() { return "" },
  meta_open() { return "" },
  meta_close() { return "" }
}

function render(token) {
}

function renderArray(tokens) {
  let result = ""
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i], f = renderer[token.type]
    if (!f) throw new Error("No render function for " + token.type)
    result += f(token, tokens, i)
  }
  return result
}

let args = {}
for (let i = 0; i < tokens.length; i++) {
  let tok = tokens[i]
  if (tok.type == "meta" && tok.attrGet("data")._ == "meta") {
    let data = tok.attrGet("data")
    for (let prop in data) args[prop] = data[prop]
  } else if (tok.tag == "h1") {
    if (tokens[i + 2].tag != "h1") throw new Error("Complex H1 not supported")
    args.title = tokens[i + 1].children[0].content
    tokens.splice(i--, 3)
  }
}
args.content = renderArray(tokens)

let template = mold.bake("chapter", fs.readFileSync(__dirname + "/chapter.html", "utf8"))

console.log(template(args))
