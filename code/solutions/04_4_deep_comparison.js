function deepEqual(a, b) {
  if (a === b) return true;
  
  if (a == null || typeof a != "object" ||
      b == null || typeof b != "object") return false;

  let keysA = Object.keys(a), keysB = Object.keys(b);

  // Compare two empty objects({} and []).
  // Returns true only if two objects are acutally the same type
  // {} and {} or [] and [].
  if (keysA.length === 0 && keysB.length === 0) {
    if ((a.length === undefined && b.length === undefined) ||
        (a.length === 0 && b.length === 0)) return true;
    else return false;
  }

  if (keysA.length != keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }

  return true;
}

let obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
// → true
