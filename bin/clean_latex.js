var fs = require("fs");

function cleanFile(tex) {
  var start = tex.indexOf("\\section");
  var end = tex.indexOf("\\end{document}");
  return tex.slice(start, end).replace(/\\(sub)?(sub)?section{/g, function(match, s1, s2) {
    if (s1 && s2) return "\\subsection{";
    if (s1) return "\\section{";
    return "\\chapter{";
  });
}

fs.writeFileSync(process.argv[2], cleanFile(fs.readFileSync(process.argv[2], "utf8"), "utf8"));
