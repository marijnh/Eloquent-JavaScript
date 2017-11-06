let {parse} = require("acorn")

module.exports = function(code) {
  let ast
  try { ast = parse(code) }
  catch(_) { return code }

  let patches = []
  ast.body.forEach(node => {
    if (node.type == "VariableDeclaration" && node.kind != "var")
      patches.push({from: node.start, to: node.start + node.kind.length, text: "var"})
    if (node.type == "ClassDeclaration")
      patches.push({from: node.start, to: node.start, text: "var " + node.id.name + " = "})
  })

  patches.sort((a, b) => a.from - b.from || (a.to || a.from) - (b.to || b.from))
  let out = "", pos = 0
  patches.forEach(({from, to, text}) => {
    out += code.slice(pos, from) + text
    pos = to
  })
  out += code.slice(pos)
  return out
}
