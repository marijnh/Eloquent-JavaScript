async function locateScalpel() {
  let nest = me;
  for (;;) {
    let nextNest = await anyStorage(nest, "scalpel");
    if (nextNest == nest) return nest;
    nest = nextNest;
  }
}

function locateScalpel2() {
  function loop(nest) {
    return anyStorage(nest, "scalpel").then(nextNest => {
      if (nextNest == nest) return nest;
      else return loop(nextNest);
    });
  }
  return loop(me);
}

locateScalpel().then(console.log);
// → Butcher's Shop
locateScalpel2().then(console.log);
// → Butcher's Shop
