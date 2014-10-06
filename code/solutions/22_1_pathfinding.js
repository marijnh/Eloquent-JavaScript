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

var graph = treeGraph(4, 4);
var root = graph[0], leaf = graph[graph.length - 1];
console.log(findPath(root, leaf).length);
// → 4

leaf.connect(root);
console.log(findPath(root, leaf).length);
// → 2
