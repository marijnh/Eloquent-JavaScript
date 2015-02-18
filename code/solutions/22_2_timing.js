function findPath(a, b) {
  var work = [[a]];
  for (var i = 0; i < work.length; i++) {
    var cur = work[i], end = cur[cur.length - 1];
    if (end == b) return cur;
    end.edges.forEach(function(next) {
      if (!work.some(function(work) { return work[work.length - 1] == next; }))
        work.push(cur.concat([next]));
    });
  }
}

var graph = treeGraph(6, 5);
var startTime = Date.now();
console.log(findPath(graph[0], graph[graph.length - 1]).length);
console.log("Time taken:", Date.now() - startTime);
