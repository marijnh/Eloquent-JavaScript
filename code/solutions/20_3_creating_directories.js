// This code won't work on its own, but is also included in the
// code/file_server.js file, which defines the whole system.

methods.MKCOL = function(path, request, response) {
  fs.stat(path, function(error, stats) {
    if (error && error.code == "ENOENT")
      fs.mkdir(path, respondErrorOrNothing(response));
    else if (error)
      respond(500, error.toString(), response);
    else if (stats.isDirectory())
      respond(204, null, response);
    else
      respond(400, "File exists", response);
  });
};
