function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

var byName = {};
ancestry.forEach(function(person) {
  byName[person.name] = person;
});

var differences = ancestry.filter(function(person) {
	return typeof byName[ person.mother ] !== 'undefined';
}).map(function(person) {
  return person.born - byName[person.mother].born;
});

console.log(average(differences));
// → 31.2
