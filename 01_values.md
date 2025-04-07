{{meta {docid: values}}}

# Değerler, Tipler ve Operatörler

{{quote {author: "Master Yuan-Ma", title: "The Book of Programming", chapter: true}

Makinenin yüzeyinin altında, program hareket eder. Çaba sarf etmeden genişler ve daralır. Büyük bir uyum içinde, elektronlar dağılır ve yeniden gruplanır. Monitördeki formlar sadece suyun üstünde dalgalar gibiyken öz ise görünmez bir şekilde altta kalır.

quote}}

{{index "Yuan-Ma", "Book of Programming"}}

{{figure {url: "img/chapter_picture_1.jpg", alt: "Illustration of a sea of dark and bright dots (bits) with islands in it", chapter: framed}}}

{{index "binary data", data, bit, memory}}

Bilgisayarın dünyasında, sadece veri vardır. Veriyi okuyabilir, değiştirebilir, yeni veri oluşturabilirsiniz - ancak veri olmayan şeylerden bahsedilemez. Tüm bu veriler, sıfır ve birlerden oluşan bitlerin bir araya geldiği uzun diziler olarak depolanır ve bu nedenle temel olarak birbirlerine benzerler.

{{index CD, signal}}

_Bitler_, genellikle sıfırlar ve birler olarak tanımlanan her türlü iki değerli şeydir. Bilgisayarın içinde, yüksek veya düşük bir elektrik yükü, güçlü veya zayıf bir sinyal veya bir CD'nin yüzeyinde parlak veya mat bir leke gibi şekiller alırlar. Herhangi bir soyut bilgi parçası, sıfırların ve birlerin bir dizisine indirgenebilir ve bu şekilde bitlerle temsil edilebilir.

{{index "binary number", "decimal number"}}

Örneğin, sayı 13'ü bitlerle ifade edebiliriz. Bu, ondalık bir sayıyla aynı çalışır, ancak 10 farklı ((rakam)) yerine yalnızca 2 tane vardır ve her birinin ağırlığı sağdan sola doğru bir faktörle artar. İşte 13'ü oluşturan bitler ve rakamların ağırlıkları aşağıda gösterilmiştir:

```{lang: null}
   0   0   0   0   1   1   0   1
 128  64  32  16   8   4   2   1
```

Bu, ikili sayı 00001101. Sıfır olmayan rakamlar, 8, 4 ve 1'i temsil eder ve toplamda 13'e eşittir.

## Değerler

{{index [memory, organization], "volatile data storage", "hard drive"}}

Bitlerden oluşan bir denizi, bir okyanusu hayal edin. Tipik bir modern bilgisayarın, geçici veri depolama alanında (çalışma belleği) 100 milyarın üzerinde biti vardır. Kalıcı depolamaysa(sabit disk veya benzeri) genellikle birkaç kat daha fazla sayıda bit barındırır.

Bu miktardaki bitlerle kaybolmadan çalışabilmek için, onları bilgi parçalarını temsil eden parçalara ayırırız. Bir JavaScript ortamında, bu parçalara ((_değer_))ler denir. Tüm değerler bitlerden oluşsa da, farklı roller üstlenirler. Her değerin rolünü belirleyen bir ((_tür_))ü vardır. Bazı değerler sayıdır, bazıları metin parçalarıdır, bazıları fonksiyonlardır ve benzeri.

{{index "garbage collection"}}

Bir değer oluşturmak için, yalnızca adını çağırmanız gerekir. Bu kullanışlıdır. Değerleriniz için yapı malzemesini toplamanıza veya ödeme yapmanıza gerek yoktur. Sadece bir tane çağırırsınız ve _şup_, ona sahip olursunuz. Tabii ki, değerler gerçekten birdenbire hiçlikten yaratılmaz. Her biri bir yerde depolanmalıdır ve eğer hepsini aynı anda kullanmak isterseniz, bilgisayar belleği tükenebilir. Neyse ki, bu sadece hepsine aynı anda ihtiyacınız varsa bir problem olur. Bir değeri artık kullanmadığınızda, o dağılır ve arkasında bitlerini bırakır, böylece bir sonraki nesil değerler için yapı malzemesi olarak geri dönüştürülebilir.

Bu bölümün geri kalanı, JavaScript programlarının atomik unsurlarını, yani basit değer tiplerini ve bu tür değerler üzerinde işlem yapabilen operatörleri tanıtır.

## Sayılar

{{index [syntax, number], number, [number, notation]}}

_Sayı_ türündeki değerler, beklenildiği gibi, sayısal değerlerdir. Bir JavaScript programında, şu şekilde yazılırlar:

```
13
```

{{index "binary number"}}

Bunu bir programda kullanmak, bilgisayar belleğinde sayı 13 için bit deseninin varlığını ortaya çıkarır.

{{index [number, representation], bit}}

JavaScript, bir adet sayı değeri saklamak için sabit olarak 64 bit kullanır. 64 bit ile yapabileceğiniz sadece belirli bir sayıda desen vardır, bu da temsil edilebilecek farklı sayıların sayısını sınırlar. _N_ ondalık ((basamak)) ile 10^N^ adet farklı sayıyı temsil edebilirsiniz. Benzer şekilde, 64 adet ikilik sayı basamakları ile 2^64^ farklı sayıyı temsil edebilirsiniz, bu da yaklaşık olarak 18 katrilyon (18'in arkasında 18 sıfır olan bir sayı), yani çok fazla.

Bilgisayar belleği eskiden çok daha küçüktü ve insanlar sayılarını temsil etmek için 8 veya 16 bitlik gruplar kullanma eğilimindeydi. Bu tür küçük sayılarla işlemler yaparken kazara ((taşma)) durumuyla karşılaşmak, yani verilen bit sayısını aşan bir sayıya yanlışlıkla ulaşmak kolaydı. Bugün, cebinizdeki telefon adlı bilgisayarlar bile yeterince belleğe sahiptir, bu yüzden 64 bitlik parçaları özgürce kullanabilirsiniz ve gerçekten astronomik sayılarla uğraşmadığınız sürece taşma sorunuyla ilgilenmeniz gerekmez.

{{index sign, "floating-point number", "sign bit"}}

The actual maximum whole number that can be stored is more in the range of 9 quadrillion (15 zeros)—which is still pleasantly huge.
Ancak, 18 katrilyonun altında kalan tüm tam sayılar bir JavaScript sayısına sığmaz. Bu bitler ayrıca negatif sayıları da saklar, bu nedenle bir bit sayının artı veya eksi olup olmadığını gösterir. Daha büyük bir sorunsa tam olmayan sayıları temsil etmektir. Bunun için, sayı bitlerinin bazıları ondalık noktanın konumunu saklamak için kullanılır. Depolanabilen asıl maksimum tam sayı, 9 katrilyon aralığındadır (15 sıfır).

{{index [number, notation], "fractional number"}}

Kesirli sayılar bir nokta kullanılarak yazılır:

```
9.81
```

{{index exponent, "scientific notation", [number, notation]}}

For very big or very small numbers, you may also use scientific notation by adding an _e_ (for _exponent_), followed by the exponent of the number:
Çok büyük veya çok küçük sayılar için, sayının üssünü belirten bir e (((_üs/exponent_)) için) ekleyerek bilimsel gösterim de kullanabilirsiniz:

```
2.998e8
```

Bu, 2.998 × 10^8^ = 299,800,000'dir.

{{index pi, [number, "precision of"], "floating-point number"}}

Yukarıda bahsedilen 9 katrilyonun altındaki tüm tam sayılarla yapılan hesaplamalar her zaman kesindir. Ne yazık ki, tam olmayan sayılarla yapılan hesaplamalarsa genellikle kesin değildir. Pi (π) gibi birçok sayı, yalnızca 64 bit kullanılarak saklandığında bazı hassasiyetlerini kaybeder. Bu bir dezavantaj olsa da yalnızca belirli durumlarda yalnızca pratik problemlere neden olur. Önemli olan bunun farkında olmak ve tam olmayan sayıları kesin değerler olarak değil, yaklaşımlar olarak ele almaktır.

### Aritmetik

{{index [syntax, operator], operator, "binary operator", arithmetic, addition, multiplication}}

Sayılarla yapılan temel işlem aritmetiktir. Toplama veya çarpma gibi aritmetik işlemler iki sayı değerini alır ve bunlardan yeni bir sayı üretir. JavaScript'te bunlar şu şekildedir:

```{meta: "expr"}
100 + 4 * 11
```

{{index [operator, application], asterisk, "plus character", "* operator", "+ operator"}}

`+` ve `*` sembolleri ((_operatör_)) olarak adlandırılır. İlk sembol toplamayı temsil eder ve ikincisi çarpma işlemini temsil eder. İki değer arasına bir operatör koymak işlemin bu değerlere uygulanmasına ve yeni bir değer üretmesine sebep olur.

{{index grouping, parentheses, precedence}}

Bu örnek, "4'e 100'ü ekle ve sonucu 11 ile çarp" mı demektir, yoksa çarpma işlemi eklemeden önce mi yapılır? Tahmin ettiğiniz gibi, çarpma önce gerçekleşir. Matematikte olduğu gibi, bunu parantez içine alarak değiştirebilirsiniz:

```{meta: "expr"}
(100 + 4) * 11
```

{{index "hyphen character", "slash character", division, subtraction, minus, "- operator", "/ operator"}}

Çıkarma için `-` operatörü bulunur. Bölme işlemi `/` operatörü ile yapılır.

Operatörler parantez olmadan bir araya geldiğinde, uygulanma sırası operatörlerin ((_önceliği_)) tarafından belirlenir. Örnek, çarpmanın toplamadan önce geldiğini gösterir. `/` operatörünün önceliği `*` ile aynıdır. Benzer şekilde, `+` ve `-` aynı önceliğe sahiptir. Aynı önceliğe sahip birden çok operatör yan yana geldiğinde, örneğin `1 - 2 + 1`, soldan sağa uygulanır: `(1 - 2) + 1`.

Bu öncelik kuralları hakkında çok fazla endişelenmeyin. Şüphede kaldığınızda, sadece parantez ekleyin.

{{index "modulo operator", division, "remainder operator", "% operator"}}

Hemen tanıyamayabileceğiniz biraz farklı olan bir aritmetik operatör daha var. `%` sembolü _kalan_ işlemi temsil etmek için kullanılır. `X % Y`, `X`'i `Y` ile böldüğünüzde kalanı verir. Örneğin, `314 % 100` `14` üretir ve `144 % 12` ise `0` verir. Kalan operatörünün önceliği, çarpma ve bölme işlemiyle aynıdır. Bu operatör aynı zamanda _modülo_ olarak da adlandırılır.

### Özel sayılar

{{index [number, "special values"], infinity}}

JavaScript'te normal sayılar gibi davranmayan ancak sayı olarak değerlendirilen üç adet özel değer vardır. İlk ikisi `Infinity` ve `-Infinity`, pozitif ve negatif sonsuzlukları temsil eder. `Infinity - 1` hala `Infinity`'dir ve benzeri. Ancak sonsuzluk tabanlı hesaplara fazla güvenmeyin. Matematiksel olarak sağlam değildir ve hızla bir sonraki özel sayıya yol açacaktır: `NaN`.
{{index NaN, "not a number", "division by zero"}}

`NaN`, "sayı değil" anlamına gelir, ancak _sayı türünden bir değerdir_. Örneğin `0 / 0` (sıfır bölü sıfır), `Infinity - Infinity` veya anlamlı bir sonuç vermeyen diğer sayısal işlemleri hesaplamaya çalıştığınızda da bu sonucu alırsınız.

## Dizeler

{{indexsee "grave accent", backtick}}

{{index [syntax, string], text, character, [string, notation], "single-quote character", "double-quote character", "quotation mark", backtick}}

Sonraki temel veri türü _((dize))_ dir. Dizeler metni temsil etmek için kullanılır. İçeriklerini tırnak işaretleri içine alarak yazılırlar.

```
`Down on the sea`
"Lie on the ocean"
'Float on the ocean'
```

Dizeleri işaretlemek için başlangıç ve sonundaki tırnaklar eşleştiği sürece tek tırnak, çift tırnak veya ters tırnaklar kullanabilirsiniz.

{{index "line break", "newline character"}}

JavaScript'te neredeyse her şeyi tırnaklar arasına koyarak dize değeri yapmasını sağlayabilirsiniz. Ancak birkaç karakter daha zordur. Tırnakların arasına tırnak koymak zor olabilir, çünkü bunlar dizenin sonu gibi görünecektir. _Satır sonları_ (klavyede [enter]{keyname} tuşuna basarak elde edilen karakter) yalnızca ters tırnaklarla (`` ` ``) alıntılanmış dizelerde dahil edilebilir.

{{index [escaping, "in strings"], ["backslash character", "in strings"]}}

Bu tür karakterleri bir dizeye dahil etmeyi mümkün kılmak için ters bölü çubuğu (`\`) gösterimi kullanılır ve tırnak içindeki metin içinde onun sonrasındaki karakterin özel bir anlamı olduğunu belirtir. Bu, karakterin _kaçırılması_ olarak adlandırılır. Bir ters bölü çubuğundan sonra gelen bir tırnak dizeyi sonlandırmaz, ancak onun bir parçası olur. Bir ters bölü çubuğu (`\`) sonrasında bir `n` karakteri varsa, bu bir satır sonu olarak yorumlanır. Benzer şekilde, bir ters bölü çubuğu (`\`) sonrasında bir `t` karakteri, bir ((tab karakteri)) anlamına gelir. Aşağıdaki dizeyi düşünün:

```
"This is the first line\nAnd this is the second"
```

Bu, dizenin gerçek metni:

```{lang: null}
This is the first line
And this is the second
```

This is how the string "_A newline character is written like `"`\n`"`._" can be expressed:
Elbette, bir dizeye bir ters bölü çubuğunun özel bir kod değil yalnızca bir ters bölü çubuğu olmasını istediğiniz durumlar da vardır. Ardışık olarak iki ters bölü çubuğu takip ederse, bunlar birleşir ve sonuçta değer dizesinde yalnızca bir tane kalır. Aşağıdaki dize "_A newline character is written like `"`\n`"`._" olarak ifade edilebilir:

```
"A newline character is written like \"\\n\"."
```

{{id unicode}}

{{index [string, representation], Unicode, character}}

Dizeler de bilgisayarın içinde var olabilmek için bir dizi bitler olarak modellenmelidir. JavaScript'in bunu yapmasının yolu _((Unicode))_ standardına dayanmaktadır. Bu standart, Yunanca, Arapça, Japonca, Ermenice ve diğer diller de dahil olmak üzere ihtiyacınız olan hemen hemen her karaktere bir spesifik bir numara atar. Her karakter için bir sayımız olduğuna göre, bir dize bir dizi numara ile açıklanabilir. Ve işte JavaScript bunu yapıyor.

{{index "UTF-16", emoji}}

Ancak bir karmaşıklık var: JavaScript dize temsilinde dizenin her karakterini temsil etmek için ancak 16 bit yani 2^16^ değerine kadar farklı karakteri açıklayabiliyor. Ancak Unicode, bu noktada, bunun yaklaşık iki katı kadar daha fazla karakteri tanımlar. Bu nedenle, birçok emoji gibi bazı karakterler, JavaScript dizelerinde iki "karakter konumu" kaplar. Buna [bölüm ?'da](higher_order#code_units)'da geri döneceğiz.

{{index "+ operator", concatenation}}

Strings cannot be divided, multiplied, or subtracted. The `+` operator _can_ be used on them, not to add, but to _concatenate_—to glue two strings together. The following line will produce the string `"concatenate"`:
Dizeler bölünemez, çarpılamaz veya çıkarılamaz. `+` operatörü onlar üzerinde _kullanılabilir_, ancak ekleme değil iki diziyi _birleştirmek_, yani yapıştırmak için. Aşağıdaki satır `"concatenate"` dizesini üretecektir:

```{meta: "expr"}
"con" + "cat" + "e" + "nate"
```

String values have a number of associated functions (_methods_) that can be used to perform other operations on them. I'll say more about these in .
Dize değerleri üzerinde, onlarla diğer işlemleri gerçekleştirmek için kullanılabilecek bir dizi ilgili fonksiyonlar(_metodlar_) bulunur. Bunlar hakkında daha fazla bilgiyi [bölüm ?'da](data#methods) vereceğim.

{{index interpolation, backtick}}

Tek tırnak veya çift tırnakla yazılan dizeler çok benzer şekilde davranır—tek fark, içlerinde hangi tür tırnak karakterini kaçırmanız gerektiğindedir. Geri tırnakla oluşturulmuş dizeler, genellikle _((template literals))_ olarak adlandırılır ve birkaç daha iyi şeyler vardır. Satır soru karakterlerini içlerinde yazabilmenizin yanı sıra, dizenizin içerisine başka dinamik değerler de gömmenizi sağlarlar.

```{meta: "expr"}
`half of 100 is ${100 / 2}`
```

When you write something inside `${}` in a template literal, its result will be computed, converted to a string, and included at that position. This example produces "_half of 100 is 50_".
Bir şablon literalde `${}` içine bir şey yazarsanız, sonucu hesaplanır, bir dizeye dönüştürülür ve dizenin içerisinde yazdığınız o konumda dahil edilir. Bu örnek "_half of 100 is 50_" dizesini üretir.

## Tekil operatörler

{{index operator, "typeof operator", type}}

Tüm operatörler semboller olarak yazılmaz, bazıları kelimeler olarak yazılır. Bu operatörlere bir örnek `typeof` operatörüdür. Bu operatör verdiğiniz değerin türünün adını içeren bir dize değeri üretir.

```
console.log(typeof 4.5)
// → number
console.log(typeof "x")
// → string
```

{{index "console.log", output, "JavaScript console"}}

{{id "console.log"}}

Örnek kodlarda değerlendirmek istediğimiz kodun sonucunu görebilmek için `console.log` kullanacağız. Bununla ilgili daha fazla bilgiye [sonraki bölümde](program_structure) ulaşabilirsiniz.

{{index negation, "- operator", "binary operator", "unary operator"}}

Bu bölümde şimdiye kadar gösterilen diğer operatörlerin hepsi iki değer üzerinde işlem yaparken, typeof sadece bir değer alır. İki değer kullanan operatörler _ikili operatörler_ olarak adlandırılırken, bir tane alanlar _tekil operatörler_ olarak adlandırılır. Eksi operatörü hem ikili operatör olarak hem de tekil operatör olarak kullanılabilir.

```
console.log(- (10 - 2))
// → -8
```

## Boolean değerleri

{{index Boolean, operator, true, false, bit}}

"Evet" ve "hayır" veya "açık" ve "kapalı" gibi yalnızca iki olasılığı birbirinden ayıran bir değere sahip olmak genellikle faydalıdır. Bu amaçla JavaScript'te, birebir bu kelimelerle `true` ve `false` olarak yazılan ve yalnızca iki değere sahip olan bir _Boolean_ türü vardır.

### Karşılaştırma

{{index comparison}}

İşte Boolean değerlerini üretmenin bir yolu:

```
console.log(3 > 2)
// → true
console.log(3 < 2)
// → false
```

{{index [comparison, "of numbers"], "> operator", "< operator", "greater than", "less than"}}

`>` ve `<` işaretleri, sırasıyla "büyüktür" ve "küçüktür" için geleneksel sembollerdir. Bunlar ikili operatörlerdir. Bu operatörleri kullanmak, bu durumda doğru olup olmadığını gösteren bir Boolean değeri üretir.

Dizeler de aynı şekilde karşılaştırılabilir:

```
console.log("Aardvark" < "Zoroaster")
// → true
```

{{index [comparison, "of strings"]}}

Dizelerin sıralanma şekli yaklaşık olarak alfabetiktir, ancak bir sözlükte görmeyi beklediğiniz gibi değildir: büyük harfler her zaman küçük harflerden "daha azdır", bu nedenle "Z" < "a" ifadesi doğrudur ve alfabetik olmayan karakterler (!, -, ve benzeri) de sıralamaya dahildir. Dizeler karşılaştırıldığında, JavaScript karakterleri soldan sağa doğru geçer ve onlara atanmış sayısal değerlerden oluşan Unicode kodlarını bir birine karşı karşılaştırır.

{{index equality, ">= operator", "<= operator", "== operator", "!= operator"}}

Diğer benzer operatörler `>=` (büyük eşittir), `<=` (küçük eşittir), `==` (eşittir) ve `!=` (eşit değildir).

```
console.log("Garnet" != "Ruby")
// → true
console.log("Pearl" == "Amethyst")
// → false
```

{{index [comparison, "of NaN"], NaN}}

JavaScript'te kendine eşit olmayan yalnızca bir değer vardır, o da NaN ("not a number").

```
console.log(NaN == NaN)
// → false
```

`NaN`, anlamsız bir hesaplamanın sonucunu belirtmek için kullanılır ve bu nedenle, başka anlamsız hesaplamaların sonucuyla da eşit değildir.

### Mantıksal operatörler

{{index reasoning, "logical operators"}}

Boolean değerlere kendilerine uygulanabilen bazı işlemler de vardır. JavaScript, üç mantıksal operatörü destekler: _ve_, _veya_ ve _değil_. Bunlar, Boolean değerleri hakkında "akıl yürütmek" için kullanılabilir.

{{index "&& operator", "logical and"}}

`&&` operatörü mantıksal _ve_'yi temsil eder. Bu, ikili bir operatördür ve verilen değerlerin her ikisi de doğruysa sonucu `true` değeri olur.

```
console.log(true && false)
// → false
console.log(true && true)
// → true
```

{{index "|| operator", "logical or"}}

`||` operatörü, mantıksal _veya_'yı gösterir. Verilen değerlerden herhangi biri doğru ise `true` değerini üretir.

```
console.log(false || true)
// → true
console.log(false || false)
// → false
```

{{index negation, "! operator"}}

_Not_ is written as an exclamation mark (`!`). It is a unary operator that flips the value given to it—`!true` produces `false` and `!false` gives `true`.
_Değil operatörü_, bir tekil operatör olarak ünlem işareti (`!`) ile yazılır. Verilen değeri ters çeviren bir operatördür — `!true`, `false` değerini üretir ve `!false` ise `true` değerini üretir.

{{index precedence}}

Bu Boolean operatörlerini aritmetik ve diğer operatörlerle karıştırdığınızda, parantezlere ne zaman ihtiyaç duyacağımız her zaman çok da belli değildir. Uygulamada, şimdiye kadar gördüğümüz operatörlerden, `||` operatörünün en düşük önceliğe sahip olduğunu, sonra `&&` operatörünün daha öncelikli olduğunu, ardından karşılaştırma operatörlerinin (`>`, `==`, vb.) ve sonra geri kalanın daha öncelikli olduğunu bilerek işleri genellikle yürütebilirsiniz. Bu sıra, aşağıdaki gibi tipik ifadelerde mümkün olduğunca az parantez gerektirecek şekilde seçilmiştir:

```{meta: "expr"}
1 + 1 == 2 && 10 * 10 > 50
```

{{index "conditional execution", "ternary operator", "?: operator", "conditional operator", "colon character", "question mark"}}

Bakacağımız son mantıksal operatör, tekil değil, ikili değil, ancak üç değere işlem yapan üçlü operatördür. Soru işareti ve iki nokta üst üste ile şu şekilde yazılır:

```
console.log(true ? 1 : 2);
// → 1
console.log(false ? 1 : 2);
// → 2
```

Bu, _koşullu_ operatör olarak adlandırılır (veya bazen sadece _üçlü operatör_ olarak adlandırılır, çünkü dildeki bu türde var olan tek operatördür). Operatör, soru işaretinin solundaki değeri iki diğer değerden hangisini "seçeceğine" karar vermek için kullanır. `a ? b : c` yazarsanız, `a` değeri `true` olduğunda sonuç `b` veya `a` değeri `false`olduğu takdirde sonuç `c` olur.

## Boş değerler

{{index undefined, null}}

_Anlamlı_ bir değerin yokluğunu belirtmek için kullanılan `null` ve `undefined` olarak yazılan iki özel değer vardır. Kendileri, kendi başlarına birer değerdirler ancak hiçbir bilgi taşımazlar.

Dil içinde herhangi bir değer üretmeyen bir işlem, _herhangi bir_ değeri üretmek zorunda olduğundan ötürü sadece `undefined` değerini üretir.

`undefined` ve `null` arasındaki anlam farkı, JavaScript'in tasarımının bir kazasıdır ve çoğu zaman önemli değildir. Bu değerlerle gerçekten ilgilenmeniz gereken durumlarda, onları genellikle birbirinin yerine kullanılabilir olarak ele almanızı öneririm.

## Otomatik tür dönüşümü

{{index NaN, "type coercion"}}

Giriş bölümünde, JavaScript'in hemen hemen her türde programı kabul etmeye çalıştığını, hatta garip şeyler yapan programları bile kabul ettiğini belirttim. Bunun güzel bir örneği aşağıdaki ifadelerle gösterilmiştir:

```
console.log(8 * null)
// → 0
console.log("5" - 1)
// → 4
console.log("5" + 1)
// → 51
console.log("five" * 2)
// → NaN
console.log(false == 0)
// → true
```

{{index "+ operator", arithmetic, "* operator", "- operator"}}

Bir operatörün "yanlış" türdeki bir değere uygulandığında, JavaScript o değeri sessizce ihtiyaç duyduğu türe dönüştürür, ancak bunu genellikle istemediğiniz veya beklemediğiniz kurallar kullanarak yapar. Buna _((tür dönüşümü))_ denir. İlk ifadedeki `null` `0` olur ve ikinci ifadedeki `"5"` değeri `5`'e dönüşür olur (dize türünden sayıya). Ancak üçüncü ifadede `+`, sayısal eklemeye geçmeden önce dize birleştirme denemesi yapar, bu nedenle `1` değeri "1" değerine dönüştürülür (sayıdan dizeye).

{{index "type coercion", [number, "conversion to"]}}

Açık bir şekilde bir sayıya eşlenmeyen bir şey (örneğin, `"five"` veya `undefined`) sayıya dönüştürüldüğünde, `NaN` değerini elde edersiniz. `NaN` üzerinde yapılan daha fazla aritmetik işlemler, sürekli olarak `NaN` üretir, bu nedenle beklenmedik bir yerde bunlardan birini bulursanız, kazara oluşma ihtimali olan tür dönüşümlerini arayın.

{{index null, undefined, [comparison, "of undefined values"], "== operator"}}

`==` operatörünü kullanarak aynı türdeki değerleri karşılaştırdığınızda, sonucu tahmin etmek kolaydır: her iki değer de aynı olduğunda `true` değerini almalısınız, tabii `NaN` durumunda hariç. Ancak türler farklı olduğunda, JavaScript ne yapacağını belirlemek ve bir değeri diğer değerin türüne çevirip işlemi devam ettirebilmek için karmaşık ve kafa karıştırıcı bir kural seti kullanır. Çoğu durumda, sadece değerlerden birini diğer değerin türüne dönüştürmeye çalışır. Ancak, operatörün herhangi bir tarafında `null` veya `undefined` göründüğünde, yalnızca her iki tarafın da `null` veya `undefined` değerlerinden biri olduğunda `true` değerini üretir.

```
console.log(null == undefined);
// → true
console.log(null == 0);
// → false
```

Bu davranış genellikle yararlıdır. Bir değerin `null` veya `undefined` yerine gerçek bir değer olup olmadığını test etmek istediğinizde, onu `==` veya `!=` operatörü ile null ile karşılaştırabilirsiniz.

{{index "type coercion", [Boolean, "conversion to"], "=== operator", "!== operator", comparison}}

The first tests whether a value is _precisely_ equal to the other, and the second tests whether it is not precisely equal. Thus `"" === false` is false as expected.
Peki ya bir şeyin tam olarak `false` değeri olup olmadığını test etmek istiyorsanız ne olacak? `0 == false` ve `"" == false` gibi ifadeler, otomatik tür dönüşümünden ötürü aynı şekilde `true` değerine çözümlenirler. Herhangi bir tür dönüşümü olmasını _istemiyorsanız_, iki ek operatör vardır: `===` ve `!==`. İlk, bir değerin tam olarak diğerine eşit olup olmadığını test eder ve ikincisi, _tam olarak_ eşit olup olmadığını test eder. Bu nedenle, `"" === false`, ifadesi beklenildiği gibi `false` değerine çözümlenir.

Beklenmedik tür dönüşümlerinin sizi zorlamasını önlemek adına üç karakterli karşılaştırma operatörlerini kullanmanızı öneririm. Ancak eğer her iki taraftaki türlerin aynı olacağından eminseniz, kısa operatörleri kullanmakta da bir sorun yoktur.

### Mantıksal operatörlerin kısa devre davranışı

{{index "type coercion", [Boolean, "conversion to"], operator}}

`&&` ve `||` mantıksal operatörler, farklı türlerdeki değerleri ilginç bir şekilde işlemektedirler. Ne yapacaklarına karar vermek için sol taraftaki değeri Boolean türüne dönüştürürler, ancak operatöre ve bu dönüşümün sonucuna bağlı olarak, ya _orijinal_ sol taraf değerini ya da sağ taraf değerini döndürürler.

{{index "|| operator"}}

Örneğin, `||` operatörü, sol taraftaki değeri `true` değerine dönüştürebiliyorsa o değeri döndürür, aksi takdirde sağ taraftaki değeri döndürür. Bu, değerlerin Boolean olduğunda beklenen etkiyi yapar ve diğer türlerdeki değerler için de benzer bir şey yapar.

```
console.log(null || "user")
// → user
console.log("Agnes" || "user")
// → Agnes
```

{{index "default value"}}

Bu işlevselliği bir varsayılan değere yedek olarak düşmek adına kullanabiliriz. Boş olabilecek bir değeriniz varsa sonrasına `||` operatörünü yazıp yerine varsayılan bir değer olarak gelmesini istediğiniz diğer değeri yazabilirsiniz. Başlangıç ​​değeri eğer `false` değerine dönüştürülebiliyorsa, operatör sonrasına yazdığınız değeri varsayılan değer olarak alırsınız. Dizeleri ve sayıları Boolean değerlere dönüştürme kuralları, `0`, `NaN` ve boş dize (`""`) değerlerinin `false` değeri olarak sayıldığını, diğer tüm değerlerinse `true`değeri olarak sayıldığını belirtir. Bu, `0 || -1` ifadesinin `-1` değerini üreteceğini ve `"" || "!?"` ifadesinin `"!?"`değerini vereceği anlamına gelir.

{{index "?? operator", null, undefined}}

`??` operatörü, `||` operatörüne benzer şekilde çalışır ancak soldaki değer yalnızca `null` veya `undefined` değerlerinden biri olduğunda sağdaki değeri döndürür. Genel olarak `??` operatörün davranışı `||` operatörün davranışı yerine tercih edilir.

```
console.log(0 || 100);
// → 100
console.log(0 ?? 100);
// → 0
console.log(null ?? 100);
// → 100
```

{{index "&& operator"}}

`&&` operatörü de benzer şekilde çalışır ancak tam tersi şekildedir. Soldaki ifade `false` değerine dönüştürülebilecek bir şey ise, o değeri döndürür ve aksi takdirde sağdaki değeri döndürür.

Bu iki operatörün bir başka önemli özelliği de, operatörün sağ tarafında kalan ifadeleri yalnızca gerekli olduğunda değerlendirmeleridir. `true || X` durumunda, `X` ne olursa olsun - hatta o bir program parçasıysa ve korkunç bir şey yapsa bile - sonuç `true` değeri olacaktır ve `X` asla değerlendirilmeyecektir. Aynı şey, false && X için de geçerlidir, bu false'tur ve X göz ardı edilir. Buna _((kısa devre değerlendirme))_ denir.

{{index "ternary operator", "?: operator", "conditional operator"}}

Koşullu operatör de benzer bir şekilde çalışır. İkinci ve üçüncü değerlerden yalnızca seçilen değer değerlendirilecektir.

## Özet

Bu bölümde dört tür JavaScript değerine baktık: sayılar, dizeler, Booleans ve tanımsız değerler. Bu tür değerler, adlarını (`true`, `null`) veya değerlerini (`13`, `"abc"`) yazarak oluşturulur.

Operatörlerle değerleri birleştirebilir ve dönüştürebilirsiniz. Aritmetik (`+`, `-`, `*`, `/`, ve `%`), dize birleştirme (`+`), karşılaştırma (`==`, `!=`, `===`, `!==`, `<`, `>`, `<=`, `>=`) ve mantık (`&&`, `||`, `??`) için ikili operatörler, tekil operatörler (bir sayıyı negatif yapmak için `-`, mantıksal olarak olumsuzlamak için `!` ve bir değerin türünü bulmak için `typeof`) ve bir üçüncü bir değere göre diğer iki değerden birisini seçmek adına var olan tek üçlü operatörü (`?:`) gördük.

Bu, JavaScript'i bir cep hesap makinesi olarak kullanmanız için yeterli bilgiyi verir, ancak çok daha fazlası değil. [Sonraki bölüm](program_structure), bu ifadeleri temel programlara bağlamamıza yardımcı olacak.
