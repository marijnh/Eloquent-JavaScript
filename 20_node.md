{{meta {chap_num: 20, prev_link: 19_paint, next_link: 21_skillsharing, code_links: "[\"code/file_server.js\", \"code/file_server_promises.js\"]"}}}

# Node.js

{{quote {author: "Master Yuan-Ma", title: "The Book of Programming", chapter: true}

A student asked ‘The programmers of old used only simple machines and
no programming languages, yet they made beautiful programs. Why do we
use complicated machines and programming languages?’. Fu-Tzu replied
‘The builders of old used only sticks and clay, yet they made
beautiful huts.’

quote}}

{{index "command line", "Yuan-Ma", "Book of Programming"}}

So far, you have learned the JavaScript language and used it within a
single environment: the browser. This chapter and the [next
one](skillsharing) will briefly introduce you to
((Node.js)), a program that allows you to apply your JavaScript skills
outside of the browser. With it, you can build anything from simple
command-line tools to dynamic HTTP ((server))s.

These chapters aim to teach you the important ideas that Node.js
builds on and to give you enough information to write some useful
programs for it. They do not try to be a complete, or even a thorough,
treatment of Node.

{{if interactive

Whereas you could run the code in previous chapters directly on these
pages, since it was either raw JavaScript or written for the browser,
the code samples in this chapter are written for Node and won't run
in the browser.

if}}

If you want to follow along and run the code in this chapter, start by
going to http://nodejs.org[_nodejs.org_] and following the
installation instructions for your operating system. Also refer to
that website for further ((documentation)) about Node and its built-in
((module))s.

## Background

{{index responsiveness, input}}

One of the more difficult problems with
writing systems that communicate over the ((network)) is managing input
and ((output))—that is, the reading and writing of data to and from
the network, the ((hard drive)), and other such devices. Moving data
around takes time, and ((scheduling)) it cleverly can make a big
difference in how quickly a system responds to the user or to network
requests.

The traditional way to handle input and output is to have a function, such as
`readFile`, start reading a file and return only when the
file has been fully read. This is called _((synchronous I/O))_ (I/O
stands for input/output).

{{index "asynchronous I/O", "asynchronous programming", "callback function"}}

Node was initially conceived for the purpose of making
_asynchronous_ I/O easy and convenient. We have seen asynchronous
interfaces before, such as a browser's `XMLHttpRequest` object,
discussed in [Chapter ?](http#xmlhttprequest). An asynchronous
interface allows the script to continue running while it does its
work and calls a callback function when it's done. This is the way
Node does all its I/O.

{{index "programming language", "Node.js", standard}}

JavaScript lends
itself well to a system like Node. It is one of the few programming
languages that does not have a built-in way to do I/O. Thus, JavaScript could
be fit onto Node's rather eccentric approach to I/O without ending up
with two inconsistent interfaces. In 2009, when Node was being
designed, people were already doing callback-based I/O in the browser,
so the ((community)) around the language was used to an ((asynchronous
programming)) style.

## The node command

{{index "node program"}}

When ((Node.js)) is installed on a system, it
provides a program called `node`, which is used to run JavaScript
files. Say you have a file `hello.js`, containing this code:

```
var message = "Hello world";
console.log(message);
```

You can then run `node` from the ((command line)) like this to execute
the program:

```{lang: null}
$ node hello.js
Hello world
```

{{index "console.log"}}

The `console.log` method in Node does something
similar to what it does in the browser. It prints out a piece of text.
But in Node, the text will go to the process’ ((standard output))
stream, rather than to a browser's ((JavaScript console)).

{{index "node program", "read-eval-print loop"}}

If you run `node` without
giving it a file, it provides you with a prompt at which you can type
JavaScript code and immediately see the result.

```{lang: null}
$ node
> 1 + 1
2
> [-1, -2, -3].map(Math.abs)
[1, 2, 3]
> process.exit(0)
$
```

{{index "process object", "global scope", [variable, global], "exit method", "status code"}}

The `process` variable, just like the
`console` variable, is available globally in Node. It provides various
ways to inspect and manipulate the current program. The `exit` method
ends the process and can be given an exit status code, which tells
the program that started `node` (in this case, the command-line shell)
whether the program completed successfully (code zero) or encountered
an error (any other code).

{{index "command line", "argv property"}}

To find the command-line arguments given to
your script, you can read `process.argv`, which is an array of
strings. Note that it also includes the name of the `node` command
and your script name, so the actual arguments start at index 2. If
`showargv.js` simply contains the statement
`console.log(process.argv)`, you could run it like this:

```{lang: null}
$ node showargv.js one --and two
["node", "/home/marijn/showargv.js", "one", "--and", "two"]
```

{{index [variable, global]}}

All the ((standard)) JavaScript global variables,
such as `Array`, `Math`, and `JSON`, are also present in Node's
environment. Browser-related functionality, such as `document` and
`alert`, is absent.

{{index "global object", "global scope", window}}

The global scope
object, which is called `window` in the browser, has the more sensible
name `global` in Node.

## Modules

{{index "Node.js", "global scope", "module loader"}}

Beyond the few
variables I mentioned, such as `console` and `process`, Node puts 
little functionality in the global scope. If you want to access other
built-in functionality, you have to ask the module system for it.

{{index library, "require function"}}

The ((CommonJS)) module system,
based on the `require` function, was described in
[Chapter ?](modules#commonjs). This system is built into
Node and is used to load anything from built-in ((module))s to
downloaded libraries to files that are part of your own program.

{{index [path, "file system"], "relative path", resolution}}

When `require` is called, Node has
to resolve the given string to an actual ((file)) to load. Pathnames
that start with `"/"`, `"./"`, or `"../"` are resolved relative to the
current module's path, where `"./"` stands for the current
directory, `"../"` for one directory up, and `"/"` for the root of the
file system. So if you ask for `"./world/world"` from the file
`/home/marijn/elife/run.js`, Node will try to load the file
`/home/marijn/elife/world/world.js`. The `.js` extension may be
omitted.

{{index "node_modules directory"}}

When a string that does not look like a
relative or absolute path is given to `require`, it is assumed to
refer to either a built-in ((module)) or a module installed in a
`node_modules` directory. For example, `require("fs")` will give you
Node's built-in file system module, and `require("elife")` will try to
load the library found in `node_modules/elife/`. A common way to
install such libraries is by using ((NPM)), which I will discuss in a
moment.

{{index "require function", "Node.js", "garble example"}}

To illustrate
the use of `require`, let's set up a simple project consisting of two
files. The first one is called `main.js`, which defines a script that
can be called from the ((command line)) to garble a string.

```
var garble = require("./garble");

// Index 2 holds the first actual command-line argument
var argument = process.argv[2];

console.log(garble(argument));
```

{{index reuse}}

The file `garble.js` defines a library for garbling strings,
which can be used both by the command-line tool defined earlier and by
other scripts that need direct access to a garbling function.

```
module.exports = function(string) {
  return string.split("").map(function(ch) {
    return String.fromCharCode(ch.charCodeAt(0) + 5);
  }).join("");
};
```

{{index "exports object", CommonJS}}

Remember that replacing
`module.exports`, rather than adding properties to it, allows us to
export a specific value from a module. In this case, we make the
result of requiring our `garble` file the garbling function itself.

{{index Unicode, "split method", "map method", "join method"}}

The
function splits the string it is given into single characters by
splitting on the empty string and then replaces each character with
the character whose code is five points higher. Finally, it joins the
result back into a string.

We can now call our tool like this:

```{lang: null}
$ node main.js JavaScript
Of{fXhwnuy
```

## Installing with NPM

{{index NPM, "Node.js", "npm program", library}}

NPM, which was
briefly discussed in [Chapter ?](modules#modules_npm), is
an online repository of JavaScript ((module))s, many of which are
specifically written for Node. When you install Node on your computer,
you also get a program called `npm`, which provides a convenient
interface to this repository.

{{index "figlet module"}}

For example, one module you will find on NPM is
`figlet`, which can convert text into _((ASCII art))_—drawings made
out of text characters. The following  transcript shows how to ((install))
and use it:

```{lang: null}
$ npm install figlet
npm GET https://registry.npmjs.org/figlet
npm 200 https://registry.npmjs.org/figlet
npm GET https://registry.npmjs.org/figlet/-/figlet-1.0.9.tgz
npm 200 https://registry.npmjs.org/figlet/-/figlet-1.0.9.tgz
figlet@1.0.9 node_modules/figlet
$ node
> var figlet = require("figlet");
> figlet.text("Hello world!", function(error, data) {
    if (error)
      console.error(error);
    else
      console.log(data);
  });
  _   _      _ _                            _     _ _ 
 | | | | __| | | ___   __      _____  _ __| | __| | |
 | |_| |/ _ \ | |/ _ \  \ \ /\ / / _ \| '__| |/ _` | |
 |  _  |  __/ | | (_) |  \ V  V / (_) | |  | | (_| |_|
 |_| |_|\___|_|_|\___/    \_/\_/ \___/|_|  |_|\_,_(_)
```

{{index "require function", "node_modules directory", "npm program"}}

After running `npm install`, ((NPM)) will have created a
directory called `node_modules`. Inside that directory will be a `figlet`
directory, which contains the ((library)). When we run `node` and call
`require("figlet")`, this library is loaded, and we can call its
`text` method to draw some big letters.

{{index "error handling", "return value"}}

Somewhat unexpectedly perhaps,
instead of simply returning the string that makes up the big letters,
`figlet.text` takes a ((callback function)) that it passes its result
to. It also passes the callback another argument, `error`, which will
hold an error object when something goes wrong or null when
everything is all right.

{{index "file system", "asynchronous programming", "Node.js"}}

This is a
common pattern in Node code. Rendering something with `figlet`
requires the library to read a file that contains the letter shapes.
Reading that file from disk is an asynchronous operation in
Node, so `figlet.text` can't immediately return its
result. Asynchronicity is infectious, in a way—every function that
calls an asynchronous function must itself become asynchronous.

{{index dependency, publishing, "package.json file", "npm program"}}

There is much more to ((NPM)) than `npm install`. It reads
`package.json` files, which contain ((JSON))-encoded information about
a program or library, such as which other libraries it depends on.
Doing `npm install` in a directory that contains such a file will
automatically install all dependencies, as well as _their_
dependencies. The `npm` tool is also used to publish libraries to
NPM's online repository of packages so that other people can find,
download, and use them.

{{index library}}

This book won't delve further into the details of ((NPM))
usage. Refer to http://npmjs.org[_npmjs.org_] for further
documentation and for an easy way to search for libraries.

## The file system module

{{index directory, "fs module", "Node.js"}}

One of the most commonly
used built-in modules that comes with Node is the `"fs"` module, which
stands for _((file system))_. This module provides functions for
working with ((file))s and directories.

{{index "readFile function", "callback function"}}

For example, there is a
function called `readFile`, which reads a file and then calls a
callback with the file's contents.

```
var fs = require("fs");
fs.readFile("file.txt", "utf8", function(error, text) {
  if (error)
    throw error;
  console.log("The file contained:", text);
});
```

{{index "Buffer type"}}

The second argument to
`readFile` indicates the _((character encoding))_ used to decode the
file into a string. There are several ways in which ((text)) can be
encoded to ((binary data)), but most modern systems use ((UTF-8)) to
encode text, so unless you have reasons to believe another encoding is
used, passing `"utf8"` when reading a text file is a safe bet. If you
do not pass an encoding, Node will assume you are interested in the
binary data and will give you a `Buffer` object instead of a
string. This is an ((array-like object)) that contains numbers
representing the bytes in the files.

```
var fs = require("fs");
fs.readFile("file.txt", function(error, buffer) {
  if (error)
    throw error;
  console.log("The file contained", buffer.length, "bytes.",
              "The first byte is:", buffer[0]);
});
```

{{index "writeFile function", "file system"}}

A similar function,
`writeFile`, is used to write a ((file)) to disk.

```
var fs = require("fs");
fs.writeFile("graffiti.txt", "Node was here", function(err) {
  if (err)
    console.log("Failed to write file:", err);
  else
    console.log("File written.");
});
```

{{index "Buffer type", "character encoding"}}

Here, it was not necessary to
specify the encoding since `writeFile` will assume that if it is
given a string to write, rather than a `Buffer` object, it should
write it out as text using its default character encoding, which is
((UTF-8)).

{{index "fs module", "readdir function", "stat function", "rename function", "unlink function"}}

The `"fs"` module contains many other
useful functions: `readdir` will return the ((file))s
in a ((directory)) as an array of strings, `stat` will retrieve
information about a file, `rename` will rename a file, `unlink` will
remove one, and so on. See the documentation at
http://nodejs.org[_nodejs.org_] for specifics.

{{index "synchronous I/O", "fs module", "readFileSync function"}}

Many of
the functions in `"fs"` come in both synchronous and asynchronous variants. 
For example, there is a synchronous version of
`readFile` called `readFileSync`.

```
var fs = require("fs");
console.log(fs.readFileSync("file.txt", "utf8"));
```

{{index "synchronous I/O", optimization, performance, blocking}}

Synchronous functions require
less ceremony to use and can be useful in simple scripts, where the
extra speed provided by asynchronous I/O is irrelevant. But note that
while such a synchronous operation is being performed, your program
will be stopped entirely. If it should be responding to the user or to
other machines on the network, being stuck on synchronous I/O might
produce annoying delays.

## The HTTP module

{{index "Node.js", "http module"}}

Another central module is called
`"http"`. It provides functionality for running ((HTTP)) ((server))s
and making HTTP ((request))s.

{{index "listening (TCP)", "listen method", "createServer function"}}

This is all it takes to start a simple HTTP server:

```
var http = require("http");
var server = http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<h1>Hello!</h1><p>You asked for <code>" +
                 request.url + "</code></p>");
  response.end();
});
server.listen(8000);
```

{{index port, localhost}}

If you run this script on your own machine,
you can point your web browser at
http://localhost:8000/hello[_http://localhost:8000/hello_] to make a
request to your server. It will respond with a small HTML page.

{{index "createServer function", HTTP}}

The function passed as an argument
to `createServer` is called every time a client tries to connect to
the server. The `request` and `response` variables are objects
representing the incoming and outgoing data. The first contains
information about the ((request)), such as its `url` property, which
tells us to what URL the request was made.

{{index "200 (HTTP status code)", "Content-Type header", "writeHead method"}}

To send something back, you call methods on the `response`
object. The first, `writeHead`, will write out the ((response))
((header))s (see [Chapter ?](http#headers)). You give it
the status code (200 for “OK” in this case) and an object that
contains header values. Here we tell the client that we will be
sending back an HTML document.

{{index "writable stream", "body (HTTP)", stream, "write method", "end method"}}

Next, the actual response body (the document
itself) is sent with `response.write`. You are allowed to call this
method multiple times if you want to send the response piece by piece,
possibly streaming data to the client as it becomes available.
Finally, `response.end` signals the end of the response.

{{index "listen method"}}

The call to `server.listen` causes the ((server))
to start waiting for connections on ((port)) 8000. This is the reason
you have to connect to _localhost:8000_, rather than just _localhost_
(which would use the default port, 80), to speak to this server.

{{index "Node.js", kill}}

To stop running a Node script like this, which
doesn't finish automatically because it is waiting for further events
(in this case, network connections), press Ctrl-C.

A real web ((server)) usually does more than the one in the previous
example—it looks at the request's
((method)) (the `method` property) to see what action the client is
trying to perform and at the request's ((URL)) to find out which
resource this action is being performed on. You'll see a more advanced
server [later in this chapter](node#file_server).

{{index "http module", "request function"}}

To act as an ((HTTP))
_((client))_, we can use the `request` function in the `"http"`
module.

```
var http = require("http");
var request = http.request({
  hostname: "eloquentjavascript.net",
  path: "/20_node.html",
  method: "GET",
  headers: {Accept: "text/html"}
}, function(response) {
  console.log("Server responded with status code",
              response.statusCode);
});
request.end();
```

{{index "Node.js", "callback function", "readable stream"}}

The first
argument to `request` configures the request, telling Node what server
to talk to, what path to request from that server, which method to
use, and so on. The second argument is the function that should be
called when a response comes in. It is given an object that allows us
to inspect the response, for example to find out its status code.

{{index "GET method", "write method", "end method", "writable stream", "request function"}}

Just like the `response` object 
we saw in the server, the object returned by `request` allows us to
((stream)) data into the ((request)) with the `write` method and
finish the request with the `end` method. The example does not use
`write` because `GET` requests should not contain data
in their request body.

{{index HTTPS, "https module", "request function"}}

To make requests to secure HTTP (HTTPS)
URLs, Node provides a package called `https`, which contains
its own `request` function, similar to `http.request`.

## Streams

{{index "Node.js", "write method", "end method", "Buffer type", stream, "writable stream"}}

We have seen two examples of
writable streams in the HTTP examples—namely, the response object that
the server could write to and the request object that was returned
from `http.request`.

{{index "callback function", "asynchronous programming"}}

Writable streams are a widely used concept in Node
interfaces. All writable streams have a `write` method, which can be
passed a string or a `Buffer` object. Their `end` method closes the
stream and, if given an argument, will also write out a piece of data
before it does so. Both of these
methods can also be given a callback as an additional argument, which
they will call when the writing to or closing of the stream has
finished.

{{index "createWriteStream function", "writeFile function"}}

It is possible
to create a writable stream that points at a ((file)) with the
`fs.createWriteStream` function. Then you can use the `write` method on
the resulting object to write the file one piece at a time, rather
than in one shot as with `fs.writeFile`.

{{index "createServer function", "request function", "event handling", "readable stream"}}

Readable ((stream))s are a little more
involved. Both the `request` variable that was passed to the HTTP
server's callback function and the `response` variable passed to the
HTTP client are readable streams. (A server reads requests and then
writes responses, whereas a client first writes a request and then
reads a response.) Reading from a stream is done using event handlers,
rather than methods.

{{index "on method", "addEventListener method"}}

Objects that emit events in
Node have a method called `on` that is similar to the
`addEventListener` method in the browser. You give it an event name
and then a function, and it will register that function to be called
whenever the given event occurs.

{{index "createReadStream function", "data event", "end event", "readable stream"}}

Readable ((stream))s have `"data"` and
`"end"` events. The first is fired every time some data comes in, and
the second is called whenever the stream is at its end. This model is
most suited for “streaming” data, which can be immediately processed,
even when the whole document isn't available yet. A file can be read
as a readable stream by using the `fs.createReadStream` function.

{{index "upcasing server example", capitalization, "toUpperCase method"}}

The following code creates a ((server)) that reads request
bodies and streams them back to the client as all-uppercase text:

```
var http = require("http");
http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  request.on("data", function(chunk) {
    response.write(chunk.toString().toUpperCase());
  });
  request.on("end", function() {
    response.end();
  });
}).listen(8000);
```

{{index "Buffer type", "toString method"}}

The `chunk` variable passed to
the data handler will be a binary `Buffer`, which we can convert to a
string by calling `toString` on it, which will decode it using the
default encoding (UTF-8).

The following piece of code, if run while the uppercasing server is
running, will send a request to that server and write out the response it gets:

```{test: no}
var http = require("http");
var request = http.request({
  hostname: "localhost",
  port: 8000,
  method: "POST"
}, function(response) {
  response.on("data", function(chunk) {
    process.stdout.write(chunk.toString());
  });
});
request.end("Hello server");
```

{{index "stdout property", "standard output", "writable stream", "console.log"}}

The example writes to `process.stdout` (the
process’ standard output, as a writable stream) instead of using
`console.log`. We can't use `console.log` because it adds an extra
newline character after each piece of text that it writes, which isn't
appropriate here.

{{id file_server}}
## A simple file server

{{index "file server example", "Node.js"}}

Let's combine our newfound
knowledge about ((HTTP)) ((server))s and talking to the ((file
system)) and create a bridge between them: an HTTP server that allows
((remote access)) to a file system. Such a server has many uses. It
allows web applications to store and share data or give a group of
people shared access to a bunch of files.

{{index [path, URL], "GET method", "PUT method", "DELETE method"}}

When 
we treat ((file))s as HTTP ((resource))s, the HTTP
methods `GET`, `PUT`, and `DELETE` can be used to read, write, and
delete the files, respectively. We will interpret the path in the request
as the path of the file that the request refers to.

{{index [path, "file system"], "relative path"}}

We probably don't want to share our whole
file system, so we'll interpret these paths as starting in the
server's working ((directory)), which is the directory in which it was
started. If I ran the server from `/home/marijn/public/` (or
`C:\Users\marijn\public\` on Windows), then a request for `/file.txt`
should refer to `/home/marijn/public/file.txt` (or
`C:\Users\marijn\public\file.txt`).

{{index "file server example", "Node.js", "methods object"}}

We'll build
the program piece by piece, using an object called `methods` to store
the functions that handle the various HTTP methods.

```{includeCode: ">code/file_server.js"}
var http = require("http"), fs = require("fs");

var methods = Object.create(null);

http.createServer(function(request, response) {
  function respond(code, body, type) {
    if (!type) type = "text/plain";
    response.writeHead(code, {"Content-Type": type});
    if (body && body.pipe)
      body.pipe(response);
    else
      response.end(body);
  }
  if (request.method in methods)
    methods[request.method](urlToPath(request.url),
                            respond, request);
  else
    respond(405, "Method " + request.method +
            " not allowed.");
}).listen(8000);
```

{{index "405 (HTTP status code)"}}

This starts a server that just returns 405
error responses, which is the code used to indicate that a given
method isn't handled by the server.

{{index "end method", "Content-Type header", response, "pipe method", stream}}

The `respond` function is passed to the functions
that handle the various methods and acts as a callback to finish the
request. It takes an HTTP ((status code)), a body, and optionally a
content type as arguments. If the value passed as the body is a ((readable
stream)), it will have a `pipe` method, which is used to forward a
readable stream to a ((writable stream)). If not, it is assumed to be
either `null` (no body) or a string and is passed directly to the
response's `end` method.

{{index [path, URL], "urlToPath function", "url module", parsing, [escaping, "in URLs"], "decodeURIComponent function"}}

To get a path from the
((URL)) in the request, the `urlToPath` function uses Node's built-in
`"url"` module to parse the URL. It takes its pathname, which will be
something like `/file.txt`, decodes that to get rid of the `%20`-style
escape codes, and prefixes a single dot to produce a path relative to
the current directory.

```{includeCode: ">code/file_server.js"}
function urlToPath(url) {
  var path = require("url").parse(url).pathname;
  return "." + decodeURIComponent(path);
}
```

{{index security, [path, "file system"]}}

If you are worried about the security of the
`urlToPath` function, you are right. We will return to that in the
exercises.

{{index "file server example", "Node.js", "GET method"}}

We will set up
the `GET` method to return a list of ((file))s when reading a
((directory)) and to return the file's content when reading a regular file.

{{index "media type", "MIME type", "Content-Type header", "mime module"}}

One tricky question is what kind of `Content-Type` header we
should add when returning a file's content. Since these files could be
anything, our server can't simply return the same type for all of
them. But ((NPM)) can help with that. The `mime` package (content type
indicators like `text/plain` are also called _MIME types_) knows the
correct type for a huge number of ((file extension))s.

{{index "require function", "npm program"}}

If you run the following `npm` command in the directory
where the server script lives, you'll be able to use `require("mime")` to
get access to the library:

```{lang: null}
$ npm install mime@1.4.0
npm http GET https://registry.npmjs.org/mime
npm http 304 https://registry.npmjs.org/mime
mime@1.4.0 node_modules/mime
```

{{index "404 (HTTP status code)", "stat function"}}

When a requested file
does not exist, the correct HTTP error code to return is 404. We will
use `fs.stat`, which looks up information on a file, to find out both
whether the ((file)) exists and whether it is a ((directory)).

```{includeCode: ">code/file_server.js"}
methods.GET = function(path, respond) {
  fs.stat(path, function(error, stats) {
    if (error && error.code == "ENOENT")
      respond(404, "File not found");
    else if (error)
      respond(500, error.toString());
    else if (stats.isDirectory())
      fs.readdir(path, function(error, files) {
        if (error)
          respond(500, error.toString());
        else
          respond(200, files.join("\n"));
      });
    else
      respond(200, fs.createReadStream(path),
              require("mime").lookup(path));
  });
};
```

{{index "createReadStream function", "asynchronous programming", "error handling", "ENOENT (status code)", "Error type", inheritance}}

Because it has to touch the disk and thus
might take a while, `fs.stat` is asynchronous. When the file does not
exist, `fs.stat` will pass an error object with a `code` property of
`"ENOENT"` to its callback. It would be nice if Node defined
different subtypes of `Error` for different types of error, but it
doesn't. Instead, it just puts obscure, ((Unix))-inspired codes in
there.

{{index "500 (HTTP status code)", "error handling", "error response"}}

We
are going to report any errors we didn't expect with status code 500,
which indicates that the problem exists in the server, as opposed to
codes starting with 4 (such as 404), which refer to bad requests. There
are some situations in which this is not entirely accurate, but for a
small example program like this, it will have to be good enough.

{{index "Stats type", "stat function"}}

The `stats` object returned by
`fs.stat` tells us a number of things about a ((file)), such as its
size (`size` property) and its ((modification date)) (`mtime`
property). Here we are interested in the question of whether it is a
((directory)) or a regular file, which the `isDirectory` method tells
us.

{{index "readdir function"}}

We use `fs.readdir` to read the
list of files in a ((directory)) and, in yet another callback, return
it to the user. For normal files, we create a readable stream with
`fs.createReadStream` and pass it to `respond`, along with the
content type that the `"mime"` module gives us for the file's name.

{{index "Node.js", "file server example", "DELETE method"}}

The code to
handle `DELETE` requests is slightly simpler.

```{includeCode: ">code/file_server.js"}
methods.DELETE = function(path, respond) {
  fs.stat(path, function(error, stats) {
    if (error && error.code == "ENOENT")
      respond(204);
    else if (error)
      respond(500, error.toString());
    else if (stats.isDirectory())
      fs.rmdir(path, respondErrorOrNothing(respond));
    else
      fs.unlink(path, respondErrorOrNothing(respond));
  });
};
```

{{index idempotency, "error response"}}

You may be wondering why trying
to delete a nonexistent file returns a 204 status, rather than an
error. When the file that is being deleted is not there, you could say
that the request's objective is already fulfilled. The ((HTTP))
standard encourages people to make requests _idempotent_, which means
that applying them multiple times does not produce a different result.

```{includeCode: ">code/file_server.js"}
function respondErrorOrNothing(respond) {
  return function(error) {
    if (error)
      respond(500, error.toString());
    else
      respond(204);
  };
}
```

{{index "204 (HTTP status code)", "body (HTTP)"}}

When an ((HTTP))
((response)) does not contain any data, the status code 204
 (“no content”) can be used to indicate this. Since we need to
provide callbacks that either report an error or return a 204 response
in a few different situations, I wrote a `respondErrorOrNothing`
function that creates such a callback.

{{index "file server example", "Node.js", "PUT method"}}

This is the
handler for `PUT` requests:

```{includeCode: ">code/file_server.js"}
methods.PUT = function(path, respond, request) {
  var outStream = fs.createWriteStream(path);
  outStream.on("error", function(error) {
    respond(500, error.toString());
  });
  outStream.on("finish", function() {
    respond(204);
  });
  request.pipe(outStream);
};
```

{{index overwriting, "204 (HTTP status code)", "error event", "finish event", "createWriteStream function", "pipe method", stream}}

Here, we don't need to check whether the file
exists—if it does, we'll just overwrite it. We again use `pipe` to
move data from a readable stream to a writable one, in this case from
the request to the file. If creating the stream fails, an `"error"`
event is raised for it, which we report in our response. When the data
is transferred successfully, `pipe` will close both streams, which
will cause a `"finish"` event to fire on the writable stream. When
that happens, we can report success to the client with a 204 response.

{{index download, "file server example", "Node.js"}}

The full script
for the server is available at
http://eloquentjavascript.net/code/file_server.js[_eloquentjavascript.net/code/file_server.js_].
You can download that and run it with Node to start your own file
server. And of course, you can modify and extend it to solve this
chapter's exercises or to experiment.

{{index "body (HTTP)", "curl program"}}

The command-line tool `curl`,
widely available on ((Unix))-like systems, can be used to make ((HTTP))
((request))s. The following session briefly tests our server. Note
that `-X` is used to set the request's ((method)) and `-d` is used to include
a request body.

```{lang: null}
$ curl http://localhost:8000/file.txt
File not found
$ curl -X PUT -d hello http://localhost:8000/file.txt
$ curl http://localhost:8000/file.txt
hello
$ curl -X DELETE http://localhost:8000/file.txt
$ curl http://localhost:8000/file.txt
File not found
```

The first request for `file.txt` fails since the file does not exist
yet. The `PUT` request creates the file, and behold, the next request
successfully retrieves it. After deleting it with a `DELETE` request,
the file is again missing.

## Error handling

{{index verbosity, "error handling"}}

In the code for the file server,
there are _six_ places where we are explicitly routing exceptions that
we don't know how to handle into ((error response))s. Because
((exception))s aren't automatically propagated to callbacks but
rather passed to them as arguments, they have to be handled explicitly
every time. This completely defeats the advantage of ((exception
handling)), namely, the ability to centralize the handling of
failure conditions.

{{index "Node.js", "stack trace", "throw keyword", "try keyword", "uncaught exception"}}

What happens when something actually
_throws_ an exception in this system? Since we are not using any `try`
blocks, the exception will propagate to the top of the call stack. In
Node, that aborts the program and writes information
about the exception (including a stack trace) to the program's
standard error stream.

{{index "callback function"}}

This means that our server will ((crash))
whenever a problem is encountered in the server's code itself, as
opposed to asynchronous problems, which will be passed as arguments to
the callbacks. If we wanted to handle all exceptions raised during the
handling of a request, to make sure we send a response, we would
have to add `try/catch` blocks to _every_ callback.

{{index "exception handling"}}

This is not workable. Many Node programs are
written to make as little use of exceptions as possible, with the
assumption that if an exception is raised, it is not something the
program can handle, and crashing is the right response.

{{index "denodeify function", "readFile function", "promise module", "error handling"}}

Another approach is to use ((promise))s,
which were introduced in [Chapter ?](http#promises). Those
catch exceptions raised by callback functions and propagate them as
failures. It is possible to load a promise library in Node and use
that to manage your asynchronous control. Few Node libraries
integrate promises, but it is often trivial to wrap them. The
excellent `"promise"` module from ((NPM)) contains a function called
`denodeify`, which takes an asynchronous function like `fs.readFile`
and converts it to a promise-returning function.

```
var Promise = require("promise");
var fs = require("fs");

var readFile = Promise.denodeify(fs.readFile);
readFile("file.txt", "utf8").then(function(content) {
  console.log("The file contained: " + content);
}, function(error) {
  console.log("Failed to read file: " + error);
});
```

{{index "error handling", "exception handling", "file server example"}}

For comparison, I've written another version of the file
server based on ((promise))s, which you can find at
http://eloquentjavascript.net/code/file_server_promises.js[_eloquentjavascript.net/code/file_server_promises.js_].
It is slightly cleaner because functions can now _return_ their
results, rather than having to call callbacks, and the routing of
exceptions is implicit, rather than explicit.

{{index "programming style"}}

I'll list a few lines from the promise-based file
server to illustrate the difference in the style of programming.

{{index chaining, "fsp object"}}

The `fsp` object that is used by this
code contains promise-style variants of a number of `fs` functions,
wrapped by `Promise.denodeify`. The object returned from the method handler,
with `code` and `body` properties, will become the final result of the
chain of ((promise))s, and it will be used to determine what kind of
((response)) to send to the client.

```{test: no}
methods.GET = function(path) {
  return inspectPath(path).then(function(stats) {
    if (!stats) // Does not exist
      return {code: 404, body: "File not found"};
    else if (stats.isDirectory())
      return fsp.readdir(path).then(function(files) {
        return {code: 200, body: files.join("\n")};
      });
    else
      return {code: 200,
              type: require("mime").lookup(path),
              body: fs.createReadStream(path)};
  });
};

function inspectPath(path) {
  return fsp.stat(path).then(null, function(error) {
    if (error.code == "ENOENT") return null;
    else throw error;
  });
}
```

{{index "500 (HTTP status code)", "stat function", "ENOENT (status code)", promise}}

The `inspectPath` function is a simple wrapper
around `fs.stat`, which handles the case where the file is not found.
In that case, we replace the failure with a success that yields `null`.
All other errors are allowed to propagate. When the promise
that is returned from these handlers fails, the HTTP server responds
with a 500 status code.

## Summary

{{index "Node.js"}}

Node is a nice, straightforward system that lets us run
JavaScript in a nonbrowser context. It was originally designed for
network tasks to play the role of a _node_ in a network. But it lends
itself to all kinds of scripting tasks, and if writing JavaScript is
something you enjoy, automating everyday tasks with Node works
wonderfully.

NPM provides libraries for everything you can think of (and quite a
few things you'd probably never think of), and it allows you to fetch and
install those libraries by running a simple command. Node also comes with a 
number of built-in modules, including the `"fs"` module, for working with 
the file system, and the `"http"` module, for running HTTP servers and making 
HTTP requests.

All input and output in Node is done asynchronously, unless you
explicitly use a synchronous variant of a function, such as
`fs.readFileSync`. You provide callback functions, and Node will call
them at the appropriate time, when the I/O you asked for has finished.

## Exercises

### Content negotiation, again

{{index "Accept header", "content negotiation (exercise)"}}

In
[Chapter ?](http#exercise_accept), the first exercise was
to make several requests to
http://eloquentjavascript.net/author[_eloquentjavascript.net/author_],
asking for different types of content by passing different `Accept`
headers.

{{index "request function", "http module", "MIME type"}}

Do this again,
using Node's `http.request` function. Ask for at least the media types
`text/plain`, `text/html`, and `application/json`. Remember that
headers to a request can be given as an object, in the `headers`
property of `http.request`’s first argument.

{{index output}}

Write out the content of the responses to each request.

{{hint

{{index "content negotiation (exercise)", "end method", "request function"}}

Don't forget to call the `end` method on the object
returned by `http.request` in order to actually fire off the request.

{{index concatenation, "callback function", "readStreamAsString function"}}

The ((response)) object passed to `http.request`’s callback
is a ((readable stream)). This means that it is not entirely trivial
to get the whole response body from it. The following utility
function reads a whole stream and calls a callback function with the
result, using the usual pattern of passing any errors it encounters as
the first argument to the callback:

```{lang: "text/javascript"}
function readStreamAsString(stream, callback) {
  var data = "";
  stream.on("data", function(chunk) {
    data += chunk.toString();
  });
  stream.on("end", function() {
    callback(null, data);
  });
  stream.on("error", function(error) {
    callback(error);
  });
}
```

hint}}

### Fixing a leak

{{index "file server example", leak}}

For easy remote access to some
files, I might get into the habit of having the
[file server](node#file_server) defined in this chapter
running on my machine, in the `/home/marijn/public` directory. Then,
one day, I find that someone has gained access to all the
((password))s I stored in my ((browser)).

What happened?

{{index "urlToPath function", "relative path"}}

If it isn't clear to you
yet, think back to the `urlToPath` function, defined like this:

```
function urlToPath(url) {
  var path = require("url").parse(url).pathname;
  return "." + decodeURIComponent(path);
}
```

{{index "fs module"}}

Now consider the fact that paths passed to the `"fs"`
functions can be relative—they may contain `"../"` to go up a
directory. What happens when a client sends requests to URLs like the
ones shown here?

```{lang: null}
http://myhostname:8000/../.config/config/google-chrome/Default/Web%20Data
http://myhostname:8000/../.ssh/id_dsa
http://myhostname:8000/../../../etc/passwd
```

{{index directory, "urlToPath function", "slash character", "backslash character"}}

Change `urlToPath` to fix this
problem. Take into account the fact that Node on ((Windows)) allows
both forward slashes and backslashes to separate directories.

{{index security}}

Also, meditate on the fact that as soon as you expose
some half-baked system on the ((Internet)), the ((bug))s in that
system might be used to do bad things to your machine.

{{hint

{{index "replace method", "file server example", leak, "period character", "slash character", "backslash character", "decodeURIComponent function"}}

It is enough to strip out
all occurrences of two dots that have a slash, a backslash, or the end
of the string on both sides. Using the `replace` method with a
((regular expression)) is the easiest way to do this. But since such
instances may overlap (as in `"/../../f"`), you may have to apply
`replace` multiple times, until the string no longer changes. Also
make sure you do the replace _after_ decoding the string, or it would
be possible to foil the check by encoding a dot or a slash.

{{index [path, "file system"], "slash character"}}

Another potentially
worrying case is when paths start with a slash, which are interpreted as
((absolute path))s. But because `urlToPath` puts a dot character in
front of the path, it is impossible to create requests that result in
such a path. Multiple slashes in a row, inside the path, are odd
but will be treated as a single slash by the file system.

hint}}

### Creating directories

{{index "file server example"}}

Though the `DELETE` method is wired up to
delete directories (using `fs.rmdir`), the file server currently does
not provide any way to _create_ a ((directory)).

{{index "MKCOL method"}}

Add support for a method `MKCOL`, which should
create a directory by calling `fs.mkdir`. `MKCOL` is not one of the
basic HTTP methods, but it does exist, for this same purpose, in the
_((WebDAV))_ standard, which specifies a set of extensions to ((HTTP)),
making it suitable for writing resources, not just reading them.

{{hint

{{index "file server example", "MKCOL method", "mkdir function", idempotency, "400 (HTTP status code)"}}

You can use
the function that implements the `DELETE` method as a blueprint for
the `MKCOL` method. When no file is found, try to create a directory with
`fs.mkdir`. When a directory exists at that path, you can return a 204
response so that directory creation requests are idempotent. If a
nondirectory file exists here, return an error code. The code 400 (“bad
request”) would be appropriate here.

hint}}

### A public space on the web

{{index "public space (exercise)", "file server example", "Content-Type header", website}}

Since the file server serves up any kind of
file and even includes the right `Content-Type` header, you can use
it to serve a website. Since it allows everybody to delete and replace
files, it would be an interesting kind of website: one that can be
modified, vandalized, and destroyed by everybody who takes the time to
create the right HTTP request. Still, it would be a website.

Write a basic ((HTML)) page that includes a simple JavaScript file.
Put the files in a directory served by the file server and open them in
your browser.

Next, as an advanced exercise or even a ((weekend project)), combine
all the knowledge you gained from this book to build a more
user-friendly interface for modifying the website from _inside_ the
website.

{{index XMLHttpRequest}}

Use an HTML ((form))
([Chapter ?](forms)) to edit the content of the
files that make up the website, allowing the user to update them on
the server by using HTTP requests as described in
[Chapter ?](http).

Start by making only a single file editable. Then make it so that the
user can select which file to edit. Use the fact that our file server
returns lists of files when reading a directory.

{{index overwriting}}

Don't work directly in the code on the file server,
since if you make a mistake you are likely to damage the files there.
Instead, keep your work outside of the publicly accessible directory
and copy it there when testing.

{{index "IP address"}}

If your computer is directly connected to the
((Internet)), without a ((firewall)), ((router)), or other interfering
device in between, you might be able to invite a friend to use your
website. To check, go to http://www.whatismyip.com/[_whatismyip.com_],
copy the IP address it gives you into the address bar of your browser,
and add `:8000` after it to select the right port. If that brings you
to your site, it is online for everybody to see.

{{hint

{{index "file server example", "textarea (HTML tag)", XMLHttpRequest, "relative path", "public space (exercise)"}}

You can create a `<textarea>` element to hold the content
of the file that is being edited. A `GET` request, using
`XMLHttpRequest`, can be used to get the current content of the file.
You can use relative URLs like _index.html_, instead of
http://localhost:8000/index.html[_http://localhost:8000/index.html_],
to refer to files on the same server as the running script.

{{index "form (HTML tag)", "submit event", "click event", "PUT method"}}

Then, when the user clicks a button (you can use a `<form>`
element and `"submit"` event or simply a `"click"` handler), make a
`PUT` request to the same URL, with the content of the `<textarea>` as
request body, to save the file.

{{index "select (HTML tag)", "option (HTML tag)", "change event"}}

You
can then add a `<select>` element that contains all the files in the
server's root ((directory)) by adding `<option>` elements containing
the lines returned by a `GET` request to the URL `/`. When the user
selects another file (a `"change"` event on the field), the script
must fetch and display that file. Also make sure that when saving a
file, you use the currently selected filename.

{{index directory, "GET method"}}

Unfortunately, the server is too
simplistic to be able to reliably read files from subdirectories
since it does not tell us whether the thing we fetched with a `GET`
request is a regular file or a directory. Can you think of a way to
extend the server to address this?

hint}}

