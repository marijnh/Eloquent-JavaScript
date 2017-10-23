(function() {"use strict"; function timeout(win, f, ms) { win.__setTimeout(f, ms) }
  // The above is a kludge to make sure setTimeout calls are made from
  // line 1, which is where FF will start counting for its line numbers.

  function parseStack(stack) {
    let found = [], m
    let re = /([\w$]*)@.*?:(\d+)|\bat (?:([^\s(]+) \()?.*?:(\d+)/g
    while (m = re.exec(stack)) {
      found.push({fn: m[1] || m[3] || null,
                  line: m[2] || m[4]})
    }
    return found
  }
  function frameString(frame) {
    return "line " + frame.line + (frame.fn ? " in function " + frame.fn : "")
  }

  let SandBox = window.SandBox = class {
    constructor(options, callback) {
      this.callbacks = {}

      // Used to cancel existing events when new code is loaded
      this.timeouts = []; this.intervals = []; this.frames = []; this.framePos = 0

      const loaded = () => {
        frame.removeEventListener("load", loaded)
        this.win = frame.contentWindow
        this.setupEnv()

        const resize = () => {
          if (this.frame.style.display != "none") this.resizeFrame()
        }
        this.frame.addEventListener("load", resize)
        let resizeTimeout = null
        const scheduleResize = () => {
          this.win.clearTimeout(resizeTimeout)
          this.win.__setTimeout(resize, 200)
        }
        this.win.addEventListener("keydown", scheduleResize)
        this.win.addEventListener("mousedown", scheduleResize)

        if (options.loadFiles) {
          let i = 0
          let loadNext = () => {
            if (i == options.loadFiles.length) return callback(this)
            let script = this.win.document.createElement("script")
            script.src = options.loadFiles[i]
            this.win.document.body.appendChild(script)
            ++i
            script.addEventListener("load", loadNext)
          }
          loadNext()
        } else {
          callback(this)
        }
      }

      let frame = this.frame = document.createElement("iframe")
      frame.addEventListener("load", loaded)
      frame.src = "empty.html"
      if (options.place) {
        options.place(frame)
      } else {
        frame.style.display = "none"
        document.body.appendChild(frame)
      }

      this.startedAt = null
      this.extraSecs = 2
      this.output = null
    }

    run(code, output) {
      if (output)
        this.output = output
      this.startedAt = Date.now()
      this.extraSecs = 2
      this.win.__c = 0
      timeout(this.win, preprocess(code, this), 0)
    }

    setHTML(code, output, callback) {
      this.clearEvents()
      let loc = String(this.win.document.location)
      if (loc != String(document.location) && !/\/empty\.html$/.test(loc)) {
        this.frame.src = "empty.html"
        let loaded = () => {
          this.frame.removeEventListener("load", loaded)
          this.setupEnv()
          this.setHTML(code, output, callback)
        }
        this.frame.addEventListener("load", loaded)
        return
      }

      let scriptTags = [], sandbox = this, doc = this.win.document
      this.frame.style.display = "block"
      doc.documentElement.innerHTML = code.replace(/<script\b[^>]*?(?:\bsrc\s*=\s*('[^']+'|"[^"]+"|[^\s>]+)[^>]*)?>([\s\S]*?)<\/script>/g, function(_, src, content) {
        let tag = doc.createElement("script")
        if (src) {
          if (/["']/.test(src.charAt(0))) src = src.slice(1, src.length - 1)
          tag.src = src
        } else {
          tag.text = preprocess(content, sandbox)
        }
        scriptTags.push(tag)
        return ""
      })

      this.frame.style.height = "80px"
      this.resizeFrame()
      if (output) this.output = output

      function loadScript(i) {
        if (i == scriptTags.length) {
          if (i) setTimeout(function() {sandbox.resizeFrame()}, 50)
          callback && callback()
          return
        }

        sandbox.startedAt = Date.now()
        sandbox.extraSecs = 2
        sandbox.win.__c = 0
        let tag = scriptTags[i]
        if (tag.src) {
          tag.addEventListener("load", function() { loadScript(i + 1) })
        } else {
          let id = Math.floor(Math.random() * 0xffffff)
          sandbox.callbacks[id] = function() { delete sandbox.callbacks[id]; loadScript(i + 1) }
          tag.text += ";__sandbox.callbacks[" + id + "]();"
        }
        doc.body.appendChild(tag)
      }
      loadScript(0)
    }

    setupEnv() {
      let win = this.win
      win.__sandbox = this

      win.onerror = (e, _file, line) => {
        if (!this.output) return
        this.output.out("error", [e + (line != null ? " (line " + line + ")" : "")])
        return true
      }
      win.console = {
        log: (...args) => this.out("log", args),
        error: (...args) => this.out("error", args),
        warn: (...args) => this.out("warn", args),
        info: (...args) => this.out("log", args)
      }
      win.setInterval(() => {
        this.startedAt = null
      }, 1000)

      win.__setTimeout = win.setTimeout
      win.__setInterval = win.setInterval
      win.setTimeout = (code, time) => {
        let val = win.__setTimeout(() => this.run(code), time)
        this.timeouts.push(val)
        return val
      }
      win.setInterval = (code, time) => {
        let val = win.__setInterval(() => this.run(code), time)
        this.intervals.push(val)
        return val
      }
      let reqAnimFrame = win.requestAnimationFrame
      if (!reqAnimFrame) ["webkit", "moz", "ms", "o"].forEach(prefix => {
        let val = win[prefix + "RequestAnimationFrame"]
        if (val) {
          reqAnimFrame = val
          win.cancelAnimationFrame = prefix + "CancelAnimationFrame"
        }
      })
      if (!reqAnimFrame) {
        reqAnimFrame = f => this.__setTimeout(f, 50)
        win.cancelAnimationFrame = win.clearTimeout
      }
      win.requestAnimationFrame = f => {
        let val = reqAnimFrame.call(win, f)
        if (this.frames.length > 50)
          this.frames[this.framePos++ % 50] = val
        else
          this.frames.push(val)
        return val
      }
    }

    resizeFrame() {
      this.frame.style.height = Math.max(80, Math.min(this.win.document.documentElement.offsetHeight + 10, 500)) + "px"
      let box = this.frame.getBoundingClientRect()
      if (box.bottom > box.top && box.top >= 0 && box.top < window.innerHeight && box.bottom > window.innerHeight)
        window.scrollBy(0, Math.min(box.top, box.bottom - window.innerHeight))
    }

    tick() {
      let now = Date.now()
      if (this.startedAt == null) this.startedAt = now
      if (now < this.startedAt + this.extraSecs * 1000) return
      let bail = confirm("This code has been running for " + this.extraSecs +
                         " seconds. Abort it?")
      this.startedAt += Date.now() - now
      this.extraSecs += Math.max(this.extraSecs, 8)
      if (bail) throw new Error("Aborted")
    }

    out(type, args) {
      if (this.output) this.output.out(type, args)
      else console[type].apply(console, args)
    }

    error(exception) {
      if (!this.output) throw exception
      let stack = parseStack(exception.stack)
      this.output.out("error", [String(exception) + (stack.length ? " (" + frameString(stack[0]) + ")" : "")])
      if (stack.length > 1) {
        this.output.div.lastChild.appendChild(document.createTextNode(" "))
        let mark = this.output.div.lastChild.appendChild(document.createElement("span"))
        mark.innerHTML = "…"
        mark.className = "sandbox-output-etc"
        mark.addEventListener("click", () => {
          mark.className = ""
          mark.innerHTML = "\n called from " + stack.slice(1).map(frameString).join("\n called from ")
        })
      }
    }

    clearEvents() {
      while (this.timeouts.length) this.win.clearTimeout(this.timeouts.pop())
      while (this.intervals.length) this.win.clearInterval(this.intervals.pop())
      while (this.frames.length) this.win.cancelAnimationFrame(this.frames.pop())
      this.timeouts.length = this.intervals.length = this.frames.length = this.framePos = 0
    }
  }

  function preprocess(code, sandbox) {
    if (typeof code != "string") {
      if (code.apply)
        return (...args) => {
          try { return code.apply(this, args) }
          catch(e) { sandbox.error(e) }
        }
      return code
    }

    let strict = /^(\s|\/\/.*)*["']use strict['"]/.test(code), ast
    try { ast = acorn.parse(code) }
    catch(e) { return code }
    let patches = []
    let backJump = "if (++__c % 1000 === 0) __sandbox.tick();"
    function loop(node) {
      if (node.body.type == "BlockStatement") {
        patches.push({from: node.body.end - 1, text: backJump})
      } else {
        patches.push({from: node.body.start, text: "{"},
                     {from: node.body.end, text: backJump + "}"})
      }
    }
    acorn.walk.simple(ast, {
      ForStatement: loop,
      ForInStatement: loop,
      WhileStatement: loop,
      DoWhileStatement: loop
    })
    let tryPos = 0, catchPos = ast.end
    for (let i = strict ? 1 : 0; i < ast.body.length; i++) {
      let stat = ast.body[i]
      if (stat.type != "FunctionDeclaration") {
        if (tryPos == 0) tryPos = stat.start
        catchPos = stat.end
      }
      if (stat.type == "VariableDeclaration" && stat.kind != "var")
        patches.push({from: stat.start, to: stat.start + stat.kind.length, text: "var"})
    }
    patches.push({from: tryPos, text: "try{"})
    patches.push({from: catchPos, text: "}catch(e){__sandbox.error(e);}"})
    patches.sort(function(a, b) { return a.from - b.from || (a.to || a.from) - (b.to || b.from)})
    let out = "", pos = 0
    for (let i = 0; i < patches.length; ++i) {
      let patch = patches[i]
      out += code.slice(pos, patch.from) + patch.text
      pos = patch.to || patch.from
    }
    out += code.slice(pos, code.length)
    return (strict ? '"use strict";' : "") + out
  }

  let Output = SandBox.Output = function(div) {
    this.div = div
  }

  Output.prototype = {
    clear: function() {
      let clone = this.div.cloneNode(false)
      this.div.parentNode.replaceChild(clone, this.div)
      this.div = clone
    },
    out: function(type, args) {
      let wrap = document.createElement("pre")
      wrap.className = "sandbox-output-" + type
      for (let i = 0; i < args.length; ++i) {
        let arg = args[i]
        if (i) wrap.appendChild(document.createTextNode(" "))
        if (typeof arg == "string")
          wrap.appendChild(document.createTextNode(arg))
        else
          wrap.appendChild(represent(arg, 58))
      }
      this.div.appendChild(wrap)
    }
  }

  function span(type, text) {
    let sp = document.createElement("span")
    sp.className = "sandbox-output-" + type
    sp.appendChild(document.createTextNode(text))
    return sp
  }

  function eltSize(elt) {
    return elt.textContent.length
  }

  function represent(val, space) {
    if (typeof val == "boolean") return span("bool", String(val))
    if (typeof val == "number") return span("number", String(val))
    if (typeof val == "string") return span("string", JSON.stringify(val))
    if (val == null) return span("null", String(val))
    if (Array.isArray(val)) return representArray(val, space)
    else return representObj(val, space)
  }

  function representArray(val, space) {
    space -= 2
    let wrap = document.createElement("span")
    wrap.appendChild(document.createTextNode("["))
    for (let i = 0; i < val.length; ++i) {
      if (i) {
        wrap.appendChild(document.createTextNode(", "))
        space -= 2
      }
      let next = space > 0 && represent(val[i], space)
      let nextSize = next ? eltSize(next) : 0
      if (space - nextSize <= 0) {
        wrap.appendChild(span("etc", "…")).addEventListener("click", () => expandObj(wrap, "array", val))
        break
      }
      space -= nextSize
      wrap.appendChild(next)
    }
    wrap.appendChild(document.createTextNode("]"))
    return wrap
  }

  function representObj(val, space) {
    let string = typeof val.toString == "function" && val.toString(), m
    if (!string || /^\[object .*\]$/.test(string))
      return representSimpleObj(val, space)
    if (val.call && (m = string.match(/^\s*(function[^(]*\([^)]*\))/)))
      return span("fun", m[1] + "{…}")
    let elt = span("etc", string)
    elt.addEventListener("click", () => expandObj(elt, "obj", val))
    return elt
  }

  function constructorName(obj) {
    if (!obj.constructor) return null
    let m = String(obj.constructor).match(/^function\s*([^\s(]+)/)
    if (m && m[1] != "Object") return m[1]
  }

  function hop(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop)
  }

  function representSimpleObj(val, space) {
    space -= 2
    let wrap = document.createElement("span")
    let name = constructorName(val)
    if (name) {
      space -= name.length
      wrap.appendChild(document.createTextNode(name))
    }
    wrap.appendChild(document.createTextNode("{"))
    try {
      let first = true
      for (let prop in val) if (hop(val, prop)) {
        if (first) {
          first = false
        } else {
          space -= 2
          wrap.appendChild(document.createTextNode(", "))
        }
        let next = space > 0 && represent(val[prop], space)
        let nextSize = next ? prop.length + 2 + eltSize(next) : 0
        if (space - nextSize <= 0) {
          wrap.appendChild(span("etc", "…")).addEventListener("click", () => expandObj(wrap, "obj", val))
          break
        }
        space -= nextSize
        wrap.appendChild(span("prop", prop + ": "))
        wrap.appendChild(next)
      }
    } catch (e) {
      wrap.appendChild(document.createTextNode("…"))
    }
    wrap.appendChild(document.createTextNode("}"))
    return wrap
  }

  function expandObj(node, type, val) {
    let wrap = document.createElement("span")
    let opening = type == "array" ? "[" : "{", cname
    if (opening == "{" && (cname = constructorName(val))) opening = cname + " {"
    wrap.appendChild(document.createTextNode(opening))
    let block = wrap.appendChild(document.createElement("div"))
    block.className = "sandbox-output-etc-block"
    let table = block.appendChild(document.createElement("table"))
    function addProp(name) {
      let row = table.appendChild(document.createElement("tr"))
      row.appendChild(document.createElement("td")).appendChild(span("prop", name + ":"))
      row.appendChild(document.createElement("td")).appendChild(represent(val[name], 40))
    }
    if (type == "array") {
      for (let i = 0; i < val.length; ++i) addProp(i)
    } else {
      for (let prop in val) if (hop(val, prop)) addProp(prop)
    }
    wrap.appendChild(document.createTextNode(type == "array" ? "]" : "}"))
    node.parentNode.replaceChild(wrap, node)
  }
})()
