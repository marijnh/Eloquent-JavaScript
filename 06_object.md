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

Sınıfların iç kullanım için ((arayüzlerinin)) bir parçası olmayan bazı özellik ve ((metodlar)) oluşturması yaygındır. Bunlara arayüzün parçası olan _public_ özelliklerin aksine _private_ özellikler denir.

{{index [method, private]}}

Private metod tanımlamak için isminin başına `#` işareti koy. Bu metodlar sadece onları tanımlayan sınıf içerisinden çağırılabilir.

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

Eğer `#getSecret`'ı sınıf dışından çağımaya çalışırsan bir hata alırsın çünkü onun varlığı sıvıf içerisinde tamamen dış dünyadan saklıdır.

Private örnek özelliklerini kullanabilmek için onları önce tanımlamalısın. Normal özellikler onlara sadece bir değer vererek tanımlanabilir ancak private özellikler sınıf içerisinde tanımlanmak zorundadırlar.

Bu sınıf verilen bir maksimum sayının altında rastgele bir sayı gösterecek bir cihazı implemente etmektedir ve sadece bir ((public)) özelliği vardır: `getNumber`.

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

Bir nesneye bir özellik eklediğinde içerisinde o özellik zaten var olsa da olmasa da o özellik nesnenin _kendisine_ eklenir. Eğer prototipte zaten aynı adda bir özellik varsa bu özellik artık o nesneyi o özelliğin başka bir nesneye ait olmasından ötürü etkilemeyecektir.

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

Aşağıdaki diyahram durumu kod çalıştıktan sonra açıklamakta. `Rabbit` ve `Object` ((prototip))leri `killerRabbit`'te aranan özelliklerin kendisinde bulunamayınca bakılacak yedek yerler olarak durmaktadırlar.

{{figure {url: "img/rabbits.svg", alt: "A diagram showing the object structure of rabbits and their prototypes. There is a box for the 'killerRabbit' instance (holding instance properties like 'type'), with its two prototypes, 'Rabbit.prototype' (holding the 'speak' method) and 'Object.prototype' (holding methods like 'toString') stacked behind it.",width: "8cm"}}}

{{index "shared property"}}

Prototipte var olan özelliklere yeni değerler atamak faydalı olabilir. `rabbit.teeth` örneği bunu göstermektedir, yeni değerler atamak istisnai olmayan nesnelerin prototiplerinden standart bir değeri almasına izin verirken, daha genel nesne sınıfının örneklerinde istisnai özellikleri ifade etmek için kullanılabilir.

{{index "toString method", "Array prototype", "Function prototype"}}

Var olan bir özelliğe yeni bir değer atamak, standart fonksiyon ve dizi prototiplerine temel nesne prototipinden farklı bir `toString` metodu vermek için de kullanılır.

```
console.log(Array.prototype.toString ==
            Object.prototype.toString);
// → false
console.log([1, 2].toString());
// → 1,2
```

{{index "toString method", "join method", "call method"}}

Bir dizide `toString` çağırmak, ona `.join(",")` çağırmakla benzer bir sonuç verir—dizideki değerler arasına virgül koyar. Bir diziye doğrudan `Object.prototype.toString` çağırmak farklı bir dize üretir. Bu fonksiyon diziler hakkında bilgi sahibi değildir, bu nedenle sadece _object_ kelimesini ve türün adını köşeli parantezler arasına koyar.

```
console.log(Object.prototype.toString.call([1, 2]));
// → [object Array]
```

## Map'ler

{{index "map method"}}

Bir [önceki bölümde](higher_order#map) _map_ kelimesini, öğelerine bir fonksiyon uygulayarak bir veri yapısını dönüştüren bir işlem için kullanıldığını gördük. Kafa karıştırıcı olmasına rağmen, programlamada aynı kelime ilişkili ancak farklı bir şey için de kullanılır.

{{index "map (data structure)", "ages example", ["data structure", map]}}

Bir _map_ (isim) değerleri (anahtarlar) diğer değerlerle ilişkilendiren bir veri yapısıdır. Örneğin, isimleri yaşlara eşlemek isteyebilirsiniz. Bunun için nesneleri kullanmak mümkündür.

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

Burada, nesnenin özellik adları insanların isimleri, özellik değerleri ise yaşlarıdır. Ancak kesinlikle haritamızda `toString` adında birini listelemedik. Yine de basit nesneler `Object.prototype`'tan türedikleri için, özellik orada gibi görünüyor.

{{index "Object.create function", prototype}}

Bu nedenle, basit nesneleri haritalar olarak kullanmak tehlikelidir. Bu sorunu önlemenin birkaç olası yolu vardır. İlk olarak, hiçbir prototipe sahip olmayan nesneler oluşturmak mümkündür. `Object.create`'e `null` verirseniz, sonuçta elde edilen nesne `Object.prototype`'tan türetilmez ve güvenli bir şekilde bir map olarak kullanılabilir.

```
console.log("toString" in Object.create(null));
// → false
```

{{index [property, naming]}}

Nesne özellik adları dize olmalıdır. Anahtarları kolayca dizilere dönüştürülemeyen bir map'e ihtiyacınız varsa—örneğin nesneler—bir nesneyi map'iniz olarak kullanamazsınız.

{{index "Map class"}}

Neyse ki, JavaScript, tam olarak bu amaca yönelik olan `Map` adında bir sınıf ile gelir. Bir eşleme saklar ve her türden anahtara izin verir.

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

`set`, `get` ve `has` yöntemleri, `Map` nesnesinin arayüzünün bir parçasıdır. Büyük bir değer kümesini hızlı bir şekilde güncelleme ve arama yapabilen bir veri yapısı yazmak kolay değildir, ancak bununla ilgilenmemiz gerekmez. Başkası bunu bizim için yaptı ve bu basit arayüzü kullanarak çalışmalarını kullanabiliriz.

{{index "hasOwn function", "in operator"}}

Herhangi bir nedenden ötürü basit bir nesneye bir map gibi davranmanız gerekiyorsa, `Object.keys`'in yalnızca bir nesnenin kendi anahtarlarını döndürdüğünü, prototiptekilerini döndürmediğini bilmeniz faydalı olabilir. `in` operatörü yerine, nesnenin prototipini yok sayan `Object.hasOwn` fonksiyonunu kullanabilirsiniz.

```
console.log(Object.hasOwn({x: 1}, "x"));
// → true
console.log(Object.hasOwn({x: 1}, "toString"));
// → false
```

## Polimorfizm

{{index "toString method", "String function", polymorphism, overriding, "object-oriented programming"}}

Bir değeri dizeye dönüştüren `String` fonksiyonunu bir nesne üzerinde çağırdığınızda, bu nesne üzerinde `toString` yöntemini çağırarak ondan anlamlı bir dize oluşturmaya çalışır. Bazı standart prototiplerin kendi `toString` versiyonlarını tanımladığını belirttim, böylece `"[object Object]"`'ten daha kullanışlı bilgiler içeren bir dize oluşturabilirler. Kendiniz de bunu yapabilirsiniz.

```{includeCode: "top_lines: 3"}
Rabbit.prototype.toString = function() {
  return `a ${this.type} rabbit`;
};

console.log(String(killerRabbit));
// → a killer rabbit
```

{{index "object-oriented programming", [interface, object]}}

Bu, güçlü bir fikrin basit bir örneğidir. Bir kod parçası, belirli bir arayüzü olan nesnelerle çalışmak üzere yazıldığında—bu durumda bir `toString` yöntemi—bu arayüzü destekleyen herhangi bir nesne kodun içine eklenerek ve onunla çalışabilir.

Bu teknik, _polimorfizm_ olarak adlandırılır. Polimorfik kod, beklediği arayüzü destekleyen farklı şekillerdeki değerlerle çalışabilir.

{{index "forEach method"}}

Yaygın olarak kullanılan örnek olarak verilebilecek bir arayüz örneği, `length` özelliği tutan ve her bir eleman için numaralandırılmış özelliklere sahip ((dizi benzeri nesneler))'in arayüzüdür. Diziler ve dizeler bu arayüzü destekler, aynı şekilde bazı diğer nesneler de destekler, bunlardan bazılarını daha sonra browser hakkındaki bölümlerde göreceğiz. [Bölüm ?](higher_order) içindeki `forEach` uygulamamız, bu arayüzü sağlayan her şeyde çalışır. Aslında, `Array.prototype.forEach` da aynı şekilde çalışır.

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

Arayüzler sadece yöntemler değil, genellikle özellikler içerir. Örneğin, `Map` nesnelerinin bir `size` özelliği vardır ve içlerinde saklanan anahtarların sayısını belirtir.

Böyle bir bir nesnenin bir özelliği doğrudan örnekte hesaplaması ve saklaması gerekli değildir. Doğrudan erişilen özellikler bile bir yöntem çağrısını gizleyebilir. Böyle yöntemlere ((getter)) denir ve bunlar bir nesne ifadesi veya sınıf bildirimi içinde yöntem adının önüne `get` yazarak tanımlanır.

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

Bu nesnenin `size` özelliğinden okuma yapıldığında, ilişkili yöntem çağrılır. Bir özelliğe bir değer atandığında _((setter))_ kullanarak benzer bir şey yapabilirsiniz.

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

`Temperature` sınıfı, sıcaklığı ((°C)) veya ((°F)) olarak okumaya ve yazmaya izin verir, ancak içsel olarak sadece °C'ı depolar ve °F değerini değiştirmek veya okumak istediğinde °C değerini getter ve setter'da formüller kullanarak °F'a çevirir.

{{index "static method", "static property"}}

Bazen, yöntemleri prototip yerine doğrudan constructor fonksiyona eklemek istersiniz. Bu tür yöntemlerin bir sınıf örneğine erişimi olmaz ancak örneğin başka yollarla oluşturulması için kullanılabilirler.

Sınıf bildirimi içinde, adlarının önünde `static` yazılı olan yöntemler veya özellikler kurucuda saklanır. Bu nedenle, `Temperature` sınıfı, °F cinsinden bir sıcaklık oluşturmak için `Temperature.fromFahrenheit(100)` yazmanıza izin verir.

## Symbol'ler

{{index "for/of loop", "iterator interface"}}

[Bölüm ?](data#for_of_loop) içinde bir `for/of` döngüsünün çeşitli veri yapıları üzerinde döngü yapabileceğini belirttim. Bu, başka bir polimorfizm örneğidir—bu tür döngüler, beklenen arayüzü ortaya koyan veri yapısını bekler, diziler ve dizeler de buna uyum sağlar. Ve kendi nesnelerimize de bu arayüzü ekleyebiliriz! Ancak bunu yapmadan önce, sembol türüne kısaca bir göz atmak gerekir.

Birden çok arayüzün, farklı şeyler için aynı özellik adını kullanması mümkündür. Örneğin, dizi benzeri nesnelerde, `length` koleksiyondaki öğelerin miktarına atıfta bulunur. Ancak bir yürüyüş rotasını tanımlayan bir nesne arayüzü, `length`'i rotanın metre cinsinden uzunluğunu sağlamak için kullanabilir. Böyle bir objenin bu iki arayüze uyum sağlaması mümkün değildir.

Bir nesnenin hem rota hem de dizilere benzer arayüze sahip olmaya çalışması (belki de noktalarını numaralandırmak için) biraz abartılıdır ve bu tür bir sorun pratikte o kadar yaygın değildir. Ancak iterasyon protokolü gibi şeyler için, dil tasarımcıları bu tür bir özellik türüne _gerçekten_ başka hiçbir şeyle çelişmeyen bir tür özellik türüne ihtiyaç duyuyordu. Bu nedenle, 2015 yılında _((semboller))_ dilin bir parçası olarak eklendi.

{{index "Symbol function", [property, naming]}}

Şimdiye kadar gördüğümüz tüm özellikler de dahil olmak üzere, çoğu özellik dizelerle adlandırılır. Ancak sembollerin özellik adı olarak da kullanılması mümkündür. Semboller, `Symbol` fonksiyonuyla oluşturulan değerlerdir. Dizelerin aksine, yeni oluşturulan semboller benzersizdir—aynı sembolü iki kez oluşturamazsınız.

```
let sym = Symbol("name");
console.log(sym == Symbol("name"));
// → false
Rabbit.prototype[sym] = 55;
console.log(killerRabbit[sym]);
// → 55
```

`Symbol`'e verdiğiniz dize, onu bir dizeye dönüştürdüğünüzde dahil edilir ve bir sembolü, örneğin, konsolda gösterirken tanımayı daha kolay hale getirir. Ancak bundan başka bir anlamı yoktur—birden çok sembol aynı adı taşıyabilir.

Hem benzersiz hem de özellik adları olarak kullanılabilir olmaları, sembollerin adları ne olursa olsun diğer özelliklerle bir arada barış içinde yaşayabilen arayüzleri tanımlamak için uygun olmalarını sağlar.

```{includeCode: "top_lines: 1"}
const length = Symbol("length");
Array.prototype[length] = 0;

console.log([1, 2].length);
// → 2
console.log([1, 2][length]);
// → 0
```

{{index [property, naming]}}

Nesne ifadelerinde ve sınıflarda sembol özelliklerini kullanmak için ((köşeli parantez))lerle sararak özellik adını kullanmak mümkündür. Bu, köşeli parantez özelliği erişim notasyonuna benzer şekilde, parantezler arasındaki ifadenin değerlendirilerek özellik adının oluşturulmasını sağlar.

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

`for/of` döngüsüne verilen nesnenin _yinelenilebilir_ olması beklenir. Bu, `Symbol.iterator` sembolü ile adlandırılmış bir metoda (dil tarafından tanımlanan bir sembol değeri, `Symbol` fonksiyonunun bir özelliği olarak saklanır) sahip olması anlamına gelir.

{{index "iterator interface", "next method"}}

Çağrıldığında, bu yöntem, ikinci bir arayüz olan _yineleyiciyi_ sağlayan bir nesne döndürmelidir. Bu, gerçekten yineleyen şeydir. Bir sonraki sonucu döndüren `next` yöntemine sahiptir. Bu sonuç, bir sonraki değeri sağlayan bir `value` özelliği ve daha çok sonuçların olup olmadığını belirten `done` özelliğine sahip bir nesne olmalıdır.

`next`, `value`, ve `done` özellik adlarının düz dize olduğunu, semboller olmadığını unutmayın. Yalnızca _birçok_ farklı nesnelere eklenebilecek olan `Symbol.iterator` gerçek bir semboldür.

Bu arayüzü doğrudan kendimiz kullanabiliriz.

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

[Chapter ?](data) alıştırmasındaki linked list benzeri bir yinelenebilir veri yapısı uygulayalım. Bu sefer listeyi bir sınıf olarak yazacağız.

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

Statik bir yöntemdeki `this`, bir örneğe değil, sınıfın constructor fonksiyonuna işaret eder—bir statik yöntem çağrıldığında bir örnek yoktur.

Bir liste üzerinde yinelendiğinde, listenin tüm öğeleri baştan sona döndürülmelidir. Yineleyici için ayrı bir sınıf yazacağız.

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

`ListIterator` sınıfı, bir değer döndürüldüğünde `list` özelliğini güncelleyerek listedeki öğelerin üzerinden yinelenebilme ilerlemesini takip eder ve bu liste boş olduğunda (null) işlemi tamamlandığını bildirir.

`List` sınıfını yinelemeli hale getirelim. Bu kitap boyunca, kod parçalarının küçük ve kendi kendine yeten kalmasını sağlamak için sınıflara yöntemler eklemek adına prototip manipülasyonunu zaman zaman kullanacağım. Normal bir programda, kodun küçük parçalara ayrılmasına gerek olmadığında, bu yöntemleri doğrudan sınıfta bildirirsiniz.

```{includeCode: true}
List.prototype[Symbol.iterator] = function() {
  return new ListIterator(this);
};
```

{{index "for/of loop"}}

Artık bir liste üzerinde `for`/`of` ile döngü yapabiliriz.

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

Array notasyonunda ve fonksiyon çağrılarında `...` herhangi bir yinelemeli nesneyle çalışır. Bu nedenle örneğin, `[...value]` kullanarak bir yinelenebilir nesnedeki öğeleri içeren bir dizi oluşturabilirsiniz.

```
console.log([..."PCI"]);
// → ["P", "C", "I"]
```

## Kalıtım

{{index inheritance, "linked list", "object-oriented programming", "LengthList class"}}

`List` sınıfında gördüğümüz gibi, bir listeye benzer bir liste tipine ihtiyacımız olduğunu hayal edin, ancak sürekli olarak uzunluğunu isteyeceğimiz için, her seferinde `rest` özelliğini taramasını istemiyoruz ve bunun yerine her örnekte uzunluğu verimli bir erişim için saklamak istiyoruz.

{{index overriding, prototype}}

JavaScript'in prototip sistemi, bir sınıfa, eskiden olduğu gibi, ancak bazı özelliklerinin yeni tanımları ile bir _yeni_ sınıf oluşturmayı mümkün kılar. Yeni sınıfın prototipi, eski prototipten türetilir ancak, diyelim ki, `length` getter metodu için için yeni bir tanım ekler.

Nesne tabanlı programlama terimleriyle, buna _((kalıtım))_ denir. Yeni sınıf, eski sınıftan özellikler ve davranış alır.

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

`extends` kelimesinin kullanımı, bu sınıfın doğrudan varsayılan `Object` prototipi yerine başka bir sınıfa dayandırılması gerektiğini gösterir. Buna _((üst sınıf))_ denir. Türetilmiş sınıf, _((alt sınıf))_ tır.

Bir `LengthList` örneğini başlatmak için, constructor, `super` anahtar kelimesi aracılığıyla üst sınıfının constructor fonksiyonunu çağırır. Bu, bu yeni nesne bir `List` gibi davranacaksa, listelerin sahip olduğu örnek özelliklere ihtiyacı olacağı için gereklidir.

Constructor fonksiyonu, ardından listenin uzunluğunu private bir özelliğe saklar. Orada `this.length` yazsaydık, sınıfın kendi getter metodu çağrılırdı, ki bu henüz çalışmaz, çünkü `#length` henüz doldurulmadı. `super.something` kullanarak üst sınıfın prototipi üzerinde metodlar ve getter metodları çağırmak sıkça kullanışlıdır.

Kalıtım, var olan veri türlerinden kolayca biraz farklı veri türleri oluşturmamıza izin verir. Bu, kapsülleme ve polimorfizm ile birlikte nesne tabanlı geleneğin temel bir parçasıdır. Ancak, son ikisi şimdi genellikle harika fikirler olarak kabul edilirken, kalıtım daha tartışmalıdır.

{{index complexity, reuse, "class hierarchy"}}

((Kapsülleme)) ve polimorfizm kodları birbirinden _ayırmak_ için kullanılabilirken, ((kalıtım)) temel olarak sınıfları birbirine bağlar, ve birbirine daha bağlı kodlar yaratır. Bir sınıftan kalıtım alırken, sınıfı sadece kullanmak yerine genellikle nasıl çalıştığı hakkında daha fazla bilgi sahibi olmanız gerekir. Kalıtım, bazı türdeki programları daha kısa hale getirmek için kullanışlı bir araç olabilir, ancak bunu kullanmaya yeltendiğiniz ilk araç olmamalıdır ve daha çok sınıf hiyerarşileri (sınıf ağaçları) oluşturma fırsatlarını aktif olarak aramamalısınız.

## instanceof operatörü

{{index type, "instanceof operator", constructor, object}}

Nesnenin belirli bir sınıftan türetildiğini bilmek zaman zaman faydalı olabilir. Bunun için JavaScript, `instanceof` adında bir ikili operatör sağlar.

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

Operatör, kalıtılmış türleri görür, bu nedenle bir `LengthList`, `List` sınıfının bir örneğidir. Operatör ayrıca `Array` gibi standart constructor fonksiyonlarına da uygulanabilir. Hemen hemen her nesne `Object` sınıfının bir örneğidir.

## Özet

Nesneler, kendi özelliklerini tutmanın ötesinde daha fazlasını yaparlar. Başka nesneler olan prototipleri vardır. Prototiplerinde bulunduğu sürece, sahip olmadıkları bir özelliğe sahipmiş gibi davranırlar. Basit nesnelerin prototipi `Object.prototype`'dır.

Genellikle büyük harfle başlayan adları olan constructor fonksiyonlar, `new` operatörünün kullanımıyla yeni nesneler oluşturmak için kullanılabilir. Yeni nesnenin prototipi, constructor fonksiyonunun `prototype` özelliğinde bulunan nesne olacaktır. Verilen bir veri türün paylaştığı tüm özellikleri prototip nesnesine koyarak bundan fayda sağlayabilirsiniz. Bir constructor fonksiyonu ve onun prototipini net bir şekilde tanımlamanın temiz bir yolunu sağlayan `class` notasyonunu kullanabilirsiniz.

Herhangi bir nesnenin herhangi bir özelliği erişildiğinde gizlice çağırılacak getter ve setter metodları tanımlayabilirsiniz. Statik metodlar, bir sınıfın constructor fonksiyonunda saklanan metodlardır, prototipinde değil.

`instanceof` operatörüne bir nesne ve bir constructor fonksiyonu verildiğinde, nesnenin o constructor fonksiyonunun bir örneği olup olmadığını size söyler.

Nesnelerle yapılacak yararlı şeylerden biri, onlar için bir arayüz belirtmek ve herkesin nesnenizle sadece o arayüz aracılığıyla iletişim kurması gerektiğini söylemektir. Nesnenizi oluşturan diğer ayrıntılar artık _kapsülleme_ aracılığıyla gizlenmiş olur ve arayüzün arkasında saklanır. Nesnenizin bir kısmını dış dünyadan gizlemek için private özellikler kullanabilirsiniz.

Birden fazla tür aynı arayüzü implemente edebilir. Bir arayüzü kullanmak için yazılmış kod, arayüzü sağlayan herhangi bir sayıda farklı nesneyle nasıl çalışılacağını otomatik olarak bilir. Buna _polimorfizm_ denir.

Birbirinden yalnızca bazı ayrıntılarda farklılık gösteren birden çok sınıfı implemente ederken, yeni sınıfları var olan bir sınıfın alt sınıfları olarak yazmak, davranışlarının bir kısmını kalıtım yoluyla alarak kullanmanıza yardımcı olabilir.

## Egzersizler

{{id exercise_vector}}

### Bir vektör türü

{{index dimensions, "Vec class", coordinates, "vector (exercise)"}}

İki boyutlu uzayda bir vektörü temsil eden bir `Vec` adında ((Sınıf)) yazın. Parametre olarak `x` ve `y` (sayılar) alır ve bunları aynı adla özelliklere kaydeder.

{{index addition, subtraction}}

`Vec` prototipine `plus` ve `minus` adında başka bir vektörü parametre olarak alan ve iki vektörün (`this` ve parametre) _x_ ve _y_ değerlerinin toplamını veya farkını döndüren iki ((metod)) tanımlayın.

Prototipe, vektörün uzunluğunu hesaplayan `length` adında ((getter)) özelliği ekleyin - yani, noktanın (x, y) başlangıç noktasından (0, 0) uzaklığını hesaplar.

{{if interactive

```{test: no}
// Kodunuz buraya.

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

Eğer `class` beyanlarının nasıl göründüğünden emin değilseniz `Rabbit` sınıfı örneğine geri dönün.

{{index Pythagoras, "defineProperty function", "square root", "Math.sqrt function"}}

Constructor fonksiyonuna bir ((getter)) özelliği eklemek, metod adından önce `get` kelimesini koymak suretiyle yapılabilir. (0, 0) ile (x, y) arasındaki mesafeyi hesaplamak için, aradığımız mesafenin karesinin, x-koordinatının karesi artı y-koordinatının karesiyle eşit olduğunu söyleyen Pisagor teoremini kullanabilirsiniz. Böylece, [√(x^2^ + y^2^)]{if html}[[$\sqrt{x^2 + y^2}$]{latex}]{if tex} istediğiniz sayıdır. JavaScript'te karekökü hesaplamak için `Math.sqrt` kullanılır ve bir sayının karesini almak için `x ** 2` kullanılanılır.

hint}}

### Gruplar

{{index "groups (exercise)", "Set class", "Group class", "set (data structure)"}}

{{id groups}}

Standart JavaScript ortamı, `Set` adında başka bir veri yapısı sağlar. Bir `Map` örneği gibi, bir küme bir değerler koleksiyonunu tutar. `Map`'in aksine, bunlarla ilişkilendirilmiş başka değerlerle ilgilenmez - sadece hangi değerlerin kümenin bir parçası olduğunu izler. Bir değer sadece bir kez kümenin parçası olabilir - tekrar eklenmesinin herhangi bir etkisi olmaz.

{{index "add method", "delete method", "has method"}}

`Set` ismi zaten alınmış olduğundan ötürü `Group` adında bir sınıf yazın. `Set` gibi, `add`, `delete` ve `has` metodlarına sahip olsun. Constructor fonksiyonu boş bir grup oluştursun, `add` bir değeri eğer zaten bir üye değilse gruba eklesin, `delete` argümanını eğer bir üyeyse grubun içinden kaldırsın ve `has` argümanının grubun bir üyesi olup olmadığını gösteren bir Boolean değeri döndürsün.

{{index "=== operator", "indexOf method"}}

İki değerin aynı olup olmadığını belirlemek için `===` operatörünü veya `indexOf` gibi bir şeyi kullanın.

{{index "static method"}}

Sınıfta, bir yinelenebilen bir nesneyi argüman olarak alan ve üzerinde yinelemeyi gerçekleştirerek üretilen tüm değerleri içeren bir grup oluşturan bir statik `from` ((metodu)) oluşturun.

{{if interactive

```{test: no}
class Group {
  // Kodunuz buraya.
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

Bunu yapmanın en kolay yolu, bir örnek özelliğinde grup üyelerinin bir dizisini depolamaktır. `includes` veya `indexOf` metotları, verilen bir değerin dizide olup olmadığını kontrol etmek için kullanılabilir.

{{index "push method"}}

Sınıfınızın ((constructor)) fonksiyonu, üye koleksiyonunu boş bir diziye atayabilir. `add` çağrıldığında, verilen değerin dizide olup olmadığını kontrol etmeli ve `push` gibi bir fonksiyonla eklemelidir.

{{index "filter method"}}

Diziden bir öğe silmek, `delete` daha karmaşıktır, ancak o değerin içinde bulunmadığı yeni bir dizi oluşturmak için `filter` kullanabilirsiniz. Üyeleri tutan özelliği, dizinin bu yeniden filtrelenmiş versiyonuyla atamayı unutmayın.

{{index "for/of loop", "iterable interface"}}

`from` metodu, yinelenebilir nesneden değerleri almak ve bunları yeni oluşturulan bir gruba `add` metodu aracılığıyla koymak için `for`/`of` döngüsünü kullanabilir.

hint}}

### Yinelenebilir gruplar

{{index "groups (exercise)", [interface, object], "iterator interface", "Group class"}}

{{id group_iterator}}

Önceki alıştırmadan `Group` sınıfını yinelenebilir yapın. Eğer arayüzün tam olarak nasıl olduğundan emin değilseniz, bölümdeki yineleme arayüzünün yapısı hakkındaki bölüme bakın.

Grubun üyelerini temsil etmek için bir dizi kullandıysanız, dizideki direk `Symbol.iterator` metodunu çağırarak oluşturulan yineleyiciyi döndürmeyin. Bu çalışır, ancak bu alıştırmanın amacını boşa çıkarır.

Grubun yinelenme sırasında grubun değiştirilmesi durumunda yineleyicinizin garip davranması sorun değil.

{{if interactive

```{test: no}
// Kodunuz buraya.(önceki egzersizden olan kodunuz da dahil olmak üzere)

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

Muhtemelen yeni bir `GroupIterator` sınıfını tanımlamak faydalı olacaktır. `Iterator` örnekleri, grubun mevcut konumunu izleyen bir özelliğe sahip olmalıdır. `next` her çağırıldığında tamamlanıp tamamlanmadığını kontrol eder ve tamamlanmadıysa mevcut değerin ötesine geçip onu döndürür.

`Group` sınıfı `Symbol.iterator` tarafından adlandırılan bir ((metod)) alır ve çağrıldığında, o grup için yeni bir `Iterator` sınıfı örneğini döndürür.

hint}}
