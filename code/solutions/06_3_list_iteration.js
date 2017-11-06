class ListIterator {
  constructor(list) {
    this.list = list;
  }

  next() {
    if (this.list == List.empty) return {done: true};
    let result = {value: this.list.value, done: false};
    this.list = this.list.rest;
    return result;
  }
}

// Class mostly from the previous exercise
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

  // New code:
  [Symbol.iterator]() {
    return new ListIterator(this);
  }
}

List.empty = new List(undefined, undefined);

for (let value of List.fromArray(["a", "b", "c"])) {
  console.log(value);
}
// → a
// → b
// → c
