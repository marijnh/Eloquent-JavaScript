(function() {
  let local, reachable, storage

  let running = Object.create(null)

  let types = Object.create(null)

  function serializeFailure(value) {
    return value instanceof Error ? {__errorMessage: value.message} : value
  }

  function deserializeFailure(value) {
    return value && value.__errorMessage ? new Error(value.__errorMessage) : value
  }

  self.require = function(name) {
    if (name != "crow-tech")
      throw new Error("Only \"crow-tech\" can be required in crow nests")

    return {
      me: local,

      neighbors: reachable,

      makeRequest(target, type, content, callback) {
        if (!reachable.includes(target)) throw new Error(`${target} is not reachable from ${local}`)
        if (Math.random() < 0.05) return

        let id = Math.floor(Math.random() * 0xffffffff)
        running[id] = callback
        postMessage({tag: "message", id, target, type, content})
      },

      defineRequestType(name, handler) {
        types[name] = handler
      },

      readStorage(name, callback) {
        setTimeout(() => callback(storage[name]), 20)
      }
    }
  }

  function log(...args) { postMessage({tag: "log", args}) }
  self.console = {log, warn: log}

  addEventListener("message", e => {
    let tag = e.data.tag
    if (tag == "init") {
      local = e.data.name
      reachable = e.data.reachable
      storage = e.data.storage
      importScripts("chapter/11_async.js")
    } else if (tag == "response") {
      let {id, failure, content} = e.data
      let callback = running[id]
      if (callback) {
        delete running[id]
        callback(deserializeFailure(failure), content)
      }
    } else if (tag == "message") {
      let {id, source, type, content} = e.data
      let handler = types[type] || ((_m, _s, callback) => callback(`Request type ${type} not available`))
      handler(content, source, (failure, content) => {
        postMessage({tag: "response", id, target: source, failure: serializeFailure(failure), content})
      })
    } else if (tag == "eval") {
      setTimeout(e.data.code, 1)
    }
  })
})()
