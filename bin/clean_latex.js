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
  input = input.replace(/(\n\n\\end{Code})|(\n{3,})|(_why,)|(\\chapter\{Introduction\})/g, function(all, codeSpace, manyBlanks, why, intro) {
    if (codeSpace)
      return codeSpace.slice(1);
    if (manyBlanks)
      return "\n\n";
    if (why)
      return "\\_why,";
    if (intro)
      return "\\chapter*{Introduction}";
  });
  input = input.replace(/({\\hspace\*\{.+?\}\\itshape``)\s*([^]+?)\s*('')/g, "$1$2$3");

  process.stdout.write(input);
});
process.stdin.resume();
