var http = require("http"), fs = require("fs");
var Promise = require("promise");

var methods = Object.create(null);

// Remember that promises can either fail or succeed. The `then`
// method takes two callbacks, one to handle success and one to handle
// failure. The strategy for dealing with exceptions and other failure
// is to notice them in the second callback passed here, and return a
// 500 response.
//
// On success, the promise returned by respondTo should return an
// object with a `code` property indicating the response code, and
// optional `body` and `type` properties. The body can be a stream to
// directly pipe into the response, or a string.

http.createServer(function(request, response) {
  respondTo(request).then(function(data) {
    response.writeHead(data.code, {"Content-Type": data.type || "text/plain"});
    if (data.body && data.body.pipe)
      data.body.pipe(response);
    else
      response.end(data.body);
  }, function(error) {
    response.writeHead(500);
    response.end(error.toString());
    console.log("Response failed: ", error.stack);
  });
}).listen(8000);

function respondTo(request) {
  if (request.method in methods)
    return methods[request.method](urlToPath(request.url), request);
  else
    return Promise.resolve({code: 405,
                            body: "Method " + request.method + " not allowed."});
}

function urlToPath(url) {
  var path = require("url").parse(url).pathname;
  var decoded = decodeURIComponent(path);
  return "." + decoded.replace(/(\/|\\)\.\.(\/|\\|$)/g, "/");
}

// Wrap the fs functions that we need with Promise.denodeify, so that
// they return promises instead of directly taking a callback and
// passing it an error argument.

var fsp = {};
["stat", "readdir", "rmdir", "unlink", "mkdir"].forEach(function(method) {
  fsp[method] = Promise.denodeify(fs[method]);
});

// Since several functions need to call `fsp.stat` and handle failures
// that indicate non-existent files in a special way, this is a
// convenience wrapper that converts file-not-found failures into
// success with a null value.
//
// Remember that calling the `then` method returns *another* promise,
// and that having a failure handler return normally replaces the
// failure a success (using the returned value). We're passing null
// for the success handler here (letting through normall successes
// unchanged), and changing one kind of failure into success.

function inspectPath(path) {
  return fsp.stat(path).then(null, function(error) {
    if (error.code == "ENOENT") return null;
    else throw error;
  });
}

// We can get by with much less explicit error handling, now that
// failures automatically propagate back. The new promise returned by
// `then`, as returned from this function, will use one of the values
// returned here (objects with `code` properties) as its value. When a
// handler passed to `then` returns another promise (as in the case
// when the path refers to a directory), that promise will be
// connected the promise returned by `then`, determining when and how
// it is resolved.

methods.GET = function(path) {
  return inspectPath(path).then(function(stats) {
    if (!stats) // Does not exist
      return {code: 404, body: "File not found"};
    else if (stats.isDirectory())
      return fsp.readdir(path).then(function(files) {
        return {code: 200, body: files.join("\n")};
      });
    else
      return {code: 200,
              type: require("mime").lookup(path),
              body: fs.createReadStream(path)};
  });
};

var noContent = {code: 204};
function returnNoContent() { return noContent; }

// Though failure is propagated automatically, we still have to
// arrange for `noContent` to be returned when an action finishes,
// which is the role of `returnNoContent` success handler.

methods.DELETE = function(path) {
  return inspectPath(path).then(function(stats) {
    if (!stats)
      return noContent;
    else if (stats.isDirectory())
      return fsp.rmdir(path).then(returnNoContent);
    else
      return fsp.unlink(path).then(returnNoContent);
  });
};

// To wrap a stream, we have to define our own promise, since
// Promise.denodeify can only wrap simple functions.

methods.PUT = function(path, request) {
  return new Promise(function(success, failure) {
    var outStream = fs.createWriteStream(path);
    outStream.on("error", failure);
    outStream.on("finish", success.bind(null, noContent));
    request.pipe(outStream);
  });
};

methods.MKCOL = function(path, request) {
  return inspectPath(path).then(function(stats) {
    if (!stats)
      return fsp.mkdir(path).then(returnNoContent);
    if (stats.isDirectory())
      return noContent;
    else
      return {code: 400, body: "File exists"};
  });
};
