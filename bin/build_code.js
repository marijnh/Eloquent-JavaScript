var fs = require("fs");

var file = process.argv[2];
var input = fs.readFileSync(file, "utf8");

var included = /\/\/ include_code(.*)\n(?:\/\/.*\n)*\s*(?:\[.*\n)*\[source,.*?\]\n----\n([\s\S]*?\n)----/g, m;
var files = Object.create(null);
var defaultFile = "code/chapter/" + file.replace(".txt", ".js");

while (m = included.exec(input)) {
  var snippet = m[2], directive = m[1], file = defaultFile;
  snippet = snippet.replace(/(\n|^)\s*\/\/ →.*\n/g, "$1");
  if (directive.indexOf("strip_log") > -1)
    snippet = snippet.replace(/(\n|^)\s*console\.log\(.*\);\n/g, "$1");
  if (m = directive.match(/top_lines:\s*(\d+)/))
    snippet = snippet.split("\n").slice(0, Number(m[1])).join("\n") + "\n";
  if (m = directive.match(/\s>(\S+)/))
    file = m[1];
  if (file in files)
    files[file].push(snippet);
  else
    files[file] = [snippet];
}

for (var file in files)
  fs.writeFileSync(file, files[file].join("\n"), "utf8");
