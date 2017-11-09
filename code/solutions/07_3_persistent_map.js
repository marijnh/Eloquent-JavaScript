class PMap {
  constructor(pairs) {
    this.pairs = pairs;
  }

  find(key) {
    return this.pairs.find(p => p[0] === key);
  }

  get(key) {
    let found = this.find(key);
    return found ? found[1] : undefined;
  }

  has(key) {
    return this.find(key) ? true : false;
  }

  set(key, value) {
    return new PMap(this.pairs
                      .filter(p => p[0] != key)
                      .concat([[key, value]]));
  }

  delete(key) {
    return new PMap(this.pairs.filter(p => p[0] != key));
  }
}

PMap.empty = new PMap([]);

let a = PMap.empty.set("a", 1);
let ab = a.set("b", 2);
let b = ab.delete("a");

console.log(b.get("b"));
// → 2
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false
