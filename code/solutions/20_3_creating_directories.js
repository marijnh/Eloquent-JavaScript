// This code won't work on its own, but is also included in the
// code/file_server.js file, which defines the whole system.

methods.MKCOL = function(path, respond) {
  fs.stat(path, function(error, stats) {
    if (error && error.code == "ENOENT")
      fs.mkdir(path, respondErrorOrNothing(respond));
    else if (error)
      respond(500, error.toString());
    else if (stats.isDirectory())
      respond(204);
    else
      respond(400, "File exists");
  });
};
