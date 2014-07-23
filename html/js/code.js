addEventListener("load", function() {
  var editor = CodeMirror.fromTextArea(document.querySelector("#editor"), {
    mode: "javascript",
    extraKeys: {
      "Ctrl-Enter": runCode
    },
    matchBrackets: true,
    lineNumbers: true
  });
  function guessType() {
    return /^[\s\w]*</.test(editor.getValue()) ? "html" : "js";
  }
  var reGuess;
  editor.on("change", function() {
    clearTimeout(reGuess);
    reGuess = setTimeout(function() {
      if (context.type == null) {
        var mode = guessType() == "html" ? "text/html" : "javascript";
        if (mode != editor.getOption("mode"))
          editor.setOption("mode", mode);
      }
    }, 500);
  });

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
  per.addEventListener("change", function() { selectContext(per.value); });
  var fileList = document.querySelector("#files");
  var fileInfo = document.querySelector("#fileInfo");

  function selectChapter(number) {
    per.textContent = "";
    var chapter = getChapter(number);
    if (chapter.exercises.length) {
      per.appendChild(opt("box", "Select an exercise"));
      chapter.exercises.forEach(function(exercise) {
        per.appendChild(opt(chapter.number + "." + exercise.number));
      });
    } else {
      per.appendChild(opt("box", "This chapter has no exercises"));
    }
    fileInfo.style.display = "none";
    fileList.textContent = "";
    if (chapter.include) chapter.include.forEach(function(file, i) {
      if (!i) fileInfo.style.display = "";
      var li = fileList.appendChild(document.createElement("li"));
      var a = li.appendChild(document.createElement("a"));
      a.href = file;
      a.textContent = file.replace(/^code\//, "");
    });
    selectContext(per.value);
  }

  function findExercise(id) {
    var parts = id.split(".");
    var chapter = getChapter(parts[0]);
    for (var i = 0; i < chapter.exercises.length; i++)
      if (chapter.exercises[i].number == +parts[1])
        return chapter.exercises[i];
  }

  var context = {include: []};

  function selectContext(value) {
    var chp = getChapter(chapters.value), visible;
    if (value == "box") {
      context = {include: chp.include};
      editor.setValue("// Run code here in the context of Chapter " + chapters.value);
      visible = "box";
    } else {
      var exercise = findExercise(value);
      context = {include: chp.include,
                 solution: exercise.solution};
      editor.setValue(exercise.code);
      visible = "exercise";
      document.querySelector("#download").href = exercise.file;
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
  function runCode() {
    if (sandbox)
      sandbox.frame.parentNode.removeChild(sandbox.frame);
    
    var type = context.type || guessType();
    sandbox = new SandBox({
      loadFiles: context.include,
      place: type == "html" &&
        function(node) { outnode.parentNode.insertBefore(node, outnode); }
    }, function(box) {
      output.clear();
      if (type == "html")
        box.setHTML(editor.getValue(), output);
      else
        box.run(editor.getValue(), output);
    });
  }

  document.querySelector("#solution").addEventListener("click", function() {
    editor.setValue(context.solution);
  });

  var chapters = document.querySelector("#chapters");
  chapterData.forEach(function(chapter) {
    chapters.appendChild(opt(chapter.number, chapter.number + ". " + chapter.title));
    chapter.exercises.forEach(function(exercise) {
      exercise.chapter = chapter;
    });
  });
  chapters.addEventListener("change", function() { selectChapter(chapters.value); });
  selectChapter(chapters.value);
});
