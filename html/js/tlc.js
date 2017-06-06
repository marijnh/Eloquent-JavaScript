console.log("TLC is starting up...");

/* OUTPUT AND INFRASTRUCTURE */

var output = document.createElement("div");
output.id = "output";

var source = document.createElement("div");
source.id = "source";

var images = document.createElement("div");
images.id = "images";

var body = document.getElementsByTagName("body")[0];
body.appendChild(source);
body.appendChild(images);
body.appendChild(output);

var style = document.createElement("style");

style.textContent = "#output { width: 45%; float: left; } #source { width: 45%; float: left; } .output { border-bottom: 1px solid #ccc; padding: 10px 0; } #images { width: 45%; float: right; } ";

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

function show_source(url) {
  var client = new XMLHttpRequest();
  client.open('GET', url);
  var pre = document.createElement("pre");
  source.appendChild(pre);
  client.onreadystatechange = function() {
    pre.textContent = client.responseText;
  }
  client.send();
}


/* LIBRARY FOR DRAWING ETC */

/* print :: anything -> nothing */
function print(value) {
  var pre = document.createElement("pre");
  pre.textContent = String(value);

  _addOutput(pre);
}

/* circle :: number -> color -> shape */
function circle(radius, color) {

  var circ = { tlc_dt: "circle",
               radius: radius,
               color: color,
               x: 0,
               y: 0 };

  return { elements: [circ],
           width: radius * 2,
           height: radius * 2 }
}

/* rectangle :: number -> number -> color -> shape */
function rectangle(width, height, color) {

  var rect = { tlc_dt: "rectangle",
               width: width,
               height: height,
               color: color,
               x: 0,
               y: 0 };

  return { elements: [rect],
           width: width,
           height: height };
}

function loadImage (name, location) {
  var img = document.createElement("img");
  img.id = name;

  img.src = location;
  
  images.appendChild(img);
}

/* image :: url -> shape */
function image(name) {
  
  var img = document.getElementById(name);

  var imgShape = { tlc_dt: "image",
                   img: img,
                   locaton: location,
                   width: img.width,
                   height: img.height,
                   x: 0,
                   y: 0,
                 };

  return { elements: [imgShape],
           width: img.width,
           height: img.height };
}

/* draw :: scene -> nothing */
function draw(scene) {

  canvas = document.createElement("canvas");

  var ctx = canvas.getContext("2d");

  canvas.width = scene.width;
  canvas.height = scene.height;

  for (var i = 0; i < scene.elements.length; i++) {
    var shape = scene.elements[i];
    switch (shape.tlc_dt) {
    case "rectangle":
      ctx.fillStyle = shape.color;
      ctx.fillRect(shape.x,
                   shape.y,
                   shape.width,
                   shape.height);
      break;
    case "circle":
      ctx.beginPath();
      ctx.fillStyle = shape.color;
      ctx.arc(shape.x + shape.radius,
              shape.y + shape.radius,
              shape.radius, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case "image":
      // if image has loaded, draw it, else add callback
      if (shape.img.complete || shape.img.naturalWidth) {
        ctx.drawImage(shape.img,
                      shape.x,
                      shape.y);
      } else {
        shape.img.onload = function() {
          ctx.drawImage(shape.img,
                        shape.x,
                        shape.y);
        };
      }
      break;
    default:
      break;
    }
  }

  _addOutput(canvas);

}

/* emptyScene :: number -> number -> scene */
function emptyScene(width, height) {
  return { elements: [],
           width: width,
           height: height };
}

/* overlay :: scene-> scene -> scene */
function overlay(foreground, background) {
  var newX = background.width/2
             - foreground.width/2;
  var newY = background.height/2
             - foreground.height/2;

  return placeImage(foreground, background, newX, newY);
}

/* placeImage :: scene -> scene -> x -> y -> scene  */
function placeImage(foreground, background, x, y) {
  var centeredElements =
      _.map(foreground.elements, function(e) {
        var newE = _.clone(e);
        newE.x = e.x + x;
        newE.y = e.y + y;
        return newE;
      });

  var scene = _.clone(background);

  scene.elements =
    scene.elements.concat(centeredElements);

  return scene;
}

var smile = "js/smile.gif";
