var ancestry = JSON.parse(ANCESTRY_FILE);

var byName = {};
ancestry.forEach(function(person) {
  byName[person.name] = person;
});

function reduceAncestors(person, f, zero) {
  function handle(person) {
    if (person == null) return zero;
    var father = byName[person.father];
    var mother = byName[person.mother];
    return f(person, handle(father), handle(mother));
  }
  return handle(person, 0);
}

function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

var byName = {};
ancestry.forEach(function(person) {
  byName[person.name] = person;
});
