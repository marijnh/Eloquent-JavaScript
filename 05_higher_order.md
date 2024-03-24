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

## Şekillendirilebilirlik

{{index loop, maximum}}

Daha önceki örneği (en büyük betiği bulma) higher-order fonksiyonlar olmadan nasıl yazacağımızı düşünelim. Kod pek de kötü değil.

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

Birkaç daha fazla bağlantı var ve program dört satır daha uzun. Ama yine de okunaklı.

{{index "average function", composability, [function, "higher-order"], "filter method", "map method", "reduce method"}}

{{id average_function}}

Bu fonksiyonlar tarafından sağlanan soyutlamalar, işlemleri _birleştirmeniz_ gerektiğinde gerçekten parlar. Örneğin, veri setindeki yaşayan ve ölü betiklerin ortalama köken yıllarını bulan bir kod yazalım.

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

Böylelikle, Unicode'deki ölü betiklerin ortalama olarak yaşayanlardan daha eski olduğunu görüyoruz. Bu çok da anlamlı veya şaşırtıcı bir istatistik değil. Ancak umarım bunun hesaplanmasında kullanılan kodun okunmasının zor olmadığını görmüşüzdür. Onu bir boru hattı olarak görebilirsiniz: tüm betiklerle başlıyoruz, yaşayan (veya ölü) olanları filtreliyoruz, onlardan yılları alıyoruz, bunların ortalamasını alıyoruz ve sonucu yuvarlıyoruz.

Bu hesaplamayı kesinlikle tek bir büyük ((döngü)) olarak da yazabilirdiniz.

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

Ancak hesaplanan şeyin ne olduğunu ve nasıl olduğunu görmek daha zordur. Ve ara sonuçlar tutarlı değerler olarak temsil edilmediğinden, `average` gibi bir şeyi ayrı bir fonksiyona çıkarmak daha zor bir iş olurdu.

{{index efficiency, [array, creation]}}

Bilgisayarın gerçekte ne yaptığı açısından, bu iki yaklaşım da oldukça farklıdır. İlk yaklaşım, `filter` ve `map` çalıştığında yeni diziler oluştururken, ikincisi sadece bazı sayıları hesaplar, daha az iş yapar. Okunabilir yaklaşımı genellikle seçebilirsiniz ancak devasa dizileri işliyorsanız ve bunu birçok kez yapıyorsanız, daha az soyut tarz, ek hız için değer olabilir.

## Dize ve karakter kodları

{{index "SCRIPTS data set"}}

Bu veri setinin ilginç bir kullanımı, bir metnin hangi betiği kullandığını bulmak olurdu. Hadi bunu yapan bir programı inceleyelim.

Her betiğin ilişkilendirilmiş bir karakter kodu aralığı dizisi olduğunu unutmayın. Bunun sayesinde, bir karakter kodu verildiğinde, varsa ilgili betiği bulmak için böyle bir fonksiyon kullanabiliriz:

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

`some` metodu başka bir higher-order fonksiyondur. Bir test fonksiyonunu alır ve bu fonksiyonun dizideki öğelerden herhangi biri için doğru olup olmadığını size söyler.

{{id code_units}}

Ancak bir dize içindeki karakter kodlarını nasıl alırız?

[Bölüm ? içinde](values) belirtildiği gibi JavaScript ((dize))leri, bir dizi 16-bit numarası olarak kodlanmıştır. Bunlar ((kod birimi)) olarak adlandırılır. Bir ((Unicode)) ((karakter)) kodunun başlangıçta böyle bir birime sığması bekleniyordu (bu size birazdan 65.000'in üzerinde karakter verir). Ancak bu yeterli olmayacağını anlaşılınca, birçok kişi karakter başına daha fazla bellek kullanma gereksinimine itiraz etti. Bu endişeleri ele almak için, JavaScript dizeleri tarafından da kullanılan format olan ((UTF-16)) icat edildi. Bu, yaygın olarak kullanılan çoğu karakteri tek bir 16-bit kod birimi kullanarak açıklar, ancak diğerleri için bu birimden iki adet kullanır.

{{index error}}

UTF-16 genellikle bugün kötü bir fikir olarak kabul edilir. Hemen hemen kasıtlı olarak hatalara davet etmek için tasarlanmış gibi görünüyor. Kod birimlerini ve karakterleri aynı şey gibi düşündüren programlar yazmak kolaydır. Ve diliniz iki birimli karakterler kullanmıyorsa, bu çalışır gibi görünecektir. Ancak birisi böyle bir programı bazı daha az yaygın ((Çin karakterleri)) ile kullanmaya çalıştığında, bozulur. Neyse ki, ((emoji))'lerin ortaya çıkmasıyla, herkes iki birimli karakterleri kullanmaya başladı ve bu tür sorunlarla başa çıkmanın yükü daha adil bir şekilde dağıtılmıştır.

{{index [string, length], [string, indexing], "charCodeAt method"}}

Maalesef, JavaScript dizilerindeki `length` özelliği aracılığıyla uzunluklarını almak ve içeriğine kare parantez kullanarak erişmek gibi işlemler yalnızca kod birimleriyle ilgilenir.

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

JavaScript'in `charCodeAt` yöntemi size bir kod birimi verir, tam bir karakter kodu vermez. Daha sonra eklenen `codePointAt` metodu, tam bir Unicode karakteri verir. Bu nedenle, bir diziden karakterleri almak için bunu kullanabiliriz. Ancak `codePointAt`'e verilen argüman hala bir kod birimleri dizisine verilen bir indekstir. Bu nedenle, bir dizedeki tüm karakterlerin üzerinden geçmek için hala bir karakterin bir veya iki kod birimi kapladığı sorunuyla ilgilenmemiz gerekir.

{{index "for/of loop", character}}

[Önceki bölümde](data#for_of_loop), bir `for/of` döngüsünün aynı zamanda dizelerde de kullanılabileceğini belirtmiştim. `codePointAt` gibi, bu tür bir döngü, UTF-16 ile ilgili sorunların farkında olunan bir dönemde tanıtıldı. Bir dize üzerinde döngü yapmak için kullandığınızda, size kod birimleri değil gerçek karakterler verir.

```
let roseDragon = "🌹🐉";
for (let char of roseDragon) {
  console.log(char);
}
// → 🌹
// → 🐉
```

Eğer bir karakteriniz varsa (ki bu bir veya iki kod birimi uzunluğunda bir dizedir), kodunu almak için `codePointAt(0)` fonksiyonunu kullanabilirsiniz.

## Metni tanıma

{{index "SCRIPTS data set", "countBy function", [array, counting]}}

Bir `characterScript` fonksiyonumuz ve karakterler üzerinde doğru bir şekilde döngü yapmanın bir yolu var. Sonraki adım, her betiğe ait karakterlerin sayısını saymaktır. Aşağıdaki sayma soyutlaması burada yararlı olacaktır:

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

`countBy` fonksiyonu bir koleksiyon (herhangi bir `for/of` döngüsü ile döngü yapabileceğimiz bir şey) ve bir öğe için bir grup adı hesaplayan bir fonksiyon bekler. Bir grup adını belirten ve bu grupta bulunan öğelerin sayısını söyleyen nesnelerden oluşan bir dizi döndürür.

{{index "find method"}}

Başka bir dizi yöntemi olan `find` kullanır. Bu yöntem, dizideki öğeleri gezinir ve verilen fonksiyonun true döndürdüğü ilk öğeyi döndürür. Böyle bir öğe bulunamadığında `undefined` döndürür.

{{index "textScripts function", "Chinese characters"}}

`countBy` kullanarak, bir metinde hangi betiklerin kullanıldığını söyleyen fonksiyonu yazabiliriz.

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

Fonksiyon önce karakterleri adlarına göre sayar, onlara bir isim atamak için `characterScript`'i kullanır ve herhangi bir betiğin parçası olmayan karakterler için `"none"` dizesini kullanır. `filter` çağrısı, sonuç dizisinden `"none"` girişlerini bu karakterlerle ilgilenmediğimiz için ayıklar.

{{index "reduce method", "map method", "join method", [array, methods]}}

((Yüzde))lerin hesaplanabilmesi için öncelikle bir betiğe ait toplam karakter sayısına ihtiyacımız var, bunu `reduce` ile hesaplayabiliriz. Eğer böyle bir karakter bulunmazsa, fonksiyon belirli bir dize döndürür. Aksi takdirde, sayma girişlerini `map` kullanarak okunabilir dizelere dönüştürür ve ardından bunları `join` ile birleştirir.

## Özet

Başka fonksiyon değerlerini diğer fonksiyonlara argüman olarka verebilmek, JavaScript'in derinlemesine kullanışlı bir yönüdür. Bu, aralarında "boşluklar" olan hesaplamaları modelleyen fonksiyonlar yazmamıza olanak tanır. Bu fonksiyonları çağıran kod, fonksiyon değerlerini sağlayarak boşlukları doldurabilir.

Diziler bir dizi kullanışlı higher-order metodlar sağlar. Bir dizideki öğeler üzerinde döngü yapmak için `forEach` kullanabilirsiniz. `filter` yöntemi, yalnızca ((test fonksiyonundan)) true değeriyle geçen öğeleri içeren yeni bir dizi döndürür. Her bir öğeyi bir işlemden geçirerek bir diziyi dönüştürmek için `map` kullanılır. Bir dizi içindeki tüm öğeleri birleştirmek bir değer elde etmek için `reduce` kullanabilirsiniz. `some` yöntemi, belirli bir test fonksiyonundan true değerini alan herhangi bir öğe olup olmadığını test eder. Ve `find`, bir test fonksiyonunu karşılayan ilk öğeyi bulur.

## Egzersizler

### Düzleştirme

{{index "flattening (exercise)", "reduce method", "concat method", [array, flattening]}}

Dizi içinde olan dizilerin tüm öğelerini içeren bir diziyi düzleştirerek oluşturabilmek için `reduce` yöntemini `concat` yöntemiyle beraber kullanın.

{{if interactive

```{test: no}
let arrays = [[1, 2, 3], [4, 5], [6]];
// Kodunuz buraya.
// → [1, 2, 3, 4, 5, 6]
```

if}}

### Kendi döngün

{{index "your own loop (example)", "for loop"}}

Bir `loop` adlı bir higher-order fonksiyon yazın ki bu fonksiyon, bir `for` döngüsü ifadesine benzer bir işlev sağlasın. Bir değer, bir test fonksiyonu, bir güncelleme fonksiyonu ve bir gövde fonksiyonunu parametre olarak almasını sağlayın. Her döngüde, önce mevcut döngü değerinde test fonksiyonunu çalıştırır ve bu yanıtın false döndüğü durumda durur. Ardından, mevcut değeri vererek gövde fonksiyonunu çağırır. Son olarak, yeni bir değer oluşturmak için güncelleme fonksiyonunu çağırır ve baştan başlar.

Fonksiyonu tanımlarken gerçek döngüyü yapmak için normal bir döngü kullanabilirsiniz.

{{if interactive

```{test: no}
// Kodunuz buraya.

loop(3, n => n > 0, n => n - 1, console.log);
// → 3
// → 2
// → 1
```

if}}

### Her şey

{{index "predicate function", "everything (exercise)", "every method", "some method", [array, methods], "&& operator", "|| operator"}}

`some` metoduna benzer şekilde, dizilerin bir de `every` yöntemi vardır. Bu, verilen fonksiyonun dizideki _her öğe_ için true döndüğünde true döndürür. Bir bakıma, `some`, diziler üzerinde çalışan `||` operatörünün bir versiyonu gibidir ve `every` ise `&&` operatörüne benzer.

`every` metodunu bir dizi ve bir test fonksiyonunu parametre olarak alan bir fonksiyon yazarak uygulayın. Bir döngü kullanan ve bir de `some` yöntemini kullanan iki versiyon yazın.

{{if interactive

```{test: no}
function every(array, test) {
  // Kodunuz buraya.
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

`&&` operatörü gibi, `every` metodu, eşleşmeyen bir öğe bulur bulmaz daha fazla öğeyi değerlendirmeyi durdurabilir. Bu nedenle, döngü tabanlı versiyon, test fonksiyonunun false döndürdüğü bir öğe ile karşılaştığında döngüden çıkabilir—`break` veya `return` kullanarak. Döngü, böyle bir öğe bulmadan sonuna kadar çalışırsa, tüm öğelerin eşleştiğini ve `true` döndürmemiz gerektiğini biliriz.

`every` metodunu `some` üzerine inşa etmek için, _De Morgan kanunlarını_ uygulayabiliriz, bu, `a && b`'nin `!(!a || !b)` ifadesine eşit olduğunu belirtir. Bu, dizide hiç eşleşmeyen bir öğe yoksa dizideki tüm öğelerin eşleştiği diziler için genelleştirilebilir.

hint}}

### Baskın yazma yönü

{{index "SCRIPTS data set", "direction (writing)", "groupBy function", "dominant direction (exercise)"}}

Metin içindeki baskın yazma yönünü hesaplayan bir fonksiyon yazın. Unutmayın ki her betik nesnesinin bir `direction` özelliği vardır ve bu `"ltr"` (soldan sağa), `"rtl"` (sağdan sola) veya `"ttb"` (üstden alta) olabilir.

{{index "characterScript function", "countBy function"}}

Baskın yön, betiği olan karakterlerin çoğunluğunun yönüdür. Bölümde önceden tanımlanan `characterScript` ve `countBy` fonksiyonları burada muhtemelen kullanışlı olacaktır.

{{if interactive

```{test: no}
function dominantDirection(text) {
  // Kodunuz buraya.
}

console.log(dominantDirection("Hello!"));
// → ltr
console.log(dominantDirection("Hey, مساء الخير"));
// → rtl
```

if}}

{{hint

{{index "dominant direction (exercise)", "textScripts function", "filter method", "characterScript function"}}

Çözümünüz, `textScripts` örneğinin ilk yarısına çok benzeyebilir. Yine, `characterScript` fonksiyonuna dayalı bir kriterle karakterları saymanız ve ardından ilginç olmayan (betiksiz) karakterleri filtrelemeniz gerekecektir.

{{index "reduce method"}}

En fazla karakter sayısına sahip yönu bulmak için `reduce` kullanılabilir. Nasıl yapılacağı açık değilse, bölümde daha önce en fazla karaktere sahip betiği bulmak için kullanılan `reduce` örneğine başvurun.

hint}}
