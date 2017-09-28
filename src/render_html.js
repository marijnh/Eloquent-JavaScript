let fs = require("fs"), mold = new (require("mold"))
let {transformTokens} = require("./transform")
let CodeMirror = require("codemirror/addon/runmode/runmode.node.js")
require("codemirror/mode/javascript/javascript.js")
require("codemirror/mode/xml/xml.js")
require("codemirror/mode/css/css.js")
require("codemirror/mode/htmlmixed/htmlmixed.js")

let {tokens, metadata} = transformTokens(require("./markdown").parse(fs.readFileSync(process.argv[2], "utf8"), {}), {
  defined: ["interactive", "html"],
  ids: true,
  index: false
})

function escapeChar(ch) {
  return ch == "<" ? "&lt;" : ch == ">" ? "&gt;" : ch == "&" ? "&amp;" : "&quot;"
}
function escape(str) { return str.replace(/[<>&"]/g, escapeChar) }

function highlight(lang, text) {
  if (lang == "html") lang = "text/html"
  let result = ""
  CodeMirror.runMode(text, lang, (text, style) => {
    let esc = escape(text)
    result += style ? `<span class="${style.replace(/^|\s+/g, "$&cm-")}">${esc}</span>` : esc
  })
  return result
}

function anchor(token) {
  return token.hashID ? `<a class="${token.hashID.charAt(0)}_ident" id="${token.hashID}" href="#${token.hashID}"></a>` : ""
}

function attrs(token) {
  return token.attrs ? token.attrs.map(([name, val]) => ` ${name}="${escape(val)}"`).join("") : ""
}

let renderer = {
  code_inline(token) { return `<code>${escape(token.content)}</code>` },

  fence(token) {
    let focus = false, sandbox = null, lang = token.info.replace(/\s*\b(focus|sandbox-\w+)\b/g, (_, word) => {
      if (word == "focus") focus = true
      else sandbox = word.slice(8)
      return ""
    }) || "javascript"
    return `\n\n<pre${attrs(token)} class="snippet cm-s-default" data-language=${lang} ${focus ? " data-focus=true" : ""}${sandbox ? ` data-sandbox="${sandbox}"` : ""}>${anchor(token)}${highlight(lang, token.content)}</pre>`
  },

  hardbreak() { return "<br>" },

  softbreak() { return " " },

  text(token) { return escape(token.content) },

  paragraph_open(token) { return `\n\n<p${attrs(token)}>${anchor(token)}` },

  paragraph_close() { return "</p>" },

  heading_open(token) { return `\n\n<${token.tag}${attrs(token)}>${anchor(token)}` },

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

  meta_figure(token) {
    let {url, alt} = token.args[0]
    return `<div class="image"${attrs(token)}><img src="${escape(url)}" alt="${escape(alt)}"></div>`
  },

  meta_quote_open() { return "\n\n<blockquote>" },

  meta_quote_close(token) {
    let {author, title} = token.args[0]
    return (author ? `\n\n<footer>${escape(author)}${title ? `, <cite>${escape(title)}</cite>` : ""}` : "") +
      "\n\n</blockquote>"
  }
}

function renderArray(tokens) {
  let result = ""
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i], f = renderer[token.type]
    if (!f) throw new Error("No render function for " + token.type)
    result += f(token)
  }
  return result
}

metadata.content = renderArray(tokens)

let template = mold.bake("chapter", fs.readFileSync(__dirname + "/chapter.html", "utf8"))

console.log(template(metadata))
