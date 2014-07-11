// The file server examples in code/file_server.js and
// code/file_server_promises.js already contain this fixed version.

function urlToPath(url) {
  var path = url;
  var decoded = decodeURIComponent(path);
  return "." + decoded.replace(/(\/|\\)\.\.(\/|\\|$)/g, "/");
}
