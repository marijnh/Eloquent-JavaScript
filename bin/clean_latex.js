// Check that no unicode characters that we aren't explicitly handling
// with \newunicodechar snuck into the output.
function checkUnicode(str) {
  var allowedUnicode = /[→←“”π½⅓¼…×βϕ≈é—]/;
  var unicode = /[\x7f-\uffff]/g;
  var match;
  while (match = unicode.exec(str)) {
    if (!allowedUnicode.test(match[0])) {
      console.error("Found unhandled unicode: " + match[0]);
      process.exit(1);
    }
  }
}

var input = "";
process.stdin.on("data", function(chunk) {
  input += chunk;
});
process.stdin.on("end", function() {
  checkUnicode(input);
  input = input.replace(/(\n\n\\end{Code})|(\n{3,})|(_why,)|\\chapter\{(Introduction|Solutions to the Exercises)\}|\\hyperref\[((?:[^\]]|\\_\{\})+)\]|\\index\{([^|}]+?)\\textbar\{\}see\{([^}]+)}}|\\textasciicircum\{\}\{([^\}]+?)\}/g,
                        function(all, codeSpace, manyBlanks, why, simplechapter, link, seeFrom, seeTo, superscript) {
    if (codeSpace)
      return codeSpace.slice(1);
    if (manyBlanks)
      return "\n\n";
    if (why)
      return "\\_why,";
    if (simplechapter)
      return "\\chapter*{" + simplechapter + "}";
    if (link)
      return "\\hyperref[" + link.replace(/\\_\{\}/g, "_") + "]";
    if (seeFrom)
      return "\\index{" + seeFrom + "|see{" + seeTo + "}}";
    if (superscript)
      return "\\textsuperscript{" + superscript + "}";
  });
  input = input.replace(/({\\hspace\*\{.+?\}\\itshape``)\s*([^]+?)\s*('')/g, "$1$2$3");

  process.stdout.write(input);
});
process.stdin.resume();
