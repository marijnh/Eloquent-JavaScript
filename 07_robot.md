{{meta {load_files: ["code/chapter/07_robot.js", "code/animatevillage.js"], zip: html}}}

# Proje: Robot

{{quote {author: "Edsger Dijkstra", title: "Bilgisayar Bilimine Yönelik Tehditler", chapter: true}

[...] Makinelerin Düşünüp Düşünemeyeceği sorusu [...] Denizaltıların Yüzüp Yüzemeyeceği sorusu kadar alakalıdır.

quote}}

{{index "artificial intelligence", "Dijkstra, Edsger"}}

{{figure {url: "img/chapter_picture_7.jpg", alt: "Bir paket yığınını tutan bir robotun illüstrasyonu", chapter: framed}}}

{{index "project chapter", "reading code", "writing code"}}

"Proje" bölümlerinde, sizi kısa bir an için yeni teorilerle sıkmayı bırakacağım ve bunun yerine birlikte bir program üzerinden çalışacağız. Programlama öğrenmek için teoriye ihtiyaç vardır, ancak gerçek programları okuyup anlamak da en az teori kadar önemlidir.

Bu bölümdeki projemiz, bir ((otomasyon)) inşa etmek olacak, bir ((sanal dünya))da görev gerçekleştiren küçük bir program. Otomasyon, paketleri teslim alıp bırakan bir posta teslim ((robotu)) olacak.

## Meadowfield

{{index "roads array"}}

((Meadowfield)) köyü çok büyük değil. 11 yer ve aralarında 14 yoldan oluşur. Köyün yollarını tanımlayan bu yol dizisi ile tanımlanabilir:

```{includeCode: true}
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

{{figure {url: "img/village2x.png", alt: "11 konumlu, harflerle etiketlenmiş ve yolların onlara ait olduğu küçük bir köyün piksel sanat illüstrasyonu"}}}

Köydeki yol ağı bir _((grafik))_ oluşturur. Bir grafik, noktaların (köydeki yerler) ve aralarındaki çizgilerin (yollar) olduğu bir koleksiyonudur. Bu grafik, robotumuzun hareket ettiği dünya olacak.

{{index "roadGraph object"}}

Dize dizisiyle çalışmak pek kolay değildir. İlgilendiğimiz şey, belirli bir yerden ulaşılabilen hedeflerdir. Hadi bu yol dizisini bize her yer için nereye gidilebileceğini söyleyen bir veri tipine çevirelim.

```{includeCode: true}
function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (from in graph) {
      graph[from].push(to);
    } else {
      graph[from] = [to];
    }
  }
  for (let [from, to] of edges.map(r => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);
```

Kenarlar dizisi verildiğinde, `buildGraph` her bir düğüm için bağlı düğümlerin bir dizisini depolayan bir map nesnesi oluşturur.

{{index "split method"}}

`"Başlangıç-Bitiş"` şeklinde olan yol dizelerinden başlangıç ve bitişi ayrı dizeler olarak içeren iki öğeli dizilere gitmek için `split` metodunu kullanır.

## Görev

((Robotumuz)) köyde dolaşacak. Çeşitli yerlerde paketler var, her biri başka bir yere adreslenmiş. Robot, onlara geldiğinde paketleri alır ve varış noktalarına vardığında teslim eder.

Her noktada, otomasyon bir sonraki hamlesinde nereye gideceğine karar vermelidir. Görevi, tüm paketler teslim edildiğinde tamamlanmış olur.

{{index simulation, "virtual world"}}

Bu işlemi simüle edebilmek için, bunu açıklayabilen bir sanal dünya tanımlamamız gerekir. Bu model, robotun nerede olduğunu ve paketlerin nerede olduğunu bize söyler. Robot bir yere gitmeye karar verdiğinde, yeni durumu yansıtmak için modeli güncellememiz gerekir.

{{index [state, in objects]}}

Eğer ((nesne tabanlı programlama)) terimleriyle düşünüyorsanız, ilk düşünceniz dünyadaki çeşitli unsurlar için nesneleri tanımlamaya başlamak olabilir: bir robot için bir ((sınıf)), bir paket için bir tane, belki yerler için bir tane. Bunlar daha sonra dünyayı güncellerken değişen ((durumlarını)) açıklayan özellikler içerebilir.

Bu yanlış. En azından genellikle öyledir. Bir şeyin bir nesne gibi görünmesi, otomatik olarak programınızdaki bir nesne olması gerektiği anlamına gelmez. Uygulamanızdaki her kavram için otomatik olarak sınıflar yazmak, genellikle birbirine bağlı ve kendi iç değişen durumlarına sahip nesneler koleksiyonuyla sonuçlanır. Bu tür programlar genellikle anlaşılması zor ve bu nedenle hata vermesi daha kolaydır.

{{index [state, in objects]}}

Bunun yerine, köyün durumunu, onu tanımlayan minimum değerler kümesine indirgeyelim. Robotun şu anki konumu ve teslim edilmemiş paketlerin koleksiyonu var, her biri bir güncel konuma ve bir hedef adresine sahip. Bu kadar.

{{index "VillageState class", "persistent data structure"}}

Ayrıca köydeki durum değerini _değiştirmek_ yerine hareketten sonra durumu _yeni_ bir değer olarak tekrardan hesaplayalım.

```{includeCode: true}
class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels.map(p => {
        if (p.place != this.place) return p;
        return {place: destination, address: p.address};
      }).filter(p => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}
```

`move` metodu aksiyonun olduğu yerdir. Öncelikle, mevcut yerden varış noktasına giden bir yol olup olmadığını kontrol eder ve yoksa, bu geçerli bir hamle değil olduğundan eski durumu döndürür.

{{index "map method", "filter method"}}

Sonra, robotun yeni yeri barındıracak şekilde yeni bir durum oluşturur. Ancak aynı zamanda yeni bir paket seti oluşturması gerekir — robotun taşıdığı paketler (robotun şu anki yerinde olanlar) yeni yere taşınmalıdır. Ve yeni yere adreslenen paketler teslim edilmelidir — yani, teslim edilmemiş paketler setinden kaldırılmalıdır. `map` çağrısı taşımayı, `filter` çağrısı ise teslimi yapar.

Paket nesneleri taşındığında değiştirilmez, yeniden oluşturulur. `move` metodu bize yeni bir köy durumu verir ancak eski durumu tamamen bırakır.

```
let first = new VillageState(
  "Post Office",
  [{place: "Post Office", address: "Alice's House"}]
);
let next = first.move("Alice's House");

console.log(next.place);
// → Alice's House
console.log(next.parcels);
// → []
console.log(first.place);
// → Post Office
```

Hareket, paketin teslim edilmesine neden olur ve bu, sonraki durumda yansıtılır. Ancak, başlangıç durumu hala robotun postanede olduğu ve paketin teslim edilmediği durumu açıklar.

## Kalıcı veriler

{{index "persistent data structure", mutability, ["data structure", immutable]}}

Data structures that don't change are called _((immutable))_ or _persistent_. They behave a lot like strings and numbers in that they are who they are and stay that way, rather than containing different things at different times.

In JavaScript, just about everything _can_ be changed, so working with values that are supposed to be persistent requires some restraint. There is a function called `Object.freeze` that changes an object so that writing to its properties is ignored. You could use that to make sure your objects aren't changed, if you want to be careful. Freezing does require the computer to do some extra work, and having updates ignored is just about as likely to confuse someone as having them do the wrong thing. So I usually prefer to just tell people that a given object shouldn't be messed with and hope they remember it.

```
let object = Object.freeze({value: 5});
object.value = 10;
console.log(object.value);
// → 5
```

Why am I going out of my way to not change objects when the language is obviously expecting me to?

Because it helps me understand my programs. This is about complexity management again. When the objects in my system are fixed, stable things, I can consider operations on them in isolation—moving to Alice's house from a given start state always produces the same new state. When objects change over time, that adds a whole new dimension of complexity to this kind of reasoning.

For a small system like the one we are building in this chapter, we could handle that bit of extra complexity. But the most important limit on what kind of systems we can build is how much we can understand. Anything that makes your code easier to understand makes it possible to build a more ambitious system.

Unfortunately, although understanding a system built on persistent data structures is easier, _designing_ one, especially when your programming language isn't helping, can be a little harder. We'll look for opportunities to use persistent data structures in this book, but we'll also be using changeable ones.

## Simülasyon

{{index simulation, "virtual world"}}

A delivery ((robot)) looks at the world and decides in which direction it wants to move. As such, we could say that a robot is a function that takes a `VillageState` object and returns the name of a nearby place.

{{index "runRobot function"}}

Because we want robots to be able to remember things, so that they can make and execute plans, we also pass them their memory and allow them to return a new memory. Thus, the thing a robot returns is an object containing both the direction it wants to move in and a memory value that will be given back to it the next time it is called.

```{includeCode: true}
function runRobot(state, robot, memory) {
  for (let turn = 0;; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Done in ${turn} turns`);
      break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
  }
}
```

Consider what a robot has to do to "solve" a given state. It must pick up all parcels by visiting every location that has a parcel and deliver them by visiting every location that a parcel is addressed to, but only after picking up the parcel.

What is the dumbest strategy that could possibly work? The robot could just walk in a random direction every turn. That means, with great likelihood, it will eventually run into all parcels and then also at some point reach the place where they should be delivered.

{{index "randomPick function", "randomRobot function"}}

Here's what that could look like:

```{includeCode: true}
function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function randomRobot(state) {
  return {direction: randomPick(roadGraph[state.place])};
}
```

{{index "Math.random function", "Math.floor function", [array, "random element"]}}

Remember that `Math.random()` returns a number between zero and one—but always below one. Multiplying such a number by the length of an array and then applying `Math.floor` to it gives us a random index for the array.

Since this robot does not need to remember anything, it ignores its second argument (remember that JavaScript functions can be called with extra arguments without ill effects) and omits the `memory` property in its returned object.

To put this sophisticated robot to work, we'll first need a way to create a new state with some parcels. A static method (written here by directly adding a property to the constructor) is a good place to put that functionality.

```{includeCode: true}
VillageState.random = function(parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address);
    parcels.push({place, address});
  }
  return new VillageState("Post Office", parcels);
};
```

{{index "do loop"}}

We don't want any parcels that are sent from the same place that they are addressed to. For this reason, the `do` loop keeps picking new places when it gets one that's equal to the address.

Let's start up a virtual world.

```{test: no}
runRobot(VillageState.random(), randomRobot);
// → Moved to Marketplace
// → Moved to Town Hall
// → …
// → Done in 63 turns
```

It takes the robot a lot of turns to deliver the parcels because it isn't planning ahead very well. We'll address that soon.

{{if interactive

For a more pleasant perspective on the simulation, you can use the `runRobotAnimation` function that's available in [this chapter's programming environment](https://eloquentjavascript.net/code/#7). This runs the simulation, but instead of outputting text, it shows you the robot moving around the village map.

```{test: no}
runRobotAnimation(VillageState.random(), randomRobot);
```

The way `runRobotAnimation` is implemented will remain a mystery for now, but after you've read the [later chapters](dom) of this book, which discuss JavaScript integration in web browsers, you'll be able to guess how it works.

if}}

## Posta kamyonunun rotası

{{index "mailRoute array"}}

We should be able to do a lot better than the random ((robot)). An easy improvement would be to take a hint from the way real-world mail delivery works. If we find a route that passes all places in the village, the robot could run that route twice, at which point it is guaranteed to be done. Here is one such route (starting from the post office):

```{includeCode: true}
const mailRoute = [
  "Alice's House", "Cabin", "Alice's House", "Bob's House",
  "Town Hall", "Daria's House", "Ernie's House",
  "Grete's House", "Shop", "Grete's House", "Farm",
  "Marketplace", "Post Office"
];
```

{{index "routeRobot function"}}

To implement the route-following robot, we'll need to make use of robot memory. The robot keeps the rest of its route in its memory and drops the first element every turn.

```{includeCode: true}
function routeRobot(state, memory) {
  if (memory.length == 0) {
    memory = mailRoute;
  }
  return {direction: memory[0], memory: memory.slice(1)};
}
```

This robot is a lot faster already. It'll take a maximum of 26 turns (twice the 13-step route) but usually less.

{{if interactive

```{test: no}
runRobotAnimation(VillageState.random(), routeRobot, []);
```

if}}

## Yol bulma

Still, I wouldn't really call blindly following a fixed route intelligent behavior. The ((robot)) could work more efficiently if it adjusted its behavior to the actual work that needs to be done.

{{index pathfinding}}

To do that, it has to be able to deliberately move toward a given parcel or toward the location where a parcel has to be delivered. Doing that, even when the goal is more than one move away, will require some kind of route-finding function.

The problem of finding a route through a ((graph)) is a typical _((search problem))_. We can tell whether a given solution (a route) is a valid solution, but we can't directly compute the solution the way we could for 2 + 2. Instead, we have to keep creating potential solutions until we find one that works.

The number of possible routes through a graph is infinite. But when searching for a route from _A_ to _B_, we are interested only in the ones that start at _A_. We also don't care about routes that visit the same place twice—those are definitely not the most efficient route anywhere. So that cuts down on the number of routes that the route finder has to consider.

In fact, we are mostly interested in the _shortest_ route. So we want to make sure we look at short routes before we look at longer ones. A good approach would be to "grow" routes from the starting point, exploring every reachable place that hasn't been visited yet, until a route reaches the goal. That way, we'll only explore routes that are potentially interesting, and we know that the first route we find is the shortest route (or one of the shortest routes, if there are more than one).

{{index "findRoute function"}}

{{id findRoute}}

Here is a function that does this:

```{includeCode: true}
function findRoute(graph, from, to) {
  let work = [{at: from, route: []}];
  for (let i = 0; i < work.length; i++) {
    let {at, route} = work[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place);
      if (!work.some(w => w.at == place)) {
        work.push({at: place, route: route.concat(place)});
      }
    }
  }
}
```

The exploring has to be done in the right order—the places that were reached first have to be explored first. We can't immediately explore a place as soon as we reach it because that would mean places reached _from there_ would also be explored immediately, and so on, even though there may be other, shorter paths that haven't yet been explored.

Therefore, the function keeps a _((work list))_. This is an array of places that should be explored next, along with the route that got us there. It starts with just the start position and an empty route.

The search then operates by taking the next item in the list and exploring that, which means all roads going from that place are looked at. If one of them is the goal, a finished route can be returned. Otherwise, if we haven't looked at this place before, a new item is added to the list. If we have looked at it before, since we are looking at short routes first, we've found either a longer route to that place or one precisely as long as the existing one, and we don't need to explore it.

You can visually imagine this as a web of known routes crawling out from the start location, growing evenly on all sides (but never tangling back into itself). As soon as the first thread reaches the goal location, that thread is traced back to the start, giving us our route.

{{index "connected graph"}}

Our code doesn't handle the situation where there are no more work items on the work list because we know that our graph is _connected_, meaning that every location can be reached from all other locations. We'll always be able to find a route between two points, and the search can't fail.

```{includeCode: true}
function goalOrientedRobot({place, parcels}, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return {direction: route[0], memory: route.slice(1)};
}
```

{{index "goalOrientedRobot function"}}

This robot uses its memory value as a list of directions to move in, just like the route-following robot. Whenever that list is empty, it has to figure out what to do next. It takes the first undelivered parcel in the set and, if that parcel hasn't been picked up yet, plots a route toward it. If the parcel _has_ been picked up, it still needs to be delivered, so the robot creates a route toward the delivery address instead.

{{if interactive

Let's see how it does.

```{test: no, startCode: true}
runRobotAnimation(VillageState.random(),
                  goalOrientedRobot, []);
```

if}}

This robot usually finishes the task of delivering 5 parcels in about 16 turns. That's slightly better than `routeRobot` but still definitely not optimal.

## Egzersizler

### Bir robotun ölçülmesi

{{index "measuring a robot (exercise)", testing, automation, "compareRobots function"}}

It's hard to objectively compare ((robot))s by just letting them solve a few scenarios. Maybe one robot just happened to get easier tasks or the kind of tasks that it is good at, whereas the other didn't.

Write a function `compareRobots` that takes two robots (and their starting memory). It should generate 100 tasks and let each of the robots solve each of these tasks. When done, it should output the average number of steps each robot took per task.

For the sake of fairness, make sure you give each task to both robots, rather than generating different tasks per robot.

{{if interactive

```{test: no}
function compareRobots(robot1, memory1, robot2, memory2) {
  // Your code here
}

compareRobots(routeRobot, [], goalOrientedRobot, []);
```

if}}

{{hint

{{index "measuring a robot (exercise)", "runRobot function"}}

You'll have to write a variant of the `runRobot` function that, instead of logging the events to the console, returns the number of steps the robot took to complete the task.

Your measurement function can then, in a loop, generate new states and count the steps each of the robots takes. When it has generated enough measurements, it can use `console.log` to output the average for each robot, which is the total number of steps taken divided by the number of measurements.

hint}}

### Robot verimliliği

{{index "robot efficiency (exercise)"}}

Can you write a robot that finishes the delivery task faster than `goalOrientedRobot`? If you observe that robot's behavior, what obviously stupid things does it do? How could those be improved?

If you solved the previous exercise, you might want to use your `compareRobots` function to verify whether you improved the robot.

{{if interactive

```{test: no}
// Your code here

runRobotAnimation(VillageState.random(), yourRobot, memory);
```

if}}

{{hint

{{index "robot efficiency (exercise)"}}

The main limitation of `goalOrientedRobot` is that it considers only one parcel at a time. It will often walk back and forth across the village because the parcel it happens to be looking at happens to be at the other side of the map, even if there are others much closer.

One possible solution would be to compute routes for all packages and then take the shortest one. Even better results can be obtained, if there are multiple shortest routes, by preferring the ones that go to pick up a package instead of delivering a package.

hint}}

### Kalıcı grup

{{index "persistent group (exercise)", "persistent data structure", "Set class", "set (data structure)", "Group class", "PGroup class"}}

Most data structures provided in a standard JavaScript environment aren't very well suited for persistent use. Arrays have `slice` and `concat` methods, which allow us to easily create new arrays without damaging the old one. But `Set`, for example, has no methods for creating a new set with an item added or removed.

Write a new class `PGroup`, similar to the `Group` class from [Chapter ?](object#groups), which stores a set of values. Like `Group`, it has `add`, `delete`, and `has` methods.

Its `add` method, however, should return a _new_ `PGroup` instance with the given member added and leave the old one unchanged. Similarly, `delete` creates a new instance without a given member.

The class should work for values of any type, not just strings. It does _not_ have to be efficient when used with large amounts of values.

{{index [interface, object]}}

The ((constructor)) shouldn't be part of the class's interface (though you'll definitely want to use it internally). Instead, there is an empty instance, `PGroup.empty`, that can be used as a starting value.

{{index singleton}}

Why do you need only one `PGroup.empty` value, rather than having a function that creates a new, empty map every time?

{{if interactive

```{test: no}
class PGroup {
  // Your code here
}

let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false
```

if}}

{{hint

{{index "persistent map (exercise)", "Set class", [array, creation], "PGroup class"}}

The most convenient way to represent the set of member values is still as an array since arrays are easy to copy.

{{index "concat method", "filter method"}}

When a value is added to the group, you can create a new group with a copy of the original array that has the value added (for example, using `concat`). When a value is deleted, you filter it from the array.

The class's ((constructor)) can take such an array as argument and store it as the instance's (only) property. This array is never updated.

{{index "static property"}}

To add the `empty` property to the constructor, you can declare it as a static property.

You need only one `empty` instance because all empty groups are the same and instances of the class don't change. You can create many different groups from that single empty group without affecting it.

hint}}
