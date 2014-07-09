var input = "";
process.stdin.on("data", function(chunk) {
  input += chunk;
});
process.stdin.on("end", function() {
  process.stdout.write(input.replace(/(\n\n\\end{Code})|(\n{3,})/g, function(all, codeSpace, manyBlanks) {
    if (codeSpace)
      return codeSpace.slice(1);
    if (manyBlanks)
      return "\n\n";
  }));
});
process.stdin.resume();
