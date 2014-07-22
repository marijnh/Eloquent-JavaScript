var fs = require("fs");

process.stdout.write(":docid: solutions\n\n= Solutions to the Exercises =\n\nThe hints below might help when you are stuck with one of the exercises in this book. They don't ive away the entire solution, but rather try to help you find it yourself.\n\n");

fs.readdirSync(".").forEach(function(name) {
  var m = /^(\d\d.*)\.txt$/.exec(name);
  if (!m) return;

  var file = fs.readFileSync(name, "utf8");
  var title = file.match(/\n= (.*?) =\n/)[1], titleWritten = false;

  var curSubsection;
  var re = /\n=== (.*?) ===|!!solution!!([^]+?)!!solution!!/g;
  while (m = re.exec(file)) {
    if (m[1]) {
      curSubsection = m[1];
    } else {
      if (!titleWritten) {
        process.stdout.write("== " + title + " ==\n\n");
        titleWritten = true;
      }
      process.stdout.write("=== " + curSubsection + " ===\n\n" + m[2] + "\n");
    }
  }
});
