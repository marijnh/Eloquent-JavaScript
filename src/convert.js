let fs = require("fs")

let text = fs.readFileSync(process.argv[2], "utf8")

function processIndexTerm(term) {
  term = term.replace(/\+\+\+,\+\+\+/g, "×")
  let terms = term.split(",").map(t => /\W/.test(t) ? JSON.stringify(t.replace(/×/g, ",").replace(/\s/g, " ")) : t)
  return terms.length == 1 ? terms[0] : "[" + terms.join(", ") + "]"
}

text = text
  .replace(/^(:\w+:\s*.+\n)+/, function(meta) {
    let re = /(?:^|\n):(\w+):\s*(.+)/g, m
    let tag = "{{meta"
    while (m = re.exec(meta))
      tag += ", " + m[1] + ": " + m[2]
    return tag + "}}\n"
  })
  .replace(/\n(=+) (.*?) =+\n/g, function(_, depth, title) {
    return "\n" + "#".repeat(depth.length) + " " + title + "\n"
  })
  .replace(/\nimage::([^\]]+)\[(.*?)\]/g, function(_, url, meta) {
    return "\n{{figure, url: " + JSON.stringify(url) + ", " + meta.replace(/="/g, ": \"") + "}}"
  })
  .replace(/\n(\[chapterquote=.*?\]\n)?\[quote, ([^\]]+)\]\n____\n([^]*?)____\n/g, function(_, chapter, author, content) {
    let match = /([^,]+), (.+)/.exec(author), title = null
    if (match) { title = match[2]; author = match[1] }
    return "\n{{quote" + (chapter ? ", chapter: true" : "") + ", author: " + JSON.stringify(author) +
      (title ? ", title: " + JSON.stringify(title) : "") + "\n\n" + content + "\n}}\n"
  })
  .replace(/\n\n+((?:(?!\n\n)[^])*?\(\(\((?:(?!\n\n)[^])*)/g, function(_, para) {
    let terms = []
    para = para.replace(/\(\(\(((?:\([^\)]*\)|[^])*?)\)\)\)/g, function(_, content) {
      terms.push(content)
      return ""
    }).replace(/^\s*/, "")
    return "\n\n{{index " + terms.map(processIndexTerm).join(", ") + "}}\n\n" + para
  })
  .replace(/\bindexsee:\[(.*?),\s*(.*?)\]\s*/g, function(_, term, ref) {
    return "{{indexsee " + processIndexTerm(term) + ", " + processIndexTerm(ref) + "}}\n\n"
  })
  .replace(/\n(?:\[sandbox="(.*?)"\]\n)?(?:\[source,(.*?)\]\n)?(\[focus=.*?\]\n)?(?:---+|\+\+\++)\n([^]*?)\n(?:---+|\+\+\++)\n/g, function(_, sandbox, type, focus, content) {
    let params = []
    if (type != "javascript") params.push(type || "null")
    if (focus) params.push("focus")
    if (sandbox) params.push("sandbox-" + sandbox)
    return "\n```" + params.join(" ") + "\n" + content + "\n```\n"
  })
  .replace(/\n\/\/ (?:(start_code)|test: (.*)|include_code (.*))/g, function(_, startCode, test, includeCode) {
    if (startCode) return "\n{{startCode}}"
    if (test) return "\n{{test " + test + "}}"
    return "\n{{includeCode " + JSON.stringify(includeCode) + "}}"
  })
  .replace(/\blink:([^\[]+)\[(.*?)\]/g, function(_, url, content) {
    return "[" + content + "](" + url + ")"
  })
  .replace(/\nifdef::(\w+?)_target\[\]\n([^]*?)\nendif::.*/g, function(_, type, content) {
    return "\n{{if " + type + "\n" + content + "\n}}"
  })
  .replace(/\+\+(?! |\))((?:(?!\n\n)[^])+)\+\+/g, function(_, text) {
    return "_" + text + "_"
  })
  .replace(/__((?:(?!\n\n)[^])+)__/g, function(_, text) {
    return "_" + text + "_"
  })
  .replace(/\n\[\[(.*?)\]\]\n/g, function(_, name) {
    return `\n{{id ${/\W/.test(name) ? JSON.stringify(name) : name}}}\n`
  })
  .replace(/\[sic]/, "\\[sic]")

console.log(text)
