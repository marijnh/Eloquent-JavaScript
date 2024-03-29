{{meta {load_files: ["code/chapter/06_object.js"], zip: "node/html"}}}

# Nesnelerin Gizli Yaşamı

{{quote {author: "Barbara Liskov", title: "Programming with Abstract Data Types", chapter: true}

Bir soyut veri türü, üzerinde gerçekleştirilebilecek işlemler açısından türü tanımlayan bir programı […] yazarak gerçekleştirilir.

quote}}

{{index "Liskov, Barbara", "abstract data type"}}

{{figure {url: "img/chapter_picture_6.jpg", alt: "Bir tavşanın prototipinin yanında bir tavşanın şematik temsili resmi", chapter: framed}}}

[Chapter ?](data) introduced JavaScript's objects, as containers that hold other data.

Programlama kültüründe, _((nesne yönelimli programlama))_ adında bir şey var, nesneleri program organizasyonunun merkezi prensibi olarak kullanan bir teknik seti. Kesin tanımı hakkında herkes gerçekten anlaşmıyor olsa da, nesne yönelimli programlama birçok programlama dilinin tasarımını şekillendirmiştir, bunlar arasında JavaScript de bulunur. Bu bölüm, bu fikirlerin JavaScript'te nasıl uygulanabileceğini açıklanmaktadır.

## Soyut Veri Türleri

{{index "abstract data type", type, "mixer example"}}

Nesne yönelimli programlamadaki ana fikir, nesneleri veya daha doğrusu nesne türlerini, program organizasyonunun birimi olarak kullanmaktır. Programı birkaç sıkı şekilde ayrılmış nesne türü olarak ayarlamak, yapısını düşünmenin bir yolunu sağlar ve böylece her şeyin karışmasını önleyerek bir tür disiplin uygular.

Bunu yapmanın yolu, nesneleri bir elektrikli mikser veya diğer tüketici ((alet)) gibi düşünmektir. Bir mikser tasarlayan ve monte eden insanlar vardır ve bunlar malzeme bilimi ve elektrik anlayışı gerektiren özelleşmiş işleri yapmak zorundadır. Tüm bunları pürüzsüz bir plastik kabuk içine kapatırlar, böylece sadece pancake hamurunu karıştırmak isteyen insanların bunlarla ilgilenmesine gerek kalmaz—sadece mikserin çalıştırılabilmesi için birkaç düğmeyi anlamaları yeterlidir.

{{index "class"}}

Benzer şekilde, bir soyut veri türü veya nesne sınıfı, onunla çalışan kişilerin kullanması gereken sınırlı bir yöntem ve özellik setini açığa çıkarabilen, ancak karmaşık kod içerebilen bir alt programdır. Bu, büyük programların birçok alet türü üzerine kurulabilmesine olanak tanır ve bu farklı parçaların sadece belirli yollarla birbirleriyle etkileşime girmesini gerektirerek bu parçaların birbirleriyle karışmasını sınırlar.

{{index encapsulation, isolation, modularity}}

Eğer bir nesne sınıfında bir problem bulunursa, genellikle bu, programın geri kalanını etkilemeden onarılabilir veya tamamen yeniden yazılabilir.

Daha da iyisi, farklı programlardaki birden çok nesne sınıflarını kullanmak mümkün olabilir, bu da bunların işlevselliğini baştan başlatmaya gerek kalmadan kullanılabilir hale getirir. JavaScript'in dahili veri yapılarını, diziler ve dizeler gibi, böyle yeniden kullanılabilir soyut veri türleri olarak düşünebilirsiniz.

{{id interface}}
{{index [interface, object]}}

Her soyut veri türünün bir _arayüzü_ vardır, bu dış kodun onun üzerinde gerçekleştirebileceği işlemlerin koleksiyonudur. Sayılar gibi temel şeyler bile, onları ekleyebilme, çarpabilme, karşılaştırabilme gibi işlemleri gerçekleştirebileceğimiz bir arayüz olarak düşünülebilir. Aslında, klasik nesne yönelimli programlamada ana organizasyon birimi olarak tek _nesnelerin_ odaklanılması biraz talihsizdir çünkü sıklıkla kullanışlı işlev parçaları bir grup farklı nesne sınıfının bir araya gelmesiyle gerçekleşmektedir.

{{id obj_methods}}

## Metodlar

{{index "rabbit example", method, [property, access]}}

JavaScript'te metodlar, yalnızca fonksiyon değerlerini tutan özelliklerdir. Bu, basit bir metottur:

```{includeCode: "top_lines:6"}
function speak(line) {
  console.log(`The ${this.type} rabbit says '${line}'`);
}
let whiteRabbit = {type: "white", speak};
let hungryRabbit = {type: "hungry", speak};

whiteRabbit.speak("Oh my fur and whiskers");
// → The white rabbit says 'Oh my fur and whiskers'
hungryRabbit.speak("Got any carrots?");
// → The hungry rabbit says 'Got any carrots?'
```

{{index "this binding", "method call"}}

Tipik olarak, bir yöntem, üzerinde çağrıldığı nesneyle bir şeyler yapması gerekir. Bir işlev bir yöntem olarak çağrıldığında—`object.method()` ifadesinde de olduğu gibi bir özellik aranıp çağırılır— `this` adlı bağlantı çağırılan fonksiyonun vücudu içinde otomatik olarak çağrıldığı nesneye işaret eder.

{{id call_method}}

{{index "call method"}}

`this` değerini, normal parametrelerden farklı bir şekilde bir fonskiyona verilen bir ek ((parametre)) olarak düşünebilirsiniz. Açıkça sağlamak isterseniz, bir fonksiyonun `call` metodunu kullanabilirsiniz, bu yöntem `this` değerini ilk argümanı olarak alır ve diğer argümanları normal parametreler olarak işler.

```
speak.call(whiteRabbit, "Hurry");
// → The white rabbit says 'Hurry'
```

Her fonksiyonun, değeri nasıl çağrıldığına bağlı olan kendi `this` bağlantısı olduğundan, bir `function` anahtar sözcüğü ile tanımlanan sıradan bir fonksiyonda kapsamın dışındaki `this` değerine başvuramazsınız.

{{index "this binding", "arrow function"}}

Ok fonksiyonları farklıdır—kendi `this` değerlerini bağlamazlar, ancak etraflarındaki kapsamın `this` bağlamını görebilirler. Bu nedenle, yerel bir fonksiyonun içinden `this` değerine ulaşan aşağıdaki gibi bir kod yazabilirsiniz:

```
let finder = {
  find(array) {
    return array.some(v => v == this.value);
  },
  value: 5
};
console.log(finder.find([4, 5]));
// → true
```

Nesne ifadesindeki `find(array)` gibi bir özellik, bir metod tanımlamanın kısa yoludur. `find` adında bir özellik oluşturur ve değeri olarak bir fonksiyon verir.

Eğer `some` metoduna geçirilen argümanı `function` anahtar kelimesini kullanarak yazmış olsaydım, bu kod çalışmazdı.

{{id prototypes}}

## Prototipler

Bir `speak` metoduna sahip soyut bir tavşan türü oluşturmanın bir yolu, tavşan türünü parametre olarak alan ve bu türün tip özelliği ve konuşma fonksiyonunu içeren bir nesneyi döndüren bir yardımcı fonksiyon oluşturmaktır.

Tüm tavşanlar aynı yöntemi paylaşırlar. Özellikle çok sayıda metoda sahip türler için, bir türün yöntemlerini her nesneye ayrı ayrı eklemek yerine tek bir yerde tutmanın bir yolu olsa iyi olurdu.

{{index [property, inheritance], [object, property], "Object prototype"}}

JavaScript'te, _((prototipler))_ bunu yapmanın yoludur. Nesneler, diğer nesnelere bağlanarak diğer nesnenin sahip olduğu tüm özellikleri sihirli bir şekilde alabilirler. `{}` gösterimiyle oluşturulan normal nesneler, `Object.prototype` olarak adlandırılan bir nesneye bağlıdır.

{{index "toString method"}}

```
let empty = {};
console.log(empty.toString);
// → function toString(){…}
console.log(empty.toString());
// → [object Object]
```

Boş bir nesneden bir özellik çıkardık gibi görünüyor. Ancak aslında `toString`, `Object.prototype` içinde depolanan bir yöntemdir, bu da çoğu nesnede mevcut olduğu anlamına gelir.

Bir nesne sahip olmadığı bir özelliğe istek aldığında, prototipi içinde bu özellik aranır. Eğer o prototip de bu özelliğe sahip değilse, _onun da_ prototipi aranır ve `Object.prototype` gibi artık bir prototip barındırmayan objeye kadar bu arama devam eder.

```
console.log(Object.getPrototypeOf({}) == Object.prototype);
// → true
console.log(Object.getPrototypeOf(Object.prototype));
// → null
```

{{index "getPrototypeOf function"}}

Tahmin edebileceğiniz gibi, `Object.getPrototypeOf` bir nesnenin prototipini döndürür.

{{index inheritance, "Function prototype", "Array prototype", "Object prototype"}}

Birçok nesnenin ((prototipi)) olarak doğrudan `Object.prototype`'a sahip olmadığı, ancak farklı bir varsayılan özellik kümesi sağlayan başka bir nesneye sahip olduğu durumlar vardır. Fonksiyonlar `Function.prototype`'tan, diziler ise `Array.prototype`'tan türemiştir.

```
console.log(Object.getPrototypeOf(Math.max) ==
            Function.prototype);
// → true
console.log(Object.getPrototypeOf([]) == Array.prototype);
// → true
```

{{index "Object prototype"}}

Bu tür bir prototip nesnesinin kendisinin de genellikle `Object.prototype` gibi bir prototipi olacaktır ki böylece hala `toString` gibi yöntemlere erişim sağlayabilsin.

{{index "rabbit example", "Object.create function"}}

Belirli bir ((prototip)) ile bir nesne oluşturmak için `Object.create`'i kullanabilirsiniz.

```{includeCode: "top_lines: 7"}
let protoRabbit = {
  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
};
let blackRabbit = Object.create(protoRabbit);
blackRabbit.type = "black";
blackRabbit.speak("I am fear and darkness");
// → The black rabbit says 'I am fear and darkness'
```

{{index "shared property"}}

"proto" tavşanı, tüm tavşanlar tarafından paylaşılan özellikleri içeren bir konteyner olarak davranır. Bir bireysel tavşan nesnesi, kendisine sadece kendi üzerine uygulanan özellikleri içerir—bu durumda tipi—ve paylaşılan özellikleri prototipinden türetir.

{{id classes}}

## Class'lar

{{index "object-oriented programming", "abstract data type"}}

JavaScript'in ((prototip)) sistemi, soyut veri tipleri veya ((sınıf))larının biraz serbest bir şekilde ele alınmış hali olarak yorumlanabilir. Bir sınıf, bir nesne türünün şeklini tanımlar—hangi yöntemlere ve özelliklere sahip olduğunu belirtir. Bu tür bir nesne, sınıfın bir ((örneği)) olarak adlandırılır.

{{index [property, inheritance]}}

Prototipler, bir sınıfın tüm örneklerinin aynı değere sahip olmasını istediğiniz özelliklerin tanımlanması için kullanışlıdır. Örneğin tavşanlarımızın tip özelliği gibi örnek başına farklı olan özellikler, doğrudan nesnelerin kendilerinde saklanmalıdır.

{{id constructors}}

Belirli bir sınıfın bir örneğini oluşturmak için, uygun prototipten türeyen bir nesne yapmak zorundasınız, ancak ayrıca, kendisinin de bu sınıfın örneklerinin sahip olması gereken özelliklere sahip olduğundan emin olmanız gerekir. Bu, bir ((constructor)) fonksiyonun ne yaptığını gösterir.

```
function makeRabbit(type) {
  let rabbit = Object.create(protoRabbit);
  rabbit.type = type;
  return rabbit;
}
```

JavaScript'in ((sınıf)) notasyonu, bu tür bir fonksiyonu tanımlamayı ((prototip)) nesnesiyle kolaylaştırır.

{{index "rabbit example", constructor}}

```{includeCode: true}
class Rabbit {
  constructor(type) {
    this.type = type;
  }
  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
}
```

{{index "prototype property", [braces, class]}}

`class` anahtar kelimesi, bir ((sınıf bildirimi)) başlatır ve bir constructor ve bir dizi yöntemi bir arada tanımlamamıza olanak tanır. Bildirimin parantezleri içinde herhangi bir sayıda yöntem yazılabilir. Bu kod, `constructor` içindeki kodu çalıştıran ve `speak` yöntemini içeren bir `prototype` özelliğini tutan Rabbit adında bir bağlantı tanımlar.

{{index "new operator", "this binding", [object, creation]}}

Bu fonksiyon normal bir şekilde çağrılamaz. JavaScript'te, constructor'ları çağırmak için önlerine `new` anahtar kelimesini koymak gerekir. Bunu yapınca, fonksiyonun `prototype` özelliğini prototip olarak barındıran yeni bir obje oluşturulur ve fonksiyonun `this` bağlamını bu yeni oluşturulan objeye bağlayarak fonksiyonu çağırır, son olarak objeyi döndürür.

```{includeCode: true}
let killerRabbit = new Rabbit("killer");
```

Aslında, `class` JavaScript'in 2015 versiyonunda tanıtıldı. Herhangi bir fonksiyon bir constructor olarak kullanılabilir, ki zaten 2015'ten önce class tanımlamanın yolu normal bir fonksiyon yazıp ardından onun prototype özelliğini manipüle etmekti.

```
function ArchaicRabbit(type) {
  this.type = type;
}
ArchaicRabbit.prototype.speak = function(line) {
  console.log(`The ${this.type} rabbit says '${line}'`);
};
let oldSchoolRabbit = new ArchaicRabbit("old school");
```

Ok notasyonunda yazılmayan tüm fonksiyonların boş bir obje barındıran `prototype` özelliğiyle başlamasının sebebi budur.

{{index capitalization}}

Geleneksel olarak, constructor adları diğer fonksiyonlardan kolayca ayırt edilebilmeleri için büyük harfle yazılır.

{{index "prototype property", "getPrototypeOf function"}}

Bir ((prototipin)) bir constructor ile ilişkilendirilme şekli (onun prototype _özelliği_ aracılığıyla) ve bir nesnenin zaten var olan prototipi(bu, `Object.getPrototypeOf` ile bulunabilir) arasındaki farkı anlamanız önemlidir. Bir constructor gerçek prototipi, constructor'lar fonksiyon olduklarından ötürü `Function.prototype`'dır. `prototype` _özelliği_, bunun aracılığıyla oluşturulan örnekler için kullanılan prototipi tutar.

```
console.log(Object.getPrototypeOf(Rabbit) ==
            Function.prototype);
// → true
console.log(Object.getPrototypeOf(killerRabbit) ==
            Rabbit.prototype);
// → true
```

{{index constructor}}

Constructor'lar, genellikle `this`'e örnek başı değer atanacak birkaç özellik ekler. Özellikleri ayrıca ((sınıf bildirimi)) içinde doğrudan bildirmek de mümkündür. Metodların aksine, böyle özellikler ((örnek)) nesnelere eklenir, prototipe değil.

```
class Particle {
  speed = 0;
  constructor(position) {
    this.position = position;
  }
}
```

`function` gibi, `class` hem beyanlarda hem de ifadelerde kullanılabilir. Bir ifade olarak kullanıldığında, bir bağlantı tanımlamaz, ancak sadece constructor'ı bir değer olarak üretir. Bir sınıf ifadesinde sınıf adının atlanması mümkündür.

```
let object = new class { getWord() { return "hello"; } };
console.log(object.getWord());
// → hello
```

## Özel Özellikler

{{index [property, private], [property, public], "class declaration"}}

It is common for classes to define some properties and ((method))s for internal use, which are not part of their ((interface)). These are called _private_ properties, as opposed to _public_ ones, which are part of the object's external interface.

{{index [method, private]}}

To declare a private method, put a `#` sign in front of its name. Such methods can only be called from inside the `class` declaration that defines them.

```
class SecretiveObject {
  #getSecret() {
    return "I ate all the plums";
  }
  interrogate() {
    let shallISayIt = this.#getSecret();
    return "never";
  }
}
```

If you try to call `#getSecret` from outside the class, you get an error. Its existence is entirely hidden inside the class declaration.

To use private instance properties, you must declare them. Regular properties can be created by just assigning to them, but private properties _must_ be declared in the class declaration to be available at all.

This class implements an appliance for getting random whole number below a given maximum number. It only has one ((public)) property: `getNumber`.

```
class RandomSource {
  #max;
  constructor(max) {
    this.#max = max;
  }
  getNumber() {
    return Math.floor(Math.random() * this.#max);
  }
}
```

## Türetilmiş özellikleri geçersiz kılma

{{index "shared property", overriding, [property, inheritance]}}

When you add a property to an object, whether it is present in the prototype or not, the property is added to the object _itself_. If there was already a property with the same name in the prototype, this property will no longer affect the object, as it is now hidden behind the object's own property.

```
Rabbit.prototype.teeth = "small";
console.log(killerRabbit.teeth);
// → small
killerRabbit.teeth = "long, sharp, and bloody";
console.log(killerRabbit.teeth);
// → long, sharp, and bloody
console.log((new Rabbit("basic")).teeth);
// → small
console.log(Rabbit.prototype.teeth);
// → small
```

{{index [prototype, diagram]}}

The following diagram sketches the situation after this code has run. The `Rabbit` and `Object` ((prototype))s lie behind `killerRabbit` as a kind of backdrop, where properties that are not found in the object itself can be looked up.

{{figure {url: "img/rabbits.svg", alt: "A diagram showing the object structure of rabbits and their prototypes. There is a box for the 'killerRabbit' instance (holding instance properties like 'type'), with its two prototypes, 'Rabbit.prototype' (holding the 'speak' method) and 'Object.prototype' (holding methods like 'toString') stacked behind it.",width: "8cm"}}}

{{index "shared property"}}

Overriding properties that exist in a prototype can be a useful thing to do. As the rabbit teeth example shows, overriding can be used to express exceptional properties in instances of a more generic class of objects, while letting the nonexceptional objects take a standard value from their prototype.

{{index "toString method", "Array prototype", "Function prototype"}}

Overriding is also used to give the standard function and array prototypes a different `toString` method than the basic object prototype.

```
console.log(Array.prototype.toString ==
            Object.prototype.toString);
// → false
console.log([1, 2].toString());
// → 1,2
```

{{index "toString method", "join method", "call method"}}

Calling `toString` on an array gives a result similar to calling `.join(",")` on it—it puts commas between the values in the array. Directly calling `Object.prototype.toString` with an array produces a different string. That function doesn't know about arrays, so it simply puts the word _object_ and the name of the type between square brackets.

```
console.log(Object.prototype.toString.call([1, 2]));
// → [object Array]
```

## Map'ler

{{index "map method"}}

We saw the word _map_ used in the [previous chapter](higher_order#map) for an operation that transforms a data structure by applying a function to its elements. Confusing as it is, in programming the same word is also used for a related but rather different thing.

{{index "map (data structure)", "ages example", ["data structure", map]}}

A _map_ (noun) is a data structure that associates values (the keys) with other values. For example, you might want to map names to ages. It is possible to use objects for this.

```
let ages = {
  Boris: 39,
  Liang: 22,
  Júlia: 62
};

console.log(`Júlia is ${ages["Júlia"]}`);
// → Júlia is 62
console.log("Is Jack's age known?", "Jack" in ages);
// → Is Jack's age known? false
console.log("Is toString's age known?", "toString" in ages);
// → Is toString's age known? true
```

{{index "Object.prototype", "toString method"}}

Here, the object's property names are the people's names, and the property values are their ages. But we certainly didn't list anybody named toString in our map. Yet, because plain objects derive from `Object.prototype`, it looks like the property is there.

{{index "Object.create function", prototype}}

As such, using plain objects as maps is dangerous. There are several possible ways to avoid this problem. First, it is possible to create objects with _no_ prototype. If you pass `null` to `Object.create`, the resulting object will not derive from `Object.prototype` and can safely be used as a map.

```
console.log("toString" in Object.create(null));
// → false
```

{{index [property, naming]}}

Object property names must be strings. If you need a map whose keys can't easily be converted to strings—such as objects—you cannot use an object as your map.

{{index "Map class"}}

Fortunately, JavaScript comes with a class called `Map` that is written for this exact purpose. It stores a mapping and allows any type of keys.

```
let ages = new Map();
ages.set("Boris", 39);
ages.set("Liang", 22);
ages.set("Júlia", 62);

console.log(`Júlia is ${ages.get("Júlia")}`);
// → Júlia is 62
console.log("Is Jack's age known?", ages.has("Jack"));
// → Is Jack's age known? false
console.log(ages.has("toString"));
// → false
```

{{index [interface, object], "set method", "get method", "has method", encapsulation}}

The methods `set`, `get`, and `has` are part of the interface of the `Map` object. Writing a data structure that can quickly update and search a large set of values isn't easy, but we don't have to worry about that. Someone else did it for us, and we can go through this simple interface to use their work.

{{index "hasOwn function", "in operator"}}

If you do have a plain object that you need to treat as a map for some reason, it is useful to know that `Object.keys` returns only an object's _own_ keys, not those in the prototype. As an alternative to the `in` operator, you can use the `Object.hasOwn` function, which ignores the object's prototype.

```
console.log(Object.hasOwn({x: 1}, "x"));
// → true
console.log(Object.hasOwn({x: 1}, "toString"));
// → false
```

## Polimorfizm

{{index "toString method", "String function", polymorphism, overriding, "object-oriented programming"}}

When you call the `String` function (which converts a value to a string) on an object, it will call the `toString` method on that object to try to create a meaningful string from it. I mentioned that some of the standard prototypes define their own version of `toString` so they can create a string that contains more useful information than `"[object Object]"`. You can also do that yourself.

```{includeCode: "top_lines: 3"}
Rabbit.prototype.toString = function() {
  return `a ${this.type} rabbit`;
};

console.log(String(killerRabbit));
// → a killer rabbit
```

{{index "object-oriented programming", [interface, object]}}

This is a simple instance of a powerful idea. When a piece of code is written to work with objects that have a certain interface—in this case, a `toString` method—any kind of object that happens to support this interface can be plugged into the code, and it will be able to work with it.

This technique is called _polymorphism_. Polymorphic code can work with values of different shapes, as long as they support the interface it expects.

{{index "forEach method"}}

An example of a widely used interface is that of ((array-like object))s which have a `length` property holding a number, and numbered properties for each of their elements. Both arrays and strings support this interface, as do various other objects, some of which we'll see later in the chapters about the browser. Our implementation of `forEach` from [Chapter ?](higher_order) works on anything that provides this interface. In fact, so does `Array.prototype.forEach`.

```
Array.prototype.forEach.call({
  length: 2,
  0: "A",
  1: "B"
}, elt => console.log(elt));
// → A
// → B
```

## Getter'lar, setter'lar, and static'ler

{{index [interface, object], [property, definition], "Map class"}}

Interfaces often contain plain properties, not just methods. For example, `Map` objects have a `size` property that tells you how many keys are stored in them.

It is not necessary for such an object to compute and store such a property directly in the instance. Even properties that are accessed directly may hide a method call. Such methods are called _((getter))s_, and they are defined by writing `get` in front of the method name in an object expression or class declaration.

```{test: no}
let varyingSize = {
  get size() {
    return Math.floor(Math.random() * 100);
  }
};

console.log(varyingSize.size);
// → 73
console.log(varyingSize.size);
// → 49
```

{{index "temperature example"}}

Whenever someone reads from this object's `size` property, the associated method is called. You can do a similar thing when a property is written to, using a _((setter))_.

```{test: no, startCode: true}
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }
  get fahrenheit() {
    return this.celsius * 1.8 + 32;
  }
  set fahrenheit(value) {
    this.celsius = (value - 32) / 1.8;
  }

  static fromFahrenheit(value) {
    return new Temperature((value - 32) / 1.8);
  }
}

let temp = new Temperature(22);
console.log(temp.fahrenheit);
// → 71.6
temp.fahrenheit = 86;
console.log(temp.celsius);
// → 30
```

The `Temperature` class allows you to read and write the temperature in either degrees ((Celsius)) or degrees ((Fahrenheit)), but internally it stores only Celsius and automatically converts to and from Celsius in the `fahrenheit` getter and setter.

{{index "static method", "static property"}}

Sometimes you want to attach some properties directly to your constructor function, rather than to the prototype. Such methods won't have access to a class instance but can, for example, be used to provide additional ways to create instances.

Inside a class declaration, methods or properties that have `static` written before their name are stored on the constructor. So the `Temperature` class allows you to write `Temperature.fromFahrenheit(100)` to create a temperature using degrees Fahrenheit.

## Symbol'lar

{{index "for/of loop", "iterator interface"}}

I mentioned in [Chapter ?](data#for_of_loop) that a `for`/`of` loop can loop over several kinds of data structures. This is another case of polymorphism—such loops expect the data structure to expose a specific interface, which arrays and strings do. And we can also add this interface to our own objects! But before we can do that, we need to briefly take a look at the symbol type.

It is possible for multiple interfaces to use the same property name for different things. For example, on array-like objects, `length` refers to the amount of elements in the collection. But an object interface describing a hiking route could use `length` to provide the length of the route in meters. It would not be possible for an object to conform to both these interfaces.

An object trying to be a route and array-like (maybe to enumerate its waypoints) is somewhat far-fetched, and this kind of problem isn't that common in practice. But for things like the iteration protocol, the language designers needed a type of property that _really_ doesn't conflict with any others. So in 2015, _((symbol))s_ were added to the language.

{{index "Symbol function", [property, naming]}}

Most properties, including all the properties we have seen so far, are named with strings. But it is also possible to use symbols as property names. Symbols are values created with the `Symbol` function. Unlike strings, newly created symbols are unique—you cannot create the same symbol twice.

```
let sym = Symbol("name");
console.log(sym == Symbol("name"));
// → false
Rabbit.prototype[sym] = 55;
console.log(killerRabbit[sym]);
// → 55
```

The string you pass to `Symbol` is included when you convert it to a string and can make it easier to recognize a symbol when, for example, showing it in the console. But it has no meaning beyond that—multiple symbols may have the same name.

Being both unique and usable as property names makes symbols suitable for defining interfaces that can peacefully live alongside other properties, no matter what their names are.

```{includeCode: "top_lines: 1"}
const length = Symbol("length");
Array.prototype[length] = 0;

console.log([1, 2].length);
// → 2
console.log([1, 2][length]);
// → 0
```

{{index [property, naming]}}

It is possible to include symbol properties in object expressions and classes by using ((square bracket))s around the property name. That causes the expression between the brackets to be evaluated to produce the property name, analoguous to the square bracket property access notation.

```
let myTrip = {
  length: 2,
  0: "Lankwitz",
  1: "Babelsberg",
  [length]: 21500
};
console.log(myTrip[length], myTrip.length);
// → 21500 2
```

## Yineleyici arayüzü

{{index "iterable interface", "Symbol.iterator symbol", "for/of loop"}}

The object given to a `for`/`of` loop is expected to be _iterable_. This means it has a method named with the `Symbol.iterator` symbol (a symbol value defined by the language, stored as a property of the `Symbol` function).

{{index "iterator interface", "next method"}}

When called, that method should return an object that provides a second interface, _iterator_. This is the actual thing that iterates. It has a `next` method that returns the next result. That result should be an object with a `value` property that provides the next value, if there is one, and a `done` property, which should be true when there are no more results and false otherwise.

Note that the `next`, `value`, and `done` property names are plain strings, not symbols. Only `Symbol.iterator`, which is likely to be added to a _lot_ of different objects, is an actual symbol.

We can directly use this interface ourselves.

```
let okIterator = "OK"[Symbol.iterator]();
console.log(okIterator.next());
// → {value: "O", done: false}
console.log(okIterator.next());
// → {value: "K", done: false}
console.log(okIterator.next());
// → {value: undefined, done: true}
```

{{index ["data structure", list], "linked list", collection}}

Let's implement an iterable data structure similar to the linked list from the exercise in [Chapter ?](data). We'll write the list as a class this time.

```{includeCode: true}
class List {
  constructor(value, rest) {
    this.value = value;
    this.rest = rest;
  }

  get length() {
    return 1 + (this.rest ? this.rest.length : 0);
  }

  static fromArray(array) {
    let result = null;
    for (let i = array.length - 1; i >= 0; i--) {
      result = new this(array[i], result);
    }
    return result;
  }
}
```

Note that `this`, in a static method, points at the constructor of the class, not an instance—there is no instance around, when a static method is called.

Iterating over a list should return all the list's elements from start to end. We'll write a separate class for the iterator.

{{index "ListIterator class"}}

```{includeCode: true}
class ListIterator {
  constructor(list) {
    this.list = list;
  }

  next() {
    if (this.list == null) {
      return {done: true};
    }
    let value = this.list.value;
    this.list = this.list.rest;
    return {value, done: false};
  }
}
```

The class tracks the progress of iterating through the list by updating its `list` property to move to the next list object whenever a value is returned, and reports that it is done when that list is empty (null).

Let's set up the `List` class to be iterable. Throughout this book, I'll occasionally use after-the-fact prototype manipulation to add methods to classes so that the individual pieces of code remain small and self-contained. In a regular program, where there is no need to split the code into small pieces, you'd declare these methods directly in the class instead.

```{includeCode: true}
List.prototype[Symbol.iterator] = function() {
  return new ListIterator(this);
};
```

{{index "for/of loop"}}

We can now loop over a list with `for`/`of`.

```
let list = List.fromArray([1, 2, 3]);
for (let element of list) {
  console.log(element);
}
// → 1
// → 2
// → 3
```

{{index spread}}

The `...` syntax in array notation and function calls similarly works with any iterable object. So for example, you can use `[...value]` to create an array containing the elements in an arbitrary iterable object.

```
console.log([..."PCI"]);
// → ["P", "C", "I"]
```

## Inheritance

{{index inheritance, "linked list", "object-oriented programming", "LengthList class"}}

Imagine we needed a list type, much like the `List` class we saw before, but because we will be asking for its length all the time, we don't want it to have to scan through its `rest` every time, and instead want to store the length in every instance for efficient access.

{{index overriding, prototype}}

JavaScript's prototype system makes it possible to create a _new_ class, much like the old class, but with new definitions for some of its properties. The prototype for the new class derives from the old prototype but adds a new definition for, say, the `length` getter.

In object-oriented programming terms, this is called _((inheritance))_. The new class inherits properties and behavior from the old class.

```{includeCode: "top_lines: 17"}
class LengthList extends List {
  #length;

  constructor(value, rest) {
    super(value, rest);
    this.#length = super.length;
  }

  get length() {
    return this.#length;
  }
}

console.log(LengthList.fromArray([1, 2, 3]).length);
// → 3
```

The use of the word `extends` indicates that this class shouldn't be directly based on the default `Object` prototype but on some other class. This is called the _((superclass))_. The derived class is the _((subclass))_.

To initialize a `LengthList` instance, the constructor calls the constructor of its superclass through the `super` keyword. This is necessary because if this new object is to behave (roughly) like a `List`, it is going to need the instance properties that lists have.

The constructor then stores the list's length in a private property. If we had written `this.length` there, the class's own getter would have been called, which doesn't work yet, since `#length` hasn't been filled in yet. We can using `super.something` to call methods and getters on the superclass's prototype, which is often useful.

Inheritance allows us to build slightly different data types from existing data types with relatively little work. It is a fundamental part of the object-oriented tradition, alongside encapsulation and polymorphism. But while the latter two are now generally regarded as wonderful ideas, inheritance is more controversial.

{{index complexity, reuse, "class hierarchy"}}

Whereas ((encapsulation)) and polymorphism can be used to _separate_ pieces of code from each other, reducing the tangledness of the overall program, ((inheritance)) fundamentally ties classes together, creating _more_ tangle. When inheriting from a class, you usually have to know more about how it works than when simply using it. Inheritance can be a useful tool to make some types of programs more succinct, but it shouldn't be the first tool you reach for, and you probably shouldn't actively go looking for opportunities to construct class hierarchies (family trees of classes).

## instanceof operatörü

{{index type, "instanceof operator", constructor, object}}

It is occasionally useful to know whether an object was derived from a specific class. For this, JavaScript provides a binary operator called `instanceof`.

```
console.log(
  new LengthList(1, null) instanceof LengthList);
// → true
console.log(new LengthList(2, null) instanceof List);
// → true
console.log(new List(3, null) instanceof LengthList);
// → false
console.log([1] instanceof Array);
// → true
```

{{index inheritance}}

The operator will see through inherited types, so a `LengthList` is an instance of `List`. The operator can also be applied to standard constructors like `Array`. Almost every object is an instance of `Object`.

## Özet

Objects do more than just hold their own properties. They have prototypes, which are other objects. They'll act as if they have properties they don't have as long as their prototype has that property. Simple objects have `Object.prototype` as their prototype.

Constructors, which are functions whose names usually start with a capital letter, can be used with the `new` operator to create new objects. The new object's prototype will be the object found in the `prototype` property of the constructor. You can make good use of this by putting the properties that all values of a given type share into their prototype. There's a `class` notation that provides a clear way to define a constructor and its prototype.

You can define getters and setters to secretly call methods every time an object's property is accessed. Static methods are methods stored in a class's constructor, rather than its prototype.

The `instanceof` operator can, given an object and a constructor, tell you whether that object is an instance of that constructor.

One useful thing to do with objects is to specify an interface for them and tell everybody that they are supposed to talk to your object only through that interface. The rest of the details that make up your object are now _encapsulated_, hidden behind the interface. You can use private properties to hide a part of your object from the outside world.

More than one type may implement the same interface. Code written to use an interface automatically knows how to work with any number of different objects that provide the interface. This is called _polymorphism_.

When implementing multiple classes that differ in only some details, it can be helpful to write the new classes as _subclasses_ of an existing class, _inheriting_ part of its behavior.

## Egzersizler

{{id exercise_vector}}

### Bir vektör türü

{{index dimensions, "Vec class", coordinates, "vector (exercise)"}}

Write a ((class)) `Vec` that represents a vector in two-dimensional space. It takes `x` and `y` parameters (numbers), which it should save to properties of the same name.

{{index addition, subtraction}}

Give the `Vec` prototype two methods, `plus` and `minus`, that take another vector as a parameter and return a new vector that has the sum or difference of the two vectors' (`this` and the parameter) _x_ and _y_ values.

Add a ((getter)) property `length` to the prototype that computes the length of the vector—that is, the distance of the point (_x_, _y_) from the origin (0, 0).

{{if interactive

```{test: no}
// Your code here.

console.log(new Vec(1, 2).plus(new Vec(2, 3)));
// → Vec{x: 3, y: 5}
console.log(new Vec(1, 2).minus(new Vec(2, 3)));
// → Vec{x: -1, y: -1}
console.log(new Vec(3, 4).length);
// → 5
```

if}}

{{hint

{{index "vector (exercise)"}}

Look back to the `Rabbit` class example if you're unsure how `class` declarations look.

{{index Pythagoras, "defineProperty function", "square root", "Math.sqrt function"}}

Adding a getter property to the constructor can be done by putting the word `get` before the method name. To compute the distance from (0, 0) to (x, y), you can use the Pythagorean theorem, which says that the square of the distance we are looking for is equal to the square of the x-coordinate plus the square of the y-coordinate. Thus, [√(x^2^ + y^2^)]{if html}[[$\sqrt{x^2 + y^2}$]{latex}]{if tex} is the number you want. `Math.sqrt` is the way you compute a square root in JavaScript and `x ** 2` can be used to square a number.

hint}}

### Gruplar

{{index "groups (exercise)", "Set class", "Group class", "set (data structure)"}}

{{id groups}}

The standard JavaScript environment provides another data structure called `Set`. Like an instance of `Map`, a set holds a collection of values. Unlike `Map`, it does not associate other values with those—it just tracks which values are part of the set. A value can be part of a set only once—adding it again doesn't have any effect.

{{index "add method", "delete method", "has method"}}

Write a class called `Group` (since `Set` is already taken). Like `Set`, it has `add`, `delete`, and `has` methods. Its constructor creates an empty group, `add` adds a value to the group (but only if it isn't already a member), `delete` removes its argument from the group (if it was a member), and `has` returns a Boolean value indicating whether its argument is a member of the group.

{{index "=== operator", "indexOf method"}}

Use the `===` operator, or something equivalent such as `indexOf`, to determine whether two values are the same.

{{index "static method"}}

Give the class a static `from` method that takes an iterable object as argument and creates a group that contains all the values produced by iterating over it.

{{if interactive

```{test: no}
class Group {
  // Your code here.
}

let group = Group.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));
// → false
```

if}}

{{hint

{{index "groups (exercise)", "Group class", "indexOf method", "includes method"}}

The easiest way to do this is to store an array of group members in an instance property. The `includes` or `indexOf` methods can be used to check whether a given value is in the array.

{{index "push method"}}

Your class's ((constructor)) can set the member collection to an empty array. When `add` is called, it must check whether the given value is in the array or add it, for example with `push`, otherwise.

{{index "filter method"}}

Deleting an element from an array, in `delete`, is less straightforward, but you can use `filter` to create a new array without the value. Don't forget to overwrite the property holding the members with the newly filtered version of the array.

{{index "for/of loop", "iterable interface"}}

The `from` method can use a `for`/`of` loop to get the values out of the iterable object and call `add` to put them into a newly created group.

hint}}

### Yinelenebilir gruplar

{{index "groups (exercise)", [interface, object], "iterator interface", "Group class"}}

{{id group_iterator}}

Make the `Group` class from the previous exercise iterable. Refer to the section about the iterator interface earlier in the chapter if you aren't clear on the exact form of the interface anymore.

If you used an array to represent the group's members, don't just return the iterator created by calling the `Symbol.iterator` method on the array. That would work, but it defeats the purpose of this exercise.

It is okay if your iterator behaves strangely when the group is modified during iteration.

{{if interactive

```{test: no}
// Your code here (and the code from the previous exercise)

for (let value of Group.from(["a", "b", "c"])) {
  console.log(value);
}
// → a
// → b
// → c
```

if}}

{{hint

{{index "groups (exercise)", "Group class", "next method"}}

It is probably worthwhile to define a new class `GroupIterator`. Iterator instances should have a property that tracks the current position in the group. Every time `next` is called, it checks whether it is done and, if not, moves past the current value and returns it.

The `Group` class itself gets a method named by `Symbol.iterator` that, when called, returns a new instance of the iterator class for that group.

hint}}
