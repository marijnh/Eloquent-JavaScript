// Script to pre-process the asciidoc sources for generating LaTeX.
// Adjusts some stylistic things to satisfy No Starch's style, and
// fixes up svg images to point at pdf versions of the images.

var fs = require("fs"), child = require("child_process");

var titleCaseSmallWords = "a an the at by for in of on to up and as but it or nor if console.log".split(" ");

var input = "";
process.stdin.on("data", function(chunk) {
  input += chunk;
});
process.stdin.on("end", function() {
  process.stdout.write(input.replace(/\n===? (.*?) ===?|”([.,:;])|\nimage::img\/(.+?)\.(svg)/g, function(match, title, quoted, imgName, imgType) {
    if (title) { // Section title, must be converted to title case
      var kind = /^\n(=*)/.exec(match)[1];
      return "\n" + kind + " " + title.split(" ").map(function(word) {
        if (titleCaseSmallWords.indexOf(word) == -1)
          return word[0].toUpperCase() + word.slice(1);
        else
          return word;
      }).join(" ") + " " + kind;
    } else if (quoted) { // Move punctuation into quotes
      return quoted + "”";
    } else if (imgName) { // Image file
      return "\nimage::" + convertImage(imgName, imgType);
    }
  }));
});
process.stdin.resume();

function convertImage(name, type) {
  if (type == "svg") {
    var oldName = "img/" + name + "." + type, newName = "tex/pdf/" + name + ".pdf";
    try {
      var newAge = fs.statSync(newName).atime;
    } catch (e) {
      newAge = 0;
    }
    var oldAge = fs.statSync(oldName).atime;
    if (newAge < oldAge)
      child.spawn("inkscape", ["--export-pdf=" + newName, oldName]);
    return ".." + newName.slice(3);
  } else {
    return "../../img/" + name + "." + type;
  }
}
