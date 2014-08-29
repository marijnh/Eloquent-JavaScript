// A somewhat node-ish HTTP request helper.
function request(options, callback) {
  var req = new XMLHttpRequest();
  req.open(options.method || "GET", options.pathname, true);
  req.addEventListener("load", function() {
    if (req.status < 400)
      callback(null, req.responseText);
    else
      callback(new Error("Request failed: " + req.statusText));
  });
  req.addEventListener("error", function() {
    callback(new Error("Network error"));
  });
  req.send(options.body || null);
}

// Get a reference to the DOM nodes we need
var filelist = document.querySelector("#filelist");
var textarea = document.querySelector("#file");

// This loads the initial file list from the server
request({pathname: "/"}, function(error, files) {
  // We're not going to do error handling, but we want to at least
  // have errors show up in the console, since silently disappearing
  // errors make it very hard to debug a system.
  if (error) throw error;

  files.split("\n").forEach(function(file) {
    var option = document.createElement("option");
    option.textContent = file;
    filelist.appendChild(option);
  });
  // Now that we have a list of files, make sure the textarea contains
  // the currently selected one.
  loadCurrentFile();
});

// Fetch a file from the server and put it in the textarea.
function loadCurrentFile() {
  request({pathname: filelist.value}, function(error, file) {
    if (error) throw error;
    textarea.value = file;
  });
}

filelist.addEventListener("change", loadCurrentFile);

// Called by the button on the page. Makes a request to save the
// currently selected file.
function saveFile() {
  request({pathname: filelist.value,
           method: "PUT",
           body: textarea.value}, function(error) {
    if (error) throw error;
  });
}
