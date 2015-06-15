  var allowedUnicode = /[→←“”’π½⅓¼…×βϕ≈é—]/;
function replaceUnicode(input) {
  var inCode = false;
  return input.replace(/\\(end|begin)\{lstlisting\}|([\x80-\uffff])/g, function(full, beginEnd, ch) {
    if (beginEnd) {
      inCode = beginEnd == "begin";
      return full;
    } else {
      if (!allowedUnicode.test(ch)) {
        console.error("Found unhandled unicode: " + ch);
        process.exit(1);
      }
      if (inCode && /[“”]/.test(ch)) return '"';
      if (inCode && /[‘’]/.test(ch)) return "'";
      return ch;
    }
  });
}

var escaped = {"\\{{}": "{",
               "\\}{}": "}",
               "\\textbackslash{}": "\\",
               "\\${}": "$",
               "\\textless{}": "<",
               "\\textgreater{}": ">",
               "\\&{}": "&",
               "\\_{}": "_",
               "\\%{}": "%",
               "\\#{}": "\\#",
               "\\textasciicircum{}": "^",
               "\\textasciitilde{}": "~",
               "\\textbar{}": "|",
               "\\textquotedbl{}": "\""};
var specials = Object.keys(escaped).map(function(k) {return k.replace(/[^\w\s]/g, "\\$&");}).join("|") + "|[^]";
var deEscapeRE = new RegExp("\\\\lstinline:::((?:" + specials + ")+?):::", "g");
var specialRE = new RegExp(specials, "g");
function cleanLstInline(str) {
  return str.replace(deEscapeRE, function(m, content) {
    return "\\lstinline`" + content.replace(specialRE, function(f) {
      if (f.length > 1) return escaped[f];
      else if (f == "\n") return " ";
      else return f;
    }) + "`";
  });
}

var input = "";
process.stdin.on("data", function(chunk) {
  input += chunk;
});
process.stdin.on("end", function() {
  input = input.replace(/(\n\n\\end{Code})|(\n{3,})|(_why,)|\\chapter\{(Introduction|Exercise Hints)\}|\\hyperref\[((?:[^\]]|\\_\{\})+)\]|\\index\{([^|}]+?)\\textbar\{\}see\{([^}]+)}}|\\textasciicircum\{\}\{([^\}]+?)\}|(���)/g,
                        function(all, codeSpace, manyBlanks, why, simplechapter, link, seeFrom, seeTo, superscript, bogusChars) {
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
    if (bogusChars)
      return "→";
  });
  input = cleanLstInline(input);
  input = input.replace(/({\\hspace\*\{.+?\}\\itshape``)\s*([^]+?)\s*('')/g, "$1$2$3");
  input = replaceUnicode(input);

  process.stdout.write(input);
});
process.stdin.resume();
