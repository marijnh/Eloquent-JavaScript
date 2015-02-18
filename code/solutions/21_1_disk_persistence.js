// This isn't a stand-alone file, only a redefinition of a few
// fragments from skillsharing/skillsharing_server.js

var fs = require("fs");

var talks = loadTalks();

function loadTalks() {
  var result = Object.create(null), json;
  try {
    json = JSON.parse(fs.readFileSync("./talks.json", "utf8"));
  } catch (e) {
    json = {};
  }
  for (var title in json)
    result[title] = json[title];
  return result;
}

function registerChange(title) {
  changes.push({title: title, time: Date.now()});
  waiting.forEach(function(waiter) {
    sendTalks(getChangedTalks(waiter.since), waiter.response);
  });
  waiting = [];

  fs.writeFile("./talks.json", JSON.stringify(talks));
}
