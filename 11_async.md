{{meta {load_files: ["code/crows.js", "code/chapter/11_async.js"]}}}

# Asynchronous Programming

The central part of a computer, the part that carries out the
individual steps that make up our programs, is called the
_((processor))_. The programs we have seen so far are things that will
keep the processor busy until they have finished their work. The speed
at which something like a loop that manipulates numbers can be
executed depends entirely on the speed of the processor.

But many programs interact with things outside of the processor. For
example, they may communicate over a computer ((network)) or request
data from the ((hard disk)), which is a lot slower than getting it
from ((memory)).

When such a thing is happening, it would be a shame to let the
processor sit idle. There might be some other work it could do in the
meantime. In part, this is handled by your operating system, which
will switch the processor between multiple running programs. But that
doesn't help when we want a _single_ program to be able to make
progress while it is waiting for a network request.

## Asynchronicity

{{index "synchronous programming"}}

In a _synchronous_ programming model, you pretend that things happen
instantaneously. When you call a function that performs a long-running
action, it only returns when the action has finished, giving you the
result, _as if_ it appeared immediately, but secretly stopping your
program while it was waiting.

{{index "asynchronous programming"}}

An _asynchronous_ model dispenses with this pretend-instantaneousness.
When you start an action, your program continues to run. When the
action finishes, your program is informed and gets access to the
result of the action (for example, the data read from disk).

We can compare synchronous and asynchronous programming using a small
example: a program that needs to fetch two resources from the Internet
and then do some processing with the result.

{{index "synchronous programming"}}

In a synchronous environment, where the request function only returns
after it has done its work, the easiest way to perform this task is to
make the requests one after the other. This has the drawback that the
second request will be started only when the first has finished. The
total time taken will be at least the sum of the two response times.

{{index parallelism}}

The solution to this problem, in a synchronous system, is to start
additional ((thread))s of control. A thread is another running program
whose execution the operating system may interleave with other
programs—since most modern computers contain multiple processors,
multiple threads may even run at the same time, on different
processor. A second thread could start the second request, and then
both threads wait for their results to come back, after which they
resynchronize to combine their results.

{{index CPU, blocking, "asynchronous programming", timeline, "callback function"}}

In the following diagram, the thick lines represent time the program
spends running normally, and the thin lines represent time spent
waiting for the network. In the synchronous model, the time taken by
the network is _part_ of the timeline for a given thread of control.
In the asynchronous model, starting an network action conceptually
causes a _split_ in the timeline. The program that initiated the
action continues running, and the action itself is done alongside it,
notifying the program when it is finished.

{{figure {url: "img/control-io.svg", alt: "Control flow for synchronous and asynchronous programming",width: "8cm"}}}

{{index "control flow", "asynchronous programming", verbosity}}

Another way to describe the difference is that waiting for actions to
finish is _implicit_ in the synchronous model, while it is _explicit_,
under our control, in the asynchronous one.

Asynchronicity cuts both ways. It makes expressing programs that do
not fit the straight-line model of control easier, but it can also
make expressing programs that do follow a straight line more awkward.
We'll see some ways to address this awkwardness later in the chapter.

Both of the big JavaScript programming platforms—((browser))s and
((Node.js))—make operations that might take a while asynchronous,
rather than relying on ((thread))s. Since programming with threads is
notoriously hard (understanding what a program does is much more
difficult when it's doing multiple things at once), I think that this
is a good decision.

## Crow tech

Most people are aware of the fact that ((crow))s are very smart birds.
They can use tools, plan ahead, recognize people, remember facts, and
even communicate these facts among each other.

What most people don't know is that they are capable of much
more—which they keep well hidden from us. I've been told by a
reputable, if somewhat eccentric, expert on ((corvid))s that crow
technology is not far behind human technology, and they are catching
up.

For one thing, they have developed the ability to construct computing
devices. These are not electronic, as human computing devices are, but
operate through the actions of tiny insects, a species closely related
to the ((termite)), that has developed a ((symbiotic relationship))
with the crows. The birds provide them with food, and in return the
insects build and operate their complex colonies which, with the help
of the living creatures inside them, perform computations.

Such colonies are usually located in big, long-lived nests. The birds
and insects work together to build a network of bulbous clay
structures, hidden between the twigs of the nest, in which the insects
live.

To communicate with other devices, these colonies use light signals.
The crows embed pieces of reflective material in special communication
structures, and the insects aim these to reflect light at another
nest, encoding data as a sequence of quick flashes. This means that
only nests that have an unbroken visual connection can communicate.

This is a schema of the crow nest network in the village of
((Hières-sur-Amby)) on the banks of the river Rhône.

{{figure {url: "img/Hieres-sur-Amby.png", alt: "A network of crow nests in a small village"}}}

In an estounding example of ((convergent evolution)), crow computers
run JavaScript. In this chapter we'll write some basic networking
functions for them.

## Callbacks

{{indexsee [function, callback], "callback function"}}

One approach to ((asynchronous programming)) is to make functions that
perform a slow action take an extra argument, a _((callback
function))_. The action is started, and when it finishes, the callback
function is called with the result.

{{index "setTimeout function", waiting}}

As an example, the `setTimeout` function, available both in Node.js
and in browsers, waits a given amount of milliseconds (a second is a
thousand milliseconds) and then calls a function.

```{test: no}
setTimeout(() => console.log("Tick"), 500);
```

"Waiting" is not generally a very important type of work, but it can
be useful when doing something like updating an animation or checking
if something is taking longer than a given amount of ((time)).

Performing multiple asynchronous actions in a row using callbacks
means that you have to keep creating new functions that handle the
((continuation)) of the computation after the action.

{{index "hard disk"}}

Most crow nest computers have a long-term data storage bulb, where
pieces of information are etched into twigs so that they can be
retrieved later. Etching or finding a piece of data takes a moment, so
the interface to long-term storage is asynchronous, and uses callback
functions.

Storage bulbs store pieces of ((JSON))-encodable data under names. A
((crow)) might store information about the places where it's hidden
away food under the name `"food caches"`, which could hold an array of
names that point at other pieces of data, describing the actual cache.
To look up a food ((cache)), the bird could run code like this:

{{index "readStorage function"}}

```{includeCode: "top_lines: 1"}
import {readStorage} from "crow-tech";

readStorage("food caches", caches => {
  let firstCache = caches[0];
  readStorage(firstCache, info => {
    console.log(info);
  });
});
```

(All binding names and strings have been translated from crow-language
to English.)

This style of programming is workable, but the indentation level
increases with each asynchronous action, because you end up in another
function. Doing more complicated things, like running multiple actions
at the same time, can get positively awkward.

Crow nest computers are designed to communicate using
((request))-((response)) pairs. That means one nest sends a message to
another nest, which then immediately sends a message back, confirming
receipt and possibly including a reply to a question asked in the
message.

Each message is tagged with a _type_, which determines how it is
handled. Our code can define handlers for specific request types, and
when such a request comes in, the handler is called to produce a
response.

{{index "crow-tech module", "makeRequest function"}}

The interface exported by the `"crow-tech"` module provides
callback-based functions for communication. The `makeRequest` function
sends off a request. It expects the name of the target nest, the type
of the request, and the content of the request as its first three
arguments, and a function to call when a response comes in as its
fourth and last argument.

```
import {makeRequest} from "crow-tech";

makeRequest("Cow Pasture", "note", "Let's caw loudly at 7PM",
            () => console.log("Note delivered."));
```

But to make that work, we have to define a ((request type)) named
`"note"`. Note that the code that handles the requests has to run not
just on this nest-computer, but on all nests that can receive messages
of this type. We'll just assume that a crow flies over and installs
our handler code on all connected nests.

{{index "defineRequestType function", "me binding"}}

```{includeCode: true, meta: allNodes}
import {defineRequestType, me} from "crow-tech";

defineRequestType("note", (content, source, done) => {
  console.log(`${me} received note: ${content}`);
  done();
});
```

{{if interactive

Since the code snippets that define network-wide things run on all
nests, if you add extra code to them and run them, don't be surprised
that your code runs multiple times in different places.

if}}

The `defineRequestType` function defines a new type of request. The
example adds support for `"note"` requests, which just send a note to
a given nest. Our implementation just calls `console.log` so that we
can verify that the request arrived. The `me` binding holds the name
of this nest.

{{index "asynchronous programming"}}

The third argument given to the handler, `done`, is a callback
function that it must call when it is done with the request. You could
have used the function's ((return value)) as the response value, but
that would mean that a request handler can't itself perform
asynchronous actions. A function doing asynchronous work typically
returns before the work is done, having arranged for a callback to be
called when it completes. So we need some asynchronous way—in this
case, another ((callback function))—to signal when a response is
available.

In a way, asyncronicity is _contagious_. Any function that calls a
function that works asynchronously must itself be asynchronous, using
a callback or similar mechanism to deliver its result. Using callback
is somewhat more involved and quite a bit more error-prone than simply
returning a value, so needing to structure large parts of your program
that way is not great.

## Promises

Working with abstract concepts is often easier when those concepts can
be represented by ((value))s. In the case of asynchronous actions you
could, instead of arranging for a function to be called at some point
in the future, return an object that represents this future event.

{{index "Promise class", "asynchronous programming"}}

This is what the standard class `Promise` is for. A promise is an
asynchronous action that may complete at some point and produce a
value, and is able to notify anyone who is interested when that
happens.

{{index "Promise.resolve function", "resolving (a promise)"}}

The easiest way to create a promise is by calling `Promise.resolve`.
This function ensures that the value you give it is wrapped in a
promise. If it's already a promise, it is simply returned, and
otherwise, you get a new promise that immediately finishes with your
value as its result.

```
let fifteen = Promise.resolve(15);
fifteen.then(value => console.log(`Got ${value}`));
// → Got 15
```

{{index "then method"}}

To get the result of a promise, you can use its `then` method. This
registers a ((callback function)) to be called when the promise
resolves and produces a value. You can add multiple callbacks to a
single promise, and even if you add them after the promise has already
_resolved_ (finished), they will be called.

But that's not all `then` does. It returns another promise, which
resolves to the value that the handler returns or, if the handler
returns a promise, waits for that one and then resolves to its result.

It is useful to think of promises as a device to move values into an
asynchronous reality. A normal value is simply there. A promised value
is a value that _might_ already be there or might appear at some point
in the future. Computations defined in terms of promises act on such
wrapped values and are executed asynchronously as the values become
available.

{{index "Promise class"}}

To define a promise, you can use `Promise` as a constructor. It has a
somewhat odd interface—the constructor expects a function as argument,
which it immediately calls, passing it a function that it can use to
resolve the promise.

{{index "storage function"}}

This is how you'd create a promise-based interface for the
`readStorage` function.

```{includeCode: "top_lines: 5"}
function storage(name) {
  return new Promise(resolve => {
    readStorage(name, result => resolve(result));
  });
}

storage("enemies").then(value => console.log("Got", value));
```

This asynchronous function returns a meaningful value. This is the
main advantage of promises—they simplify the use of asynchronous
functions. Instead of having to pass around callbacks, promise-based
functions look similar to regular ones: they take input as arguments,
and return their output. The only difference is that that the output
may not have resolved yet.

## Failure

{{index "exception handling"}}

Regular JavaScript computations can fail by throwing an exception.
Asynchronous computations often need something like that. A network
request may fail, or some code that is as _part_ of the asynchronous
action may throw an exception.

{{index "callback function", error}}

One of the most pressing problems with the callback style of
asynchronous programming is that it makes it extremely difficult to
make sure failures are properly reported to the callbacks.

A widely used convention is that the first argument to the callback is
used to indicate that the action failed, and the second contains the
value produced by the action when it was successful. Such callback
functions must always check whether they received an exception, and
make sure that any problems they cause, including exceptions thrown by
functions they call, are caught and given to the right function.

{{index "rejecting (a promise)", "resolving (a promise)", "then method"}}

Promises make this easier. They can both resolve (finish successfully)
or reject (fail), and `then` handlers are only called when the action
is successful, and rejections are automatically propagated to the new
promise that is returned by `then`. And when a handler throws an
exception, this automatically causes the promise produced by its
`then` call to be rejected. So if any element in a chain of
asynchronous actions fails, the outcome of the whole chain is marked
as rejected, and no regular handlers are called beyond the point where
it failed.

{{index "Promsise.reject function", "Promise class"}}

Much like resolving a promise provides a value, rejecting one also
provides one, usually called the _reason_ of the rejection. When an
exception in a handler function causes the rejection, the exception
value is used as the reason. Similarly, when a handler returns a
promise that is rejected, that rejection flows into the next promise.
There's a `Promise.reject` function that creates a new,
immediately-rejected promise.

{{index "catch method"}}

To explicitly handle such rejections, promises have a `catch` method,
which registers a handler that is called when the promise is rejected,
similar to how `then` handlers handle normal resolution. It also very
much like `then` in that it returns a new promise, which succeeds to
the promise's value if it resolves normally, and to the result of the
`catch` handler otherwise. If a `catch` handler throws an error, the
new promise is also rejected.

{{index "then method"}}

As a shorthand, `then` also accepts a rejection handler as second
argument, so you can install both types of handlers in a single method
call.

A function passed to the `Promise` constructor receives a second
argument, alongside the resolve function, which it can use to reject
the new promise.

The chains of promise values created by calls to `then` and `catch`
can be seen as a pipeline through which asynchronous values or
failures move. Since such chains are created by registering handlers,
each link has a success handler or a rejection handler (or both)
associated with it. Handlers that don't match the type of outcome
(success or failure) are ignored. But those that do match are called,
and their outcome determines what kind of value comes next—success
when it returns a regular value, rejection when it throws an
exception, and the outcome of a promise when it returns a one of
those.

{{index "uncaught exception", "exception handling"}}

Much like an uncaught exception is handled by the environment,
JavaScript environments can detect when a promise rejection isn't
handled, and will report this as an error.

## Networks are hard

{{index network}}

Occasionally, there isn't enough light for the ((crow))s' mirror
systems to transmit a signal or something is blocking the path of the
signal. So it is possible for a signal to be sent, but never received.

{{index "makeRequest function", error, timeout}}

As it is, that will just cause the callback given to `makeRequest` to
never be called, which will probably cause the program to fail without
even noticing it. It would be nice if, after a given period of not
getting a response, a request would _time out_ and report failure.

Often, transmission failures are random accidents, like a car's
headlight interfering with the light signals, and simply retrying the
request may cause it to succeed. So while we're at it, let's make our
request function automatically retry the sending of the request a few
times before it gives up.

{{index "Promise class", "callback function", interface}}

And, since we've established that promises are a nice thing, we'll
also make this function return a promise. In terms of what they can
express, callbacks and promises are equivalent, so callback-based
functions can be wrapped to expose a promise-based interface (and
vice-versa).

Even when a ((request)) and its ((response)) are successfully
delivered, the response may indicate failure. For example if the
request tries to use a request type that hasn't been defined or the
handler throws an error. To support this, `makeRequest` and
`defineRequestType` follow the convention that the first argument
passed to callbacks is the failure reason, if any, and the second is
the actual result value, if the action did not fail.

These can be translated to promise resolution and rejection by our
wrapper.

{{index "Timeout class", "request function", retry}}

```{includeCode: true, meta: allNodes}
import {makeRequest} from "crow-tech";

class Timeout extends Error {};

function request(target, type, content) {
  return new Promise((resolve, reject) => {
    let done = false;
    function attempt(n) {
      makeRequest(target, type, content, (failed, value) => {
        done = true;
        if (failed) reject(failed);
        else resolve(value);
      });
      setTimeout(() => {
        if (done) return;
        else if (n < 3) attempt(n + 1);
        else reject(new Timeout("Timed out"));
      }, 250);
    }
    attempt(1);
  });
}
```

{{index "Promise class", "resolving (a promise)", "rejecting (a promise)"}}

Because promises can only be resolved (or rejected) once, this works.
The first time `resolve` or `reject` is called determines the outcome
of the promise, and any further calls, such as the timeout arriving
after the request finishes, or a request coming back after another
request finished, are ignored.

{{index recursion}}

To build an asynchronous ((loop)), for the retries, we need to use a
recursive function—a regular loop doesn't allow us to stop and wait
for an asynchronous action. The `attempt` function makes a single
attempt to send a request. It also sets a timeout that, after 250
milliseconds, if no response has come back yet, either starts the next
attempt or, if this was the fourth attempt, rejects the promise with
an instance of `Timeout` as the reason.

{{index idempotence}}

Retrying every quarter second and giving up when no response has come
in after a second is definitely somewhat arbitrary. It is even
possible, if the request did come through but the handler is just
taking a bit longer, for requests to be delivered multiple times.
We'll write our handlers with that problem in mind—duplicate messages
should be harmless.

In general, we will not be building a world-class, robust network
today. But that's okay, crows don't have very high expectations yet,
when it comes to computing.

{{index "defineRequestType function", "requestType function"}}

To isolate ourselves from callbacks altogether, we'll go ahead and
also define a wrapper for `defineRequestType` which allows the handler
function to return a promise or even a plain value, and wires that up
to the callback for us.

```{includeCode: true, meta: allNodes}
function requestType(name, handler) {
  defineRequestType(name, (content, source, callback) => {
    try {
      Promise.resolve(handler(content, source))
        .then(response => callback(null, response),
              failure => callback(failure));
    } catch(exception) {
      callback(exception);
    }
  });
}
```

{{index "Promise.resolve function"}}

`Promise.resolve` is used to convert the value returned by `handler`
to a promise if it isn't already.

{{index "try keyword", "callback function"}}

Note that the call to `handler` had to be wrapped in a `try` block, to
make sure any exception it raises directly is given to the callback.
This nicely illustrates the difficulty of properly handling errors
with raw callbacks—it is very easy to forget to properly route
exceptions like that, and if you don't do it, failures won't get
reported to the right callback. Promises make this mostly automatic,
and thus less error-prone.

## Collections of promises

{{index "neighbors binding", "ping request"}}

Each nest computer keeps an array of other nests within transmission
distance in its `neighbors` binding. To check which of those are
currently reachable, you could write a function that tries to send a
`"ping"` request (a request that simply asks for a response) to each
of them, and see which ones come back.

{{index "Promise.all function"}}

When working with collections of promises running at the same time,
`Promise.all` can be useful. It waits for all of the promises in the
array it is given to resolve, and then resolves to an array of the
values that these promises produced (in the same order as the original
array). If any promise is rejected, the result of `Promise.all` is
itself rejected.

```{includeCode: true, meta: allNodes}
import {neighbors} from "crow-tech";

requestType("ping", () => "pong");

function availableNeighbors() {
  let requests = neighbors.map(neighbor => {
    return request(neighbor, "ping")
      .then(() => true, () => false);
  });
  return Promise.all(requests)
    .then(result => neighbors.filter((_, i) => result[i]));
}
```

{{index "then method"}}

When a neighbor isn't available, we don't want the entire aggregate
promise to fail, since then we still wouldn't know anything. So the
function that is mapped over the set of neighbors to turn them into
request promises attaches handlers that make successful requests
produce `true`, and rejected ones `false`.

{{index "filter method", "map method", "some method"}}

In the handler for the aggregate promise, `filter` is used to remove
those elements from the `neighbors` array whose corresponding value is
false. This makes use of the fact that `filter` passes the array index
of the current element as a second argument to its filtering function
(`map`, `some`, and similar higher-order array methods do the same).

## Network flooding

The fact that nests can only talk to their neighbors greatly inhibits
the usefulness of this network.

For broadcasting information, one solution is to set up a type of
request that is automatically forwarded to all neighbors. These
neighbors then in turn forward it to all their neighbors, until the
whole network has received the message.

{{index "sendGossip function"}}

```{includeCode: true, meta: allNodes}
const gossip = [];

function sendGossip(message, exceptFor=null) {
  gossip.push(message);
  for (let neighbor of neighbors) {
    if (neighbor != exceptFor) {
      request(neighbor, "gossip", message);
    }
  }
}

requestType("gossip", (message, source) => {
  if (gossip.includes(message)) return;
  console.log(`${me} received gossip '${message}' from ${
              source}`);
  sendGossip(message, source);
});
```

To avoid sending the same message around the network forever, each
nest keeps an array of gossip strings that it has already seen. When
it receives a duplicate, which is very likely to happen with everybody
blindly resending these, it ignores it. But when it receives a new
message, it excitedly tells all its neighbors, except for the one who
originally sent it the message.

This will cause a new piece of gossip to spread through the network
like an ink stain in water. Even when some connections aren't
currently working, if there is an alternative route to a given nest,
the gossip will reach it through there.

{{index "flooding"}}

This style of network communication is called _flooding_—it floods the
network with a piece of information until all nodes have it.

{{if interactive

We can call `sendGossip` to see a message flow through the village.

```
sendGossip("Kids with airgun in the park.");
```

if}}

## Message routing

{{index efficiency}}

If a given node wants to talk to a single other node, flooding is not
a very efficient approach. Especially when the network is big, that
would lead to a lot of useless data transfers.

{{index "routing"}}

An alternative approach is to set up a way for messages to hop from
node to node, until they reach their destination. The difficulty with
that is that it requires knowledge about the layout of the network. To
send a request in the direction of a far-away nest, it is necessary to
know which neighboring nest gets it closer to its destination. Sending
it in the wrong direction will not do much good.

Since each nest only knows about its direct neighbors, it doesn't have
the information it needs. We must somehow spread the information about
these connections to all nests. Preferably in a way that allows it to
change over time, if nests are abandoned or new nests are built.

{{index flooding}}

We can use flooding for that again, but instead of checking whether a
given message has already been received, we now check whether the new
set of neighbors for a given nest matches the current set we have for
it.

{{index "broadcastConnections function", "connections binding"}}

```{includeCode: true, meta: allNodes}
const connections = new Map;
connections.set(me, neighbors);

requestType("connections", ({from, neighbors}, source) => {
  if (JSON.stringify(connections.get(from)) ==
      JSON.stringify(neighbors)) return;
  connections.set(from, neighbors);
  broadcastConnections(from, source);
});

function broadcastConnections(from, exceptFor=null) {
  for (let neighbor of neighbors) {
    if (neighbor != exceptFor) {
      request(neighbor, "connections",
              {from, neighbors: connections.get(from)});
    }
  }
}
broadcastConnections(me);
```

{{index JSON, "== operator"}}

The comparson uses `JSON.stringify` because `==`, on objects or
arrays, will only return true when the two are the exact same value,
which is not what we need here. Comparing the JSON strings is a crude
but effective way to compare their content.

The nodes immediately start broadcasting their connections, which
should, unless some nests are completely unreachable, give every nest
a map of the current network ((graph)).

{{index pathfinding}}

A thing you can do with graphs is finding routes in them, as we saw in
[Chapter ?][robot]. If we have a route towards a message's
destination, we know in which direction to send it.

{{index "findRoute function"}}

This `findRoute` function, which greatly resembles the `findRoute`
from [Chapter ?][robot#findRoute], searches for a way to reach a given
node in the network. But instead of returning the whole route, it just
returns the next step. That next nest will itself, using its current
information about the network, decide where _it_ sends the message.

```{includeCode: true, meta: allNodes}
function findRoute(to) {
  let work = [{at: me, via: null}];
  for (let i = 0; i < work.length; i++) {
    let {at, via} = work[i];
    for (let next of connections.get(at) || []) {
      if (next == to) return via;
      if (!work.some(w => w.at == next)) {
        work.push({at: next, via: via || next});
      }
    }
  }
  return null;
}
```

Now we can build a function that can send long-distance messages. If
the message is addressed to a direct neighbor, it is delivered as
usual. If not, it is packaged in an object and sent to a neighbor that
is closer to the target, using the `"route"` request type, which will
cause that neighbor to repeat the same behavior.

{{index "routeRequest function"}}

```{includeCode: true, meta: allNodes}
function routeRequest(target, type, content) {
  if (neighbors.includes(target)) {
    return request(target, type, content);
  } else {
    let via = findRoute(target);
    if (!via) throw new Error(`No route to ${target}`);
    return request(via, "route", {target, type, content});
  }
}

requestType("route", ({target, type, content}) => {
  return routeRequest(target, type, content);
});
```

{{if interactive

We can now send a message to the nest in the church tower, which is
four network hops removed.

```
routeRequest("Church Tower", "note", "Incoming jackdaws!");
```

if}}

{{index "[network, stack]"}}

We've constructed several ((layer))s of functionality on top of a
primitive communication system, in order to make it convenient to use.
This is a very crude, simplified model of how real computer networks
work.

{{index error}}

A distinguishing property of computer networks is that they aren't
reliable—abstractions built on top of them can help, but you can't
abstract away network failure. So network programming is typically
very much about anticipating and dealing with failures.

## Async functions

To store important information, ((crow))s are known to duplicate it across
nests. That way, if a hawk destroys a nest, the information isn't
lost.

To retrieve a given piece of information that it doesn't have in its
own storage bulb, a nest computer might consult random other computers
in the network until it finds one that has it.

{{index "findInStorage function", "network function"}}

```{includeCode: true, meta: allNodes}
requestType("storage", name => storage(name));

function findInStorage(name) {
  return storage(name).then(found => {
    if (found != null) return found;
    else return findInRemoteStorage(name);
  });
}

function network() {
  return Array.from(connections.keys());
}

function findInRemoteStorage(name) {
  let sources = network().filter(n => n != me);
  function next() {
    if (sources.length == 0) {
      return Promise.reject(new Error("Not found"));
    } else {
      let source = sources[Math.floor(Math.random() *
                                      sources.length)];
      sources = sources.filter(n => n != source);
      return routeRequest(source, "storage", name)
        .then(value => value != null ? value : next(), next);
    }
  }
  return next();
}
```

{{index "Map class", "Object.keys function", "Array.from function"}}

Because `connections` is a `Map`, `Object.keys` doesn't work on it. It
has a `keys` _method_, but that returns an iterator rather than an
array. An iterator (or iterable value) can be converted to an array
with the `Array.from` function.

{{index "Promise class", recursion}}

Even with promises this is some really awkward code. Multiple
asynchronous actions are chained together in non-obvious ways. We
again need a recursive function (`next`) to model looping through the
nests.

{{index "synchronous programming", "asynchronous programming"}}

And the thing the code actually does is completely linear—it always
waits for the previous action to complete before starting the next
one. In a synchronous programming model, it'd be a lot simpler to
express.

{{index "async function", "await keyword"}}

The good news is that JavaScript allows you write pseudo-synchronous
code. An `async` function is a function that implicitly returns a
promise, and that can, in its body `await` other promises in a way
that _looks_ synchronous.

{{index "findInStorage function"}}

We can rewrite `findInStorage` like this:

```
async function findInStorage(name) {
  let local = await storage(name);
  if (local == null) return local;

  let sources = network().filter(n => n != me);
  while (sources.length > 0) {
    let source = sources[Math.floor(Math.random() *
                                    sources.length)];
    sources = sources.filter(n => n != source);
    try {
      let ok = await routeRequest(source, "storage", name);
      if (ok != null) return ok;
    } catch(_) {}
  }
  throw new Error("Not found");
}
```

{{index "async function", "return keyword", "exception handling"}}

An `async` function is marked by the word `async` before the
`function` keyword. Methods can also be `async`, by writing `async`
before their name. When such a function is called, it returns a
promise. When the function body returns something, that promise is
resolved. If it throws an exception, the promise is rejected.

{{if interactive

```
findInStorage("events on 2017-12-21").then(console.log);
```

if}}

{{index "await keyword", "control flow"}}

Inside an `async` function, the word `await` can be put in front of an
expression (which should usually be a promise) to wait for that
expression to resolve, and only then continue the execution of the
function.

So such a function no longer, like a regular JavaScript function, runs
from start to completion in one go. Instead, it can be _frozen_ at any
point that has an `await`, and resumed at a later time.

For non-trivial asynchronous code, this notation is usually more
convenient than directly using promises. Even if you need to do
something that doesn't fit the synchronous model of the `async`
notation, like performing multiple actions at the same time, it is
easy to combine `await` with direct use of promises.

## Generators

{{index "async function"}}

This ability of functions to be paused and then resumed again is not
exclusive to `async` functions. JavaScript also has _((generator))_
functions, which are similar, but without the promises.

When you define a function with `function*` (placing as asterisk after
the word `function`), it becomes a generator. When you call a
generator, it returns an ((iterator)), which we saw in [Chapter
?](object).

```
function* powers(n) {
  for (let current = n;; current *= n) {
    yield current;
  }
}

for (let power of powers(3)) {
  if (power > 50) break;
  console.log(power);
}
// → 3
// → 9
// → 27
```

{{index "next method", "yield keyword"}}

Initially, the function is frozen at its start. Every time you call
`next` on the iterator, the function runs until it finds a `yield`
expression, which pauses it and causes the yielded value to become the
next value produced by the iterator, or returns. When the function
returns (the one in the example never does), the iterator is done.

Writing iterators is often much easier when you use generator
functions. The iterator for a list object (from the exercise in
[Chapter ?](object#list_iterator)) can be written with this generator:

{{index "List class"}}

```
List.prototype[Symbol.iterator] = function*() {
  for (let node = this; node != List.empty;
       node = node.rest) {
    yield node.value;
  }
};
```

There's no longer a need to create an object to hold the iteration
((state))—generators automatically save their local state every time
they yield.

Such `yield` expressions may only occur directly in the generator
function itself and not, for example, in a function defined inside of
it. The state a generator saves, when yielding, is only its _local_
environment along with the position where it yielded.

{{index "await keyword"}}

An `async` function is a special type of generator. It produces a
promise when called, which is resolved when it returns (finishes) and
rejected when it throws an exception. Whenever it yields (awaits) a
promise, the result of that promise (value or thrown exception) is the
result of the `await` expression.

## The event loop

{{index "asynchronous programming", scheduling, "event loop"}}

Asynchronous programs are executed piece by piece. Each piece may
start some actions, and schedule code to be executed when the action
finishes or fails. In between these pieces, the program sits idle,
waiting for the next action.

{{index "setTimeout function"}}

So callbacks are not directly called by the code that scheduled them.
If I call `setTimeout` from within a function, that function will have
returned by the time the callback function is called. And when the
callback returns, control does not go back to the function that
scheduled it.

{{index "Promise class", "catch keyword", "exception handling"}}

Asynchronous behavior happens on its own empty function ((call
stack)). This is one of the reasons that, without promises, managing
exceptions across asynchronous code is hard. Since each callback
starts with a mostly empty stack, your `catch` handlers won't be on
the stack when they throw an exception.

```
try {
  setTimeout(() => {
    throw new Error("Woosh");
  }, 20);
} catch(_) {
  // This will not run
  console.log("Caught!");
}
```

{{index thread, queue}}

No matter how closely together events, such as timeouts or incoming
requests, happen, a JavaScript environment will only run one program
at a time. You can think of this as it running a big loop _around_
your program, called the event loop. When there's nothing to be done,
that loop is stopped. But as soon as events come in, they are added to
a queue and the corresponding code is executed one after the other.
Because no two things run at the same time, slow-running code might
delay the handling of other events.

This example sets a timeout, but then dallies until after the
timeout's intended point of time, causing the timeout to be late.

```
let start = Date.now();
setTimeout(() => {
  console.log("Timeout ran at", Date.now() - start);
}, 20);
while (Date.now() < start + 50) {}
console.log("Wasted time until", Date.now() - start);
// → Wasted time until 50
// → Timeout ran at 55
```

{{index "resolving (a promise)", "rejecting (a promise)", "Promise class"}}

Promises always resolve or reject as a new event. Even if a promise is
already resolved, waiting for it will cause your callback to run after
the current script finishes, rather than right away.

```
Promise.resolve("Done").then(console.log);
console.log("Me first!");
// → Me first!
// → Done
```

In later chapters we'll see more types of events that happen on the
event loop.

## Asynchronous bugs

{{index "asynchronous programming"}}

When your program runs synchronously, in a single go, there are no
((state)) changes happening except those that the program itself
makes. For asynchronous programs, which may have _gaps_ in their
execution, during which other code can run, this is different.

Let's look at an example. One of the hobbies of our crows is to count
the amount of chicks that hatch throughout the village every year.
Nests store this count in their storage bulbs. The code below
enumerates the counts from all the nests for a given year.

{{index "anyStorage function", "chicks function"}}

```{includeCode: true}
function anyStorage(nest, name) {
  if (nest == me) return storage(name);
  else return routeRequest(nest, "storage", name);
}

async function chicks(year) {
  let list = "";
  await Promise.all(network().map(async name => {
    list += `${name}: ${
      await anyStorage(name, `chicks in ${year}`)
    }\n`;
  }));
  return list;
}
```

{{index "async function"}}

The `async name =>` part shows that ((arrow function))s can also be
made `async` by putting the word `async` in front of them.

{{index "Promise.all function"}}

The code doesn't immediately look suspicious... it maps the `async`
arrow function over the set of nests, creating an array of promises,
and then uses `Promise.all` to wait for all of these before returning
the list they build up.

But it is seriously broken. It'll always return only a single line of
output, listing the nest that was slowest to respond.

{{if interactive

```
chicks(2017).then(console.log);
```

if}}

Can you work out why?

{{index "+= operator"}}

The problem lies in the `+=` operator, which takes the _current_ value
of `list` at the time where the statement starts executing, and, when
the statement finishes executing, sets the `list` binding to be that
value plus the added string.

{{index "await keyword"}}

But between the time where the statement starts executing and the time
where it finishes there's an `await` expression, which means there's
an asyncronous gap there. The `computers.map` expression runs before
anything has been added to the list, so each of the `+=` operators
starts from an empty list and end up, when its storage retrieval
finishes, setting `list` to a single-line list—the result of adding
the line it built to the empty string.

{{index "side effect"}}

This could have easily been avoided by returning the lines from the
mapped promises and calling `join` on the result of `Promise.all`,
instead of building up the list by changing a binding. As usual,
computing new values is less error-prone than changing existing
values.

{{index "chicks function"}}

```
async function chicks(year) {
  return (await Promise.all(network().map(async name => {
    return name + ":" +
      await anyStorage(name, `chicks in ${year}`);
  }))).join("\n");
}
```

Mistakes like this are easy to make, especially when using `await`,
and you should be aware of where the gaps in your code occur. An
advantage of JavaScript's _explicit_ asynchronicity (whether through
callbacks, promises, or `await`) is that it's relatively easy to spot
these gaps.

## Summary

Asynchronous programming makes it possible to express waiting for
long-running actions without freezing the program during these
actions. JavaScript environments typically implement this style of
programming using callbacks, functions that are called when the
actions complete. An event loop schedules such callbacks to be called
when appropriate, one after the other, so that their execution does
not overlap.

Programming asynchronously is made easier by promises, objects that
represent actions that might complete in the future, and `async`
functions, which allow you to write an asynchronous program as if it
is synchronous.

## Exercises

### Tracking the scalpel

{{index "scalpel (exercise)"}}

The village crows own an old scalpel, that they occasionally use on
special misions—say, to cut through screen doors or packaging. To be
able to quickly track it down, every time the scalpel is moved to
another nest, an entry is added to the storage of both the nest that
had it and the nest that took it, under `"scalpel"`, pointing at its
new location.

This means that finding the scalpel is a matter of following the
breadcrumb trail of storage entries, until you find a nest where that
points at the nest itself.

{{index "anyStorage function", "async function"}}

Write an `async` function `locateScalpel` that does this, starting at
the nest on which it runs. You can use the `anyStorage` function
defined earlier to access storage in arbitrary nests. The scalpel has
been going around long enough that you may assume that every nest has
a `"scalpel"` entry in its data storage.

Next, write the same function again without using `async` and `await`.

{{index "exception handling"}}

Do request failures properly show up as rejections of the returned
promise in both versions? How?

{{if interactive

```{test: no}
async function locateScalpel() {
  // Your code here.
}

function locateScalpel2() {
  // Your code here.
}

locateScalpel().then(console.log);
// → Butcher's Shop
```

if}}

{{hint

{{index "scalpel (exercise)"}}

This can be done with a single loop that searches through the nests,
moving forward to the next when it finds a value that doesn't match
the current nest's name, and returning the name when it finds a
matching value. In the `async` function, a regular `for` or `while`
loop can be used.

{{index recursion}}

To do the same in a plain function, you will have to build your loop
using a recursive function. The easiest way to do this is to have that
function return a promise by calling `then` on the promise that
retrieves the storage value. Depending on whether that value matches
the name of the current nest, the handler returns that value or a
further promise created by calling the loop function again.

Don't forget to start the loop by calling the recursive function once
from the main function.

{{index "exception handling"}}

In the `async` function, rejected promises are converted to exceptions
by `await`. When an `async` function throws an exception, its promise
is rejects. So that works.

If you implemented the non-`async` function as outlined above, the way
`then` works also automatically causes a failure to end up in the
returned promise. If a request fails, the handler passed to `then`
isn't called, and the promise it returns is rejected with the same
reason.

hint}}

### Building Promise.all

{{index "Promise class", "Promise.all function", "building Promise.all (exercise)"}}

Given an array of ((promise))s, `Promise.all` returns a promise that
waits for all of the promises in the array to finish. It then
succeeds, yielding an array of result values. If any of the promises
in the array fail, the promise returned by `all` fails too (with the
failure value from the failing promise).

Implement something like this yourself as a regular function
called `Promise_all`.

Remember that after a promise is resolved (has succeeded or failed),
it can't succeed or fail again, and further calls to the functions
that resolve it are ignored. This can simplify the way you handle
failure of your promise.

{{if interactive

```{test: no}
function Promise_all(promises) {
  return new Promise((resolve, reject) => {
    // Your code here.
  });
}

// Test code.
Promise_all([]).then(array => {
  console.log("This should be []:", array);
});
function soon(val) {
  return new Promise(resolve => {
    setTimeout(() => resolve(val), Math.random() * 500);
  });
}
Promise_all([soon(1), soon(2), soon(3)]).then(array => {
  console.log("This should be [1, 2, 3]:", array);
});
Promise_all([soon(1), Promise.reject("X"), soon(3)]).then(array => {
  console.log("We should not get here");
}).catch(error => {
  if (error != "X") {
    console.log("Unexpected failure:", error);
  }
});
```

if}}

{{hint

{{index "Promise.all function", "Promise class", "then method", "building Promise.all (exercise)"}}

The function passed to the `Promise` constructor will have to call
`then` on each of the promises in the given array. When one of them
succeeds, two things need to happen. The resulting value needs to be
stored in the correct position of a result array, and we must check
whether this was the last pending ((promise)) and finish our own
promise if it was.

{{index "counter variable"}}

The latter can be done with a counter, which is initialized to the
length of the input array and from which we subtract 1 every time a
promise succeeds. When it reaches 0, we are done. Make sure you take
the situation where the input array is empty (and thus no promise will
ever resolve) into account.

Handling failure requires some thought but turns out to be extremely
simple. Just pass the failure function of the wrapping promise to each
of the promises in the array as a `catch` handler so that a failure in
one of them triggers the failure of the whole wrapper.

hint}}
