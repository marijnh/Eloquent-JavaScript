// Script to pre-process the asciidoc sources for generating EPUB.

var fs = require("fs"), child = require("child_process");

var infile = process.argv[2];

var instream;
if (infile == "-") {
  instream = process.stdin;
  instream.resume();
} else {
  instream = fs.createReadStream(infile);
}

var input = "";
instream.on("data", function(chunk) {
  input += chunk;
});
instream.on("end", function() {
  if (infile != "-")
    input = ":docid: " + infile.match(/^\d{2}_(.*?)\.txt/)[1] + "\n" + input;
  process.stdout.write(input.replace(/\blink:([^\.]+)\.html#(.*?)\[|!!(hint)!![^]+?!!hint!!(?:\n|$)/g,
                                     function(match, linkFile, linkID, hint) {
    if (linkFile) {
      return "link:" + linkFile + ".xhtml#" + linkID + "[";
    } else if (hint) {
      return "";
    }
  }));
});
