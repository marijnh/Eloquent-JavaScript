{{meta {chap_num: 4, prev_link: 03_functions, next_link: 05_higher_order, load_files: ["code/jacques_journal.js", "code/chapter/04_data.js"], zip: "node/html"}}}

# Data Structures: Objects and Arrays

{{quote {author: "Charles Babbage", title: "Passages from the Life of a Philosopher (1864)", chapter: true}

On two occasions I have been asked, ‘Pray, Mr. Babbage, if you put
into the machine wrong figures, will the right answers come out?’
[...] I am not able rightly to apprehend the kind of confusion of
ideas that could provoke such a question.

quote}}

{{index "Babbage, Charles", object, "data structure"}}

Numbers, Booleans, and strings are the atoms that ((data)) structures
are built from. Many types of information require more than one
atom, though. _Objects_ allow us to group values—including other
objects—together to build more complex structures.

The programs we have built so far have been limited by the fact that
they were operating only on simple data types. This chapter will
introduce basic data structures. By the end of it, you'll know enough
to start writing useful programs.

The chapter will work through a more or less realistic programming
example, introducing concepts as they apply to the problem at hand.
The example code will often build on functions and bindings that were
introduced earlier in the text.

{{if book

The online coding ((sandbox)) for the book
(http://eloquentjavascript.net/code[_eloquentjavascript.net/code_])
provides a way to run code in the context of a specific chapter. If
you decide to work through the examples in another environment, be
sure to first download the full code for this chapter from the sandbox
page.

if}}

## The weresquirrel

{{index "weresquirrel example", lycanthropy}}

Every now and then, usually between eight and ten in the evening,
((Jacques)) finds himself transforming into a small furry rodent with
a bushy tail.

On one hand, Jacques is quite glad that he doesn't have classic
lycanthropy. Turning into a squirrel does cause fewer problems than
turning into a wolf. Instead of having to worry about accidentally
eating the neighbor (_that_ would be awkward), he worries about being
eaten by the neighbor's cat. After two occasions where he woke up on a
precariously thin branch in the crown of an oak, naked and
disoriented, he has taken to locking the doors and windows of his room
at night and putting a few walnuts on the floor to keep himself busy.

{{figure {url: "img/weresquirrel.png", alt: "The weresquirrel"}}}

That takes care of the cat and tree problems. But Jacques would prefer
to get rid of his condition entirely. The irregular occurrences of the
transformation make him suspect that they might be triggered by
something. For a while, he believed that it happened only on days when
he had been near oak trees. But avoiding oak trees did not cause the
problem to stop.

{{index journal}}

Switching to a more scientific approach, Jacques has started keeping a
daily log of everything he does on a given day and whether he changed
form. With this data he hopes to narrow down the conditions that
trigger the transformations.

The first thing he needs is a data structure to store this
information.

## Data sets

{{index "data structure"}}

To work with a chunk of digital data, we'll first have to find a way
to represent it in our machine's ((memory)). Say, as an example, that
we want to represent a ((collection)) of numbers: 2, 3, 5, 7, and 11.

{{index string}}

We could get creative with strings—after all, strings can have any
length, so we can put a lot of data into them—and use `"2 3 5 7 11"`
as our representation. But this is awkward. You'd have to somehow
extract the digits and convert them back to numbers to access them.

{{index [array, creation], "[] (array)"}}

Fortunately, JavaScript provides a data type specifically for storing
sequences of values. It is called an _array_ and is written as a list
of values between ((square brackets)), separated by commas.

```
let listOfNumbers = [2, 3, 5, 7, 11];
console.log(listOfNumbers[2]);
// → 5
console.log(listOfNumbers[0]);
// → 2
console.log(listOfNumbers[2 - 1]);
// → 3
```

{{index "[] (subscript)", [array, indexing]}}

The notation for getting at the elements inside an array also uses
((square brackets)). A pair of square brackets immediately after an
expression, with another expression inside of them, will look up the
element in the left-hand expression that corresponds to the
_((index))_ given by the expression in the brackets.

{{id array_indexing}}
{{index "zero-based counting"}}

The first index of an array is zero, not one. So the first element is
read with `listOfNumbers[0]`. This convention takes some getting used
to. Zero-based counting has a long tradition in technology, and in
certain ways makes a lot of sense. Think of the index as the amount of
items to skip, counting from the start of the array.

{{id properties}}

## Properties

{{index "Math object", "Math.max function", ["length property", "for string"], [object, property], "period character"}}

We've seen a few suspicious-looking expressions like `myString.length`
(to get the length of a string) and `Math.max` (the maximum function)
in past examples. These are expressions that access a _((property))_
of some value. In the first case, we access the `length` property of
the value in `myString`. In the second, we access the property named
`max` in the `Math` object (which is a collection of
mathematics-related values and functions).

{{index property, null, undefined}}

Almost all JavaScript values have properties. The exceptions are
`null` and `undefined`. If you try to access a property on one of
these nonvalues, you get an error.

```{test: no}
null.length;
// → TypeError: Cannot read property 'length' of null
```

{{indexsee "dot character", "period character"}}
{{index "[] (subscript)", "period character", "square brackets", "computed property"}}

The two main ways to access properties in JavaScript are with a dot
and with square brackets. Both `value.x` and `value[x]` access a
((property)) on `value`—but not necessarily the same property. The
difference is in how `x` is interpreted. When using a dot, the word
after the dot is the literal name of the property. When using square
brackets, the expression between the brackets is _evaluated_ to get
the property name. Whereas `value.x` fetches the property of `value`
named “x”, `value[x]` tries to evaluate the expression `x` and uses
the result as the property name.

So if you know that the property you are interested in is called
“length”, you say `value.length`. If you want to extract the property
named by the value held in the binding `i`, you say `value[i]`.
Property names can be any string, and the dot notation only allows
names that look like valid binding names, so if you want to access a
property named “2” or “John Doe”, you must use square brackets:
`value[2]` or `value["John Doe"]`.

The elements in an ((array)) are stored as the array's properties, using
numbers as property names. Because you can't use the dot notation with
numbers, and usually want to use a binding that holds the index
anyway, you have to use the bracket notation to get at them.

{{index ["length property", "for array"], [array, "length of"]}}

The `length` property of an array tells us how many elements it has.
This property name is a valid binding name, and we know its name in
advance, so to find the length of an array, you typically write
`array.length` because it is easier to write than `array["length"]`.

{{id methods}}
## Methods

{{index [function, "as property"], method, string}}

Both string and array objects contain, in addition to the `length`
property, a number of properties that hold function values.

```
let doh = "Doh";
console.log(typeof doh.toUpperCase);
// → function
console.log(doh.toUpperCase());
// → DOH
```

{{index "case conversion", "toUpperCase method", "toLowerCase method"}}

Every string has a `toUpperCase` property. When called, it will return
a copy of the string in which all letters have been converted to
uppercase. There is also `toLowerCase`, going the other way.

{{index this}}

Interestingly, even though the call to `toUpperCase` does not pass any
arguments, the function somehow has access to the string `"Doh"`, the
value whose property we called. How this works is described in
[Chapter 6](06_object.html#obj_methods).

Properties that contain functions are generally called _methods_ of
the value they belong to. As in, “_toUpperCase_ is a method of a
string”.

{{id array_methods}}

This example demonstrates two methods you can use to manipulate
arrays:

```
let sequence = [1, 2, 3];
sequence.push(4);
sequence.push(5);
console.log(sequence);
// → [1, 2, 3, 4, 5]
console.log(sequence.pop());
// → 5
console.log(sequence);
// → [1, 2, 3, 4]
```

{{index collection, array, "push method", "pop method"}}

The `push` method adds values to the end of an array, and the the
`pop` method does the opposite, removing the last value in the array
and returning it.

These somewhat silly names are the traditional terms for operations on
a _((stack))_. A stack, in programming, is a ((data structure)) that
allows you to push values into it and pop them out again in the
opposite order—the thing that was added last is removed first. These
are common in programming—you might remember the function ((call
stack)) from [the previous chapter](03_functions.html#stack), which is
an instance of the same idea.

## Objects

{{index journal, "weresquirrel example", array, record}}

Back to the weresquirrel. A set of daily log entries can be
represented as an array. But the entries do not consist of just a
number or a string—each entry needs to store a list of activities and
a Boolean value that indicates whether Jacques turned into a squirrel
or not. Ideally, we would like to group these together into a single
value and then put those grouped values into an array of log entries.

{{index syntax, property, "curly braces", "{} (object)"}}

Values of the type _((object))_ are arbitrary collections of
properties. One way to create an object is by using curly brace
notation.

```
let day1 = {
  squirrel: false,
  events: ["work", "touched tree", "pizza", "running"]
};
console.log(day1.squirrel);
// → false
console.log(day1.wolf);
// → undefined
day1.wolf = false;
console.log(day1.wolf);
// → false
```

{{index [quoting, "of object properties"], "colon character"}}

Inside the curly braces, we give a list of properties separated by
commas. Each property has a name, after the colon, a value. When an
object is written over multiple lines, indenting it like in the
example helps readability. Properties whose names are not valid
binding names or numbers have to be quoted.

```
let descriptions = {
  work: "Went to work",
  "touched tree": "Touched a tree"
};
```

This means that ((curly braces)) have _two_ meanings in JavaScript. At
the start of a ((statement)), they start a ((block)) of statements. In
any other position, they describe an object. Fortunately, it is almost
never useful to start a statement with a curly-brace object, so
ambiguity between these two uses is rare.

{{index undefined}}

Reading a property that doesn't exist will produce the value
`undefined`, which happens the first time we try to read the `wolf`
property.

{{index [property, assignment], mutability, "= operator"}}

It is possible to assign a value to a property expression with the `=`
operator. This will replace the property's value if it already existed
or create a new property on the object if it didn't.

{{index "tentacle (analogy)", [property, "model of"]}}

To briefly return to our tentacle model of ((binding))s—property
bindings are similar. They _grasp_ values, but other bindings and
properties might be holding onto those same values. You may think of
objects as octopuses with any number of tentacles, each of which has a
name tattooed on it.

{{figure {url: "img/octopus-object.jpg", alt: "Artist's representation of an object"}}}

{{index "delete operator", [property, deletion]}}

The `delete` operator cuts off a tentacle from such an octopus. It is
a unary operator that, when applied to a property access expression,
will remove the named property from the object. This is not a common
thing to do, but it is possible.

```
let anObject = {left: 1, right: 2};
console.log(anObject.left);
// → 1
delete anObject.left;
console.log(anObject.left);
// → undefined
console.log("left" in anObject);
// → false
console.log("right" in anObject);
// → true
```

{{index "in operator", [property, "testing for"], object}}

The binary `in` operator, when applied to a string and an object,
tells you whether that object has that property. The difference
between setting a property to `undefined` and actually deleting it is
that, in the first case, the object still _has_ the property (it just
doesn't have a very interesting value), whereas in the second case the
property is no longer present and `in` will return `false`.

{{index "Object.keys function"}}

To find out what properties an object has, you can use the
`Object.keys` function. You give it an object, and it returns an array
of strings—the object's property names.

```
console.log(Object.keys({x: 0, y: 0, z: 2}));
// → ["x", "y", "z"]
```

{{index array, collection}}

Arrays, then, are just a kind of object specialized for storing
sequences of things. If you evaluate `typeof []`, it produces
`"object"`. You can see them as long, flat octopuses with all their
arms in a neat row, labeled with numbers.

{{figure {url: "img/octopus-array.jpg", alt: "Artist's representation of an array"}}}

{{index journal, "weresquirrel example"}}

So we can represent Jacques’ journal as an array of objects.

```{test: wrap}
let journal = [
  {events: ["work", "touched tree", "pizza",
            "running", "television"],
   squirrel: false},
  {events: ["work", "ice cream", "cauliflower",
            "lasagna", "touched tree", "brushed teeth"],
   squirrel: false},
  {events: ["weekend", "cycling", "break", "peanuts",
            "beer"],
   squirrel: true},
  /* and so on... */
];
```

## Mutability

We will get to actual programming _real_ soon now. But first, there's
one more piece of theory to understand.

{{index mutability, "side effect", number, string, Boolean, object}}

We saw that object values can be modified. The types of values
discussed in earlier chapters, such as numbers, strings, and Booleans,
are all _immutable_—it is impossible to change an existing value of
those types. You can combine them and derive new values from them, but
when you take a specific string value, that value will always remain
the same. The text inside it cannot be changed. If you have reference
to a string that contains `"cat"`, it is not possible for other code
to change a character in your string to make it spell `"rat"`.

With objects, on the other hand, the content of a value _can_ be
modified by changing its properties.

{{index [object, identity], identity, memory}}

When we have two numbers, 120 and 120, we can consider them precisely
the same number, whether or not they refer to the same physical bits.
But with objects, there is a difference between having two references
to the same object and having two different objects that contain the
same properties. Consider the following code:

```
let object1 = {value: 10};
let object2 = object1;
let object3 = {value: 10};

console.log(object1 == object2);
// → true
console.log(object1 == object3);
// → false

object1.value = 15;
console.log(object2.value);
// → 15
console.log(object3.value);
// → 10
```

{{index "tentacle (analogy)", [binding, "model of"]}}

The `object1` and `object2` bindings grasp the _same_ object, which
is why changing `object1` also changes the value of `object2`. The
binding `object3` points to a different object, which initially
contains the same properties as `object1` but lives a separate life.

{{index "== operator", [comparison, "of objects"], "deep comparison"}}

JavaScript's `==` operator, when comparing objects, will return `true`
only if both objects are precisely the same value. Comparing different
objects will return `false`, even if they have identical contents.
There is no “deep” comparison operation built into JavaScript, which
looks at object's contents, but it is possible to write it yourself
(which will be one of the
[exercises](04_data.html#exercise_deep_compare) at the end of this
chapter).

## The lycanthrope's log

{{index "weresquirrel example", lycanthropy, "addEntry function"}}

So Jacques starts up his JavaScript interpreter and sets up the
environment he needs to keep his ((journal)).

```{includeCode: true}
let journal = [];

function addEntry(events, squirrel) {
  journal.push({events, squirrel});
}
```

{{index "curly braces", "{} (object)"}}

Note that the object added to the journal looks a little odd. Instead
of declaring properies like `events: events`, it just gives a
((property)) name. This is a short-hand that means the same thing—if a
property name in object notation isn't followed by a colon, its value
is the value of the binding with the same name in the current scope.

So then, every evening at ten—or sometimes the next morning, after
climbing down from the top shelf of his bookcase—he records the day.

```
addEntry(["work", "touched tree", "pizza", "running",
          "television"], false);
addEntry(["work", "ice cream", "cauliflower", "lasagna",
          "touched tree", "brushed teeth"], false);
addEntry(["weekend", "cycling", "break", "peanuts",
          "beer"], true);
```

Once he has enough data points, Jacques intends to use statistics to
find out which of these events may be related to the
squirrelifications.

{{index correlation}}

_Correlation_ is a measure of ((dependence)) between statistical
variables. A statistical variable is not quite the same as a
programming variable. In statistics you typically have a set of
_measurements_, and each variable is measured for every measurement.
Correlation between variables is usually expressed as a value that
ranges from -1 to 1. Zero correlation means the variables are not
related, whereas a correlation of one indicates that the two are
perfectly related—if you know one, you also know the other. Negative
one also means that the variables are perfectly related but that they
are opposites—when one is true, the other is false.

{{index "phi coefficient"}}

To compute the measure of correlation between two Boolean variables,
we can use the "phi coefficient" (_ϕ_). This is a formula whose input
is a ((frequency table)) containing the amount of times the different
combinations of the variables were observed. The output of the formula
is a number between -1 and 1 that describes the correlation.

We could take the event of eating ((pizza)) and put that in a
frequency table like this, where each number indicates the amount of
times that combination occurred in our measurements:

{{figure {url: "img/pizza-squirrel.svg", alt: "Eating pizza versus turning into a squirrel", width: "7cm"}}}

If we call that table _n_, we can compute _ϕ_ using the following formula:

{{if html

<div>
<style scoped="scoped">sub { font-size: 60%; }</style>
<table style="border-collapse: collapse; margin-left: 1em;"><tr>
  <td style="vertical-align: middle"><em>ϕ</em> =</td>
  <td style="padding-left: .5em">
    <div style="border-bottom: 1px solid black; padding: 0 7px;"><em>n</em><sub>11</sub><em>n</em><sub>00</sub> -
      <em>n</em><sub>10</sub><em>n</em><sub>01</sub></div>
    <div style="padding: 0 7px;">√<span style="border-top: 1px solid black; position: relative; top: 2px;">
      <span style="position: relative; top: -4px"><em>n</em><sub>1•</sub><em>n</em><sub>0•</sub><em>n</em><sub>•1</sub><em>n</em><sub>•0</sub></span>
    </span></div>
  </td>
</tr></table>
</div>

if}}

{{if tex

[\begin{equation}\varphi = \frac{n_{11}n_{00}-n_{10}n_{01}}{\sqrt{n_{1\bullet}n_{0\bullet}n_{\bullet1}n_{\bullet0}}}\end{equation}]{latex}

if}}

(If at this point you're putting the book down to focus on a terrible
flashback to 10th grade math class—hold on! I do not intend to torture
you with endless pages of cryptic notation—just this one formula for
now. And even with that one, all we do is turn it into JavaScript.)

The notation [_n_~01~]{if html}[[$n_{01}$]{latex}]{if tex} indicates
the number of measurements where the first variable (squirrelness) is
false (0) and the second variable (pizza) is true (1). In the pizza
table, [_n_~01~]{if html}[[$n_{01}$]{latex}]{if tex} is 9.

The value [_n_~1•~]{if html}[[$n_{1\bullet}$]{latex}]{if tex} refers
to the sum of all measurements where the first variable is true, which
is 5 in the example table. Likewise, [_n_~•0~]{if
html}[[$n_{\bullet0}$]{latex}]{if tex} refers to the sum of the
measurements where the second variable is false.

{{index correlation, "phi coefficient"}}

So for the pizza table, the part above the division line (the
dividend) would be 1×76 - 4×9 = 40, and the part below it (the
divisor) would be the square root of 5×85×10×80, or [√340000]{if
html}[[$\sqrt{340000}$]{latex}]{if tex}. This comes out to _ϕ_ ≈
0.069, which is tiny. Eating ((pizza)) does not appear to have
influence on the transformations.

## Computing correlation

{{index [array, "as table"], [nesting, "of arrays"]}}

We can represent a two-by-two ((table)) in JavaScript with a
four-element array (`[76, 9, 4, 1]`). We could also use other
representations, such as an array containing two two-element arrays
(`[[76, 9], [4, 1]]`) or an object with property names like `"11"` and
`"01"`, but the flat array is simple and makes the expressions that
access the table pleasantly short. We'll interpret the indices to the
array as two-((bit)) ((binary number))s, where the leftmost (most
significant) digit refers to the squirrel variable and the rightmost
(least significant) digit refers to the event variable. For example,
the binary number `10` refers to the case where Jacques did turn into
a squirrel, but the event (say, "pizza") didn't occur. This happened
four times. And since binary `10` is 2 in decimal notation, we will
store this number at index 2 of the array.

{{index "phi coefficient", "phi function"}}

This is the function that computes the _ϕ_ coefficient from such an
array:

```{includeCode: strip_log, test: clip}
function phi(table) {
  return (table[3] * table[0] - table[2] * table[1]) /
    Math.sqrt((table[2] + table[3]) *
              (table[0] + table[1]) *
              (table[1] + table[3]) *
              (table[0] + table[2]));
}

console.log(phi([76, 9, 4, 1]));
// → 0.068599434
```

{{index "square root", "Math.sqrt function"}}

This is a direct translation of the _ϕ_ formula into JavaScript.
`Math.sqrt` is the square root function, as provided by the `Math`
object in a standard JavaScript environment. We have to add two fields
from the table to get fields like [n~1•~]{if
html}[[$n_{1\bullet}$]{latex}]{if tex} because the sums of rows or
columns are not stored directly in our data structure.

{{index "JOURNAL data set"}}

Jacques kept his journal for three months. The resulting ((data set))
is available in the coding sandbox for this
chapter[ ([_eloquentjavascript.net/code#4_](http://eloquentjavascript.net/code#4)]{if
book}, where it is stored in the `JOURNAL` binding, and in a
downloadable [file](http://eloquentjavascript.net/code/jacques_journal.js).

{{index "tableFor function"}}

To extract a two-by-two ((table)) for a specific event from the
journal, we must loop over all the entries and tally how many times
the event occurs in relation to squirrel transformations.

```{includeCode: strip_log}
function tableFor(event, journal) {
  let table = [0, 0, 0, 0];
  for (let i = 0; i < journal.length; i++) {
    let entry = journal[i], index = 0;
    if (entry.events.includes(event)) index += 1;
    if (entry.squirrel) index += 2;
    table[index] += 1;
  }
  return table;
}

console.log(tableFor("pizza", JOURNAL));
// → [76, 9, 4, 1]
```

{{index [array, searching], "includes method"}}

Arrays have an `includes` method that checks whether a given value
exists in the array. The function uses that to determine whether the
event name it is interested in is part of the event array for a given
entry.

{{index [array, indexing]}}

The body of the loop in `tableFor` figures out which box in the table
each journal entry falls into by checking whether the entry contains
the specific event it's interested in and whether the event happens
alongside a squirrel incident. The loop then adds one to the correct
box in the table.

We now have the tools we need to compute individual ((correlation))s.
The only step remaining is to find a correlation for every type of
event that was recorded and see whether anything stands out.

{{id for_of_loop}}

## Array loops

{{index "for loop", loop, [array, iteration]}}

In the `tableFor` function, there's a loop like this:

```
for (let i = 0; i < JOURNAL.length; i++) {
  let entry = JOURNAL[i];
  // Do something with entry
}
```

This kind of loop is common in classical JavaScript—going over arrays
one element at a time is something that comes up a lot, and to do that
you'd run a counter over the length of the array and pick out each
element in turn.

There is a simpler way to write such loops.

```
for (let entry of JOURNAL) {
  console.log(`${entry.events.length} events.`);
}
```

{{index "for/of loop"}}

When a `for` loops looks like this, with the word `of` after a
variable definition, it will loop over the elements of the value given
after `of`. This works not only for arrays, but also for strings and
some other data structures. We'll discuss _how_ it works in [Chapter
6](06_object.html).

{{id analysis}}

## The final analysis

{{index journal, "weresquirrel example", "journalEvents function"}}

We need to compute a correlation for every type of event that occurs
in the data set. To do that, we first need to _find_ every type of
event.

{{index "includes method", "push method"}}

```{includeCode: "strip_log"}
function journalEvents(journal) {
  let events = [];
  for (let entry of journal) {
    for (let event of entry.events) {
      if (!events.includes(event)) {
        events.push(event);
      }
    }
  }
  return events;
}

console.log(journalEvents(JOURNAL));
// → ["carrot", "exercise", "weekend", "bread", …]
```

By going over all the events, and adding those that aren't already in
there to the `events` array, this collects every type of event.

Using that, we can see all the ((correlation))s.

```{test: no}
for (let event of journalEvents(JOURNAL)) {
  console.log(event + ":", phi(tableFor(event, JOURNAL)));
}
// → carrot:   0.0140970969
// → exercise: 0.0685994341
// → weekend:  0.1371988681
// → bread:   -0.0757554019
// → pudding: -0.0648203724
// and so on...
```

Most correlations seem to lie close to zero. Eating carrots, bread, or
pudding apparently does not trigger squirrel-lycanthropy. It _does_
seem to occur somewhat more often on weekends. Let's filter the
results to show only correlations greater than 0.1 or less than -0.1.

```{test: no}
for (let event of journalEvents(JOURNAL)) {
  let correlation = phi(tableFor(event, JOURNAL));
  if (correlation > 0.1 || correlation < -0.1) {
    console.log(event + ":", correlation);
  }
}
// → weekend:        0.1371988681
// → brushed teeth: -0.3805211953
// → candy:          0.1296407447
// → work:          -0.1371988681
// → spaghetti:      0.2425356250
// → reading:        0.1106828054
// → peanuts:        0.5902679812
```

A-ha! There are two factors whose ((correlation)) is clearly stronger
than the others. Eating ((peanuts)) has a strong positive effect on
the chance of turning into a squirrel, whereas brushing his teeth has
a significant negative effect.

Interesting. Let's try something.

```{includeCode: strip_log}
for (let entry of JOURNAL) {
  if (entry.events.includes("peanuts") &&
     !entry.events.includes("brushed teeth")) {
    entry.events.push("peanut teeth");
  }
}
console.log(phi(tableFor("peanut teeth", JOURNAL)));
// → 1
```

That's a very clear result. The phenomenon occurs precisely when
Jacques eats ((peanuts)) and fails to brush his teeth. If only he
weren't such a slob about dental hygiene, he'd have never even noticed
his affliction.

Knowing this, Jacques stops eating peanuts altogether and finds that
his transformations don't come back.

{{index "weresquirrel example"}}

For a few years, things go great for Jacques. But at some point he
loses his job. Because he lives in a nasty country where being without
job means being without medical services, he is forced to take
employment with a ((circus)) where he performs as _The Incredible
Squirrelman_, stuffing his mouth with peanut butter before every show.

One day, fed up with this pitiful existence, Jacques fails to change
back into his human form, hops through a crack in the circus tent, and
vanishes into the forest. He is never seen again.

## Further arrayology

{{index [array, methods], method}}

Before finishing up this chapter, I want to introduce you to a few
more object-related concepts. We'll start by introducing some
generally useful array methods.

{{index "push method", "pop method", "shift method", "unshift method"}}

We saw `push` and `pop`, which add and remove elements at the
end of an array, [earlier](04_data.html#array_methods) in this
chapter. The corresponding methods for adding and removing things at
the start of an array are called `unshift` and `shift`.

```
let todoList = [];
function remember(task) {
  todoList.push(task);
}
function getTask() {
  return todoList.shift();
}
function rememberUrgently(task) {
  todoList.unshift(task);
}
```

{{index "task management example"}}

That program manages queue of tasks. You add tasks to the end of the
queue by calling `remember("groceries")`, and when you're ready to do
something, you call `getTask()` to get (and remove) the front item
from the queue. The `rememberUrgently` function also adds a task but
adds it to the front instead of the back of the queue.

{{index [array, searching], "indexOf method", "lastIndexOf method"}}

To search for a specific value, arrays provide an `indexOf` method. It
goes through the array from the start to the end, and returns the
index at which the requested value was found—or -1 if it wasn't found.
To search from the end instead of the start, there's a similar method
called `lastIndexOf`.

```
console.log([1, 2, 3, 2, 1].indexOf(2));
// → 1
console.log([1, 2, 3, 2, 1].lastIndexOf(2));
// → 3
```

Both `indexOf` and `lastIndexOf` take an optional second argument that
indicates where to start searching.

{{index "slice method", [array, indexing]}}

Another fundamental array method is `slice`, which takes a start index
and an end index and returns an array that has only the elements
between those indices. The start index is inclusive, the end index
exclusive.

```
console.log([0, 1, 2, 3, 4].slice(2, 4));
// → [2, 3]
console.log([0, 1, 2, 3, 4].slice(2));
// → [2, 3, 4]
```

{{index [string, indexing]}}

When the end index is not given, `slice` will take all of the elements
after the start index.

{{index concatenation, "concat method"}}

The `concat` method can be used to glue arrays together, similar to
what the `+` operator does for strings. The following example shows
both `concat` and `slice` in action. It takes an array and an index,
and it returns a new array that is a copy of the original array with
the element at the given index removed.

```
function remove(array, index) {
  return array.slice(0, index)
    .concat(array.slice(index + 1));
}
console.log(remove(["a", "b", "c", "d", "e"], 2));
// → ["a", "b", "d", "e"]
```

You can use the three-dot operator

## Strings and their properties

{{index [string, properties]}}

We can read properties like `length` and `toUpperCase` from string
values. But if you try to add a new property, it doesn't stick.

```
let kim = "Kim";
kim.age = 88;
console.log(kim.age);
// → undefined
```

Values of type string, number, and Boolean are not objects, and though
the language doesn't complain if you try to set new properties on
them, it doesn't actually store those properties. As mentioned before,
such values are immutable and cannot be changed.

{{index [string, methods], "slice method", "indexOf method", [string, searching]}}

But these types do have some built-in properties. Every string value
has a number of methods. The most useful ones are probably `slice` and
`indexOf`, which resemble the array methods of the same name.

```
console.log("coconuts".slice(4, 7));
// → nut
console.log("coconut".indexOf("u"));
// → 5
```

One difference is that a string's `indexOf` can search for a string
containing more than one character, whereas the corresponding array
method looks only for a single element.

```
console.log("one two three".indexOf("ee"));
// → 11
```

{{index whitespace, "trim method"}}

The `trim` method removes whitespace (spaces, newlines, tabs, and
similar characters) from the start and end of a string.

```
console.log("  okay \n ".trim());
// → okay
```

{{index ["length property", "for string"], [string, indexing]}}

We have already seen the string type's `length` property. Accessing
the individual characters in a string looks like accessing array
elements (with a caveat that we'll discuss in [Chapter
5](05_higher_order.html#code_points)).

```
let string = "abc";
console.log(string.length);
// → 3
console.log(string[1]);
// → b
```

{{id rest_parameters}}

## Rest parameters

{{index "Math.max function"}}

It can be useful for a function to accept any number of ((argument))s.
For example, `Math.max` computes the maximum of _all_ the arguments it
is given.

{{indexsee "period character", "max example", spread}}

To write such a function, you put three dots before the function's
last ((parameter)), like this:

```
function max(...numbers) {
  let result = -Infinity;
  for (let number of numbers) {
    if (number > result) result = number;
  }
  return result;
}
console.log(max(4, 1, 9, -2));
// → 9
```

When such a function is called the _((rest parameter))_ is bound to an
array containing all further arguments. If there are other parameters
before it, their values aren't part of that array. But if it's the
first parameter, as in `max`, it will hold all arguments.

{{index "function application"}}

You can use a similar three-dot notation to _call_ a function with an
array of arguments.

```
let numbers = [5, 1, 7];
console.log(max(...numbers));
// → 7
```

This "((spread))s" out the array into the function call, passing its
elements as separate arguments. It is possible to include an array
like that along with other arguments, as in `max(9, ...numbers, 2)`.

{{index array}}

Array notation using ((square brackets)) similarly allows this
operator to spread another array into the new array:

```
let words = ["never", "fully"];
console.log(["will", ...words, "understand"]);
// → ["will", "never", "fully", "understand"]
```

## The Math object

{{index "Math object", "Math.min function", "Math.max function", "Math.sqrt function", minimum, maximum, "square root"}}

As we've seen, `Math` is a grab-bag of number-related utility
functions, such as `Math.max` (maximum), `Math.min` (minimum), and
`Math.sqrt` (square root).

{{index namespace, "namespace pollution", object}}

{{id namespace_pollution}}

The `Math` object is used as a container to group a bunch of related
functionality. There is only one `Math` object, and it is almost never
useful as a value. Rather, it provides a _namespace_ so that all these
functions and values do not have to be global bindings.

{{index [binding, naming]}}

Having too many global bindings "pollutes" the namespace. The more
names have been taken, the more likely you are to accidentally
overwrite the value of some existing binding. For example, it's not
unlikely to want to name something `max` in one of your programs.
Since JavaScript's built-in `max` function is tucked safely inside the
`Math` object, we don't have to worry about overwriting it.

{{index "let keyword", "const keyword"}}

Many languages will stop you, or at least warn you, when you are
defining a binding with a name that is already taken. JavaScript does
this for bindings you declared with `let` or `const` but, perversely,
not for standard bindings.

{{index "Math.cos function", "Math.sin function", "Math.tan function", "Math.acos function", "Math.asin function", "Math.atan function", "Math.PI constant", cosine, sine, tangent, "PI constant", pi}}

Back to the `Math` object. If you need to do ((trigonometry)), `Math`
can help. It contains `cos` (cosine), `sin` (sine), and `tan`
(tangent), as well as their inverse functions, `acos`, `asin`, and
`atan`, respectively. The number π (pi)—or at least the closest
approximation that fits in a JavaScript number—is available as
`Math.PI`. (There is an old programming tradition of writing the names
of ((constant)) values in all caps.)

```{test: no}
function randomPointOnCircle(radius) {
  let angle = Math.random() * 2 * Math.PI;
  return {x: radius * Math.cos(angle),
          y: radius * Math.sin(angle)};
}
console.log(randomPointOnCircle(2));
// → {x: 0.3667, y: 1.966}
```

If sines and cosines are not something you are very familiar with,
don't worry. When they are used in this book, in [Chapter
13](13_dom.html#sin_cos), I'll explain them.

{{index "Math.random function", "random number"}}

The previous example uses `Math.random`. This is a function that
returns a new pseudorandom number between zero (inclusive) and one
(exclusive) every time you call it.

```{test: no}
console.log(Math.random());
// → 0.36993729369714856
console.log(Math.random());
// → 0.727367032552138
console.log(Math.random());
// → 0.40180766698904335
```

{{index "pseudorandom number", "random number"}}

Though computers are deterministic machines—they always react the same
way if given the same input—it is possible to have them produce
numbers that appear random. To do this, the machine keeps some hidden
value that represents the randomness, and whenever you ask for a new
random number, it'll perform some complicated computations on this
hidden value to create a new value. It stores this new value, and
returns some number derived from it. That way, it can produce ever
new, hard-to-predict numbers in a way that _seems_ random.

{{index rounding, "Math.floor function"}}

If we want a whole random number instead of a fractional one, we can
use `Math.floor` (which rounds down to the nearest whole number) on
the result of `Math.random`.

```{test: no}
console.log(Math.floor(Math.random() * 10));
// → 2
```

Multiplying the random number by 10 gives us a number greater than or
equal to zero and below 10. Since `Math.floor` rounds down, this
expression will produce, with equal chance, any number from 0 through
9.

{{index "Math.ceil function", "Math.round function"}}

There are also the functions `Math.ceil` (for "ceiling", which rounds
up to a whole number) and `Math.round` (to the nearest whole number).

## Destructuring

{{index "phi function"}}

Let's go back to the `phi` function for a moment:

```{test: wrap}
function phi(table) {
  return (table[3] * table[0] - table[2] * table[1]) /
    Math.sqrt((table[2] + table[3]) *
              (table[0] + table[1]) *
              (table[1] + table[3]) *
              (table[0] + table[2]));
}
```

{{index "destructuring binding", parameter}}

One of the reasons this function is awkward to read is that we have a
binding pointing at our array, but we'd much prefer to have bindings
for the _elements_ of the array. I.e. `let n00 = table[0]`, and so on.
Fortunately, there is a more succinct way to do this in JavaScript.

```
function phi([n00, n01, n10, n11]) {
  return (n11 * n00 - n10 * n01) /
    Math.sqrt((n10 + n11) * (n00 + n01) *
              (n01 + n11) * (n00 + n10));
}
```

{{index "let keyword", "var keyword", "const keyword"}}

This also works for ((binding))s created with `let`, `var`, or
`const`. If you know the value you are binding is an array, you can
use ((square brackets)) to "look inside" of the value, binding its
content.

{{index object, "curly braces"}}

A similar trick works for objects, using braces instead.

```
let {name} = {name: "Faraji", age: 31};
console.log(name);
// → Faraji
```

{{index null, undefined}}

Note that if the value given to such a destructuring binding is `null`
or `undefined`, you get an error, much like you would if you'd
directly try to access a property of those values.

## Summary

Objects and arrays (which are a specific kind of object) provide ways
to group several values into a single value. Conceptually, this allows
us to put a bunch of related things in a bag and run around with the
bag, instead of wrapping our arms around all of the individual things
and trying to hold on to them separately.

Most values in JavaScript have properties, the exceptions being `null`
and `undefined`. Properties are accessed using `value.prop` or
`value["prop"]`. Objects tend to use names for their properties
and store more or less a fixed set of them. Arrays, on the other hand,
usually contain varying amounts of conceptually identical values and
use numbers (starting from 0) as the names of their properties.

There _are_ some named properties in arrays, such as `length` and a
number of methods. Methods are functions that live in properties and
(usually) act on the value they are a property of.

You can iterate over arrays using a special kind of `for` loop—`for
(let element of array)`.

## Exercises

### The sum of a range

{{index "summing (exercise)"}}

The [introduction](00_intro.html) of this book alluded to the
following as a nice way to compute the sum of a range of numbers:

```{test: no}
console.log(sum(range(1, 10)));
```

{{index "range function", "sum function"}}

Write a `range` function that takes two arguments, `start` and `end`,
and returns an array containing all the numbers from `start` up to
(and including) `end`.

Next, write a `sum` function that takes an array of numbers and
returns the sum of these numbers. Run the previous program and see
whether it does indeed return 55.

{{index "optional argument"}}

As a bonus assignment, modify your `range` function to take an
optional third argument that indicates the “step” value used to build
up the array. If no step is given, the array elements go up by
increments of one, corresponding to the old behavior. The function
call `range(1, 10, 2)` should return `[1, 3, 5, 7, 9]`. Make sure it
also works with negative step values so that `range(5, 2, -1)`
produces `[5, 4, 3, 2]`.

{{if interactive

```{test: no}
// Your code here.

console.log(range(1, 10));
// → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(range(5, 2, -1));
// → [5, 4, 3, 2]
console.log(sum(range(1, 10)));
// → 55
```
if}}

{{hint

{{index "summing (exercise)", [array, creation], "square brackets"}}

Building up an array is most easily done by first initializing a
binding to `[]` (a fresh, empty array) and repeatedly calling its
`push` method to add a value. Don't forget to return the array at the
end of the function.

{{index [array, indexing], comparison}}

Since the end boundary is inclusive, you'll need to use the `<=`
operator rather than `<` to check for the end of your loop.

{{index "arguments object"}}

To step parameter can be an optional parameter that defaults (using
the `=` operator) to 1.

{{index "range function", "for loop"}}

Having `range` understand negative step values is probably best done
by writing two separate loops—one for counting up and one for counting
down—because the comparison that checks whether the loop is finished
needs to be `>=` rather than `<=` when counting downward.

It might also be worthwhile to use a different default step, namely,
-1, when the end of the range is smaller than the start. That way,
`range(5, 2)` returns something meaningful, rather than getting stuck
in an ((infinite loop)). It is possible to refer to previous
parameters in the default value of a parameter.

hint}}

### Reversing an array

{{index "reversing (exercise)", "reverse method", [array, methods]}}

Arrays have a method `reverse`, which changes the array by inverting
the order in which its elements appear. For this exercise, write two
functions, `reverseArray` and `reverseArrayInPlace`. The first,
`reverseArray`, takes an array as argument and produces a _new_ array
that has the same elements in the inverse order. The second,
`reverseArrayInPlace`, does what the `reverse` method does: it
_modifies_ the array given as argument by reversing its elements.
Neither may use the standard `reverse` method.

{{index efficiency, "pure function", "side effect"}}

Thinking back to the notes about side effects and pure functions in
the [previous chapter](03_functions.html#pure), which variant do you
expect to be useful in more situations? Which one is more efficient?

{{if interactive

```{test: no}
// Your code here.

console.log(reverseArray(["A", "B", "C"]));
// → ["C", "B", "A"];
let arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]
```
if}}

{{hint

{{index "reversing (exercise)"}}

There are two obvious ways to implement `reverseArray`. The first is
to simply go over the input array from front to back and use the
`unshift` method on the new array to insert each element at its start.
The second is to loop over the input array backward and use the `push`
method. Iterating over an array backward requires a (somewhat awkward)
`for` specification like `(let i = array.length - 1; i >= 0; i--)`.

{{index "slice method"}}

Reversing the array in place is harder. You have to be careful not to
overwrite elements that you will later need. Using `reverseArray` or
otherwise copying the whole array (`array.slice(0)` is a good way to
copy an array) works but is cheating.

The trick is to _swap_ the first and last elements, then the second
and second-to-last, and so on. You can do this by looping over half
the length of the array (use `Math.floor` to round down—you don't need
to touch the middle element in an array with an odd number of
elements) and swapping the element at position `i` with the one at
position `array.length - 1 - i`. You can use a local binding to
briefly hold on to one of the elements, overwrite that one with its
mirror image, and then put the value from the local binding in the
place where the mirror image used to be.

hint}}

{{id list}}

### A list

{{index "data structure", "list (exercise)", "linked list", object, array, collection}}

Objects, as generic blobs of values, can be used to build all sorts of
data structures. A common data structure is the _list_ (not to be
confused with array). A list is a nested set of objects, with the
first object holding a reference to the second, the second to the
third, and so on.

```{includeCode: true}
let list = {
  value: 1,
  rest: {
    value: 2,
    rest: {
      value: 3,
      rest: null
    }
  }
};
```

The resulting objects form a chain, like this:

{{figure {url: "img/linked-list.svg", alt: "A linked list",width: "6cm"}}}

{{index "structure sharing", memory}}

A nice thing about lists is that they can share parts of their
structure. For example, if I create two new values `{value: 0, rest:
list}` and `{value: -1, rest: list}` (with `list` referring to the
binding defined earlier), they are both independent lists, but they
share the structure that makes up their last three elements. In
addition, the original list is also still a valid three-element list.

Write a function `arrayToList` that builds up a data structure like
the previous one when given `[1, 2, 3]` as argument, and write a
`listToArray` function that produces an array from a list. Also write
the helper functions `prepend`, which takes an element and a list and
creates a new list that adds the element to the front of the input
list, and `nth`, which takes a list and a number and returns the
element at the given position in the list, or `undefined` when there
is no such element.

{{index recursion}}

If you haven't already, also write a recursive version of `nth`.

{{if interactive

```{test: no}
// Your code here.

console.log(arrayToList([10, 20]));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(listToArray(arrayToList([10, 20, 30])));
// → [10, 20, 30]
console.log(prepend(10, prepend(20, null)));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(nth(arrayToList([10, 20, 30]), 1));
// → 20
```
if}}

{{hint

{{index "list (exercise)", "linked list"}}

Building up a list is easier when done back to front. So `arrayToList`
could iterate over the array backward (see previous exercise) and, for
each element, add an object to the list. You can use a local binding
to hold the part of the list that was built so far and use an
assignment like `list = {value: X, rest: list}` to add an element.

{{index "for loop"}}

To run over a list (in `listToArray` and `nth`), a `for` loop
specification like this can be used:

```
for (let node = list; node; node = node.rest) {}
```

Can you see how that works? Every iteration of the loop, `node` points
to the current sublist, and the body can read its `value` property to
get the current element. At the end of an iteration, `node` moves to
the next sublist. When that is null, we have reached the end of the
list and the loop is finished.

{{index recursion}}

The recursive version of `nth` will, similarly, look at an ever
smaller part of the “tail” of the list and at the same time count down
the index until it reaches zero, at which point it can return the
`value` property of the node it is looking at. To get the zeroeth
element of a list, you simply take the `value` property of its head
node. To get element _N_ + 1, you take the _N_th element of the list
that's in this list's `rest` property.

hint}}

{{id exercise_deep_compare}}

### Deep comparison

{{index "deep comparison (exercise)", comparison, "deep comparison", "== operator"}}

The `==` operator compares objects by identity. But sometimes, you
would prefer to compare the values of their actual properties.

Write a function, `deepEqual`, that takes two values and returns true
only if they are the same value or are objects with the same
properties whose values are also equal when compared with a recursive
call to `deepEqual`.

{{index null, "=== operator", "typeof operator"}}

To find out whether to compare two things by identity (use the `===`
operator for that) or by looking at their properties, you can use the
`typeof` operator. If it produces `"object"` for both values, you
should do a deep comparison. But you have to take one silly exception
into account: by a historical accident, `typeof null` also produces
`"object"`.

{{index "Object.keys function"}}

The `Object.keys` function will be useful when you need to go over the
properties of objects to compare them one by one.

{{if interactive

```{test: no}
// Your code here.

let obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
// → true
```
if}}

{{hint

{{index "deep comparison (exercise)", "typeof operator", object, "=== operator"}}

Your test for whether you are dealing with a real object will look
something like `typeof x == "object" && x != null`. Be careful to
compare properties only when _both_ arguments are objects. In all
other cases you can just immediately return the result of applying
`===`.

{{index "Object.keys method"}}

Use `Object.keys` to go over the properties. You need to test whether
both objects have the same set of property names and whether those
properties have identical values. One way to do that is to ensure that
both objects have the same number of properties (the lengths of the
property lists are the same). And then, when looping over one of the
object's properties in order to compare them, always first make sure
the other actually has a property by that name. If they have the same
number of properties, and all properties in one also exist in the
other, they have the same set of property names.

{{index "return value"}}

Returning the correct value from the function is best done by
immediately returning false when a mismatch is found and returning
true at the end of the function.

hint}}
