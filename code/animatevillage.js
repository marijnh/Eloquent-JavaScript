// test: no

(function() {
  "use strict"

  let active = null

  const places = {
    "Alice's House": {x: 310, y: 90},
    "Bob's House": {x: 312, y: 196},
    "Cabin": {x: 378, y: 60},
    "Post Office": {x: 215, y: 60},
    "Town Hall": {x: 213, y: 200},
    "Daria's House": {x: 170, y: 282},
    "Ernie's House": {x: 69, y: 283},
    "Grete's House": {x: 37, y: 193},
    "Farm": {x: 61, y: 119},
    "Shop": {x: 113, y: 211},
    "Marketplace": {x: 200, y: 98}
  }

  const speed = 2

  class Animation {
    constructor(worldState, robot, robotState) {
      this.worldState = worldState
      this.robot = robot
      this.robotState = robotState
      this.turn = 0

      let outer = (window.__sandbox ? window.__sandbox.output.div : document.body), doc = outer.ownerDocument
      this.node = outer.appendChild(doc.createElement("div"))
      this.node.style.cssText = "position: relative; line-height: 0.1; padding-left: 10px"
      this.map = this.node.appendChild(doc.createElement("img"))
      this.map.src = "img/village2x.png"
      this.map.style.cssText = "vertical-align: -8px"
      this.robotElt = this.node.appendChild(doc.createElement("div"))
      this.robotElt.style.cssText = `position: absolute; transition: left ${0.8 / speed}s, top ${0.8 / speed}s;`
      let robotPic = this.robotElt.appendChild(doc.createElement("img"))
      robotPic.src = "img/robot2x.png"
      this.parcels = []

      this.text = this.node.appendChild(doc.createElement("span"))
      this.button = this.node.appendChild(doc.createElement("button"))
      this.button.style.cssText = "color: white; background: #28b; border: none; border-radius: 2px; padding: 2px 5px; line-height: 1.1; font-family: sans-serif; font-size: 80%"
      this.button.textContent = "Stop"

      this.button.addEventListener("click", () => this.clicked())
      this.schedule()

      this.updateView()
      this.updateParcels()

      this.robotElt.addEventListener("transitionend", () => this.updateParcels())
    }


    updateView() {
      let pos = places[this.worldState.place]
      this.robotElt.style.top = (pos.y - this.robotElt.offsetHeight) + "px"
      this.robotElt.style.left = (pos.x - (this.robotElt.offsetWidth / 2)) + "px"

      this.text.textContent = ` Turn ${this.turn} `
    }

    updateParcels() {
      while (this.parcels.length) this.parcels.pop().remove()
      let heights = {}
      for (let {place, address} of this.worldState.parcels) {
        let height = heights[place] || (heights[place] = 0)
        heights[place] += 11
        let node = document.createElement("div")
        node.style.cssText = "position: absolute; height: 10px; width: 10px; background-image: url(img/parcel2x.png); font-size: 10px; text-align: center; line-height: 10px; font-family: sans-serif"
        node.textContent = address.charAt(0)
        if (place == this.worldState.place) {
          node.style.right = "-5px"
          node.style.bottom = (24 + height) + "px"
          this.robotElt.appendChild(node)
        } else {
          let pos = places[place]
          node.style.left = (pos.x - 5) + "px"
          node.style.top = (pos.y - 10 - height) + "px"
          this.node.appendChild(node)
        }
        this.parcels.push(node)
      }
    }

    tick() {
      let {direction, memory} = this.robot(this.worldState, this.robotState)
      this.worldState = this.worldState.move(direction)
      this.robotState = memory
      this.turn++
      this.updateView()
      if (this.worldState.parcels.length == 0) {
        this.button.remove()
        this.text.textContent = ` Finished after ${this.turn} turns`
      } else {
        this.schedule()
      }
    }

    schedule() {
      this.timeout = setTimeout(() => this.tick(), 1000 / speed)
    }

    clicked() {
      if (this.timeout == null) {
        this.schedule()
        this.button.textContent = "Stop"
      } else {
        clearTimeout(this.timeout)
        this.timeout = null
        this.button.textContent = "Start"
      }
    }
  }

  window.runRobotAnimation = function(worldState, robot, robotState) {
    if (active && active.timeout != null)
      clearTimeout(active.timeout)
    active = new Animation(worldState, robot, robotState)
  }
})()
