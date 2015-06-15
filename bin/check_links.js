var fs = require("fs");

var files = Object.create(null);
fs.readdirSync(".").forEach(function(name) {
  var m = /^(\d\d.*)\.txt$/.exec(name);
  if (m) files[m[1]] = fs.readFileSync(name, "utf8");
});
files["22_fast"] = "[[fast]]"; // Kludge to recognize bonus chapter
files["hints"] = "[[hints]]";

var fail = 0;
function error(file, msg) {
  console.error(file + ": " + msg);
  fail = 1;
}

var link = /link:([^\.\s]+)\.(\w{2,5})#([^\s\[]+)\[/g, m;
for (var file in files) {
  // Haha, good luck making sense of this one
  var bad = /\n\n(\(\(\([^()]*?(\([^()]+\))?\)\)\))*(\(\([^(]|[^(\n]\(\(\()|\n\n\[\[[^\]]+?\]\].|[^(]\(\([^()]+?(\([^()]+?\))?\)\)\)/.exec(files[file]);
  if (bad) error(file, "Suspicious notation: " + bad[0]);

  while (m = link.exec(files[file])) {
    if (m[2] != "html")
      error(file, "Bad extension: " + m[0]);
    var target = files[m[1]];
    if (!target)
      error(file, "Unknown target file: " + m[0]);
    else if (m[3] != m[1].slice(3) && target.indexOf("[[" + m[3] + "]]") == -1)
      error(file, "Non-existing anchor: " + m[0]);
  }
}

process.exit(fail);
