{{meta {load_files: ["code/intro.js"]}}}

# Передмова

{{quote {author: "Еллен Ульман", title: "Поряд з комп'ютером: Технофілія та її невдоволення", chapter: true}

Ми вважаємо, що створюємо систему для наших власних потреб. 
Ми віримо, що створюємо її за образом своїм...Але комп'ютер зовсім не схожий на нас.
Це проекція дуже малої частини нас самих: тієї частини, яка присвячена логіці, порядку, правилам і ясності.

quote}}

{{figure {url: "img/chapter_picture_00.jpg", alt: "Illustration of a screwdriver next to a circuit board of about the same size", chapter: "framed"}}}

Ця книга про про те, як керувати комп'ютерами. 
Сьогодні комп'ютери так само широко розповсюджені, як і викрутки. Проте, вони трохи більш складні. 
І змусити їх робити те, що вам потрібно не завжди легко.

Якщо задача, яку ви хочете вирішити за допомою свого комп’ютера, є доситить поширеною і зрозумілою, 
наприклад, вам потрібно показати вашу електронну пошту або порахувати щось,
ви можете відкрити відповідну програму і приступити до роботи.
Але для унікальних задач або задач, які мають більш ніж одну правильну відповідь, не завжди буде існувати така програма.

І в таких випадках програмування може статися у нагоді.
_Програмування_ це процес створення _програм_ — набору точних інструкцій, які кажуть комп'ютеру, що робити.
Через те, що комп’ютери тупі і педантичні звірі, програмування може втомлювати і розчаровувати.

{{index [programming, "joy of"], speed}}

На щастя, якщо ви зможете прийняти цей факт — і, можливо, навіть почати насолоджуватися суворістю мислення термінами,
з якими здатні працювати тупі машини, — програмування може почати приносити свої плоди.
Адже воно дозволить вам робити за секунди те, що вручну зайняло б _віки_.
Адже це спосіб змусити ваш комп'ютер робити те, що він не міг робити раніше.
Крім того, це все може стати чудовою грою з розгадування головоломок або абстрактного мислення.

Здебільшого програмування відбувається за допомогою мови програмування.
_Мова програмування_ — це штучно створена мова, яка використовується для керування комп’ютерами. 
Цікаво, що найефективнішим способом комунікації з комп’ютером став той, який ми, власне, 
використовуємо для спілкування один з одним.
Подібно до людських мов, комп’ютерні мови дозволяють нам поєднувати слова та фрази новим образом, 
що дає нам змогу створювати нові концепції.

{{index [JavaScript, "availability of"], "casual computing"}}

Певний час мовні інтерфейси, такі як команді строки BASIC і DOS 1980-х і 1990-х років, 
були основним методом взаємодії з комп'ютерами.
З метою повсякденного використання комп’ютера їх замінили на візуальні інтерфейси, які легше освоїти, але які надають менше свободи дій. 
Проте всі ці мови на місці, вам просто потрібно знате, де їх шукати. 
Одна з них, _JavaScript_, вбудована у кожен сучасний веб ((браузер)) і тому доступна майже на кожному пристрої.

{{indexsee "web browser", browser}}

Ця книга спробує ознайомити вас із цією мовою настільки, щоб ви змогли робити з нею корисні та цікаві речі.

## Про програмування

{{index [programming, "difficulty of"]}}

Окрім пояснення JavaScript, я познайомлю вас з основними принципами програмування. 
Як виявляється, програмувати важко. 
Фундаментальні правила прості та зрозумілі, але програми, які створені на основі цих правил, 
мають тенденцію ставати досить складними, що призводить до створення ними додаткових правил і складнощів. 
У певному сенсі ви будуєте свій власний лабіринт, в якому ви ж самі і можете легко загубитися.

{{index learning}}

Будуть моменти, коли ви будете відчувати себе дуже роздратованим під час читання цієї кнги.
Якщо ви новачок у програмуванні, вам доведеться багато чого нового перетравити. 
Значна частина цього матеріалу буде _скомбінована_ такими способами, які вимагатимуть від вас створення додаткових зв’язків.

Саме вам доведеться докласти необхіді зусилля.
Проте коли вам стане важко розуміти цю книжку, 
не робіть поспішних висновків щодо власних здібностей.
З вами все гаразд — вам просто потрібно продовжити докладати зусилля.
Зробіть перерву, перечитайте трохи матеріалу та переконайтеся, 
що ви прочитали та зрозуміли наведені приклади програм і вправи.
Навчання — це важка праця, але все, чого ви навчитеся, буде належати вам і в подальшому полегшить ваше навчання.

{{quote {author: "Урсула Ле Гуїн", title: "Ліва рука темряви"}

{{index "Le Guin, Ursula K."}}

Коли дії перестають приносити результати, зберіть інформацію; коли інформація перестає приносити результати, поспіть.

quote}}

{{index [program, "nature of"], data}}

Програма складається з багатьох речей.
Це фрагмент тексту, написаний програмістом,
це рушійна сила, яка змушує комп’ютер робити те, що він робить,
це дані в пам’яті комп’ютера,
і водночас він контролює дії, що виконуються із цією пам’яттю. 
Аналогії, які намагаються використати для порівняння програми зі знайомими об’єктами, 
як правило, не здатні передати всієї суті.
Більш-менш доцільним буде порівняння програми з машиною - 
машина складається із багатьох окремих частин, і, щоб усе між собою працювало,
ці частини мають бути взаємопов’язані та функціонувати як одне ціле.

Комп’ютер – це фізична машина, яка виконує функцію хоста для нематеріальних машин.
Самі комп’ютери можуть робити лише дуже прості речі.
Причина, по якій вони такі корисні, полягає в тому, що вони роблять це з неймовірно високою швидкістю. 
Програма може винахідливо поєднувати величезну кількість простих дій для того, щоб виконати дуже складні речі.

{{index [programming, "joy of"]}}

Програма – це будівля, що складається із думок.
Її недорого збудувати, вона нічого не важить, і вона легко росте з-під наших пальців.
Але зі зростанням програми зростає і її складність.
Вміння програмувати - це вміння будувати програми, які не заплутають вас самих.
Найкращими програмами є ті, які можуть робити щось цікаве, але при цьому їх легко зрозуміти.

{{index "programming style", "best practices"}}

Деякі програмісти вважають, що складністю програми найкраще керувати, якщо
використовувати лише невеликий набір добре зрозумілих технік.
Вони створили суворі правила («найкращі практики»), що визначають форму яку має мати програма,  
і з обережністю залишаються в межах своєї персональної безпечної зони.

{{index experiment}}

Це не тільки нудно, але й неефективно. 
Бо нові проблеми часто вимагають нових рішень.
А сфера програмування молода і все ще продовжує швидко розвиватись.
Окрім того, вона достатьно варіативна, і має достатьно місця для різноманітних підходів для вирішення проблем.
Під час розробки програм можна зробити багато жахливих помилок, 
і ви повинні це зробити хоча б раз, щоб зрозуміти їх.
Уявлення про те, як виглядає хороша програма, розвивається через практику, а не через вивчення списку правил.

## Why language matters

{{index "programming language", "machine code", "binary data"}}

In the beginning, at the birth of computing, there were no programming languages. Programs looked something like this:

```{lang: null}
00110001 00000000 00000000
00110001 00000001 00000001
00110011 00000001 00000010
01010001 00001011 00000010
00100010 00000010 00001000
01000011 00000001 00000000
01000001 00000001 00000001
00010000 00000010 00000000
01100010 00000000 00000000
```

{{index [programming, "history of"], "punch card", complexity}}

This is a program to add the numbers from 1 to 10 together and print the result: `1 + 2 + ... + 10 = 55`. It could run on a simple hypothetical machine. To program early computers, it was necessary to set large arrays of switches in the right position or punch holes in strips of cardboard and feed them to the computer. You can imagine how tedious and error prone this procedure was. Even writing simple programs required much cleverness and discipline. Complex ones were nearly inconceivable.

{{index bit, "wizard (mighty)"}}

Of course, manually entering these arcane patterns of bits (the ones and zeros) did give the programmer a profound sense of being a mighty wizard. And that has to be worth something in terms of job satisfaction.

{{index memory, instruction}}

Each line of the previous program contains a single instruction. It could be written in English like this:

 1. Store the number 0 in memory location 0.
 2. Store the number 1 in memory location 1.
 3. Store the value of memory location 1 in memory location 2.
 4. Subtract the number 11 from the value in memory location 2.
 5. If the value in memory location 2 is the number 0, continue with instruction 9.
 6. Add the value of memory location 1 to memory location 0.
 7. Add the number 1 to the value of memory location 1.
 8. Continue with instruction 3.
 9. Output the value of memory location 0.

{{index readability, naming, binding}}

Although that is already more readable than the soup of bits, it is still rather obscure. Using names instead of numbers for the instructions and memory locations helps.

```{lang: "null"}
  Set “total” to 0.
  Set “count” to 1.
[loop]
  Set “compare” to “count”.
  Subtract 11 from “compare”.
  If “compare” is 0, continue at [end].
  Add “count” to “total”.
  Add 1 to “count”.
  Continue at [loop].
[end]
  Output “total”.
```

{{index loop, jump, "summing example"}}

Can you see how the program works at this point? The first two lines give two memory locations their starting values: `total` will be used to build up the result of the computation, and `count` will keep track of the number that we are currently looking at. The lines using `compare` are probably the most confusing ones. The program wants to see whether `count` is equal to 11 to decide whether it can stop running. Because our hypothetical machine is rather primitive, it can test only whether a number is zero and make a decision based on that. It therefore uses the memory location labeled `compare` to compute the value of `count - 11` and makes a decision based on that value. The next two lines add the value of `count` to the result and increment `count` by 1 every time the program decides that `count` is not 11 yet.

Here is the same program in JavaScript:

```
let total = 0, count = 1;
while (count <= 10) {
  total += count;
  count += 1;
}
console.log(total);
// → 55
```

{{index "while loop", loop, [braces, block]}}

This version gives us a few more improvements. Most importantly, there is no need to specify the way we want the program to jump back and forth anymore—the `while` construct takes care of that. It continues executing the block (wrapped in braces) below it as long as the condition it was given holds. That condition is `count <= 10`, which means “the count is less than or equal to 10”. We no longer have to create a temporary value and compare that to zero, which was just an uninteresting detail. Part of the power of programming languages is that they can take care of uninteresting details for us.

{{index "console.log"}}

At the end of the program, after the `while` construct has finished, the `console.log` operation is used to write out the result.

{{index "sum function", "range function", abstraction, function}}

Finally, here is what the program could look like if we happened to have the convenient operations `range` and `sum` available, which respectively create a ((collection)) of numbers within a range and compute the sum of a collection of numbers:

```{startCode: true}
console.log(sum(range(1, 10)));
// → 55
```

{{index readability}}

The moral of this story is that the same program can be expressed in both long and short, unreadable and readable ways. The first version of the program was extremely obscure, whereas this last one is almost English: `log` the `sum` of the `range` of numbers from 1 to 10. (We will see in [later chapters](data) how to define operations like `sum` and `range`.)

{{index ["programming language", "power of"], composability}}

A good programming language helps the programmer by allowing them to talk about the actions that the computer has to perform on a higher level. It helps omit details, provides convenient building blocks (such as `while` and `console.log`), allows you to define your own building blocks (such as `sum` and `range`), and makes those blocks easy to compose.

## What is JavaScript?

{{index history, Netscape, browser, "web application", JavaScript, [JavaScript, "history of"], "World Wide Web"}}

{{indexsee WWW, "World Wide Web"}}

{{indexsee Web, "World Wide Web"}}

JavaScript was introduced in 1995 as a way to add programs to web pages in the Netscape Navigator browser. The language has since been adopted by all other major graphical web browsers. It has made modern web applications possible—that is, applications with which you can interact directly without doing a page reload for every action. JavaScript is also used in more traditional websites to provide various forms of interactivity and cleverness.

{{index Java, naming}}

It is important to note that JavaScript has almost nothing to do with the programming language named Java. The similar name was inspired by marketing considerations rather than good judgment. When JavaScript was being introduced, the Java language was being heavily marketed and was gaining popularity. Someone thought it was a good idea to try to ride along on this success. Now we are stuck with the name.

{{index ECMAScript, compatibility}}

After its adoption outside of Netscape, a ((standard)) document was written to describe the way the JavaScript language should work so that the various pieces of software that claimed to support JavaScript could make sure they actually provided the same language. This is called the ECMAScript standard, after the Ecma International organization that conducted the standardization. In practice, the terms ECMAScript and JavaScript can be used interchangeably—they are two names for the same language.

{{index [JavaScript, "weaknesses of"], debugging}}

There are those who will say _terrible_ things about JavaScript. Many of these things are true. When I was required to write something in JavaScript for the first time, I quickly came to despise it. It would accept almost anything I typed but interpret it in a way that was completely different from what I meant. This had a lot to do with the fact that I did not have a clue what I was doing, of course, but there is a real issue here: JavaScript is ridiculously liberal in what it allows. The idea behind this design was that it would make programming in JavaScript easier for beginners. In actuality, it mostly makes finding problems in your programs harder because the system will not point them out to you.

{{index [JavaScript, "flexibility of"], flexibility}}

This flexibility also has its advantages, though. It leaves room for techniques that are impossible in more rigid languages and makes for a pleasant, informal style of programming. After ((learning)) the language properly and working with it for a while, I have come to actually _like_ JavaScript.

{{index future, [JavaScript, "versions of"], ECMAScript, "ECMAScript 6"}}

There have been several versions of JavaScript. ECMAScript version 3 was the widely supported version during JavaScript's ascent to dominance, roughly between 2000 and 2010. During this time, work was underway on an ambitious version 4, which planned a number of radical improvements and extensions to the language. Changing a living, widely used language in such a radical way turned out to be politically difficult, and work on version 4 was abandoned in 2008. A much less ambitious version 5, which made only some uncontroversial improvements, came out in 2009. In 2015, version 6 came out, a major update that included some of the ideas planned for version 4. Since then we've had new, small updates every year.

The fact that JavaScript is evolving means that browsers have to constantly keep up. If you're using an older browser, it may not support every feature. The language designers are careful to not make any changes that could break existing programs, so new browsers can still run old programs. In this book, I'm using the 2024 version of JavaScript.

{{index [JavaScript, "uses of"]}}

Web browsers are not the only platforms on which JavaScript is used. Some databases, such as MongoDB and CouchDB, use JavaScript as their scripting and query language. Several platforms for desktop and server programming, most notably the ((Node.js)) project (the subject of [Chapter ?](node)), provide an environment for programming JavaScript outside of the browser.

## Code, and what to do with it

{{index "reading code", "writing code"}}

_Code_ is the text that makes up programs. Most chapters in this book contain quite a lot of code. I believe reading code and writing ((code)) are indispensable parts of ((learning)) to program. Try to not just glance over the examples—read them attentively and understand them. This may be slow and confusing at first, but I promise that you'll quickly get the hang of it. The same goes for the ((exercises)). Don't assume you understand them until you've actually written a working solution.

{{index interpretation}}

I recommend you try your solutions to exercises in an actual JavaScript interpreter. That way, you'll get immediate feedback on whether what you are doing is working, and, I hope, you'll be tempted to ((experiment)) and go beyond the exercises.

{{if interactive

When reading this book in your browser, you can edit (and run) all example programs by clicking them.

if}}

{{if book

{{index download, sandbox, "running code"}}

The easiest way to run the example code in the book—and to experiment with it—is to look it up in the online version of the book at [_https://eloquentjavascript.net_](https://eloquentjavascript.net/). There, you can click any code example to edit and run it and to see the output it produces. To work on the exercises, go to [_https://eloquentjavascript.net/code_](https://eloquentjavascript.net/code), which provides starting code for each coding exercise and allows you to look at the solutions.

if}}

{{index "developer tools", "JavaScript console"}}

Running the programs defined in this book outside of the book's website requires some care. Many examples stand on their own and should work in any JavaScript environment. But code in later chapters is often written for a specific environment (the browser or Node.js) and can run only there. In addition, many chapters define bigger programs, and the pieces of code that appear in them depend on each other or on external files. The [sandbox](https://eloquentjavascript.net/code) on the website provides links to ZIP files containing all the scripts and data files necessary to run the code for a given chapter.

## Overview of this book

This book contains roughly three parts. The first 12 chapters discuss the JavaScript language. The next seven chapters are about web ((browsers)) and the way JavaScript is used to program them. Finally, two chapters are devoted to ((Node.js)), another environment to program JavaScript in. There are five _project chapters_ in the book that describe larger example programs to give you a taste of actual programming.

The language part of the book starts with four chapters that introduce the basic structure of the JavaScript language. They discuss [control structures](program_structure) (such as the `while` word you saw in this introduction), [functions](functions) (writing your own building blocks), and [data structures](data). After these, you will be able to write basic programs. Next, Chapters [?](higher_order) and [?](object) introduce techniques to use functions and objects to write more _abstract_ code and keep complexity under control.

After a [first project chapter](robot) that builds a crude delivery robot, the language part of the book continues with chapters on [error handling and bug fixing](error), [regular expressions](regexp) (an important tool for working with text), [modularity](modules) (another defense against complexity), and [asynchronous programming](async) (dealing with events that take time). The [second project chapter](language), where we implement a programming language, concludes the first part of the book.

The second part of the book, Chapters [?](browser) to [?](paint), describes the tools that browser JavaScript has access to. You'll learn to display things on the screen (Chapters [?](dom) and [?](canvas)), respond to user input ([Chapter ?](event)), and communicate over the network ([Chapter ?](http)). There are again two project chapters in this part: building a [platform game](game) and a [pixel paint program](paint).

[Chapter ?](node) describes Node.js, and [Chapter ?](skillsharing) builds a small website using that tool.

{{if commercial

Finally, [Chapter ?](fast) describes some of the considerations that come up when optimizing JavaScript programs for speed.

if}}

## Typographic conventions

{{index "factorial function"}}

In this book, text written in a `monospaced` font will represent elements of programs. Sometimes these are self-sufficient fragments, and sometimes they just refer to part of a nearby program. Programs (of which you have already seen a few) are written as follows:

```
function factorial(n) {
  if (n == 0) {
    return 1;
  } else {
    return factorial(n - 1) * n;
  }
}
```

{{index "console.log"}}

Sometimes, to show the output that a program produces, the expected output is written after it, with two slashes and an arrow in front.

```
console.log(factorial(8));
// → 40320
```

Good luck!
