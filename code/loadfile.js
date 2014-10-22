function readFile(name) {
  return readFile.files[name] || "";
}
readFile.files = {
  "weekDay": 'var names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];\
exports.name = function(number) { return names[number]; };\
exports.number = function(name) { return names.indexOf(name); };',
  "today": 'exports.dayNumber = function() { return (new Date).getDay(); };'
};

function backgroundReadFile(name, c) {
  setTimeout(function() {
    c(backgroundReadFile.files[name] || "");
  }, 200 * Math.random());
}
backgroundReadFile.files = {
  "weekDay": 'define([], function() {\
  var names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];\
  return { name: function(number) { return names[number]; }, number: function(name) { return names.indexOf(name); }};\
});',
  "today": 'define([], function() { return {dayNumber: function() { return (new Date).getDay(); }}; });'
};

var exports = {};
