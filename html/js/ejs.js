window.addEventListener("load", function() {
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
    "Ctrl-Enter": function(cm) { runCode(cm.state.context); }
  };

  function activateCode(node, e) {
    var code = node.textContent;
    node.style.display = "none";
    var wrap = node.parentNode.insertBefore(elt("div", {css: "position: relative"}), node);
    var editor = CodeMirror(wrap, {
      value: code,
      mode: "javascript",
      extraKeys: keyMap
    });
    editor.setCursor(editor.coordsChar({left: e.clientX, top: e.clientY}, "client"));
    editor.focus();
    var out = wrap.appendChild(elt("div", {"class": "example-output"}));
    var button = wrap.appendChild(elt("div", {"class": "run-button", title: "run this code (ctrl-enter)"}, "▶"));
    var data = editor.state.context = {editor: editor, out: out, orig: node};
    button.addEventListener("click", function() { runCode(data); });
    var close = wrap.appendChild(elt("div", {"class": "close-button", title: "revert and close editor"}, "×"));
    close.addEventListener("click", function() { closeCode(data); });
  }

  function runCode(data) {
    data.out.innerHTML = "";
    var result, code = data.editor.getValue();
    try {
      result = (1,eval)(code);
    } catch(e) {
      data.out.appendChild(elt("div", {"class": "run-error"}, e.message || String(e)));
      return;
    }
    if (result != null && /[^\};](\s|\/\/.*)*$/.test(code))
      data.out.appendChild(elt("div", String(result)));
  }

  function closeCode(data) {
    var wrap = data.out.parentNode;
    wrap.parentNode.removeChild(wrap);
    data.orig.style.display = "";
  }
});
