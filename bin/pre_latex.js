// Script to pre-process the asciidoc sources for generating LaTeX.
// Adjusts some stylistic things to satisfy No Starch's style, and
// fixes up svg images to point at pdf versions of the images.

var fs = require("fs"), child = require("child_process");

var infile, nostarch = false;
for (var i = 2; i < process.argv.length; i++) {
  var arg = process.argv[i];
  if (arg == "--nostarch") nostarch = true;
  else infile = arg;
}

var instream;
if (infile == "-") {
  instream = process.stdin;
  instream.resume();
} else {
  instream = fs.createReadStream(infile);
}

var titleCaseSmallWords = "a an the at by for in of on to up and as but with or nor if console.log".split(" ");

var input = "";
instream.on("data", function(chunk) {
  input += chunk;
});
instream.on("end", function() {
  if (infile != "-")
    input = ":docid: " + infile.match(/^\d{2}_(.*?)\.txt/)[1] + "\n" + input;
  process.stdout.write(input.replace(/\n===? (.*?) ===?|”([.,:;])|\nimage::img\/(.+?)\.(\w+)(\[.*\])?|link:[^\.]+\.html#(.*?)\[|!!(hint)!![^]+?!!hint!!(?:\n|$)/g,
                                     function(match, title, quoted, imgName, imgType, imgOpts, link, solution) {
    if (title) { // Section title, must be converted to title case
      if (!nostarch) return match;
      var kind = /^\n(=*)/.exec(match)[1];
      return "\n" + kind + " " + title.split(" ").map(function(word) {
        if (titleCaseSmallWords.indexOf(word) == -1)
          return word[0].toUpperCase() + word.slice(1);
        else
          return word;
      }).join(" ") + " " + kind;
    } else if (quoted) { // Move punctuation into quotes
      if (!nostarch) return match;
      return quoted + "”";
    } else if (imgName) { // Image file
      return "\nimage::" + convertImage(imgName, imgType) + (!imgOpts ? "" : nostarch ? imgOpts : calcWidth(imgOpts));
    } else if (link) {
      return "link:" + link + "[";
    } else if (solution) {
      return "";
    }
  }));
});

function calcWidth(opts) {
  var replaced = false;
  opts = opts.replace(/width=\"([\d.]+)cm\"/, function(m, w) {
    replaced = true;
    return "width=\"" + (Number(w)/11).toFixed(2) + "\\\\textwidth\"";
  });
  if (!replaced) return opts.slice(0, opts.length - 1) + ",width=\"0.95\\\\textwidth\"]";
  else return opts;
}

function convertImage(name, type) {
  var oldName = "img/" + name + "." + type;
  if (type == "svg") {
    var newName = "img/generated/" + name + ".pdf";
    try {
      var newAge = fs.statSync(newName).atime;
    } catch (e) {
      newAge = 0;
    }
    return newName;
  }
  return oldName;
}
