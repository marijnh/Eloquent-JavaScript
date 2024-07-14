{{meta {load_files: ["code/chapter/12_language.js"], zip: "node/html"}}}

# Proje: Bir Programlama Dili

{{quote {author: "Hal Abelson and Gerald Sussman", title: "Structure and Interpretation of Computer Programs", chapter: true}

Evaluator, bir programlama dilindeki ifadelerin anlamını belirleyen, sadece başka bir programdır.

quote}}

{{index "Abelson, Hal", "Sussman, Gerald", SICP, "project chapter"}}

{{figure {url: "img/chapter_picture_12.jpg", alt: "İçinde delikler olan bir yumurtayı gösteren, içinde daha küçük yumurtaların olduğu ve bunların içinde daha da küçük yumurtaların bulunduğu illüstrasyon.", chapter: "framed"}}}

Kendi ((programming language))'inizi oluşturmak şaşırtıcı derecede kolaydır (çok yüksek hedefler koymadığınız sürece) ve oldukça aydınlatıcıdır.

Bu bölümde göstermek istediğim ana şey, bir programlama dili oluşturmanın içinde ((büyü)) olmadığının anlaşılmasıdır. İnsan icatlarının bazıları o kadar inanılmaz derecede zeki ve karmaşık görünmüştür ki, onları asla anlayamayacağımı düşünmüşümdür. Ancak biraz okuma ve deneme ile genellikle oldukça sıradan oldukları ortaya çıkar.

{{index "Egg language", [abstraction, "in Egg"]}}

Egg adında bir programlama dili oluşturacağız. Küçük ve basit bir dil olacak, ancak aklınıza gelebilecek herhangi bir hesaplamayı ifade edebilecek kadar güçlü olacak. Basit ((soyutlamalar)) sağlayacaktır ve ((fonksiyon))lara dayalı olacaktır.

{{id parsing}}

## Ayrıştırma(Parsing)

{{index parsing, validation, [syntax, "of Egg"]}}

Bir programlama dilinin en hemen görülebilir kısmı, onun _syntax_ veya gösterimidir. Bir _parser_, bir metin parçasını okuyup, o metinde bulunan programın yapısını yansıtan bir veri yapısı üreten bir programdır. Metin geçerli bir program oluşturmuyorsa, parser hatayı belirtmelidir.

{{index "special form", [function, application]}}

Dilimiz basit ve tekdüze bir sözdizimine sahip olacak. Egg'deki her şey bir ((ifade))dir. Bir ifade bir bağlama adı, bir sayı, bir string veya bir _aplikasyon_ olabilir. Aplikasyonlar fonksiyon çağrıları için kullanılır ancak `if` veya `while` gibi yapılar için de kullanılır.

{{index "double-quote character", parsing, [escaping, "in strings"], [whitespace, syntax]}}

Parser'ı basit tutmak için, Egg'deki stringler ters eğik çizgi kaçışlarını desteklemez. Bir string, çift tırnak içinde yer alan çift tırnak olmayan karakterlerden oluşan bir dizidir. Bir sayı, basamaklardan oluşan bir dizidir. Bağlama adları, boşluk olmayan ve sözdiziminde özel bir anlamı olmayan herhangi bir karakterden oluşabilir.

{{index "comma character", [parentheses, arguments]}}

Aplikasyonlar JavaScript'te olduğu gibi yazılır, bir ifadenin ardından parantez koyarak ve bu parantezler arasında virgülle ayrılmış herhangi bir sayıda ((argümanlar)) koyarak.

```{lang: null}
do(define(x, 10),
   if(>(x, 5),
      print("large"),
      print("small")))
```

{{index block, [syntax, "of Egg"]}}

((Egg language))'in ((tekdüzeliği)), JavaScript'teki `>` gibi ((operator))lerin bu dilde normal bağlamalar olduğu anlamına gelir ve diğer fonksiyonlar gibi uygulanırlar. Ve sözdiziminde blok kavramı olmadığından, birden fazla şeyi ardışık olarak yapmak için bir `do` yapısına ihtiyacımız var.

{{index "type property", parsing, ["data structure", tree]}}

Parser'ın bir programı tanımlamak için kullanacağı veri yapısı, her biri hangi tür ifade olduğunu belirten bir `type` özelliğine ve içeriğini tanımlayan diğer özelliklere sahip ((expression)) nesnelerinden oluşur.

{{index identifier}}

`"value"` türündeki ifadeler, literal string veya sayıları temsil eder. Bunların `value` özelliği, temsil ettikleri string veya sayı değerini içerir. `"word"` türündeki ifadeler, tanımlayıcılar (isimler) için kullanılır. Bu tür nesneler, tanımlayıcının adını string olarak tutan bir `name` özelliğine sahiptir. Son olarak, `"apply"` ifadeleri uygulamaları temsil eder. Bunların uygulanan ifadeye başvuran bir `operator` özelliği ve bir dizi argüman ifadesi tutan bir `args` özelliği vardır.

Önceki programın `>(x, 5)` kısmı şu şekilde temsil edilir:

```{lang: "json"}
{
  type: "apply",
  operator: {type: "word", name: ">"},
  args: [
    {type: "word", name: "x"},
    {type: "value", value: 5}
  ]
}
```

{{indexsee "abstract syntax tree", "syntax tree", ["data structure", tree]}}

Bu tür bir veri yapısına _((syntax tree))_ denir. Nesneleri noktalar olarak ve bunlar arasındaki bağlantıları bu noktalar arasındaki çizgiler olarak hayal ederseniz, ((tree)) benzeri bir şekle sahiptir. İfadelerin diğer ifadeleri içermesi, onların da daha fazla ifade içermesi, ağaç dallarının bölünmesi ve tekrar bölünmesine benzer.

{{figure {url: "img/syntax_tree.svg", alt: "Örnek programın sözdizimi ağacının yapısını gösteren diyagram. Kök 'do' olarak etiketlenmiştir ve biri 'define' ve diğeri 'if' etiketli iki çocuğu vardır. Bunların da içeriklerini açıklayan daha fazla çocuğu var.", width: "5cm"}}}

{{index parsing}}

Bunu, [Chapter ?](<(regexp#ini)>)'deki yapılandırma dosyası biçimi için yazdığımız parser ile karşılaştırın; bu parser, basit bir yapıya sahipti: girdiyi satırlara böldü ve bu satırları tek tek ele aldı. Bir satırın sahip olabileceği sadece birkaç basit form vardı.

{{index recursion, [nesting, "of expressions"]}}

Burada farklı bir yaklaşım bulmalıyız. İfadeler satırlara ayrılmamış ve yinelemeli bir yapıya sahiptir. Application ifadeleri diğer ifadeleri _içerir_.

{{index elegance}}

Neyse ki, bu sorun, dilin yinelemeli doğasını yansıtan yinelemeli bir parser fonksiyonu yazarak çok iyi çözülebilir.

{{index "parseExpression function", "syntax tree"}}

Bir string'i girdi olarak alan ve string'in başlangıcındaki ifade için veri yapısını içeren bir nesne ve bu ifadeyi ayrıştırdıktan sonra kalan string'i döndüren bir `parseExpression` fonksiyonu tanımlarız. Alt ifadeleri ayrıştırırken (örneğin bir application'ın argümanı), bu fonksiyon tekrar çağrılabilir, böylece argüman ifadesi ve kalan metin elde edilir. Bu metin sırayla daha fazla argüman içerebilir veya argüman listesini sonlandıran kapanış parantezi olabilir.

Bu parser'ın ilk kısmıdır:

```{includeCode: true}
function parseExpression(program) {
  program = skipSpace(program);
  let match, expr;
  if (match = /^"([^"]*)"/.exec(program)) {
    expr = {type: "value", value: match[1]};
  } else if (match = /^\d+\b/.exec(program)) {
    expr = {type: "value", value: Number(match[0])};
  } else if (match = /^[^\s(),#"]+/.exec(program)) {
    expr = {type: "word", name: match[0]};
  } else {
    throw new SyntaxError("Unexpected syntax: " + program);
  }

  return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
  let first = string.search(/\S/);
  if (first == -1) return "";
  return string.slice(first);
}
```

{{index "skipSpace function", [whitespace, syntax]}}

Egg, JavaScript gibi, elemanları arasında herhangi bir miktarda boşluk bulunmasına izin verdiğinden, program string'inin başlangıcındaki boşlukları tekrar tekrar kesmemiz gerekir. `skipSpace` fonksiyonu bu konuda yardımcı olur.

{{index "literal expression", "SyntaxError type"}}

Herhangi bir önde gelen boşluğu geçtikten sonra, `parseExpression` Egg'in desteklediği üç atomik elemanı tespit etmek için üç ((regular expression)) kullanır: stringler, sayılar ve kelimeler. Parser, hangisi eşleşirse ona bağlı olarak farklı bir veri yapısı oluşturur. Girdi bu üç formdan birine uymuyorsa, geçerli bir ifade değildir ve parser bir hata oluşturur. `Error` yerine `SyntaxError`'ı kullanırız çünkü bu biraz daha spesifiktir—aynı zamanda geçersiz bir JavaScript programı çalıştırılmaya çalışıldığında oluşturulan hata türüdür.

{{index "parseApply function"}}

Sonra eşleşen kısmı program string'inden kesip, bunu ifade için nesne ile birlikte `parseApply`'a geçiririz, bu ifade bir application olup olmadığını kontrol eder. Eğer öyleyse, parantezli bir argüman listesi ayrıştırır.

```{includeCode: true}
function parseApply(expr, program) {
  program = skipSpace(program);
  if (program[0] != "(") {
    return {expr: expr, rest: program};
  }

  program = skipSpace(program.slice(1));
  expr = {type: "apply", operator: expr, args: []};
  while (program[0] != ")") {
    let arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);
    if (program[0] == ",") {
      program = skipSpace(program.slice(1));
    } else if (program[0] != ")") {
      throw new SyntaxError("Expected ',' or ')'");
    }
  }
  return parseApply(expr, program.slice(1));
}
```

{{index parsing}}

Programdaki bir sonraki karakter açılış parantezi değilse, bu bir application değildir ve `parseApply` verilen ifadeyi döner.

{{index recursion}}

Aksi takdirde, açılış parantezini atlar ve bu application ifadesi için ((syntax tree)) nesnesini oluşturur. Daha sonra, kapanış parantezi bulunana kadar her argümanı ayrıştırmak için `parseExpression`'ı yinelemeli olarak çağırır. Yineleme dolaylıdır, `parseApply` ve `parseExpression` birbirlerini çağırır.

Bir application ifadesi kendisi uygulanabilir (örneğin `multiplier(2)(1)`), bu yüzden `parseApply` bir application ayrıştırdıktan sonra, başka bir parantez çifti olup olmadığını kontrol etmek için kendisini tekrar çağırmalıdır.

{{index "syntax tree", "Egg language", "parse function"}}

Egg'i ayrıştırmak için ihtiyacımız olan her şey bu kadar. Bunu, bir ifadeyi ayrıştırdıktan sonra girdi string'inin sonuna ulaşıldığını doğrulayan ve bize programın veri yapısını veren uygun bir `parse` fonksiyonuna sararız (bir Egg programı tek bir ifadedir).

```{includeCode: strip_log, test: join}
function parse(program) {
  let {expr, rest} = parseExpression(program);
  if (skipSpace(rest).length > 0) {
    throw new SyntaxError("Unexpected text after program");
  }
  return expr;
}

console.log(parse("+(a, 10)"));
// → {type: "apply",
//    operator: {type: "word", name: "+"},
//    args: [{type: "word", name: "a"},
//           {type: "value", value: 10}]}
```

{{index "error message"}}

İşe yarıyor! Başarısız olduğunda çok yardımcı bilgi vermiyor ve her ifadenin başladığı satır ve sütunu saklamıyor, bu da daha sonra hataları bildirirken faydalı olabilir, ancak bizim amaçlarımız için yeterince iyi.

## Değerlendirici(Evaluator)

{{index "evaluate function", evaluation, interpretation, "syntax tree", "Egg language"}}

Bir program için ((syntax tree)) ile ne yapabiliriz? Elbette çalıştırabiliriz! Ve değerlendirici tam olarak bunu yapar. Ona bir ((syntax tree)) ve isimleri değerlerle ilişkilendiren bir kapsam nesnesi verirsiniz ve bu, ağacın temsil ettiği ifadeyi değerlendirir ve ürettiği değeri döndürür.

```{includeCode: true}
const specialForms = Object.create(null);

function evaluate(expr, scope) {
  if (expr.type == "value") {
    return expr.value;
  } else if (expr.type == "word") {
    if (expr.name in scope) {
      return scope[expr.name];
    } else {
      throw new ReferenceError(
        `Undefined binding: ${expr.name}`);
    }
  } else if (expr.type == "apply") {
    let {operator, args} = expr;
    if (operator.type == "word" &&
        operator.name in specialForms) {
      return specialForms[operator.name](expr.args, scope);
    } else {
      let op = evaluate(operator, scope);
      if (typeof op == "function") {
        return op(...args.map(arg => evaluate(arg, scope)));
      } else {
        throw new TypeError("Applying a non-function.");
      }
    }
  }
}
```

{{index "literal expression", scope}}

Değerlendirici, her ((expression)) türü için koda sahiptir. Bir literal değer ifadesi kendi değerini üretir. (Örneğin, `100` ifadesi sadece 100 sayısını değerlendirir.) Bir bağlama için, bunun kapsamda gerçekten tanımlanıp tanımlanmadığını kontrol etmemiz ve eğer öyleyse, bağlamanın değerini almamız gerekir.

{{index [function, application]}}

Application'lar daha karmaşıktır. Eğer `if` gibi bir ((special form)) iseler, hiçbir şeyi değerlendirmeyiz ve argüman ifadelerini, kapsamla birlikte, bu formu yöneten fonksiyona geçiririz. Eğer normal bir çağrıysa, operatörü değerlendiririz, bunun bir fonksiyon olduğunu doğrularız ve değerlendirilmiş argümanlarla çağırırız.

Egg'in fonksiyon değerlerini temsil etmek için sade JavaScript fonksiyon değerlerini kullanırız. Bu konuya daha [sonra](<(language#egg_fun)>), `fun` adı verilen ((special form)) tanımlandığında döneceğiz.

{{index readability, "evaluate function", recursion, parsing}}

`evaluate`'in yinelemeli yapısı, parser'ın benzer yapısına benzer ve her ikisi de dilin yapısını yansıtır. Parser ve değerlendiriciyi tek bir fonksiyona birleştirmek ve ayrıştırma sırasında değerlendirmek de mümkündür. Ancak bu şekilde ayırmak programı daha net ve esnek kılar.

{{index "Egg language", interpretation}}

Egg'i yorumlamak için gereken her şey gerçekten bu kadar basittir. Ama birkaç özel form tanımlamadan ve ((environment))'a bazı kullanışlı değerler eklemeden, bu dil ile pek bir şey yapamazsınız.

## Özel formlar

{{index "special form", "specialForms object"}}

`specialForms` nesnesi, Egg'de özel sözdizimini tanımlamak için kullanılır. Bu, sözcükleri bu formaları değerlendiren fonksiyonlarla ilişkilendirir. Şu anda boş. `if` ekleyelim.

```{includeCode: true}
specialForms.if = (args, scope) => {
  if (args.length != 3) {
    throw new SyntaxError("Wrong number of args to if");
  } else if (evaluate(args[0], scope) !== false) {
    return evaluate(args[1], scope);
  } else {
    return evaluate(args[2], scope);
  }
};
```

{{index "conditional execution", "ternary operator", "?: operator", "conditional operator"}}

Egg'in `if` yapısı tam olarak üç argüman bekler. İlkini değerlendirecek ve eğer sonuç `false` değilse, ikincisini değerlendirecektir. Aksi takdirde, üçüncü değerlendirilir. Bu `if` formu, JavaScript'in `if`'inden çok JavaScript'in üçlü `?:` operatörüne benzer. Bir bildiri değil, ifadedir ve bir değer üretir, yani ikinci veya üçüncü argümanın sonucunu üretir.

{{index Boolean}}

Egg ayrıca `if` koşul değerini nasıl ele aldığında JavaScript'ten farklıdır. Sıfır veya boş string gibi şeyleri `false` olarak değerlendirmeyecek, sadece kesin değer `false` olarak değerlendirecektir.

{{index "short-circuit evaluation"}}

`if`'i düzenli bir fonksiyon yerine özel bir form olarak temsil etmemizin nedeni, fonksiyonlara tüm argümanlar fonksiyon çağrılmadan önce değerlendirilir, oysa `if` yalnızca ya ikinci _ya da_ üçüncü argümanını değerlendirmelidir, ilk argümanın değerine bağlı olarak.

`while` formu benzerdir.

```{includeCode: true}
specialForms.while = (args, scope) => {
  if (args.length != 2) {
    throw new SyntaxError("Wrong number of args to while");
  }
  while (evaluate(args[0], scope) !== false) {
    evaluate(args[1], scope);
  }

  // Since undefined does not exist in Egg, we return false,
  // for lack of a meaningful result.
  return false;
};
```

Diğer bir temel yapı taşı `do`'dur, tüm argümanlarını yukarıdan aşağıya doğru yürütür. Onun değeri, son argümanın ürettiği değerdir.

```{includeCode: true}
specialForms.do = (args, scope) => {
  let value = false;
  for (let arg of args) {
    value = evaluate(arg, scope);
  }
  return value;
};
```

{{index ["= operator", "in Egg"], [binding, "in Egg"]}}

Bağlamalar oluşturup onlara yeni değerler atayabilmek için, `define` adında bir form da oluştururuz. İlk argüman olarak bir kelime ve bu kelimeye atanacak değeri üreten bir ifade bekler. `define`, her şey gibi, bir ifade olduğundan, bir değer döndürmelidir. Bu değeri atanmış olan değeri döndürecek şekilde yapacağız (tıpkı JavaScript'in `=` operatörü gibi).

```{includeCode: true}
specialForms.define = (args, scope) => {
  if (args.length != 2 || args[0].type != "word") {
    throw new SyntaxError("Incorrect use of define");
  }
  let value = evaluate(args[1], scope);
  scope[args[0].name] = value;
  return value;
};
```

## Ortam

{{index "Egg language", "evaluate function", [binding, "in Egg"]}}

`evaluate` tarafından kabul edilen ((scope)), isimleri bağlama isimlerine ve değerleri bu bağlamalara karşılık gelen değerlere karşılık gelen özellikleri olan bir nesnedir. ((global scope))'u temsil etmek için bir nesne tanımlayalım.

Yeni tanımladığımız `if` yapısını kullanabilmek için, ((Boolean)) değerlere erişimimiz olmalıdır. Yalnızca iki Boolean değeri olduğundan, bunlar için özel bir sözdizimine ihtiyacımız yoktur. İki ismi `true` ve `false` değerlerine bağlar ve kullanırız.

```{includeCode: true}
const topScope = Object.create(null);

topScope.true = true;
topScope.false = false;
```

Artık bir Boolean değerini tersine çeviren basit bir ifadeyi değerlendirebiliriz.

```
let prog = parse(`if(true, false, true)`);
console.log(evaluate(prog, topScope));
// → false
```

{{index arithmetic, "Function constructor"}}

Temel ((arithmetic)) ve ((comparison)) ((operator))ları sağlamak için, ((scope))'a bazı fonksiyon değerleri de ekleyeceğiz. Kodu kısa tutmak adına, her birini ayrı ayrı tanımlamak yerine, bir döngüde bir grup operatör fonksiyonu üretmek için `Function` kullanacağız.

```{includeCode: true}
for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
  topScope[op] = Function("a, b", `return a ${op} b;`);
}
```

Değerleri ((output)) etmek için bir yol da faydalıdır, bu yüzden `console.log`'u bir fonksiyon içine sarıp `print` olarak adlandıracağız.

```{includeCode: true}
topScope.print = value => {
  console.log(value);
  return value;
};
```

{{index parsing, "run function"}}

Bu, basit programlar yazmak için yeterli temel araçları sağlar. Aşağıdaki fonksiyon, bir programı ayrıştırmak ve bunu yeni bir kapsamda çalıştırmak için kullanışlı bir yol sağlar:

```{includeCode: true}
function run(program) {
  return evaluate(parse(program), Object.create(topScope));
}
```

{{index "Object.create function", prototype}}

Yerleşik kapsamları temsil etmek için nesne prototip zincirlerini kullanacağız, böylece program, üst düzey kapsamı değiştirmeden yerel kapsamına bağlamalar ekleyebilir.

```
run(`
do(define(total, 0),
   define(count, 1),
   while(<(count, 11),
         do(define(total, +(total, count)),
            define(count, +(count, 1)))),
   print(total))
`);
// → 55
```

{{index "summing example", "Egg language"}}

Bu, 1'den 10'a kadar olan sayıların toplamını hesaplayan ve Egg'de ifade edilen programdır. Açıkça JavaScript eşdeğerinden daha çirkindir—ancak 150'den az ((lines of code)) ile uygulanmış bir dil için fena değil.

{{id egg_fun}}

## Fonksiyonlar

{{index function, "Egg language"}}

Fonksiyonsuz bir programlama dili gerçekten zayıf bir programlama dilidir.

Neyse ki, son argümanını fonksiyonun gövdesi olarak ele alan ve ondan önceki tüm argümanları fonksiyonun parametre isimleri olarak kullanan bir `fun` yapısını eklemek zor değildir.

```{includeCode: true}
specialForms.fun = (args, scope) => {
  if (!args.length) {
    throw new SyntaxError("Functions need a body");
  }
  let body = args[args.length - 1];
  let params = args.slice(0, args.length - 1).map(expr => {
    if (expr.type != "word") {
      throw new SyntaxError("Parameter names must be words");
    }
    return expr.name;
  });

  return function() {
    if (arguments.length != params.length) {
      throw new TypeError("Wrong number of arguments");
    }
    let localScope = Object.create(scope);
    for (let i = 0; i < arguments.length; i++) {
      localScope[params[i]] = arguments[i];
    }
    return evaluate(body, localScope);
  };
};
```

{{index "local scope"}}

Egg'deki fonksiyonlar kendi yerel kapsamlarını alır. `fun` formu tarafından üretilen fonksiyon bu yerel kapsamı oluşturur ve argüman bağlamalarını ona ekler. Daha sonra fonksiyon gövdesini bu kapsamda değerlendirir ve sonucu döndürür.

```{startCode: true}
run(`
do(define(plusOne, fun(a, +(a, 1))),
   print(plusOne(10)))
`);
// → 11

run(`
do(define(pow, fun(base, exp,
     if(==(exp, 0),
        1,
        *(base, pow(base, -(exp, 1)))))),
   print(pow(2, 10)))
`);
// → 1024
```

## Derleme(Compilation)

{{index interpretation, compilation}}

İnşaa etmiş olduğumuz şey bir yorumlayıcıdır. Değerlendirme sırasında, parser tarafından üretilen programın temsilinde doğrudan çalışır.

{{index efficiency, performance, [binding, definition], [memory, speed]}}

_Compilation_, bir programın çalıştırılmasından önceki adımlardan birini ekleyerek programı daha verimli bir şekilde değerlendirilebilecek bir şeye dönüştürme sürecidir. Örneğin, iyi tasarlanmış dillerde, bir bağlamanın her kullanımının hangi bağlamaya atıfta bulunduğu, programı gerçekten çalıştırmadan açıktır. Bu, bağlamayı her erişildiğinde adla aramak yerine, doğrudan önceden belirlenmiş bir bellek konumundan almayı sağlayabilir.

Geleneksel olarak, ((compilation)), programı, bir bilgisayarın işlemcisinin çalıştırabileceği ham format olan ((machine code))'a dönüştürmeyi içerir. Ancak, programı farklı bir temsile dönüştüren herhangi bir süreç derleme olarak düşünülebilir.

{{index simplicity, "Function constructor", transpilation}}

Egg için alternatif bir ((değerlendirme(evaluation))) stratejisi yazmak mümkündür; programı önce bir JavaScript programına dönüştüren, `Function` kullanarak JavaScript derleyicisini çağıran ve ardından sonucu çalıştıran bir strateji. Doğru yapıldığında, bu Egg'i çok hızlı çalıştırır ve hala oldukça basit bir şekilde uygulanabilir.

Eğer bu konuyla ilgileniyorsanız ve biraz zaman ayırmaya istekliyseniz, böyle bir derleyiciyi bir egzersiz olarak uygulamayı denemenizi öneririm.

## Hile yapmak

{{index "Egg language"}}

`if` ve `while` tanımladığımızda, bunların JavaScript'in kendi `if` ve `while` yapılarının etrafında daha az veya daha çok basit sarmalayıcılar olduğunu fark etmiş olabilirsiniz. Benzer şekilde, Egg'deki değerler sadece eski normal JavaScript değerleridir.

Egg'in JavaScript üzerine inşa edilmiş uygulaması ile bir programlama dilini doğrudan bir makinenin sağladığı ham fonksiyonellik üzerine inşa etmek için gereken iş ve karmaşıklığı karşılaştırırsanız, fark çok büyüktür. Her şeye rağmen, bu örnek size ((programlama dillerinin)) nasıl çalıştığı konusunda bir izlenim vermeyi amaçladı.

Ve bir şeyler yapmaya gelince, hile yapmak her şeyi kendiniz yapmaktan daha etkilidir. Bu bölümdeki oyuncak dil JavaScript'te daha iyi yapılamayacak bir şey yapmıyor olsa da, küçük diller yazmanın gerçek işleri halletmeye yardımcı olduğu durumlar _vardır_.

Böyle bir dil tipik bir programlama diline benzemek zorunda değildir. Örneğin, JavaScript düzenli ifadelerle donatılmış olarak gelmeseydi, kendi düzenli ifadelerinizi ayrıştırıcı ve değerlendirici olarak yazabilirdiniz.

{{index "artificial intelligence"}}

Ya da dev bir robotik ((dinazor)) inşa ettiğinizi ve onun ((davranışını)) programlamanız gerektiğini hayal edin. JavaScript bunu yapmanın en etkili yolu olmayabilir. Bunun yerine şöyle görünen bir dil seçebilirsiniz:

```{lang: null}
behavior walk
  perform when
    destination ahead
  actions
    move left-foot
    move right-foot

behavior attack
  perform when
    Godzilla in-view
  actions
    fire laser-eyes
    launch arm-rockets
```

{{index expressivity}}

Bu genellikle ((domain-özel dil)) olarak adlandırılır, belirli bir bilgi alanını ifade etmek için tasarlanmış bir dil. Böyle bir dil, genel amaçlı bir dilden daha ifadeli olabilir çünkü tam olarak ifade edilmesi gereken şeyleri ifade etmek için tasarlanmıştır ve başka hiçbir şeyi.

## Egzersizler

### Diziler

{{index "Egg language", "arrays in egg (exercise)", [array, "in Egg"]}}

Egg'e diziler için destek ekleyin, en üst kapsama aşağıdaki üç fonksiyonu ekleyerek: `array(...values)` argüman değerlerini içeren bir dizi oluşturmak için, `length(array)` bir dizinin uzunluğunu almak için ve `element(array, n)` bir diziden n^inci^ öğeyi almak için.

{{if interactive

```{test: no}
// Modify these definitions...

topScope.array = "...";

topScope.length = "...";

topScope.element = "...";

run(`
do(define(sum, fun(array,
     do(define(i, 0),
        define(sum, 0),
        while(<(i, length(array)),
          do(define(sum, +(sum, element(array, i))),
             define(i, +(i, 1)))),
        sum))),
   print(sum(array(1, 2, 3))))
`);
// → 6
```

if}}

{{hint

{{index "arrays in egg (exercise)"}}

Bunu yapmanın en kolay yolu, Egg dizilerini JavaScript dizileri ile temsil etmektir.

{{index "slice method"}}

En üst kapsama eklenen değerler fonksiyon olmalıdır. Bir rest argümanı (üç nokta notasyonu ile) kullanarak, `array` tanımını _çok_ basit hale getirebiliriz.

hint}}

### Kapanış(Closure)

{{index closure, [function, scope], "closure in egg (exercise)"}}

`fun`'ı tanımlama şeklimiz, Egg'deki fonksiyonların çevreleyen kapsamı referans almasına izin verir, bu da fonksiyonun gövdesinin fonksiyonun tanımlandığı anda görünen yerel değerleri kullanmasına izin verir, tıpkı JavaScript fonksiyonları gibi.

Aşağıdaki program bunu göstermektedir: `f` fonksiyonu, argümanını `f`'nin argümanına ekleyen bir fonksiyon döndürür, bu da `a` bağlamına ulaşabilmesi için `f` içindeki lokal kapsama(scope) erişimi olmasını gerektirir..

```
run(`
do(define(f, fun(a, fun(b, +(a, b)))),
   print(f(4)(5)))
`);
// → 9
```

`fun` formunun tanımına geri dönün ve bunun çalışmasını sağlayan mekanizmayı açıklayın.

{{hint

{{index closure, "closure in egg (exercise)"}}

Yine, JavaScript mekanizmasını kullanarak Egg'de eşdeğer özelliği elde ediyoruz. Özel formlar, kendi alt formlarını bu kapsamda değerlendirebilmeleri için değerlendirildikleri yerel kapsamı alırlar. `fun` tarafından döndürülen fonksiyon, kapsayıcı fonksiyonuna verilen `scope` argümanına erişir ve çağrıldığında fonksiyonun yerel ((kapsamını)) oluşturmak için bunu kullanır.

{{index compilation}}

Bu, yerel kapsamın ((prototipinin)) fonksiyonun oluşturulduğu kapsam olacağı anlamına gelir, bu da bu kapsamda bağlamalara fonksiyondan erişmeyi mümkün kılar. Bu, kapanışı(closure) uygulamak için gereken her şeydir (ancak bunu gerçekten verimli bir şekilde derlemek için biraz daha fazla iş yapmanız gerekir).

hint}}

### Yorumlar

{{index "hash character", "Egg language", "comments in egg (exercise)"}}

Egg'de ((yorum)) yazabilmek güzel olurdu. Örneğin, bir hash işareti (`#`) bulduğumuzda, satırın geri kalanını bir yorum olarak ele alabilir ve JavaScript'teki `//` gibi görmezden gelebiliriz.

{{index "skipSpace function"}}

Bunu desteklemek için ayrıştırıcıda büyük değişiklikler yapmamıza gerek yok. `skipSpace`'i, yorumları ((whitespace)) gibi atlayacak şekilde değiştirebiliriz, böylece `skipSpace`'in çağrıldığı tüm noktalar artık yorumları da atlayacaktır. Bu değişikliği yapın.

{{if interactive

```{test: no}
// This is the old skipSpace. Modify it...
function skipSpace(string) {
  let first = string.search(/\S/);
  if (first == -1) return "";
  return string.slice(first);
}

console.log(parse("# hello\nx"));
// → {type: "word", name: "x"}

console.log(parse("a # one\n   # two\n()"));
// → {type: "apply",
//    operator: {type: "word", name: "a"},
//    args: []}
```

if}}

{{hint

{{index "comments in egg (exercise)", [whitespace, syntax]}}

Çözümünüzün, arka arkaya birden fazla yorumu, aralarında veya sonrasında potansiyel olarak boşluklarla birlikte ele aldığından emin olun.

Bir ((düzenli ifade)) muhtemelen bunu çözmenin en kolay yoludur. "Boşluk veya yorum, sıfır veya daha fazla kez" eşleşen bir şey yazın. `exec` veya `match` metodunu kullanın ve döndürülen dizinin ilk öğesinin (tüm eşleşme) uzunluğuna bakarak ne kadar karakter dilimleneceğini bulun.

hint}}

### Kapsamı düzeltme

{{index [binding, definition], assignment, "fixing scope (exercise)"}}

Şu anda bir bağlamaya değer atamanın tek yolu `define`. Bu yapı, yeni bağlamalar tanımlamanın ve mevcut olanlara yeni bir değer vermenin bir yolu olarak işlev görür.

{{index "local binding"}}

Bu ((belirsizlik)) bir soruna yol açar. Yerel olmayan bir bağlamaya yeni bir değer vermeye çalıştığınızda, bunun yerine aynı ada sahip yerel bir bağlama tanımlarsınız. Bazı diller bu şekilde tasarlanmıştır, ancak ((kapsamı)) bu şekilde ele almanın her zaman garip bir yol olduğunu düşündüm.

{{index "ReferenceError type"}}

Yerel kapsamda zaten yoksa, dış kapsamda bir bağlamayı güncelleyerek yeni bir değer veren `define`'a benzer bir özel form `set` ekleyin. Bağlama hiç tanımlanmamışsa, bir `ReferenceError` (başka bir standart hata türü) atın.

{{index "hasOwn function", prototype, "getPrototypeOf function"}}

Kapsamları basit nesneler olarak temsil etme tekniği, şu ana kadar işleri kolaylaştırmış olsa da, bu noktada sizi biraz engelleyecektir. Bir nesnenin prototipini döndüren `Object.getPrototypeOf` fonksiyonunu kullanmak isteyebilirsiniz. Ayrıca, belirli bir nesnenin bir özelliğe sahip olup olmadığını öğrenmek için `Object.hasOwn` kullanabileceğinizi unutmayın.

{{if interactive

```{test: no}
specialForms.set = (args, scope) => {
  // Your code here.
};

run(`
do(define(x, 4),
   define(setx, fun(val, set(x, val))),
   setx(50),
   print(x))
`);
// → 50
run(`set(quux, true)`);
// → Some kind of ReferenceError
```

if}}

{{hint

{{index [binding, "compilation of"], assignment, "getPrototypeOf function", "hasOwn function", "fixing scope (exercise)"}}

Bir sonraki dış kapsama geçmek için `Object.getPrototypeOf` kullanarak her seferinde bir ((kapsamı))ı döngüye almak zorunda kalacaksınız. Her kapsam için, `set`'in ilk argümanının `name` özelliği ile belirtilen bağlamanın o kapsamda olup olmadığını öğrenmek için `Object.hasOwn` kullanın. Eğer varsa, onu `set`'in ikinci argümanının değerlendirme sonucuna ayarlayın ve ardından bu değeri döndürün.

{{index "global scope", "run-time error"}}

En dış kapsama ulaşıldığında (`Object.getPrototypeOf` null döndürür) ve hala bağlamayı bulamadıysanız, o bağlama mevcut değildir ve bir hata atılmalıdır.

hint}}
