function deepEqual(a, b) {
  if (a === b) return true;
  
  if (a == null || typeof a != "object" ||
      b == null || typeof b != "object") return false;
  
  let propsInA = 0, propsInB = 0;

  for (let prop in a) {
    propsInA += 1;
  }

  for (let prop in b) {
    propsInB += 1;
    if (!(prop in a) || !deepEqual(a[prop], b[prop])) {
      return false;
    }
  }

  return propsInA == propsInB;
}

let obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
// → true
