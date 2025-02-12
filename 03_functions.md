# Fonksiyonlar

{{quote {author: "Donald Knuth", chapter: true}

İnsanlar bilgisayar biliminin sadece dahilerin ortaya koyabileceği bir sanat olduğunu düşünüyorlar ancak durum tam olarak öyle değil, sadece birbirini takip eden birçok insanın küçük taşlarla bir duvar oluşturması gibi.

quote}}

{{index "Knuth, Donald"}}

{{figure {url: "img/chapter_picture_3.jpg", alt: "Illustration of fern leaves with a fractal shape, bees in the background", chapter: framed}}}

{{index function, [code, "structure of"]}}

Fonksiyonlar, JavaScript programlamasındaki en merkezi araçlardan biridir. Bir program parçasını bir değere sarma kavramının birçok yararlı kullanımı vardır. Daha büyük programları yapılandırmanın, tekrarı azaltmanın, alt programları isimlendirmenin ve bu alt programları birbirinden izole etmenin bir yolunu sağlar.

Fonksiyonların en açık uygulamalarından biri yeni ((kelime dağarcığı)) tanımlamaktır. Konuşma dilinde yeni kelimeler oluşturmak genellikle kötü bir stildir ancak programlamada bu bir vazgeçilmezdir.

{{index abstraction, vocabulary}}

Tipik yetişkin İngilizce konuşanların kelime dağarcığında yaklaşık 20.000 kelime bulunmaktadır ancak muhtemelen hiç bir programlama dili 20.000 komutla beraber gelmez. Ayrıca, mevcut olan kelime dağarcığı da daha kesin bir şekilde tanımlanmıştır ve bundan ötürü insan dilindeki kadar esnek olmaz. Bu nedenle, aşırı ayrıntıdan kaçınmak için yeni kelimeler tanıtmamız gerekmektedir.

## Fonksiyonlar tanımlamak

{{index "square example", [function, definition], [binding, definition]}}

Bir fonksiyon tanımı, değeri bir fonksiyon olan basit bir bağlantıdır. Örneğin, bu kod, `square` bağlantısını bir sayının karesini üreten bir fonksiyona atayacak sağlayacak şekilde tanımlar:

```
const square = function(x) {
  return x * x;
};

console.log(square(12));
// → 144
```

{{indexsee "curly braces", braces}}
{{index [braces, "function body"], block, [syntax, function], "function keyword", [function, body], [function, "as value"], [parentheses, arguments]}}

Bir fonksiyon, `function` anahtar kelimesiyle başlayan bir ifade ile oluşturulur. Fonksiyonların bir dizi _((parametre))leri_ (bu durumda sadece `x`) ve çağrıldığında yürütülecek ((ifade))leri içeren bir _gövdesi_ vardır. Bu şekilde oluşturulan bir fonksiyonun gövdesi yalnızca tek bir ((beyan)) içerse bile her zaman süslü parantezlerle sarılmalıdır.

{{index "roundTo example"}}

Bir fonksiyon birden fazla parametreye sahip olabilirken ayrıca hiç parametreye sahip olmayabilir. Aşağıdaki örnekte, `makeNoise` hiçbir parametre adı listelemezken (`n`'yi `step`'in en yakın katına yuvarlayan) `roundTo` iki parametre listeler:

```
const makeNoise = function() {
  console.log("Pling!");
};

makeNoise();
// → Pling!

const roundTo = function(n, step) {
  let remainder = n % step;
  return n - remainder + (remainder < step / 2 ? 0 : step);
};

console.log(roundTo(23, 10));
// → 20
```

{{index "return value", "return keyword", undefined}}

Bazı `roundTo` ve `square` gibi fonksiyonlar bir değer üretirken bazılarıysa `makeNoise` gibi sadece bir ((yan etki))ye sebep olur. Bir `return` beyanı, fonksiyonun çalıştırıldığında döndüreceği değeri belirler. Program kontrolü böyle bir beyanla karşılaştığında, derhal mevcut fonksiyondan çıkar ve fonksiyonu çağıran koda o beyanda belirtilen değeri verir. Bir ifade verilmeden yazılan `return` anahtar kelimesi, fonksiyonun `undefined` değerini döndürmesine neden olur. `makeNoise` gibi hiçbir `return` beyanı olmayan fonksiyonlar da benzer şekilde `undefined` döndürürler.

{{index parameter, [function, application], [binding, "from parameter"]}}

Bir fonksiyona gelen parametreler sıradan değişkenlerde olan bağlantılar gibi davranırlar ancak kendilerinin başlangıç değerlerini fonksiyon içindeki kod tarafından değil, fonksiyonun çağırıcısı tarafından alırlar.

## Bağlantılar ve kapsamlar

{{indexsee "top-level scope", "global scope"}}
{{index "var keyword", "global scope", [binding, global], [binding, "scope of"]}}

Her bağlantının bir *((kapsam))*ı vardır ve belirli bağlantılar belirli kapsamların içinde görünürdürler. Herhangi bir fonksiyon, blok veya modül(bkz. [Bölüm ?](modules)) içinde olmayacak şekilde tanımlanmış bağlantılar için kapsam tüm programdır - bu tür bağlantılara istediğiniz yerden ulaşabilirsiniz. Bunlara _global_ denir.

{{index "local scope", [binding, local]}}

Ancak bir fonksiyon parametreleri için oluşturulan bağlantılar veya bir fonksiyon içinde oluşturulan bağlantılar yalnızca o fonksiyon içerisinden ulaşılabilir, bu yüzden _yerel_ bağlantılar olarak bilinirler. Her fonksiyon çağrıldığında, bu bağlamaların yeni kopyaları oluşturulur. Bu, fonksiyonlar arasında bir izolasyon sağlar - her fonksiyon çağrısı kendi küçük dünyasında (yerel ortamında) hareket eder ve genellikle global ortamda neler olduğunu çok fazla bilmeden anlaşılabilir.

{{index "let keyword", "const keyword", "var keyword"}}

`let` ve `const` ile oluşturulan bağlantılar aslında oluşturuldukları _((blok))_ için yereldirler, bundan ötürü döngü içinde bir bağlantı oluşturursanız, döngüden önceki ve sonraki kod onu "göremez". 2015 öncesi JavaScript'te, fonksiyonlar yeni kapsam oluşturabilen tek yapı oldukları için, `var` anahtar kelimesiyle oluşturulan eski tarz bağlantılar, bulundukları fonksiyonun tamamında - veya bir fonksiyon içinde değillerse, global kapsamda görünürlerdi.

```
let x = 10;   // global
if (true) {
  let y = 20; // local to block
  var z = 30; // also global
}
```

{{index [binding, visibility]}}

Her ((kapsam)), çevresindeki kapsamlara "bakabilir", bu yüzden örnekteki bloğun içinde `x` görülebilir durumdadır. Tek istisna, birden fazla aynı isimli bağlantının durumda, kod yalnızca en içteki bağlantıyı görebilir. Örneğin, `halve` fonksiyonu içindeki kod `n`'ye atıfta bulunduğunda, global kapsamdaki `n` değerini değil, kendi `n` değerini görür. Buna içerideki aynı isimdeki bir bağlantının dışarıdaki aynı isimdeki bir bağlantıyı gölgelemesinden ötürü "gölgeleme" denir ve kafa karışıklığına sebep olabileceğinden ötürü önlenilmeye çalışılmalıdır.

```
const halve = function(n) {
  return n / 2;
};

let n = 10;
console.log(halve(100));
// → 50
console.log(n);
// → 10
```

{{id scoping}}

### Gömülü kapsamlar

{{index [nesting, "of functions"], [nesting, "of scope"], scope, "inner function", "lexical scoping"}}

JavaScript, sadece _global_ ve _yerel_ bağlantıları ayırt etmez. Bloklar ve fonksiyonlar diğer bloklar ve fonksiyonlar içinde oluşturulabilir, böylece çoklu kapsamlar oluştururlar.

{{index "landscape example"}}

Örneğin, humus yapmak için gerekli malzemeleri çıkaran bu fonksiyon, içinde başka bir fonksiyona sahiptir:

```
const hummus = function(factor) {
  const ingredient = function(amount, unit, name) {
    let ingredientAmount = amount * factor;
    if (ingredientAmount > 1) {
      unit += "s";
    }
    console.log(`${ingredientAmount} ${unit} ${name}`);
  };
  ingredient(1, "can", "chickpeas");
  ingredient(0.25, "cup", "tahini");
  ingredient(0.25, "cup", "lemon juice");
  ingredient(1, "clove", "garlic");
  ingredient(2, "tablespoon", "olive oil");
  ingredient(0.5, "teaspoon", "cumin");
};
```

{{index [function, scope], scope}}

`ingredient` fonksiyonunun içindeki kod, dış fonksiyon `factor` bağlantısını görebilir. Ancak, `unit` veya `ingredientAmount` gibi içerisinde barındırdığı yerel bağlantılar dış fonksiyondan görülemez.

Bir bloğun içinde görünür olan bağlantılar kümesi, o bloğun program metnindeki konumuna göre belirlenir. Her yerel kapsam, kendisini içeren tüm yerel kapsamları görebilir ve tüm kapsamlar da global kapsamı görebilir. Bu bağlantılardaki bu görünürlük yaklaşımına ((lexical scoping(sözcüksel kapsam belirleme))) denir.

## Değer olarak fonksiyonlar

{{index [function, "as value"], [binding, definition]}}

Bir fonksiyon bağlantısı genellikle basitçe programın belirli bir parçası için bir isim olarak işlev görür ve bu tür bir bağlantılar bir kez tanımlanıp asla tekrardan değiştirilmezler. Bu, fonksiyonu ve adını karıştırmayı kolaylaştırır.

{{index [binding, assignment]}}

Ancak, ikisi farklıdır. Bir fonksiyon değeri, diğer değerlerin yapabileceği tüm işleri yapabilir - onu sadece çağırmakla kalmaz, istediğiniz yerde kullanabilirsiniz. Bir fonksiyon değerini yeni bir bağlantıya depolamak ve bir fonksiyona bir argüman olarak iletmek vb. mümkündür. Benzer şekilde, fonksiyon tutan bir bağlantı, hala yalnızca sıradan bir bağlantıdır ve eğer sabit bir şekilde oluşturulmadıysa(`const`) kendisine şu şekilde yeni bir değer atanabilir:

```{test: no}
let launchMissiles = function() {
  missileSystem.launch("now");
};
if (safeMode) {
  launchMissiles = function() {/* do nothing */};
}
```

{{index [function, "higher-order"]}}

[Bölüm ?](higher_order)'da, fonksiyon değerlerini diğer fonksiyonlara argüman olarak vererek yapılabilen ilginç şeyleri tartışacağız.

## Beyan notasyonu

{{index [syntax, function], "function keyword", "square example", [function, definition], [function, declaration]}}

Bir işlev bağlantısı oluşturmanın biraz daha kısa bir yolu vardır. `function` anahtar kelimesi bir ifadenin başında kullanıldığında, farklı şekilde çalışır.

```{test: wrap}
function square(x) {
  return x * x;
}
```

{{index future, "execution order"}}

Bu bir fonksiyon _beyanıdır_. Beyan, `square` bağlantısını tanımlar ve onu verilen fonksiyona işaret eder. Yazması biraz daha kolaydır ve işlevden sonra noktalı virgül gerektirmez.

Bu fonksiyon tanımlama formuyla alakalı bir nüans vardır.

```
console.log("The future says:", future());

function future() {
  return "You'll never have flying cars";
}
```

Fonksiyon, kullanıldığı kodun _altında_ tanımlanmış olsa bile önceki kod çalışır. Fonksiyon bildirimleri, düzenli olarak yukarıdan aşağıya kontrol akışının bir parçası değildir. Kavramsal olarak içinde bulundukları kapsamın en üstüne taşınır ve bu kapsamdaki tüm kod tarafından kullanılabilir. Bu bazen yararlı olabilir çünkü tüm fonksiyonların kullanılmadan önce tanımlanması gerekmeksizin kodu en net sayılan şekilde düzenleme özgürlüğü sunar.

## Ok notasyonu

{{index function, "arrow function"}}

Fonksiyonlar için diğerlerinden çok farklı görünen üçüncü bir gösterim var. `function` anahtar kelimesi yerine, büyük eşittir operatörüyle(`>=`) karıştırılmaması gereken eşitlik ve büyüktür işaretlerinden oluşan bir ok (`=>`) kullanır.

```{test: wrap}
const roundTo = (n, step) => {
  let remainder = n % step;
  return n - remainder + (remainder < step / 2 ? 0 : step);
};
```

{{index [function, body]}}

Ok, parametre listesinin ardından gelir ve işlevin gövdesi takip eder. "Bu giriş (parametreler) bu sonucu (gövdeyi) üretir" gibi bir şey ifade eder.

{{index [braces, "function body"], "square example", [parentheses, arguments]}}

Tek bir parametre adı olduğunda, parametre listesinin etrafındaki parantezleri yazmanıza gerek yoktur. Gövde, süslü parantezlerle oluşturulmuş bir blok yerine, tek satırlık bir ifade ise bu ifade fonksiyondan `return` anahtar kelimesini kullanmadan kullanmışçasına döndürmenizi sağlar. Bu nedenle, bu iki square tanımı aynı şeyi yapar:

```
const square1 = (x) => { return x * x; };
const square2 = x => x * x;
```

{{index [parentheses, arguments]}}

Bir ok işlevinin hiç parametresi olmadığında, parametre listesi yalnızca boş bir parantez kümesidir.

```
const horn = () => {
  console.log("Toot");
};
```

{{index verbosity}}

Dilin bir fonksiyonu hem ok fonksiyonlarıyla hem de `function` anahtar kelimesiyle oluşturulma olasılığını sağlamasının derin bir nedeni yoktur. Küçük bir ayrıntı dışında, [Bölüm ?](object)'da da konuşacağımız gibi bunlar aynı işi yaparlar. Ok fonksiyonları 2015 yılında daha rahat bir şekilde küçük fonksiyon ifadelerini yazmayı mümkün kılmak adına eklendi. [Bölüm ?](higher_order)'da çokça kullanacağız.

{{id stack}}

## Çağrı yığını

{{indexsee stack, "call stack"}}
{{index "call stack", [function, application]}}

Kontrolün fonksiyonlar arasında nasıl akış gösterdiği biraz karmaşıktır, hadi buna daha yakından bakalım. İşte birkaç fonksiyon çağrısı yapan basit bir program:

```
function greet(who) {
  console.log("Hello " + who);
}
greet("Harry");
console.log("Bye");
```

{{index ["control flow", functions], "execution order", "console.log"}}

Bu programın çalışması yaklaşık olarak şöyle gider: `greet` fonksiyonuna yapılan çağrı, kontrolün o fonksiyonun başına (2. satır) atlamasına neden olur. Fonksiyon, `console.log`'u çağırır, kontrolü alır, işini yapar ve ardından kontrolü 2. satıra geri verir. Orada `greet` fonksiyonunun sonuna ulaşır, bu nedenle onu çağıran yere geri döner, ki bu da 4. satırdır. Bundan sonra bir sonraki satır tekrar `console.log` çağrısı yapar. Dönüş yaptıktan sonra, program sonuna ulaşır.

Kontrol akışını şematik olarak şöyle gösterebiliriz:

```{lang: null}
not in function
  in greet
    in console.log
  in greet
not in function
  in console.log
not in function
```

{{index "return keyword", [memory, call stack]}}

Bir fonksiyona dönüş yapıldığında çağrıldığı yere geri kontrol akışının geri dönebilmesi için, bilgisayarın, çağrının nereden yapıldığı bağlamını hatırlaması gerekir. Bir durumda, `console.log`, işi bittiğinde `greet` fonksiyonuna dönmelidir. Diğer bir durumdaysa programın sonuna dönmelidir.

Bilgisayarın bu bağlamı sakladığı yer _((çağrı yığını))_ dır. Bir fonksiyon çağrıldığında, mevcut bağlam bu yığının üstüne depolanır. Bir işlev döndüğünde, yığının üstündeki bağlamı kaldırır ve kaldırdığı bu bağlamı programı yürütmeye devam etmek için kullanır.

{{index "infinite loop", "stack overflow", recursion}}

Bu yığını saklamak, bilgisayarın belleğinde yer gerektirir. Yığın çok büyük hale geldiğinde, bilgisayar "yığın depolama alanı kalmadı" veya "çok fazla özyineleme yapıldı" gibi bir hata mesajıyla başarısız olacaktır. Aşağıdaki kod, bilgisayara sonsuz geriye doğru gidip gelme gerektiren gerçekten zor bir soru sorarak bunu gösterir. Aslında, bilgisayarın gerçekten sonsuz bir yığını olsaydı _sonsuz olurdu_ ancak şu anki durumda alanı tüketir ve "yığı taşarız".

```{test: no}
function chicken() {
  return egg();
}
function egg() {
  return chicken();
}
console.log(chicken() + " came first.");
// → ??
```

## Opsiyonel argümanlar

{{index argument, [function, application]}}

Aşağıdaki koda izin verilir ve herhangi bir sorun olmaksızın çalışır:

```
function square(x) { return x * x; }
console.log(square(4, true, "hedgehog"));
// → 16
```

`square`'i yalnızca bir ((parametre)) ile tanımladık. Ancak üç adet argümanla çağırdığımızda JavaScript'in şikayet etmediğini ve ek argümanları yok sayıp ilk argümanın karesini hesapladığını gözlemliyoruz.

{{index undefined}}

JavaScript, bir işleve kaç argüman geçirdiğiniz konusunda son derece açık fikirlidir. Çok fazla argüman verirseniz, fazladan olanlar yok sayılır. Çok az argüman verirseniz, eksik parametreler `undefined` değerine otomatik olarak atanır.

Bunun dezavantajı, fonksiyonlara olası olarak yanlış sayıda argüman verecek olursanız size kimsenin bundan haber vermeyecek olmasıdır.

Avantajı ise, bu davranışın bir fonksiyonun farklı sayılarda argümanlarla çağrılmasına izin vermek için kullanılabilmesidir. Örneğin, bu `minus` fonksiyonu, bir veya iki argümanla etkileşime girerek `-` operatörünü taklit etmeye çalışır:

```
function minus(a, b) {
  if (b === undefined) return -a;
  else return a - b;
}

console.log(minus(10));
// → -10
console.log(minus(10, 5));
// → 5
```

{{id roundTo}}
{{index "optional argument", "default value", parameter, ["= operator", "for default value"] "roundTo example"}}

Bir parametrenin ardından `=` operatörünü yazar ve onu bir ifade ile takip ederseniz, o parametre için bir argüman değeri verilmediğinde o verdiğiniz ifade, parametrenin varsayılan argüman değeri haline gelir.

{{index "roundTo example"}}

Örneğin, bu versiyon `roundTo` fonksiyonunun ikinci argümanını opsiyonel hale getirir. Eğer `undefined` değerini argüman olarak vermezseniz, o ikinci parametrenin varsayılan argüman değeri 1 olacaktır.

```{test: wrap}
function roundTo(n, step = 1) {
  let remainder = n % step;
  return n - remainder + (remainder < step / 2 ? 0 : step);
};

console.log(roundTo(4.5));
// → 5
console.log(roundTo(4.5, 2));
// → 4
```

{{index "console.log"}}

[Sonraki bölümde](data#rest_parameters), bir fonksiyon gövdesinin aldığı tüm argüman listesine nasıl erişebileceğimizi göreceğiz. Bu, bir fonksiyonun herhangi bir sayıda argümanı kabul etmesini mümkün kılar. Örneğin, `console.log` bunu yapar ve kendisine verilen tüm değerleri çıktı olarak gösterir.

```
console.log("C", "O", 2);
// → C O 2
```

## Kapama

{{index "call stack", "local binding", [function, "as value"], scope}}

Fonksiyonları herhangi bir değer olarak ele alabilme yeteneği ve fonksiyonların her çağrıldığında yerel bağlantılarının yeniden oluşturulması özellikleri ortaya ilginç bir soru çıkarır. Yerel bağlara onları oluşturan fonksiyon çağrısı artık etkin değilken ne olur?

Aşağıdaki kod, bunun bir örneğini gösterir. Bir yerel bağlantı oluşturan `wrapValue` adında bir fonksiyon tanımlar. Ardından bu yerel bağlantıya erişen ve bunu döndüren bir fonksiyon döndürür.

```
function wrapValue(n) {
  let local = n;
  return () => local;
}

let wrap1 = wrapValue(1);
let wrap2 = wrapValue(2);
console.log(wrap1());
// → 1
console.log(wrap2());
// → 2
```

Bu izin verilir ve umduğunuz gibi çalışır - her iki ayrı yaratılmış bağlam hala erişilebilir. Bu durum, yerel bağlantıların her çağrı için yeniden oluşturulduğunu ve farklı çağrıların birbirlerinin yerel bağlantılarını etkilemediğini iyi bir şekilde gösterir.

Kapsayan bir kapsamdaki belirli bir yerel bağlantının yaratılmış spesifik bir değerine başvurabilmeyi sağlayan bu özellik _((kapama))_ olarak adlandırılır. Etrafındaki kapsamlardan yerel bağlantı veya bağlantılarını kullanan bir fonksiyonun kullandığı özelliğe kapama denir. Bu davranış, bağlantıların yaşam süreleri hakkında endişelenmenize gerek olmadığı için sizi serbest bırakmakla kalmaz, aynı zamanda fonksiyon değerlerini bazı yaratıcı şekillerde kullanmanızı mümkün kılar.

{{index "multiplier function"}}

Önceki örneği hafif bir değişiklikle vereceğimiz herhangi bir miktarı istediğimiz herhangi bir miktarla çarpan fonksiyonlar oluştucak bir haline getirebiliriz.

```
function multiplier(factor) {
  return number => number * factor;
}

let twice = multiplier(2);
console.log(twice(5));
// → 10
```

{{index [binding, "from parameter"]}}

`wrapValue` örneğindeki `local` bağlantısı bir parametre zaten kendisi de yerel bir bağlantı olduğundan ötürü gerekli değildir.

{{index [function, "model of"]}}

Bu tür programları düşünmek biraz pratik gerektirir. İyi bir zihinsel model, fonksiyon değerlerininin hem içindeki kodu ve hem de oluşturuldukları ortamı içerdiklerini düşünmektir. Çağrıldığında, fonksiyon gövdesi oluşturulduğu ortamı görür, çağrıldığı yerin ortamını değil.

Örnekte, `multiplier` çağrılır ve `factor` parametresinin 2'ye bağlı olduğu bir ortam oluşturur. `twice` bağlantısı içinde depolanan bu döndürülen fonksiyon değeri, o ortamı hatırlar ki çağrıldığında argümanını 2 ile çarpar.

## Özyineleme

{{index "power example", "stack overflow", recursion, [function, application]}}

Bir fonksiyonun yığını taşırmadığı sürece kendini çağırması tamamen normaldir. Kendini çağıran bir fonskiyon _özyineleyici_ bir fonksiyon olarak adlandırılır. Özyineleyicilik, bazı işlevlerin farklı bir tarzda yazılmasına olanak tanır. Örneğin, `**` (üs alma) operatörü ile aynı işi yapan bu `power` adlı fonksiyona bakın:

```{test: wrap}
function power(base, exponent) {
  if (exponent == 0) {
    return 1;
  } else {
    return base * power(base, exponent - 1);
  }
}

console.log(power(2, 3));
// → 8
```

{{index loop, readability, mathematics}}

Bu, matematikçilerin üs alma işlemini tanımlama şekline oldukça yakındır ve tartışmaya açık bir şekilde [Bölüm ?](program_structure)'da kullandığımız döngüden daha açık bir şekilde kavramı tanımlar. Tekrarlı çarpma işlemini gerçekleştirmek için her seferinde daha küçük üslerle kendini birden çok kez çağırır.

{{index [function, application], efficiency}}

Ancak bu uygulamanın bir sorunu var: tipik JavaScript uygulamalarında, döngü kullanan bir versiyondan yaklaşık üç kat daha yavaştır. Basit bir döngüden geçmek, bir fonksiyonu birden çok kez çağırmaktan genellikle performans bakımından daha ucuzdur.

{{index optimization}}

Hızlılıkla ((zarafet)) arasındaki ikilem ilginçtir. Bu, insan dostu ve makine dostu olmak arasında bir tür devam eden bir durum olarak görülebilir. Neredeyse her program, onu daha büyük ve daha karmaşık hale getirerek daha hızlı hale getirilebilir. Programcının burada uygun bir dengeyi kendisinin belirlemesi gerekmektedir.

Often, though, a program deals with such complex concepts that giving up some efficiency in order to make the program more straightforward is helpful.
`power` fonksiyonunun durumunda, zarif olmayan (döngü kullanan) bir versiyon hala oldukça basit ve okunması kolaydır. Onu özyinelemeli bir fonksiyonla değiştirmenin pek mantıklı değildir. Ancak, bir program genellikle öyle kompleks durumlarla ilgilenir ki programı daha anlaşılır hale getirmek için bazen verimliliğinden vazgeçmek daha mantıklıdır.

{{index profiling}}

Verimlilik hakkında endişelenmek dikkati dağıtabilir. Bu, program tasarımını karmaşıklaştıran başka bir faktördür ve zaten zor olan bir şey yaparken, bu ekstra düşünme nedeniyle felç olabilirsiniz.

{{index "premature optimization"}}

Bu nedenle, genellikle doğru ve anlaşılması kolay olan bir şey yazarak başlamalısınız. Genellikle çoğu kod önemli miktarda çalıştırılmadığından ötürü aldığı zaman hakkında çok da endişelenmenize gerek yoktur, sonradan ölçebilir ve gerektiğinde iyileştirebilirsiniz.

{{index "branching recursion"}}

Özyineleme, sadece döngülerin verimsiz bir alternatifi değildir. Bazı problemler gerçekten özyineleme aracılığıyla döngülerden daha kolay bir şekilde çözülebilir. Çoğunlukla bunlar, birden çok "dal" keşfetmeyi veya işlemeyi gerektiren problemlerdir, her bir dal daha fazla dala ayrılabilir.

{{id recursive_puzzle}}
{{index recursion, "number puzzle example"}}

Bu bulmacayı düşünün: Sayı 1'den başlayarak ve tekrarlanarak ya 5 eklenerek ya da 3 ile çarpılarak, sonsuz bir sayı kümesi üretilebilir. Verilen bir sayıyı üreten böyle bir toplama ve çarpma dizisi bulmaya çalışan bir fonksiyonu nasıl yazarsınız?

Örneğin, sayı 13'e, önce 3 ile çarpılarak ve ardından 5 iki kez eklenerek ulaşılabilirken, sayı 15 hiçbir şekilde ulaşılamaz.

İşte bir özyinelemeli bir çözüm:

```
function findSolution(target) {
  function find(current, history) {
    if (current == target) {
      return history;
    } else if (current > target) {
      return null;
    } else {
      return find(current + 5, `(${history} + 5)`) ??
             find(current * 3, `(${history} * 3)`);
    }
  }
  return find(1, "1");
}

console.log(findSolution(24));
// → (((1 * 3) + 5) * 3)
```

Bu programın _en kısa_ işlem dizisini bulması gerekmediğini lütfen unutmayın, kendisi herhangi bir diziyi bulduğunda memnun olur.

Hemen nasıl çalıştığını görmüyorsanız endişelenmeyin. Bunun üzerinde çalışalım, çünkü bu, özyinelemeli düşünme pratiği için harika bir alıştırmadır.

İçeride bulunan `find`, gerçek özyinelemeli işlemi yapmaktadır. İki ((argüman)) alır: mevcut sayı ve bu sayıya nasıl ulaştığımızı kaydeden bir dize. Bir çözüm bulursa, hedefe nasıl ulaşılacağını gösteren bir dize döndürür. Bu sayıdan başlayarak bir çözüm bulunamazsa, `null` döndürür.

{{index null, "?? operator", "short-circuit evaluation"}}

Bunu yapmak için işlev üç eylemden birini gerçekleştirir. Eğer mevcut sayı hedef sayı ise, mevcut geçmiş, hedefe ulaşmanın bir yoludur, bu yüzden döndürülür. Eğer mevcut sayı hedeften büyükse, bu dalı daha fazla keşfetmenin bir anlamı yoktur çünkü hem eklemek hem de çarpmak sayıyı sadece daha büyük yapar, bu yüzden `null` döndürür. Son olarak, hala hedef sayıdan daha düşükse, fonksiyon mevcut sayıdan başlayan her iki olası yolu da denemek için kendisini iki kez çağırır, bir kez toplama ve bir kez çarpma için. İlk çağrı `null` döndürmeyen bir şey döndürürse, bu döndürülür. Aksi takdirde, ikinci çağrı, dize veya `null` üretip üretmediğine bakılmasızın döndürülür.

{{index "call stack"}}

Bu fonksiyonun istediğimiz etkiyi nasıl ürettiğini daha iyi anlamak için, 13 sayısı için bir çözüm ararken yapılan tüm `find` çağrılarına bakalım.

```{lang: null}
find(1, "1")
  find(6, "(1 + 5)")
    find(11, "((1 + 5) + 5)")
      find(16, "(((1 + 5) + 5) + 5)")
        too big
      find(33, "(((1 + 5) + 5) * 3)")
        too big
    find(18, "((1 + 5) * 3)")
      too big
  find(3, "(1 * 3)")
    find(8, "((1 * 3) + 5)")
      find(13, "(((1 * 3) + 5) + 5)")
        found!
```

Girinti, çağrı yığınının derinliğini gösterir. `find` ilk kez çağrıldığında, `(1 + 5)` ile başlayan çözümü keşfetmek için kendisini çağırarak başlar. Bu çağrı, hedef sayıya eşit veya daha küçük bir sayı üreten _her_ çözümü keşfetmek için fonksiyonu tekrar eder. Hedefe ulaşan bir çözüm bulamadığından ötürü ilk çağrıya `null` döner. İlk çağrıda, `??` operatörü `(1 * 3)` ile keşfeden çağrının olmasını sağlar. Bu aramanın şansı yaver gider - ilk özyineleyici çağrısı, henüz başka bir özyineleyici çağrı aracılığıyla hedef sayıya ulaşır. En içteki çağrı bir dize döndürür, ve ara çağrılardaki her `??` operatörü bu diziyi çıktı olarak vererek sonunda çözümü döndürür.

## Büyüyen fonksiyonlar

{{index [function, definition]}}

Programlara fonksiyonların tanıtılması için az buçuk doğal olan iki yol vardır.

{{index repetition}}

İlk olarak, benzer kodları birden çok kez yazdığınızı fark edersiniz. Bunu yapmak istemezsiniz. Daha fazla kod, hataların saklanabileceği daha fazla alan ve programı anlamaya çalışan insanlar için okunacak daha fazla materyal demektir. Bu nedenle, tekrarlanan kodu alır, ona iyi bir isim bulur ve bir fonksiyon içine koyarsınız.

İkinci yol, henüz yazmadığınız ancak kendi fonksiyonunu hak eden bazı koda ihtiyacınız olduğunu fark ettiğinizdir. Fonksiyonu adlandırmakla başlayacak ve ardından gövdesini yazacaksınız. Hatta fonksiyonu tanımlamadan önce fonksiyonu kullanan kodu yazmaya bile başlayabilirsiniz.

{{index [function, naming], [binding, naming]}}

Bir fonksiyon için iyi bir ad bulmanın ne kadar zor olduğu, kod yazmaya çalıştığınız kavramın ne kadar net olduğunun iyi bir göstergesidir. Bir örnek üzerinden geçelim.

{{index "farm example"}}

Bir çiftlikteki ineklerin ve tavukların sayısını, ardından her iki sayının yanına `Cows` ve `Chickens` kelimelerini ve her iki sayının da her zaman üç basamaklı olacak şekilde önceden doldurulmuş sıfırlarını yazdıran bir program yazmak istiyoruz.

```{lang: null}
007 Cows
011 Chickens
```

Bu, iki argümanlı bir fonksiyon gerektirir - ineklerin sayısı ve tavukların sayısı. Hadi kodlamaya başlayalım.

```
function printFarmInventory(cows, chickens) {
  let cowString = String(cows);
  while (cowString.length < 3) {
    cowString = "0" + cowString;
  }
  console.log(`${cowString} Cows`);
  let chickenString = String(chickens);
  while (chickenString.length < 3) {
    chickenString = "0" + chickenString;
  }
  console.log(`${chickenString} Chickens`);
}
printFarmInventory(7, 11);
```

{{index ["length property", "for string"], "while loop"}}

Bir dize ifadesinin sonuna `.length` yazmak bize o dizenin uzunluğunu verecektir. Bu nedenle, `while` döngüleri, sayı dizelerinin en az üç karakter uzunluğunda olana kadar önüne sıfırlar eklemeye devam eder.

Görev tamamlandı! Ancak, çiftlik sahibine kodu (birlikte ciddi bir fatura ile) gönderecekken, bizi arar ve ayrıca domuzları da yazdırmak için yazılımı genişletemeyiz mi diye bize sorar.

{{index "copy-paste programming"}}

Tabii ki yapabiliriz. Ancak, o dört satırı bir kez daha kopyalayıp yapıştırma sürecindeyken durur ve yeniden düşünürüz. Daha iyi bir yol olmalı. İşte bu bizim ilk denememiz:

```
function printZeroPaddedWithLabel(number, label) {
  let numberString = String(number);
  while (numberString.length < 3) {
    numberString = "0" + numberString;
  }
  console.log(`${numberString} ${label}`);
}

function printFarmInventory(cows, chickens, pigs) {
  printZeroPaddedWithLabel(cows, "Cows");
  printZeroPaddedWithLabel(chickens, "Chickens");
  printZeroPaddedWithLabel(pigs, "Pigs");
}

printFarmInventory(7, 11, 3);
```

{{index [function, naming]}}

İşe yarıyor! Ancak, `printZeroPaddedWithLabel` adı biraz garip. Üç şeyi - yazdırma, sıfır dolgusu ve bir etiket ekleme - tek bir işlevde birleştiriyor gibi görünüyor.

{{index "zeroPad function"}}

Programımızın tekrar eden kısmını toptan dışarı çıkarmak yerine, tek bir _kavram_ seçmeye çalışalım.

```
function zeroPad(number, width) {
  let string = String(number);
  while (string.length < width) {
    string = "0" + string;
  }
  return string;
}

function printFarmInventory(cows, chickens, pigs) {
  console.log(`${zeroPad(cows, 3)} Cows`);
  console.log(`${zeroPad(chickens, 3)} Chickens`);
  console.log(`${zeroPad(pigs, 3)} Pigs`);
}

printFarmInventory(7, 16, 3);
```

{{index readability, "pure function"}}

`zeroPad` gibi güzel, açık bir adı olan bir fonksiyon, kodu okuyan birinin ne yaptığını anlamasını kolaylaştırır. Ve böyle bir fonksiyon, sadece bu belirli program için değil, daha fazla durumda da kullanışlıdır. Örneğin, sayıların güzelce hizalanmış tablolarını konsola yazdırmaya yardımcı olmak için de kullanabilirsiniz.

{{index [interface, design]}}

İşlevimiz ne kadar zeki ve çok yönlü olmalıdır? Çok basit sadece üç karakter genişliğinde bir sayı dolgusunu yapabilen bir fonksiyondan karmaşık genelleştirilmiş tam olmayan sayıları, negatif satıları, tam olmayan sayılardaki noktaları, farklı karakterlerle dolgu yapmayı da halledebilen bir sayı biçimlendirme sistemi oluşturmaya kadar her şeyi yazabiliriz.

Kullanışlı bir prensip, kesinlikle ihtiyacınız olduğundan emin olmadıkça, zekiğe girmemektir. Karşılaştığınız her işlev için genel "((çerçeve))ler" yazma dürtüsüne karşı koyun. Eğer bu prensipi takip etmezseniz gerçekten bir iş yapamayıp - sadece hiç kullanmayacağınız kod yazacaksınız.

{{id pure}}

## Fonksiyonlar ve yan etkiler

{{index "side effect", "pure function", [function, purity]}}

Fonksiyonlar, yan etkileri için çağrılanlar ve dönüş değeri için çağrılanlar olarak kabaca ikiye ayrılabilir. (Ancak hem yan etkilere sahip olmak ve hem de bir değer döndürmek kesinlikle mümkündür.)

{{index reuse}}

((Çiftlik örneğinde))ki ilk yardımcı fonksiyon olan `printZeroPaddedWithLabel`, yan etkisi için çağrılır: bir satır yazdırır. İkinci sürüm olan zeroPad`, dönüş değeri için çağrılır. İkincisinin birinciden daha fazla durumda kullanışlı olması tesadüf değildir. Değerler üreten fonksiyonlar, doğrudan yan etki yapan fonksiyonlardan daha kolay yeni şekillerde birleştirilebilmektedirler.

{{index substitution}}

Bir _saf_ fonksiyon, yalnızca yan etkisi olmayan belirli bir türde bir değer üreten bir fonksiyon değil, ayrıca diğer kodlardan yan etkileri de almayan bir işlevdir - örneğin, değeri değişebilecek global bağlantıları okumaz. Saflık fonksiyonu, aynı argümanlarla çağrıldığında her zaman aynı değeri üreten (ve başka bir şey yapmayan) hoş bir özelliğe sahiptir. Böyle bir fonksiyonun çağrısı, kodun anlamını değiştirmeden döndürdüğü değeri kullanarak değiştirilebilir. Bir saf fonksiyonun doğru çalışıp çalışmadığından emin değilseniz, onu sadece çağırarak test edebilir ve eğer bu bağlamda çalışıyorsa, herhangi bir bağlamda da çalışacağını bilirsiniz. Saf olmayan fonksiyonların test edilmesi daha fazla destekleme gerektirir.

{{index optimization, "console.log"}}

Yine de, saf olmayan fonksiyonlar yazdığınızda kötü hissetmenize gerek yok. Yan etkiler genellikle yararlıdır. Örneğin, `console.log`'un saf bir versiyonunu yazmanın bir yolu yoktur ve `console.log`'un olması iyidir. Bazı işlemler, yan etkileri kullanarak daha verimli bir şekilde ifade edilebilir.

## Özet

The `function` keyword, when used as an expression, can create a function value. When used as a statement, it can be used to declare a binding and give it a function as its value. Arrow functions are yet another way to create functions.
Bu bölüm, size kendi fonksiyonlarınızı yazmayı öğretti. `function` anahtar kelimesi, bir ifade olarak kullanıldığında bir fonksiyon değeri oluşturabilir. Bir beyan olarak kullanıldığında, bir bağlantıyı bildirmek ve ona bir fonksiyon değeri olarak vermek için kullanılabilir. Ok fonksiyonlarıysa fonksiyon oluşturmanın başka bir yoludur.

```
// Define f to hold a function value
const f = function(a) {
  console.log(a + 2);
};

// Declare g to be a function
function g(a, b) {
  return a * b * 3.5;
}

// A less verbose function value
let h = a => a % 3;
```

İşlevleri anlamanın temel yönlerinden biri kapsamları anlamaktır. Her blok yeni bir kapsam oluşturur. Bir kapsam içindeki parametreler ve bağlantılar yerel olup dışarıdan görünmez. `var` ile bildirilen bağlantılar farklı davranır - bunlar en yakın fonksiyon kapsamına veya global kapsama yerleşirler.

Programınızın yaptığı görevleri farklı fonksiyonlara ayırmak yararlıdır. Kendinizi tekrar etmek zorunda kalmazsınız ve fonksiyonlar, kodu belirli şeyler yapan parçalara gruplayarak bir programı düzenlemenize yardımcı olabilir.

## Egzersizler

### Minimum

{{index "Math object", "minimum (exercise)", "Math.min function", minimum}}

[Önceki bölüm](program_structure#return_values), en küçük verilen argümanını döndüren standart `Math.min` işlevini tanıttı. Şimdi buna benzer bir şey yapabiliriz. İki argüman alan ve bunların minimumunu döndüren `min` adında bir fonksiyon yazın.

{{if interactive

```{test: no}
// Kodunuz buraya.

console.log(min(0, 10));
// → 0
console.log(min(0, -10));
// → -10
```

if}}

{{hint

{{index "minimum (exercise)"}}

Eğer süslü parantezleri ve normal parantezleri doğru yerlere koyarak bir geçerli fonksiyon tanımı elde etmekte zorlanıyorsanız, bir önceki bölümdeki örneklerden birini kopyalayıp onu değiştirerek başlayabilirsiniz.

{{index "return keyword"}}

Bir fonksiyon birden fazla `return` beyanını içinde bulundurabilir.

hint}}

### Özyineleme

{{index recursion, "isEven (exercise)", "even number"}}

`%` (kalan işlemcisi) operatörünün bir sayının çift mi yoksa tek mi olduğunu test etmek için 2'ye bölünüp bölünmediğini anlamak adına `% 2` kullanılabileceğini gördük. İşte bir pozitif tam sayının çift veya tek olup olmadığını tanımlamanın başka bir yolu:

- Sıfır çifttir.

- Bir tektir.

- Herhangi bir _N_ sayısı için _N_ - 2 çifttir.

Bu tanıma karşılık gelen özyinelemeli bir fonksiyon olan `isEven` fonksiyonunu tanımlayın. Fonksiyon tek bir parametre kabul etmeli (pozitif, tam sayı) ve Bir Boole değeri döndürmelidir.

{{index "stack overflow"}}

Fonksiyonu 50 ve 75 üzerinde test edin. -1'de nasıl davrandığını görün. Neden? Bunun nasıl düzeltilebileceğini düşünebilir misiniz?

{{if interactive

```{test: no}
// Kodunuz buraya.

console.log(isEven(50));
// → true
console.log(isEven(75));
// → false
console.log(isEven(-1));
// → ??
```

if}}

{{hint

{{index "isEven (exercise)", ["if keyword", chaining], recursion}}

Fonksiyonunuz muhtemelen bu bölümdeki özyinelemeli `findSolution` [örneğindeki](functions#recursive_puzzle) iç `find` fonksiyona oldukça benzer görünecek ve üç durumdan hangisinin uygulandığını test eden bir `if/else` `if/else` zinciri ile olacak. Üçüncü duruma karşılık gelen son `else`, özyinelemeli çağrıyı yapar. Her bir dal, belirli bir değerin döndürülmesini sağlamak için bir `return` beyanı içermelidir veya başka bir şekilde düzenlenmelidir.

{{index "stack overflow"}}

Negatif bir sayı verildiğinde, fonksiyon kendisine negatif bir sayı vererek tekrar tekrar özyinelemeye girecek, böylece sonuç döndürmekten giderek daha uzaklaşacaktır. Sonunda, yığın alanı tükenecek ve işlem iptal edilecektir.

hint}}

### Fasulye sayımı

{{index "bean counting (exercise)", [string, indexing], "zero-based counting", ["length property", "for string"]}}

Bir diziden (örneğin `string[2]` olarak) N'inci karakterini veya harfini alabilirsiniz. Elde edilen değer, yalnızca bir karakter içeren bir dizedir (örneğin, `"b"`). İlk karakterin konumu 0 olduğu için, son karakterin konumu `string.length - 1` pozisyonunda bulunur. Başka bir deyişle, iki karakterlik bir dizenin uzunluğu 2'dir ve karakterleri 0 ve 1 konumunda bulunur.

Tek bir argüman olarak bir dize alan ve dizide kaç büyük `"B"` karakteri olduğunu gösteren bir sayı döndüren `countBs` adında bir fonksiyon yazın.

Sonraki adımda, `countBs` gibi davranan ancak sadece bütük "B" dizesini saymak yerine sayılacak karakteri de belirtecek ikinci bir argüman alan `countChar` adında bir fonksiyon yazın. `countBs` işlevini bu yeni işlevi kullanacak şekilde tekrar yazın.

{{if interactive

```{test: no}
// Kodunuz buraya.

console.log(countBs("BOB"));
// → 2
console.log(countChar("kakkerlak", "k"));
// → 4
```

if}}

{{hint

{{index "bean counting (exercise)", ["length property", "for string"], "counter variable"}}

İşleviniz, dizedeki her karaktere bakan bir ((döngü)) gerektirecektir. Döngü, sıfırdan dizenin uzunluğunun bir altına kadar bir dizini çalıştırabilir (`< string.length`). Mevcut konumdaki karakter fonksiyonun aradığı karakterle aynıysa, sayaç bağlantısındaki değeri 1 artırır. Döngü tamamlandığında, sayaç sonuç olarak `return` beyanı aracılığıyla döndürülebilir.

{{index "local binding"}}

Fonksiyonda kullanılan tüm bağlantıların `let` veya `const` anahtar kelimelerini kullanarak düzgün bir şekilde fonksiyon içerisinde yerel halde olmasını sağlayın.

hint}}
