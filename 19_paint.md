{{meta {load_files: ["code/chapter/19_paint.js"], zip: "html include=[\"css/paint.css\"]"}}}

# Project: A Pixel Art Editor

{{quote {author: "Joan Miro", chapter: true}

I look at the many colors before me. I look at my blank canvas. Then,
I try to apply colors like words that shape poems, like notes that
shape music.

quote}}

{{index "Miro, Joan", "drawing program example", "project chapter"}}

The material from the previous chapters gives you all the elements you
need to build a basic ((web application)). In this chapter, we will do
just that.

Our ((application)) will be a ((pixel)) ((drawing)) program, where you
can modify a picture pixel by pixel by manipulating a zoomed-in view,
a grid of colored squares. You can use it to open image ((file))s,
scribble on them with your mouse or other pointer device, and save
them. This is what it will look like:

{{figure {url: "img/pixel_editor.png", alt: "The pixel editor interface, with colored pixels at the top and a number of controls below that", width: "8cm"}}}

Painting on a computer is great. You don't need to worry about
materials, ((skill)), or talent. You just start smearing.

## Components

{{index drawing, "select (HTML tag)", "canvas (HTML tag)", component}}

The interface for the application shows a big `<canvas>` element on
top, with a number of form ((field))s below it. The user draws on the
((picture)) by selecting a tool from a `<select>` field and then
clicking, ((touch))ing, or ((dragging)) across the canvas. There are
((tool))s for drawing single pixels or rectangles, for filling an
area, and for picking a ((color)) from the picture.

We will structure the editor interface as a number of
_((component))s_, objects that are responsible for a piece of the
((DOM)), and may contain other components inside them.

The ((state)) of the application consists of the picture, the selected
tool, and the selected color. All state goes into a single value
again, and we'll set things up so that the interface components always
base the way they currently look on this state.

To see why this is important, let's consider the
alternative—distributing pieces of state throughout the interface. Up
to a certain point, this is much easier to program. We can just put in
a ((color field)), wire it up to store its value somewhere when it
changes, and have all operations that need to know the current color
look at that value.

But then we add the ((color picker))—a tool that lets you click on the
picture to select the color of a given pixel. In order to keep the
color field showing the correct color, that tool would have to know
that it exists, and update it whenever it picks a new color. And if
you ever add another place that makes the color visible (maybe the
mouse cursor could show it), you have to go and update your
color-changing code to keep that synchronized too.

{{index modularity}}

In effect, this gets you a problem where each part of the interface
needs to know about all other parts, which makes it really hard to set
up the code in a modular way. For small applications like the one in
this chapter, this gets a bit awkward, but is workable. For bigger
projects it can turn into a nightmare.

So to avoid this nightmare we're going to be very strict about _((data
flow))_. There is a state, and the interface is drawn based on that
state. An interface component may respond to user actions by creating
an updated state, at which point the components get a chance to update
themselves to reflect this new state.

{{index library, framework}}

In practice, each ((component)) is set up so that when it is given a
new state, it also notifies its child components, insofar as those
need to be updated. Setting this up is a bit of a hassle. Helping make
that more convenient is the main selling point of many browser
programming libraries. But for a small application like this one it
won't be too bad.

{{index action, "reduce method", "pure function"}}

Updates to the ((state)) are represented as objects. Components may
create such updates and ((dispatch)) them, which means they are given
to a central state management function that uses them to compute the
next state. We'll call this function the _((reducer))_, since its task
is similar to that of a function you pass to an array's `reduce`
method. It combines the current state with an update value, producing
a new state. You could, if you wanted to, collect these objects in an
array, and then call `updates.reduce(reducer, startState)` to
"((replay))" the application's state changes.

In a way, we are taking a part of the messy task of running a ((user
interface)), and applying some more ((structure)) to it. Though the
((DOM))-related pieces are still full of ((side effect))s, they are
held up by a more structured backbone—the pure code of the state
update cycle. The state determines what the DOM looks like, and events
from the DOM may cause the reducer to run, creating a new state and
then synchronizing the DOM to that.

{{index "data flow"}}

There exist _many_ variants of these techniques, each with their own
benefits and problems, but the central idea to them is the same: data
should flow in one direction, rather than all over the place.

{{index "dom property"}}

Our ((component))s will be ((class))es with a more or less uniform
((interface)). Their constructor is given a state, which may be the
whole application state or some smaller value if it doesn't need
access to everything, and uses that to create the DOM that represents
the component. This is stored in its `dom` property. Most constructors
will also take some other values that don't change over time such as
the function they can use to ((dispatch)) a state update.

{{index "setState method"}}

Each component has a `setState` method that is used to synchronize it
to a new state value—which should be a value of the same type as the
first argument to its constructor.

## The state

{{index "Picture class", "picture property", "tool property", "color property", "Matrix class"}}

The application state will be a plain object with `picture`, `tool`,
and `color` properties. The picture is itself an object, which stores
a width, height, and array of pixels. The ((pixel))s are stored in the
same way as the matrix class from [Chapter ?](object)—row by row, from
top to bottom.

```{includeCode: true}
class Picture {
  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }
  static empty(width, height, color) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }
  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }
  setPixel(x, y, color) {
    this.pixels[x + y * this.width] = color;
  }
  copy() {
    return new Picture(this.width, this.height,
                       this.pixels.slice());
  }
}
```

{{index "side effect", "persistent data structure"}}

We want to be able to treat a picture as an ((immutable)) value, for
reasons that we'll get back to later in the chapter. But we also
sometimes need to update a whole bunch of pixels at a time. To be able
to do that, we will use the convention that any code that wants to
modify a picture must first ((copy)) it, so that it is only modifying
its own copy, not a value that other code might have access to.

{{index "Array constructor", "fill method", ["length property", "for array"]}}

The `empty` method uses two pieces of ((array)) functionality that we
haven't seen before. The `Array` constructor can be called with a
number to create an empty array of the given length. And the `fill`
method can then be used to fill this array with a given value. It is
used here to create an array in which all pixels have the same color.

{{index "hexadecimal number", "color component", "color field", "fillColor property"}}

Colors are stored as strings containing traditional ((CSS)) ((color
code))s—a ((hash sign)) (`#`) followed by six hexadecimal (base-16)
digits, two for the ((red)) component, two for the ((green))
component, and two for the ((blue)) component. This is a somewhat
cryptic and inconvenient way to write colors, but it is the format the
HTML color input field uses, and it can be used in the `fillColor`
property of a canvas drawing context, so for the ways we'll use colors
in this program, it is practical enough.

{{index black}}

Black, where all components are zero, is written `"#000000"`, and
bright ((pink)), where the red and blue components have the maximal
value of 255, written `ff` in hexadecimal ((digit))s (which use _a_ to
_f_ as digits for 10 to 15) looks like `"#ff00ff"`.

We'll allow the interface to ((dispatch)) updates as objects whose
properties overwrite the properties of the previous ((state)). The
color field, when the user changes it, could dispatch an object like
`{color: field.value}`, from which this ((reducer)) function can
compute a new state.

{{index "reduceState function"}}

```{includeCode: true}
function reduceState(state, update) {
  return Object.assign({}, state, update);
}
```

{{index "period character", spread, "Object.assign function"}}

This rather cumbersome pattern, in which `Object.assign` is used to
first add the properties of `state` to an empty object, and then
overwrite some of those with the properties from `update`, is common
in JavaScript code that uses ((immutable)) objects. A more convenient
notation for this, in which the triple-dot operator can be used in
object expressions to add all properties from another object, is in
the final stages of being standardized. With that addition, you could
write `{...state, ...update}`. But at the time of writing this doesn't
yet work in all browsers.

## DOM building

{{index "createElement method", "elt function"}}

One of the main things that interface components do is creating
((DOM)) structure. We again don't want to directly use the verbose DOM
methods for that, so here's a slightly expanded version of the `elt`
function.

```{includeCode: true}
function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}
```

{{index "setAttribute method", "attribute", "onclick propert", "click event", "event handling"}}

The main difference between this version and the one we used in
[Chapter ?](game#domdisplay) is that it assigns properties, rather
than attributes, to DOM nodes. This means we can't use it to set
arbitrary attributes, but we _can_ use it to set properties whose
value isn't a string, such as `onclick`, which can be set to a
function to register a click event handler.

{{index "button (HTML tag)"}}

This allows this style of registering event handlers:

```{lang: "text/html"}
<body>
  <script>
    document.body.appendChild(elt("button", {
      onclick: () => console.log("click")
    }, "The button"));
  </script>
</body>
```

## The canvas

The first component we'll define is the part of the interface that
displays the picture as a grid of colored boxes. The component is
responsible for displaying a picture, and for communicating ((pointer
event))s on that picture to the rest of the application.

{{index "PictureCanvas class", "callback function", "scale constant", "canvas (HTML tag)", "mousedown event", "touchstart event"}}

As such, we can define it as a component that doesn't know about the
whole application ((state)) but shows one piece—the picture.
Similarly, because it doesn't know how the application works, it can
not directly dispatch state updates. Rather, when responding to
pointer events, it calls a callback function provided by the code that
created it, which will handle the application-specific parts.

```{includeCode: true}
const scale = 10;

class PictureCanvas {
  constructor(picture, pointerDown) {
    this.dom = elt("canvas", {
      onmousedown: event => this.mouse(event, pointerDown),
      ontouchstart: event => this.touch(event, pointerDown)
    });
    drawPicture(picture, this.dom, scale);
  }
  setState(picture) {
    if (this.picture == picture) return;
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
  }
}
```

We draw each pixel as a 10-by-10 square. This size is determined by
the `scale` constant.

{{index "setState method", efficiency}}

To avoid unneccesary work, the component keeps track of its current
picture, and only does a redraw when `setState` is given a new
picture.

{{index "drawPicture function"}}

The actual drawing function sets the size of the canvas based on the
scale and picture size, and fills it with a series of squares, one for
each pixel.

```{includeCode: true}
function drawPicture(picture, canvas, scale) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  let cx = canvas.getContext("2d");

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      cx.fillStyle = picture.pixel(x, y);
      cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}
```

{{index "mousedown event", "mousemove event", "button property", "buttons property", "pointerPosition function"}}

When the left mouse button is pressed while the mouse is over the
picture canvas, the component calls the `pointerDown` callback, giving
it the position of the pixel that was clicked—in picture coordinates.
This will be used to implement mouse interaction with the picture. The
callback may return another callback function to be notified when the
pointer is moved to a different pixel while the button is being held.

```{includeCode: true}
PictureCanvas.prototype.mouse = function(downEvent, onDown) {
  if (downEvent.button != 0) return;
  let rect = this.dom.getBoundingClientRect();
  let pos = pointerPosition(downEvent, rect);
  let onMove = onDown(pos);
  if (!onMove) return;
  let move = moveEvent => {
    if (moveEvent.buttons == 0) {
      this.dom.removeEventListener("mousemove", move);
    } else {
      let newPos = pointerPosition(moveEvent, rect);
      if (newPos.x == pos.x && newPos.y == pos.y) return;
      pos = newPos;
      onMove(newPos);
    }
  };
  this.dom.addEventListener("mousemove", move);
};

function pointerPosition(pos, rect) {
  return {x: Math.floor((pos.clientX - rect.left) / scale),
          y: Math.floor((pos.clientY - rect.top) / scale)};
}
```

{{index "getBoundingClientRect method", "clientX property", "clientY property"}}

Since we know the size of the ((pixel))s, and we can use
`getBoundingClientRect` to get the position of the canvas on the
screen, it is possible to go from mouse event coordinates (`clientX`
and `clientY`) to picture coordinates. These are always rounded down,
so that they refer to a specific pixel.

{{index "touchstart event", "touchmove event", "preventDefault method"}}

For touch events, we have to do something similar, but using different
events, and making sure we call `preventDefault` on the `"touchstart"`
event to prevent ((panning)).

```{includeCode: true}
PictureCanvas.prototype.touch = function(startEvent,
                                         onDown) {
  let rect = this.dom.getBoundingClientRect();
  let pos = pointerPosition(startEvent.touches[0], rect);
  let onMove = onDown(pos);
  startEvent.preventDefault();
  if (!onMove) return;
  let move = moveEvent => {
    let newPos = pointerPosition(moveEvent.touches[0], rect);
    if (newPos.x == pos.x && newPos.y == pos.y) return;
    pos = newPos;
    onMove(newPos);
  };
  let end = () => {
    this.dom.removeEventListener("touchmove", move);
    this.dom.removeEventListener("touchend", end);
  };
  this.dom.addEventListener("touchmove", move);
  this.dom.addEventListener("touchend", end);
};
```

{{index "touches property", "clientX property", "clientY property"}}

For touch events, `clientX` and `clientY` aren't available directly on
the event object, but we can use the coordinates of the first touch
object in the `touches` property.

## The application

To be able to implement the application piece by piece, we'll
implement the main component as a shell around a picture canvas and a
dynamic set of ((tool))s and ((control))s that we pass to its
constructor.

The _controls_ are the interface elements that appear below the
picture. They'll be provided as an array of ((component))
constructors.

{{index "br (HTML tag)", "flood fill", "select (HTML tag)", "PixelEditor class", dispatch}}

_Tools_ are things like drawing pixels or filling in an area. The
application shows the set of available tools as a `<select>` field.
The currently selected tool determines what happens when the user
interacts with the picture with a pointer device. They are provided as
an object that maps the names that appear in the drop-down field to
functions that implement the tool. Such function take a picture
position, a current application state, and a `dispatch` function. They
may return a move handler function which gets call with a position and
a current state when the pointer moves to a different pixel.

```{includeCode: true}
class PixelEditor {
  constructor(state, config) {
    let {tools, controls, dispatch} = config;
    this.state = state;

    this.canvas = new PictureCanvas(state.picture, pos => {
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);
      if (onMove) return pos => onMove(pos, this.state);
    });
    this.controls = controls.map(
      Control => new Control(state, config));
    this.dom = elt("div", {}, this.canvas.dom, elt("br"),
                   ...this.controls.reduce(
                     (a, c) => a.concat(" ", c.dom), []));
  }
  setState(state) {
    this.state = state;
    this.canvas.setState(state.picture);
    for (let ctrl of this.controls) ctrl.setState(state);
  }
}
```

The pointer down handler given to `PictureCanvas` calls the currently
selected tool with the appropriate arguments, and, if that returns a
move handler, adapts that to also receive the state.

{{index "reduce method", "map method", whitespace}}

All controls are constructed and stored in `this.controls`, so that
they can be updated when the application state changes. The call to
`reduce` introduces spaces between the controls' DOM elements, so that
they don't look so pressed together.

The component's `setState` method passes on the state update to all
its subcomponents.

{{index "select (HTML tag)", "change event", "ToolSelect class", "setState method"}}

The first control is the ((tool)) selection menu. It creates a
`<select>` element with options for all the tools, and sets up a
`"change"` event handler that updates the application state when the
user selects a different tool.

```{includeCode: true}
class ToolSelect {
  constructor(state, {tools, dispatch}) {
    this.select = elt("select", {
      onchange: () => dispatch({tool: this.select.value})
    }, ...Object.keys(tools).map(name => elt("option", {
      selected: name == state.tool
    }, name)));
    this.dom = elt("label", null, "🖌 Tool: ", this.select);
  }
  setState(state) { this.select.value = state.tool; }
}
```

{{index "label (HTML tag)"}}

By wrapping the label text and the field in a `<label>` element, we
tell the browser that the label belongs to that field, so that you
can, for example, click the label to focus the field.

{{index "color field", "input (HTML tag)"}}

We also need to be able to change the color—so let's add a control for
that. HTML `<input>` elements with a `type` attribute of `color` act
as input fields for color. Such a field's value is always a color in
`"#RRGGBB"` form (red, green, and blue components, two digits per
color). The browser will show a ((color picker)) interface when the
user interacts with it.

{{if book

Depending on the browser, the color picker might look like this:

{{figure {url: "img/color-field.png", alt: "A color field", width: "6cm"}}}

if}}

{{index "ColorSelect class", "setState method"}}

This ((control)) creates such a field, and wires it up to stay
synchronized with the application state's `color` property.

```{includeCode: true}
class ColorSelect {
  constructor(state, {dispatch}) {
    this.input = elt("input", {
      type: "color",
      value: state.color,
      onchange: () => dispatch({color: this.input.value})
    });
    this.dom = elt("label", null, "🎨 Color: ", this.input);
  }
  setState(state) { this.input.value = state.color; }
}
```

## Adding tools

Before we can draw anything, we need to implement the ((tool))s that
will control the functionality of mouse or touch events on the canvas.

{{index "draw function"}}

The most basic tool is the draw tool, which changes any ((pixel)) you
click or tap to the currently selected color. It copies the
((picture)), updates the appropriate pixel, and then dispatches an
update object that updates picture to the modified version.

```{includeCode: true}
function draw(pos, state, dispatch) {
  function drawPixel(pos, state) {
    let picture = state.picture.copy();
    picture.setPixel(pos.x, pos.y, state.color);
    dispatch({picture});
  }
  drawPixel(pos, state);
  return drawPixel;
}
```

The function immediately calls the `drawPixel` function, but then also
returns it, so that it is called again for newly touched pixels when
the user drags or ((swipe))s over the picture.

{{index "rectangle function"}}

Let's define some more ((tool))s. To draw larger shapes it can be
useful to quickly create ((rectangle))s. The `rectangle` tool draws a
rectangle between the point where you started dragging and the point
where you dragged to.

```{includeCode: true}
function rectangle(start, state, dispatch) {
  function drawRectangle(pos) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let picture = state.picture.copy();
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        picture.setPixel(x, y, state.color);
      }
    }
    dispatch({picture});
  }
  drawRectangle(start);
  return drawRectangle;
}
```

{{index "persistent data structure"}}

An important detail in this implementation is that when dragging, the
rectangle is redrawn on the picture from the _original_ ((state)).
That way, you can make the rectangle larger and smaller again while
drawing it, without the intermediate rectangles sticking around in the
final picture. This is one of the reasons why ((immutable)) picture
objects help—we'll see another reason later.

Implementing ((flood fill)) is somewhat more involved. This is a
((tool)) that fills the pixel under the pointer and all adjacent
pixels that have the same color. "Adjacent" means directly
horizontally or vertically adjacent, not diagonally. The image
illustrates the set of ((pixel))s colored when the flood fill tool is
used at the marked pixel:

{{figure {url: "img/flood-grid.svg", alt: "A pixel grid showing the area filled by a flood fill operation", width: "6cm"}}}

{{index "fill function"}}

Interestingly, the way we'll do it looks a bit like the
((pathfinding)) code from [Chapter ?](robot). Whereas that code
searched through a graph to find a route, this code searches through a
grid to find all "connected" pixels. The problem of keeping track of a
branching set of possible routes is similar.

```{includeCode: true}
const around = [{dx: -1, dy: 0}, {dx: 1, dy: 0},
                {dx: 0, dy: -1}, {dx: 0, dy: 1}];

function fill(pos, state, dispatch) {
  let targetColor = state.picture.pixel(pos.x, pos.y);
  if (targetColor == state.color) return;
  let picture = state.picture.copy();
  picture.setPixel(pos.x, pos.y, state.color);
  let todo = [pos];
  while (todo.length > 0) {
    let pos = todo.pop();
    for (let {dx, dy} of around) {
      let x = pos.x + dx, y = pos.y + dy;
      if (x >= 0 && x < picture.width &&
          y >= 0 && y < picture.height &&
          picture.pixel(x, y) == targetColor) {
        picture.setPixel(x, y, state.color);
        todo.push({x, y});
      }
    }
  }
  dispatch({picture});
}
```

An ((array)) of positions that have to be processed is kept in the
`todo` array. The loop takes such positions, colors them, and then
adds any adjacent pixels with target color to `todo`. When no further
work is left, that means the whole area has been filled.

The function uses the fact that handled pixels immediately get a new
color in the picture object to avoid processing the same pixels
multiple times. Can you see why the function starts by seeing if
`targetColor` equals `state.color`? What would happen when the two are
the same?

{{index "pick function"}}

The final ((tool)) is a ((color picker)), which allows you to point at
a color in the picture to use it as the current drawing color.

```{includeCode: true}
function pick(pos, state, dispatch) {
  dispatch({color: state.picture.pixel(pos.x, pos.y)});
}
```

{{if interactive

We can now test our application!

```{lang: "text/html"}
<div></div>
<script>
  let state = {
    tool: "draw",
    color: "#000000",
    picture: Picture.empty(60, 30, "#f0f0f0")
  };
  let app = new PixelEditor(state, {
    tools: {draw, fill, rectangle, pick},
    controls: [ToolSelect, ColorSelect],
    dispatch(update) {
      state = reduceState(state, update);
      app.setState(state);
    }
  });
  document.querySelector("div").appendChild(app.dom);
</script>
```

if}}

## Saving and loading

{{index "SaveButton class", "drawPicture function"}}

When we've drawn our masterpiece, we'll want to save it for later.
This ((control)) adds a button that you can use to ((download)) your
picture as an image ((file)).

```{includeCode: true}
class SaveButton {
  constructor(state) {
    this.picture = state.picture;
    this.dom = elt("button", {
      onclick: () => this.save()
    }, "💾 Save");
  }
  save() {
    let canvas = elt("canvas");
    drawPicture(this.picture, canvas, 1);
    let link = elt("a", {
      href: canvas.toDataURL(),
      download: "pixelart.png"
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  setState(state) { this.picture = state.picture; }
}
```

{{index "canvas (HTML tag)"}}

The component keeps track of the current picture, so that it can
access it when saving. To create the image file, it uses a `<canvas>`
element that it draws the picture on (at a scale of one pixel per
pixel).

{{index "toDataURL method", "data URL"}}

The `toDataURL` method on a canvas creates a URL that starts with
`data:`. Unlike `http:` and `https:` URLs, data URLs contain the whole
resource in the URL itself. They are usually very long, but they allow
us to create working links to arbitrary pictures in the browser, which
is just what we need.

{{index "a (HTML tag)", "download attribute"}}

To actually allow the user to download the picture, we then create a
((link)) element that points at this URL and has a `download`
attribute. Such links, when clicked, make the browser show a file save
dialog. We add that link to the document, simulate a click on it, and
remove it again.

You can do a lot with ((browser)) technology, but sometimes the way to
do it is rather convoluted and non-obvious.

{{index "LoadButton class", control}}

And it gets worse. We'll also want to be able to load existing image
((file))s into our application. To do that, we again define a button
component.

```{includeCode: true}
class LoadButton {
  constructor(_, {dispatch}) {
    this.dom = elt("button", {
      onclick: () => startLoad(dispatch)
    }, "📁 Load");
  }
  setState() {}
}

function startLoad(dispatch) {
  let input = elt("input", {
    type: "file",
    onchange: () => finishLoad(input.files[0], dispatch)
  });
  document.body.appendChild(input);
  input.click();
  input.remove();
}
```

{{index "file file", "input (HTML tag)"}}

To get access to a file on the user's computer, we need them to select
the file through a file input field. But I don't want the load button
to look like a file input field, so we create the file input when the
button is clicked, and then pretend that it itself was clicked.

{{index "FileReader class", "img (HTML tag)", "readAsDataURL method", "Picture class"}}

When the user has selected a file, we can use `FileReader` to get
access to its contents, again as a ((data URL)). That URL can be used
to create an `<img>` element, but because we can't get direct access
to the pixels in there, we can't create a `Picture` object from that.

```{includeCode: true}
function finishLoad(file, dispatch) {
  if (file == null) return;
  let reader = new FileReader();
  reader.addEventListener("load", () => {
    let image = elt("img", {
      onload: () => dispatch(
        {picture: pictureFromImage(image)}),
      src: reader.result
    });
  });
  reader.readAsDataURL(file);
}
```

{{index "canvas (HTML tag)", "getImageData method", "pictureFromImage function"}}

To do that, we must first draw it to a `<canvas>` element. A canvas
context has a `getImageData` method that allows a script to read its
((pixel))s. So by drawing the image on the canvas, we can get access
to its individual pixels, and construct a `Picture` object from it.

```{includeCode: true}
function pictureFromImage(image) {
  let width = Math.min(100, image.width);
  let height = Math.min(100, image.height);
  let canvas = elt("canvas", {width, height});
  let cx = canvas.getContext("2d");
  cx.drawImage(image, 0, 0);
  let pixels = [];
  let {data} = cx.getImageData(0, 0, width, height);

  function hex(n) {
    let h = n.toString(16);
    return h.length == 2 ? h : "0" + h;
  }
  for (let i = 0; i < data.length; i += 4) {
    let [r, g, b] = data.slice(i, i + 3);
    pixels.push("#" + hex(r) + hex(g) + hex(b));
  }
  return new Picture(width, height, pixels);
}
```

We'll limit the size of images to 100 by 100 pixels, since anything
bigger will look _huge_ on our display, and is likely to slow down the
interface.

{{index "getImageData method", color, transparency}}

The `data` property of the object returned by `getImageData` is an
array of color components. For each pixel in the rectangle specified
by the arguments, it contains four values, which represent the red,
green, blue, and _((alpha))_ components of the pixel's color, as
numbers between 0 and 255. The alpha part represents opacity—when it
is zero, the pixel is fully transparent, and when it is 255, it is
fully opaque. For our purpose, we can ignore it.

{{index "hexadecimal number", "toString method"}}

The two hexadecimal digits per component, as used in our color
notation, correspond precisely to the 0 to 255 range—two base-16
digits can express 16^2^ = 256 different numbers. The `toString`
method of numbers can be given a base as argument, so `n.toString(16)`
will produce a string representation in base 16. We have to make sure
that the number takes up two digits, so the `hex` helper function
makes sure to add a leading zero when it doesn't.

We can load and save now! That leaves one more feature before we're
done.

## Undo history

Half of the process of editing is making little mistakes and
correcting them again. So a very important feature in a drawing
program is an ((undo history)).

{{index "persistent data structure"}}

To be able to undo changes, we need to store previous versions of the
picture. Since it's an ((immutable)) value, that is easy. But it does
require an additional field in the application ((state)).

{{index "done property"}}

We'll add a `done` array that holds previous versions of the
((picture)). Maintaining this field requires a more complicated
((reducer)) function, which adds new pictures to the array.

{{index "doneAt property", "historyReduceState function"}}

But we don't want to store _every_ change, only changes a certain
amount of ((time)) apart. To be able to do that, we'll need a second
field, `doneAt`, tracking the time at which we last stored a picture
in the history.

```{includeCode: true}
function historyReduceState(state, update) {
  if (update.undo == true) {
    if (state.done.length == 0) return state;
    return Object.assign({}, state, {
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0
    });
  } else if (update.picture &&
             state.doneAt < update.time - 1000) {
    return Object.assign({}, state, update, {
      done: [state.picture].concat(state.done),
      doneAt: update.time
    });
  } else {
    return Object.assign({}, state, update);
  }
}
```

{{index "undo history"}}

Because undo has to be handled in a more complicated way than the
other updates, it gets its own `if` branch in the ((reducer)), which
takes the most recent picture from the history and makes that the
current picture.

Otherwise, if the update adds a new picture and the last time we
stored something is more than a second (1000 milliseconds) ago, the
`done` and `doneAt` properties are also updated to store the previous
picture.

{{index "Date.now function"}}

We'll set up our ((dispatch)) function to add a ((time))stamp (the
result of `Date.now`) to each update object. That way,
`historyReduceState` can be a ((pure function))—`Date.now` doesn't
produce the same value every time you call it, and as such isn't pure.

{{index "UndoButton class", control}}

The undo button ((component)) doesn't do very much. It dispatches undo
updates when clicked, and disables itself when there is nothing to
undo.

```{includeCode: true}
class UndoButton {
  constructor(state, {dispatch}) {
    this.dom = elt("button", {
      onclick: () => dispatch({undo: true}),
      disabled: state.done.length == 0
    }, "⮪ Undo");
  }
  setState(state) {
    this.dom.disabled = state.done.length == 0;
  }
}
```

## Let's draw

{{index "PixelEditor class", "startState constant", "baseTools constant", "baseControls constant", "startPixelEditor function"}}

To set up the application, we need to create a ((state)), a set of
((tool))s, and a set of ((control))s. And then we can use those, along
with a suitable ((dispatch)) function that handles state updates, to
the `PixelEditor` constructor. Since we'll need to create several
editors in the exercises, we'll start by defining some helpful
bindings.

```{includeCode: true}
const startState = {
  tool: "draw",
  color: "#000000",
  picture: Picture.empty(60, 30, "#f0f0f0"),
  done: [],
  doneAt: 0
};
const baseTools = {draw, fill, rectangle, pick};
const baseControls = [ToolSelect, ColorSelect, SaveButton,
                      LoadButton, UndoButton];

function startPixelEditor({state=startState,
                           tools=baseTools,
                           controls=baseControls}) {
  let app = new PixelEditor(state, {
    tools,
    controls,
    dispatch(update) {
      update.time = Date.now();
      state = historyReduceState(state, update);
      app.setState(state);
    }
  });
  return app.dom;
}
```

{{index "destructuring binding", "= operator"}}

When destructuring an object or array, you can use `=` after a binding
name to give the binding a ((default)) value, in case the ((property))
is missing or holds undefined. The `startPixelEditor` function makes
use of this to accept an object with a number of optional properties
as argument. If you don't provide a `tools` property, for example,
`tools` will be bound to `baseTools`.

And this is how we get an actual editor on the screen:

```{lang: "text/html", startCode: true}
<div></div>
<script>
  document.querySelector("div")
    .appendChild(startPixelEditor({}));
</script>
```

{{if interactive

Go ahead and draw something. I'll wait.

if}}

## Why is this so hard

Browser technology is amazing. It provides a powerful set of interface
building blocks, ways to style and manipulate them, and tools to
inspect and debug your applications. The software you write for the
((browser)) can be run on almost every computer and phone on the
planet. This is impressive.

At the same time, browser technology is ridiculous. You have to learn
a large amount of silly tricks and obscure facts to master it, and the
default programming model it provides is so problematic that most
programmers prefer to cover it in several layers of ((abstraction))
rather than dealing with it directly.

And though the situation is definitely improving, it mostly does so in
the form of more elements being added to address shortcomings—creating
even more ((complexity)). A widely used ((standard)) can't really be
replaced. And even if it could, we aren't really sure what it should
be replaced with.

Technology never exists in a vacuum—we're constrained by our tools and
the social, economic, and historic factors that produced them. This
can be annoying, but it is generally more productive to try and build
a good understanding of how the technical reality that we _have_
works—and why it is the way it is—rather than to rage against it or
refuse to deal with it.

New abstractions _can_ be helpful. The component model and data flow
convention I used in this chapter are a very crude form of that. As
mentioned, there are libraries that try to make user interface
programming more pleasant. At the time of writing,
[React](https://reactjs.org/) and [Angular](https://angular.io/) are
popular choices, but there's a whole cottage industry of such
frameworks. If you're interested in programming web applications, I
recommend investigating a few of them to understand how they work and
what benefits they provide.

## Exercises

There is still room for improvement in our program. Let's add a few
more features as exercises.

### Keyboard bindings

{{index "keyboard bindings (exercise)"}}

Add ((keyboard)) shortcuts to the application. The first letter of a
tool's name selects the tool, and Ctrl-Z or Command-Z activates undo.

{{index "PixelEditor class", "tabindex attribute", "elt function", "keydown event"}}

Do this by modifying the `PixelEditor` component. Add a `tabIndex`
property of 0 to the wrapping `<div>` element, so that it can receive
keyboard ((focus)). Note that the _property_ corresponding to the
`tabindex` attribute is called `tabIndex`, with a capital I, and our
`elt` function expects property names. Register the key event handlers
directly on that element. This does mean that you have to click the
application before you can interact with it with the keyboard.

{{index "ctrlKey property", "metaKey property", "control key", "command key"}}

Remember that keyboard events have `ctrlKey` and `metaKey` (for the
Command key on Mac) properties that you can use to see whether those
keys are held down.

{{if interactive

```{test: no, lang: "text/html"}
<div></div>
<script>
  // The original PixelEditor class. Extend the constructor.
  class PixelEditor {
    constructor(state, config) {
      let {tools, controls, dispatch} = config;
      this.state = state;

      this.canvas = new PictureCanvas(state.picture, pos => {
        let tool = tools[this.state.tool];
        let onMove = tool(pos, this.state, dispatch);
        if (onMove) {
          return pos => onMove(pos, this.state, dispatch);
        }
      });
      this.controls = controls.map(
        Control => new Control(state, config));
      this.dom = elt("div", {}, this.canvas.dom, elt("br"),
                     ...this.controls.reduce(
                       (a, c) => a.concat(" ", c.dom), []));
    }
    setState(state) {
      this.state = state;
      this.canvas.setState(state.picture);
      for (let ctrl of this.controls) ctrl.setState(state);
    }
  }

  document.querySelector("div")
    .appendChild(startPixelEditor({}));
</script>
```

if}}

{{hint

{{index "keyboard bindings (exercise)", "key property", "shift key"}}

The `key` property of events for letter keys will be the lower case
letter itself, if Shift isn't being held. And we're not interested in
key events with Shift here.

{{index "keydown event"}}

A `"keydown"` handler can inspect its event object to see if it
matches any of the shortcuts. You can automatically get the list of
first letters from the `tools` object, so that you don't have to write
them out.

{{index "preventDefault method"}}

When the key event matches a shortcut, call `preventDefault` on it and
((dispatch)) the appropriate update.

hint}}

### Efficient drawing

{{index "efficient drawing (exercise)", "canvas (HTML tag)", efficiency}}

During drawing, the majority of work that our application does happens
in `drawPicture`. Creating a new state and updating the rest of the
DOM isn't very expensive, but repainting all the pixels on the canvas
is quite a bit of work.

{{index "setState method", "PictureCanvas class"}}

Find a way to make the `setState` method of `PictureCanvas` faster by
redrawing only the pixels that actually changed.

{{index "drawPicture function", compatibility}}

Remember that `drawPicture` is also used by the save button, so if you
change it, either make sure the changes don't break the old use, or
create a new version with a different name.

{{index "width property", "height property"}}

Also note that changing the size of a `<canvas>` element, by setting
its `width` or `height` properties, clears it, making it entirely
transparent again.

{{if interactive

```{test: no, lang: "text/html"}
<div></div>
<script>
  // Change this method
  PictureCanvas.prototype.setState = function(picture) {
    if (this.picture == picture) return;
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
  };

  // You may want to use or change this as well
  function drawPicture(picture, canvas, scale) {
    canvas.width = picture.width * scale;
    canvas.height = picture.height * scale;
    let cx = canvas.getContext("2d");

    for (let y = 0; y < picture.height; y++) {
      for (let x = 0; x < picture.width; x++) {
        cx.fillStyle = picture.pixel(x, y);
        cx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }

  document.querySelector("div")
    .appendChild(startPixelEditor({}));
</script>
```

if}}

{{hint

{{index "efficient drawing (exercise)"}}

This exercise is a good example of how ((immutable)) data structures
can make code _faster_. Because we have both the old and the new
picture, we can compare them and only redraw the pixels that changed
color, saving over 99% of the drawing work in most cases.

{{index "drawPicture function"}}

You can either write a new function `updatePicture`, or have
`drawPicture` take an extra argument, which may be either undefined or
a picture. For each ((pixel)), it checks whether a previous picture
was passed, and if that previous picture has the same color at this
position, and skips the pixel when that is the case.

{{index "width property", "height property", "canvas (HTML tag)"}}

Because the canvas gets cleared when we change its size, you should
also avoid touching its `width` and `height` properties when the old
and the new picture have the same size. If they do not, you can set
the binding holding the old picture to null, because you shouldn't
skip any pixels after you've changed the canvas size.

hint}}

### Circles

{{index "circles (exercise)"}}

Define a new ((tool)) called `circle` that draws a filled circle when
you drag. The center of the circle lies at the point where the drag or
touch gesture starts, and its ((radius)) is determined by the distance
the user drags.

{{if interactive

```{test: no, lang: "text/html"}
<div></div>
<script>
  function circle(pos, state, dispatch) {
    // Your code here
  }

  let dom = startPixelEditor({
    tools: Object.assign({}, baseTools, {circle})
  });
  document.querySelector("div").appendChild(dom);
</script>
```

if}}

{{hint

{{index "circles (exercise)", "rectangle function"}}

You can take some inspiration from the `rectangle` tool. Like that
tool, you'll want to keep drawing on the _starting_ picture, rather
than the current picture, when the pointer moves.

To figure out which pixels to color, you can use the ((Pythagorean
theorem)). First figure out the distance between the current pointer
position and the start position by taking the square root
(`Math.sqrt`) of the square (`Math.pow(x, 2)`) of the difference in
x-coordinates plus the square of the difference in y-coordinates. Then
loop over a square of pixels start position, whose sides are at least
twice the ((radius)), and color those that are within the circle's
radius, again using the Pythagorean formula to figure out their
((distance)) from the center.

Make sure you don't try to color pixels that are outside of the
picture's boundaries.

hint}}

### Proper lines

{{index "proper lines (exercise)", "line drawing"}}

This is a more advanced exercise than the preceding two, and it will
require you to design a solution to a nontrivial problem. Make sure
you have plenty of time and ((patience)) before starting to work on
this exercise, and do not get discouraged by initial failures.

{{index "draw function", "mousemove event", "touchmove event"}}

On most browsers, when you select the `draw` ((tool)) and quickly drag
across the picture, you don't get a closed line. Rather, you get dots
with gaps between them, because the `"mousemove"` or `"touchmove"`
events did not fire quickly enough to hit every ((pixel)).

Improve the `draw` tool to make it draw a full line. This means you
have to make the motion handler function remember the previous
position, and connect that to the current one.

To do this, since the pixels can be an arbitrary distance apart,
you'll have to write a generalized line-drawing function.

Diagonally adjacent pixels count as a connected. So a slanted line
should look like the picture on the left, not the picture on the
right.

{{figure {url: "img/line-grid.svg", alt: "Two pixelated lines, one light, skipping across pixels diagonally, and one heavy, with all pixels connected horizontally or vertically", width: "6cm"}}}

If we have code that draws a line between two arbitrary points, we
might as well go ahead and use that to also define a `line` tool,
which draws a straight line between the start and end of a drag.

{{if interactive

```{test: no, lang: "text/html"}
<div></div>
<script>
  // The old draw tool. Rewrite this.
  function draw(pos, state, dispatch) {
    function drawPixel(pos, state) {
      let picture = state.picture.copy();
      picture.setPixel(pos.x, pos.y, state.color);
      dispatch({picture});
    }
    drawPixel(pos, state);
    return drawPixel;
  }

  function line(pos, state, dispatch) {
    // Your code here
  }

  let dom = startPixelEditor({
    tools: {draw, line, fill, rectangle, pick}
  });
  document.querySelector("div").appendChild(dom);
</script>
```

if}}

{{hint

{{index "proper lines (exercise)", "line drawing"}}

An important property of the problem of drawing a pixelated line is
that it is really four similar but slightly different problems.
Drawing a horizontal line from the left to the right is easy—you loop
over the x-coordinates and color a pixel at every step. If the line
has a slight slope (less than 45 degrees or ¼π radians), you can
interpolate the y-coordinate along the slope. You still need one pixel
per x position, with the y position of those pixels determined by the
slope.

But as soon as your slope goes across 45 degrees, you need to switch
the way you treat the coordinates. You now need one pixel per y
position, since the line goes up more than it goes left. And then,
when you cross 135 degrees, you have to go back to looping over the
x-coordinates, but from right to left.

You don't actually have to write four loops. Since drawing a line from
_A_ to _B_ is the same as drawing a line from _B_ to _A_, you can swap
the start and end positions for lines going from right to left, and
treat them as going left to right.

But you will need two different loops. So the first thing your line
drawing function should do is check whether the difference between the
x-coordinates is larger than the difference between the y-coordinates.
If it is, this is a horizontal-ish line, if not a vertical-ish one.

{{index "Math.abs function", "absolute value"}}

Make sure you compare the _absolute_ values of the x and y difference,
which you can get with `Math.abs`.

{{index "swapping bindings"}}

Once you know along which ((axis)) you will be looping, you can check
whether the start point has a higher coordinate along that axis than
the end point, and swap them if necessary. A succinct way to swap the
values of two bindings in JavaScript uses ((destructuring assignment))
like this:

```{test: no}
[start, end] = [end, start];
```

{{index rounding}}

Then you can compute the ((slope)) of the line, which determines the
amount that the coordinate on the other axis changes for each step you
take along your main axis. With that, you can run a loop along the
main axis while also tracking the corresponding position on the other
axis, and draw pixels on every iteration. Make sure you round the
non-main axis coordinates, since they are likely to be fractional, and
the `setPixel` method doesn't react well to fractional coordinates.

hint}}
