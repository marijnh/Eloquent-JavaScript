// Fragile, hacky script that finds exercises in chapters, extracts
// their starting code, and collects it into a big JSON object
// together with the solution code.

var fs = require("fs");

var output = [], failed = false;

var allSolutions = fs.readdirSync("code/solutions/");

fs.readdirSync(".").forEach(function(file) {
  var match = /^(\d+).*\.txt$/.exec(file), chapNum = match && match[1];
  if (!match) return;
  var text = fs.readFileSync(file, "utf8");
  var exerciseSection = text.indexOf("\n== Exercises ==\n");
  if (exerciseSection < 0) return;

  var chapter = {number: +chapNum,
                 title: text.match(/\n= (.*?) =\n/)[1],
                 exercises: []};
  var includes = text.match(/\n:load_files: (.*)/);
  if (includes) chapter.include = JSON.parse(includes[1]);

  var exerciseBlock = text.slice(exerciseSection);
  var header = /\n=== (.*?) ===\n/g;
  var num = 1;
  while (match = header.exec(exerciseBlock)) {
    var nextsection = exerciseBlock.indexOf("\n==", header.lastIndex);
    for (var pos = header.lastIndex;;) {
      var ifdef = exerciseBlock.indexOf("ifdef::html_target[]", pos);
      if (ifdef == -1 || nextsection > 0 && nextsection < ifdef) break;
      var indef = exerciseBlock.slice(pos = ifdef + 21,
                                      exerciseBlock.indexOf("endif::html_target[]", ifdef));
      var sourceBlock = indef.match(/\[source,([^\]]*)\]\n----\n([^]+?)\n----/);
      if (!sourceBlock) continue;
      var type = sourceBlock[1].indexOf("html") > -1 ? "html" : "js";
      var file = chapNum + "_" + num + "_" + match[1].toLowerCase().replace(/[^\-\s\w]/g, "").replace(/\s/g, "_") + "." + type;
      try {
        var solution = fs.readFileSync("code/solutions/" + file, "utf8").trim();
        allSolutions.splice(allSolutions.indexOf(file), 1);
      } catch(e) {
        console.error("File ", file, " does not exist.");
        failed = true;
      }
      if (sourceBlock) {
        chapter.exercises.push({
          name: match[1],
          file: "code/solutions/" + file,
          number: num,
          type: type,
          code: sourceBlock[2],
          solution: solution
        });
        break;
      }
    }
    ++num;
  }

  if (chapter.exercises.length) output.push(chapter);
});

if (allSolutions.length) {
  console.error("Solution files " + allSolutions + " were not used.");
  failed = true;
}

if (!failed)
  console.log("var exerciseData = " + JSON.stringify(output, null, 2) + ";");
else
  process.exit(1);
