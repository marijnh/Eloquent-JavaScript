{{meta {load_files: ["code/chapter/08_error.js"]}}}

# Sorun ve hatalar

{{quote {author: "Brian Kernighan and P.J. Plauger", title: "Programlama Stilinin Unsurları", chapter: true}

Hata ayıklama, kodu yazmaktan iki kat daha zordur. Bu nedenle, mümkün olduğunca zeki bir şekilde kod yazarsanız, onu ayıklamak için yeterince zeki olmayacaksınız.

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

```{test: "error "ReferenceError: counter is not defined""}
function canYouSpotTheProblem() {
  "use strict";
  for (counter = 0; counter < 10; counter++) {
    console.log("Happy happy");
  }
}

canYouSpotTheProblem();
// → ReferenceError: counter is not defined
```

{{index ECMAScript, compatibility}}

Code inside classes and modules (which we will discuss in [Chapter ?](modules)) is automatically strict. The old nonstrict behavior still exists only because some old code might depend on it, and the language designers work hard to avoid breaking any existing programs.

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

```{test: "error "TypeError: Cannot set properties of undefined (setting 'name')""}
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

Türler hakkında bir şey, yararlı olacak kadar yeterli kodu açıklayabilmeleri için kendi karmaşıklıklarını tanıtmaları gerektiğidir. Bir diziden rastgele bir öğe döndüren `randomPick` fonksiyonunun türü sizce ne olmalıdır? Bunun için `randomPick` fonksiyonuna herhangi bir tür değeri alabilecek bir ((tür değişkeni)) `T` tanıtmalısınız ki `randomPick` fonksiyonuna `(T[]) → T` (_T_ türünde bir dizi alan ve bir _T_ türünde veri döndüren fonksiyon) gibi bir tür verebilin.

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

Bir fonksiyon normal olarak devam edemezse, genellikle yapmak _istediğimiz_ şey, yaptığımız işi durdurmak ve hemen sorunu nasıl ele alacağını bilen bir yere atlamaktır. Bu _((istisna işleme))_ dediğimiz şeydir.

{{index ["control flow", exceptions], "raising (exception)", "throw keyword", "call stack"}}

İstisnalar, bir sorunla karşılaşan kodun bir istisna _oluşturmasını_ (veya _fırlatmasını_) mümkün kılan bir mekanizmadır. Bir istisna herhangi bir değer olabilir. Bir istisna oluşturmak, bir fonksiyondan geri dönüş yapmanın hızlandırılmış bir versiyonunu andırır: sadece mevcut fonksiyondan çıkmakla kalmaz, mevcut yürütmeyi başlatan ilk çağrıya kadar olan tüm çağıran fonksiyonlardan da çıkar. Buna _((yığını açma))_ denir. [Bölüm ?](functions#stack) içinde bahsedilen fonksiyon çağrılarının yığınını hatırlıyor olabilirsiniz. Bir istisna bu yığından hızla aşağı iner ve karşılaştığı tüm çağrı bağlamlarını atar.

{{index "error handling", [syntax, statement], "catch keyword"}}

Eğer istisnalar her zaman yığının en altına doğru ilerleselerdi, pek faydalı olmazlardı. Sadece programınızı patlatmanın yeni bir yolunu sağlarlardı. Güçleri, istisnayı aşağı inerken yığında engeller ayarlayarak onları _yakalayabilmeniz_ gerçeğinde yatar. Bir istisnayı yakaladıktan sonra, onunla bir şeyler yapabilir ve ardından programı çalıştırmaya devam edebilirsiniz.

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

`throw` anahtar kelimesi bir istisna oluşturmak için kullanılır. Bir istisna yakalamak, bir parçayı kodu `try` bloğu içine alarak yapılır, ardından `catch` anahtar kelimesi gelir. `try` bloğundaki kod bir istisna oluşturursa, `catch` bloğu, parantez içindeki ismi istisna değeri ile bağlar şekilde değerlendirilir. `catch` bloğu sorunsuz şekilde tamamlandıktan sonra—veya sorun olmadan `try` bloğu tamamlanırsa—program tüm `try/catch` ifadesinin altından devam eder.

{{index debugging, "call stack", "Error type"}}

Bu durumda, istisna değerimizi oluşturmak için `Error` ((constructor)) fonksiyonunu kullandık. Bu, bir `message` özelliğine sahip bir nesne oluşturan ((standart)) bir JavaScript constructor fonksiyonudur. `Error` örnekleri, istisna oluşturulurken var olan çağrı yığını hakkında da ayrıca bilgi toplar ve buna ((yığın izi)) denir. Bu bilgi `stack` özelliğinde depolanır ve bir sorunu gidermeye çalışırken yardımcı olabilir: bize sorunun hangi fonksiyonda meydana geldiğini ve başarısız olan çağrıyı hangi fonksiyonların yaptığını söyler.

{{index "exception handling"}}

`look` fonksiyonunun `promptDirection` fonksiyonunun yanlış gitme olasılığını tamamen göz ardı ettiğine dikkat edin. Bu, istisnaların büyük avantajı: hata işleme kodu, yalnızca hata meydana geldiği noktada ve onun ele alındığı noktada gereklidir. Aradaki işlevlerin hepsi bu sorunları unutabilir.

Yani, neredeyse...

## İstisnalardan sonra temizlik

{{index "exception handling", "cleaning up", ["control flow", exceptions]}}

Bir istisnanın etkisi başka bir tür kontrol akışıdır. Bir istisnaya neden olabilecek her eylem, yani neredeyse her fonksiyon çağrısı ve özellik erişimi, kontrolünüzü aniden kodunuzdan çıkabilir.

Bu, kodun birden fazla yan etkiye sahip olduğu durumlarda, "düzenli" kontrol akışı her zaman gerçekleşecek gibi görünse bile, bir istisna bazılarını gerçekleştirmeyi engelleyebilir demektir.

{{index "banking example"}}

İşte gerçekten kötü bir bankacılık kodu.

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

`transfer` fonksiyonu, verilen bir hesaptan başka bir hesaba bir miktar para transfer ederken, işlem sırasında diğer hesabın adını istemektedir. Geçersiz bir hesap adı verilirse, `getAccount` bir istisna fırlatmaktadır.

Ancak, `transfer` önce parayı hesaptan çıkarır ve ardından başka bir hesaba eklermeden önce `getAccount` fonksiyonunu çağırır. Eğer bu noktada bir istisna tarafından kesilirse, sadece paranın gönderen kişiden kaybolmasına sebep olur.

Bu kod biraz daha akıllıca yazılabilirdi, örneğin para hareketi yapmaya başlamadan önce `getAccount` fonksiyonunu çağırarak. Ancak bu tür sorunlar genellikle daha ince yollarla ortaya çıkar. Bir fonksiyonun bir istisna fırlatmayacağını düşündüğünüzde bile, olağanüstü durumlarda veya bir programcı hatası içerdiğinde bunu yapabilir.

Bunu ele almanın bir yolu, daha az yan etki kullanmaktır. Yine, var olan verileri değiştirmek yerine yeni değerler hesaplayan bir programlama stili yardımcı olur. Bir kod parçası, yeni bir değer oluşturma sürecinin ortasında çalışmayı durdurursa, mevcut veri yapıları zarar görmediği için kurtarmak daha kolay olur.

{{index block, "try keyword", "finally keyword"}}

Ancak bu her zaman pratik değildir. Bu yüzden `try` ifadelerinin başka bir özelliği vardır. Bunlar, bir `try` bloğuna, `catch` bloğu yerine veya ek olarak bir `finally` bloğu izleyebilirler. Bir `finally` bloğu, "ne olursa olsun, `try` bloğundaki kodu çalıştırmaya çalıştıktan sonra bu kodu çalıştır" der.

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

Bu fonksiyonun bu sürümü ilerleme durumunu takip eder ve ayrılırken, oluşturduğu tutarsız bir program durumu noktasında kesildiğini fark ederse, yaptığı zararı onarır.

Unutulmamalıdır ki, `try` bloğundaki bir istisna atıldığında bile `finally` kodunun çalıştırılmasına rağmen, istisna ile ilgilenmez. `finally` bloğu çalıştıktan sonra, yığın açılmaya devam eder.

{{index "exception safety"}}

Beklenmedik yerlerde istisna oluştuğunda dahi güvenilir şekilde çalışan programlar yazmak zordur. Birçok insan bunu genellikle önemsemez ve istisnalar genellikle olağanüstü durumlarda oluştuğundan ötürü sorun nadiren fark edilir. Bunun iyi bir şey mi yoksa gerçekten kötü bir şey mi olduğunu yazılımın başarısız olduğunda ne kadar zarar vereceğine bağlıdır.

## Seçici yakalama

{{index "uncaught exception", "exception handling", "JavaScript console", "developer tools", "call stack", error}}

Bir istisna, yakalanmadan yığının en altına kadar ulaştığında, çevre tarafından ele alınır. Bunun ne anlama geldiği çevrelere göre değişir. Tarayıcılarda, hata genellikle JavaScript konsoluna yazılır (tarayıcının Araçlar veya Geliştirici menüsünden erişilebilir). [Bölüm ?](node) içinde tartışacağımız tarayıcısız JavaScript ortamı olan Node.js, veri bozulması konusunda daha dikkatlidir. Ele alınmayan bir istisna meydana geldiğinde, tüm işlemi sonlandırır.

{{index crash, "error handling"}}

Programcı hataları için, hatanın gitmesine izin vermek çoğu zaman yapabileceğiniz en iyi şeydir. Ele alınmayan bir istisna, bozuk bir programı işaret etmenin makul bir yoludur ve JavaScript konsolu, modern tarayıcılarda, sorun meydana geldiğinde yığında hangi fonksiyon çağrılarının olduğuna dair bazı bilgiler sağlar.

{{index "user interface"}}

Rutin kullanım sırasında _meydana gelmesi beklenen_ sorunlar için, ele alınmayan bir istisna ile çökme korkunç bir stratejidir.

{{index [function, application], "exception handling", "Error type", [binding, undefined]}}

Dilin geçersiz kullanımları, var olmayan bir bağlantıya başvurmak, `null` üzerinde bir özellik aramak veya bir fonksiyon olmayan bir şeyi çağırmak gibi, aynı şekilde istisna yükseltilmesine neden olur. Böyle istisnalar da yakalanabilir.

{{index "catch keyword"}}

Bir `catch` bloğuna girildiğinde, bildiğimiz tek şey, `try` bloğundaki bir şeyin bir istisna meydana getirdiğidir. Ancak _neyin_ istisnaya sebep oluduğu veya _hangi_ istisnaya sebep olunduğunu bilmiyoruz.

{{index "exception handling"}}

JavaScript (oldukça dikkate çeker bir ihmalde), istisnaları seçici olarak yakalamak için doğrudan destek sağlamaz: ya hepsini yakalarsınız ya da hiçbirini yakalamazsınız. Bu, `catch` bloğunun yazıldığı sırada düşündüğünüz istisna olduğunu _varsaymanızı_ cazip hale getirir.

{{index "promptDirection function"}}

But it might not be. Some other ((assumption)) might be violated, or you might have introduced a bug that is causing an exception. Here is an example that _attempts_ to keep on calling `promptDirection` until it gets a valid answer:
Ancak öyle olmayabilir. Başka bir ((varsayım)) ihlal edilmiş olabilir veya bir istisnaya neden olan bir hata eklemiş olabilirsiniz. İşte, geçerli bir yanıt alana kadar `promptDirection` fonksiyonunu çağırmaya devam etmeye _çalışan_ bir örnek:

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

`for (;;)` yapısı, kendi kendine sona ermeyen bir döngü oluşturmanın kasıtlı bir yoludur. Döngüden yalnızca geçerli bir yön verildiğinde çıkarız. _Ancak_ `promptDirection` fonksiyonunu yanlış yazdık, bu da "tanımsız değişken" hatasına neden olacaktır. `catch` bloğu, tamamen istisna değerini (`e`) görmezden geldiği için, sorunun ne olduğunu varsayarak bağlantı hatasını yanlışlıkla kötü giriş olarak işler. Bu sadece sonsuz bir döngüye neden olmakla kalmaz, aynı zamanda yanlış yazılmış bağlantıyla ilgili yararlı hata mesajını "gömülmüş" hale getirir.

Genel bir kural olarak, birden fazla istisnayı genel bir şekilde yakalamayın, bunu sadece onları başka bir yere "yönlendirmek" amacıyla yapın - örneğin, programımızın çöktüğünü başka bir sisteme bildirmek için ağ üzerinden bir şey yapacaksınızdır, o zaman bu yapılabilir. Ancak o zaman bile nasıl bilgi gizleyebiliyor olduğunuzu dikkatlice düşünün.

{{index "exception handling"}}

Dolayısıyla, _belirli_ bir tür istisnayı yakalamak istiyoruz. Bunu `catch` bloğunda aldığımız istisnanın istediğimiz türde olup olmadığını kontrol ederek ve aksi takdirde yeniden fırlatarak yapabiliriz. Ancak bir istisnayı nasıl tanıyacağız?

`message` özelliğini istisnanın ((hata)) mesajına karşı beklediğimiz mesajdan kontrol edebiliriz. Ancak bu, kod yazmanın pek iyi olmayan bir yoludur - programatik bir karar vermek için insan tüketimi adına tasarlanmış bilgileri (mesajı) kullanıyor oluruz. Birisi mesajı değiştirdiğinde (veya başka bir dile çevirdiğinde), kod çalışmayı durdurur.

{{index "Error type", "instanceof operator", "promptDirection function"}}

Bunun yerine, yeni bir hata türü tanımlayalım ve bunu tanımlamak için `instanceof` kullanalım.

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

Yeni hata sınıfı `Error` sınıfından miras alır. Kendi `constructor` fonksiyonunu tanımlamaz, bu da `Error` constructor fonksiyonunu miras aldığı ve bir mesaj dizesi bekleyen `Error` constructor fonksiyonuna sahip olduğu anlamına gelir. Aslında hiçbir şeyi tanımlamaz - sınıf boştur. `InputError` nesneleri, onları tanıyabileceğimiz farklı bir sınıfa sahip olmaları dışında, `Error` nesneleri gibi davranır.

{{index "exception handling"}}

Şimdi döngü bunları daha dikkatli bir şekilde yakalayabilir.

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

Bu, yalnızca `InputError` örneklerini yakalar ve ilgili olmayan istisnaları geçirir. Yanlış yazım hatasını yeniden tanıttığınızda, tanımsız bağlantı hatası düzgün bir şekilde rapor edilir.

## İddialar

{{index "assert function", assertion, debugging}}

_İddialar_ program içinde, bir şeyin olması gerektiği gibi olduğunu doğrulayan kontrollerdir. Bunlar normal işlem sırasında ortaya çıkabilecek durumlarla başa çıkmak için değil, programcı hatalarını bulmak için kullanılır.

Örneğin, `firstElement` fonksiyonu boş diziler üzerinde asla çağrılmaması gereken bir fonksiyon olarak tanımlanmışsa, şöyle yazabiliriz:

```
function firstElement(array) {
  if (array.length == 0) {
    throw new Error("firstElement called with []");
  }
  return array[0];
}
```

{{index validation, "run-time error", crash, assumption}}

Artık sessizce tanımsız döndürmek yerine (bir dizide var olmayan bir özellik okunduğunda elde ettiğiniz), bunun kullanımını yanlış yaptığınızda programınızı yüksek sesle patlatacaktır. Bu tür hatalar gözden kaçırma olasılığını azaltır ve meydana geldiklerinde nedenlerini bulmayı kolaylaştırır.

Her türlü kötü giriş için kontroller yazmayı önermem. Bu, çok fazla çalışma gerektirir ve çok gürültülü bir kod ile sonuçlanır. Onları yalnızca kolayca yapılan hatalar için (veya kendinizin yapmaya başladığını fark ettiğiniz hatalar için) saklamak istersiniz.

## Özet

Programlamanın önemli bir parçası, hataları bulmak, teşhis etmek ve düzeltmektir. Otomatik bir test paketiniz varsa veya programlarınıza iddialar eklediyseniz, sorunları fark etmek daha kolay olabilir.

Programın kontrolü dışındaki faktörlerden kaynaklanan sorunlar genellikle aktif olarak planlanmalıdır. Sorun yerel olarak ele alınabiliyorsa, özel dönüş değerleri onları izlemek için iyi bir yoldur. Aksi takdirde, istisnalar tercih edilebilir.

Bir istisna fırlatmak, yığının bir sonraki kapsayan `try/catch` bloğuna veya yığının dibine kadar açılmasına neden olur. İstisna değeri, bunu yakalayan `catch` bloğuna verilir, bu da gerçekten beklenen türde bir istisna olup olmadığını doğrulamalı ve ardından bununla bir şeyler yapmalıdır. İstisnaların neden olduğu öngörülemeyen kontrol akışıyla başa çıkmaya yardımcı olmak için, bir bloğun bitişinde bir parça kodun _her zaman_ çalışmasını sağlamak için `finally` blokları kullanılabilir.

## Egzersizler

### Yeniden deneme

{{index "primitiveMultiply (exercise)", "exception handling", "throw keyword"}}

Say you have a function `primitiveMultiply` that in 20 percent of cases multiplies two numbers and in the other 80 percent of cases raises an exception of type `MultiplicatorUnitFailure`. Write a function that wraps this clunky function and just keeps trying until a call succeeds, after which it returns the result.
primitiveMultiply adında, %20'lik bir olasılıkla iki sayıyı çarpan ve diğer %80'lik bir olasılıkla MultiplicatorUnitFailure türünde bir istisna yükselten bir fonksiyonunuz olduğunu varsayalım. Bu sıkışık fonksiyonu saran ve bir çağrı başarılı olana kadar denemeye devam eden bir fonksiyon yazın.

{{index "catch keyword"}}

Make sure you handle only the exceptions you are trying to handle.
Yalnızca ele almaya çalıştığınız istisnaları ele aldığınızdan emin olun.

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
  // Kodunuz buraya.
}

console.log(reliableMultiply(8, 8));
// → 64
```

if}}

{{hint

{{index "primitiveMultiply (exercise)", "try keyword", "catch keyword", "throw keyword"}}

The call to `primitiveMultiply` should definitely happen in a `try` block. The corresponding `catch` block should rethrow the exception when it is not an instance of `MultiplicatorUnitFailure` and ensure the call is retried when it is.
primitiveMultiply çağrısı kesinlikle bir try bloğunda gerçekleşmelidir. Karşılık gelen catch bloğu, istisna MultiplicatorUnitFailure türünden değilse istisnayı yeniden fırlatmalı ve türünden bir istisna olduğunda çağrının yeniden denendiğinden emin olmalıdır.

To do the retrying, you can either use a loop that stops only when a call succeeds—as in the [`look` example](error#look) earlier in this chapter—or use ((recursion)) and hope you don't get a string of failures so long that it overflows the stack (which is a pretty safe bet).
Yeniden deneme yapmak için, bir çağrının başarılı olana kadar durmayan bir döngü kullanabilirsiniz - bu bölümdeki look örneğinde olduğu gibi - veya ((rekürsiv)) kullanabilir ve yığını aşırı derecede dolduracak kadar uzun bir hata dizisi almayı umabilirsiniz (bu oldukça güvenli bir bahis).

hint}}

### Kilitli kutu

{{index "locked box (exercise)"}}

Aşağıdaki (oldukça yapay) nesneyi düşünün:

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

Bu, bir kilitli kutu. Kutuda bir dizi var, ancak kutu kilidi açık olmadığı sürece ona erişemezsiniz.

{{index "finally keyword", "exception handling"}}

`withBoxUnlocked` adında bir fonksiyon yazın; bu fonksiyon, bir fonksiyon değeri alsın, kutunun kilidini açsın, aldığı fonksiyonu çalıştırsın ve ardından, argüman olarak verilen fonksiyonun normal olarak çalışmasından veya bir istisna fırlatmasından bağımsız olarak döndürmeden önce kutunun kilidinin geri kilitli olduğundan emin olsun.

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
  // Kodunuz buraya.
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

Ek puanlar için, kutu zaten açıkken `withBoxUnlocked` çağrılırsa, kutunun açık kalmasını sağlayın.

{{hint

{{index "locked box (exercise)", "finally keyword", "try keyword"}}

Bu alıştırma, bir `finally` bloğu gerektirir. Fonksiyonunuz öncelikle kutuyu kilidini açmalı ve ardından argüman olarak verilen fonksiyonu bir try gövdesi içinde çağırmalıdır. Sonrasında gelen `finally` bloğu aracılığıyla kutuyu tekrar kilitlemelidir.

Kutuyu kilitli olmadığında kilitlememek için, fonksiyonun başında kilidini kontrol edin ve kilidini sadece kilitli başlamışken açın veya kapatın.

hint}}
