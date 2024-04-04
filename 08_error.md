{{meta {load_files: ["code/chapter/08_error.js"]}}}

# Sorun ve hatalar

{{quote {author: "Brian Kernighan and P.J. Plauger", title: "Programlama Stilinin Unsurları", chapter: true}

Hata ayıklama, kodu başlangıçta yazmaktan iki kat daha zordur. Bu nedenle, mümkün olduğunca zeki bir şekilde kod yazarsanız, onu ayıklamak için yeterince zeki olmayacaksınız.

quote}}

{{figure {url: "img/chapter_picture_8.jpg", alt: "Çeşitli böcekleri ve bir kırkayağı gösteren illüstrasyon", chapter: framed}}}

{{index "Kernighan, Brian", "Plauger, P.J.", debugging, "error handling"}}

Bilgisayar programlarındaki hatalar genellikle _((hata))_ olarak adlandırılır. Onları işimizin içine sürünen küçük şeyler olarak hayal etmek programcıların kendilerini iyi hissetmelerini sağlar. Gerçekte ise, tabii ki, onları kendimiz koyarız.

Bir program kristalleşmiş düşüncelerse, hataları düşüncelerin karıştırılması nedeniyle veya bir düşüncenin kod haline getirilirken yapılan hatalar nedeniyle oluşan hatalar olarak kabaca sınıflandırabilirsiniz. İlk tür genellikle ikincisinden daha zor teşhis edilir ve düzeltilir.

## Dil

{{index parsing, analysis}}

Bilgisayar, ne yapmaya çalıştığımız hakkında yeterince bilgiye sahip olsaydı, birçok hatayı otomatik olarak bize gösterebilirdi. Ancak burada JavaScript'in gevşekliği bir engeldir. Bağlantılarının ve özelliklerinin kavramlarının belirsizliği, programı çalıştırmadan önce nadiren ((yazım hatalarını)) yakalar. Ve hatta öyle olsa bile, size `true * "monkey"` gibi açıkça mantıksız şeyleri yapmanıza izin verir, şikayet etmez.

{{index [syntax, error], [property, access]}}

JavaScript'in şikayet ettiği bazı şeyler vardır. Dilin ((sözdizimi))ni izlemeyen bir program yazmak bilgisayarın hemen şikayet etmesini sağlar. Başka şeylere olarak örneğin fonksiyon olmayan bir şeyi çağırmak veya bir ((undefined)) değerinde özellik aramak, program harekete geçtiğinde bir hataya neden olur.

{{index NaN, error}}

Ancak genellikle, bu saçma hesaplama sadece `NaN` (sayı değil) veya tanımsız bir değer üretirken, program yaptığı şeyin anlamlı olduğuna ikna olmuş ve mutlu bir halde devam eder. Hata, sadece sahte değer birkaç fonksiyondan geçtikten sonra kendini gösterir. Hata hiç tetiklenmeyebilir, ancak sessizce programın çıktısını yanlış yapabilir. Bu tür sorunların kaynağını bulmak zor olabilir.

Programlardaki hataları bulma sürecine ((hata ayıklama)) denir.

## Katı mod

{{index "strict mode", [syntax, error], function}}

{{indexsee "use strict", "strict mode"}}

JavaScript, _katı modu_ etkinleştirilerek _biraz_ daha katı hale getirilebilir. Bunun için dosyanın veya fonksiyon gövdesinin üstüne `"use strict"` dizesini koymak yeterlidir. İşte bir örnek:

```{test: "error \"ReferenceError: counter is not defined\""}
function canYouSpotTheProblem() {
  "use strict";
  for (counter = 0; counter < 10; counter++) {
    console.log("Happy happy");
  }
}

canYouSpotTheProblem();
// → ReferenceError: counter is not defined
```

{{index "let keyword", [binding, global]}}

Normalde, örnekte olduğu gibi bağlantının önüne `let` koymayı unuttuğunuzda, JavaScript sessizce genel bir bağlantı oluşturur ve onu kullanır. Katı modda ise, bir ((hata)) bildirilir. Bu çok yardımcı olur. Bununla birlikte, söz konusu bağlantı zaten kapsamın başka bir yerinde varsa, bu durumda döngü hala sessizce bağlantının değerini üzerine yazar.

{{index "this binding", "global object", undefined, "strict mode"}}

Katı moddaki başka bir değişiklik, `this` bağlantısının, ((metod)) olarak çağrılmayan fonksiyonlarda `undefined` değerini taşımasıdır. Bu tür bir çağrıyı katı mod dışında yaparken, `this` küresel kapsam nesnesine atıfta bulunur, bu da özellikleri küresel bağlantılardan oluşan bir nesnedir. Dolayısıyla, katı modda bir yöntemi veya `constructor` fonksiyonunu yanlışlıkla yanlış bir şekilde çağırırsanız, JavaScript, küresel kapsama değerler yazmak yerine `this` bağlantısından bir şey okumaya çalışıldığında hemen bir hata üretir.

Örneğin aşağıdaki kodu düşünün, `new` anahtar kelimesi olmadan ((constructor)) fonksiyonunu çağırır, böylece `this` bağlantısı _yeni_ oluşturulan bir nesneye atanmaz:

```
function Person(name) { this.name = name; }
let ferdinand = Person("Ferdinand"); // oops
console.log(name);
// → Ferdinand
```

{{index error}}

Bu nedenle, `Person` constructor fonksiyonuna yapılan yanlış çağrı başarılı oldu, ancak tanımsız bir değer döndü ve `name` adında bir küresel bir bağlantı oluşturdu. Katı modda, sonuç farklıdır.

```{test: "error \"TypeError: Cannot set properties of undefined (setting 'name')\""}
"use strict";
function Person(name) { this.name = name; }
let ferdinand = Person("Ferdinand"); // forgot new
// → TypeError: Cannot set property 'name' of undefined
```

Hemen bir şeyin yanlış olduğu bize bildirilir. Bu yardımcı olur.

Neyse ki, `class` notasyonuyla oluşturulan constructor fonksiyonları `new` olmadan çağrıldığında her zaman bir şikayet bildirir, bu da bu sorunun katı mod dışında olmamıza rağmen engellenmesini sağlar.

{{index parameter, [binding, naming], "with statement"}}

Katı mod birkaç başka şey daha yapar. Bir fonksiyona aynı isimli birden fazla parametre vermenizi engeller ve bazı sorunlu dil özelliklerini tamamen kaldırır (örneğin, çok yanlış olan ve bu kitapta daha fazla tartışılmayacak olan `with` ifadesi gibi).

{{index debugging}}

Kısacası, programınızın başına `"use strict"` koymak nadiren zarar verir ve bir sorunu fark etmenize yardımcı olabilir.

## Tipler

Bazı diller, bir programı çalıştırmadan önce tüm bağlantılarınızın ve ifadelerinizin türlerini bilmek ister. Bir türün tutarsız bir şekilde kullanıldığı durumlar hemen belirtilir. JavaScript, türleri sadece programı çalıştırırken dikkate alır ve hatta orada bile sıklıkla değerleri beklediği türe implicit bir şekilde dönüştürmeye çalışır, bu yüzden çok yardımcı olmaz.

Yine de türler programlar hakkında konuşmak adına kullanışlı bir çerçeve sağlar. Birçok hata, bir fonksiyona giren veya çıkan değer türü hakkında kafanız karıştığında gelir. Bu bilgiyi yazılı olarak belirtirseniz, kafanız karışma olasılığınız daha az olur.

Önceki bölümdeki `findRoute` fonksiyonunun türünü açıklamak için, aşağıdaki gibi bir yorum ekleyebilirsiniz:

```
// (graph: Object, from: string, to: string) => string[]
function findRoute(graph, from, to) {
  // ...
}
```

JavaScript programlarını türlerle işaretlemenin birkaç farklı üzerine anlaşılmış ve sıklıkla kullanılan yolları vardır.

Türler hakkında bir şey, yararlı olacak kadar yeterli kodu açıklayabilmeleri için kendi karmaşıklıklarını tanıtmaları gerektiğidir. Bir diziden rastgele bir öğe döndüren `randomPick` fonksiyonunun türü sizce ne olmalıdır? Bunun için `randomPick` fonksiyonuna herhangi bir tür değeri alabilecek bir ((tür değişkeni)) `T` tanıtmalısınız ki `randomPick` fonksiyonuna `(T[]) → T` (*T* türünde bir dizi alan ve bir *T* türünde veri döndüren fonksiyon) gibi bir tür verebilin.

{{index "type checking", TypeScript}}

{{id typing}}

Bir programın türleri bilindiğinde, bilgisayarın bunları kontrol edebilir ve program çalıştırılmadan önce hataları belirtebilir. Dilin türler ekleyen ve bunları kontrol eden birkaç JavaScript lehçeleri vardır. En popüler olanı [TypeScript](https://www.typescriptlang.org/) olarak adlandırılır. Programlarınıza daha fazla titizlik eklemek istiyorsanız, denemenizi öneririm.

Bu kitapta, ham, tehlikeli, türsüz JavaScript kodunu kullanmaya devam edeceğiz.

## Test yapma

{{index "test suite", "run-time error", automation, testing}}

Dilin kendisi hataları bulmamıza çok yardımcı olmayacaksa, zor yoldan hataları bulmak için programı çalıştırıp doğru şeyi yapıp yapmadığına bakmak durumunda kalacağız.

Bunu el ile tekrar tekrar yapmak gerçekten kötü bir fikirdir. Sadece can sıkıcı olmakla kalmaz, aynı zamanda her değişiklik yaptığınızda her şeyi kapsamlı bir şekilde test etmek çok zaman alacağından genellikle etkisiz olur.

Bilgisayarlar tekrarlayan görevlerde iyidir ve test etme ideal bir tekrarlayan görevdir. Otomatik test, başka bir programı test eden bir program yazma sürecidir. Testleri yazmak manuel olarak test etmekten biraz daha fazla çalışma gerektirir, ancak bir kez yaptıktan sonra, bir tür süper güç kazanırsınız: programınızın hala yazdığınız tüm durumlarda doğru şekilde davrandığını doğrulamak için sadece birkaç saniyenizi alır. Bir şeyi bozarsanız başka bir zamanda rastgele karşılaşmak yerine hemen fark edersiniz.

{{index "toUpperCase method"}}

Testler genellikle kodunuzun bazı yönlerini doğrulayan küçük etiketli programlar şeklinde olur. Örneğin, (standart olarak dilin içinde bulunan ve zaten muhtemelen başka biri tarafından zaten test edilmiş olan) `toUpperCase` metodunun bir dizi testi şöyle olabilir:

```
function test(label, body) {
  if (!body()) console.log(`Failed: ${label}`);
}

test("convert Latin text to uppercase", () => {
  return "hello".toUpperCase() == "HELLO";
});
test("convert Greek text to uppercase", () => {
  return "Χαίρετε".toUpperCase() == "ΧΑΊΡΕΤΕ";
});
test("don't convert case-less characters", () => {
  return "مرحبا".toUpperCase() == "مرحبا";
});
```

{{index "domain-specific language"}}

Böyle testler yazmak genellikle oldukça tekrarlayan garip kodlar üretir. Neyse ki, test koleksiyonları oluşturmanıza ve çalıştırmanıza yardımcı olan yazılım parçaları vardır (_((test paketleri))_), testleri ifade etmek için fonksiyonlar ve metotlar şeklinde uygun bir dil sağlayar ve bir test başarısız olduğunda bilgilendirici bilgiler verir. Bunlar genellikle _((test çalıştırıcıları))_ olarak adlandırılır.

{{index "persistent data structure"}}

Bazı kodlar diğer kodlardan daha kolay test edilir. Genellikle, kodun etkileşimde bulunduğu daha fazla harici nesne varsa, test etmek için o çevreyi kurmak daha zordur. [Önceki bölümde](robot) gösterilen programlama tarzı, değişen nesneler yerine kendi başına kalıcı değerler kullandığı için test etmesi daha kolaydır.

## Hata ayıklama

{{index debugging}}

Programınızın yanlış davrandığını veya hatalar ürettiğini fark ettiğinizde, bir sonraki adım sorunun _ne_ olduğunu bulmaktır.

Bazen bu açıktır. ((Hata)) mesajı programınızın belirli bir satırına işaret eder ve hata açıklamasıyla o kod satırına baktığınızda, genellikle sorunu görebilirsiniz.

{{index "run-time error"}}

Ancak her zaman değil. Bazen sorunu tetikleyen satır, başka bir yerde üretilen bir tutarsız değerin geçersiz bir şekilde kullanıldığı ilk yerdir. Daha önceki bölümlerdeki ((alıştırmaları)) çözüyorsanız, muhtemelen böyle durumlarla zaten karşılaşmışsınızdır.

{{index "decimal number", "binary number"}}

The following example program tries to convert a whole number to a stri ng in a given base (decimal, binary, and so on) by repeatedly picking out the last ((digit)) and then dividing the number to get rid of this digit. But the strange output that it currently produces suggests that it has a ((bug)).
Aşağıdaki örnek program, bir tam sayıyı son ((basamağı)) seçip bu basamağı atmak için numarayı bölerek verilen bir tabandaki (onluk, ikili, vb.) bir dizeye dönüştürmeyi deniyor. Ancak şu anda tuhaf çıktılar ürettiği için bir ((hata)) olduğunu gösterir.

```
function numberToString(n, base = 10) {
  let result = "", sign = "";
  if (n < 0) {
    sign = "-";
    n = -n;
  }
  do {
    result = String(n % base) + result;
    n /= base;
  } while (n > 0);
  return sign + result;
}
console.log(numberToString(13, 10));
// → 1.5e-3231.3e-3221.3e-3211.3e-3201.3e-3191.3e-3181.3…
```

{{index analysis}}

Sorunu zaten görseniz bile, bir an için görmemiş gibi davranın. Programımızın yanlış çalıştığını biliyoruz ve neden olduğunu bulmak istiyoruz.

{{index "trial and error"}}

Burada kodu rastgele değiştirerek durumu düzeltecek mi girişimlerine direnmelisiniz. Bunun yerine _düşünün_. Neler olduğunu analiz edin ve neden olduğuna dair bir ((teori)) ortaya koyun. Daha sonra, bu teoriyi test etmek için ek gözlemler yapın—veya henüz bir teoriniz yoksa, bir teori üretmenize yardımcı olacak ek gözlemler yapın.

{{index "console.log", output, debugging, logging}}

Programa stratejik birkaç `console.log` çağrısı eklemek, programın ne yaptığı hakkında ek bilgi almanın iyi bir yoludur. Bu durumda, `n`'in `13`, `1` ve ardından `0` değerlerini almasını istiyoruz. Hadi döngünün başında değerini konsola yazdıralım.

```{lang: null}
13
1.3
0.13
0.013
…
1.5e-323
```

{{index rounding}}

_Doğru_. 13'ü 10'a bölmek bir tam sayı üretmez. `n /= base` yerine, `n = Math.floor(n / taban)` istediğimiz şeydir, böylece sayı uygun şekilde sağa "kaydırılır".

{{index "JavaScript console", "debugger statement"}}

Programın davranışına bakmanın `console.log` kullanmaktan başka bir yolu da, tarayıcınızın _hata ayıklayıcı_ yeteneklerini kullanmaktır. Tarayıcılar, kodunuzun belirli bir satırında _((kesme noktası))_ ayarlama yeteneğine sahiptir. Programın yürütmesi, bir kesme noktası olan bir satıra ulaştığında durur ve bu noktadaki bağlantıların değerlerini inceleyebilirsiniz. Ayrıntılara girmeyeceğim çünkü hata ayıklayıcılar tarayıcıdan tarayıcıya değişir, ancak tarayıcınızın ((geliştirici araçları))nda arayın veya Web'de talimatları arayın.

Başka bir kesme noktası ayarlamak için programınıza bir `debugger` ifadesi (yalnızca bu anahtar kelime) eklemektir. Tarayıcınızın ((geliştirici araçları)) etkinse, program böyle bir ifadeye ulaştığında duracaktır.

## Hata yayılımı

{{index input, output, "run-time error", error, validation}}

Üzülerek söylemeliyim ki, tüm sorunlar programcı tarafından önlenebilir değildir. Programınızın dış dünya ile iletişim kurması durumunda, hatalı giriş almak, iş yüküyle aşırı yüklenmek veya internet ağının başarısız olması mümkündür.

{{index "error recovery"}}

Sadece kendiniz için programlama yapıyorsanız, bu tür sorunları oluşuncaya kadar görmezden gelebilirsiniz. Ancak başkaları tarafından kullanılacak bir şey inşa ederseniz, genellikle programın sadece çökmekten daha iyi bir şey yapmasını istersiniz. Bazen doğru şey, verilen yanlış değeri kabul edip çalışmaya devam etmektir. Diğer durumlarda, kullanıcıya neyin yanlış gittiğini bildirmek ve ardından vazgeçmektir. Ancak her iki durumda da, program, soruna yanıt olarak aktif olarak bir şey yapmak zorundadır.

{{index "promptNumber function", validation}}

Örneğin, kullanıcıdan bir sayı isteyen ve onu döndüren bir `promptNumber` fonksiyonunuz olsun. Kullanıcı "orange" yazarsa ne yapmalıdır?

{{index null, undefined, "return value", "special return value"}}

Bir seçenek, ona özel bir değer döndürmektir. Bu tür değerler için yaygın seçimler `null`, `undefined` veya `-1`'dir.

```{test: no}
function promptNumber(question) {
  let result = Number(prompt(question));
  if (Number.isNaN(result)) return null;
  else return result;
}

console.log(promptNumber("How many trees do you see?"));
```

Şimdi, `promptNumber` çağıran kodun, gerçekten bir sayı alınıp alınmadığını kontrol etmesi ve bunun başarısız olduğu durumda nasıl kurtarılacağını bir şekilde düzeltmesi gerekir—belki tekrar sorarak veya bir varsayılan bir değerle doldurarak. Ya da istenilenin yapılamadığını belirtmek için tekrar _kendisini çağrıran_ yere özel bir değer döndürebilir. 

{{index "error handling"}}

Bir genellikle hata döndüren bir fonksiyonu çağıran ve bu hataları dikkate alan fonksiyonlar için, başarısız olan çağırılan fonksiyondan özel değerler döndürmek hatayı belirtmek için iyi bir yöntemdir. Ancak tabii ki, bunun da olumsuz yanları var. Birinci olarak, ya çağırılan bu fonksiyon her türlü herhangi bir değer döndürebiliyorsa? Böyle bir fonksiyonda başarıyı başarısızlıktan ayırt etmek için iterator arayüzündeki `next` metodunda da olduğu gibi sonucu bir nesnenin içine almak gibi bir şey yapmanız gerekir.

```
function lastElement(array) {
  if (array.length == 0) {
    return {failed: true};
  } else {
    return {value: array[array.length - 1]};
  }
}
```

{{index "special return value", readability}}

Özel değerler döndürmenin ikinci sorunu, garip gözüken kodla sonuçlanabilir olmasıdır. Bir kod parçası `promptNumber`'ı 10 kez çağırırsa, 10 kez `null` değerinin döndürülüp döndürülmediğini kontrol etmesi gerekir. Ve eğer `null` bulursa verdiği yanıt sadece `null`'u döndürmekse, o fonksiyonu çağıran fonksiyonlar da onu kontrol etmek zorunda kalacak ve bu da böylece devam edecek.

## İstisnalar

{{index "error handling"}}

When a function cannot proceed normally, what we would often _like_ to do is just stop what we are doing and immediately jump to a place that knows how to handle the problem. This is what _((exception handling))_ does.

{{index ["control flow", exceptions], "raising (exception)", "throw keyword", "call stack"}}

Exceptions are a mechanism that makes it possible for code that runs into a problem to _raise_ (or _throw_) an exception. An exception can be any value. Raising one somewhat resembles a super-charged return from a function: it jumps out of not just the current function but also its callers, all the way down to the first call that started the current execution. This is called _((unwinding the stack))_. You may remember the stack of function calls that was mentioned in [Chapter ?](functions#stack). An exception zooms down this stack, throwing away all the call contexts it encounters.

{{index "error handling", [syntax, statement], "catch keyword"}}

If exceptions always zoomed right down to the bottom of the stack, they would not be of much use. They'd just provide a novel way to blow up your program. Their power lies in the fact that you can set "obstacles" along the stack to _catch_ the exception as it is zooming down. Once you've caught an exception, you can do something with it to address the problem and then continue to run the program.

Bir örnek:

{{id look}}
```
function promptDirection(question) {
  let result = prompt(question);
  if (result.toLowerCase() == "left") return "L";
  if (result.toLowerCase() == "right") return "R";
  throw new Error("Invalid direction: " + result);
}

function look() {
  if (promptDirection("Which way?") == "L") {
    return "a house";
  } else {
    return "two angry bears";
  }
}

try {
  console.log("You see", look());
} catch (error) {
  console.log("Something went wrong: " + error);
}
```

{{index "exception handling", block, "throw keyword", "try keyword", "catch keyword"}}

The `throw` keyword is used to raise an exception. Catching one is done by wrapping a piece of code in a `try` block, followed by the keyword `catch`. When the code in the `try` block causes an exception to be raised, the `catch` block is evaluated, with the name in parentheses bound to the exception value. After the `catch` block finishes—or if the `try` block finishes without problems—the program proceeds beneath the entire `try/catch` statement.

{{index debugging, "call stack", "Error type"}}

In this case, we used the `Error` ((constructor)) to create our exception value. This is a ((standard)) JavaScript constructor that creates an object with a `message` property. Instances of `Error` also gather information about the call stack that existed when the exception was created, a so-called _((stack trace))_. This information is stored in the `stack` property and can be helpful when trying to debug a problem: it tells us the function where the problem occurred and which functions made the failing call.

{{index "exception handling"}}

Note that the `look` function completely ignores the possibility that `promptDirection` might go wrong. This is the big advantage of exceptions: error-handling code is necessary only at the point where the error occurs and at the point where it is handled. The functions in between can forget all about it.

Well, almost...

## İstisnalardan sonra temizlik

{{index "exception handling", "cleaning up", ["control flow", exceptions]}}

The effect of an exception is another kind of control flow. Every action that might cause an exception, which is pretty much every function call and property access, might cause control to suddenly leave your code.

This means when code has several side effects, even if its "regular" control flow looks like they'll always all happen, an exception might prevent some of them from taking place.

{{index "banking example"}}

Here is some really bad banking code.

```{includeCode: true}
const accounts = {
  a: 100,
  b: 0,
  c: 20
};

function getAccount() {
  let accountName = prompt("Enter an account name");
  if (!Object.hasOwn(accounts, accountName)) {
    throw new Error(`No such account: ${accountName}`);
  }
  return accountName;
}

function transfer(from, amount) {
  if (accounts[from] < amount) return;
  accounts[from] -= amount;
  accounts[getAccount()] += amount;
}
```

The `transfer` function transfers a sum of money from a given account to another, asking for the name of the other account in the process. If given an invalid account name, `getAccount` throws an exception.

But `transfer` _first_ removes the money from the account and _then_ calls `getAccount` before it adds it to another account. If it is broken off by an exception at that point, it'll just make the money disappear.

That code could have been written a little more intelligently, for example by calling `getAccount` before it starts moving money around. But often problems like this occur in more subtle ways. Even functions that don't look like they will throw an exception might do so in exceptional circumstances or when they contain a programmer mistake.

One way to address this is to use fewer side effects. Again, a programming style that computes new values instead of changing existing data helps. If a piece of code stops running in the middle of creating a new value, no existing data structures were damaged, making it easier to recover.

{{index block, "try keyword", "finally keyword"}}

But that isn't always practical. So there is another feature that `try` statements have. They may be followed by a `finally` block either instead of or in addition to a `catch` block. A `finally` block says "no matter _what_ happens, run this code after trying to run the code in the `try` block."

```{includeCode: true}
function transfer(from, amount) {
  if (accounts[from] < amount) return;
  let progress = 0;
  try {
    accounts[from] -= amount;
    progress = 1;
    accounts[getAccount()] += amount;
    progress = 2;
  } finally {
    if (progress == 1) {
      accounts[from] += amount;
    }
  }
}
```

This version of the function tracks its progress, and if, when leaving, it notices that it was aborted at a point where it had created an inconsistent program state, it repairs the damage it did.

Note that even though the `finally` code is run when an exception is thrown in the `try` block, it does not interfere with the exception. After the `finally` block runs, the stack continues unwinding.

{{index "exception safety"}}

Writing programs that operate reliably even when exceptions pop up in unexpected places is hard. Many people simply don't bother, and because exceptions are typically reserved for exceptional circumstances, the problem may occur so rarely that it is never even noticed. Whether that is a good thing or a really bad thing depends on how much damage the software will do when it fails.

## Seçici yakalama

{{index "uncaught exception", "exception handling", "JavaScript console", "developer tools", "call stack", error}}

When an exception makes it all the way to the bottom of the stack without being caught, it gets handled by the environment. What this means differs between environments. In browsers, a description of the error typically gets written to the JavaScript console (reachable through the browser's Tools or Developer menu). Node.js, the browserless JavaScript environment we will discuss in [Chapter ?](node), is more careful about data corruption. It aborts the whole process when an unhandled exception occurs.

{{index crash, "error handling"}}

For programmer mistakes, just letting the error go through is often the best you can do. An unhandled exception is a reasonable way to signal a broken program, and the JavaScript console will, on modern browsers, provide you with some information about which function calls were on the stack when the problem occurred.

{{index "user interface"}}

For problems that are _expected_ to happen during routine use, crashing with an unhandled exception is a terrible strategy.

{{index [function, application], "exception handling", "Error type", [binding, undefined]}}

Invalid uses of the language, such as referencing a nonexistent binding, looking up a property on `null`, or calling something that's not a function, will also result in exceptions being raised. Such exceptions can also be caught.

{{index "catch keyword"}}

When a `catch` body is entered, all we know is that _something_ in our `try` body caused an exception. But we don't know _what_ did or _which_ exception it caused.

{{index "exception handling"}}

JavaScript (in a rather glaring omission) doesn't provide direct support for selectively catching exceptions: either you catch them all or you don't catch any. This makes it tempting to _assume_ that the exception you get is the one you were thinking about when you wrote the `catch` block.

{{index "promptDirection function"}}

But it might not be. Some other ((assumption)) might be violated, or you might have introduced a bug that is causing an exception. Here is an example that _attempts_ to keep on calling `promptDirection` until it gets a valid answer:

```{test: no}
for (;;) {
  try {
    let dir = promtDirection("Where?"); // ← typo!
    console.log("You chose ", dir);
    break;
  } catch (e) {
    console.log("Not a valid direction. Try again.");
  }
}
```

{{index "infinite loop", "for loop", "catch keyword", debugging}}

The `for (;;)` construct is a way to intentionally create a loop that doesn't terminate on its own. We break out of the loop only when a valid direction is given. _But_ we misspelled `promptDirection`, which will result in an "undefined variable" error. Because the `catch` block completely ignores its exception value (`e`), assuming it knows what the problem is, it wrongly treats the binding error as indicating bad input. Not only does this cause an infinite loop, it  "buries" the useful error message about the misspelled binding.

As a general rule, don't blanket-catch exceptions unless it is for the purpose of "routing" them somewhere—for example, over the network to tell another system that our program crashed. And even then, think carefully about how you might be hiding information.

{{index "exception handling"}}

So we want to catch a _specific_ kind of exception. We can do this by checking in the `catch` block whether the exception we got is the one we are interested in and rethrowing it otherwise. But how do we recognize an exception?

We could compare its `message` property against the ((error)) message we happen to expect. But that's a shaky way to write code—we'd be using information that's intended for human consumption (the message) to make a programmatic decision. As soon as someone changes (or translates) the message, the code will stop working.

{{index "Error type", "instanceof operator", "promptDirection function"}}

Rather, let's define a new type of error and use `instanceof` to identify it.

```{includeCode: true}
class InputError extends Error {}

function promptDirection(question) {
  let result = prompt(question);
  if (result.toLowerCase() == "left") return "L";
  if (result.toLowerCase() == "right") return "R";
  throw new InputError("Invalid direction: " + result);
}
```

{{index "throw keyword", inheritance}}

The new error class extends `Error`. It doesn't define its own constructor, which means that it inherits the `Error` constructor, which expects a string message as argument. In fact, it doesn't define anything at all—the class is empty. `InputError` objects behave like `Error` objects, except that they have a different class by which we can recognize them.

{{index "exception handling"}}

Now the loop can catch these more carefully.

```{test: no}
for (;;) {
  try {
    let dir = promptDirection("Where?");
    console.log("You chose ", dir);
    break;
  } catch (e) {
    if (e instanceof InputError) {
      console.log("Not a valid direction. Try again.");
    } else {
      throw e;
    }
  }
}
```

{{index debugging}}

This will catch only instances of `InputError` and let unrelated exceptions through. If you reintroduce the typo, the undefined binding error will be properly reported.

## İddialar

{{index "assert function", assertion, debugging}}

_Assertions_ are checks inside a program that verify that something is the way it is supposed to be. They are used not to handle situations that can come up in normal operation but to find programmer mistakes.

If, for example, `firstElement` is described as a function that should never be called on empty arrays, we might write it like this:

```
function firstElement(array) {
  if (array.length == 0) {
    throw new Error("firstElement called with []");
  }
  return array[0];
}
```

{{index validation, "run-time error", crash, assumption}}

Now, instead of silently returning undefined (which you get when reading an array property that does not exist), this will loudly blow up your program as soon as you misuse it. This makes it less likely for such mistakes to go unnoticed and easier to find their cause when they occur.

I do not recommend trying to write assertions for every possible kind of bad input. That'd be a lot of work and would lead to very noisy code. You'll want to reserve them for mistakes that are easy to make (or that you find yourself making).

## Özet

An important part of programming is finding, diagnosing, and fixing bugs. Problems can become easier to notice if you have an automated test suite or add assertions to your programs.

Problems caused by factors outside the program's control should usually be actively planned for. Sometimes, when the problem can be handled locally, special return values are a good way to track them. Otherwise, exceptions may be preferable.

Throwing an exception causes the call stack to be unwound until the next enclosing `try/catch` block or until the bottom of the stack. The exception value will be given to the `catch` block that catches it, which should verify that it is actually the expected kind of exception and then do something with it. To help address the unpredictable control flow caused by exceptions, `finally` blocks can be used to ensure that a piece of code _always_ runs when a block finishes.

## Egzersizler

### Yeniden deneme

{{index "primitiveMultiply (exercise)", "exception handling", "throw keyword"}}

Say you have a function `primitiveMultiply` that in 20 percent of cases multiplies two numbers and in the other 80 percent of cases raises an exception of type `MultiplicatorUnitFailure`. Write a function that wraps this clunky function and just keeps trying until a call succeeds, after which it returns the result.

{{index "catch keyword"}}

Make sure you handle only the exceptions you are trying to handle.

{{if interactive

```{test: no}
class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure("Klunk");
  }
}

function reliableMultiply(a, b) {
  // Your code here.
}

console.log(reliableMultiply(8, 8));
// → 64
```
if}}

{{hint

{{index "primitiveMultiply (exercise)", "try keyword", "catch keyword", "throw keyword"}}

The call to `primitiveMultiply` should definitely happen in a `try` block. The corresponding `catch` block should rethrow the exception when it is not an instance of `MultiplicatorUnitFailure` and ensure the call is retried when it is.

To do the retrying, you can either use a loop that stops only when a call succeeds—as in the [`look` example](error#look) earlier in this chapter—or use ((recursion)) and hope you don't get a string of failures so long that it overflows the stack (which is a pretty safe bet).

hint}}

### Kilitli kutu

{{index "locked box (exercise)"}}

Consider the following (rather contrived) object:

```
const box = new class {
  locked = true;
  #content = [];

  unlock() { this.locked = false; }
  lock() { this.locked = true;  }
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this.#content;
  }
};
```

{{index "private property", "access control"}}

It is a ((box)) with a lock. There is an array in the box, but you can get at it only when the box is unlocked.

{{index "finally keyword", "exception handling"}}

Write a function called `withBoxUnlocked` that takes a function value as argument, unlocks the box, runs the function, and then ensures that the box is locked again before returning, regardless of whether the argument function returned normally or threw an exception.

{{if interactive

```
const box = new class {
  locked = true;
  #content = [];

  unlock() { this.locked = false; }
  lock() { this.locked = true;  }
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this.#content;
  }
};

function withBoxUnlocked(body) {
  // Your code here.
}

withBoxUnlocked(() => {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(() => {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised: " + e);
}
console.log(box.locked);
// → true
```

if}}

For extra points, make sure that if you call `withBoxUnlocked` when the box is already unlocked, the box stays unlocked.

{{hint

{{index "locked box (exercise)", "finally keyword", "try keyword"}}

This exercise calls for a `finally` block. Your function should first unlock the box and then call the argument function from inside a `try` body. The `finally` block after it should lock the box again.

To make sure we don't lock the box when it wasn't already locked, check its lock at the start of the function and unlock and lock it only when it started out locked.

hint}}
