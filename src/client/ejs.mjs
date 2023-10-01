import {EditorView, keymap} from "@codemirror/view"
import {Facet} from "@codemirror/state"
import {createState} from "./editor.mjs"
import {Sandbox} from "./sandbox.mjs"

let sandboxHint = null
if (window.page && window.page.type == "chapter" && window.page.number < 20 &&
    window.localStorage && !localStorage.getItem("usedSandbox")) {
  let pres = document.getElementsByTagName("pre")
  for (let i = 0; i < pres.length; i++) {
    let pre = pres[i]
    if (!/^(text\/)?(javascript|html)$/.test(pre.getAttribute("data-language")) ||
        window.page.number == 1 && !/console\.log/.test(pre.textContent)) continue
    sandboxHint = elt("div", {"class": "sandboxhint"},
                      "edit & run code by clicking it")
    pre.insertBefore(sandboxHint, pre.firstChild)
    break
  }
}

function makeCodeInteractive() {
  document.body.addEventListener("click", e => {
    for (let n = e.target; n; n = n.parentNode) {
      if (n.className == "c_ident") return
      let lang = n.nodeName == "PRE" && n.getAttribute("data-language")
      if (/^(text\/)?(javascript|html)$/.test(lang))
        return activateCode(n, e, lang)
      if (n.nodeName == "DIV" && n.className == "solution")
        n.className = "solution open"
    }
  })

  function elt(type, attrs) {
    let firstChild = 1
    let node = document.createElement(type)
    if (attrs && typeof attrs == "object" && attrs.nodeType == null) {
      for (let attr in attrs) if (attrs.hasOwnProperty(attr)) {
        if (attr == "css") node.style.cssText = attrs[attr]
        else node.setAttribute(attr, attrs[attr])
      }
      firstChild = 2
    }
    for (let i = firstChild; i < arguments.length; ++i) {
      let child = arguments[i]
      if (typeof child == "string") child = document.createTextNode(child)
      node.appendChild(child)
    }
    return node
  }

  const contextFacet = Facet.define({
    combine(vs) { return vs[0] }
  })


  const extraKeys = keymap.of([
    {key: "ArrowDown", run(cm) {
      let {main} = cm.state.selection
      if (!main.empty || main.head < cm.state.doc.length) return false
      document.activeElement.blur()
      return true
    }},
    {key: "ArrowUp", run(cm) {
      let {main} = cm.state.selection
      if (!main.empty || main.head > 0) return false
      document.activeElement.blur()
      return true
    }},
    {key: "Escape", run(cm) {
      cm.contentDOM.blur()
      return true
    }},
    {key: "Ctrl-Enter", run(cm) {
      runCode(cm)
      return true
    }},
    {key: "Cmd-Enter", run(cm) {
      runCode(cm)
      return true
    }},
    {key: "Ctrl-ArrowDown", run(cm) {
      closeCode(cm)
      return true
    }},
    {key: "Ctrl-Escape", run(cm) {
      resetSandbox(cm.state.facet(contextFacet).sandbox)
      return true
    }},
    {key: "Cmd-Escape", run(cm) {
      resetSandbox(cm.state.facet(contextFacet).sandbox)
      return true
    }}
  ])

  let nextID = 0
  let article = document.getElementsByTagName("article")[0]

  function activateCode(node, e, lang) {
    if (sandboxHint) {
      sandboxHint.parentNode.removeChild(sandboxHint)
      sandboxHint = null
      localStorage.setItem("usedSandbox", "true")
    }

    const codeId = node.querySelector("a").id
    let code = (window.localStorage && localStorage.getItem(codeId)) || node.textContent
    let wrap = node.parentNode.insertBefore(elt("div", {"class": "editor-wrap"}), node)
    let pollingScroll = null
    function pollScroll() {
      if (document.activeElement != editor.contentDOM) return
      let rect = editor.dom.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > innerHeight) editor.contentDOM.blur()
      else pollingScroll = setTimeout(pollScroll, 500)
    }
    let sandbox = node.getAttribute("data-sandbox")
    let context = {
      wrap: wrap,
      orig: node,
      isHTML: lang == "text/html",
      sandbox,
      meta: node.getAttribute("data-meta")
    }
    let editorState = createState(code, lang, [
      extraKeys,
      EditorView.domEventHandlers({
        focus: () => {
          clearTimeout(pollingScroll)
          pollingScroll = setTimeout(pollScroll, 500)
        }
      }),
      EditorView.updateListener.of(debounce(update => {
        if (update.docChanged && window.localStorage)
          localStorage.setItem(codeId, editor.state.doc.toString())
      }, 250)),
      contextFacet.of(context)
    ])
    let editor = new EditorView({state: editorState, parent: wrap})
    wrap.style.marginLeft = wrap.style.marginRight = -Math.min(article.offsetLeft, 100) + "px"
    setTimeout(() => editor.requestMeasure(), 600)
    if (e) {
      let pos = editor.posAtCoords({x: e.clientX, y: e.clientY}, false)
      editor.dispatch({selection: {anchor: pos}})
      editor.focus()
    }
    let out = wrap.appendChild(elt("div", {"class": "sandbox-output"}))
    context.output = new Sandbox.Output(out)
    let menu = wrap.appendChild(elt("div", {"class": "sandbox-menu", title: "Sandbox menu..."}))
    if (lang == "text/html" && !sandbox) {
      sandbox = "html" + nextID++
      node.setAttribute("data-sandbox", sandbox)
      sandboxSnippets[sandbox] = node
    }
    node.style.display = "none"

    menu.addEventListener("click", () => openMenu(editor, menu))
  }

  function openMenu(editor, node) {
    let menu = elt("div", {"class": "sandbox-open-menu"})
    let context = editor.state.facet(contextFacet)
    let items = [["Run code (ctrl/cmd-enter)", () => runCode(editor)],
                 ["Revert to original code", () => revertCode(editor)],
                 ["Reset sandbox (ctrl/cmd-esc)", () => resetSandbox(context.sandbox)]]
    if (!context.isHTML || !context.sandbox)
      items.push(["Deactivate editor (ctrl-down)", () => { closeCode(editor) }])
    items.forEach(choice => menu.appendChild(elt("div", choice[0])))
    function click(e) {
      let target = e.target
      if (e.target.parentNode == menu) {
        for (let i = 0; i < menu.childNodes.length; ++i)
          if (target == menu.childNodes[i])
            items[i][1]()
      }
      menu.parentNode.removeChild(menu)
      window.removeEventListener("click", click)
    }
    setTimeout(() => window.addEventListener("click", click), 20)
    node.offsetParent.appendChild(menu)
  }

  function runCode(editor) {
    let context = editor.state.facet(contextFacet)
    context.output.clear()
    let val = editor.state.doc.toString()
    getSandbox(context.sandbox, context.isHTML).then(box => {
      if (context.isHTML)
        box.setHTML(val, context.output, () => {
          if (context.orig.getAttribute("data-focus")) {
            box.win.focus()
            box.win.document.body.focus()
          }
        })
      else
        box.run(val, context.output)
    })
  }

  function closeCode(editor) {
    let context = editor.state.facet(contextFacet)
    if (context.isHTML && context.sandbox) return
    context.wrap.remove()
    context.orig.style.display = ""
  }

  function revertCode(editor) {
    let context = editor.state.facet(contextFacet)
    editor.dispatch({
      selection: {anchor: 0},
      changes: {from: 0, to: editor.state.doc.length, insert: context.orig.textContent}
    })
  }

  let sandboxSnippets = {}
  {
    let snippets = document.getElementsByClassName("snippet")
    for (let i = 0; i < snippets.length; i++) {
      let snippet = snippets[i]
      if (snippet.getAttribute("data-language") == "html" &&
          snippet.getAttribute("data-sandbox"))
        sandboxSnippets[snippet.getAttribute("data-sandbox")] = snippet
    }
  }

  let sandboxes = {}
  async function getSandbox(name, forHTML) {
    name = name || "null"
    if (sandboxes.hasOwnProperty(name)) return sandboxes[name]
    let options = {loadFiles: window.sandboxLoadFiles}, html
    if (sandboxSnippets.hasOwnProperty(name)) {
      let snippet = sandboxSnippets[name]
      options.place = node => placeFrame(node, snippet)
      if (!forHTML) html = snippet.textContent
    }
    let box = await Sandbox.create(options)
    if (html != null)
      box.win.document.documentElement.innerHTML = html
    sandboxes[name] = box
    return box
  }

  function resetSandbox(name) {
    if (!sandboxes.hasOwnProperty(name)) return
    let frame = sandboxes[name].frame
    frame.parentNode.removeChild(frame)
    delete sandboxes[name]
  }

  function placeFrame(frame, snippet) {
    let wrap = snippet.previousSibling, bot
    if (!wrap || wrap.className != "editor-wrap") {
      bot = snippet.getBoundingClientRect().bottom
      activateCode(snippet, null, "html")
      wrap = snippet.previousSibling
    } else {
      bot = wrap.getBoundingClientRect().bottom
    }
    wrap.insertBefore(frame, wrap.childNodes[1])
    if (bot < 50) {
      let newBot = wrap.getBoundingClientRect().bottom
      window.scrollBy(0, newBot - bot)
    }
  }
}

function debounce(fn, delay = 50) {
  let timeout
  return arg => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(arg), delay)
  }
}

if (window.page && /^chapter|hints$/.test(window.page.type)) makeCodeInteractive()
