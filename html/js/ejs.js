window.addEventListener("load", function() {
  // If there's no ecmascript 5 support, don't try to initialize
  if (!Object.create || !window.JSON) return;

  var sandbox;
  function resetSandbox() {
    sandbox = new SandBox({loadFiles: window.sandboxLoadFiles});
    window.sandbox = sandbox;
  }
  resetSandbox();

  document.body.addEventListener("click", function(e) {
    for (var n = e.target; n; n = n.parentNode)
      if (n.nodeName == "PRE" && n.getAttribute("data-language") == "javascript")
        return activateCode(n, e);
  });

  function elt(type, attrs) {
    var firstChild = 1;
    var node = document.createElement(type);
    if (attrs && typeof attrs == "object" && attrs.nodeType == null) {
      for (var attr in attrs) if (attrs.hasOwnProperty(attr)) {
        if (attr == "css") node.style.cssText = attrs[attr];
        else node.setAttribute(attr, attrs[attr]);
      }
      firstChild = 2;
    }
    for (var i = firstChild; i < arguments.length; ++i) {
      var child = arguments[i];
      if (typeof child == "string") child = document.createTextNode(child);
      node.appendChild(child);
    }
    return node;
  }

  var keyMap = {
    Esc: function(cm) { cm.display.input.blur(); },
    "Ctrl-Enter": function(cm) { runCode(cm.state.context); },
    "Ctrl-D": function(cm) { closeCode(cm.state.context); },
    "Ctrl-Q": resetSandbox
  };

  function activateCode(node, e) {
    var code = node.textContent;
    node.style.display = "none";
    var wrap = node.parentNode.insertBefore(elt("div", {"class": "editor-wrap"}), node);
    var editor = CodeMirror(wrap, {
      value: code,
      mode: "javascript",
      extraKeys: keyMap
    });
    editor.setCursor(editor.coordsChar({left: e.clientX, top: e.clientY}, "client"));
    editor.focus();
    var out = wrap.appendChild(elt("div", {"class": "sandbox-output"}));
    var menu = wrap.appendChild(elt("div", {"class": "sandbox-menu", title: "Sandbox menu..."}));
    var data = editor.state.context = {editor: editor, wrap: wrap, orig: node};
    data.output = new SandBox.Output(out);
    menu.addEventListener("click", function() { openMenu(data, menu); });
  }

  function openMenu(data, node) {
    var menu = elt("div", {"class": "sandbox-open-menu"});
    var items = [["Run code (ctrl-enter)", function() { runCode(data); }],
                 ["Revert to original code", function() { revertCode(data); }],
                 ["Reset sandbox (ctrl-q)", resetSandbox],
                 ["Deactivate editor (ctrl-d)", function() { closeCode(data); }]];
    items.forEach(function(choice) {
      menu.appendChild(elt("div", choice[0]));
    });
    function click(e) {
      var target = e.target;
      if (e.target.parentNode == menu) {
        for (var i = 0; i < menu.childNodes.length; ++i)
          if (target == menu.childNodes[i])
            items[i][1]();
      }
      menu.parentNode.removeChild(menu);
      window.removeEventListener("click", click);
    }
    setTimeout(function() {
      window.addEventListener("click", click);
    }, 20);
    node.offsetParent.appendChild(menu);
  }

  function runCode(data) {
    data.output.clear();
    var code = data.editor.getValue();
    // Chapter 1 has console-log-less output
    if (window.chapNum == 1)
      code = code.replace(/(\n|^)(.*[^;}])(\s*$|\n\/\/ →)/g, "$1console.log($2);$3");
    sandbox.run(code, data.output);
  }

  function closeCode(data) {
    data.wrap.parentNode.removeChild(data.wrap);
    data.orig.style.display = "";
  }

  function revertCode(data) {
    data.editor.setValue(data.orig.textContent);
  }
});
