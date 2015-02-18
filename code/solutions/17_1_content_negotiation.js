function requestAuthor(type) {
  var req = new XMLHttpRequest();
  req.open("GET", "http://eloquentjavascript.net/author", false);
  req.setRequestHeader("accept", type);
  req.send(null);
  return req.responseText;
}

var types = ["text/plain",
             "text/html",
             "application/json",
             "application/rainbows+unicorns"];

types.forEach(function(type) {
  try {
    console.log(type + ":\n", requestAuthor(type), "\n");
  } catch (e) {
    console.log("Raised error: " + e);
  }
});
