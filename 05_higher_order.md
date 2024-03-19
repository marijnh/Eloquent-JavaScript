{{meta {load_files: ["code/scripts.js", "code/chapter/05_higher_order.js", "code/intro.js"], zip: "node/html"}}}

# Higher-Order Fonksiyonlar

{{quote {author: "C.A.R. Hoare", title: "1980 ACM Turing Award Lecture", chapter: true}

{{index "Hoare, C.A.R."}}

Yazılım tasarımını iki şekilde oluşturmak mümkündür: Bir yolu, o kadar basit yapmaktır ki herhangi bir eksiklik olmasın, diğer yolu ise o kadar karmaşık yapmaktır ki açıkça herhangi bir eksiklik olmasın.

quote}}

{{figure {url: "img/chapter_picture_5.jpg", alt: "Illustration showing letters and hieroglyphs from different scripts—Latin, Greek, Arabic, ancient Egyptian, and others", chapter: true}}}

{{index "program size"}}

Büyük bir program maliyetli bir programdır ve bunun yalnızca inşa etme süresiyle ilgili olduğunu söylemek yanlış olur. Boyut neredeyse her zaman karmaşıklığı içerir ve karmaşıklık programcıları kafası karıştırır. Kafası karışık olan programcılar da hatalar (bug) eklerler. Büyük bir program, bu hataların gizlenmesi için çok fazla alan sağlar ve onları bulmayı zorlaştırır.

{{index "summing example"}}

Girişteki son iki örnek programı kısaca gözden geçirelim. İlki kendine özgüdür ve altı satırdır.

```
let total = 0, count = 1;
while (count <= 10) {
  total += count;
  count += 1;
}
console.log(total);
```

İkincisi iki harici fonksiyona dayanır ve bir satır uzunluğundadır.

```
console.log(sum(range(1, 10)));
```

Hangisinin hata içerme olasılığı daha yüksektir?

{{index "program size"}}

`sum` ve `range` tanımlarının boyutunu sayarsak, ikinci program da büyüktür - hatta birincisinden daha büyüktür. Ancak yine de, doğru olma olasılığının daha yüksek olduğunu iddia ederim.

{{index [abstraction, "with higher-order functions"], "domain-specific language"}}

Doğru olma olasılığı daha yüksektir çünkü çözüm, çözülen problemle uyumlu bir ((kelime dağarcığıyla)) ifade edilmiştir. Bir sayı aralığının toplanması döngüler ve sayıcılar hakkında değildir. Aralıklar ve toplamlar hakkındadır.

Bu kelime dağarcığının tanımları (`sum` ve `range` fonksiyonları) hala döngüler, sayıcılar ve diğer tesadüfi ayrıntılar içerecektir. Ancak, programın tamamından daha basit kavramları ifade ettikleri için anlaşılmaları daha kolaydır.

## Soyutlama

Programlama bağlamında, bu tür kavramlar genellikle ((soyutlama)) olarak adlandırılır. Soyutlamalar, bizi, ilginç olmayan ayrıntılarla uğraştırmadan daha yüksek (veya daha soyut) bir seviyede problemleri tartışma yeteneği verir.

{{index "recipe analogy", "pea soup"}}

Bir benzetme olarak, bezelye çorbası için bu iki tarifi karşılaştırın. İlk tarif şöyle:

{{quote

Her kişi başına 1 su bardağı kuru bezelye bir kaba koyun. Bezelyeler suyla iyi bir şekilde kaplanana kadar su ekleyin. Bezelyeleri en az 12 saat suyun içinde bırakın. Bezelyeleri sudan çıkarın ve bir tencereye koyun. Her kişi başına 4 su bardağı su ekleyin. Tencereyi kapatın ve bezelyelerin kısık ateşte iki saat boyunca kaynamasını sağlayın. Her kişi başına yarım soğan alın. Bir bıçakla parçalara kesin. Bezelyelere ekleyin. Her kişi başına bir sap kereviz alın. Bir bıçakla parçalara kesin. Bezelyelere ekleyin. Her kişi başına bir havuç alın. Parçalara kesin. Bir bıçakla! Bezelyelere ekleyin. 10 dakika daha pişirin.

quote}}

Ve bu da ikinci tarif:

{{quote

Her kişi başına: 1 su bardağı kuru bezelye, 4 su bardağı su, yarım doğranmış soğan, bir sap kereviz ve bir havuç.

Bezelyeleri 12 saat bekletin. 2 saat kaynatın. Sebzeleri doğrayın ve ekleyin. 10 dakika daha pişirin.

quote}}

{{index vocabulary}}

İkincisi daha kısa ve yorumlaması daha kolaydır. Ancak, _bekletme_, _kaynatma_, _doğrama_ ve sanırım _sebze_ gibi birkaç daha fazla yemekle ilgili kelimeyi anlamanız gerekecek.

Programlama yaparken, ihtiyacımız olan tüm kelimelerin sözlükte bizi beklediğine güvenemeyiz. Bu nedenle, birinci tarifin kalıbına düşebiliriz - bilgisayarın adım adım yapması gereken kesin adımları çıkarırken, bunların ifade ettiği daha yüksek düzeydeki kavramlara kör oluruz.

{{index abstraction}}

Programlama yaparken, ne zaman çok düşük veya çok yüksek bir soyutlama seviyesinde çalıştığınızı fark etmek faydalı bir beceridir.

## Tekrarı soyutlama

{{index [array, iteration]}}

Şimdiye kadar gördüğümüz gibi düz fonksiyonlar, soyutlamalar oluşturmanın iyi bir yoludur. Ancak bazen yetersiz kalabilirler.

{{index "for loop"}}

Programın belirli bir sayıda bir şey yapması yaygındır. Bunu şöyle bir `for` ((döngüsü)) ile yapabilirsiniz:

```
for (let i = 0; i < 10; i++) {
  console.log(i);
}
```

İşlemi "_N_ kez bir şey yapmak" şeklinde soyutlayabilir miyiz? Evet, bir `console.log` ifadesini _N_ kez çağıran bir fonksiyon yazmak oldukça kolaydır.

```
function repeatLog(n) {
  for (let i = 0; i < n; i++) {
    console.log(i);
  }
}
```

{{index [function, "higher-order"], loop, [function, "as value"]}}

{{indexsee "higher-order function", "function, higher-order"}}

Ancak, sayıları görüntülemek dışında başka bir şey yapmak istersek? "bir şey yapmak" bir fonksiyon olarak temsil edilebilir ve fonksiyonlar sadece değerler olduklarına göre, eylemimizi bir fonksiyon değeri olarak iletebiliriz.

```{includeCode: "top_lines: 5"}
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeat(3, console.log);
// → 0
// → 1
// → 2
```

`repeat` fonksiyonuna önceden tanımlanmış bir fonksiyon geçmek zorunda değiliz. Genellikle, yerinde bir fonksiyon değeri oluşturmak daha kolaydır.

```
let labels = [];
repeat(5, i => {
  labels.push(`Unit ${i + 1}`);
});
console.log(labels);
// → ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"]
```

{{index "loop body", [braces, body], [parentheses, arguments]}}

Bu, `for` döngüsüne biraz benzeyen bir şekilde yapılandırılmıştır - önce döngü türünü tanımlar, ardından bir gövde sağlar. Ancak, gövde artık bir fonksiyon değeri olarak yazılmıştır ve çağrının parantezleri içine alınmıştır. Bu nedenle kapatılması gereken süslü parantez ve kapanan normal parantezle kapatılmalıdır. Bu örnekte olduğu gibi, gövde tek bir küçük ifade ise süslü parantezleri atlayabilir ve döngüyü tek bir satırda da yazabilirsiniz.

## Higher-order fonksiyonlar

{{index [function, "higher-order"], [function, "as value"]}}

Başka fonksiyonlar üzerinde, fonskiyonu argüman olarak alarak ya da fonksiyon döndürerek işlem yapan fonksiyonlara _higher-order fonksiyonlar_ denir. Fonksiyonların sıradan değerler olduğunu zaten gördüğümüze göre, bu tür fonksiyonların varlığıyla ilgili olarak özellikle dikkate değer bir şey fark etmişizdir. Terim ((matematik))ten gelir, burada fonksiyonlar ve diğer değerler arasındaki ayrım daha ciddiye alınır.

{{index abstraction}}

Higher-order fonksiyonlar, sadece değerleri değil _eylemleri_ soyutlamamıza izin verir. Birkaç formda gelirler. Mesela, yeni fonksiyonlar oluşturan fonksiyonlar oluşturabiliriz.

```
function greaterThan(n) {
  return m => m > n;
}
let greaterThan10 = greaterThan(10);
console.log(greaterThan10(11));
// → true
```

Ve diğer fonksiyonları değiştiren fonksiyonlara sahip olabiliriz.

```
function noisy(f) {
  return (...args) => {
    console.log("calling with", args);
    let result = f(...args);
    console.log("called with", args, ", returned", result);
    return result;
  };
}
noisy(Math.min)(3, 2, 1);
// → calling with [3, 2, 1]
// → called with [3, 2, 1] , returned 1
```

Yeni türlerde ((kontrol akışı)) sağlayan fonksiyonlar bile yazabiliriz.

```
function unless(test, then) {
  if (!test) then();
}

repeat(3, n => {
  unless(n % 2 == 1, () => {
    console.log(n, "is even");
  });
});
// → 0 is even
// → 2 is even
```

{{index [array, methods], [array, iteration], "forEach method"}}

`for`/`of` döngüsü gibi bir yapıyı higher-order fonksiyon olarak tanımlayan `forEach` adında yerleşik bir array metodu vardır.

```
["A", "B"].forEach(l => console.log(l));
// → A
// → B
```

{{id scripts}}

## Script data seti

Higher-order fonksiyonların parladığı bir alan veri işlemektir. Verileri işlemek için gerçek verilere ihtiyacımız olacak. Bu bölüm, Latin, Kiril veya Arap gibi ((yazı sistemileri)) hakkında((veri seti)) kullanacağız.

[Bölüm ?'ten](values#unicode) ((Unicode)) sistemini hatırladığınız mı? Şu konuşulan dillerdeki her karaktere bir sayı atayan sistem hani? Bu karakterlerin çoğu bir alfabeyle ilişkilidir. Standart, 140 farklı alfabeyi barındırır - 81'i hala günümüzde kullanılırken 59'u tarihidir.

Ben sadece Latin karakterlerini akıcı bir şekilde okuyabilirim, ancak insanların en az 80 farklı yazı sistemine ait metinler yazdıklarını takdir ediyorum, bunların çoğunu bile tanımam. Örneğin, işte ((Tamil)) el yazısı örneği:

{{figure {url: "img/tamil.png", alt: "A line of verse in Tamil handwriting. The characters are relatively simple, and neatly separated, yet completely different from Latin."}}}

{{index "SCRIPTS data set"}}

Örnek ((data seti)), Unicode'da tanımlanan 140 yazı hakkında bazı bilgiler içerir. Bu, bu bölümde[ ([_https://eloquentjavascript.net/code#5_](https://eloquentjavascript.net/code#5))]{if book} `SCRIPTS` bağlantısı olarak [kod kum havuzunda](https://eloquentjavascript.net/code#5) mevcuttur. Bağlantı, her biri bir alfabeyi tanımlayan nesnelerin bir dizisini içerir.

```{lang: "json"}
{
  name: "Coptic",
  ranges: [[994, 1008], [11392, 11508], [11513, 11520]],
  direction: "ltr",
  year: -200,
  living: false,
  link: "https://en.wikipedia.org/wiki/Coptic_alphabet"
}
```

Böyle bir nesne, alfabenin adını, ona atanmış Unicode aralıklarını, yazıldığı yönu, (yaklaşık) köken zamanını, hala kullanılıp kullanılmadığını ve daha fazla bilgiye yönlendiren bir bağlantının linkini bize bildirir. Yön, soldan sağa için `"ltr"`, sağdan sola için `"rtl"`(Arapça ve İbranice metinlerin yazıldığı yöntem), veya üstten alta için `"ttb"`(Moğolca yazı gibi) olabilir.

{{index "slice method"}}

`ranges` özelliği, her biri bir alt sınır ve bir üst sınır içeren iki öğeli bir dizi içeren Unicode karakter ((aralık))larının bir dizisini içerir. Bu aralıklar içindeki herhangi bir karakter kodu yazıya atanır. Alt ((sınır)) kapsayıcıdır (kod 994 bir Kıpti karakteridir), üst sınır kapsayıcı değildir (kod 1008 değildir).

## Dizileri filtrelemek

{{index [array, methods], [array, filtering], "filter method", [function, "higher-order"], "predicate function"}}

Veri kümesinde kullanımda olan yazı sistemlerini bulmak istiyorsak, aşağıdaki fonksiyon faydalı olabilir. Bu, bir dizide bir testi geçmeyen öğeleri filtreler.

```
function filter(array, test) {
  let passed = [];
  for (let element of array) {
    if (test(element)) {
      passed.push(element);
    }
  }
  return passed;
}

console.log(filter(SCRIPTS, script => script.living));
// → [{name: "Adlam", …}, …]
```

{{index [function, "as value"], [function, application]}}

Fonksiyon, hesaplama içinde bir "boşluk" doldurmak için `test` adlı fonksiyon değerindeki verilen argümanı kullanır. Böylelikle hangi elementi tutmak istediğine karar verir.

{{index "filter method", "pure function", "side effect"}}

Varolan diziden öğeleri silmek yerine, `filter` fonksiyonu, yalnızca testi geçen öğelerle yeni bir dizi oluşturur. Bu işlev \_saf_tır. Verilen diziyi değiştirmez.

`forEach` gibi, `filter` bir ((standart)) dizi yöntemidir. Örnek, fonskiyonun içerisinde ne yaptığını göstermek için tanımlanmıştır. Bundan sonra, bunu şu şekilde kullanacağız:

```
console.log(SCRIPTS.filter(s => s.direction == "ttb"));
// → [{name: "Mongolian", …}, …]
```

{{id map}}

## map ile dönüştürmek

{{index [array, methods], "map method"}}

Diyelim ki `SCRIPTS` dizisini filtreleme işlemiyle üretilmiş olan yazı sistemlerini temsil eden nesnelerden bir dizimiz var. Ancak obje dizisi yerine, incelemesi daha kolay olan bir isim dizisi istiyoruz.

{{index [function, "higher-order"]}}

`map` yöntemi, tüm öğelerine bir fonksiyon uygulayarak bir diziyi dönüştürür ve döndürülen değerlerden yeni bir dizi oluşturur. Yeni dizi, giriş dizisiyle aynı uzunluğa sahip olacak, ancak içeriği verilen fonksiyon tarafından yeni bir forma _haritalanmış_ olacak.

```
function map(array, transform) {
  let mapped = [];
  for (let element of array) {
    mapped.push(transform(element));
  }
  return mapped;
}

let rtlScripts = SCRIPTS.filter(s => s.direction == "rtl");
console.log(map(rtlScripts, s => s.name));
// → ["Adlam", "Arabic", "Imperial Aramaic", …]
```

`forEach` ve `filter` gibi, `map` bir standart dizi yöntemidir.

## reduce aracılığıyla özetleme

{{index [array, methods], "summing example", "reduce method"}}

Dizilerle yapılacak başka yaygın bir işlem, onlardan tek bir değer hesaplamaktır. Tekrarlayan bir örnek olan sayılardan oluşan bir dizinin toplamını bulmak, bunun bir örneğidir. Diğer bir örnek ise en fazla karaktere sahip yazıyı bulmaktır.

{{indexsee "fold", "reduce method"}}

{{index [function, "higher-order"], "reduce method"}}

Bu kalıbı temsil eden higher-order işlem _reduce_ (bazen _fold_ olarak da adlandırılır) adını taşır. Bu, bir diziden bir öğeleri tane tane alarak ve mevcut değerle birleştirerek bir değer oluşturur. Sayıları toplarken, sıfır sayısıyla başlayacak ve her öğeyi toplama ekleyeceksiniz.

`reduce`'un parametreleri, üzerinden geçilecek dizi dışında birleştirme fonksiyonu ve bir başlangıç değeri gerektirmektedir. Bu fonksiyon `filter`ve `map` fonskiyonlarından daha karmaşıktır, lütfen bu örneği dikkatlice bakın:

```
function reduce(array, combine, start) {
  let current = start;
  for (let element of array) {
    current = combine(current, element);
  }
  return current;
}

console.log(reduce([1, 2, 3, 4], (a, b) => a + b, 0));
// → 10
```

{{index "reduce method", "SCRIPTS data set"}}

Standart dizi metodu ve örnekteki fonksiyonalite ile eşleşen `reduce`, ek bir rahatlığa sahiptir. Eğer diziniz en az bir elementten oluşmaktaysa, `start` argümanını kullanmak zorunda değilsiniz. Metod dizideki ilk elementi başlangıç değeri oalrak alır ve değeri döngüye devam ederek indirgemeye ikinci değerden başlar.

```
console.log([1, 2, 3, 4].reduce((a, b) => a + b));
// → 10
```

{{index maximum, "characterCount function"}}

En çok karakteri barındıran yazı sistemini bulmak adına `reduce` fonksiyonunu kullanarak (ikinci kere) şöyle bir şey yazabiliriz:

```
function characterCount(script) {
  return script.ranges.reduce((count, [from, to]) => {
    return count + (to - from);
  }, 0);
}

console.log(SCRIPTS.reduce((a, b) => {
  return characterCount(a) < characterCount(b) ? b : a;
}));
// → {name: "Han", …}
```

`characterCount` fonksiyonu aralıkları boyutları toplayarak indirgemektedir. Parametre listesinde gerçekteştirilen destructuring işlemine dikkat edin. `reduce` fonksiyonuna olan ikinci çağrı bunu kullanarak her iki yazı sistemini karşılaştırarak daha büyük olan yazı sistemini döndürmektedir.

Han yazısı, Unicode standardında ona atanan 89.000'den fazla karakterle, veri kümesindeki en büyük yazı sistemidir. Han, bazen Çince, Japonca ve Korece metinlerde kullanılır. Bu diller birçok karakteri paylaşır, ancak genellikle farklı yazılır. (ABD merkezli) Unicode Konsorsiyumu, karakter kodlarını kaydetmek için bunları tek bir yazı sistemi olarak ele almaya karar verdi. Buna _Han birleşimi_ denir ve hala bazı insanları çok kızdırıyor.

## Composability

{{index loop, maximum}}

Consider how we would have written the previous example (finding the biggest script) without higher-order functions. The code is not that much worse.

```{test: no}
let biggest = null;
for (let script of SCRIPTS) {
  if (biggest == null ||
      characterCount(biggest) < characterCount(script)) {
    biggest = script;
  }
}
console.log(biggest);
// → {name: "Han", …}
```

There are a few more bindings, and the program is four lines longer. But it is still very readable.

{{index "average function", composability, [function, "higher-order"], "filter method", "map method", "reduce method"}}

{{id average_function}}

The abstractions provided by these functions really shine when you need to _compose_ operations. As an example, let's write code that finds the average year of origin for living and dead scripts in the data set.

```
function average(array) {
  return array.reduce((a, b) => a + b) / array.length;
}

console.log(Math.round(average(
  SCRIPTS.filter(s => s.living).map(s => s.year))));
// → 1165
console.log(Math.round(average(
  SCRIPTS.filter(s => !s.living).map(s => s.year))));
// → 204
```

So the dead scripts in Unicode are, on average, older than the living ones. This is not a terribly meaningful or surprising statistic. But I hope you'll agree that the code used to compute it isn't hard to read. You can see it as a pipeline: we start with all scripts, filter out the living (or dead) ones, take the years from those, average them, and round the result.

You could definitely also write this computation as one big ((loop)).

```
let total = 0, count = 0;
for (let script of SCRIPTS) {
  if (script.living) {
    total += script.year;
    count += 1;
  }
}
console.log(Math.round(total / count));
// → 1165
```

But it is harder to see what was being computed and how. And because intermediate results aren't represented as coherent values, it'd be a lot more work to extract something like `average` into a separate function.

{{index efficiency, [array, creation]}}

In terms of what the computer is actually doing, these two approaches are also quite different. The first will build up new arrays when running `filter` and `map`, whereas the second computes only some numbers, doing less work. You can usually afford the readable approach, but if you're processing huge arrays, and doing so many times, the less abstract style might be worth the extra speed.

## Strings and character codes

{{index "SCRIPTS data set"}}

One interesting use of this data set would be figuring out what script a piece of text is using. Let's go through a program that does this.

Remember that each script has an array of character code ranges associated with it. So given a character code, we could use a function like this to find the corresponding script (if any):

{{index "some method", "predicate function", [array, methods]}}

```{includeCode: strip_log}
function characterScript(code) {
  for (let script of SCRIPTS) {
    if (script.ranges.some(([from, to]) => {
      return code >= from && code < to;
    })) {
      return script;
    }
  }
  return null;
}

console.log(characterScript(121));
// → {name: "Latin", …}
```

The `some` method is another higher-order function. It takes a test function and tells you whether that function returns true for any of the elements in the array.

{{id code_units}}

But how do we get the character codes in a string?

In [Chapter ?](values) I mentioned that JavaScript ((string))s are encoded as a sequence of 16-bit numbers. These are called _((code unit))s_. A ((Unicode)) ((character)) code was initially supposed to fit within such a unit (which gives you a little over 65,000 characters). When it became clear that wasn't going to be enough, many people balked at the need to use more memory per character. To address these concerns, ((UTF-16)), the format also used by JavaScript strings, was invented. It describes most common characters using a single 16-bit code unit but uses a pair of two such units for others.

{{index error}}

UTF-16 is generally considered a bad idea today. It seems almost intentionally designed to invite mistakes. It's easy to write programs that pretend code units and characters are the same thing. And if your language doesn't use two-unit characters, that will appear to work just fine. But as soon as someone tries to use such a program with some less common ((Chinese characters)), it breaks. Fortunately, with the advent of ((emoji)), everybody has started using two-unit characters, and the burden of dealing with such problems is more fairly distributed.

{{index [string, length], [string, indexing], "charCodeAt method"}}

Unfortunately, obvious operations on JavaScript strings, such as getting their length through the `length` property and accessing their content using square brackets, deal only with code units.

```{test: no}
// Two emoji characters, horse and shoe
let horseShoe = "🐴👟";
console.log(horseShoe.length);
// → 4
console.log(horseShoe[0]);
// → (Invalid half-character)
console.log(horseShoe.charCodeAt(0));
// → 55357 (Code of the half-character)
console.log(horseShoe.codePointAt(0));
// → 128052 (Actual code for horse emoji)
```

{{index "codePointAt method"}}

JavaScript's `charCodeAt` method gives you a code unit, not a full character code. The `codePointAt` method, added later, does give a full Unicode character. So we could use that to get characters from a string. But the argument passed to `codePointAt` is still an index into the sequence of code units. So to run over all characters in a string, we'd still need to deal with the question of whether a character takes up one or two code units.

{{index "for/of loop", character}}

In the [previous chapter](data#for_of_loop), I mentioned that a `for`/`of` loop can also be used on strings. Like `codePointAt`, this type of loop was introduced at a time where people were acutely aware of the problems with UTF-16. When you use it to loop over a string, it gives you real characters, not code units.

```
let roseDragon = "🌹🐉";
for (let char of roseDragon) {
  console.log(char);
}
// → 🌹
// → 🐉
```

If you have a character (which will be a string of one or two code units), you can use `codePointAt(0)` to get its code.

## Recognizing text

{{index "SCRIPTS data set", "countBy function", [array, counting]}}

We have a `characterScript` function and a way to correctly loop over characters. The next step is to count the characters that belong to each script. The following counting abstraction will be useful there:

```{includeCode: strip_log}
function countBy(items, groupName) {
  let counts = [];
  for (let item of items) {
    let name = groupName(item);
    let known = counts.find(c => c.name == name);
    if (!known) {
      counts.push({name, count: 1});
    } else {
      known.count++;
    }
  }
  return counts;
}

console.log(countBy([1, 2, 3, 4, 5], n => n > 2));
// → [{name: false, count: 2}, {name: true, count: 3}]
```

The `countBy` function expects a collection (anything that we can loop over with `for`/`of`) and a function that computes a group name for a given element. It returns an array of objects, each of which names a group and tells you the number of elements that were found in that group.

{{index "find method"}}

It uses another array method—`find`. This method goes over the elements in the array and returns the first one for which a function returns true. It returns `undefined` when no such element is found.

{{index "textScripts function", "Chinese characters"}}

Using `countBy`, we can write the function that tells us which scripts are used in a piece of text.

```{includeCode: strip_log, startCode: true}
function textScripts(text) {
  let scripts = countBy(text, char => {
    let script = characterScript(char.codePointAt(0));
    return script ? script.name : "none";
  }).filter(({name}) => name != "none");

  let total = scripts.reduce((n, {count}) => n + count, 0);
  if (total == 0) return "No scripts found";

  return scripts.map(({name, count}) => {
    return `${Math.round(count * 100 / total)}% ${name}`;
  }).join(", ");
}

console.log(textScripts('英国的狗说"woof", 俄罗斯的狗说"тяв"'));
// → 61% Han, 22% Latin, 17% Cyrillic
```

{{index "characterScript function", "filter method"}}

The function first counts the characters by name, using `characterScript` to assign them a name and falling back to the string `"none"` for characters that aren't part of any script. The `filter` call drops the entry for `"none"` from the resulting array since we aren't interested in those characters.

{{index "reduce method", "map method", "join method", [array, methods]}}

To be able to compute ((percentage))s, we first need the total number of characters that belong to a script, which we can compute with `reduce`. If no such characters are found, the function returns a specific string. Otherwise, it transforms the counting entries into readable strings with `map` and then combines them with `join`.

## Summary

Being able to pass function values to other functions is a deeply useful aspect of JavaScript. It allows us to write functions that model computations with "gaps" in them. The code that calls these functions can fill in the gaps by providing function values.

Arrays provide a number of useful higher-order methods. You can use `forEach` to loop over the elements in an array. The `filter` method returns a new array containing only the elements that pass the ((predicate function)). Transforming an array by putting each element through a function is done with `map`. You can use `reduce` to combine all the elements in an array into a single value. The `some` method tests whether any element matches a given predicate function. And `find` finds the first element that matches a predicate.

## Exercises

### Flattening

{{index "flattening (exercise)", "reduce method", "concat method", [array, flattening]}}

Use the `reduce` method in combination with the `concat` method to "flatten" an array of arrays into a single array that has all the elements of the original arrays.

{{if interactive

```{test: no}
let arrays = [[1, 2, 3], [4, 5], [6]];
// Your code here.
// → [1, 2, 3, 4, 5, 6]
```

if}}

### Your own loop

{{index "your own loop (example)", "for loop"}}

Write a higher-order function `loop` that provides something like a `for` loop statement. It takes a value, a test function, an update function, and a body function. Each iteration, it first runs the test function on the current loop value and stops if that returns false. Then it calls the body function, giving it the current value. Finally, it calls the update function to create a new value and starts from the beginning.

When defining the function, you can use a regular loop to do the actual looping.

{{if interactive

```{test: no}
// Your code here.

loop(3, n => n > 0, n => n - 1, console.log);
// → 3
// → 2
// → 1
```

if}}

### Everything

{{index "predicate function", "everything (exercise)", "every method", "some method", [array, methods], "&& operator", "|| operator"}}

Analogous to the `some` method, arrays also have an `every` method. This one returns true when the given function returns true for _every_ element in the array. In a way, `some` is a version of the `||` operator that acts on arrays, and `every` is like the `&&` operator.

Implement `every` as a function that takes an array and a predicate function as parameters. Write two versions, one using a loop and one using the `some` method.

{{if interactive

```{test: no}
function every(array, test) {
  // Your code here.
}

console.log(every([1, 3, 5], n => n < 10));
// → true
console.log(every([2, 4, 16], n => n < 10));
// → false
console.log(every([], n => n < 10));
// → true
```

if}}

{{hint

{{index "everything (exercise)", "short-circuit evaluation", "return keyword"}}

Like the `&&` operator, the `every` method can stop evaluating further elements as soon as it has found one that doesn't match. So the loop-based version can jump out of the loop—with `break` or `return`—as soon as it runs into an element for which the predicate function returns false. If the loop runs to its end without finding such an element, we know that all elements matched and we should return true.

To build `every` on top of `some`, we can apply _((De Morgan's laws))_, which state that `a && b` equals `!(!a || !b)`. This can be generalized to arrays, where all elements in the array match if there is no element in the array that does not match.

hint}}

### Dominant writing direction

{{index "SCRIPTS data set", "direction (writing)", "groupBy function", "dominant direction (exercise)"}}

Write a function that computes the dominant writing direction in a string of text. Remember that each script object has a `direction` property that can be `"ltr"` (left to right), `"rtl"` (right to left), or `"ttb"` (top to bottom).

{{index "characterScript function", "countBy function"}}

The dominant direction is the direction of a majority of the characters that have a script associated with them. The `characterScript` and `countBy` functions defined earlier in the chapter are probably useful here.

{{if interactive

```{test: no}
function dominantDirection(text) {
  // Your code here.
}

console.log(dominantDirection("Hello!"));
// → ltr
console.log(dominantDirection("Hey, مساء الخير"));
// → rtl
```

if}}

{{hint

{{index "dominant direction (exercise)", "textScripts function", "filter method", "characterScript function"}}

Your solution might look a lot like the first half of the `textScripts` example. You again have to count characters by a criterion based on `characterScript` and then filter out the part of the result that refers to uninteresting (script-less) characters.

{{index "reduce method"}}

Finding the direction with the highest character count can be done with `reduce`. If it's not clear how, refer to the example earlier in the chapter, where `reduce` was used to find the script with the most characters.

hint}}
