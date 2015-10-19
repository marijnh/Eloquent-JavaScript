addEventListener("load", function() {
  var editor = CodeMirror.fromTextArea(document.querySelector("#editor"), {
    mode: "javascript",
    extraKeys: {
      "Ctrl-Enter": runCode
    },
    matchBrackets: true,
    lineNumbers: true
  });
  function guessType(code) {
    return /^[\s\w\n:]*</.test(code) ? "html" : "js";
  }
  var reGuess;
  editor.on("change", function() {
    clearTimeout(reGuess);
    reGuess = setTimeout(function() {
      if (context.type == null) {
        var mode = guessType(editor.getValue()) == "html" ? "text/html" : "javascript";
        if (mode != editor.getOption("mode"))
          editor.setOption("mode", mode);
      }
    }, 500);
  });

  function hasIncludes(code, include) {
    if (!include) return code;

    var re = /(?:\s|<!--.*?-->)*<script src="([^"]*)"><\/script>/g, m;
    var found = [];
    while (m = re.exec(code)) found.push(m[1]);
    return include.every(function(s) { return found.indexOf(s) > -1; });
  }

  function setEditorCode(code, type) {
    editor.setValue(code);
    editor.setOption("mode", (type || guessType(code)) == "html" ? "text/html" : "javascript");
  }

  function opt(value, label) {
    var node = document.createElement("option");
    node.value = value;
    node.textContent = label || value;
    return node;
  }

  function getChapter(number) {
    for (var i = 0; i < chapterData.length; i++)
      if (chapterData[i].number == number)
        return chapterData[i];
  }

  function getURL(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.addEventListener("load", function() {
      if (req.status < 400)
        callback(null, req.responseText);
      else
        callback(new Error("Request failed: " + req.statusText));
    });
    req.addEventListener("error", function() {
      callback(new Error("Network error"));
    });
    req.send(null);
  }

  var per = document.querySelector("#per_chapter");
  per.addEventListener("change", function() {
    selectContext(per.value);
    document.location.hash = "#" + (per.value == "box" ? chapters.value : per.value);
  });
  var fileList = document.querySelector("#files");
  var fileInfo = document.querySelector("#fileInfo");
  var runLocally = document.querySelector("#runLocally");
  var localFileList = document.querySelector("#local-files");

  function addItem(container, link) {
    var li = container.appendChild(document.createElement("li"));
    var a = li.appendChild(document.createElement("a"));
    a.href = link;
    a.textContent = link.replace(/^code\//, "");
  }

  function selectChapter(number, context) {
    per.textContent = "";
    var chapter = getChapter(number);
    if (chapter.exercises.length) {
      per.appendChild(opt("box", "Select an exercise"));
      chapter.exercises.forEach(function(exercise) {
        var num = chapter.number + "." + exercise.number;
        per.appendChild(opt(num, num + " " + exercise.name));
      });
    } else {
      per.appendChild(opt("box", "This chapter has no exercises"));
    }
    fileInfo.style.display = runLocally.style.display = "none";
    fileList.textContent = localFileList.textContent = "";
    if (chapter.links) chapter.links.forEach(function(file, i) {
      if (!i) runLocally.style.display = "";
      addItem(localFileList, file);
    });
    if (chapter.include) chapter.include.forEach(function(file, i) {
      if (!i) fileInfo.style.display = "";
      addItem(fileList, file);
    });
    selectContext(context || "box");
  }

  function findExercise(id, chapter) {
    var parts = id.split(".");
    if (!chapter) chapter = getChapter(parts[0]);
    for (var i = 0; i < chapter.exercises.length; i++)
      if (chapter.exercises[i].number == +parts[1])
        return chapter.exercises[i];
  }

  var context = {include: []};

  function selectContext(value) {
    output.clear();
    clearSandbox();
    var chapter = getChapter(chapters.value), visible;
    if (value == "box") {
      var code = (chapters.value < 20 || chapters.value > 21)
       ? "Run code here in the context of Chapter " + chapter.number
       : "Code from Node.js chapters can't be run in the browser";
      var guessed = guessType(chapter.start_code);
      if (guessed == "js")
        code = "// " + code;
      else
        code = "<!-- " + code + "-->";
      if (chapter.start_code) code += "\n\n" + chapter.start_code;
      context = {include: chapter.include};
      setEditorCode(code, guessed);
      visible = "box";
    } else {
      var exercise = findExercise(value, chapter);
      context = {include: chapter.include,
                 solution: exercise.solution,
                 type: exercise.type};
      setEditorCode(exercise.code, exercise.type);
      visible = "exercise";
      var link = document.querySelector("#download");
      if (/\.zip$/.test(exercise.file))
        link.href = exercise.file
      else
        link.href = "data:text/plain;charset=UTF-8," + exercise.solution;
    }
    ["box", "exercise"].forEach(function(id) {
      document.querySelector("#" + id + "_info").style.display =
        (id == visible ? "" : "none");
    });
  }

  var outnode = document.querySelector(".sandbox-output");
  var output = new SandBox.Output(outnode);

  document.querySelector("#run").addEventListener("click", runCode);

  var sandbox;
  function clearSandbox() {
    if (sandbox) {
      sandbox.frame.parentNode.removeChild(sandbox.frame);
      sandbox = null;
    }
  }

  function runCode() {
    clearSandbox();
    var val = editor.getValue(), type = context.type || guessType(val);
    sandbox = new SandBox({
      loadFiles: hasIncludes(val, context.include) ? [] : context.include,
      place: type == "html" &&
        function(node) { outnode.parentNode.insertBefore(node, outnode); }
    }, function(box) {
      output.clear();
      if (type == "html")
        box.setHTML(val, output);
      else
        box.run(val, output);
    });
  }

  document.querySelector("#solution").addEventListener("click", function() {
    setEditorCode(context.solution, context.type);
  });

  var chapters = document.querySelector("#chapters");
  chapterData.forEach(function(chapter) {
    chapters.appendChild(opt(chapter.number, chapter.number + ". " + chapter.title));
    chapter.exercises.forEach(function(exercise) {
      exercise.chapter = chapter;
    });
  });
  chapters.addEventListener("change", function() {
    selectChapter(chapters.value);
    document.location.hash = "#" + chapters.value;
  });

  function parseFragment() {
    var hash = document.location.hash.slice(1);
    var valid = /^(\d+)(?:\.(\d+))?$/.exec(hash);
    if (valid) {
      var chapter = getChapter(Number(valid[1]));
      var exercise = chapter && valid[2] && findExercise(hash, chapter);
      if (!chapter || valid[2] && !exercise) valid = null;
    }
    if (valid) {
      var perValue = exercise ? hash : "box", setPer = false;
      if (chapters.value != valid[1]) {
        chapters.value = valid[1];
        selectChapter(Number(valid[1]), perValue);
        setPer = true;
      }
      if (per.value != perValue) {
        per.value = perValue;
        if (!setPer) selectContext(perValue);
      }
      return true;
    }
  }

  parseFragment() || selectChapter(0, "box");
  addEventListener("hashchange", parseFragment);
});
