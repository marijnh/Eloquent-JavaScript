let fs = require("fs")

let text = fs.readFileSync(process.argv[2], "utf8")

function processIndexTerm(term) {
  term = term.replace(/\+\+\+,\+\+\+/g, "×")
  let terms = term.split(",").map(t => /\W/.test(t) ? JSON.stringify(t.replace(/×/g, ",").replace(/\s/g, " ")) : t)
  return terms.length == 1 ? terms[0] : "[" + terms.join(", ") + "]"
}

function maybeQuote(value) {
  return /\W/.test(value) ? JSON.stringify(value) : value
}

text = text
  .replace(/^(:\w+:\s*.+\n)+/, function(meta) {
    let re = /(?:^|\n):(\w+):\s*(.+)/g, m, props = []
    while (m = re.exec(meta)) props.push(m[1] + ": " + (m[1] == "load_files" ? m[2] : maybeQuote(m[2])))
    return `{{meta {${props.join(", ")}}}}\n`
  })
  .replace(/\n(=+) (.*?) =+\n/g, function(_, depth, title) {
    return "\n" + "#".repeat(depth.length) + " " + title + "\n"
  })
  .replace(/\nimage::([^\[]+)\[(.*?)\]\n/g, function(_, url, meta) {
    return "\n{{figure {url: " + JSON.stringify(url) + ", " + meta.replace(/="/g, ": \"") + "}}}\n"
  })
  .replace(/\n(\[chapterquote=.*?\]\n)?(?:\[quote,\s*([^\]]+)\]\n)?___+\n([^]*?)___+\n/g, function(_, chapter, author, content) {
    let props = []
    if (author) {
      let match = /([^,]+), (.+)/.exec(author), title = null
      if (match) props.push(`author: ${JSON.stringify(match[1])}`, `title: ${JSON.stringify(match[2])}`)
      else props.push(`author: ${JSON.stringify(author)}`)
    }
    if (chapter) props.push("chapter: true")
    return `\n{{quote${props.length ? " {" + props.join(", ") + "}" : ""}\n\n${content}\nquote}}\n`
  })
  .replace(/\n\n+((?:(?!\n\n)[^])*?\(\(\((?:(?!\n\n)[^])*)/g, function(all, para) {
    let terms = []
    para = para.replace(/\(\(\(((?:\([^\)]*\)|[^])*?)\)\)\)/g, function(_, content) {
      terms.push(content)
      return ""
    }).replace(/^\s*/, "")
    if (terms.length) return "\n\n{{index " + terms.map(processIndexTerm).join(", ") + "}}\n\n" + para
    else return all
  })
  .replace(/\bindexsee:\[(.*?),\s*(.*?)\]\s*/g, function(_, term, ref) {
    return "{{indexsee " + processIndexTerm(term) + ", " + processIndexTerm(ref) + "}}\n\n"
  })
  .replace(/\n((?:\/\/ .*\s*)*)(?:\[sandbox="(.*?)"\]\n)?(?:\[source,(.*?)\]\n)?(\[focus=.*?\]\n)?(?:---+|\+\+\++)\n([^]*?)\n(?:---+|\+\+\++)\n/g, function(_, comments, sandbox, type, focus, content) {
    let params = [], m
    if (type != "javascript") params.push(`lang: ${maybeQuote(type || "null")}`)
    if (focus) params.push("focus: true")
    if (sandbox) params.push("sandbox: " + JSON.stringify(sandbox))
    if (m = /\/\/ start_code\s*(.*)/.exec(comments))
      params.push(`startCode: ${maybeQuote(m[1] || "true")}`)
    if (m = /\/\/ include_code\s*(.*)/.exec(comments))
      params.push(`includeCode: ${maybeQuote(m[1] || "true")}`)
    if (m = /\/\/ test:\s*(.*)/.exec(comments))
      params.push(`test: ${maybeQuote(m[1])}`)
    return `\n\`\`\`${params.length ? `{${params.join(", ")}}` : ""}\n${content}\n\`\`\`\n`
  })
  .replace(/\blink:([^\[]+)\[(.*?)\]/g, function(_, url, content) {
    return "[" + content + "](" + url + ")"
  })
  .replace(/\nifdef::(\w+?)_target\[\]\n([^]*?)\nendif::.*/g, function(_, type, content) {
    return "\n{{if " + type + "\n" + content + "\nif}}"
  })
  .replace(/\+\+(?! |\))((?:(?!\n\n)[^])+)\+\+/g, function(_, text) {
    return "_" + text + "_"
  })
  .replace(/__((?:(?!\n\n)[^])+)__/g, function(_, text) {
    return "_" + text + "_"
  })
  .replace(/\n\[\[(.*?)\]\]\n/g, function(_, name) {
    return `\n{{id ${maybeQuote(name)}}}\n`
  })
  .replace(/\n!!hint!!\n([^]+?)\n!!hint!!/g, function(_, content) {
    return `\n{{hint\n${content}\nhint}}`
  })
  .replace(/\[sic]/, "\\[sic]")

console.log(text)
