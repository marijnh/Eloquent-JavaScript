function withIDs(graph) {
  for (var i = 0; i < graph.length; i++) graph[i].id = i;
  return graph;
}
var graph = withIDs(treeGraph(8, 5));

function findPath_ids(a, b) {
  var work = [[a]];
  var seen = Object.create(null);
  for (var i = 0; i < work.length; i++) {
    var cur = work[i], end = cur[cur.length - 1];
    if (end == b) return cur;
    end.edges.forEach(function(next) {
      if (!seen[next.id]) {
        seen[next.id] = true;
        work.push(cur.concat([next]));
      }
    });
  }
}

var startTime = Date.now();
console.log(findPath_ids(graph[0], graph[graph.length - 1]).length);
console.log("Time taken with ids:", Date.now() - startTime);

function listToArray(list) {
  var result = [];
  for (var cur = list; cur; cur = cur.via)
    result.unshift(cur.last);
  return result;
}

function findPath_list(a, b) {
  var work = [{last: a, via: null}];
  var seen = Object.create(null);
  for (var i = 0; i < work.length; i++) {
    var cur = work[i];
    if (cur.last == b) return listToArray(cur);
    cur.last.edges.forEach(function(next) {
      if (!seen[next.id]) {
        seen[next.id] = true;
        work.push({last: next, via: cur});
      }
    });
  }
}

var startTime = Date.now();
console.log(findPath_list(graph[0], graph[graph.length - 1]).length);
console.log("Time taken with ids + lists:", Date.now() - startTime);
