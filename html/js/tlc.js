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

  var circ = { tlc_dt: "circle",
               width: radius * 2,
               height: radius * 2,
               radius: radius,
               color: color };

  return [circ];
}

/* rectangle :: number -> number -> color -> shape */
function rectangle(width, height, color) {

  var rect = { tlc_dt: "rectangle",
               width: width,
               height: height,
               color: color };

  return [rect];
}

/* image :: url -> shape */
function image(location) {
  var img = new Image()
  //img.src = location;
  //img.style.visibility = "hidden"

  // append the node, get the dimensions, and remove it again
  //document.body.appendChild(img);
  //var imgClone = img.cloneNode();
  //document.body.removeChild(img);
  
  var imgShape = { tlc_dt: "image",
                   img: img,
                   locaton: location
                 };
  
  img.onload = function() {
    imgShape.width = img.width;
    imgShape.height = img.height;
  };

  img.src = location;
  
  return [imgShape];
}

/* draw :: shape -> nothing */
function draw(shapes) {

  canvas = document.createElement("canvas");

  var ctx = canvas.getContext("2d");

  canvas.width = largestX(shapes);
  canvas.height = largestY(shapes);

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
    case "image":
      shape.img.onload = function() {
        ctx.drawImage(shape.img,
                      0,
                      0);
      }
      break;
    default:
      break;
    } 
  }
  
  _addOutput(canvas);

}

/* placeImage :: shape -> shape -> shape */
function placeImage(shape1, shape2, x, y) {
  var canvas = document.createElement("canvas");
  var shapes = shape1.concat(shape2);

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

var smile = "smile.gif";