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

/* print :: anything -> nothing */
function print(value) {
  var pre = document.createElement("pre");
  pre.textContent = String(value);

  _addOutput(pre);
}

/* circle :: number -> color -> shape */
function circle(radius, color) {
  var canvas = document.createElement("canvas");
  canvas.width = radius * 2;
  canvas.height = radius * 2;

  var ctx = canvas.getContext("2d");

  _addOutput(canvas);

  var circ = { tlc_dt: "circle",
               width: radius * 2,
               height: radius * 2,
               radius: radius,
               color: color };
  draw(ctx, [circ]);

  return [circ];
}

/* rectangle :: number -> number -> color -> shape */
function rectangle(width, height, color) {
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  var ctx = canvas.getContext("2d");

  _addOutput(canvas);
  
  var rect = { tlc_dt: "rectangle",
               width: width,
               height: height,
               color: color };

  draw(ctx, [rect]);

  return [rect];
}

/* draw :: context -> shape -> nothing */
function draw(ctx, shapes) {
  
  for (var i = 0; i < shapes.length; i++) {
    var shape = shapes[i];
    switch (shape.tlc_dt) {
    case "rectangle":
      ctx.fillStyle = shape.color;
      ctx.fillRect(0, 0, shape.width, shape.height);
      break;
    case "circle":
      ctx.beginPath();
      ctx.fillStyle = shape.color;
      ctx.arc(shape.radius,
              shape.radius,
              shape.radius, 0, 2 * Math.PI);
      ctx.fill();
      break;
    default:
      break;
    }
  }
}
  
/* placeImage :: shape -> shape -> shape */
function placeImage(shape1, shape2, x, y) {
  var canvas = document.createElement("canvas");
  var shapes = shape1.concat(shape2);
  canvas.width = largestX(shapes);
  canvas.height = largestY(shapes);

  var ctx = canvas.getContext("2d");

  draw(ctx, shapes);
  
  _addOutput(canvas);

  return shapes;
}

function largestX (shapes) {
  var max = -Infinity;
  
  for (var i = 0; i < shapes.length; i++) {

    if (shapes[i].width > max) {
      max = shapes[i].width;
    }
  }

  return max;
}

function largestY (shapes) {
  var max = -Infinity;
  
  for (var i = 0; i < shapes.length; i++) {

    if (shapes[i].height > max) {
      max = shapes[i].height;
    }
  }

  return max;
}
    
  
  
  