let fs = require("fs"), mold = new (require("mold"))

let tokens = require("./markdown").parse(fs.readFileSync(process.argv[2], "utf8"), {})

function escapeChar(ch) {
  return ch == "<" ? "&lt;" : ch == ">" ? "&gt;" : ch == "&" ? "&amp;" : "&quot;"
}
function escape(str) { return str.replace(/[<>&"]/g, escapeChar) }

let renderer = {
  code_inline(token) { return `<code>${escape(token.content)}</code>` },

  // FIXME languages
  fence(token) { return `\n\n<pre>${escape(token.content)}</pre>` },

  hardbreak() { return "<br>" },

  softbreak() { return " " },

  text(token) { return escape(token.content) },

  paragraph_open() { return "\n\n<p>" },

  paragraph_close() { return "</p>" },

  heading_open(token) { return `\n\n<${token.tag}>` },

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
  let f = renderer[token.type]
  if (!f) throw new Error("No render function for " + token.type)
  return f(token)
}

function renderArray(tokens) {
  let result = ""
  for (let i = 0; i < tokens.length; i++) result += render(tokens[i])
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
