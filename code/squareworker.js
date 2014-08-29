addEventListener("message", function(event) {
  postMessage(event.data * event.data);
});
