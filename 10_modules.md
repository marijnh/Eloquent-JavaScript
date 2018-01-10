{{meta {load_files: ["code/packages_chapter_10.js", "code/chapter/07_robot.js"]}}}

# Modules

{{quote {author: "Master Yuan-Ma", title: "The Book of Programming", chapter: true}

A beginning programmer writes her programs like an ant builds her
hill, one piece at a time, without thought for the bigger structure.
Her programs will be like loose sand. They may stand for a while, but
growing too big they fall apart.

Realizing this problem, the programmer will start to spend a lot of
time thinking about structure. Her programs will be rigidly
structured, like rock sculptures. They are solid, but when they must
change, violence must be done to them.

The master programmer knows when to apply structure and when to leave
things in their simple form. Her programs are like clay, solid yet
malleable.

quote}}

{{index organization, "code structure", "Yuan-Ma", "Book of Programming"}}

The ideal program has a clear structure. It is easy to explain how it
works, and each part plays a clear role.

{{index "organic growth"}}

A typical real-world program grows organically. New pieces of
functionaly are added as new needs come up. Structuring—and preserving
structure—is additional work. Work which only pays off in the future,
the _next_ time someone works with the program. So it is tempting to
neglect it, and allow the parts of the program to become deeply
entangled.

{{index readability, reuse, isolation}}

This causes two practical issues. Firstly, understanding such a system
is hard. If everything can touch everything else, it is difficult to
look at any given piece in isolation. You are forced to build up a
holistic understanding of the whole thing. Secondly, if you need any
of the functionality in such a program in another context, rewriting
it may be easier than trying to disentangle it from its context.

The term "((big ball of mud))" is often used for such large,
structureless programs. Everything sticks together, and when you try
to pick out a piece, the whole thing comes apart and your hands get
dirty.

## Modules

{{index dependency}}

_Modules_ are an attempt to avoid these problems. A ((module)) is a
piece of program that specifies which other pieces it relies on (its
_dependencies_), and which functionality it provides for other modules
to use (its _((interface))_).

{{index "big ball of mud"}}

Module interfaces have a lot in common with object interfaces, as we
saw them in [Chapter ?](objects#interface). They make part of the
module available to the outside world, and keep the rest private. By
restricting the ways in which modules interact with each other, the
system becomes more like ((Lego)), where pieces interact through
well-defined connectors, and less like mud, where everything mixes
with everything.

To separate modules in that way, each needs it own private ((scope)).

{{index dependency}}

The relations between modules are called dependencies. When a module
needs a piece from another module, it is said to be dependent on that
module. When this fact is clearly specified in the module itself, it
can be used to automatically load dependencies and to figure out which
other modules need to be present to be able to use a given module.

Just putting your JavaScript code into different ((file))s does not
satisfy these requirements. The files still share the same global
namespace. They can, intentionally or accidentally, interfere with
each other's bindings. And the dependency structure remains nebulous.
We can do better, as we'll see later in the chapter.

{{index design}}

Designing a fitting module structure for a program can be difficult.
In the phase where you are still exploring the problem, trying out
different things to see what works, you might want to not worry about
it too much, since it can be a big distraction. Once you have
something that feels solid, that's a good time to take a step back and
organize it.

## Packages

{{index bug, dependency, structure, reuse}}

One of the advantages of building a program out of separate pieces,
and being actually able to run those pieces on their own, is that you
might be able to apply the same piece in different programs.

{{index "parseINI function"}}

But how do you set this up? Say I want to use the `parseINI` function
from [Chapter ?](regexp#ini) in another program. If it is clear what
it depends on (in this case, nothing), I can just copy all the
necessary code into my new project, and use it. But then, if I find a
mistake in that code, I'll probably fix it in whichever program that
I'm working with at the time and forget to also fix it in the other
program.

{{index duplication, "copy-paste programming"}}

Once you start duplicating code, you'll quickly find yourself wasting
time and energy on moving copies around and keeping them up-to-date.

That's where _((package))s_ come in. A package is a chunk of code that
can be distributed (copied and installed). It may contain one or more
modules, and tells you which other packages it depends on. A package
also usually comes with documentation explaining what it does, so that
people who didn't write it might still be able to use it.

When a problem is found in a package, or a new feature is added, the
package is updated. Now the programs that depend on it (which may also
be packages) can upgrade to the new ((version)).

{{id modules_npm}}

{{index installation, upgrading, "package manager", download, reuse}}

Working in this way requires ((infrastructure)). We need a place to
store and find packages, and a convenient way to install and upgrade
them. In the JavaScript world, this infrastructure is provided by
((NPM)) ([_npmjs.org_](http://npmjs.org)).

NPM is two things: an online service where one can download (and
upload) packages, and a program (bundled with Node.js) that helps you
install and manage them.

{{index "ini package"}}

At the time of writing, there are over half a million different
packages available on NPM. A large portion of those are rubbish, I
should mention, but almost every good, publicly available package is
also on there. For example, an INI file parser, as we built in
[Chapter ?](regexp), is available in the `ini` package on NPM.

[Chapter ?](node) will show how to install such packages locally using
the `npm` ((command line)) program.

Having quality packages available like this, to simply download from
the NPM ((registry)), is extremely valuable. It means that we can
often avoid reinventing a program that a hundred people have written
before, and get a solid, well-tested implementation at the press of a
few keys.

{{index maintenance}}

Software is cheap to copy, so once someone has written it,
distributing it to other people is an efficient process. But writing
it in the first place _is_ work, and responding to people who have
found problems in the code, or who want to propose new features, is
even more work.

By default, you own the ((copyright)) to the code you write, and other
people may only use it with your permission. But because some people
are just nice, and because publishing good software can help make you
a little bit famous among programmers, many packages are published
under a ((license)) that explicitly allows other people to use it.

Most code on ((NPM)) is licensed this way. Some licenses require you
to also publish code that you build on top of the package under the
same license. Others are less demanding, just requiring that you keep
the license with the code as you distribute it. The JavaScript
community mostly uses the latter type of license. But when using other
people's packages, make sure you are aware of their license.

## Improvised modules

Until 2015, the JavaScript language had no built-in module system.
People had been building large systems in JavaScript for over a decade
though, and they _needed_ ((module))s.

{{index [function, scope]}}

So they designed their own ((module system))s on top of the language.
You can use JavaScript functions to create local scopes, and
((object))s to represent module ((interface))s.

{{index "Date class", "weekDay module"}}

This is a module for going between day names and numbers (as returned
by `Date`'s `getDay` method). Its interface consists of `weekDay.name`
and `weekDay.number`, and it hides its local binding `names` inside
the scope of a function expression that is immediately invoked.

```
const weekDay = function() {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday",
                 "Thursday", "Friday", "Saturday"];
  return {
    name(number) { return names[number]; },
    number(name) { return names.indexOf(name); }
  };
}();

console.log(weekDay.name(weekDay.number("Sunday")));
// → Sunday
```

{{index dependency}}

This style of modules provides ((isolation)), to a certain degree, but
it does not declare dependencies. Instead, it just puts its
((interface)) into the ((global scope)), and expects its dependencies,
if any, to do the same. This approach was widely used in web
programming for a long time, but is mostly obsolete now.

If we want to make dependency relations part of the code, we'll have
to take control of loading dependencies. Doing that involves being
able to execute strings as code. JavaScript can do that.

{{id eval}}

## Evaluating data as code

{{index evaluation, interpretation}}

There are several ways to take data (a string of code) and run it as
part of the current program.

{{index isolation, eval}}

The most obvious way is the special operator `eval`, which will
execute a string in the _current_ ((scope)). This is usually a bad idea
because it breaks some of the properties that scopes normally have,
such as it being easily predictable which binding a given name refers
to.

```
const x = 1;
function evalAndReturnX(code) {
  eval(code);
  return x;
}

console.log(evalAndReturnX("var x = 2"));
// → 2
```

{{index "Function constructor"}}

A less scary way of interpreting data as code is to use the `Function`
constructor. This takes two arguments: a string containing a
comma-separated list of argument names and a string containing the
function's body.

```
let plusOne = new Function("n", "return n + 1;");
console.log(plusOne(4));
// → 5
```

This is precisely what we need for a module system. We can wrap the
module's code in a function, and use that function's scope as module
((scope)).

## CommonJS

{{index "CommonJS modules"}}

The most widely used approach to bolted-on JavaScript modules is
called _CommonJS modules_. It was popularized because ((Node.js)) uses
it, and is the system used by most packages on ((NPM)).

{{index "require function"}}

The main concept in CommonJS modules is a function called `require`.
When you call this with the module name of your dependency, it makes
sure this module is loaded and returns its ((interface)).

{{index "exports object"}}

Because the loader takes care of wrapping the module in a function to
create a local ((scope)), modules themselves can be written without
any additional clutter like a wrapper function. The only thing they
have to do is call `require` to access their dependencies, and put
their interface in the object bound to `exports`.

{{index "formatDate module", "Date class", "ordinal package", "date-names package"}}

This example module provides a date-formatting function. It uses two
((package))s from NPM—`ordinal` to convert numbers to strings like
`"1st"` and `"2nd"`, and `date-names` to get the English names for
weekdays and months. It exports a single function, `formatDate`, which
takes a `Date` object and a ((template)) string.

The template string may contain codes that direct the format, such as
`YYYY` for the full year and `Do` for the ordinal day of the month.
You could give it a string like `"MMMM Do YYYY"` to get output like
"November 22nd 2017".

```
const ordinal = require("ordinal");
const {days, months} = require("date-names");

exports.formatDate = function(date, format) {
  return format.replace(/YYYY|M(MMM)?|Do?|dddd/g, tag => {
    if (tag == "YYYY") return date.getFullYear();
    if (tag == "M") return date.getMonth();
    if (tag == "MMMM") return months[date.getMonth()];
    if (tag == "D") return date.getDate();
    if (tag == "Do") return ordinal(date.getDate());
    if (tag == "dddd") return days[date.getDay()];
  });
};
````

{{index "destructuring binding"}}

The interface of `ordinal` is a single function, whereas `date-names`
exports an object containing multiple things—the two we use are arrays
of names. Destructuring is extremely useful when creating bindings for
imported interfaces.

The module adds its interface function to `exports`, so that modules
that depend on it get access to it. We could use the module like this:

```
const {formatDate} = require("./format-date");

console.log(formatDate(new Date(2017, 9, 13),
                       "dddd the Do"));
// → Friday the 13th
```

{{index "require function", "CommonJS modules", "readFile function"}}

{{id require}}

The `require` function, in its most simple form, looks something like
this:

```{test: wrap, sandbox: require}
require.cache = Object.create(null);

function require(name) {
  if (!(name in require.cache)) {
    let code = readFile(name);
    let module = {exports: {}};
    require.cache[name] = module;
    let wrapper = Function("require, exports, module", code);
    wrapper(require, module.exports, module);
  }
  return require.cache[name].exports;
}
```

In the example, `readFile` is a made-up function that reads a file and
returns its contents as a string. Standard JavaScript provides no such
functionality—but different JavaScript environments, such as the
browser and Node.js, provide their own ways of accessing ((file))s.
The example just pretends that `readFile` exists.

{{index cache, "Function constructor"}}

To avoid loading the same module multiple times, `require` keeps a
store (cache) of already loaded modules. When called, it first checks
if the requested module has been loaded and, if not, loads it. This
involves reading the module's code, wrapping it in a function, and
calling it.

{{index "ordinal package", "exports object", "module object"}}

The ((interface)) of the `ordinal` package we saw before is not an
object, but a function. A quirk of the CommonJS modules is that,
though the module system will create an empty interface object for you
(bound to `exports`), you can replace that with any value by
overwriting `module.exports`. This is done by many modules to export a
single value instead of an interface object.

By defining `require`, `exports`, and `module` as ((parameter))s for
the generated wrapper function (and passing the appropriate values
when calling it), the loader makes sure that these bindings are
available in the ((scope)) that the module's code runs in.

{{index resolution, "relative path"}}

The way the string given to `require` is translated to an actual file
name or web address differs in different systems. When it starts with
`"./"` or `"../"`, it is generally interpreted as relative to the
current module's file name. So `"./format-date"` would be the file
named `format-date.js` in the same directory.

When it isn't a relative name, we'll be interpreting the string as the
name of an NPM module in this book. We'll go into more detail on how
to install and use NPM modules in [Chapter ?](node).

{{index "ini package"}}

Now, instead of writing our own INI file parser, we can use one from
((NPM)):

```
const {parse} = require("ini");

console.log(parse("x = 10\ny = 20"));
// → {x: "10", y: "20"}
```

## ECMAScript modules

((CommonJS modules)) work quite well, and in combination with NPM they
have allowed the JavaScript community to start sharing code on a large
scale.

{{index "exports object", linter}}

But they remain a bit of a duct-tape ((hack)). The ((notation)) is
slightly awkward—the things you add to `exports` are not available in
the local ((scope)), and it can be hard to automatically determine
which things are imported where, for example to automatically check
whether all the imported items actually exist in the dependency
modules.

{{index "import keyword", dependency, "ES modules"}}

This is why the JavaScript standard from 2015 introduces its own,
different module system. These are usually called _((ES modules))_,
where "ES" stands for ((ECMAScript)). The main concepts of
dependencies and interfaces remain the same, but the details differ.
For one thing, the notation is now integrated into the language.
Instead of calling a function to access a dependency, you use a
special `import` keyword.

```
import ordinal from "ordinal";
import {days, months} from "date-names";

export function formatDate(date, format) { /* ... */ }
```

{{index "export keyword", "formatDate module"}}

Similarly, the `export` keyword is used to export things. It may
appear in front of a function, class, or binding definition (`let`,
`const`, or `var`).

An ES module's interface is not a single value, but a set of named
((binding))s. The above module binds `formatDate` to a function.

{{index "default export"}}

When there is a binding named `default`, it is treated as the module's
main exported value, and if you import a module like `ordinal` in the
example, without braces around the binding name, you get its `default`
binding. Such modules can still export other bindings under different
names alongside their `default` export.

To create a default export, you write `export default` before an
expression, a function declaration, or a class declaration.

```
export default ["Winter", "Spring", "Summer", "Autumn"];
```

It is possible to rename imported binding using the word `as`.

```
import {days as dayNames} from "date-names";

console.log(dayNames.length);
// → 7
```

At the time of writing, the JavaScript community is in the process of
adopting this module style. But this has been a slow process. It took
a few years, after the format was specified, for browsers and Node.js
to start supporting it. And though they mostly support it now, this
support still has issues, and no convention has been developed on how
to, for example, distribute such modules through ((NPM)).

That being said, many projects are written using ES modules, and then
automatically converted to some other format when published. We are in
a transitional period in which two different module systems are used
side-by-side, and it is useful to be able to read and write code in
either of them.

## Module design

{{index [module, design], interface, "code structure"}}

Structuring programs is one of the subtler aspects of programming. Any
nontrivial piece of functionality can be modeled in various ways.
Finding a way that works well requires insight and foresight.

Good program design is subjective—there are trade-offs involved, and
matters of taste. The best way to learn the value of well structured
design is to read or work on a lot of programs and notice what works
and what doesn't. Don't assume that a painful mess is "just the way it
is". You can improve the structure of almost everything by putting
more thought into it.

One aspect of module design is ease of use. If you are designing
something that is intented to be used by multiple people—or even by
yourself, in three months when you no longer remember the specifics of
what you made—it is helpful if your ((interface)) is simple and
predictable.

{{index "ini package", JSON}}

That may mean following existing conventions. A good example is the
`ini` package. This module imitates the standard `JSON` object by
providing `parse` and `stringify` (to write an INI file) functions,
and, like `JSON`, converts between strings and plain objects. So the
interface is small and familiar, and after I've used it once, I'm
likely to remember how to use the module without looking it up.

{{index "side effect", "hard disk", composability}}

Even if there's no standard function or widely used package to
imitate, you can keep your modules predictable by using simple ((data
structure))s and doing a single, focused thing. Many of the INI file
parsing modules on NPM provide a function that directly reads such a
file from the hard disk and parses it, for example. This makes it
impossible to use such modules in the browser, where we don't have
direct file system access, and adds complexity that would have been
better addressed by _composing_ the module with some file-reading
function.

{{index "pure function"}}

Which points at another helpful aspect of module design—the ease with
which something can be composed with other code. Focused modules that
compute values are applicable in a wider range of programs than bigger
modules that perform complicated actions with side effects. An INI
file reader that insists on reading the file from disk is useless in a
scenario where the file's content comes from some other source.

{{index "object-oriented programming"}}

Relatedly, stateful objects are sometimes useful or even necessary,
but as a means of getting something done that could be a function,
they tend to get in the way. Several of the INI file readers on NPM
provide an interface style that require you to first create an object,
then load the file into your object, and finally use specialized
methods to get at the results. This type of thing is common in the
object-oriented tradition, and it's terribly awkward. Instead of
making a single function call and moving on, you have to perform the
ritual of moving your object through various states. And because the
data is now wrapped in a specialized object type, all code that
interacts with it has to know about that type, creating unnecessary
entanglement.

Often defining new data structures can't be avoided—only a few very
basic ones are provided by the language standard, and many types of
data have to be more complex than an ((array)) or a map. But when an
array suffices, use an array.

An example of a slightly more complex data structure is the graph from
[Chapter ?](robot). There is no single obvious way to represent a
((graph)) in JavaScript. In that chapter, we used an object whose
properties hold arrays of strings—the other nodes reachable from that
node.

There are several different path-finding packages on ((NPM)), but none
of them use this graph format. They usually allow the graph's edges to
have a weight, the cost or distance associated with it, which isn't
possible in our representation.

{{index "Dijkstra, Edsger", pathfinding, "Dijkstra's algorithm", "dijkstrajs package"}}

For example, there's the `dijkstrajs` package. A well-known approach
to path finding, quite similar to our `findRoute` function, is called
"Dijkstra's algorithm", after the person who first wrote it down. The
`js` suffix is often added to package names to indicate the fact that
they are written in JavaScript. This `dijkstrajs` package uses a graph
format similar to ours, but instead of arrays, it uses objects whose
property values are numbers—the weights of the edges.

So if we wanted to use that package, we'd have to make sure that our
graph was stored in the format it expects.

```
const {find_path} = require("dijkstrajs");

let graph = {};
for (let node of Object.keys(roadGraph)) {
  let edges = graph[node] = {};
  for (let dest of roadGraph[node]) {
    edges[dest] = 1;
  }
}

console.log(find_path(graph, "Post Office", "Cabin"));
// → ["Post Office", "Alice's House", "Cabin"]
```

This can be a barrier to composition—if various packages are using
different data formats to describe similar things, it is difficult to
combine them. Therefore, if you want to design for composability, find
out what ((data structure))s other people are using, and when
possible, follow their example.

## Summary

Modules provide structure to bigger programs by separating the code
into pieces with clear interfaces and dependencies. The interface is
the part of the module that's visible from other modules, and the
dependencies are the other modules that it makes use of.

Because JavaScript historically did not provide a module system, the
CommonJS system was built on top of it. But then, recently, it did get
a built-in system, which now coexist uneasily with the CommonJS
system.

NPM is a repository of JavaScript packages. A package acts like a
module that can be distributed separately. You can get all kinds of
useful (and useless) packages from NPM.

## Exercises

### A modular robot

{{index "modular robot (exercise)", module, robot, NPM}}

These are the bindings that the project from [Chapter ?](robot)
creates:

```{type: "text/plain"}
roads
buildGraph
roadGraph
VillageState
runRobot
randomPick
randomRobot
mailRoute
routeRobot
findRoute
goalOrientedRobot
```

If you were to write that project as a modular program, what modules
would you create? Which module would depend on which other module, and
what would their interfaces look like?

Which pieces are likely to be available pre-written on NPM? Would you
prefer to use an NPM package or to write them yourself?

{{hint

{{index "modular robot (exercise)"}}

Here's what I would have done (but again, there is no single _right_
way to design a given module):

{{index "dijkstrajs package"}}

The code used to build the road graph lives in the `graph` module.
Because I'd rather use `dijkstrajs` from NPM than our own path-finding
code, we'll make this build the kind of graph data that `dijkstajs`
expects. This module exports a single function, `buildGraph`. I'd have
`buildGraph` accept an array of two-element arrays, rather than
strings containing dashes, to make the module less dependent on the
input format.

The `roads` module contains the raw road data (the `roads` array) and
the `roadGraph` binding. This module depends on `./graph` and exports
the road graph.

{{index "random-item package"}}

The `VillageState` class lives in the `state` module. It depends on
the `./roads` module, because it needs to be able to verify that a
given road exists. It also needs `randomPick`. Since that is a
three-line function, we could just put it into the `state` module as
an internal helper function. But `randomRobot` needs it too. So we'd
have to either duplicate it, or put it into its own module. Since this
function happens to exists on NPM in the `random-item` package, a good
solution is to just make both modules depend on that. We can add the
`runRobot` function to this module as well, since it's small and
closely related to state management. The module exports both the
`VillageState` class and the `runRobot` function.

Finally, the robots, along with the values they depend on such as
`mailRoute`, could go into an `example-robots` module, which depends
on `./roads` and exports the robot functions. To make it possible for
the `goalOrientedRobot` to do route-finding, this module also depends
on `dijkstrajs`.

By offloading some work to ((NPM)) modules, the code became a little
smaller. Each individual module does something rather simple, and can
be read on its own. Dividing code into modules also often suggests
further improvements to the program's design. In this case, it seems a
little odd that the `VillageState` and the robots depend on a specific
road graph. It might be a better idea to make the graph an argument to
the state's constructor and to make the robots read it from the state
object—this reduces dependencies (which is always good) and makes it
possible to run simulations on different maps (which is even better).

Is it a good idea to use NPM modules for things that we could have
written ourselves? In principle, yes—for nontrivial things like the
pathfinding function you are likely to make mistakes and waste time
writing them yourself. For tiny functions like `random-item`, writing
them yourself is easy enough. But adding them wherever you need them
does tend to muddle up your modules a little.

However, you should also not underestimate the work involved in
_finding_ an appropriate NPM package. And even if you find one, it
might not work well, or be missing some feature that you need. On top
of that, depending on NPM packages means you have to make sure they
are installed, you have to distributing them with your program, and
you might have to periodically upgrade them.

So again, this is a trade-off, and you can decide either way depending
on how much the packages help you.

hint}}

### Roads module

{{index "roads module (exercise)"}}

Write a ((CommonJS module)), based on the example from [Chapter
?](robot), which contains the array of roads and exports the graph
data structure representing them as `roadGraph`. It should depend on a
module `./graph`, which exports a function `buildGraph` that is used
to build the graph. This function expects an array of two-element
arrays (the start and end points of the roads).

{{if interactive

```{test: no}
// Add dependencies and exports

const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];
```

if}}

{{hint

{{index "roads module (exercise)", "destructuring binding", "exports object"}}

Since this is a ((CommonJS module)), you have to use `require` to
import the graph module. That was described as exporting a
`buildGraph` function, which you can pick out of its interface object
with a destructuring `const` declaration.

To export `roadGraph`, you add a property to the `exports` object.
Because that takes a data structure that doesn't precisely match
`roads`, you must move the splitting of the road strings into your
module, and pass the result to `roadGraph`.

hint}}

### Circular dependencies

{{index dependency, "circular dependency", "require function"}}

A circular dependency is a situation where module A depends on B, and
B also, directly or indirectly, depends on A. Many module systems
simply forbid this because, whichever order you choose for loading
such modules, you cannot make sure that each module's dependencies
have been loaded before it runs.

((CommonJS modules)) allow a limited form of cyclic dependencies. As
long as the modules do not replace their default `exports` object, and
don't access each other's interface until after they finish loading,
cyclic dependencies are okay.

The `require` function given [earlier in this
chapter](modules#require) supports this type of dependency cycles. Can
you see how it handles them? What would go wrong when a module in a
cycle _does_ replace its default `exports` object?

{{hint

{{index overriding, "circular dependency", "exports object"}}

The trick is that `require` adds modules to its cache _before_ it
starts loading the module. That way, if any `require` call from inside
the module tries to load it again, it is already known, and the
current interface will be returned, rather than trying to load the
module again (which would eventually overflow the stack).

If a module overwrites its `module.exports` value, any other module
that has received its interface value before it finished loading will
have gotten hold of the default interface object (which is likely
empty), rather than the intended interface value.

hint}}
