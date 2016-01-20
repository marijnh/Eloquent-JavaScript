console.log("TLC is starting up...");

var output = document.createElement("div");
output.id = "output";

var body = document.getElementsByTagName("body")[0];
body.appendChild(output);

var style = document.createElement("style");

style.textContent = ".output { border-bottom: 1px solid #ccc; padding: 10px 0; }";

body.appendChild(style);

output.style.margin = "10px";
output.style.padding = "10px";
output.style.background = "#eee";
output.style.border = "1px solid #ccc";

function _addOutput(content) {
  var output = document.getElementById("output");
  var container = document.createElement("div");
  container.className = "output";
  container.appendChild(content);
  output.appendChild(container);
  return container;
}


function print(value) {
  var pre = document.createElement("pre");
  pre.textContent = String(value);

  _addOutput(pre);
}

function circle(radius, color) {
  var canvas = document.createElement("canvas");
  canvas.width = radius * 2;
  canvas.height = radius * 2;

  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
  ctx.fill();

  _addOutput(canvas);

  return { tlc_dt: "circle", radius: radius, color: color };
}
