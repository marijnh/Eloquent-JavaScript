(function() {
  "use strict";

  var SandBox = window.SandBox = function(options) {
    var frame = this.frame = document.createElement("iframe");
    frame.id = "sandbox";
    frame.style.display = "none";
    frame.src = "about:blank";
    document.body.appendChild(frame);

    var win = this.win = frame.contentWindow;
    var self = win.__sandbox = this;

    win.onerror = function(e, _file, line) {
      if (!self.output) return;
      self.output.out("error", [e + (line != null ? " (line " + line + ")" : "")]);
      return true;
    };
    win.console = {
      log: function() { self.out("log", arguments); },
      error: function() { self.out("error", arguments); },
      warn: function() { self.out("warn", arguments); },
      info: function() { self.out("log", arguments); }
    };
    win.__setTimeout = win.setTimeout;
    win.__setInterval = win.setInterval;
    win.setTimeout = function(code, time) {
      return win.__setTimeout(function() { self.run(code); }, time);
    };
    win.setInterval = function(code, time) {
      return win.__setInterval(function() { self.run(code); }, time);
    };

    this.startedAt = 0;
    this.extraSecs = 1;
    this.output = null;

    if (options.loadFiles) setTimeout(function() {
      var i = 0;
      function loadNext() {
        if (i == options.loadFiles.length) return;
        var script = win.document.createElement("script");
        script.src = options.loadFiles[i];
        win.document.body.appendChild(script);
        ++i;
        script.addEventListener("load", loadNext);
      }
      loadNext();
    }, 50);
  };

  SandBox.prototype = {
    run: function(code, output) {
      if (output) this.output = output;
      this.startedAt = Date.now();
      this.extraSecs = 1;
      this.win.__c = 0;
      this.win.__setTimeout(preprocess(code, this), 0);
    },
    tick: function() {
      var now = Date.now();
      if (now < this.startedAt + this.extraSecs * 1000) return;
      var bail = confirm("This code has been running for " + this.extraSecs +
                         " seconds. Abort it?");
      this.startedAt += Date.now() - now;
      this.extraSecs += Math.max(this.extraSecs, 8);
      if (bail) throw new Error("Aborted");
    },
    out: function(type, args) {
      if (this.output) this.output.out(type, args);
      else console[type].apply(console, args);
    },
    error: function(exception) {
      if (!this.output) throw exception;
      var pos = /(?:\bat |@).*?([^\/:]+):(\d+)/.exec(exception.stack);
      if (pos && pos[1].match(/sandbox/)) pos = null;
      this.output.out("error", [String(exception) + (pos ? " (line " + pos[2] + ")" : "")]);
    }
  };

  function preprocess(code, sandbox) {
    if (typeof code != "string") {
      if (code.apply)
        return function() {
          try { return code.apply(this, arguments); }
          catch(e) { sandbox.error(e); }
        };
      return code;
    }

    var ast = acorn.parse(code);
    var patches = [];
    var backJump = "if (++__c % 1000 === 0) __sandbox.tick();";
    function loop(node) {
      if (node.body.type == "BlockStatement") {
        patches.push({from: node.body.end - 1, text: backJump});
      } else {
        patches.push({from: node.body.start, text: "{"},
                     {from: node.body.end, text: backJump + "}"});
      }
    }
    acorn.walk.simple(ast, {
      ForStatement: loop,
      ForInStatement: loop,
      WhileStatement: loop,
      DoWhileStatement: loop
    });
    patches.sort(function(a, b) { return a.from - b.from; });
    var out = "";
    for (var i = 0, pos = 0; i < patches.length; ++i) {
      var patch = patches[i];
      out += code.slice(pos, patch.from) + patch.text;
      pos = patch.to || patch.from;
    }
    out += code.slice(pos, code.length);
    return "try{" + out + "\n}catch(e){__sandbox.error(e);}";
  }

  var Output = SandBox.Output = function(div) {
    this.div = div;
  };

  Output.prototype = {
    clear: function() { this.div.innerHTML = ""; },
    out: function(type, args) {
      var wrap = document.createElement("pre");
      wrap.className = "sandbox-output-" + type;
      for (var i = 0; i < args.length; ++i) {
        var arg = args[i];
        if (typeof arg == "string")
          wrap.appendChild(document.createTextNode(arg));
        else
          wrap.appendChild(represent(arg, [50]));
      }
      this.div.appendChild(wrap);
    }
  };

  function span(type, text, space) {
    if (space) space[0] -= text.length;
    var sp = document.createElement("span");
    sp.className = "sandbox-output-" + type;
    sp.appendChild(document.createTextNode(text));
    return sp;
  }

  function represent(val, space) {
    if (typeof val == "boolean") return span("bool", String(val), space);
    if (typeof val == "number") return span("number", String(val), space);
    if (typeof val == "string") return representString(val, space);
    if (val == null) return span("null", String(val), space);
    if (Array.isArray(val)) return representArray(val, space);
    else return representObj(val, space);
  }

  function representString(val, space) {
    var json = JSON.stringify(val);
    if (json.length < space[0] + 3) return span("string", json, space);
    var wrap = span("string", json.slice(0, Math.max(1, space[0])), space);
    wrap.appendChild(span("etc", "…", space)).addEventListener("click", function(e) {
      wrap.innerHTML = "";
      wrap.appendChild(document.createTextNode(json));
    });
    wrap.appendChild(document.createTextNode("\""));
    return wrap;
  }

  function representArray(val, space) {
    space[0] -= 2;
    var wrap = document.createElement("span");
    wrap.appendChild(document.createTextNode("["));
    for (var i = 0; i < val.length; ++i) {
      if (i) {
        wrap.appendChild(document.createTextNode(", "));
        space[0] -= 2;
      }
      if (space[0] <= 0 && i < val.length - 2) {
        wrap.appendChild(span("etc", "…", space)).addEventListener("click", function(e) {
          replaceEtc(e.target, "array", val, i);
        });
        break;
      }
      wrap.appendChild(represent(val[i], space));
    }
    wrap.appendChild(document.createTextNode("]"));
    return wrap;
  }

  function representObj(val, space) {
    space[0] -= 2;
    var wrap = document.createElement("span");
    wrap.appendChild(document.createTextNode("{"));
    try {
      var first = true;
      for (var prop in val) {
        if (first) {
          first = false;
        } else {
          space[0] -= 2;
          wrap.appendChild(document.createTextNode(", "));
        }
        if (space[0] <= 0) {
          wrap.appendChild(span("etc", "…", space)).addEventListener("click", function(e) {
            replaceEtc(e.target, "obj", val, prop);
          });
          break;
        }
        space[0] -= prop.length + 2;
        wrap.appendChild(document.createTextNode(prop + ": "));
        wrap.appendChild(represent(val[prop], space));
      }
    } catch (e) {
      wrap.appendChild(document.createTextNode("…"));
    }
    wrap.appendChild(document.createTextNode("}"));
    return wrap;
  }

  function replaceEtc(node, type, val, from) {
    var block = document.createElement("div");
    block.className = "sandbox-output-etc-block";
    var table = block.appendChild(document.createElement("table"));
    function addProp(name) {
      var row = table.appendChild(document.createElement("tr"));
      row.appendChild(document.createElement("td")).appendChild(document.createTextNode(name + ":"));
      row.appendChild(document.createElement("td")).appendChild(represent(val[name], [30]));
    }
    if (type == "array") {
      for (var i = from; i < val.length; ++i) addProp(i);
    } else {
      var showing = false;
      for (var prop in val)
        if (showing = showing || prop == from) addProp(prop);
    }
    node.parentNode.replaceChild(block, node);
  }
})();
