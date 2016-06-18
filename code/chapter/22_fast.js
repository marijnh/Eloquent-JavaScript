function GraphNode(pos, edges) {
  this.pos = new Vector(Math.random() * 1000,
                        Math.random() * 1000);
  this.edges = [];
}
GraphNode.prototype.connect = function(other) {
  this.edges.push(other);
  other.edges.push(this);
};
GraphNode.prototype.hasEdge = function(other) {
  for (var i = 0; i < this.edges.length; i++)
    if (this.edges[i] == other)
      return true;
};

function treeGraph(depth, branches) {
  var graph = [];
  function buildNode(depth) {
    var node = new GraphNode();
    graph.push(node);
    if (depth > 1)
      for (var i = 0; i < branches; i++)
        node.connect(buildNode(depth - 1));
    return node;
  }
  buildNode(depth);
  return graph;
}

var springLength = 40;
var springStrength = 0.1;

var repulsionStrength = 1500;

function forceDirected_simple(graph) {
  graph.forEach(function(node) {
    graph.forEach(function(other) {
      if (other == node) return;
      var apart = other.pos.minus(node.pos);
      var distance = Math.max(1, apart.length);
      var forceSize = -repulsionStrength / (distance * distance);
      if (node.hasEdge(other))
        forceSize += (distance - springLength) * springStrength;
      var normalized = apart.times(1 / distance);
      node.pos = node.pos.plus(normalized.times(forceSize));
    });
  });
}

function runLayout(implementation, graph) {
  var totalSteps = 0, time = 0;
  function step() {
    var startTime = Date.now();
    for (var i = 0; i < 100; i++)
      implementation(graph);
    totalSteps += 100;
    time += Date.now() - startTime;
    drawGraph(graph);

    if (totalSteps < 4000)
      requestAnimationFrame(step);
    else
      console.log(time);
  }
  step();
}

function forceDirected_forloop(graph) {
  for (var i = 0; i < graph.length; i++) {
    var node = graph[i];
    for (var j = 0; j < graph.length; j++) {
      if (i == j) continue;
      var other = graph[j];
      var apart = other.pos.minus(node.pos);
      var distance = Math.max(1, apart.length);
      var forceSize = -1 * repulsionStrength / (distance * distance);
      if (node.hasEdge(other))
        forceSize += (distance - springLength) * springStrength;
      var normalized = apart.times(1 / distance);
      node.pos = node.pos.plus(normalized.times(forceSize));
    }
  }
}

function forceDirected_norepeat(graph) {
  for (var i = 0; i < graph.length; i++) {
    var node = graph[i];
    for (var j = i + 1; j < graph.length; j++) {
      var other = graph[j];
      var apart = other.pos.minus(node.pos);
      var distance = Math.max(1, apart.length);
      var forceSize = -1 * repulsionStrength / (distance * distance);
      if (node.hasEdge(other))
        forceSize += (distance - springLength) * springStrength;
      var applied = apart.times(forceSize / distance);
      node.pos = node.pos.plus(applied);
      other.pos = other.pos.minus(applied);
    }
  }
}

function forceDirected_novector(graph) {
  for (var i = 0; i < graph.length; i++) {
    var node = graph[i];
    for (var j = i + 1; j < graph.length; j++) {
      var other = graph[j];
      var apartX = other.pos.x - node.pos.x;
      var apartY = other.pos.y - node.pos.y;
      var distance = Math.max(1, Math.sqrt(apartX * apartX + apartY * apartY));
      var forceSize = -repulsionStrength / (distance * distance);
      if (node.hasEdge(other))
        forceSize += (distance - springLength) * springStrength;

      var forceX = apartX * forceSize / distance;
      var forceY = apartY * forceSize / distance;
      node.pos.x  += forceX; node.pos.y  += forceY;
      other.pos.x -= forceX; other.pos.y -= forceY;
    }
  }
}

function forceDirected_localforce(graph) {
  var forcesX = [], forcesY = [];
  for (var i = 0; i < graph.length; i++)
   forcesX[i] = forcesY[i] = 0;

  for (var i = 0; i < graph.length; i++) {
    var node = graph[i];
    for (var j = i + 1; j < graph.length; j++) {
      var other = graph[j];
      var apartX = other.pos.x - node.pos.x;
      var apartY = other.pos.y - node.pos.y;
      var distance = Math.max(1, Math.sqrt(apartX * apartX + apartY * apartY));
      var forceSize = -repulsionStrength / (distance * distance);
      if (node.hasEdge(other))
        forceSize += (distance - springLength) * springStrength;

      var forceX = apartX * forceSize / distance;
      var forceY = apartY * forceSize / distance;
      forcesX[i] += forceX; forcesY[i] += forceY;
      forcesX[j] -= forceX; forcesY[j] -= forceY;
    }
  }

  for (var i = 0; i < graph.length; i++) {
    graph[i].pos.x += forcesX[i];
    graph[i].pos.y += forcesY[i];
  }
}

var mangledGraph = treeGraph(4, 4);
mangledGraph.forEach(function(node) {
  var letter = Math.floor(Math.random() * 26);
  node[String.fromCharCode("A".charCodeAt(0) + letter)] = true;
});
