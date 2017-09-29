var fs = require("fs");

var files = Object.create(null);
fs.readdirSync(".").forEach(function(name) {
  var m = /^(\d\d.*)\.md$/.exec(name);
  if (m) files[m[1]] = fs.readFileSync(name, "utf8");
});
files["22_fast"] = "{{id fast}}"; // Kludge to recognize bonus chapter
files["hints"] = "{{id hints}}";

var fail = 0;
function error(file, msg) {
  console.error(file + ": " + msg);
  fail = 1;
}

var link = /\]\((([^\.\s]+)\.(\w{2,5})#([^\s\[]+?))\)/g, m;
for (var file in files) {
  while (m = link.exec(files[file])) {
    let [_, link, file, ext, anchor] = m
    if (ext != "html")
      error(file, "Bad extension: " + link);
    var target = files[file];
    if (!target)
      error(file, "Unknown target file: " + link);
    else if (anchor != file.slice(3) && target.indexOf("{{id " + anchor + "}}") == -1)
      error(file, "Non-existing anchor: " + link);
  }
}

process.exit(fail);
