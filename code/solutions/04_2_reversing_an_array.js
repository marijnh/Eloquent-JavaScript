function reverseArray(array) {
  var output = [];
  for (var i = array.length - 1; i >= 0; i--)
    output.push(array[i]);
  return output;
}

function reverseArrayInPlace(array) {
  for(var i = 0; i < array.length - 1; i++){
    array.unshift(array[i + 1]);
    array.splice((i + 2), 1);
  }
}

console.log(reverseArray(["A", "B", "C"]));
// → ["C", "B", "A"];
var arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]
