(function() {
  if (typeof Worker == "undefined")
    throw new Error("This script relies on web workers to model the network nodes. They don't appear to be available here.")

  if (typeof __sandbox != "undefined") {
    __sandbox.handleDeps = false
    __sandbox.notify.onLoad = () => {
      // Kludge to make sure some functions are delayed until the
      // nodes have been running for 500ms, to give them a chance to
      // propagate network information.
      let waitFor = Date.now() + 500
      function wrapWaiting(f) {
        return function(...args) {
          let wait = waitFor - Date.now()
          if (wait <= 0) return f(...args)
          return new Promise(ok => setTimeout(ok, wait)).then(() => f(...args))
        }
      }
      for (let n of ["routeRequest", "findInStorage", "chicks"])
        window[n] = wrapWaiting(window[n])
    }
    __sandbox.notify.onRun = (code, meta) => {
      if (meta != "allNodes") return
      for (let name in reachable) if (name != local)
        nodes[name].postMessage({tag: "eval", code})
    }
  }

  let network = ["Church Tower-Sportsgrounds", "Church Tower-Big Maple", "Big Maple-Sportsgrounds",
                 "Big Maple-Woods", "Big Maple-Fabienne's Garden", "Fabienne's Garden-Woods",
                 "Fabienne's Garden-Cow Pasture", "Cow Pasture-Big Oak", "Big Oak-Butcher Shop",
                 "Butcher Shop-Tall Poplar", "Tall Poplar-Sportsgrounds", "Tall Poplar-Chateau",
                 "Chateau-Great Pine", "Great Pine-Jaques' Farm", "Jaques' Farm-Hawthorn",
                 "Great Pine-Hawthorn", "Hawthorn-Gilles' Garden", "Great Pine-Gilles' Garden",
                 "Gilles' Garden-Big Oak", "Gilles' Garden-Butcher Shop", "Chateau-Butcher Shop"]

  let reachable = Object.create(null)
  for (let [from, to] of network.map(conn => conn.split("-"))) {
    ;(reachable[from] || (reachable[from] = [])).push(to)
    ;(reachable[to] || (reachable[to] = [])).push(from)
  }

  function storageFor(name) {
    let storage = Object.create(null)
    storage["food caches"] = ["cache in the oak", "cache in the meadow", "cache under the hedge"]
    storage["cache in the oak"] = "A hollow above the third big branch from the bottom. Several pieces of bread and a pile of acorns."
    storage["cache in the meadow"] = "Buried below the patch of nettles (south side). A dead snake."
    storage["cache under the hedge"] = "Middle of the hedge at Gilles' garden. Marked with a forked twig. Two bottles of beer."
    storage["enemies"] = ["Farmer Jaques' dog", "The butcher", "That one-legged jackdaw", "The boy with the airgun"]
    if (name == "Church Tower" || name == "Hawthorn" || name == "Chateau")
      storage["events on 2017-12-21"] = "Deep snow. Butcher's garbage can fell over. We chased off the ravens from Saint-Vulbas."
    for (let y = 1985; y <= 2018; y++) storage[`chicks in ${y}`] = Math.floor(Math.random() * 6)
    if (name == "Big Oak") storage.scalpel = "Gilles' Garden"
    else if (name == "Gilles' Garden") storage.scalpel = "Woods"
    else if (name == "Woods") storage.scalpel = "Chateau"
    else if (name == "Chateau" || name == "Butcher Shop") storage.scalpel = "Butcher Shop"
    else storage.scalpel = "Big Oak"
    return storage
  }
  
  let local = "Big Oak"
  let storage = storageFor(local)

  let nodes = Object.create(null)
  for (let name in reachable) if (name != local) {
    let worker = nodes[name] = new Worker("code/crows_worker.js")
    worker.addEventListener("message", e => dispatchMessage(name, e.data))
    worker.postMessage({tag: "init", name, reachable: reachable[name], storage: storageFor(name)})
  }

  let running = Object.create(null)

  function send(target, message) {
    setTimeout(() => nodes[target].postMessage(message), 10)
  }

  function serializeFailure(value) {
    return value instanceof Error ? {__errorMessage: value.message} : value
  }

  function deserializeFailure(value) {
    return value && value.__errorMessage ? new Error(value.__errorMessage) : value
  }

  function dispatchMessage(source, message) {
    if (message.tag == "message") {
      let {target, id, type, content} = message
      if (target == local) {
        let handler = types[type] || ((_c, _s, callback) => callback("Request type ${type} not available"))
        handler(content, source, (failure, content) => {
          send(source, {tag: "response", id, failure: serializeFailure(failure), content})
        })
      } else {
        send(target, {tag: "message", id, type, source, content})
      }
    } else if (message.tag == "response") {
      let {target, id, content, failure} = message
      if (target == local) {
        let callback = running[id]
        if (callback) {
          delete running[id]
          callback(deserializeFailure(failure), content)
        }
      } else {
        send(target, {tag: "response", id, content, failure})
      }
    } else if (message.tag == "log") {
      console.log(...message.args)
    }
  }

  let types = Object.create(null)

  let exports = {
    neighbors: reachable[local],
    me: local,
    defineRequestType(name, handler) { types[name] = handler },
    makeRequest(target, type, content, callback) {
      if (!reachable[local].includes(target)) throw new Error(`${target} is not reachable from ${local}`)
      if (Math.random() < 0.03) return

      let id = Math.floor(Math.random() * 0xffffffff)
      running[id] = callback
      send(target, {tag: "message", id, type, source: local, content})
    },
    readStorage(name, callback) {
      setTimeout(() => callback(storage[name]), 20)
    }
  }

  window.require = name => {
    if (name != "crow-tech") throw new Error("Crow nests can only require \"crow-tech\"")
    return exports
  }

  window.List = class List {
    constructor(value, rest) {
      this.value = value;
      this.rest = rest;
    }

    toArray() {
      let array = [];
      for (let list = this; list != List.empty; list = list.rest) {
        array.push(list.value);
      }
      return array;
    }

    get length() {
      let length = 0;
      for (let list = this; list != List.empty; list = list.rest) {
        length++;
      }
      return length;
    }

    static fromArray(array) {
      let list = List.empty;
      for (let i = array.length - 1; i >= 0; i--) {
        list = new List(array[i], list);
      }
      return list;
    }
  }

  List.empty = new List(undefined, undefined);
})()
