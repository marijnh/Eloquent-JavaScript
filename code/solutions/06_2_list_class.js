class List {
  constructor(value, rest) {
    this.value = value;
    this.rest = rest;
  }

  toArray() {
    let array = [];
    for (let list = this; list != List.empty; list = list.rest) {
      array.push(list.value);
    }
    return array;
  }

  get length() {
    let length = 0;
    for (let list = this; list != List.empty; list = list.rest) {
      length++;
    }
    return length;
  }

  static fromArray(array) {
    let list = List.empty;
    for (let i = array.length - 1; i >= 0; i--) {
      list = new List(array[i], list);
    }
    return list;
  }
}

List.empty = new List(undefined, undefined);

console.log(List.fromArray([10, 20]));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(List.fromArray([10, 20, 30]).toArray());
// → [10, 20, 30]
console.log(new List(2, List.empty).length);
// → 1
