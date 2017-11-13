const PJSON = require("./pseudo_json")
let fs = require("fs"), mold = new (require("mold-template"))
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
  return token.attrs ? token.attrs.map(([name, val]) => ` ${name}="${escape(String(val))}"`).join("") : ""
}

let renderer = {
  fence(token) {
    let config = /\S/.test(token.info) ? PJSON.parse(token.info) : {}
    let lang = config.lang || "javascript"
    return `\n\n<pre${attrs(token)} class="snippet cm-s-default" data-language=${lang} ${config.focus ? " data-focus=true" : ""}${config.sandbox ? ` data-sandbox="${config.sandbox}"` : ""}>${anchor(token)}${highlight(lang, token.content.trim())}</pre>`
  },

  hardbreak() { return "<br>" },
  softbreak() { return " " },

  text(token) { return escape(token.content) },

  paragraph_open(token) { return `\n\n<p${attrs(token)}>${anchor(token)}` },
  paragraph_close() { return "</p>" },

  heading_open(token) { return `\n\n<${token.tag}${attrs(token)}>${anchor(token)}` },
  heading_close(token) { return `</${token.tag}>` },

  bullet_list_open(token) { return `\n\n<ul${attrs(token)}>` },
  bullet_list_close() { return `</ul>` },

  ordered_list_open(token) { return `\n\n<ol${attrs(token)}>` },
  ordered_list_close() { return `\n\n</ol>` },

  list_item_open() { return "\n\n<li>" },
  list_item_close() { return "</li>" },

  table_open() { return "\n\n<table>" },
  table_close() { return "\n\n</table>" },
  tbody_open() { return "" },
  tbody_close() { return "" },
  tr_open() { return "\n\n<tr>" },
  tr_close() { return "\n\n</tr>" },
  td_open() { return "<td>" },
  td_close() { return "</td>" },

  html_block(token) { return token.content },

  code_inline(token) { return `<code>${escape(token.content)}</code>` },

  strong_open() { return "<strong>" },
  strong_close() { return "</strong>" },

  em_open() { return "<em>" },
  em_close() { return "</em>" },

  sub_open() { return "<sub>" },
  sub_close() { return "</sub>" },

  sup_open() { return "<sup>" },
  sup_close() { return "</sup>" },

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
    let {author, title} = token.args[0] || {}
    return (author ? `\n\n<footer>${escape(author)}${title ? `, <cite>${escape(title)}</cite>` : ""}` : "") +
      "\n\n</blockquote>"
  },

  meta_hint_open() { return "\n\n<div class=solution><div class=solution-text>" },
  meta_hint_close() { return "\n\n</div></div>" }
}

function renderArray(tokens) {
  let result = ""
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i], f = renderer[token.type]
    if (!f) throw new Error("No render function for " + token.type + " " + tokens.slice(i + 1).map(t => t.type).join())
    result += f(token)
  }
  return result
}

metadata.content = renderArray(tokens)

let template = mold.bake("chapter", fs.readFileSync(__dirname + "/chapter.html", "utf8"))

console.log(template(metadata))
