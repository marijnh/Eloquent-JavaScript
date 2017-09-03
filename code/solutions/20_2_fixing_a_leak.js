// The file server examples in code/file_server.js and
// code/file_server_promises.js already contain this fixed version.

function urlToPath(url) {
  var path = require("url").parse(url).pathname;
  var result = "." + decodeURIComponent(path);
  for (;;) {
    // Remove any instances of '/../' or similar
    var simplified = result.replace(/(\/|\\)\.\.(\/|\\|$)/, "/");
    // Keep doing this until it no longer changes the string
    if (simplified == result) return result
    result = simplified
  }
}
