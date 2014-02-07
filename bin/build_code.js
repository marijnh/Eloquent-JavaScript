var fs = require("fs");

var file = process.argv[2];
var input = fs.readFileSync(file, "utf8");

var included = /\/\/ include_code(.*)\n(?:\/\/.*\n)*\s*(?:\[sandbox=.*\n)?\[source,javascript\]\n----\n([\s\S]*?\n)----/g, m;
var code = [];
while (m = included.exec(input)) {
  var snippet = m[2], directive = m[1];
  if (directive.indexOf("strip_log") > -1)
    snippet = snippet.replace(/((?:\n|^)\s*)console\.log\(.*\);(\n|$)/g, "$1;$2");
  if (m = directive.match(/top_lines:\s*(\d+)/))
    snippet = snippet.split("\n").slice(0, Number(m[1])).join("\n") + "\n";
  code.push(snippet);
}

if (code.length) {
  var out = "html/js/" + file.replace(".txt", ".js");
  fs.writeFileSync(out, code.join("\n"), "utf8");
}
