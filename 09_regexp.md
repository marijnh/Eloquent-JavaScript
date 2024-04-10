# Düzenli İfadeler

{{quote {author: "Jamie Zawinski", chapter: true}

Bazı insanlar, bir problemle karşılaştıklarında, 'Biliyorum, düzenli ifadeleri kullanacağım.' dediklerinden ötürü artık iki probleme sahip olurlar.

quote}}

{{index "Zawinski, Jamie"}}

{{if interactive

{{quote {author: "Master Yuan-Ma", title: "Programlama Kitabı", chapter: true}

Ahşabın damarına karşı keserseniz, çok güç gerekir. Problemin yapısına karşı programlama yaptığınızda, çok fazla kod gerekir.

quote}}

if}}

{{figure {url: "img/chapter_picture_9.jpg", alt: "Düzenli ifadelerin sözdizimsel yapısını temsil eden bir demiryolu sisteminin illüstrasyonu.", chapter: "square-framed"}}}

{{index evolution, adoption, integration}}

Programlama ((araç))ları ve teknikleri, kaotik, evrimsel bir şekilde hayatta kalır ve yayılır. Her zaman en iyi veya parlak olanlar kazanmaz, ancak doğru nişte yeterince iyi işleyenler veya tesadüfen başka başarılı bir teknoloji parçası ile entegre olanlar kazanır.

{{index "domain-specific language"}}

Bu bölümde, bu araçlardan bir tanesini tartışacağım: _((düzenli ifadeler))_. Düzenli ifadeler, dize verilerindeki ((kalıpları)) tanımlamanın bir yoludur. JavaScript'in ve birçok başka dilin ve sistemlerin bir parçası olan küçük, ayrı bir dil oluştururlar.

{{index [interface, design]}}

Düzenli ifadeler hem son derece sakar hem de son derece kullanışlıdır. Söz dizimi kriptiktir ve JavaScript'in onlar için sağladığı programlama arayüzü sakattır. Ancak, dizeleri incelemek ve işlemek için güçlü bir ((araç))tırlar. Düzenli ifadeleri doğru anlamak, sizi daha etkili bir programcı yapacaktır.

## Düzenli ifade oluşturma

{{index ["regular expression", creation], "RegExp class", "literal expression", "slash character"}}

Düzenli ifade bir tür nesnedir. `RegExp` ((constructor)) fonskiyonunu çağırarak oluşturulabilir veya bir kalıbı ileri eğik çizgi (`/`) karakterleri arasına alarak yazıp da oluşturulabilir.

```
let re1 = new RegExp("abc");
let re2 = /abc/;
```

Bu iki düzenli ifade nesnesi aynı ((kalıbı)) temsil eder: bir _a_ karakteri ardından bir _b_ ardından bir _c_.

{{index ["backslash character", "in regular expressions"], "RegExp class"}}

`RegExp` ((constructor)) fonskiyonunu kullanılırken, kalıp normal bir dize olarak yazılır, bu nedenle ters eğik çizgiler için normal kurallar geçerlidir.

{{index ["regular expression", escaping], [escaping, "in regexps"], "slash character"}}

Kalıbın eğik çizgi karakterleri arasında göründüğü ikinci notasyon durumunda, ters eğik çizgileri biraz farklı bir şekilde işler. İlk olarak, bir ileri eğik çizgi kalıbı sonlandıracağından ötürü kalıbın bir parçası olmasını istediğimiz herhangi bir ileri eğik çizgi önüne bir ters eğik çizgi koymamız gerekir. Ayrıca, özel karakter kodlarının (`\n` gibi) bir parçası olmayan ters eğik çizgiler, dize içinde olduğu gibi görmezden gelinmez ve kalıbın anlamını değiştirir. Soru işaretleri ve artı işaretleri gibi bazı karakterler, düzenli ifadelerde özel anlamlara sahiptir ve karakterin kendisini temsil etmek isteniyorsa öncesine bir ters eğik çizgi yazılmalıdır.

```
let aPlus = /A\+/;
```

## Eşleşenler için test etmek

{{index matching, "test method", ["regular expression", methods]}}

Düzenli ifade nesnelerinin bir dizi metodları vardır. En basiti `test` metodudur. Bir dize geçirirseniz, ifadenin kalıbına uyan dizeyi içerip içermediğini size söyleyen bir ((Boolean)) döndürür.

```
console.log(/abc/.test("abcde"));
// → true
console.log(/abc/.test("abxde"));
// → false
```

{{index pattern}}

Yalnızca özel olmayan karakterlerden oluşan bir düzenli ifade basit olarak, o karakter dizisini temsil eder. _abc_ dizesi, test ettiğimiz dizide (başlangıç dışında yerlerde de olacak şekilde) herhangi bir yerde bulunursa, `test` metodu `true` döndürür.

## Karakter setleri

{{index "regular expression", "indexOf method"}}

Bir dizinin _abc_ içerip içermediğini öğrenmek, `indexOf` ile de yapılabilir. Düzenli ifadeler, daha karmaşık ((kalıpları)) tanımlamamıza izin verdiği için kullanışlıdır.

Diyelim ki bir ((sayı)) eşleştirmek istiyoruz. Bir düzenli ifade içinde, karakterler arasına kare parantezler arasında bir ((küme)) karakterler yerleştirmek, ifadenin bu kısmının parantezler arasındaki karakterlerden herhangi birini eşleştirmesini sağlar.

Her iki ifade de bir ((rakam)) içeren tüm dizeleri eşleştirir:

```
console.log(/[0123456789]/.test("in 1992"));
// → true
console.log(/[0-9]/.test("in 1992"));
// → true
```

{{index "hyphen character"}}

Kare parantezler arasında, iki karakter arasındaki bir tire (-), karakterin ((Unicode)) numarası tarafından belirlenen bir karakterler ((aralığı))nı göstermek için kullanılabilir. 0'dan 9'a olan bu karakterler bu sıralamada hemen yan yanadırlar (kodlar 48 ila 57), bu nedenle `[0-9]` tümünü kapsar ve herhangi bir ((rakamı)) eşleştirir.

{{index [whitespace, matching], "alphanumeric character", "period character"}}

Birçok yaygın karakter grubunun kendi yerleşik kısayolları vardır. Rakamlar bunlardan biridir: `\d`, `[0-9]` ile aynı anlama gelir.

{{index "newline character", [whitespace, matching]}}

{{table {cols: [1, 5]}}}

| `\d`    | Herhangi bir ((rakam)) karakter
| `\w`    | Herhangi bir alfanümerik ("((kelime karakteri))")
| `\s`    | Herhangi bir boşluk karakteri (boşluk, tab, yeni satır, vb.)
| `\D`    | Rakam _olmayan_ bir karakter
| `\W`    | Alfanümerik olmayan bir karakter
| `\S`    | Boşluk olmayan bir karakter
| `.`     | Yeni satır dışında herhangi bir karakter

Bu nedenle, 01-30-2003 15:20 gibi bir ((tarih)) ve ((zaman)) biçimini şu şekilde eşleştirebilirsiniz:

```
let dateTime = /\d\d-\d\d-\d\d\d\d \d\d:\d\d/;
console.log(dateTime.test("01-30-2003 15:20"));
// → true
console.log(dateTime.test("30-jan-2003 15:20"));
// → false
```

{{index ["backslash character", "in regular expressions"]}}

Bu tamamen berbat görünüyor, değil mi? Yarısından fazlası ters eğik çizgiler ve gerçekten ((kalıp)) ifade edilen kısmı bulmayı zorlaştıran bir arka plan gürültüsü oluşturuyor. Bu ifadenin [daha sonra](regexp#date_regexp_counted) biraz geliştirilmiş bir sürümünü göreceğiz.

{{index [escaping, "in regexps"], "regular expression", set}}

Bu ters eğik çizgi kodları aynı zamanda ((kare parantezler)) içinde de kullanılabilir. Örneğin, `[\d.]`, herhangi bir rakam veya bir nokta karakterini ifade eder. Ancak nokta kendisi, kare parantezler arasında, özel anlamını kaybeder. `+` işareti gibi diğer özel karakterler için de aynı şey geçerlidir.

{{index "square brackets", inversion, "caret character"}}

Bir karakterler kümesini tersine çevirmek - yani, kümedeki karakterlerin dışındakileri eşleştirmek istediğinizi belirtmek - için bir üst simge (`^`) karakterini açılış parantezinin hemen ardından yazabilirsiniz.

```
let nonBinary = /[^01]/;
console.log(nonBinary.test("1100100010100110"));
// → false
console.log(nonBinary.test("0111010112101001"));
// → true
```

## Uluslararası karakterler

{{index internationalization, Unicode, ["regular expression", internationalization]}}

JavaScript'in başlangıçtaki basit implementasyonu ve bu basit yaklaşımın daha sonra ((standart)) davranış olarak belirlenmesi nedeniyle, JavaScript'in düzenli ifadeleri, İngilizce dilinde bulunmayan karakterler hakkında oldukça gariptir. Örneğin, JavaScript'in düzenli ifadelerine göre, bir (("kelime karakteri")), yalnızca Latin alfabesinin 26 karakterinden biridir (büyük veya küçük harf), ondalık basamaklar ve, nedense alt çizgi karakteri. _é_ veya _β_ gibi kesinlikle kelime karakterleri olan şeyler, `\w` eşleşirken büyük harfli `\W` olmayan kelime kategorisine eşleşmeyecektir.

{{index [whitespace, matching]}}

Tuhaf bir tarihsel kazadan dolayı, `\s` (boşluk) bu sorunu yaşamaz ve Unicode standardı tarafından boşluk olarak kabul edilen tüm karakterleri eşleştirir, bunlar arasında ((boşluk karakteri)) ve ((Moğol ünlü ayırıcı)) gibi şeyler de vardır.

{{index "character category", [Unicode, property]}}

Bir düzenli ifade içinde `\p` kullanarak Unicode standartında belirli bir özellik verilen tüm karakterlerle eşleştirebilmek mümkündür. Bu, harfleri daha kozmopolit bir şekilde eşleştirmemize olanak tanır. Ancak, yine de orijinal dil standartlarıyla uyumluluktan dolayı, bunlar yalnızca düzenli ifadenin sonuna ((Unicode)) için bir `u` karakteri eklediğinizde tanınır.

{{table {cols: [1, 5]}}}

| `\p{L}`             | Herhangi bir harf
| `\p{N}`             | Herhangi bir sayısal karakter
| `\p{P}`             | Herhangi bir noktalama işareti karakteri
| `\P{L}`             | Harf olmayan herhangi bir şey (büyük harf P tersine çevrilir)
| `\p{Script=Hangul}` | Verilen alfabe dosyasındaki herhangi bir karakter ([Bölüm ?](higher_order#scripts))

Düzenli ifadeleri `\w` aracılığıyla metin işleme amaçları için kullanmak, İngilizce olmayan metinlerde (hatta İngilizce olan ancak “cliché” gibi ödünç alınmış kelimeleri kullanan metinlerde) “é” gibi karakterleri harfler olarak işlemeyeceğinden bir dezavantajdır. İçerikleri biraz daha uzun olsa da, `\p` özellik grupları daha sağlamdır.

```{test: never}
console.log(/\p{L}/u.test("α"));
// → true
console.log(/\p{L}/u.test("!"));
// → false
console.log(/\p{Script=Greek}/u.test("α"));
// → true
console.log(/\p{Script=Arabic}/u.test("α"));
// → false
```

{{index "Number function"}}

Öte yandan, bir şeyler yapmak için sayıları eşleştirecekse, genellikle onlara yapılacak şeyler için `\d`'yi kullanmak istersiniz çünkü `Number` gibi bir fonksiyonun sizin için sayı atanmış rastgele herhangi bir karakterleri JavaScript sayısına dönüştürmesi mümkün değildir.

## Bir desenin tekrarlanan bölümleri

{{index ["regular expression", repetition]}}

Şimdi tek bir basamağı eşleştirmeyi nasıl yapacağımızı biliyoruz. Bir tam sayıyı - bir veya daha fazla ((rakam))ın bir ((dizi))sini eşleştirmek istersek ne yapmalıyız?

{{index "plus character", repetition, "+ operator"}}

Düzenli ifadede bir artı işareti (`+`) bir şeyin birden fazla kez tekrarlanabileceğini gösterir. Dolayısıyla, `/\d+/`, bir veya daha fazla rakam karakteri eşleştirir.

```
console.log(/'\d+'/.test("'123'"));
// → true
console.log(/'\d+'/.test("''"));
// → false
console.log(/'\d*'/.test("'123'"));
// → true
console.log(/'\d*'/.test("''"));
// → true
```

{{index "* operator", asterisk}}

Yıldız (`*`) benzer bir anlama sahiptir, ancak aynı zamanda kalıbın sıfır kez eşleşmesine izin verir. Bir şeyin sonunda yıldız olan bir şey asla bir kalıbın eşleşmesini engellemez - uygun metni bulamazsa sadece sıfır örnekler eşleştirir.

{{index "British English", "American English", "question mark"}}

Bir soru işareti, kalıbın bir parçasını _((isteğe bağlı))_ yapar, yani sıfır veya bir kez olabilir. Aşağıdaki örnekte, _u_ karakterinin olması izin verilir, ancak kalıp aynı zamanda eksik olduğunda da eşleşir.

```
let neighbor = /neighbou?r/;
console.log(neighbor.test("neighbour"));
// → true
console.log(neighbor.test("neighbor"));
// → true
```

{{index repetition, [braces, "in regular expression"]}}

Bir kalıbın belirli bir sayı kadar gerçekleşmesi gerektiğini belirtmek için süslü parantezler kullanın. Örneğin, bir öğeden sonra `{4}` yazmak, onun tam olarak dört kez gerçekleşmesini gerektirir. Ayrıca bu şekilde bir ((aralık)) belirlemek de mümkündür: `{2,4}` öğenin en az iki kez ve en fazla dört kez gerçekleşmesini gerektirir.

{{id date_regexp_counted}}

İşte hem tek hem de çift ((rakam)) günleri, ayları ve saatleri olan ((tarih)) ve ((zaman)) kalıbının başka bir versiyonu. Ayrıca anlaması da biraz daha kolaydır.

```
let dateTime = /\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}/;
console.log(dateTime.test("1-30-2003 8:45"));
// → true
```

Süslü parantezleri kullanırken, bir sayıdan sonraki virgülü atlayarak açık uçlu ((aralık))lar belirleyebilirsiniz. Bu nedenle, `{5,}` beş veya daha fazla kez anlamına gelir.

## Alt ifadeleri gruplandırma

{{index ["regular expression", grouping], grouping, [parentheses, "in regular expressions"]}}

`*` veya `+` gibi bir operatörü aynı anda birden fazla öğe üzerinde kullanmak istiyorsanız, parantezleri kullanmanız gerekir. Parantezlerle çevrili bir düzenli ifade parçası, onu takip eden operatörler açısından tek bir öğe olarak sayılır.

```
let cartoonCrying = /boo+(hoo+)+/i;
console.log(cartoonCrying.test("Boohoooohoohooo"));
// → true
```

{{index crying}}

İlk ve ikinci `+` karakteri, sırasıyla _boo_ ve _hoo_'daki ikinci _o_ için uygulanır. Üçüncü `+`, `(hoo+)` grubuna tamamen uygulanır, bir veya daha fazla benzer dizilerle eşleşir.

{{index "case sensitivity", capitalization, ["regular expression", flags]}}

Örnekteki ifadenin sonundaki `i`, bu düzenli ifadeyi harf büyüklüğüne duyarsız hale getirir, böylece model kendisi tamamen küçük harfken giriş dizgisindeki büyük harf _B_ ile de eşleşir.

## Maçlar ve gruplar

{{index ["regular expression", grouping], "exec method", [array, "RegExp match"]}}

`test` metodu, bir düzenli ifadeyi eşlemek için mutlak en basit yoldur. Sadece eşleşip eşleşmediğini söyler ve başka hiçbir şey söylemez. Düzenli ifadelerin ayrıca `exec` (çalıştır) adlı bir metodu vardır; bu metot, eşleşme bulunamazsa `null` döndürür ve aksi takdirde eşleşme hakkında bilgi içeren bir nesne döndürür.

```
let match = /\d+/.exec("one two 100");
console.log(match);
// → ["100"]
console.log(match.index);
// → 8
```

{{index "index property", [string, indexing]}}

`exec` tarafından döndürülen bir nesne, başarılı eşleşmenin dizede _nerede_ başladığını belirten bir `index` özelliğine sahiptir. Bunun dışında, nesne eşleşen dizgeyi içeren bir dize dizisi gibi görünür ki zaten öyledir de. Önceki örnekte, bu aradığımız ((rakam)) dizisidir.

{{index [string, methods], "match method"}}

Dize değerleri benzer şekilde davranan bir `match` metodu içerir.

```
console.log("one two 100".match(/\d+/));
// → ["100"]
```

{{index grouping, "capture group", "exec method"}}

Düzenli ifade, parantezlerle gruplandırılmış alt ifadeler içeriyorsa, bu gruplarla eşleşen metinlerin de dizi içinde görünür. Tüm eşleşme her zaman ilk öğedir. Bir sonraki öğe, ilk grup tarafından eşleştirilen kısım (ifadenin içindeki açılış parantezi önce gelen grup), ardından ikinci grup ve sonrasıdır.

```
let quotedText = /'([^']*)'/;
console.log(quotedText.exec("she said 'hello'"));
// → ["'hello'", "hello"]
```

{{index "capture group"}}

Bir grup hiç eşleşmediğinde (örneğin, bir soru işareti tarafından izlendiğinde), çıktı dizisindeki konumu `undefined` değerini tutar. Ve bir grup birden fazla kez eşleşirse (örneğin, bir `+` tarafından izlendiğinde), yalnızca son eşleşme diziye girer.

```
console.log(/bad(ly)?/.exec("bad"));
// → ["bad", undefined]
console.log(/(\d)+/.exec("123"));
// → ["123", "3"]
```

Eşleşmelerin yalnızca gruplama amacıyla kullanılmasını istiyor ve döndürülen dizide gösterilmesini istemiyorsanız, açılış parantezinden sonra `?:` ekleyebilirsiniz.

```
console.log(/(?:na)+/.exec("banana"));
// → ["nana"]
```

{{index "exec method", ["regular expression", methods], extraction}}

Gruplar, bir dizgenin parçalarını çıkarmak için yararlı olabilir. Bir dizgenin yalnızca bir ((tarih)) içerip içermediğini kontrol etmekle kalmayıp aynı zamanda bunu çıkarmak ve bunu temsil eden bir nesne oluşturmak istiyorsak, parantezleri sayı desenlerinin etrafına sarabilir ve `exec` fonksiyonunun sonucundan tarihi seçebiliriz.

Ancak önce, JavaScript'te tarih ve ((zaman)) değerlerini temsil etmenin yerleşik yolunu tartışacağımız kısa bir yolculuğa çıkacağız.

## Date sınıfı

{{index constructor, "Date class"}}

JavaScript'in ((tarih))leri - veya daha doğrusu, ((zaman)) noktalarını - temsil etmek için standart bir sınıfı vardır. Bu `Date` olarak adlandırılır. Sadece `new` kullanarak basitçe bir tarih nesnesi oluşturursanız, mevcut tarihi ve zamanı alırsınız.

```{test: no}
console.log(new Date());
// → Fri Feb 02 2024 18:03:06 GMT+0100 (CET)
```

{{index "Date class"}}

Belirli bir zaman için bir nesne oluşturabilirsiniz.

```
console.log(new Date(2009, 11, 9));
// → Wed Dec 09 2009 00:00:00 GMT+0100 (CET)
console.log(new Date(2009, 11, 9, 12, 59, 59, 999));
// → Wed Dec 09 2009 12:59:59 GMT+0100 (CET)
```

{{index "zero-based counting", [interface, design]}}

JavaScript, ay numaralarının sıfırdan başladığı bir kural kullanır (bu nedenle Aralık 11'dir), ancak gün numaraları bir'den başlar. Bu kafa karıştırıcı ve saçma. Dikkatli olun.

Son dört argüman (saatler, dakikalar, saniyeler ve milisaniyeler) isteğe bağlıdır ve verilmediğinde sıfır kabul edilir.

{{index "getTime method", timestamp}}

Zaman damgaları, UTC ((zaman dilimi)) başlangıcından itibaren geçen milisaniye sayısı olarak depolanır. Bu, o zaman civarında icat edilen "((Unix zamanı))" tarafından belirlenen bir kuralı izler. 1970'den önceki zamanlar için negatif sayılar kullanabilirsiniz. Bir tarih nesnesindeki `getTime` metodu bu sayıyı döndürür. Tahmin edebileceğiniz gibi, bu büyüktür.

```
console.log(new Date(2013, 11, 19).getTime());
// → 1387407600000
console.log(new Date(1387407600000));
// → Thu Dec 19 2013 00:00:00 GMT+0100 (CET)
```

{{index "Date.now function", "Date class"}}

`Date` constructor fonksiyonuna tek bir argüman verirseniz, bu argüman milisaniye olarak kabul edilir. Mevcut milisaniye sayısını elde etmek için yeni bir `Date` nesnesi oluşturabilir ve üzerinde `getTime` çağrısı yapabilir veya `Date.now` fonksiyonunu çağırabilirsiniz.

{{index "getFullYear method", "getMonth method", "getDate method", "getHours method", "getMinutes method", "getSeconds method", "getYear method"}}

Tarih nesneleri, bileşenlerini çıkarmak için `getFullYear`, `getMonth`, `getDate`, `getHours`, `getMinutes`, ve `getSeconds` gibi metodlar sağlar. `getFullYear` dışında, size yılın 1900 çıkarılmış halini (`98` veya `119`) veren `getYear` da vardır ve çoğunlukla kullanışsızdır.

{{index "capture group", "getDate method", [parentheses, "in regular expressions"]}}

İlgilendiğimiz ifade parçalarını parantez içine alarak, şimdi bir dizeyi bir tarih nesnesine dönüştürebiliriz.

```
function getDate(string) {
  let [_, month, day, year] =
    /(\d{1,2})-(\d{1,2})-(\d{4})/.exec(string);
  return new Date(year, month - 1, day);
}
console.log(getDate("1-30-2003"));
// → Thu Jan 30 2003 00:00:00 GMT+0100 (CET)
```

{{index destructuring, "underscore character"}}

`exec` tarafından döndürülen dizideki `_` (alt çizgi) bağlantısı dikkate alınmaz ve yalnızca tam eşleşme öğesini atlamak için kullanılır.

## Sınırlar ve görünüm

{{index matching, ["regular expression", boundary]}}

Maalesef, `getDate` aynı zamanda dize `"100-1-30000"` içinden de bir tarih alır. Bir eşleşme dize içinde herhangi bir yerde olabilir, bu nedenle bu durumda, sadece ikinci karakterden başlayıp sondan ikinci karakterde sona erecektir.

{{index boundary, "caret character", "dollar sign"}}

Eşleşmenin dizeyi tamamen kaplaması gerektiğini zorlamak istiyorsak, `^` ve `$` işaretlerini ekleyebiliriz. Caret giriş dizesinin başlangıcına uyar, dolar işareti ise sona uyar. Bu nedenle, `/^\d+$/`, yalnızca bir veya daha fazla rakamdan oluşan bir dizeyi eşleştirir, `/^!/` bir ünlem işareti ile başlayan herhangi bir diziyi eşleştirir ve `/x^/` hiçbir dizeyi eşleştirmez (dizenin başlangıcından önce bir _x_ olamaz).

{{index "word boundary", "word character"}}

"kelime sınırlarıyla" eşleşen `\b` işareti vardır, bu pozisyonlar bir tarafta kelime kararkteri bir tarafta kelime olmayan bir karakteri barındırır. `\w` da "kelime karakterleri" kavramı gibi basit kavramlarını kullanır ve bu nedenle pek güvenilir değildir.

Bu işaretlerin herhangi bir gerçek karakterle eşleşmediğini unutmayın. Sadece desende göründükleri yerde belirli bir koşulun geçerli olmasını sağlarlar.

{{index "look-ahead"}}

İleri görüşlü testler de buna benzer bir şey yapar. Bir desen sağlar ve girdinin bu desene uymadığı durumlarda eşleşmeyi başarısız kılar, ancak aslında eşleşme konumunu ileri taşımaz. Bunlar `(?=` ve `)` arasında yazılır.

```
console.log(/a(?=e)/.exec("braeburn"));
// → ["a"]
console.log(/a(?! )/.exec("a b"));
// → null
```

İlk örnekteki `e`'nin eşleşen dize parçasının bir parçası olmamasına rağmen eşleşme için gerekli olduğuna dikkat edin. `(?! )` notasyonu _negatif_ bir ön görüş ifade eder. Bu, ikinci örnekte yalnızca kendisinden sonra boşluk olmayan "a" karakterlerinin eşleşmesini sağlar.

## Seçim desenleri

{{index branching, ["regular expression", alternatives], "farm example"}}

Bir metin parçasının sadece bir sayıyı değil, bir sayıyı ve bununla birlikte _pig_, _cow_, veya _chicken_ gibi kelimelerden birini veya bunların çoğul biçimlerinden herhangi birini içerip içermediğini bilmek istediğimizi varsayalım.

Üç düzenli ifade yazıp sırayla test edebiliriz, ancak daha güzel bir yol var. ((boru karakteri)) (`|`), solundaki desen ile sağdaki desen arasında ((seçim)) olarak işlev görür. Dolayısıyla, bunu diyebilirim:

```
let animalCount = /\d+ (pig|cow|chicken)s?/;
console.log(animalCount.test("15 pigs"));
// → true
console.log(animalCount.test("15 pugs"));
// → false
```

{{index [parentheses, "in regular expressions"]}}

Parantezler, boru operatörünün uygulandığı desenin kısmını sınırlamak için kullanılabilir ve birden çok bu tür operatörü yan yana koyarak ikiden fazla alternatif arasında bir seçimi ifade edebilirsiniz.

## Eşleştirme mekaniği

{{index ["regular expression", matching], [matching, algorithm], "search problem"}}

Kavramsal olarak, `exec` veya `test` kullandığınızda, düzenli ifade motoru, dize içinde eşleşme arar ve ifadeyi ilk olarak dize başlangıcından itibaren eşleştirmeye çalışır, ardından ikinci karakterden itibaren ve bunu bir eşleşme bulana veya dize sonuna ulaşana kadar sürdürür. Bulunabilecek ilk eşleşmeyi ya döndürür ya da hiçbir eşleşme bulamaz.

{{index ["regular expression", matching], [matching, algorithm]}}

Gerçek eşleştirmeyi yapmak için, motor, düzenli ifadeyi bir ((akış diyagramı)) gibi işler. Bu, önceki örnekteki hayvan ifadesinin diyagramıdır:

{{figure {url: "img/re_pigchickens.svg", alt: "İlk önce 'rakam' etiketli bir kutudan geçen, sonra geri dönen bir döngü ve daha sonra bir boşluk karakteri için bir kutudan geçen demiryolu diyagramı. Bundan sonra, demiryolu üçte ayrılır, 'domuz', 'inek' ve 'tavuk' için kutulardan geçer. Onlardan sonra tekrar birleşir ve isteğe bağlı olarak, onu geçen bir demiryoluna sahip olan 'S' etiketli bir kutudan geçer. Son olarak, çizgi kabul eden duruma ulaşır."}}}

{{index traversal}}

Our expression matches if we can find a path from the left side of the diagram to the right side. We keep a current position in the string, and every time we move through a box, we verify that the part of the string after our current position matches that box.
İfademiz, diyagramın sol tarafından sağ tarafına bir yol bulabilirse eşleşir. Dizgede bir geçerli konum tutarız ve her bir kutudan geçerken, mevcut konumumuzdan sonrasının kutu ile eşleşip eşleşmediğini doğrularız.

{{id backtracking}}

## Geri izleme

{{index ["regular expression", backtracking], "binary number", "decimal number", "hexadecimal number", "flow diagram", [matching, algorithm], backtracking}}

Düzenli ifade `/^([01]+b|[\da-f]+h|\d+)$/` ya bir ikili sayıyının sonrasında bir _b_ olan, ya bir onaltılı sayıyı (yani, harfler _a_ ile _f_ 10 ile 15 arasındaki rakamları temsil ettiği) sonrasında bir _h_ olan ya da hiçbir son ek karakteri olmayan bir düzenli ondalık sayıyı eşleştirir. Bu, karşılık gelen diyagramdır:

{{figure {url: "img/re_number.svg", alt: "'^([01]+b|\\d+|[\\da-f]+h)$' düzenli ifadesi için demiryolu diyagramı."}}}

{{index branching}}

Bu ifadeyi eşleştirirken, girişin gerçekte bir ikili sayı içermediği durumda bile genellikle üst (ikili) şubeye girilir. Örneğin, dize `"103"` ile eşleştirirken, 3 karakterini gördüğümüzde yanlış şubede olduğumuzu sonradan anlayabiliriz. Dize ifadeye _uyar_, ancak şu anda bulunduğumuz şubeye değil.

{{index backtracking, "search problem"}}

Bu nedenle eşleyici geri döner. Bir şubeye girerken, mevcut konumunu (bu durumda diyagramdaki ilk sınır kutusunun hemen ötesinde, dizenin başlangıcında) hatırlar, böylece mevcut şube işe yaramazsa başka bir şube denemek için geri dönebilir. `"103"` dizesi için 3 karakterini gördükten sonra, onaltılı sayılar şubesini denemeye başlar, ancak sayıdan sonra bir _h_ olmadığı için bu şube başarısız olur. Sonra ondalık sayı şubesini dener. Bu uygun olur ve sonunda bir eşleşme bildirilir.

{{index [matching, algorithm]}}

Eşleyici, bir tam eşleşme bulduğunda durur. Bu, birden çok şubenin bir dizeyi potansiyel olarak eşleştirebileceği durumlarda, yalnızca ilk şubenin (düzenli ifade içinde şubelerin göründüğü yere göre sıralanır) kullanılacağı anlamına gelir.

Geri dönme, `+` ve `*` gibi ((tekrar)) operatörleri için de geçerlidir. `"abcxe"` ile `/^.*x/` eşleşirse, `.*` kısmı önce tüm diziyi tüketmeye çalışır. Daha sonra, deseni eşleştirmek için bir _x_ gerektiğini fark eder. Dizinin sonunda bir _x_ olmadığı için, yıldız operatörü bir karakter daha az eşleşmeye çalışır. Ancak eşleşme, `abcx`'ten sonra bir _x_ bulamaz, bu nedenle tekrar geri döner ve yıldız operatörünü sadece `abc`'ye eşleştirmeye çalışır. Şimdi ihtiyacı olan yere bir _x_ bulur ve 0 ile 4 arasında başarılı bir eşleşme bildirir.

{{index performance, complexity}}

_Çok fazla_ dönme yapacak düzenli ifadeler yazmak mümkündür. Bu problem, bir desenin bir girişi birçok farklı şekilde eşleştirebilmesi durumunda ortaya çıkar. Örneğin, bir ikili sayı düzenli ifadesi yazarken kafamız karışırsa, yanlışlıkla `/([01]+)+b/` gibi bir şey yazabiliriz.

{{figure {url: "img/re_slow.svg", alt: "'([01]+)+b' düzenli ifadesi için demiryolu diyagramı.", width: "6cm"}}}

{{index "inner loop", [nesting, "in regexps"]}}

Eğer bu, sona gelen _b_ karakteri olmadan uzun bir sıfır ve birler serisiyle eşleşmeye çalışırsa, eşleyici önce iç döngüden geçer ve bunu rakamlar bitene kadar yapmaya devam eder. Sonra _b_ olmadığını fark eder, bu yüzden bir konum geri döner, dış döngüden bir kez geçer ve yine vazgeçip iç döngüden bir kez daha geri dönmeye çalışır. Bu iki döngü arasındaki herhangi bir olası rotayı denemeye devam eder. Bu, her ek karakterle çalışmanın işini ikiye katlanacağı anlamına gelir. Yalnızca birkaç düzine karakter için bile, elde edilen eşleşme neredeyse sonsuza kadar sürer.

## replace metodu

{{index "replace method", "regular expression"}}

Dize değerleri, bir dizeyi başka bir dizeyle değiştirmek için `replace` metoduna sahiptir.

```
console.log("papa".replace("p", "m"));
// → mapa
```

{{index ["regular expression", flags], ["regular expression", global]}}

İlk argüman ayrıca bir düzenli ifade de olabilir, bu durumda düzenli ifadenin ilk eşleşmesi değiştirilir. Düzenli ifadenin ardından bir `g` seçeneği (_global_ için) eklenirse, dizedeki yalnızca ilk değil _tüm_ eşleşmeler değiştirilir.

```
console.log("Borobudur".replace(/[ou]/, "a"));
// → Barobudur
console.log("Borobudur".replace(/[ou]/g, "a"));
// → Barabadar
```

{{index grouping, "capture group", "dollar sign", "replace method", ["regular expression", grouping]}}

`replace` ile düzenli ifadeleri kullanmanın gerçek gücü, eşleşen gruplara değiştirme dizesinde başvurabileceğimiz gerçeğinden gelir. Örneğin, her bir satırda `Lastname, Firstname` biçiminde bir ad bulunan büyük bir dizeye sahip olduğumuzu varsayalım. Bu isimleri değiştirmek ve virgülü kaldırarak `Firstname Lastname` biçimini elde etmek istiyorsak, aşağıdaki kodu kullanabiliriz:

```
console.log(
  "Liskov, Barbara\nMcCarthy, John\nMilner, Robin"
    .replace(/(\p{L}+), (\p{L}+)/gu, "$2 $1"));
// → Barbara Liskov
//   John McCarthy
//   Robin Milner
```

Değiştirme dizesindeki `$1` ve `$2`, desendeki parantez içi gruplara başvurur. `$1`, ilk gruba karşı eşleşen metin ile değiştirilir, `$2` ikinci grup ile değiştirilir ve böyle devam eder, `$9`'a kadar. Tüm eşleşme `$&` ile başvurulabilir.

{{index [function, "higher-order"], grouping, "capture group"}}

`replace` metoduna ikinci argüman olarak bir dize yerine fonksiyon vermek mümkündür. Her değiştirme için, fonksiyon, eşleşen gruplarla (ayrıca tüm eşleşme ile) argüman olarak çağrılır ve dönüş değeri yeni dizeye eklenir.

İşte bir örnek:

```
let stock = "1 lemon, 2 cabbages, and 101 eggs";
function minusOne(match, amount, unit) {
  amount = Number(amount) - 1;
  if (amount == 1) { // only one left, remove the 's'
    unit = unit.slice(0, unit.length - 1);
  } else if (amount == 0) {
    amount = "no";
  }
  return amount + " " + unit;
}
console.log(stock.replace(/(\d+) (\p{L}+)/gu, minusOne));
// → no lemon, 1 cabbage, and 100 eggs
```

Bu bir dize alır, bir alfanümerik kelime tarafından izlenen tüm sayı geçişlerini bulur ve o türdeki her sayıdan bir eksik dize döndürür.

`(\d+)` grubu, fonksiyona `amount` argümanı olarak gelir ve `(\p{L}+)` grubu `unit` olarak gelir. Fonksiyon, `amount`'u bir sayıya dönüştürür -her zaman `\d+` ile eşleştiğinden- ve yalnızca bir veya sıfır kaldığında bazı ayarlamalar yapar.

## Açgözlülük

{{index greed, "regular expression"}}

Tüm ((yorum))ları bir JavaScript ((kodu)) parçasından kaldıran bir fonksiyon yazmak için `replace` metodunu kullanmak mümkündür. İşte bir ilk deneme:

```{test: wrap}
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[^]*\*\//g, "");
}
console.log(stripComments("1 + /* 2 */3"));
// → 1 + 3
console.log(stripComments("x = 10;// ten!"));
// → x = 10;
console.log(stripComments("1 /* a */+/* b */ 1"));
// → 1  1
```

{{index "period character", "slash character", "newline character", "empty set", "block comment", "line comment"}}

_Veya_ operatöründen önceki kısım iki eğik çizgi karakterini ve ardından gelen herhangi yeni satır olmayan karakteri eşleştirir. Çok satırlı yorumlar için kısım daha karmaşıktır. Herhangi bir karakteri eşleştirmenin bir yolu olarak `[^]` (boş karakter kümesinde olmayan herhangi bir karakter) kullanırız. Burada sadece bir nokta kullanamayız çünkü blok yorumları yeni bir satırda devam edebilir ve nokta karakteri yeni satır karakterlerini eşleştirmez.

Ancak, son satırın çıktısında bir sorun varmış gibi duruyor. Neden?

{{index backtracking, greed, "regular expression"}}

Desendeki `[^]*` kısmı, geri dönme bölümünde açıkladığım gibi, önce bulabileceği kadar çok şeyi eşleştirir. Bu, desenin bir sonraki kısmının başarısız olmasına neden olursa, eşleyici bir karakter geri gider ve oradan tekrar denemeye çalışır. Örnekte, eşleyici önce dizinin geri kalanının tamamını eşleştirmeye çalışır ve oradan geri gider. `*/`'nın bir eşleşmesini dört karakter geri giderek bulacaktır. Bu istediğimiz şey değildi - niyetimiz bir tek yorumu eşleştirmekti, kodun en sonuna gidip en sonda bulunan yorum bloğu sonunu bulmak değil.

Bu davranış nedeniyle, tekrar operatörleri (`+`, `*`, `?`, ve `{}`) _((açgöz))lü_ olarak adlandırılır, yani olabildiğince çok şey eşleştirirler ve oradan geri dönerler. Onlardan sonra ((soru işareti)) (`+?`, `*?`, `??`, `{}?`) koyarsanız, artık açgözlü olmazlar ve önce mümkün olduğunca az eşleşen bir diziyle başlarlar, daha küçük eşleşme uygun gelmediğinde daha fazla eşleştirirler.

Ve bu durumda tam olarak istediğimiz budur. Yıldızın bizi `*/`'a getiren en küçük karakter dizisini eşleştirmesiyle, bir blok yorumu tüketiriz ve daha fazlasını değil.

```{test: wrap}
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[^]*?\*\//g, "");
}
console.log(stripComments("1 /* a */+/* b */ 1"));
// → 1 + 1
```

((Düzenli ifade)) programlarında birçok ((hata)), daha iyi çalışan bir açgözlü olmayan operatör yerine yanlışlıkla açgözlü bir operatör kullanmanın sonucudur. Bir ((tekrar)) operatörü kullanırken, açgözlü olmayan varyantı tercih edin.

## Dinamik olarak RegExp nesleri yaratmak

{{index ["regular expression", creation], "underscore character", "RegExp class"}}

Kodunuzu yazarken eşleştirmeniz gereken tam ((kalıbı)) bilmediğiniz durumlar vardır. Bir metin parçasında kullanıcının adını test etmek istediğinizi varsayalım. Bir dize biriktirip `RegExp` ((constructor)) fonksiyonunu üzerinde kullanabilirsiniz. İşte bir örnek:

```
let name = "harry";
let regexp = new RegExp("(^|\\s)" + name + "($|\\s)", "gi");
console.log(regexp.test("Harry is a dodgy character."));
// → true
```

{{index ["regular expression", flags], ["backslash character", "in regular expressions"]}}

Dize kısmımda `\s` oluşturulurken, bunları bir bir düzenli ifade içinde değil de normal dize içinde yazdığımızdan ötürü iki ters eğik çizgi kullanmamız gerekiyor. `RegExp` constructor fonksiyonunun ikinci argümanı, düzenli ifade seçeneklerini içerir -bu durumda, global ve harf büyüklüğüne duyarsız olan `"gi"`.

Peki ya kullanıcımız adı `"dea+hl[]rd"` olan bir ergen ((geek)) ise? Bu, kullanıcının adını gerçekten eşleştirmeyen anlamsız bir düzenli ifadeye yol açar.

{{index ["backslash character", "in regular expressions"], [escaping, "in regexps"], ["regular expression", escaping]}}

Bunu çözmek için, özel bir anlamı olan her karakterin önüne ters eğik çizgi ekleyebiliriz.

```
let name = "dea+hl[]rd";
let escaped = name.replace(/[\\[.+*?(){|^$]/g, "\\$&");
let regexp = new RegExp("(^|\\s)" + escaped + "($|\\s)",
                        "gi");
let text = "This dea+hl[]rd guy is super annoying.";
console.log(regexp.test(text));
// → true
```

## search metodu

{{index ["regular expression", methods], "indexOf method", "search method"}}

Dize üzerindeki `indexOf` metodu bir düzenli ifade ile çağrılamaz. Ancak, düzenli ifade bekleyen başka bir yöntem olan `search` adında bir yöntem vardır. `indexOf` gibi, ifadenin bulunduğu ilk index pozisyonunu döndürür veya bulunamadığında -1 döndürür.

```
console.log("  word".search(/\S/));
// → 2
console.log("    ".search(/\S/));
// → -1
```

Ne yazık ki, eşleşmenin belirli bir konumdan başlaması gerektiğini belirtmenin bir yolu yoktur (`indexOf`'deki ikinci argümanla yaptığımız gibi), bu genellikle kullanışlı olurdu.

## lastIndex özelliği

{{index "exec method", "regular expression"}}

`exec` metodu benzer şekilde, dizinde belirli bir konumdan aramaya başlamanın kolay bir yolunu sağlamaz. Ancak kolay *olmayan*, zor bir yolunu sağlar.

{{index ["regular expression", matching], matching, "source property", "lastIndex property"}}

Düzenli ifade nesnelerinin özellikleri vardır. Bunlardan biri `source` özelliğidir ve değerinde bu ifadenin oluşturulduğu dizeyi barındırır. Başka bir özellik de `lastIndex`'tir, bazı sınırlı durumlarda bir sonraki eşleşmenin nereden başlayacağını kontrol eder.

{{index [interface, design], "exec method", ["regular expression", global]}}

Bu durumlar, düzenli ifadenin global (`g`) veya yapışkan (`y`) seçeneğinin etkinleştirilmiş olması ve eşleşmenin `exec` metodu aracılığıyla gerçekleşmiş olması gereklidir. Tabii, daha az kafa karışıklığına sebep olmak için `exec` metoduna ekstra bir argümanın verilmesine izin verilmesi daha iyi olurdu, ancak karışıklık JavaScript'in düzenli ifade arayüzünün temel bir özelliğidir.

```
let pattern = /y/g;
pattern.lastIndex = 3;
let match = pattern.exec("xyzzy");
console.log(match.index);
// → 4
console.log(pattern.lastIndex);
// → 5
```

{{index "side effect", "lastIndex property"}}

Eşleşme başarılı olduysa, `exec` çağrısı otomatik olarak `lastIndex` özelliğini eşleşmenin sonrasına işaret edecek şekilde günceller. Eğer bir eşleşme bulunamadıysa, `lastIndex` sıfıra, aynı zamanda yeni oluşturulan bir düzenli ifade nesnesinin sahip olduğu değere geri döner.

Global ve yapışkan seçenekler arasındaki fark, yapışkan etkinleştirildiğinde, eşleşme ancak `lastIndex`'te doğrudan başlaması durumunda başarılı olacağıdır, global kullanıldığındaysa, bir eşleşmenin başlayabileceği bir konumu arar.

```
let global = /abc/g;
console.log(global.exec("xyz abc"));
// → ["abc"]
let sticky = /abc/y;
console.log(sticky.exec("xyz abc"));
// → null
```

{{index bug}}

Birden fazla `exec` çağrısı için paylaşılan bir düzenli ifade değeri kullanırken, bu otomatik güncellemeler `lastIndex` özelliğinin değerinde sorunlara neden olabilir. Düzenli ifadeniz yanlışlıkla önceki bir çağrıdan kalan index değerinden başlayabilir.

```
let digit = /\d/g;
console.log(digit.exec("here it is: 1"));
// → ["1"]
console.log(digit.exec("and now: 1"));
// → null
```

{{index ["regular expression", global], "match method"}}

Global seçeneğin başka bir ilginç etkisi de, dizeler üzerindeki `match` metodunun çalışma şeklini değiştirmesidir. Global bir ifade ile çağrıldığında, `exec` tarafından döndürülen diziye benzer bir dizi döndürmek yerine, `match`, dizedeki desenin _tüm_ eşleşmelerini bulur ve eşleşen dizeleri içeren bir dizi döndürür.

```
console.log("Banana".match(/an/g));
// → ["an", "an"]
```

Dolayısıyla, global düzenli ifadelerle dikkatli olun. Bunların gerekli olduğu durumlar - `replace` çağrıları ve açıkça `lastIndex`'i kullanmak istediğiniz yerler- genellikle bunları kullanmak istediğiniz tek yerlerdir.

### Tüm eşleşmeleri alma

{{index "lastIndex property", "exec method", loop}}

Bir dizedeki bir düzenli ifadenin tüm eşleşmelerini bulmanın yaygın bir kullanımı vardır. Bunu `matchAll` metodunu kullanarak yapabiliriz.

```
let input = "A string with 3 numbers in it... 42 and 88.";
let matches = input.matchAll(/\d+/g);
for (let match of matches) {
  console.log("Found", match[0], "at", match.index);
}
// → Found 3 at 14
//   Found 42 at 33
//   Found 88 at 40
```

{{index ["regular expression", global]}}

Bu metod, bir dizi eşleşme dizisi döndürür. Verilen düzenli ifadenin _mutlaka_ `g` seçeneği etkinleştirilmiş olmalıdır.

{{id ini}}
## Bir INI dosyasını ayrıştırma(parse etme)

{{index comment, "file format", "enemies example", "INI file"}}

Bölümü sonlandırmak için, ((düzenli ifade))lere ihtiyaç duyulan bir soruna bakacağız. Düşmanlarımız hakkında ((internet))ten bilgi toplamak için bir program yazdığımızı hayal edin. (Burada aslında bu programı yazmayacağız, sadece ((konfigürasyon)) dosyasını okuyan kısmı yazacağız. Maalesef.) Konfigürasyon dosyası şöyle görünüyor:

```{lang: "null"}
searchengine=https://duckduckgo.com/?q=$1
spitefulness=9.7

; comments are preceded by a semicolon...
; each section concerns an individual enemy
[larry]
fullname=Larry Doe
type=kindergarten bully
website=http://www.geocities.com/CapeCanaveral/11451

[davaeorn]
fullname=Davaeorn
type=evil wizard
outputdir=/home/marijn/enemies/davaeorn
```

{{index grammar}}

Bu biçim için kesin kurallar (genellikle _INI_ dosyası olarak adlandırılan yaygın bir biçimdir) şunlardır:

- Boş satırlar ve noktalı virgül ile başlayan satırlar yoksayılır.

- [ ve ] içinde sarmalanan satırlar yeni bir ((bölüm)) başlatır.

- Alfasayısal bir tanımlayıcıyı takiben bir `=` karakter içeren satırlar, mevcut bölüme bir ayar ekler.

- Bunlardan başka her şey geçersizdir.

Görevimiz, böyle bir dizeyi, ilk bölüm başlığından önce yazılan ayarları tutan özelliklere sahip nesneye ve bölümleri tutan alt nesnelerleri barındıran bir nesneye dönüştürmektir.

{{index "carriage return", "line break", "newline character"}}

Biçimin ((satır)) satır işlenmesini gerektirdiğinden, dosyayı ayrı satırlara ayırmak iyi bir başlangıçtır. `split` metodunu [bölüm ?](data#split) içinde gördük. Ancak, bazı işletim sistemleri, sadece bir yeni satır karakterini değil, bir taşıma dönüş karakteri ve ardından bir yeni satır karakteri (`"\r\n"`) kullanır. `split` metodunun da bir düzenli ifadeyi argüman olarak almasına izin verildiğinden, `/\r?\n/` gibi bir düzenli ifade kullanarak, satırlar arasında hem `"\n"` hem de `"\r\n"` izin veren bir şekilde bölebiliriz.

```{startCode: true}
function parseINI(string) {
  // Start with an object to hold the top-level fields
  let result = {};
  let section = result;
  for (let line of string.split(/\r?\n/)) {
    let match;
    if (match = line.match(/^(\w+)=(.*)$/)) {
      section[match[1]] = match[2];
    } else if (match = line.match(/^\[(.*)\]$/)) {
      section = result[match[1]] = {};
    } else if (!/^\s*(;|$)/.test(line)) {
      throw new Error("Line '" + line + "' is not valid.");
    }
  };
  return result;
}

console.log(parseINI(`
name=Vasilis
[address]
city=Tessaloniki`));
// → {name: "Vasilis", address: {city: "Tessaloniki"}}
```

{{index "parseINI function", parsing}}

Kod, dosyanın satırlarını geçer ve bir nesne oluşturur. Üstteki özellikler doğrudan bu nesneye depolanırken, bölümlerde bulunan özellikler ayrı bir bölüm nesnesine depolanır. `section` bağlantısı, mevcut bölüm için olan nesneye işaret eder.

İki tür önemli satır vardır - bölüm başlıkları veya özellik satırları. Bir satır normal bir özellik olduğunda, mevcut bölüme depolanır. Bir bölüm başlığı olduğunda, yeni bir bölüm nesnesi oluşturulur ve `section` bunua işaret etmesi için ayarlanır.

{{index "caret character", "dollar sign", boundary}}

`^` ve `$` işaretinin ifadenin sadece bir parçası değil, tüm satırı eşleştirmesini sağlamak için tekrar tekrar kullanılmasına dikkat edin. Bunları bırakmak, çoğunlukla işe yarayan ancak bazı girdiler için garip davranan bir kod sonucu ile sonuçlanır, bu da takip edilmesi zor bir hatadır.

{{index "if keyword", assignment, ["= operator", "as expression"]}}

`if (match = string.match(...))` kalıbı, bir ((atama)) ifadesinin (`=`) değerinin atanmış değer olduğu gerçeğinden yararlanır. `match` çağrınızın başarılı olacağından emin olamazsınız, bu yüzden sonucu yalnızca bunu test eden bir `if` ifadesi içinde erişebilirsiniz. `else if` zincirini bozmamak için, eşleşmenin sonucunu bir bağlantıya atar ve hemen bu atamayı `if` ifadesi için test olarak kullanırız.

{{index [parentheses, "in regular expressions"]}}

Bir satır eğer bir bölüm başlığı veya bir özellik değilse, fonksiyon, `/^\s*(;|$)/` ifadesini kullanarak satırın bir yorum veya boş bir satır olup olmadığını kontrol eder. Bir satırın beklenen biçimlerden hiçbirine uymadığı durumda, fonksiyon bir istisna fırlatır.

## Kod birimleri ve karakterler

JavaScript düzenli ifadelerinde standartlaştırılmış başka bir tasarım hatası da, [bölüm ?](higher_order#code_units) içinde tartışıldığı gibi varsayılan olarak `.` veya `?` gibi operatörlerin gerçek karakterler yerine kod birimleri üzerinde çalışmasıdır. Bu, iki kod biriminden oluşan karakterlerin garip davranmasına neden olur.

```
console.log(/🍎{3}/.test("🍎🍎🍎"));
// → false
console.log(/<.>/.test("<🌹>"));
// → false
console.log(/<.>/u.test("<🌹>"));
// → true
```

Sorun, birinci satırdaki 🍎 karakterinin iki kod biriminden oluştuğu şekilde işlenmesidir ve `{3}` kısmının yalnızca ikincisi üzerinde uygulanmasıdır. Benzer şekilde, nokta tek bir kod birimini eşleştirir, gül ((emoji))'sini oluşturan ikiyi değil.

Bu tür karakterleri uygun bir şekilde işlemesi için düzenli ifadenize `u` (Unicode) seçeneğini eklemeniz gerekir.

```
console.log(/🍎{3}/u.test("🍎🍎🍎"));
// → true
```

{{id summary_regexp}}

## Summary

Regular expressions are objects that represent patterns in strings. They use their own language to express these patterns.

{{table {cols: [1, 5]}}}

| `/abc/`     | A sequence of characters
| `/[abc]/`   | Any character from a set of characters
| `/[^abc]/`  | Any character _not_ in a set of characters
| `/[0-9]/`   | Any character in a range of characters
| `/x+/`      | One or more occurrences of the pattern `x`
| `/x+?/`     | One or more occurrences, nongreedy
| `/x*/`      | Zero or more occurrences
| `/x?/`      | Zero or one occurrence
| `/x{2,4}/`  | Two to four occurrences
| `/(abc)/`   | A group
| `/a|b|c/`   | Any one of several patterns
| `/\d/`      | Any digit character
| `/\w/`      | An alphanumeric character ("word character")
| `/\s/`      | Any whitespace character
| `/./`       | Any character except newlines
| `/\p{L}/u`  | Any letter character
| `/^/`       | Start of input
| `/$/`       | End of input
| `/(?=a)/`   | A look-ahead test

A regular expression has a method `test` to test whether a given string matches it. It also has a method `exec` that, when a match is found, returns an array containing all matched groups. Such an array has an `index` property that indicates where the match started.

Strings have a `match` method to match them against a regular expression and a `search` method to search for one, returning only the starting position of the match. Their `replace` method can replace matches of a pattern with a replacement string or function.

Regular expressions can have options, which are written after the closing slash. The `i` option makes the match case insensitive. The `g` option makes the expression _global_, which, among other things, causes the `replace` method to replace all instances instead of just the first. The `y` option makes it sticky, which means that it will not search ahead and skip part of the string when looking for a match. The `u` option turns on Unicode mode, which enables `\p` syntax and fixes a number of problems around the handling of characters that take up two code units.

Regular expressions are a sharp ((tool)) with an awkward handle. They simplify some tasks tremendously but can quickly become unmanageable when applied to complex problems. Part of knowing how to use them is resisting the urge to try to shoehorn things that they cannot cleanly express into them.

## Exercises

{{index debugging, bug}}

It is almost unavoidable that, in the course of working on these exercises, you will get confused and frustrated by some regular expression's inexplicable ((behavior)). Sometimes it helps to enter your expression into an online tool like [_debuggex.com_](https://www.debuggex.com/) to see whether its visualization corresponds to what you intended and to ((experiment)) with the way it responds to various input strings.

### Regexp golf

{{index "program size", "code golf", "regexp golf (exercise)"}}

_Code golf_ is a term used for the game of trying to express a particular program in as few characters as possible. Similarly, _regexp golf_ is the practice of writing as tiny a regular expression as possible to match a given pattern, and _only_ that pattern.

{{index boundary, matching}}

For each of the following items, write a ((regular expression)) to test whether the given pattern occurs in a string. The regular expression should match only strings containing the pattern. When your expression works, see whether you can make it any smaller.

 1. _car_ and _cat_
 2. _pop_ and _prop_
 3. _ferret_, _ferry_, and _ferrari_
 4. Any word ending in _ious_
 5. A whitespace character followed by a period, comma, colon, or semicolon
 6. A word longer than six letters
 7. A word without the letter _e_ (or _E_)

Refer to the table in the [chapter summary](regexp#summary_regexp) for help. Test each solution with a few test strings.

{{if interactive
```
// Fill in the regular expressions

verify(/.../,
       ["my car", "bad cats"],
       ["camper", "high art"]);

verify(/.../,
       ["pop culture", "mad props"],
       ["plop", "prrrop"]);

verify(/.../,
       ["ferret", "ferry", "ferrari"],
       ["ferrum", "transfer A"]);

verify(/.../,
       ["how delicious", "spacious room"],
       ["ruinous", "consciousness"]);

verify(/.../,
       ["bad punctuation ."],
       ["escape the period"]);

verify(/.../,
       ["Siebentausenddreihundertzweiundzwanzig"],
       ["no", "three small words"]);

verify(/.../,
       ["red platypus", "wobbling nest"],
       ["earth bed", "bedrøvet abe", "BEET"]);


function verify(regexp, yes, no) {
  // Ignore unfinished exercises
  if (regexp.source == "...") return;
  for (let str of yes) if (!regexp.test(str)) {
    console.log(`Failure to match '${str}'`);
  }
  for (let str of no) if (regexp.test(str)) {
    console.log(`Unexpected match for '${str}'`);
  }
}
```

if}}

### Quoting style

{{index "quoting style (exercise)", "single-quote character", "double-quote character"}}

Imagine you have written a story and used single ((quotation mark))s throughout to mark pieces of dialogue. Now you want to replace all the dialogue quotes with double quotes, while keeping the single quotes used in contractions like _aren't_.

{{index "replace method"}}

Think of a pattern that distinguishes these two kinds of quote usage and craft a call to the `replace` method that does the proper replacement.

{{if interactive
```{test: no}
let text = "'I'm the cook,' he said, 'it's my job.'";
// Change this call.
console.log(text.replace(/A/g, "B"));
// → "I'm the cook," he said, "it's my job."
```
if}}

{{hint

{{index "quoting style (exercise)", boundary}}

The most obvious solution is to replace only quotes with a nonletter character on at least one side—something like `/\P{L}'|'\P{L}/`. But you also have to take the start and end of the line into account.

{{index grouping, "replace method", [parentheses, "in regular expressions"]}}

In addition, you must ensure that the replacement also includes the characters that were matched by the `\P{L}` pattern so that those are not dropped. This can be done by wrapping them in parentheses and including their groups in the replacement string (`$1`, `$2`). Groups that are not matched will be replaced by nothing.

hint}}

### Numbers again

{{index sign, "fractional number", [syntax, number], minus, "plus character", exponent, "scientific notation", "period character"}}

Write an expression that matches only JavaScript-style ((number))s. It must support an optional minus _or_ plus sign in front of the number, the decimal dot, and exponent notation—`5e-3` or `1E10`—again with an optional sign in front of the exponent. Also note that it is not necessary for there to be digits in front of or after the dot, but the number cannot be a dot alone. That is, `.5` and `5.` are valid JavaScript numbers, but a lone dot _isn't_.

{{if interactive
```{test: no}
// Fill in this regular expression.
let number = /^...$/;

// Tests:
for (let str of ["1", "-1", "+15", "1.55", ".5", "5.",
                 "1.3e2", "1E-4", "1e+12"]) {
  if (!number.test(str)) {
    console.log(`Failed to match '${str}'`);
  }
}
for (let str of ["1a", "+-1", "1.2.3", "1+1", "1e4.5",
                 ".5.", "1f5", "."]) {
  if (number.test(str)) {
    console.log(`Incorrectly accepted '${str}'`);
  }
}
```

if}}

{{hint

{{index ["regular expression", escaping], ["backslash character", "in regular expressions"]}}

First, do not forget the backslash in front of the period.

Matching the optional ((sign)) in front of the ((number)), as well as in front of the ((exponent)), can be done with `[+\-]?` or `(\+|-|)` (plus, minus, or nothing).

{{index "pipe character"}}

The more complicated part of the exercise is the problem of matching both `"5."` and `".5"` without also matching `"."`. For this, a good solution is to use the `|` operator to separate the two cases—either one or more digits optionally followed by a dot and zero or more digits _or_ a dot followed by one or more digits.

{{index exponent, "case sensitivity", ["regular expression", flags]}}

Finally, to make the _e_ case insensitive, either add an `i` option to the regular expression or use `[eE]`.

hint}}
