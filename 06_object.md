{{meta {chap_num: 6, prev_link: 05_higher_order, next_link: 07_elife, load_files: ["code/mountains.js", "code/chapter/06_object.js"], zip: "node/html"}}}

# The Secret Life of Objects

{{quote {author: "Joe Armstrong", title: "interviewed in Coders at Work", chapter: true}

The problem with object-oriented languages
is they’ve got all this implicit environment that they carry around
with them. You wanted a banana but what you got was a gorilla holding
the banana and the entire jungle.

quote}}

{{index "Armstrong, Joe", object, "holy war"}}

When a programmer
says “object”, this is a loaded term. In my profession, objects are a
way of life, the subject of holy wars, and a beloved buzzword that
still hasn't quite lost its power.

To an outsider, this is probably a little confusing. Let's start with
a brief ((history)) of objects as a programming construct.

## History

{{index isolation, history, "object-oriented programming", object}}

This story, like most programming stories, starts with the
problem of ((complexity)). One philosophy is that complexity can be
made manageable by separating it into small compartments that are
isolated from each other. These compartments have ended up with the
name _objects_.

{{index complexity, encapsulation, method, interface}}

{{id interface}}
An
object is a hard shell that hides the gooey complexity inside it
and instead offers us a few knobs and connectors (such as ((method))s)
that present an _interface_ through which the object is to be used.
The idea is that the interface is relatively simple and all the
complex things going on _inside_ the object can be ignored when
working with it.

{{figure {url: "img/object.jpg", alt: "A simple interface can hide a lot of complexity.",width: "6cm"}}}

As an example, you can imagine an object that provides an interface to
an area on your screen. It provides a way to draw shapes or text onto
this area but hides all the details of how these shapes are converted
to the actual pixels that make up the screen. You'd have a set of
methods—for example, _drawCircle_—and those are the only things you
need to know in order to use such an object.

{{index "object-oriented programming"}}

These ideas were initially worked out
in the 1970s and 1980s and, in the 1990s, were carried up by a huge wave
of ((hype))—the object-oriented programming revolution. Suddenly,
there was a large tribe of people declaring that objects were the
_right_ way to program—and that anything that did not involve objects
was outdated nonsense.

That kind of zealotry always produces a lot of impractical silliness,
and there has been a sort of counter-revolution since then. In some
circles, objects have a rather bad reputation nowadays.

I prefer to look at the issue from a practical, rather than
ideological, angle. There are several useful concepts, most
importantly that of _((encapsulation))_ (distinguishing between
internal complexity and external interface), that the object-oriented
culture has popularized. These are worth studying.

This chapter describes JavaScript's rather eccentric take on objects
and the way they relate to some classical object-oriented techniques.

{{id obj_methods}}
## Methods

{{index "rabbit example", method, property}}

Methods are simply
properties that hold function values. This is a simple method:

```
var rabbit = {};
rabbit.speak = function(line) {
  console.log("The rabbit says '" + line + "'");
};

rabbit.speak("I'm alive.");
// → The rabbit says 'I'm alive.'
```

{{index this, "method call"}}

Usually a method needs to do something with
the object it was called on. When a function is called as a
method—looked up as a property and immediately called, as in
_object.method()_—the special variable `this` in its body will point
to the object that it was called on.

```{includeCode: "top_lines:6", test: join}
function speak(line) {
  console.log("The " + this.type + " rabbit says '" +
              line + "'");
}
var whiteRabbit = {type: "white", speak: speak};
var fatRabbit = {type: "fat", speak: speak};

whiteRabbit.speak("Oh my ears and whiskers, " +
                  "how late it's getting!");
// → The white rabbit says 'Oh my ears and whiskers, how
//   late it's getting!'
fatRabbit.speak("I could sure use a carrot right now.");
// → The fat rabbit says 'I could sure use a carrot
//   right now.'
```

{{index "apply method", "bind method", this, "rabbit example"}}

The
code uses the `this` keyword to output the type of rabbit that is
speaking. Recall that the `apply` and `bind` methods both take a first
argument that can be used to simulate method calls. This first
argument is in fact used to give a value to `this`.

{{index "call method"}}

{{id call_method}}
There is a method similar to `apply`, called `call`.
It also calls the function it is a method of but takes its arguments
normally, rather than as an array. Like `apply` and `bind`, `call` can
be passed a specific `this` value.

```
speak.apply(fatRabbit, ["Burp!"]);
// → The fat rabbit says 'Burp!'
speak.call({type: "old"}, "Oh my.");
// → The old rabbit says 'Oh my.'
```

{{id prototypes}}
## Prototypes

{{index "toString method"}}

Watch closely.

```
var empty = {};
console.log(empty.toString);
// → function toString(){…}
console.log(empty.toString());
// → [object Object]
```

{{index magic}}

I just pulled a property out of an empty object. Magic!

{{index property, object}}

Well, not really. I have simply been
withholding information about the way JavaScript objects work. In
addition to their set of properties, almost all objects also have a
_prototype_. A ((prototype)) is another object that is used as a
fallback source of properties. When an object gets a request for a
property that it does not have, its prototype will be searched for the
property, then the prototype's prototype, and so on.

{{index "Object prototype"}}

So who is the ((prototype)) of that empty
object? It is the great ancestral prototype, the entity behind almost
all objects, `Object.prototype`.

```
console.log(Object.getPrototypeOf({}) ==
            Object.prototype);
// → true
console.log(Object.getPrototypeOf(Object.prototype));
// → null
```

{{index "getPrototypeOf function"}}

As you might expect, the
`Object.getPrototypeOf` function returns the prototype of an object.

{{index "toString method"}}

The prototype relations of JavaScript objects
form a ((tree))-shaped structure, and at the root of this structure
sits `Object.prototype`. It provides a few ((method))s that show up in
all objects, such as `toString`, which converts an object to a string
representation.

{{index inheritance, "Function prototype", "Array prototype", "Object prototype"}}

Many objects don't directly have
`Object.prototype` as their ((prototype)), but instead have another
object, which provides its own default properties. Functions derive
from `Function.prototype`, and arrays derive from `Array.prototype`.

```
console.log(Object.getPrototypeOf(isNaN) ==
            Function.prototype);
// → true
console.log(Object.getPrototypeOf([]) ==
            Array.prototype);
// → true
```

{{index "Object prototype"}}

Such a prototype object will itself have a
prototype, often `Object.prototype`, so that it still indirectly
provides methods like `toString`.

{{index "getPrototypeOf function", "rabbit example", "Object.create function"}}

The `Object.getPrototypeOf` function obviously returns the
prototype of an object. You can use `Object.create` to create an
object with a specific ((prototype)).

```
var protoRabbit = {
  speak: function(line) {
    console.log("The " + this.type + " rabbit says '" +
                line + "'");
  }
};
var killerRabbit = Object.create(protoRabbit);
killerRabbit.type = "killer";
killerRabbit.speak("SKREEEE!");
// → The killer rabbit says 'SKREEEE!'
```

{{index "shared property"}}

The “proto” rabbit acts as a container for the
properties that are shared by all rabbits. An individual rabbit
object, like the killer rabbit, contains properties that apply only to
itself—in this case its type—and derives shared properties from its
prototype.

{{id constructors}}
## Constructors

{{index "new operator", this, "return keyword", [object, creation]}}

A more convenient way to create objects that derive
from some shared prototype is to use a _((constructor))_. In
JavaScript, calling a function with the `new` keyword in front of it
causes it to be treated as a constructor. The constructor will have
its `this` variable bound to a fresh object, and unless it explicitly
returns another object value, this new object will be returned from
the call.

An object created with `new` is said to be an _((instance))_ of its
constructor.

{{index "rabbit example", capitalization}}

Here is a simple constructor
for rabbits. It is a convention to capitalize the names of
constructors so that they are easily distinguished from other
functions.

```{includeCode: "top_lines:6"}
function Rabbit(type) {
  this.type = type;
}

var killerRabbit = new Rabbit("killer");
var blackRabbit = new Rabbit("black");
console.log(blackRabbit.type);
// → black
```

{{index "prototype property", constructor}}

Constructors (in fact, all
functions) automatically get a property named `prototype`, which by
default holds a plain, empty object that derives from
`Object.prototype`. Every instance created with this constructor will
have this object as its ((prototype)). So to add a `speak` method to
rabbits created with the `Rabbit` constructor, we can simply do this:

```{includeCode: "top_lines:4"}
Rabbit.prototype.speak = function(line) {
  console.log("The " + this.type + " rabbit says '" +
              line + "'");
};
blackRabbit.speak("Doom...");
// → The black rabbit says 'Doom...'
```

{{index "prototype property", "getPrototypeOf function"}}

It is important
to note the distinction between the way a prototype is associated with
a constructor (through its `prototype` property) and the way objects
_have_ a prototype (which can be retrieved with
`Object.getPrototypeOf`). The actual prototype of a constructor is
`Function.prototype` since constructors are functions. Its
`prototype` _property_ will be the prototype of instances created
through it but is not its _own_ prototype.

## Overriding derived properties

{{index "shared property", overriding}}

When you add a ((property)) to an
object, whether it is present in the prototype or not, the property is
added to the object _itself_, which will henceforth have it as its own
property. If there _is_ a property by the same name in the prototype,
this property will no longer affect the object. The prototype itself
is not changed.

```
Rabbit.prototype.teeth = "small";
console.log(killerRabbit.teeth);
// → small
killerRabbit.teeth = "long, sharp, and bloody";
console.log(killerRabbit.teeth);
// → long, sharp, and bloody
console.log(blackRabbit.teeth);
// → small
console.log(Rabbit.prototype.teeth);
// → small
```

{{index [prototype, diagram]}}

The following diagram sketches the situation
after this code has run. The `Rabbit` and `Object` ((prototype))s lie
behind `killerRabbit` as a kind of backdrop, where properties that are
not found in the object itself can be looked up.

{{figure {url: "img/rabbits.svg", alt: "Rabbit object prototype schema",width: "8cm"}}}

{{index "shared property"}}

Overriding properties that exist in a prototype
is often a useful thing to do. As the rabbit teeth example shows, it
can be used to express exceptional properties in instances of a more
generic class of objects, while letting the nonexceptional objects
simply take a standard value from their prototype.

{{index "toString method", "Array prototype", "Function prototype"}}

It
is also used to give the standard function and array prototypes a
different `toString` method than the basic object prototype.

```
console.log(Array.prototype.toString ==
            Object.prototype.toString);
// → false
console.log([1, 2].toString());
// → 1,2
```

{{index "toString method", "join method", "call method"}}

Calling
`toString` on an array gives a result similar to calling `.join(",")`
on it—it puts commas between the values in the array. Directly calling
`Object.prototype.toString` with an array produces a different string.
That function doesn't know about arrays, so it simply puts the word
“object” and the name of the type between square brackets.

```
console.log(Object.prototype.toString.call([1, 2]));
// → [object Array]
```

## Prototype interference

{{index [prototype, interference], "rabbit example", mutability}}

A
((prototype)) can be used at any time to add new properties and
methods to all objects based on it. For example, it might become
necessary for our rabbits to dance.

```
Rabbit.prototype.dance = function() {
  console.log("The " + this.type + " rabbit dances a jig.");
};
killerRabbit.dance();
// → The killer rabbit dances a jig.
```

{{index map, [object, "as map"]}}

That's convenient. But there are
situations where it causes problems. In previous chapters, we used an
object as a way to associate values with names by creating properties
for the names and giving them the corresponding value as their value.
Here's an example from [Chapter 4](04_data.html#object_map):

```{includeCode: true}
var map = {};
function storePhi(event, phi) {
  map[event] = phi;
}

storePhi("pizza", 0.069);
storePhi("touched tree", -0.081);
```

{{index "for/in loop", "in operator"}}

We can iterate over all phi values
in the object using a `for`/`in` loop and test whether a name is in
there using the regular `in` operator. But unfortunately, the object's
prototype gets in the way.

```
Object.prototype.nonsense = "hi";
for (var name in map)
  console.log(name);
// → pizza
// → touched tree
// → nonsense
console.log("nonsense" in map);
// → true
console.log("toString" in map);
// → true

// Delete the problematic property again
delete Object.prototype.nonsense;
```

{{index [prototype, pollution], "toString method"}}

That's all wrong. There
is no event called “nonsense” in our data set. And there _definitely_
is no event called “toString”.

{{index enumerability, "for/in loop", property}}

Oddly, `toString`
did not show up in the `for`/`in` loop, but the `in` operator did
return true for it. This is because JavaScript distinguishes between
_enumerable_ and _nonenumerable_ properties.

{{index "Object prototype"}}

All properties that we create by simply
assigning to them are enumerable. The standard properties in
`Object.prototype` are all nonenumerable, which is why they do not
show up in such a `for`/`in` loop.

{{index "defineProperty function"}}

It is possible to define our own
nonenumerable properties by using the `Object.defineProperty`
function, which allows us to control the type of property we are
creating.

```
Object.defineProperty(Object.prototype, "hiddenNonsense",
                      {enumerable: false, value: "hi"});
for (var name in map)
  console.log(name);
// → pizza
// → touched tree
console.log(map.hiddenNonsense);
// → hi
```

{{index "in operator", map, [object, "as map"], "hasOwnProperty method"}}

So now the property is there, but it won't show up in a loop.
That's good. But we still have the problem with the regular `in`
operator claiming that the `Object.prototype` properties exist in our
object. For that, we can use the object's `hasOwnProperty` method.

```
console.log(map.hasOwnProperty("toString"));
// → false
```

{{index [property, own]}}

This method tells us whether the object _itself_ has
the property, without looking at its prototypes. This is often a more
useful piece of information than what the `in` operator gives us.

{{index [prototype, pollution], "for/in loop"}}

When you are worried that
someone (some other code you loaded into your program) might have
messed with the base object prototype, I recommend you write your
`for`/`in` loops like this:

```
for (var name in map) {
  if (map.hasOwnProperty(name)) {
    // ... this is an own property
  }
}
```

## Prototype-less objects

{{index map, [object, "as map"], "hasOwnProperty method"}}

But the
rabbit hole doesn't end there. What if someone registered the name
`hasOwnProperty` in our `map` object and set it to the value 42? Now
the call to `map.hasOwnProperty` will try to call the local property,
which holds a number, not a function.

{{index "Object.create function", [prototype, avoidance]}}

In such a case,
prototypes just get in the way, and we would actually prefer to have
objects without prototypes. We saw the `Object.create` function, which
allows us to create an object with a specific prototype. You are
allowed to pass `null` as the prototype to create a fresh object with
no prototype. For objects like `map`, where the properties could be
anything, this is exactly what we want.

```
var map = Object.create(null);
map["pizza"] = 0.069;
console.log("toString" in map);
// → false
console.log("pizza" in map);
// → true
```

{{index "in operator", "for/in loop", "Object prototype"}}

Much
better! We no longer need the `hasOwnProperty` kludge because all the
properties the object has are its own properties. Now we can safely
use `for`/`in` loops, no matter what people have been doing to
`Object.prototype`.

## Polymorphism

{{index "toString method", "String function", polymorphism, overriding}}

When you call the
`String` function, which converts a value to a string, on an object,
it will call the `toString` method on that object to try to create a
meaningful string to return. I mentioned that some of the standard
prototypes define their own version of `toString` so they can
create a string that contains more useful information than
`"[object Object]"`.

{{index "object-oriented programming"}}

This is a simple instance of a 
powerful idea. When a piece of code is written to work with objects
that have a certain ((interface))—in this case, a `toString`
method—any kind of object that happens to support this interface can
be plugged into the code, and it will just work.

This technique is called _polymorphism_—though no actual
shape-shifting is involved. Polymorphic code can work with values of
different shapes, as long as they support the interface it expects.

{{id tables}}
## Laying out a table

{{index "MOUNTAINS data set", "table example"}}

I am going to work through
a slightly more involved example in an attempt to give you a better
idea what ((polymorphism)), as well as ((object-oriented programming))
in general, looks like. The project is this: we will write a program
that, given an array of arrays of ((table)) cells, builds up a string
that contains a nicely laid out table—meaning that the columns are
straight and the rows are aligned. Something like this:

```{lang: "text/plain"}
name         height country
------------ ------ -------------
Kilimanjaro    5895 Tanzania
Everest        8848 Nepal
Mount Fuji     3776 Japan
Mont Blanc     4808 Italy/France
Vaalserberg     323 Netherlands
Denali         6168 United States
Popocatepetl   5465 Mexico
```

The way our table-building system will work is that the builder
function will ask each cell how wide and high it wants to be and then
use this information to determine the width of the columns and the
height of the rows. The builder function will then ask the cells to
draw themselves at the correct size and assemble the results into a
single string.

{{index "table example"}}

{{id table_interface}}
The layout program will communicate with the cell
objects through a well-defined ((interface)). That way, the types of
cells that the program supports is not fixed in advance. We can add
new cell styles later—for example, underlined cells for table
headers—and if they support our interface, they will just work,
without requiring changes to the layout program.

This is the interface:

* `minHeight()` returns a number indicating the minimum height this
  cell requires (in lines).

* `minWidth()` returns a number indicating this cell's minimum width (in
  characters).

* `draw(width, height)` returns an array of length
  `height`, which contains a series of strings that are each `width` characters wide.
  This represents the content of the cell.

{{index [function, "higher-order"]}}

I'm going to make heavy use of higher-order
array methods in this example since it lends itself well to that
approach.

{{index "rowHeights function", "colWidths function", maximum, "map method", "reduce method"}}

The first part of the program computes
arrays of minimum column widths and row heights for a grid of cells.
The `rows` variable will hold an array of arrays, with each inner array
representing a row of cells.

```{includeCode: true}
function rowHeights(rows) {
  return rows.map(function(row) {
    return row.reduce(function(max, cell) {
      return Math.max(max, cell.minHeight());
    }, 0);
  });
}

function colWidths(rows) {
  return rows[0].map(function(_, i) {
    return rows.reduce(function(max, row) {
      return Math.max(max, row[i].minWidth());
    }, 0);
  });
}
```

{{index "underscore character", "programming style"}}

Using a variable name
starting with an underscore (_) or consisting entirely of a single
underscore is a way to indicate (to human readers) that this argument
is not going to be used.

The `rowHeights` function shouldn't be too hard to follow. It uses
`reduce` to compute the maximum height of an array of cells and wraps
that in `map` in order to do it for all rows in the `rows` array.

{{index "map method", "filter method", "forEach method", [array, indexing], "reduce method"}}

Things are slightly
harder for the `colWidths` function because the outer array is an
array of rows, not of columns. I have failed to mention so far that
`map` (as well as `forEach`, `filter`, and similar array methods)
passes a second argument to the function it is given: the ((index)) of
the current element. By mapping over the elements of the first row and
only using the mapping function's second argument, `colWidths` builds
up an array with one element for every column index. The call to
`reduce` runs over the outer `rows` array for each index and picks
out the width of the widest cell at that index.

{{index "table example", "drawTable function"}}

Here's the code to draw a
table:

```{includeCode: true}
function drawTable(rows) {
  var heights = rowHeights(rows);
  var widths = colWidths(rows);

  function drawLine(blocks, lineNo) {
    return blocks.map(function(block) {
      return block[lineNo];
    }).join(" ");
  }

  function drawRow(row, rowNum) {
    var blocks = row.map(function(cell, colNum) {
      return cell.draw(widths[colNum], heights[rowNum]);
    });
    return blocks[0].map(function(_, lineNo) {
      return drawLine(blocks, lineNo);
    }).join("\n");
  }

  return rows.map(drawRow).join("\n");
}
```

{{index "inner function", [nesting, "of functions"]}}

The `drawTable` function
uses the internal helper function `drawRow` to draw all rows and then
joins them together with newline characters.

{{index "table example"}}

The `drawRow` function itself first converts the
cell objects in the row to _blocks_, which are arrays of strings
representing the content of the cells, split by line. A single cell
containing simply the number 3776 might be represented by a
single-element array like `["3776"]`, whereas an underlined cell might
take up two lines and be represented by the array `["name", "----"]`.

{{index "map method", "join method"}}

The blocks for a row, which all have
the same height, should appear next to each other in the final output.
The second call to `map` in `drawRow` builds up this output line by
line by mapping over the lines in the leftmost block and, for each of
those, collecting a line that spans the full width of the table. These
lines are then joined with newline characters to provide the whole row
as `drawRow`’s return value.

The function `drawLine` extracts lines that should appear next
to each other from an array of blocks and joins them with a space
character to create a one-character gap between the table's columns.

{{index "split method", [string, methods], "table example"}}

{{id split}}
Now
let's write a constructor for cells that contain text, which
implements the ((interface)) for table cells. The constructor splits a
string into an array of lines using the string method `split`, which
cuts up a string at every occurrence of its argument and returns an
array of the pieces. The `minWidth` method finds the maximum line
width in this array.

```{includeCode: true}
function repeat(string, times) {
  var result = "";
  for (var i = 0; i < times; i++)
    result += string;
  return result;
}

function TextCell(text) {
  this.text = text.split("\n");
}
TextCell.prototype.minWidth = function() {
  return this.text.reduce(function(width, line) {
    return Math.max(width, line.length);
  }, 0);
};
TextCell.prototype.minHeight = function() {
  return this.text.length;
};
TextCell.prototype.draw = function(width, height) {
  var result = [];
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || "";
    result.push(line + repeat(" ", width - line.length));
  }
  return result;
};
```

{{index "TextCell type"}}

The code uses a helper function called `repeat`,
which builds a string whose value is the `string` argument repeated
`times` number of times. The `draw` method uses it to add “padding” to
lines so that they all have the required length.

Let's try everything we've written so far by building up a 5 × 5
checkerboard.

```
var rows = [];
for (var i = 0; i < 5; i++) {
   var row = [];
   for (var j = 0; j < 5; j++) {
     if ((j + i) % 2 == 0)
       row.push(new TextCell("##"));
     else
       row.push(new TextCell("  "));
   }
   rows.push(row);
}
console.log(drawTable(rows));
// → ##    ##    ##
//      ##    ##   
//   ##    ##    ##
//      ##    ##   
//   ##    ##    ##
```

It works! But since all cells have the same size, the table-layout
code doesn't really do anything interesting.

{{index "data set", "MOUNTAINS data set"}}

{{id mountains}}
The source data for the table of
mountains that we are trying to build is available in the `MOUNTAINS`
variable in the ((sandbox)) and also
http://eloquentjavascript.net/code/mountains.js[downloadable] from the
website(!book (http://eloquentjavascript.net/code#6[_eloquentjavascript.net/code#6_])!).

{{index "table example"}}

We will want to highlight the top row, which
contains the column names, by underlining the cells with a series of
dash characters. No problem—we simply write a cell type that handles
underlining.

```{includeCode: true}
function UnderlinedCell(inner) {
  this.inner = inner;
}
UnderlinedCell.prototype.minWidth = function() {
  return this.inner.minWidth();
};
UnderlinedCell.prototype.minHeight = function() {
  return this.inner.minHeight() + 1;
};
UnderlinedCell.prototype.draw = function(width, height) {
  return this.inner.draw(width, height - 1)
    .concat([repeat("-", width)]);
};
```

{{index "UnterlinedCell type"}}

An underlined cell _contains_ another cell.
It reports its minimum size as being the same as that of its inner
cell (by calling through to that cell's `minWidth` and `minHeight`
methods) but adds one to the height to account for the space taken
up by the underline.

{{index "concat method", concatenation}}

Drawing such a cell is quite
simple—we take the content of the inner cell and concatenate a single
line full of dashes to it.

{{index "dataTable function"}}

Having an underlining mechanism, we can now
write a function that builds up a grid of cells from our data set.

```{test: "wrap, trailing"}
function dataTable(data) {
  var keys = Object.keys(data[0]);
  var headers = keys.map(function(name) {
    return new UnderlinedCell(new TextCell(name));
  });
  var body = data.map(function(row) {
    return keys.map(function(name) {
      return new TextCell(String(row[name]));
    });
  });
  return [headers].concat(body);
}

console.log(drawTable(dataTable(MOUNTAINS)));
// → name         height country
//   ------------ ------ -------------
//   Kilimanjaro  5895   Tanzania
//   … etcetera
```

{{index "Object.keys function", property, "for/in loop"}}

{{id keys}}
The standard
`Object.keys` function returns an array of property names in an
object. The top row of the table must contain underlined cells that
give the names of the columns. Below that, the values of all the
objects in the data set appear as normal cells—we extract them by
mapping over the `keys` array so that we are sure that the order of
the cells is the same in every row.

{{index "right-aligning"}}

The resulting table resembles the example shown
before, except that it does not right-align the numbers in the
`height` column. We will get to that in a moment.

## Getters and setters

{{index getter, setter, property}}

When specifying an interface, it
is possible to include properties that are not methods. We could have
defined `minHeight` and `minWidth` to simply hold numbers. But that'd
have required us to compute them in the ((constructor)), which adds
code there that isn't strictly relevant to _constructing_ the object.
It would cause problems if, for example, the inner cell of an
underlined cell was changed, at which point the size of the underlined
cell should also change.

{{index "programming style"}}

This has led some people to adopt a principle
of never including nonmethod properties in interfaces. Rather than
directly access a simple value property, they'd use `getSomething` and
`setSomething` methods to read and write the property. This approach
has the downside that you will end up writing—and reading—a lot of
additional methods.

Fortunately, JavaScript provides a technique that gets us the best of
both worlds. We can specify properties that, from the outside, look
like normal properties but secretly have ((method))s associated with
them.

```
var pile = {
  elements: ["eggshell", "orange peel", "worm"],
  get height() {
    return this.elements.length;
  },
  set height(value) {
    console.log("Ignoring attempt to set height to", value);
  }
};

console.log(pile.height);
// → 3
pile.height = 100;
// → Ignoring attempt to set height to 100
```

{{index "defineProperty function", "{} (object)", getter, setter}}

In an object literal, the `get` or
`set` notation for properties allows you to specify a function to be
run when the property is read or written. You can also add such a
property to an existing object, for example a prototype, using the
`Object.defineProperty` function (which we previously used to create
nonenumerable properties).

```
Object.defineProperty(TextCell.prototype, "heightProp", {
  get: function() { return this.text.length; }
});

var cell = new TextCell("no\nway");
console.log(cell.heightProp);
// → 2
cell.heightProp = 100;
console.log(cell.heightProp);
// → 2
```

You can use a similar `set` property, in the object passed to
`defineProperty`, to specify a setter method. When a getter but no
setter is defined, writing to the property is simply ignored.

## Inheritance

{{index inheritance, "table example", alignment, "TextCell type"}}

We are not quite done yet with our table layout exercise. It
helps readability to right-align columns of numbers. We should create
another cell type that is like `TextCell`, but rather than padding the
lines on the right side, it pads them on the left side so that they
align to the right.

{{index "RTextCell type"}}

We could simply write a whole new ((constructor))
with all three methods in its prototype. But prototypes may themselves
have prototypes, and this allows us to do something clever.

```{includeCode: true}
function RTextCell(text) {
  TextCell.call(this, text);
}
RTextCell.prototype = Object.create(TextCell.prototype);
RTextCell.prototype.draw = function(width, height) {
  var result = [];
  for (var i = 0; i < height; i++) {
    var line = this.text[i] || "";
    result.push(repeat(" ", width - line.length) + line);
  }
  return result;
};
```

{{index "shared property", overriding, interface}}

We reuse the
constructor and the `minHeight` and `minWidth` methods from the
regular `TextCell`. An `RTextCell` is now basically equivalent to a
`TextCell`, except that its `draw` method contains a different
function.

{{index "call method"}}

This pattern is called _((inheritance))_. It allows
us to build slightly different data types from existing data types with
relatively little work. Typically, the new constructor will call the
old ((constructor)) (using the `call` method in order to be able to
give it the new object as its `this` value). Once this constructor has
been called, we can assume that all the fields that the old object
type is supposed to contain have been added. We arrange for the
constructor's ((prototype)) to derive from the old prototype so that
instances of this type will also have access to the properties in that
prototype. Finally, we can override some of these properties by adding
them to our new prototype.

{{index "dataTable function"}}

Now, if we slightly adjust the `dataTable`
function to use _RTextCell_s for cells whose value is a number, we
get the table we were aiming for.

```{startCode: "bottom_lines: 1", includeCode: strip_log}
function dataTable(data) {
  var keys = Object.keys(data[0]);
  var headers = keys.map(function(name) {
    return new UnderlinedCell(new TextCell(name));
  });
  var body = data.map(function(row) {
    return keys.map(function(name) {
      var value = row[name];
      // This was changed:
      if (typeof value == "number")
        return new RTextCell(String(value));
      else
        return new TextCell(String(value));
    });
  });
  return [headers].concat(body);
}

console.log(drawTable(dataTable(MOUNTAINS)));
// → … beautifully aligned table
```

{{index "object-oriented programming"}}

Inheritance is a fundamental part of
the object-oriented tradition, alongside encapsulation and
polymorphism. But while the latter two are now generally regarded as
wonderful ideas, inheritance is somewhat controversial.

{{index complexity}}

The main reason for this is that it is often confused
with ((polymorphism)), sold as a more powerful tool than it really
is, and subsequently overused in all kinds of ugly ways. Whereas
((encapsulation)) and polymorphism can be used to _separate_ pieces of
code from each other, reducing the tangledness of the overall program,
((inheritance)) fundamentally ties types together, creating _more_
tangle.

{{index "code structure", "programming style"}}

You can have
polymorphism without inheritance, as we saw. I am not going to tell
you to avoid inheritance entirely—I use it regularly in my own
programs. But you should see it as a slightly dodgy trick that can help you
define new types with little code, not as a grand principle of code
organization. A preferable way to extend types is through
((composition)), such as how `UnderlinedCell` builds on another cell
object by simply storing it in a property and forwarding method calls
to it in its own ((method))s.

## The instanceof operator

{{index type, "instanceof operator", constructor, object}}

It is occasionally useful to know whether an object was derived
from a specific constructor. For this, JavaScript provides a binary
operator called `instanceof`.

```
console.log(new RTextCell("A") instanceof RTextCell);
// → true
console.log(new RTextCell("A") instanceof TextCell);
// → true
console.log(new TextCell("A") instanceof RTextCell);
// → false
console.log([1] instanceof Array);
// → true
```

{{index inheritance}}

The operator will see through inherited types.
An `RTextCell` is an instance of `TextCell` because
`RTextCell.prototype` derives from `TextCell.prototype`. The operator
can be applied to standard constructors like `Array`. Almost every
object is an instance of `Object`.

## Summary

So objects are more complicated than I initially portrayed them. They
have prototypes, which are other objects, and will act as if they have
properties they don't have as long as the prototype has that property.
Simple objects have `Object.prototype` as their prototype.

Constructors, which are functions whose names usually start with a
capital letter, can be used with the `new` operator to create new
objects. The new object's prototype will be the object found in the
`prototype` property of the constructor function. You can make good
use of this by putting the properties that all values of a given type
share into their prototype. The `instanceof` operator can, given an
object and a constructor, tell you whether that object is an instance
of that constructor.

One useful thing to do with objects is to specify an interface for
them and tell everybody that they are supposed to talk to your
object only through that interface. The rest of the details that make up
your object are now _encapsulated_, hidden behind the interface.

Once you are talking in terms of interfaces, who says that only one
kind of object may implement this interface? Having different objects
expose the same interface and then writing code that works on any
object with the interface is called _polymorphism_. It is very
useful.

When implementing multiple types that differ in only some details, it
can be helpful to simply make the prototype of your new type derive
from the prototype of your old type and have your new constructor
call the old one. This gives you an object type similar to the
old type but for which you can add and override properties as you see
fit.

## Exercises

{{id exercise_vector}}
### A vector type

{{index dimensions, "Vector type", coordinates, "vector (exercise)"}}

Write a
((constructor)) `Vector` that represents a vector in two-dimensional
space. It takes `x` and `y` parameters (numbers), which it should save
to properties of the same name.

{{index addition, subtraction}}

Give the `Vector` prototype two
methods, `plus` and `minus`, that take another vector as a parameter
and return a new vector that has the sum or difference of the two
vectors’ (the one in `this` and the parameter) _x_ and _y_ values.

Add a ((getter)) property `length` to the prototype that computes the
length of the vector—that is, the distance of the point (_x_, _y_) from
the origin (0, 0).

{{if interactive

```{test: no}
// Your code here.

console.log(new Vector(1, 2).plus(new Vector(2, 3)));
// → Vector{x: 3, y: 5}
console.log(new Vector(1, 2).minus(new Vector(2, 3)));
// → Vector{x: -1, y: -1}
console.log(new Vector(3, 4).length);
// → 5
```
if}}

{{hint

{{index "vector (exercise)"}}

Your solution can follow the pattern of the
`Rabbit` constructor from this chapter quite closely.

{{index Pythagoras, "defineProperty function", "square root", "Math.sqrt function"}}

Adding a getter property to the
constructor can be done with the `Object.defineProperty` function. To
compute the distance from (0, 0) to (x, y), you can use the
Pythagorean theorem, which says that the square of the distance we are
looking for is equal to the square of the x-coordinate plus the square
of the y-coordinate. Thus, (!html √(x^2^ + y^2^pass:[)]!)(!tex pass:[$\sqrt{x^2 + y^2}$]!)
is the number you want, and `Math.sqrt` is the way you compute a square
root in JavaScript.

hint}}

### Another cell

{{index "StretchCell (exercise)", interface}}

Implement a cell type named
`StretchCell(inner, width, height)` that conforms to the
[table cell interface](06_object.html#table_interface) described
earlier in the chapter. It should wrap another cell (like
`UnderlinedCell` does) and ensure that the resulting cell has at
least the given `width` and `height`, even if the inner cell would
naturally be smaller.

{{if interactive

```{test: no}
// Your code here.

var sc = new StretchCell(new TextCell("abc"), 1, 2);
console.log(sc.minWidth());
// → 3
console.log(sc.minHeight());
// → 2
console.log(sc.draw(3, 2));
// → ["abc", "   "]
```

if}}

{{hint

{{index "StretchCell (exercise)"}}

You'll have to store all three constructor
arguments in the instance object. The `minWidth` and `minHeight`
methods should call through to the corresponding methods in the
`inner` cell but ensure that no number less than the given size is
returned (possibly using `Math.max`).

Don't forget to add a `draw` method that simply forwards the call to
the inner cell.

hint}}

### Sequence interface

{{index "sequence (exercise)"}}

Design an _((interface))_ that abstracts
((iteration)) over a ((collection)) of values. An object that provides
this interface represents a sequence, and the interface must somehow
make it possible for code that uses such an object to iterate over the
sequence, looking at the element values it is made up of and having
some way to find out when the end of the sequence is reached.

When you have specified your interface, try to write a function
`logFive` that takes a sequence object and calls `console.log` on its
first five elements—or fewer, if the sequence has fewer than five
elements.

Then implement an object type `ArraySeq` that wraps an array and
allows iteration over the array using the interface you designed.
Implement another object type `RangeSeq` that iterates over a range of
integers (taking `from` and `to` arguments to its constructor)
instead.

{{if interactive

```{test: no}
// Your code here.

logFive(new ArraySeq([1, 2]));
// → 1
// → 2
logFive(new RangeSeq(100, 1000));
// → 100
// → 101
// → 102
// → 103
// → 104
```

if}}

{{hint

{{index "sequence (exercise)", collection}}

One way to solve this is to
give the sequence objects _((state))_, meaning their properties are
changed in the process of using them. You could store a counter that
indicates how far the sequence object has advanced.

Your ((interface)) will need to expose at least a way to get the next
element and to find out whether the iteration has reached the end of
the sequence yet. It is tempting to roll these into one method,
`next`, which returns `null` or `undefined` when the sequence is at
its end. But now you have a problem when a sequence actually contains
`null`. So a separate method (or getter property) to find out whether
the end has been reached is probably preferable.

{{index mutation, "pure function", efficiency}}

Another solution is
to avoid changing state in the object. You can expose a method for
getting the current element (without advancing any counter) and
another for getting a new sequence that represents the remaining
elements after the current one (or a special value if the end of the
sequence is reached). This is quite elegant—a sequence value will
“stay itself” even after it is used and can thus be shared with other
code without worrying about what might happen to it. It is,
unfortunately, also somewhat inefficient in a language like
JavaScript because it involves creating a lot of objects during
iteration.

hint}}

