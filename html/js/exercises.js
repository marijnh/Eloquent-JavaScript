addEventListener("load", function() {
  var list = document.querySelector("#exercises");
  exerciseData.forEach(function(chapter) {
    var group = document.createElement("optgroup");
    group.label = chapter.number + ". " + chapter.title;
    chapter.exercises.forEach(function(exercise) {
      exercise.chapter = chapter;
      var option = group.appendChild(document.createElement("option"));
      option.textContent = exercise.name;
      option.value = chapter.number + "." + exercise.number;
    });
    list.appendChild(group);
  });
  list.addEventListener("change", function() { selectExercise(list.value); });

  var editor = CodeMirror.fromTextArea(document.querySelector("#editor"), {
    mode: "javascript",
    extraKeys: {
      "Ctrl-Enter": runCode
    },
    matchBrackets: true,
    lineNumbers: true
  });

  function findExercise(id) {
    var parts = id.split(".");
    for (var i = 0; i < exerciseData.length; i++) {
      if (exerciseData[i].number == +parts[0]) {
        var list = exerciseData[i].exercises;
        for (var j = 0; j < list.length; j++) {
          if (list[j].number == +parts[1])
            return list[j];
        }
      }
    }
  }

  var downloadLink = document.querySelector("#download");
  var currentExercise = null;
  function selectExercise(id) {
    var exercise = findExercise(id);
    if (!exercise) return;
    currentExercise = exercise;
    editor.operation(function() {
      editor.setValue(exercise.code);
      editor.setOption("mode", exercise.type == "js" ? "javascript" : "text/html");
    });
    downloadLink.href = exercise.file;    
    downloadLink.download = "download";    
  }

  var outnode = document.querySelector(".sandbox-output");
  var output = new SandBox.Output(outnode);

  document.querySelector("#run").addEventListener("click", runCode);

  var sandbox;
  function runCode() {
    if (sandbox)
      sandbox.frame.parentNode.removeChild(sandbox.frame);

    sandbox = new SandBox({
      loadFiles: currentExercise && currentExercise.chapter.include,
      place: currentExercise && currentExercise.type == "html" &&
        function(node) { outnode.parentNode.insertBefore(node, outnode); }
    }, function(box) {
      output.clear();
      if (currentExercise && currentExercise.type == "html")
        box.setHTML(editor.getValue(), output);
      else
        box.run(editor.getValue(), output);
    });
  }

  document.querySelector("#solution").addEventListener("click", function() {
    if (currentExercise)
      editor.setValue(currentExercise.solution);
  });
});
