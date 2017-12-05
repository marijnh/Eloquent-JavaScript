# Asynchronous Programming

A processor is...

The programs we have seen so far are things that will keep the
computer's processor busy until they have finished their work. The
speed in which a loop that manipulates numbers can be executed depends
entirely on the speed of the processor.

But many programs interact with things outside of the processor. For
example, they may communicate over a computer network. Or they might
request data from the hard disk, which is a lot slower than getting it
from memory.

When such a thing happens, it would be a shame to let the processor
sit and wait until it is finished. There might be some other work it
could do in the meantime. In part, this is automatically handled by
your operating system, which will switch the processor between
multiple running programs. But that doesn't help when we want a
_single_ program to be able to make progress when it is waiting for a
network request.

## Asynchronicity

One way to address this problem is to have the function for making
network requests return immediately, and then later notify the program
that it has finished, providing the result of the request. This is
called asynchronous programming.

I'll try to illustrate synchronous versus asynchronous I/O with a
small example, where a program needs to fetch two resources from the
Internet and then do some simple processing with the result.

{{index "synchronous I/O"}}

In a synchronous environment, where a network function only returns
after it has done its work, the easiest way to perform this task is to
make the requests one after the other. This method has the drawback
that the second request will be started only when the first has
finished. The total time taken will be at least the sum of the two
response times. This is not an effective use of the machine, which
will be mostly idle when it is transmitting and receiving data over
the ((network)).

{{index parallelism}}

The solution to this problem, in a synchronous system, is to start
additional ((thread))s of control. A thread is another program whose
execution the operating system may interleave with other
programs—since most modern computers contain multiple processors,
multiple threads may even run at the same time, on different
processor. A second thread could start the second request, and then
both threads wait for their results to come back, after which they
resynchronize to combine their results.

{{index CPU, blocking, "synchronous I/O", "asynchronous I/O", timeline, "callback function"}}

In the following diagram, the thick lines represent time the program
spends running normally, and the thin lines represent time spent
waiting for I/O. In the synchronous model, the time taken by I/O is
_part_ of the timeline for a given thread of control. In the
asynchronous model, starting an I/O action conceptually causes a
_split_ in the timeline. The thread that initiated the I/O continues
running, and the I/O itself is done alongside it, finally calling a
callback function when it is finished.

{{figure {url: "img/control-io.svg", alt: "Control flow for synchronous and asynchronous I/O",width: "8cm"}}}

{{index "control flow", "asynchronous programming", verbosity}}

Another way to describe the difference is that waiting for I/O to
finish is _implicit_ in the synchronous model, while it is _explicit_,
directly under our control, in the asynchronous one. But
asynchronicity cuts both ways. It makes expressing programs that do
not fit the straight-line model of control easier, but it also makes
expressing programs that do follow a straight line more awkward.

Both of the main JavaScript programming platforms—browsers and
Node.js—make operations that might take a while asynchronous, rather
than relying on threads. Since programming with threads is notoriously
hard (understanding what a program does is much more difficult when
it's doing multiple things at once), I think that this is a good
decision.

## Callbacks and promises

The classical, simplest way of doing asynchronous programming allows
programs to provide a function to call when an asynchronous action
finishes. For example, the `setTimeout` function, available both in
Node.js and in browsers, waits a given amount of milliseconds (a
second is thousand milliseconds) and then calls a function.

```{test: no}
setTimeout(() => console.log("tick"), 1000);
```

{{index "callback function", [function, callback]}}

Such a function is often called a _callback_ function. "Waiting" is
not generally a very useful type of work, but it can be useful when
doing something like showing a message for a few seconds and then
hiding it again.

Performing multiple asynchronous actions in a row using callbacks
means that you have to keep creating new functions that handle the
((continuation)) of the computation after the action.

As an example, here is some Node.js code that reads a file named
`package.json`, parses it as JSON, and then reads the file named in
the `main` property of the result.

```
const {readFile} = require("fs");
readFile("package.json", "utf8", package => {
  let {main} = JSON.parse(package);
  readFile(main, "utf8", script => {
    console.log(script);
  });
});
```

This is workable, but the indentation level increases with each
asynchronous action, and running multiple actions at the same time can
get a little tangled.

Surprisingly often, complicated concepts can be made easier by making
them values. In the case of asynchronous actions you could, instead of
directly arranging for a function to be called at some point in the
future, create an object that represents this future event.

This is what the standard class `Promise` is for. A promise is an
asynchronous action that will complete, producing a value, at some
point, and is able to notify anyone who is interested when that
happens.

The easiest way to create a promise is by calling `Promise.resolve`.
Such a promise will immediately succeed with the value you provide,
unless that value is already a promise, in which case it is simply
returned.

```
let fifteen = Promise.resolve(15);
fifteen.then(value => console.log(`Got ${value}`));
// → Got 15
```

The `then` method registers a ((callback function)) to be called when
the promise has a value. You can add multiple callbacks to a single
promise, and even if you add them after the promise has already
_resolved_ (finished), they will be called.

The result of calling `then` is another promise, the result of calling
`Promise.resolve` on the callback's return value. So waiting on the
result of a promise and doing something with it gives you another
promise, representing the outcome of those actions.

It is useful to think of promises as a device to move values into an
asynchronous universe. A normal value is simply there. A promised
value is a value that _might_ already be there or might appear at some
point in the future. Computations defined in terms of promises act on
such wrapped values and are executed asynchronously as the values
become available.

To define a promise, you can use `Promise` as a constructor. The
constructor expects a function as argument, which it immediately
calls, passing it a function that can be used to resolve the promise.

This is how you'd create a promise that waits a while and then
resolves to null:

```{includeCode: "top_lines: 5"}
function wait(delay) {
  return new Promise(resolve => {
    setTimeout(() => resolve(null), delay);
  });
}

wait(1000).then(() => console.log("A second passed"));
```

## Messenger drones

A little outside of town, in the forest by the creek, lives a pack of
feral computers. Feral computers aren't actually computers that have
gone feral—biologists believe that they've evolved separately from
human-made computers, and are most likely related to termite colonies.
They _do_ run JavaScript, because of convergent evolution.

Feral computers are very social, but also immobile. To communicate
with each other, they use messenger drones. The drones carry twigs or
pieces of grass which hold data as fine, engraved patterns. When they
arrive at their destination, these are decoded and processed, after
which the messenger receives a new data twig to carry back as
response.

We'll write some programs to run on these computers in this chapter.
Because managing messenger drones and engraving twigs is rather
complicated, that part is wrapped in a module called `messenger`,
which our programs will use.

```
import {sendMessenger} from "messenger";
sendMessenger("Under The Elderbush", {type: "Test"});
  .then(response => console.log("Got:", response));
```

The message-sending function first takes a destination address, and
then the message itself, any value that can be converted to JSON.
Because it may take messenger drones a while to reach their target,
sending a message is an asynchronous process.

## Failure

Regular JavaScript computations can fail by throwing an exception.
Asynchronous computations sometimes need a similar mechanism. A
network request may fail, or some code that was _part_ of the
asynchronous action may throw an exception.

```
wait(100).then(() => { throw new Error("BANG"); });
```

One of the most pressing problems with the pure callback style of
asynchronous programming was that it was extremely difficult to make
sure failures were properly reported to the callbacks. Typically, the
first argument to the callback is used to indicate that the action
failed, and the second contains the value produced by the action when
successful. Such callback functions have to always check whether they
received an exception, and make sure that any problems they cause,
including exceptions thrown by something they call, are caught and
given to the right function.

Promises make this a lot easier—`then` handlers are only called when
the action is successful, and failures (called "rejections" in the
promise jargon) are automatically propagated to the new promise that
is returned by `then`. So if any element in a chain of asynchronous
actions fails, the outcome of the whole chain is marked as rejected,
and no handlers are called beyond the point where it failed.

To explicitly handle such rejections, promises have a `catch` method,
which is analogous to the `try`/`catch` construct. Like `then`, you
give it a handler function, which is called only when the promise is
rejected. It returns a promise that resolves to the original promise's
result when that is successful, or to the return value of the `catch`
function when it was rejected.

The chains of promise values created by calls to `then` and `catch`
are analogous to the control flow of synchronous code. Regular
sequences of actions are created with `then`, and `catch` produces a
`try`/`catch` block. JavaScript environments can even detect when a
promise rejection isn't handled, and show an error when that happens.

One problem with the feral computers' messenger drones is that they
don't always arrive. They may get eaten by an aardwolf, blown away by
the wind, or get hit by some other accident. In that case, we can wait
for our promise forever. Let's write a wrapper for `sendMessenger`
that, if no response comes in for 200 milliseconds (to not test our
patience too much, we operate at an accelerated timescale), gives up.

```
import {sendMessenger} from "messenger"

function sendMessageTimeout(destination, message) {
  return new Promise((resolve, reject) => {
    sendMessage(destination, message).then(resolve);
    setTimeout(() => reject(new Error("Timed out")), 200);
  });
}
```

A function given to the `Promise` constructor gets a second argument,
which is a function that it can use to reject the new promise. After
200 milliseconds, `sendMessage` blindly calls this function to make
the promise time out. This is okay, because a promise can never be
both resolved and rejected—if you call `reject` after calling
`accept`, or vice-versa, it is ignored.

To get a better chance at a message and response arriving, we define a
`sendMessage` function that tries to send a given message three times
before giving up.

```
function sendMessage(destination, message) {
  function send(failure, tries) {
    if (retries <= 0) throw failure;
    return sendMessage(destination, message)
      .catch(failure => start(failure, tries - 1));
  }
  return send(null, 3);
}
```

There might be situations where a computer is completely unreachable,
such as when it died or when an aardwolf family has moved in next to
it. So no matter how often we try, there's no guarantee of being able
to deliver a message, and code that sends messages has to be able to
deal with failure.

## Collections of promises

Decisions involving multiple computers are traditionally made through
a vote in which the whole pack can participate. The computer called
_At The Pond_ wants to propose a repair to the North-South drone
highway's aardwolf fence.

Packs of feral computers are famous for always having a leader. This
is the computer who keeps track of all the other members of the pack
and who plays a central role in pack decisions. A leader is in regular
communication with the entire pack in order to notice when someone
dies, and welcomes new members.

At the moment, _Between The Round Stones_ is leading the pack. It can
be asked for a list of pack members by sending it a message whose
`type` property holds `"Pack Members"`.

```{includeCode: "top_lines: 5", test: no}
const leader = "Between The Round Stones";

function pack() {
  return sendMessage(leader, {type: "Pack Members"});
}

pack().then(list => console.log(list));
// → [...]
```

To make a decision, by the pack's rules, a vote must get a "yes" from
at least 60% of the computers. Computers that can not be reached count
as having voted "no".

How could we program this voting procedure? We can call `pack` to get
a list of names, and then send them all a message asking for their
vote, giving us an array of promises. You can write code that calls
`then` on all of them, and set up the handlers so that the last one
resolves the actual vote. But there's a function available that does
just that for you: `Promise.all`. You give it an array of promises,
and it gives you back a promise that resolves to an array of result
values, or rejects if any of the given promises reject.

```
const myself = "At The Pond";

function vote(proposal) {
  return pack().then(computers => {
    let voting = computers.map(name => {
      if (name == myself) return Promise.resolve(true);
      return sendMessage(name, {type: "Vote", proposal})
        .catch(() => false);
    });
    return Promise.all(voting).then(votes => {
      let count = votes.filter(v => v).length;
      return count >= 0.6 * votes.length;
    });
  });
}


vote("Repair the aardwolf fence on the North-South highway")
  .then(ok => console.log(ok ? "Accepted" : "Rejected"));
```

The array of names is converted to an array of vote-in-progress
promises. No message is sent to the computer that started the vote—it
is assumed to be in favor. Rejections from `sendMessage` are handled
explicitly with a `catch` call, so that, instead of making the whole
vote fail, they default to a "no" vote.

## Async functions

For long-term memory, some of the members of a feral computer pack
grow specialized data storage bulbs. Each pack has a handful of such
keepers, which all preserve a copy of the pack memory. The pack leader
will tell you who the keepers are if you send it a message with `"Pack
Keepers"` as its type.

You could write code that retrieves a memory value like this:

```
function keepers() {
  return sendMessage(leader, {type: "Pack Keepers"});
}

function retrieveMemory(name) {
  return keepers().then(keeperNames => {
    return new Promise((resolve, reject) => {
      function tryNextKeeper(i) {
        if (i == keeperNames.length * 3) {
          reject(new Error("Failed to reach a keeper"));
        }
        let target = keeperNames[i % keeperNames.length];
        sendMessageTimeout(target, {type: "Retrieve", name})
         .then(accept)
         .catch(tryNextKeeper(i + 1));
      }
      tryNextKeeper(0);
    });
  });
}

retrieveMemory("At The Pond, 2017-01-04")
  .then(console.log);
```

This uses a recursive function (`tryNextKeeper`) as a kind of
asynchronous loop, trying each keeper in order until a response comes
back or they've all been tried three times, at which point it gives
up.

This is a somewhat awkward way to program—looping over a set of names
would be really easy in a synchronous style of programming, but here,
we have to write a noisy, difficult to read function.

Fortunately, JavaScript has recently grown another feature to help
with this. An `async` function is a function that implicitly returns a
promise, and that can, in its body `await` other promises in a way
that _looks_ synchronous.

We can write `retrieveMemory` like this now:

```
async function retrieveMemory(name) {
  let keeperNames = await keepers();
  for (let i = 0; i < 3 * keeperNames.length; i++) {
    try {
      return await sendMessageTimeout(
        keeperNames[i % keeperNames.length];
        {type: "Retrieve", name});
    } catch(_) {}
  }
  throw new Error("Failed to reach a keeper");
}
```

An `async` function is marked by the word `async` before the
`function` keywords. Methods can also be `async`, by writing `async`
before their name. When such a function is called, it returns a
promise. If it returns something, that promise is resolved. If it
throws an exception, the promise is rejected.

Inside an `async` function, the word `await` can be put in front of an
expression (which should usually be a promise) to wait for that
expression to resolve, and only then continue the execution of the
function.

So such a function no longer, like a regular JavaScript function, runs
from start to completion in one go. Instead, it can be "frozen" at any
point that has an `await`, and resumed at a later time.

## Generators

This ability of functions to be paused and then resumed again is not
exclusive to `async` functions. JavaScript also provides
_((generator))_ functions, which are similar, but without the
promises.

When you define a function with `function*` (placing as asterisk after
the word `function`), it becomes a generator. When you call a
generator, it returns an iterator, which we saw in [Chapter
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

Initially, the function is frozen at its start. Every time you call
`next` on that iterator, the function starts running, until it finds a
`yield` expression, which pauses it and causes the yielded value to
become the next value produced by the iterator. When the function
returns (the one in the example never does), the iterator is done.

Writing iterators is often much easier when you use generator
functions. The iterator for a list object (from the exercise in
[Chapter ?](object#list_iterator)) can be written like this:

```
List[Symbol.iterator] = function*() {
  for (let node = this; node != List.empty;
       node = node.rest) {
    yield node.value;
  }
};
```

There's no longer a need to create an object to hold the iteration
state—generators automatically save their local state every time they
yield.

So an `async` function is a special type of generator. It produces a
promise when called, which is resolved when it returns (finishes) and
rejected when it throws an exception. Whenever it yields (awaits) a
promise, the result of that promise (value or exception) is given back
to it when it finishes.

## The event loop

Asynchronous programs are executed piece by piece. Each piece may
start some actions, and schedule code to be executed when the action
finishes or fails. In between these pieces, the program sits idle,
waiting for the next action.

So callbacks are not directly called by the code that scheduled them.
If I call `setTimeout` from within a function, that function will have
returned by the time the callback function is called. And when the
callback returns, control does not go back to the function that
scheduled it.

Asynchronous behavior happens on its own, empty function call stack.
This is one of the reasons that, without promises, managing exceptions
across asynchronous code is hard. Since each callback starts with a
mostly empty stack, your `catch` handlers won't be on the stack when
they throw an exception.

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

No matter how closely together events, such as timeouts or returning
messenger drones, happen, a JavaScript environment will only run one
program at a time. You can think of this as it running a big loop
_around_ your program, called the event loop. When there's nothing to
be done, that loop is stopped. But as soon as events come in, they are
added to a queue and the corresponding code is executed one after the
other. Because no two run at the same time, slow-running code might
delay the handling of other events.

This example sets a timeout, but then dallies until after the
timeout's intented point of time, causing the timeout to be late.

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

Promises always resolve or reject in a new event. Even if a promise is
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

When your program runs synchronously, in a single go, there are no
state changes happening except those that the program itself makes.
For asynchronous programs, which may have "gaps" in their execution
where other code may run, this is different.

One of the hobbies of our pack of computers is to count the amount of
orchids that bloom in the forest every year. Each computer counts the
number of orchids in its territory, and tells the others about it if
they ask.

This slightly contrived function builds a list of computer names and
orchid counts.

```
async function orchidList() {
  let computers = await pack();
  let list = "";
  await Promise.all(computers.map(async name => {
    list += `${name}: ${
      await sendMessage(name, {type: "Orchid Count"})
    }\n`;
  }));
  return list;
}
```

The `async name =>` part defines an `async` arrow function.

The code doesn't immediately look suspicious... but it is seriously
broken. It'll always return only a single line of output, listing the
computer that was slowest to respond.

Can you work out why?

The problem lies in the `+=` operator, which takes the _current_ value
of `list` at the time where the statement start executing, and, when
the statement finishes executing, sets the `list` binding to be that
current value plus the information about a single computer.

But between the time where the statement starts executing and the time
where it finishes there's an `await` expression, which means there's
an asyncronous "gap" there. The `computers.map` expression runs before
anything has been added to the list, so each of the `+=` operators
starts from an empty list and end up, when its `sendMessage` finishes,
setting `list` to a single-line list.

This could have easily been avoided by returning the lines from the
mapped promises and calling `join` on the result of `Promise.all`,
instead of building up the list by changing a binding. As usual,
computing new values is less error-prone than changing existing
values. But mistakes like this are easy to make, especially when using
`await`, and you should be aware of where the gaps in your code occur.

```
async function orchidList() {
  let computers = await pack();
  return (await Promise.all(computers.map(async name => {
    return `${name}: ${
      await sendMessage(name, {type: "Orchid Count"})
    }`;
  }))).join("\n");
}
```

## Summary

Asynchronous programming makes it possible to express programs that
wait for long-running actions without freezing the program during
these actions. JavaScript environments typically implement this style
of programming using callbacks, functions that are called when the
actions complete. An event loop schedules such callbacks to be called
when appropriate, one after the other, so that their execution does
not overlap.

Programming asynchronously is made easier by promises, objects that
represent actions that might complete in the future, and `async`
functions, which allow you to write an asynchronous program as if it
is synchronous.

## Exercises

### Family tree

Each feral computer was settled by drones splitting off from another
one, its parent computer. You can send a computer a message with a
`type` property of `"Parent"` to ask it who its parent is.

Write an `async` function `findElder` that, for a given computer,
finds its oldest ancestor that is still part of the pack, or returns
the computer's own name if its direct parent isn't part of the pack
anymore. Use the `pack` function from earlier in the chapter to
determine whether a given parent is still in the pack.

If any of the messages sent by the function fail, the whole function
may fail.

{{if interactive

```{test: no}
async function findElder(computer) {
  // Your code here
}

findElder("In The High Grass").then(console.log);
// → Under The Hollybush
```

if}}

### Building Promise.all

{{index "Promise constructor", "Promise.all function", "building Promise.all (exercise)"}}

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
all([]).then(array => {
  console.log("This should be []:", array);
});
function soon(val) {
  return new Promise(accept => {
    setTimeout(() => accept(val), Math.random() * 500);
  });
}
all([soon(1), soon(2), soon(3)]).then(array => {
  console.log("This should be [1, 2, 3]:", array);
});
all([soon(1), Promise.reject("X"), soon(3)]).then(array => {
  console.log("We should not get here");
}).catch(error => {
  if (error != "X") {
    console.log("Unexpected failure:", error);
  }
});
```

if}}

{{hint

{{index "Promise.all function", "Promise constructor", "then method", "building Promise.all (exercise)"}}

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
