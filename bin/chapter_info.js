// Fragile, hacky script that finds exercises in chapters, extracts
// their starting code, and collects it into a big JSON object
// together with the solution code.

var fs = require("fs");

var output = [], failed = false;

var allSolutions = fs.readdirSync("code/solutions/").filter(function(file) { return !/^2[01]/.test(file); });

var dir = fs.readdirSync(".");
dir.sort();
dir.forEach(function(file) {
  var match = /^(\d+).*\.txt$/.exec(file), chapNum = match && match[1];
  if (!match) return;
  var text = fs.readFileSync(file, "utf8");

  var chapter = {number: +chapNum,
                 title: text.match(/\n= (.*?) =\n/)[1],
                 start_code: getStartCode(text),
                 exercises: []};
  var includes = text.match(/\n:load_files: (.*)/);
  if (includes) chapter.include = JSON.parse(includes[1]);

  var exerciseSection = text.indexOf("\n== Exercises ==\n");
  var exerciseBlock = exerciseSection ? text.slice(exerciseSection) : "";
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
        var solution = fs.readFileSync("code/solutions/" + file, "utf8");
        var extra = /^\s*<!doctype html>\s*(<base .*\n(<script src=.*\n)*)?/.exec(solution);
        if (extra) solution = solution.slice(extra[0].length);
        allSolutions.splice(allSolutions.indexOf(file), 1);
      } catch(e) {
        console.error("File ", file, " does not exist.", e);
        failed = true;
      }
      if (sourceBlock) {
        chapter.exercises.push({
          name: match[1],
          file: "code/solutions/" + file,
          number: num,
          type: type,
          code: sourceBlock[2],
          solution: solution.trim()
        });
        break;
      }
    }
    ++num;
  }

  var nodeInfo = "// Node exercises can not be ran in the browser,\n// but you can look at their solution here.\n";
  if (chapter.number == 20) chapter.exercises = [
    {name: "Content negotiation, again",
     file: "code/solutions/20_1_content_negotiation_again.js",
     number: 1,
     type: "js",
     code: nodeInfo,
     solution: fs.readFileSync("code/solutions/20_1_content_negotiation_again.js", "utf8")
    },
    {name: "Fixing a leak",
     file: "code/solutions/20_2_fixing_a_leak.js",
     number: 2,
     type: "js",
     code: nodeInfo,
     solution: fs.readFileSync("code/solutions/20_2_fixing_a_leak.js", "utf8")
    },
    {name: "Creating directories",
     file: "code/solutions/20_3_creating_directories.js",
     number: 3,
     type: "js",
     code: nodeInfo,
     solution: fs.readFileSync("code/solutions/20_3_creating_directories.js", "utf8")
    },
    {name: "A public space on the web",
     file: "code/solutions/20_4_a_public_space_on_the_web",
     number: 4,
     type: "js",
     code: nodeInfo,
     solution: "// This solutions consists of multiple files. Download it\n// though the link below.\n"
    }
  ];
  if (chapter.number == 21) chapter.exercises = [
    {name: "Disk persistence",
     file: "code/solutions/21_1_disk_persistence.js",
     number: 1,
     type: "js",
     code: nodeInfo,
     solution: fs.readFileSync("code/solutions/21_1_disk_persistence.js", "utf8")
    },
    {name: "Comment field resets",
     file: "code/solutions/21_2_comment_field_resets.js",
     number: 2,
     type: "js",
     code: nodeInfo,
     solution: fs.readFileSync("code/solutions/21_2_comment_field_resets.js", "utf8")
    },
    {name: "Better templates",
     file: "code/solutions/21_3_better_templates.js",
     number: 3,
     type: "js",
     code: nodeInfo,
     solution: fs.readFileSync("code/solutions/21_3_better_templates.js", "utf8")
    }
  ];

  output.push(chapter);
});

if (allSolutions.length) {
  console.error("Solution files " + allSolutions + " were not used.");
  failed = true;
}

if (!failed)
  console.log("var chapterData = " + JSON.stringify(output, null, 2) + ";");
else
  process.exit(1);

function getStartCode(text) {
  var found = /\/\/ start_code(.*)\n(?:\/\/.*\n)*\s*(?:\[.*\n)*\[source,.*?\]\n----\n([\s\S]*?\n)----/.exec(text);
  if (!found) return "";

  var snippet = found[2].replace(/(\n|^)\s*\/\/ →.*\n/g, "$1");
  var directive = found[1], m;
  if (m = directive.match(/top_lines:\s*(\d+)/))
    snippet = snippet.split("\n").slice(0, Number(m[1])).join("\n") + "\n";
  if (m = directive.match(/bottom_lines:\s*(\d+)/)) {
    var lines = snippet.trimRight().split("\n");
    snippet = lines.slice(lines.length - Number(m[1])).join("\n") + "\n";
  }
  return snippet;
}
