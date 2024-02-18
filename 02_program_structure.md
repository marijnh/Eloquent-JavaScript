# Program Yapısı

{{quote {author: "_why", title: "Why's (Poignant) Guide to Ruby", chapter: true}

Ve kalbim, bulanık, saydam cildimin altında parlak kırmızı yanarken beni geri getirmek için 10cc JavaScript uygulamak zorunda kalırlar. (Kandaki toksinlere iyi tepki veririm.) Vay be, o madde doğrudan soluğu keser!

quote}}

{{index why, "Poignant Guide"}}

{{figure {url: "img/chapter_picture_2.jpg", alt: "Illustration showing a number of tentacles holding chess pieces", chapter: framed}}}

Bu bölümde, gerçek anlamda _programlama_ olarak adlandırılabilecek şeyler yapmaya başlayacağız. Şimdiye kadar gördüğümüz isimler ve cümle parçaları ötesinde JavaScript dilini anlamamızı sağlayacağız, böylece anlamlı bir yazılar ifade edebileceğiz.

## İfade ve beyanlar

{{index grammar, [syntax, expression], [code, "structure of"], grammar, [JavaScript, syntax]}}

[?](values) Bölümünde, değerler oluşturduk ve bunlara operatörler uygulayarak yeni değerler elde ettik. Bu şekilde değer oluşturmak, herhangi bir JavaScript programının ana maddesidir. Ancak bu maddenin faydalı olabilmesi için daha büyük bir yapı içerisinde çerçevelenmelidir. İşte bu bölümde ele alacağımız şey budur.

{{index "literal expression", [parentheses, expression]}}

Bir değer üreten kod parçasına _((ifade))_ denir. Yazılmış olan her değer (örneğin `22` veya `"psikanaliz"`) bir ifadedir. Parantezler arasındaki bir ifade de bir ifade olarak kabul edilir, iki ifadeye uygulanan ((ikili operatör)) veya bir ifadeye uygulanan ((tekli operatör)) de ifadedir.

{{index [nesting, "of expressions"], "human language"}}

Bu, dil tabanlı bir arabirimin güzelliğinin bir kısmını gösterir. İfadeler, insan dillerindeki yan cümlelerin iç içe geçmiş olduğu şekilde diğer ifadeleri içerebilir - bir yan cümle kendi yan cümlelerini içerebilir ve böyle devam eder. Bu, istediğimiz şekilde karmaşık hesaplamaları tanımlayan ifadeler oluşturmamıza izin verir.

{{index statement, semicolon, program}}

Bir JavaScript ifadesi bir cümle parçasına karşılık geliyorsa, bir JavaScript beyanı tam bir cümleye karşılık gelir. Bir program, bir beyanlar listesidir.

{{index [syntax, statement]}}

En basit türde bir beyan, ardından bir noktalı virgül bulunan bir ifadedir. Bu bir programdır:

```
1;
!false;
```

Ancak bu işe yaramaz bir programdır. Bir ((ifade)), sadece bir değer üretmekle yetinebilir, ardından bu değer çevreleyen kod tarafından kullanılabilir. Ancak, bir ((beyan)) kendi başına durur, bu nedenle dünyayı etkilemiyorsa, işe yaramazdır. `console.log` ile olduğu gibi ekranın bir şeyler görüntülemesi veya makinenin durumunu bunlar ardından gelen beyanları etkileyecek şekilde değiştirmesi de olabilir. Bu değişikliklere _((yan etki))_ denir. Önceki örnekteki deyimler sadece `1` ve `true` değerlerini üretir ve hemen sonra onları yok eder. Bu, dünyada hiçbir iz bırakmaz. Bu programı çalıştırdığınızda, gözlemlenebilir hiçbir şey olmaz.

{{index "programming style", "automatic semicolon insertion", semicolon}}

Bazı durumlarda, JavaScript bir beyanın sonundaki noktalı virgülü atlayabilmenize izin verir ancak bazı durumlarda, orada olmalıdır çünkü aksi takdirde bir sonraki ((satır)), aynı beyanın bir parçası olarak işlenebilir. Ne zaman güvenle atlanabileceğine dair kurallar biraz karmaşıktır ve hata yapmaya müsaittir. Bu yüzden bu kitapta, noktalı virgül gerektiren her beyan her zaman bir noktalı virgül ile bitecek. En azından noktalı virgüllerin eksikliği hakkındaki incelikleri daha fazla öğrenene kadar aynısını yapmanızı öneririm.

## Bağlantılar

{{indexsee variable, binding}}
{{index [syntax, statement], [binding, definition], "side effect", [memory, organization], [state, in binding]}}

Bir program nasıl içsel bir durum tutar? Nasıl şeyleri hatırlar? Eski değerlerden yeni değerler üretmeyi gördük, ancak bu eski değerleri değiştirmez ve yeni değer hemen kullanılmalıdır, aksi takdirde tekrar kaybolur. Değerleri yakalamak ve tutmak için JavaScript, bir _bağlantı_ veya _değişken_ adı verilen bir şey sağlar:

```
let caught = 5 * 5;
```

{{index "let keyword"}}

Bu bize bir ikinci tür ((beyan)) verir. Özel bir kelime (((anahtar kelime))) olan `let`, bu cümlenin bir bağlantıyı tanımlayacağını gösterir. Ondan hemen sonra bağlantının adı ve eğer hemen bağlantı tanımlama sırasınfa bir değer vermek istiyorsak, bir `=` operatörü ve bir ifade bulunur.

Örnekte, `caught` adında bir bağlantı oluşturulur ve 5'in 5 ile çarpılmasıyla üretilen sayıyı tutmak için kullanılır.

Bir bağlantı tanımlanıp oluşturulduktan sonra, adı bir ((ifade)) olarak kullanılabilir. Böyle bir ifadenin değeri, bağlantının o anda tuttuğu değerdir. İşte bir örnek:

```
let ten = 10;
console.log(ten * ten);
// → 100
```

{{index "= operator", assignment, [binding, assignment]}}

Bir bağlantı bir değere işaret ettiğinde, bu onun sonsuza dek o değere bağlı olduğu anlamına gelmez. Mevcut bağlantılar üzerinde istendiğinde `=` operatörü kullanılarak bunları mevcut değerlerinden ayırabilir ve onları yeni bir değere işaret etmesini sağlayabilirsiniz:

```
let mood = "light";
console.log(mood);
// → light
mood = "dark";
console.log(mood);
// → dark
```

{{index [binding, "model of"], "tentacle (analogy)"}}

Bağlantıları kutular yerine bir ahtapotun dokunaçları olarak hayal etmelisiniz. Değerleri _içermezler_; onları _kavrarlar_ - iki bağlantı aynı değere atıfta bulunabilir. Bir program sadece hala bir referansı olan değerlere erişebilir. Bir şeyi hatırlamanız gerektiğinde, onu tutmak için bir ahtapot dokunaçı büyütür veya mevcut ahtapot dokunaçlarınızdan birini ona takarsınız.

Başka bir örneğe bakalım. Luigi'nin size hala borçlu olduğu dolar miktarını hatırlamak için bir bağlantı oluşturursunuz. 35 doları size geri ödediğinde, bu bağlantıya yeni bir değer verirsiniz:

```
let luigisDebt = 140;
luigisDebt = luigisDebt - 35;
console.log(luigisDebt);
// → 105
```

{{index undefined}}

Bir değer vermeden bir bağlantı tanımladığınızda, ahtapot dokungacının kavrayacağı hiçbir şey yoktur, bu yüzden boş havada biter. Boş bir bağlantının değerini isterseniz, `undefined` değerini alırsınız.

{{index "let keyword"}}

Tek bir `let` beyanı birden fazla bağlantı tanımlayabilir ancak her spesifik isime tanımlanan bağlantılar virgülle ayrılmalıdır:

```
let one = 1, two = 2;
console.log(one + two);
// → 3
```

`var` ve `const` kelimeleri de, `let` ile benzer bir şekilde belirli isimlere bağlantı oluşturmak için kullanılabilir:

```
var name = "Ayda";
const greeting = "Hello ";
console.log(greeting + name);
// → Hello Ayda
```

{{index "var keyword"}}

The first of these, `var` (short for "variable"), is the way bindings were declared in pre-2015 JavaScript, when `let` didn't exist yet. I'll get back to the precise way it differs from `let` in the [next chapter](functions). For now, remember that it mostly does the same thing, but we'll rarely use it in this book because it behaves oddly in some situations.
Bunlardan ilki, `var` (kısaltma olarak "variable" - değişken anlamına gelir), 2015 öncesi JavaScript'te bağlantıların nasıl bildirildiğidir, o zamanlarda `let` henüz mevcut değildi. [Sonraki bölümde](functions) `var` bağlantılarının `let` bağlantılarından nasıl farklılık gösterdiğine dair ayrıntılı bilgilere göstereceğim ancak şimdilik, çoğunlukla aynı işi yaptığını hatırlayın. Bu kitapta `var` bağlantılarını nadiren kullanacağız çünkü bazı durumlarda garip davranışları bulunmakta.

{{index "const keyword", naming}}

`const` kelimesi _((constant))_ için kullanılır. Bu, yaşadığı sürece aynı değere işaret eden sabit bir bağlantı tanımlar. Bu, bir değere ad veren ve daha sonra kolayca başvurabileceğiniz bağlantılar için kullanışlıdır.

## Bağlantı isimleri

{{index "underscore character", "dollar sign", [binding, naming]}}

Bağlantı adları bir veya daha fazla harf dizisi olabilir. Rakamlar bağlantı adlarının bir parçası olabilir - örneğin, `catch22` geçerli bir addır - ancak ad bir rakamla başlamamalıdır. Bir bağlantı adı, dolar işaretleri (`$`) veya alt çizgiler (`_`) içerebilir, ancak başka noktalama işaretleri veya özel karakterler içeremez.

{{index [syntax, identifier], "implements (reserved word)", "interface (reserved word)", "package (reserved word)", "private (reserved word)", "protected (reserved word)", "public (reserved word)", "static (reserved word)", "void operator", "yield (reserved word)", "enum (reserved word)", "reserved word", [binding, naming]}}

`let` gibi özel anlamlı kelimeler _((anahtar kelimeler))_ olarak adlandırılır ve bağlantı adları olarak kullanılamazlar. Ayrıca, bağlantı adları olarak kullanılamayan ((gelecek)) JavaScript sürümlerinde "kullanım için saklanmış" birkaç kelime daha vardır. Tüm anahtar kelimelerin ve saklanmış kelimelerin tam listesi oldukça uzundur:

```{lang: "null"}
break case catch class const continue debugger default
delete do else enum export extends false finally for
function if implements import interface in instanceof let
new package private protected public return static super
switch this throw true try typeof var void while with yield
```

{{index [syntax, error]}}

Merak etmeyin, bu listeyi ezberlemenize gerek yok. Bir bağlantı oluştururken beklenmeyen bir sözdizimi hatası oluşturursanız, kullanmaya çalıştığınızın bir saklanmış kelime olup olmadığını kontrol edin.

## Çevre

{{index "standard environment", [browser, environment]}}

Belirli bir zamanda var olan bağlantılar ve bu bağlantıların işaret ettiği değerler topluluğuna _((çevre))_ denir. Bir program başladığında, bu ortam artık boş değildir. Her zaman programlama dilinin bir parçası olan ((standart)) bağlantıları içerir ve çoğu zaman, çevrenin içinde bulunduğu çevre sistemle etkileşim sağlayan bağlantıları da içerir. Örneğin, bir web tarayıcısında, şu anda yüklenmiş web sitesi ile etkileşimde bulunmak ve ((mouse)) ve ((keyboard)) girişini okumak için işlevler vardır.

## Fonksiyonlar

{{indexsee "application (of functions)", [function, application]}}
{{indexsee "invoking (of functions)", [function, application]}}
{{indexsee "calling (of functions)", [function, application]}}
{{index output, function, [function, application], [browser, environment]}}

Ortamda sağlanan varsayılan değerlerin çoğu _((fonksiyon))_ türündedir. Bir fonksiyon, bir değerle sarılmış bir program parçasıdır. Bu tür değerler, sarılmış programı çalıştırmak için _çalıştırılabilir_. Örneğin, bir web tarayıcı ortamında, `prompt` bağlantısı, kullanıcı girişi isteyen küçük bir ((diyalog kutusu)) gösteren bir işleve işaret eder. Bunu şu şekilde kullanırız:

```
prompt("Enter passcode");
```

{{figure {url: "img/prompt.png", alt: "A prompt dialog that says 'enter passcode'", width: "8cm"}}}

{{index parameter, [function, application], [parentheses, arguments]}}

Bir fonksiyonu çalıştırmak, onu _çağırmak_ veya _uygulamak_ veya _uygulamak_ olarak adlandırılır. Bir fonksiyonu değeri üreten bir ifadeye parantez ekleyerek bir fonksiyonu çağırabilirsiniz. Bunun için, genellikle fonksiyonu tutan bağlantının adını doğrudan kullanırsınız. Fonksiyonu çağırırkenki kullandığınız parantezler arasında verdiğiniz değerler _((argümanlar))_ olarak adlandırılır. Farklı fonksiyonların farklı sayıda veya farklı türde argümanlara ihtiyacı olabilir.

`prompt` fonksiyonu, modern web programlamasında pek kullanılmaz, çoğunlukla sonuç olarak oluşan iletişim kutusunun görünümü üzerinde kontrol sahibi olmadığınızdan dolayı, ancak oyuncak programlar ve deneylerde faydalı olabilir.

## console.log fonksiyonu

{{index "JavaScript console", "developer tools", "Node.js", "console.log", output, [browser, environment]}}

Örneklerde, değerleri çıktı olarak göstermek için `console.log` kullandım. Tüm modern web tarayıcıları ve Node.js dahil olmak üzere çoğu JavaScript sistemleri, argüman olarak verilen metinleri çıkış ortamına yazan bir `console.log` fonksiyonunu size sağlar. Tarayıcılarda yazılan bu çıktı, ((JavaScript konsolu))nda yer alır. Bu bölüm, varsayılan olarak gizlidir, ancak çoğu tarayıcı, genelde F12'ye veya bir Mac'te [command]{keyname}-[option]{keyname}-I tuşlarına bastığınızda açar. Bu çalışmazsa, Geliştirici Araçlar veya buna benzer bir öğe arayarak menüler arasında gezinin.

{{if interactive

When running the examples (or your own code) on the pages of this book, `console.log` output will be shown after the example, instead of in the browser's JavaScript console.
Bu kitabın sayfalarında örnekleri (veya kendi kodlarınızı) çalıştırırken, `console.log` çıktısı, tarayıcının JavaScript konsolu yerine, örneğin altında gösterilir.

```
let x = 30;
console.log("the value of x is", x);
// → the value of x is 30
```

if}}

{{index [object, property], [property, access]}}

Bağlama isimleri ((nokta karakteri)) içeremez, ancak `console.log`'ta bir tane vardır. Bu, `console.log`'un basit bir bağlantı olmadığı, ancak `console` bağlantısında tutulan değerden `log` özelliği alınan bir ifade olduğu içindir. Bunun ne anlama geldiğini [Bölüm ?](data#properties)'da öğreneceğiz.

{{id return_values}}
## Döndürülen değerler

{{index [comparison, "of numbers"], "return value", "Math.max function", maximum}}

Bir iletişim kutusu göstermek veya ekrana metin yazmak, bir _((yan etki))_dir. Birçok fonksiyon, ürettikleri yan etkiler nedeniyle yararlıdır. Fonksiyonlar ayrıca değerler üretebilir, bu durumda yararlı olmak için bir yan etkiye ihtiyaçları yoktur. Örneğin, `Math.max` fonksiyonu, herhangi bir miktarda sayı argümanları alır ve bu verilen sayı argümanlar arasından en büyük olanını geri verir:

```
console.log(Math.max(2, 4));
// → 4
```

{{index [function, application], minimum, "Math.min function"}}

Bir fonksiyon bir değer ürettiğinde, o değeri _döndürdüğü_ söylenir. Bir değer üreten her şey, JavaScript'te bir ((ifade)) olduğundan, fonksiyon çağrıları daha büyük ifadelerin içinde kullanılabilir. Aşağıdaki kodda, Math.max'in tam tersi olan Math.min bir artı ifadesinin parçası olarak kullanılmıştır:

```
console.log(Math.min(2, 4) + 100);
// → 102
```

[Bölüm ?](functions), kendi fonksiyonlarınızı nasıl yazacağınızı açıklayacaktır.

## Kontrol akışı

{{index "execution order", program, "control flow"}}

Programınız birden fazla ((beyan)) içeriyorsa, beyanlar, bir hikaye gibi, üstten alta doğru çalıştırılır. Örneğin, aşağıdaki programda iki ifade bulunmaktadır. İlk olarak, kullanıcıdan bir sayı istenir ve ilk ifadenin ardından yürütülen ikinci beyan o sayının ((kare))sini gösterir:

```
let theNumber = Number(prompt("Pick a number"));
console.log("Your number is the square root of " +
            theNumber * theNumber);
```

{{index [number, "conversion to"], "type coercion", "Number function", "String function", "Boolean function", [Boolean, "conversion to"]}}

Number fonksiyonu, bir değeri bir sayıya dönüştürür. Bu dönüşüme ihtiyacımız var çünkü `prompt`'un sonucu bir dize değeri ve biz bir sayı istiyoruz. Benzer şekilde, bu türlerdeki değerleri dönüştüren `String` ve `Boolean` adında diğer fonksiyonlar da bulunmaktadır.

İşte oldukça basit doğrusal kontrol akışının şematik temsili:

{{figure {url: "img/controlflow-straight.svg", alt: "Diagram showing a straight arrow", width: "4cm"}}}

## Koşullu çalıştırma

{{index Boolean, ["control flow", conditional]}}

Tüm programlar düz yollar değildir. Örneğin, elimizdeki ana yoldan sapan başka yollar oluşturmak isteyebilir ve programımızın belirli durumlarda bu yollardan gitmesini sağlayabiliriz. Buna _((koşullu çalıştırma))_ denir.

{{figure {url: "img/controlflow-if.svg", alt: "Diagram of an arrow that splits in two, and then rejoins again",width: "4cm"}}}

{{index [syntax, statement], "Number function", "if keyword"}}

Koşullu çalıştırma, JavaScript'te `if` anahtar kelimesiyle oluşturulur. Basit bir durumda, belirli bir koşulun geçerli olduğu durumda yalnızca bazı kodların yürütülmesini istiyoruz. Örneğin, yalnızca girdinin gerçekten bir sayı olduğu durumda karesini göstermek isteyebiliriz:

```{test: wrap}
let theNumber = Number(prompt("Pick a number"));
if (!Number.isNaN(theNumber)) {
  console.log("Your number is the square root of " +
              theNumber * theNumber);
}
```

Bu değişiklikle, girdi olarak programa `"parrot"` dize değerini verirseniz, hiçbir çıktı gösterilmez.

{{index [parentheses, statement]}}

`if` anahtar kelimesi, bir Boolean ifadesinin değerine bağlı olarak bir beyanı yürütür veya atlar. Karar vermek için kullanılan ifade anahtar kelimenin ardından, parantezler arasına, ardından da yürütülecek beyan veya beyanlar yazılır.

{{index "Number.isNaN function"}}

`Number.isNaN` işlevi, yalnızca ona verilen argüman `NaN` ise `true` değerini döndüren standart bir JavaScript fonksiyonudur. `Number` işlevi, geçerli bir sayıyı temsil etmeyen bir dize argüman olarak verildiğinde `NaN` değerini döndürür. Bu nedenle, koşul "eğer `theNumber` bir sayıysa, bunu yap" şeklinde çevrilir.

{{index grouping, "{} (block)", [braces, "block"]}}

`if`'den sonraki ifade bu örnekte süslü parantezlerle (`{` ve `}`) sarılmıştır. Süslü parantezler, herhangi bir sayıda beyanı tek bir beyana, yani bir _((blok))_'a gruplamak için kullanılabilir. Bu durumda onları kullanmayabilirdiniz çünkü yalnızca tek bir satır beyan içibde bulundurmaktalar, ancak ihtiyaç duyulup duyulmadığı konusunda düşünmekten kaçınmak için çoğu JavaScript programcısı bunları bu şekilde yine de sarar. Bu kitapta çoğunlukla bu kurala uymaya devam edeceğiz, tek satırlık ifadeler hariç.

```
if (1 + 1 == 2) console.log("It's true");
// → It's true
```

{{index "else keyword"}}

Genellikle sadece bir koşul doğru olduğunda yürütülen kodunuz olmayacak, aynı zamanda doğru olmayan diğer durumu da ele alan kodunuz olacak. Bu alternatif yol, şemadaki ikinci okla temsil edilmiştir. İki ayrı, alternatif çalıştırma yolu oluşturmak için `else` anahtar kelimesini, `if` ile birlikte kullanabilirsiniz:

```{test: wrap}
let theNumber = Number(prompt("Pick a number"));
if (!Number.isNaN(theNumber)) {
  console.log("Your number is the square root of " +
              theNumber * theNumber);
} else {
  console.log("Hey. Why didn't you give me a number?");
}
```

{{index ["if keyword", chaining]}}

Birden fazla seçenekli yolu varsa, birden çok `if`/`else` çiftini birbirine "zincirleyebilirsiniz". İşte bir örnek:

```
let num = Number(prompt("Pick a number"));

if (num < 10) {
  console.log("Small");
} else if (num < 100) {
  console.log("Medium");
} else {
  console.log("Large");
}
```

Program önce `num`'un 10'dan küçük olup olmadığını kontrol edecek. Eğer öyleyse, o dalı seçer, `"Small"` dize değerini gösterir ve biter. Eğer değilse, `else` dalını alır, ki bu da kendi içinde ikinci bir `if` içerir. İkinci koşul `(< 100)` geçerliyse, bu, sayının en az 10 ancak 100'den küçük olduğu anlamına gelir ve `"Medium"` dize değeri gösterilir. Eğer geçerli değilse, ikinci ve son `else` dalı seçilir, `"Large"` dize değeri gösterilir.

Bu program için şema şöyle görünebilir:

{{figure {url: "img/controlflow-nested-if.svg", alt: "Diagram showing arrow that splits in two, with on the branches splitting again, before all branches rejoin again", width: "4cm"}}}

{{id loops}}
## while ve do döngüleri

0 ile 12 arasındaki tüm ((çift sayı))ları çıkaran bir programı düşünün. Bunu yazmanın bir yolu şu şekildedir:

```
console.log(0);
console.log(2);
console.log(4);
console.log(6);
console.log(8);
console.log(10);
console.log(12);
```

{{index ["control flow", loop]}}

Bu çalışır, ancak bir program yazmanın fikri daha _az_ iş yapmaktır, daha fazla iş yapmak değil. Eğer 1.000'den küçük tüm çift sayılara ihtiyacımız olsaydı, bu yaklaşım işe yaramaz olurdu. İhtiyacımız olan şey, bir kod parçasını birden çok kez çalıştıracak bir yol. Bu kontrol akış biçimi bir ((döngü/loop)) olarak adlandırılır.

{{figure {url: "img/controlflow-loop.svg", alt: "Diagram showing an arrow to a point which has a cyclic arrow going back to itself and another arrow going further", width: "4cm"}}}

{{index [syntax, statement], "counter variable"}}

Döngü kontrol akışı, programın daha önce bulunduğumuz bir noktaya geri dönmesine ve mevcut program durumu ile tekrar etmesine izin verir. Bunu sayabilen bir bağlantı ile birleştirirsek, şunu yapabiliriz:

```
let number = 0;
while (number <= 12) {
  console.log(number);
  number = number + 2;
}
// → 0
// → 2
//   … etcetera
```

{{index "while loop", Boolean, [parentheses, statement]}}

`while` anahtar kelimesiyle başlayan bir ((beyan)), bir döngü oluşturur. `while` kelimesinin ardından parantez içinde bir ((ifade)) ve ardından bir beyan, sanki `if` gibi bir şekilde yazılır. Döngü, verilen ifade Boolean'a dönüştürüldüğünde `true` değerini ürettiği sürece, o beyanı tekrar eder.

{{index [state, in binding], [binding, as state]}}

`number` adlı bağlantı, bir programın ilerlemesini bir bağlantı aracılığıyla izlemenin bir yolunu gösterir. Her döngü tekrarı tekrarlandığında, `number` adlı bağlantı önceki değerinden 2 fazla bir değer alır. Her tekrarın başlangıcında, programın işinin bitip bitmediğini anlaması için 12 sayısı ile karşılaştırılır.

{{index exponentiation}}

Bu sefer herhangi bir işe yarayan bir örnek olarak, artık 2^10^ (2'nin 10. kuvvetinin) değerini hesaplayan ve gösteren bir program yazabiliriz. İki bağlantıya ihtiyacımız var: sonucumuzu takip etmek için bir tane ve bu sonucu 2 ile kaç kez çarptığımızı saymak için bir tane. Döngü, ikinci bağlantının henüz 10 değerine ulaşıp ulaşmadığını test eder ve eğer ulaşmamışsa, her iki bağlantıyı da günceller.

```
let result = 1;
let counter = 0;
while (counter < 10) {
  result = result * 2;
  counter = counter + 1;
}
console.log(result);
// → 1024
```

The counter could also have started at `1` and checked for `<= 10`, but for reasons that will become apparent in [Chapter ?](data#array_indexing), it is a good idea to get used to counting from 0.
`counter` bağlantısı `1` ile başlayabilir ve `<= 10` için kontrol edebilirdi, ancak [Bölüm ?](data#array_indexing)'da anlatılacak sebeplerden ötürü, 0'dan saymayı alışkanlık haline getirmek iyi bir fikirdir.

{{index "** operator"}}

Unutmayın ki JavaScript'in de bir üs operatörü vardır (`2 ** 10`), bunu kodda hesaplamak için kullanabilirdiniz - ancak bu örneğin amacını bozardı.

{{index "loop body", "do loop", ["control flow", loop]}}

`do` döngüsü, `while` döngüsüne benzer bir kontrol yapısıdır. Tek farkı: bir `do` döngüsü daima gövdesini en az bir kez çalıştırır ve yalnızca bu ilk yürütmeden sonra durması gerekip gerekmediğini test eder. Bunu yansıtmak için test koşul ifadesi, döngünün gövdesinden sonra gelir:

```
let yourName;
do {
  yourName = prompt("Who are you?");
} while (!yourName);
console.log("Hello " + yourName);
```

{{index [Boolean, "conversion to"], "! operator"}}

Bu program, bir isim girmenizi zorlayacak. Girdi olarak boş olmayan bir dize alana kadar tekrar ve tekrar sormaya devam edecek. `!` operatörünü uygulamak, bir değeri Boolean türüne dönüştürdükten sonra bu değeri tersine çevirecektir ve buradaki `""` dışında tüm dizeler `true` değerine dönüşecektir. Bu, döngünün boş olmayan bir dize girdisi verilene kadar devam etmesi anlamına gelir.

## Kod girintileme

{{index [code, "structure of"], [whitespace, indentation], "programming style"}}

Örneklerde, bazı daha büyük ifadelerin bir parçası olan ifadelerin önüne boşluklar ekliyorum. Bu boşluklar gerekli değildir - bilgisayar bunlarsız da programı kabul eder. Aslında, JavaScript programlarında hatta ((yeni satır karakterleri)) bile opsiyoneldir. Eğer isterseniz, tüm programınızı uzun bir satır olarak da yazabilirsiniz.

Bu ((blok)) içindeki bu ((girinti))lerin rolü, kodun yapısını insan okuyucuların dikkatine varabilmesi içinde. Yeni blokların diğer blokların içinde açıldığı kodlarda, bir bloğun nerede bittiğini ve diğerinin nerede başladığını görmek zor olabilir. Uygun girinti kullanımıyla, bir programın görsel şekli, içindeki blokların şekline karşılık gelir. Ben her açık blok için iki boşluk kullanmayı tercih ediyorum, ancak zevkler değişir - bazı insanlar dört boşluk kullanırken, bazıları ((tab karakter))lerini kullanır. Önemli olan, her yeni bloğun aynı miktarda boşluk eklemesidir.

```
if (false != true) {
  console.log("That makes sense.");
  if (1 < 2) {
    console.log("No surprise there.");
  }
}
```

Çoğu kod ((düzenleyici)) programı[ (bu kitaptaki gibi)]{if interactive} yeni satırları otomatik olarak uygun miktarda girintileme yaparak size yardımcı olacaktır.

## for döngüleri

{{index [syntax, statement], "while loop", "counter variable"}}

Many loops follow the pattern shown in the `while` examples. First a "counter" binding is created to track the progress of the loop. Then comes a `while` loop, usually with a test expression that checks whether the counter has reached its end value. At the end of the loop body, the counter is updated to track progress.
Birçok döngü, `while` örneklerinde gösterilen deseni takip eder. İlk olarak, döngünün ilerlemesini takip etmek için bir `"counter"` bağlantısı oluşturulur. Ardından, genellikle `"counter"` bağlantısının hedef değerine ulaşıp ulaşmadığını kontrol eden bir test ifadesiyle birlikte bir `while` döngüsü gelir. Döngü gövdesinin sonunda, ilerlemeyi izlemek için `"counter"` bağlantısı güncellenir.

{{index "for loop", loop}}

Bu desen o kadar yaygındır ki, JavaScript ve benzer diller bunun için biraz daha kısa ve kapsamlı bir form sağlar, `for` döngüsü:

```
for (let number = 0; number <= 12; number = number + 2) {
  console.log(number);
}
// → 0
// → 2
//   … etcetera
```

{{index ["control flow", loop], state}}

This program is exactly equivalent to the [earlier](program_structure#loops) even-number-printing example. The only change is that all the ((statement))s that are related to the "state" of the loop are grouped together after `for`.
Bu program, daha [önceki](program_structure#loops) çift sayıları yazdırma örneğine tam olarak eşdeğerdir. Tek fark, döngünün "durumu" ile ilgili olan tüm ((beyan))ların for'dan sonra gruplandırılmış olmasıdır.

{{index [binding, as state], [parentheses, statement]}}

The parentheses after a `for` keyword must contain two ((semicolon))s. The part before the first semicolon _initializes_ the loop, usually by defining a binding. The second part is the ((expression)) that _checks_ whether the loop must continue. The final part _updates_ the state of the loop after every iteration. In most cases, this is shorter and clearer than a `while` construct.
`for` anahtar kelimesinden sonra parantezlerin içinde iki ((noktalı virgül)) bulunmalıdır. İlk noktalı virgülden önceki kısım, genellikle bir bağlantı tanımlayarak döngüyü başlatır. İkinci kısım, döngünün devam edip etmemesini gerektiğini her seferinde kontrol eden ((ifade))dir. Son kısım, her iterasyondan sonra döngünün durumunu _günceller_. Çoğu durumda, bu, `while` yapısından daha kısa ve daha açıklayıcıdır.

{{index exponentiation}}

Bu, `while` kullanmak yerine `for` döngüsü yapısını kullanarak 2^10^ hesaplayan koddur:

```{test: wrap}
let result = 1;
for (let counter = 0; counter < 10; counter = counter + 1) {
  result = result * 2;
}
console.log(result);
// → 1024
```

## Döngü içerisinden çıkmak

{{index [loop, "termination of"], "break keyword"}}

Döngü koşulunun `false` değerini üretmesini sağlamak bir döngünün bitmesi için tek yol değildir. `break` beyanı, dışındaki döngüden anında çıkmak etkisine sahiptir. Kullanımı aşağıdaki programda gösterilmiştir, bu program, hem 20'den büyük veya eşit olan ve hem de 7'ye bölünebilen ilk sayıyı bulur:

```
for (let current = 20; ; current = current + 1) {
  if (current % 7 == 0) {
    console.log(current);
    break;
  }
}
// → 21
```

{{index "remainder operator", "% operator"}}

Modülo(%) operatörünü kullanmak, bir sayının başka bir sayıya bölünebilir olup olmadığını test etmenin kolay bir yoludur çünkü eğer öyleyse bölme işleminin kalanı sıfırdır.

{{index "for loop"}}

Örnekteki `for` yapısı döngünün sona gelip gelmediğini kontrol eden bir parça içermez. Bu, döngünün içerisinde bir `break` ifadesi çalıştırılmadıkça döngünün hiçbir zaman durmayacağı anlamına gelir.

Eğer o `break` ifadesini kaldırırsanız veya yanlışlıkla her zaman `true` değerini üreten bir bitiş koşulu yazarsanız, programınız bir _((sonsuz döngü))_'ye takılacaktır. Bir sonsuz döngüye takılan bir program asla çalışmayı bitiremez, bu genellikle kötü bir şeydir.

{{if interactive

Bu sayfalardaki örneklerden birinde sonsuz bir döngü oluşturursanız, genellikle birkaç saniye sonra scripti durdurmak isteyip istemediğiniz sorulur. Eğer bu başarısız olursa, kurtarmak için çalıştığınız sekmeyi kapatmanız zorunda kalırsınız.

if}}

{{index "continue keyword"}}

`continue` anahtar kelimesi, `break` gibi bir döngünün ilerleyişini etkiler. Bir döngü gövdesinde `continue` bulunduğunda, kontrol gövdeden çıkar ve döngünün bir sonraki tekrarından devam eder.

## Kısa ve öz şekilde bağlantıları güncelleme

{{index assignment, "+= operator", "-= operator", "/= operator", "*= operator", [state, in binding], "side effect"}}

Özellikle döngü yapılırken, bir program genellikle bir bağlantının değerini o bağlantını önceki değerine dayalı olarak başka bir değerle "güncellemeye" ihtiyaç duyar.

```{test: no}
counter = counter + 1;
```

JavaScript, bunun için bir kısayol sağlar:

```{test: no}
counter += 1;
```

Benzer kısayollar, `result *= 2` ile `result` bağlantısının değerini iki katına çıkarmak veya `counter -= 1` ile geriye doğru saymak gibi birçok diğer aritmetik operatörle de çalışır.

Bu, sayım örneğimizi daha da kısaltmamıza olanak tanır:

```
for (let number = 0; number <= 12; number += 2) {
  console.log(number);
}
```

{{index "++ operator", "-- operator"}}

`counter += 1` ve `counter -= 1` için daha kısa aynı şeye denk gelen yazım şekilleri de mevcuttur: counter++ ve counter--.

## switch aracılığıyla bir değere göre çalıştırmak

{{index [syntax, statement], "conditional execution", dispatch, ["if keyword", chaining]}}

Kodun şu şekilde görünmesi yaygındır:

```{test: no}
if (x == "value1") action1();
else if (x == "value2") action2();
else if (x == "value3") action3();
else defaultAction();
```

{{index "colon character", "switch keyword"}}

Buna benzer ancak daha doğrudan bir şekilde kod "çalıştırmayı" ifade etmek için tasarlanmış `switch` adında bir yapı vardır. Ne yazık ki, bu yapı için JavaScript'in kullandığı sözdizimi (C/Java programlama dillerinden miras aldığı) biraz garip gözükebilir ve bundan ötürü bir dizi `if` ifadesi daha iyi görünebilir. İşte bir örnek:

```
switch (prompt("What is the weather like?")) {
  case "rainy":
    console.log("Remember to bring an umbrella.");
    break;
  case "sunny":
    console.log("Dress lightly.");
  case "cloudy":
    console.log("Go outside.");
    break;
  default:
    console.log("Unknown weather type!");
    break;
}
```

{{index fallthrough, "break keyword", "case keyword", "default keyword"}}

`switch` tarafından açılan bloğun içine istediğiniz sayıda `case` koyabilirsiniz. Program, `switch`'e verilen değere karşılık gelen etiketteki kodu veya eşleşen bir değer bulunamazsa `default` etiketindeki kodu çalıştırır. `break` ifadesine ulaşana kadar diğer etiketler de dahil olmak üzere karşılaştığı kodları çalıştırmaya devam eder. Örnekteki `"sunny"` durumunda olduğu gibi bazı durumlarda, bu kodu durumlar arasında paylaşmak için kullanılabilir (hem güneşli hem de bulutlu hava için dışarı çıkmanızı önerir). Ancak dikkatli olun - bu şekilde bir `break` ifadesini unutmak kolaydır ve istenmeyen şekilde kodun yürütülmesine sebep olmak kolaydır.

## Büyük harf kullanımı

{{index capitalization, [binding, naming], [whitespace, syntax]}}

Bağlantı adları arasında boşluk olmamalıdır, ancak bağlantının temsil ettiği şeyi açıkça tanımlamak için birden fazla kelime kullanmak faydalı olabilir. Birden fazla kelime içeren bir bağlantı adı yazmak için şu seçenekleriniz var:

```{lang: null}
fuzzylittleturtle
fuzzy_little_turtle
FuzzyLittleTurtle
fuzzyLittleTurtle
```

{{index "camel case", "programming style", "underscore character"}}

İlk stili okumak zor olabilir. Ben alt çizgilerin görünümünü oldukça beğeniyorum, ancak bu stili yazmak biraz zor olabilir. ((Standart)) JavaScript fonksiyonları ve çoğu JavaScript programcısı, sondaki stili takip eder - ilk kelime haricindeki her kelimenin ilk harfini büyük harfle yazarlar. Böyle küçük detaylara alışmak zor değildir ve karışık isimlendirme stilleri olan kodlar okunması zor olabilir, bu yüzden bu ((kuralı)) kullanıyoruz.

{{index "Number function", constructor}}

Bazı durumlarda, `Number` fonksiyonu gibi, bağlantı isminin ilk harfi de büyük yazılır. Bu, bu fonskiyonu bir yapılandırıcı olarak işaretlemek içindir. Bir yapılandırıcının ne olduğu [Bölüm ?](object#constructors)'da netleşecektir. Şu anda, önemli olan bu belirgin ((tutarlılık)) eksikliğinden rahatsız olmamaktır.

## Yorum satırları

{{index readability}}

Sıklıkla, ham kod, bir programın insan okuyucularına iletmek istediğiniz tüm bilgileri iletemez veya bilgiyi anlaşılması zor veya kriptik bir şekilde iletebilir. Bazı zamanlarda, programınızın bir parçası olarak ilgili düşünceleri dahil etmek isteyebilirsiniz. _((Yorum))_lar bunun için vardır.

{{index "slash character", "line comment"}}

Yorum, bir programın bir parçası olan ancak bilgisayar tarafından tamamen görmezden gelinen bir metin parçasıdır. JavaScript'in iki yorum yazma yöntemi vardır. Tek satırlık bir yorum yazmak için iki eğik çizgi karakteri (`//`) kullanabilir ve ardından yorum metnini ekleyebilirsiniz:

```{test: no}
let accountBalance = calculateBalance(account);
// It's a green hollow where a river sings
accountBalance.adjust();
// Madly catching white tatters in the grass.
let report = new Report();
// Where the sun on the proud mountain rings:
addToReport(accountBalance, report);
// It's a little valley, foaming like light in a glass.
```

{{index "block comment"}}

`//` ile başlayan bir yorum yalnızca satırın sonuna kadar gider. `/*` ve `*/` arasındaki bir metin bölümü, yeni satır karakterlerini içinde barındırıp barındırmadığına bakılmaksızın tamamen görmezden gelinir. Bu, bir dosya veya program parçası hakkında satırlar yerine bloklar halinde bilgi eklemek için kullanışlıdır:

```
/*
  I first found this number scrawled on the back of an old
  notebook. Since then, it has often dropped by, showing up in
  phone numbers and the serial numbers of products that I've
  bought. It obviously likes me, so I've decided to keep it.
*/
const myNumber = 11213;
```

## Özet

Şimdi bir programın bazen içerisinde beyanlar barındıran beyanlardan oluştuğunu biliyorsunuz. Beyanlar da genellikle ifadeler barındıran ifadelerden oluşurlar.

İfadeleri ardışık olarak bir araya getirmek, üstten alta çalıştırılan bir program elde etmenizi sağlar. Koşullu (`if`, `else` ve `switch`) ve döngü (`while`, `do` ve `for`) ifadelerini kullanarak kontrol akışına farklı şekillerde değişiklikler ekleyebilirsiniz. 

Bağlanlar, bir parça bilgiyi bir isim altında saklamak için kullanılabilir ve programınızdaki durumu takip etmek için de kullanışlıdır. Ortam, tanımlanan bağlantıların kümesidir. JavaScript sistemleri, ortamınıza birçok kullanışlı standart bağlantıları otomatik olarak yerleştirir.

Fonksiyonlar, bir program parçasını kapsayan özel değerlerdir. Onları `fonksiyonAdı(argüman1, argüman2)` şeklinde yazarak çağırabilirsiniz. Böyle bir fonksiyon çağrısı bir ifade olup ayrıca bir değer üretebilir.

## Egzersizler

{{index exercises}}

Egzersiz çözümlerinizi nasıl test edeceğinizden emin değilseniz, [Giriş](intro)'e başvurun.

Her egzersiz bir problem açıklaması ile başlar, bu açıklamayı okuyun ve egzersizi çözmeye çalışın. Sorunlarla karşılaşırsanız, [egzersizden sonra]{if interactive} [[kitabın sonundaki](hints)]{if book} ipuçlarını'ı okuyabilirsiniz. Egzersizlerin tam çözümlerini [_https://eloquentjavascript.net/code_](https://eloquentjavascript.net/code#2)'da çevrimiçi olarak bulabilirsiniz. Egzersizlerden bir şeyler öğrenmek istiyorsanız, egzersizi çözdükten sonra çözümlere bakmayı veya en azından biraz baş ağrısı yaşayana kadar çözüme saldırmanızı öneririm.

### Bir üçgeni döngüye almak

{{index "triangle (exercise)"}}

Aşağıdaki üçgeni çıktıya yazdırmak için `console.log`'u yedi kere çağıran bir ((döngü)) yazın:

```{lang: null}
#
##
###
####
#####
######
#######
```

{{index [string, length]}}

Bir dizinin uzunluğunu `.length` yazarak bulabileceğinizi bilmek faydalı olabilir.

```
let abc = "abc";
console.log(abc.length);
// → 3
```

{{if interactive

Çoğu egzersiz, egzersizi çözmek için değiştirebileceğiniz bir kod parçası içerir. Kod bloklarını düzenlemek için üzerlerine tıklayabileceğinizi unutmayın.

```
// Kodunuz buraya.
```
if}}

{{hint

{{index "triangle (exercise)"}}

1'den 7'ye kadar olan sayıları yazdıran bir programla başlayabilirsiniz. Bunun için, [bu bölümden önce tanıtılan `for` döngüsü örneğine](program_structure#loops) birkaç değişiklik yaparak türetebilirsiniz.

Şimdi, sayıların ve # karakterlerinden oluşan dizelerinin arasındaki bağlantıyı düşünün. 1'den 2'ye gitmek için 1 ekleyebilirsiniz (`+= 1`). "#" den "##" e gitmek için bir karakter ekleyebilirsiniz (`+= "#"`). Bu nedenle, çözümünüz yakından sayı yazdırma programını takip edebilir.

hint}}

### FizzBuzz

{{index "FizzBuzz (exercise)", loop, "conditional execution"}}

1'den 100'e kadar olan değerleri çıktı olarak `console.log` fonksiyonunu aracılığıyla yazdıracak ancak iki adet istisna sağlayacak bir program yaz. 3 sayısı ile bölünebilecek sayılar için sayıyı yazdırmak yerine `"Fizz"` ve 5 sayısı ile bölünüp 3 sayısı ile bölünmeyen sayılar için de sayı yerine `"Buzz"` yazdır.

When you have that working, modify your program to print `"FizzBuzz"` for numbers that are divisible by both 3 and 5 (and still print `"Fizz"` or `"Buzz"` for numbers divisible by only one of those).
Çalışan bir şey elde ettiğinde gerektikçe değişiklikler yap ve programının `"FizzBuzz"` çıktısını 3 ve 5 ile bölünebilir sayılar için yazdırmasını sağla, ayrıca güncel sayı sadece 3 veya 5'e bölünebiliyorsa sadece `"Fizz"` veya `"Buzz"` çıktısını yazdırdığına emin ol.

(Bu aslında bir ((mülakat sorusu)) ve iddia edildiğine göre programcı adaylarının önemli bir yüzdesini elemek için kullanılıyor. Dolayısıyla, eğer çözdüyseniz, bu sizin işgücü piyasası değerinizin arttığı anlamına geliyor.)

{{if interactive
```
// Kodunuz buraya.
```
if}}

{{hint

{{index "FizzBuzz (exercise)", "remainder operator", "% operator"}}

Sayıları geçmek açıkça bir döngü işidir ve neyi yazdıracağını seçmek bir koşullu ifade meselesidir. Bir sayının başka bir sayıya bölünebilir olup olmadığını (kalanının sıfır olup olmadığını) kontrol etmek için modülo (%) operatörünü kullanmayı unutmayın.

İlk versiyonda, her sayı için üç olası sonuç vardır, bu nedenle bir `if`/`else if`/`else` zinciri oluşturmanız gerekecek.

{{index "|| operator", ["if keyword", chaining]}}

Programın ikinci versiyonunun basit bir çözümü ve zekice bir çözümü vardır. Basit çözüm, verilen koşulu kesin olarak test etmek için başka bir koşullu "dal" eklemektir. Zeki çözüm için, çıktılanacak kelime veya kelimeleri içeren bir dize oluşturun ve bu kelimeyi veya numarayı yazdırın eğer kelime yoksa potansiyel olarak || operatörünü iyi kullanarak sadece sayıyı yazdırın.

hint}}

### Satranç tahtası

{{index "chessboard (exercise)", loop, [nesting, "of loops"], "newline character"}}

Bir satır başına yeni satır karakterleri kullanarak satırları ayıran bir 8x8 ızgarayı temsil edecek dizeyi oluşturan bir program yazın. Izgaranın her bir konumunda ya bir boşluk ya da "#" karakteri bulunmalıdır. Karakterler bir satranç tahtası oluşturmalıdır.

Bu diziyi `console.log`'a verirseniz şuna benzer bir şey görüntülemelisiniz:

```{lang: null}
 # # # #
# # # # 
 # # # #
# # # # 
 # # # #
# # # # 
 # # # #
# # # # 
```

Bu deseni üreten bir programa sahip olduğunuzda, bir bağlantı `size = 8` tanımlayın ve programı verilen genişlik ve yükseklikteki bir ızgarayı çıkaracak şekilde değiştirin.

{{if interactive
```
// Kodunuz buraya.
```
if}}

{{hint

{{index "chess board (exercise)"}}

Dizeyi başlangıçta boş bir dize (`""`) ile başlayarak ve ardından karakterleri tekrar tekrar ekleyerek oluşturabilirsiniz. Bir satır sonu karakteri `"\n"` olarak yazılır.

{{index [nesting, "of loops"], [braces, "block"]}}

İki ((boyut)) ile çalışmak için iç içe olan iki ((döngü))'ye ihtiyacınız olacak. Her iki döngünün vücutlarını görmeyi kolaylaştırmak için her iki döngünün de etrafına parantezler koyun. Bu vücutları uygun şekilde girintileyin. Döngülerin sırası, diziyi nasıl oluşturduğumuzun sırasını izlemelidir (satır satır, soldan sağa, yukarıdan aşağıya). Bu nedenle, dış döngü satırları ele alır ve iç içe döngü bir satırdaki karakterleri ele alır.

{{index "counter variable", "remainder operator", "% operator"}}

You'll need two bindings to track your progress. To know whether to put a space or a hash sign at a given position, you could test whether the sum of the two counters is even (`% 2`).
İlerlemenizi izlemek için iki farklı bağlantıya ihtiyacınız olacak. Belirli bir konumda bir boşluk mu yoksa bir "#" işareti mi ekleyeceğinizi belirlemeniz için, iki farklı sayaç olarak kullandığınız bağlantıların değerlerinin toplamı çift mi yoksa tek mi olduğunu test edebilirsiniz (`% 2`).

Bir satırı sonlandırmak için yeni bir satır karakteri eklemeyi dış döngü içinde ancak iç içe olan döngünün dışında yapmalısınız.

hint}}
