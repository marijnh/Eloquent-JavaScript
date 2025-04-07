{{meta {load_files: ["code/journal.js", "code/chapter/04_data.js"], zip: "node/html"}}}

# Veri Yapıları: Objeler ve Diziler

{{quote {author: "Charles Babbage", title: "Passages from the Life of a Philosopher (1864)", chapter: true}

İki kez bana şu soruyu sordular, 'Eğer makineye yanlış rakamlar girerseniz, doğru cevaplar çıkar mı?' [...] Böyle bir sorunun sorulmasına sebep olan kafa karışıklığı dolu fikirleri anlayamıyorum.

quote}}

{{index "Babbage, Charles"}}

{{figure {url: "img/chapter_picture_4.jpg", alt: "Illustration of a squirrel next to a pile of books and a pair of glasses. A moon and stars are visible in the background.", chapter: framed}}}

{{index object, "data structure"}}

Sayılar, Boole değerleri ve dizeler, ((veri)) yapılarının oluşturulduğu atomlardır. Ancak, birçok bilgi türü, birden fazla atom gerektirir. _Objeler_ bize, daha karmaşık yapılar oluşturmak için obje değerleri de dahil olmak üzere değerleri gruplamamıza olanak sağlar.

Şimdiye kadar oluşturduğumuz programlar, yalnızca basit veri türleri üzerinde çalıştıkları için sınırlıydı. Bu bölüm, temel veri yapılarını tanıtacaktır. Sonunda, yararlı programlar yazmaya başlamak için yeterli bilgiye sahip olacaksınız.

Bölüm, bir miktar gerçekçi bir programlama örneği üzerinden çalışacak ve kavramları uygulandıkları sorunla ilişkilendirecektir. Örnek kodlar genellikle metinde daha önce tanıtılan fonksiyonlar ve bağlantılar üzerine kurulacaktır.

{{if book

Kitabın çevrimiçi kodlama ((kum havuzu)) ([_https://eloquentjavascript.net/code_](https://eloquentjavascript.net/code)) belirli bir bölüm bağlamında kodu çalıştırmanın bir yolunu sağlar. Örnekleri başka bir ortamda çalıştırmaya karar verirseniz, önce bu bölüm için tam kodu kum havuzu sayfasından indirmeyi unutmayın.

if}}

## Sincap

{{index "weresquirrel example", lycanthropy}}

Arada sırada, genellikle akşam 8 ile 10 arasında, ((Jacques)) kendisini tüylü kuyruklu küçük bir kemirgen haline dönüşürken bulur.

Bir yandan, Jacques klasik kurt adamlığına sahip olmadığına oldukça sevinir. Bir sincapa dönüşmek, bir kurt adama dönüşmekten daha az soruna neden olur. Komşuyu yanlışlıkla yemekten endişe etmek yerine (bu garip olurdu), komşunun kedisi tarafından yenilmekten endişe eder. Meşe ağacının tacındaki tehlikeli derecede ince bir dalda, çıplak ve oryantasyonunu yitirmiş olarak uyanmış ve gece odasının kapılarını, pencerelerini kapatmaya ve kendisini meşgul etmeyi birkaç ceviz koyarak başarmıştır.

Ancak Jacques, durumunu tamamen ortadan kaldırmayı tercih ederdi. Dönüşümün düzensiz oluşları, onları tetikleyen bir şeyin olabileceğini düşündürmektedir. Bir süre, sadece meşe ağaçlarına yaklaştığı günlerde olduğuna inandı. Ancak meşe ağaçlarından kaçınmak sorunu durdurmadı.

{{index journal}}

Daha bilimsel bir yaklaşıma geçiş yaparak, Jacques, belirli bir günde yaptığı her şeyi ve dönüşüp dönüşmediğini günlük olarak kaydetmeye başladı. Bu verilerle dönüşümleri tetikleyen koşulları daraltmayı umuyor.

İhtiyacı olan ilk şey, bu bilgileri depolamak için bir veri yapısıdır.

## Veri setleri

{{index ["data structure", collection], [memory, organization]}}

Dijital veri parçalarıyla çalışabilmek için, onu öncelikle makinenin belleğinde temsil etmenin bir yolunu bulmamız gerekecek. Örneğin, 2, 3, 5, 7 ve 11 sayılar ((koleksiyon))unu temsil etmek istediğimizi varsayalım.

{{index string}}

Dizelerle yaratıcı olabiliriz—sonuçta, dizelerin herhangi bir uzunluğu olabilir, bu yüzden içine çok fazla veri koyabiliriz—ve `"2 3 5 7 11"` değerini temsilimiz olarak kullanabiliriz. Ancak bu garip bir yaklaşım. Sayıları dizeden çıkarıp tekrar erişmek için onları sayı türü değerlere dönüştürmeniz gerekir.

{{index [array, creation], "[] (array)"}}

Neyse ki, JavaScript, değer dizilerini depolamak için özel bir veri türü sağlar. Buna _dizi_ denir ve virgüllerle ayrılmış bir değer listesi olarak yazılır, ((köşeli parantezler)) arasında bulunur.

```
let listOfNumbers = [2, 3, 5, 7, 11];
console.log(listOfNumbers[2]);
// → 5
console.log(listOfNumbers[0]);
// → 2
console.log(listOfNumbers[2 - 1]);
// → 3
```

{{index "[] (subscript)", [array, indexing]}}

Bir dizideki elemanlara erişim için kullanılan gösterim için ((köşeli parantezler)) kullanılır. İfadeyi takip eden bir çift köşeli parantez ve bu köşeli parantezler içinde başka bir ifade ile dizi içerisindeki \_((index))\_e denk gelen elementi arayacaktır.

{{id array_indexing}}
{{index "zero-based counting"}}

Bir dizinin ilk dizini sıfırdır, bir değil. Bu nedenle, ilk eleman `listOfNumbers[0]` ile alınır. Sıfır tabanlı sayma, teknolojide uzun bir geleneğe sahiptir ve belirli yönlerden oldukça mantıklıdır, ancak alışması biraz zaman alır. İndeksi, dizinin başlangıcından itibaren atlama miktarı olarak düşünün.

{{id properties}}

## Özellikler

{{index "Math object", "Math.max function", ["length property", "for string"], [object, property], "period character", [property, access]}}

Geçmiş bölümlerde `myString.length` (bir dizgenin uzunluğunu almak için) ve `Math.max` (maksimum fonksiyonu) gibi şüpheli görünen bazı ifadeler gördük. Bunlar, bir değerin _özelliğine_ erişen ifadelerdir. İlk durumda, `myString` değeri içindeki `length` özelliğine erişiriz. İkincisinde, matematikle ilgili sabitler ve fonksiyonlardan oluşan bir koleksiyon olan `Math` nesnesindeki `max` adlı özelliğe erişiriz.

{{index [property, access], null, undefined}}

Hemen hemen tüm JavaScript değerlerinin özellikleri vardır. İstisnalar `null` ve `undefined` değerleridir. Bu değer olmayan değerlerden birinde bir özelliğe erişmeye çalışırsanız, bir hata alırsınız.

```{test: no}
null.length;
// → TypeError: null has no properties
```

{{indexsee "dot character", "period character"}}
{{index "[] (subscript)", "period character", "square brackets", "computed property", [property, access]}}

JavaScript'te özelliklere erişmenin iki temel yolu vardır: bir nokta ile ve köşeli parantezlerle. Hem `value.x` hem de `value[x]`, değer üzerinde bir özelliğe erişir—ancak erişilen özellik tam olarak aynı özellik olmayabilir. Fark, `x`'in nasıl yorumlandığındadır. Nokta kullanırken, noktanın sonrasındaki kelime, erişilmek istenen özelliğin adıdır. Köşeli parantezler kullanırken, parantezler arasındaki ifade, erişilmek istenen özelliğin adını almak için _değerlendirilir_. Nokta kullanılırken, `value.x` ifadesi `value` objesinin "x" adlı özelliğini alırken, köşeli parantezler kullanılan `value[x]` ifadesinde, `x` adındaki değişkenin değerini alır ve bunu bir dizeye dönüştürerek özellik adı olarak kullanır.

Yani eğer ilgilendiğiniz özelliğin adının _color_ olduğunu biliyorsanız, `value.color` yazarsınır. Eğer `i` adlı bağlantının sahip olduğunu değerin adını taşıyan özelliği çıkarmak istiyorsanız, `value[i]` yazarsınız. Özellik adları dizelerdir. Herhangi bir dize olabilirler, ancak nokta notasyonu yalnızca geçerli bağlantı adları gibi görünen adlarla çalışır. Dolayısıyla _2_ veya _John Doe_ adında bir özelliğe erişmek istiyorsanız, köşeli parantezleri kullanmanız gerekir: `value[2]` veya `value["John Doe"]`.

Bir ((dizideki)) öğeler, dizi özelliklerinin bir parçasıdır ve sayıları özellik adları olarak kullanarak saklanır. Sayılarla nokta notasyonunu kullanamazsınız ve genellikle zaten index değerini tutan bir bağlantı kullanmak istersiniz, bu nedenle onlara erişmek için köşeli parantez notasyonunu kullanmanız gerekir.

{{index ["length property", "for array"], [array, "length of"]}}

Dizilerin, dizelerin de sahip olduğu gibi kaç öğe olduğunu söyleyen bir `length` özelliği vardır.

{{id methods}}

## Metodlar

{{index [function, "as property"], method, string}}

Dizelerin ve dizilerin `length` özelliği ötesinde fonksiyon değerleri tutan bir dizi özelliklere de sahiptirler.

```
let doh = "Doh";
console.log(typeof doh.toUpperCase);
// → function
console.log(doh.toUpperCase());
// → DOH
```

{{index "case conversion", "toUpperCase method", "toLowerCase method"}}

Her dizenin bir `toUpperCase` özelliği vardır. Çağrıldığında, tüm harflerin büyük harfe dönüştürüldüğü bir dize kopyası döndürür. Ayrıca, tersi olan `toLowerCase` özelliği de vardır.

{{index "this binding"}}

İlginç bir şekilde, `toUpperCase` özelliğine yapılan çağrıya herhangi bir argüman vermediğimiz halde fonksiyonunu çağırdığımız `"Doh"` dize değerine erişebilmektedir. Bunun nasıl çalıştığı, [Bölüm ?](object#obj_methods)'da açıklanmıştır.

Fonksiyonları içeren özellikler genellikle ait oldukları değerin _metodları_ olarak adlandırılır, örneğin `toUpperCase` bir dize değerinin yöntemidir.

{{id array_methods}}

Bu örnek dizileri manipüle etmek için kullanabileceğiniz iki metodu göstermektedir:

```
let sequence = [1, 2, 3];
sequence.push(4);
sequence.push(5);
console.log(sequence);
// → [1, 2, 3, 4, 5]
console.log(sequence.pop());
// → 5
console.log(sequence);
// → [1, 2, 3, 4]
```

{{index collection, array, "push method", "pop method"}}

`push` metodu dizinin sonuna değerler eklerken `pop` metoduysa tam tersi yapar, yani sonundan bir değer çıkarıp bunu değer olarak döndürür.

{{index ["data structure", stack]}}

Bu biraz komik isimler, bir ((yığın)) üzerinde yapılan işlemler için geleneksel terimlerdir. Bir yığın, programlamada, değerleri yığına iterken ve sonra onları ters sırayla geri çekerken, en son eklenen şeyin ilk önce çıkarılmasına izin veren bir veri yapısıdır. Bunlar programlamada yaygındır—[önceki bölümden](functions#stack) hatırlayabileceğiniz gibi, buna bir örnek olan ((çağrı yığını))nı ele almıştık.

## Objeler

{{index journal, "weresquirrel example", array, record}}

Sincap hikayesine geri dönelim. Günlük yaşanan olayların bir küme olarak temsil edilmesi için dizi veri yapısı kullanılabilir. Ancak, girişler sadece bir sayı veya dize değildir—her girişin bir dizi etkinliği depolaması ve Jacques'nın bir sincapa dönüşüp dönüşmediğini gösteren bir Boolean değerini barındırması gerekir. İdeal olarak, bunları tek bir değere gruplamak ve sonra bu gruplanmış değerleri bir diziye teker teker koymaktır.

{{index [syntax, object], [property, definition], [braces, object], "{} (object)"}}

_((Obje))_ türündeki değerler, farklı özelliklerden koleksiyonlarıdır. Nesne oluşturmanın bir yolu, süslü parantezler ifadesini kullanmaktır.

```
let day1 = {
  squirrel: false,
  events: ["work", "touched tree", "pizza", "running"]
};
console.log(day1.squirrel);
// → false
console.log(day1.wolf);
// → undefined
day1.wolf = false;
console.log(day1.wolf);
// → false
```

{{index [quoting, "of object properties"], "colon character"}}

Parantezlerin içinde, virgüllerle ayrılmış bir özellik listesi bulunur. Her özelliğin bir adı ve ardından iki nokta üst üste ve bir değeri vardır. Bir obje yazıldığında, örnekte olduğu gibi girintili yapmak, okunabilirlik konusunda yardımcı olur. Adları geçerli bağlantı adı olmayan veya geçerli olmayan bir sayı olan özellikler tırnak içine alınmalıdır.

```
let descriptions = {
  work: "Went to work",
  "touched tree": "Touched a tree"
};
```

{{index [braces, object]}}

Bu, parantezlerin JavaScript'te _iki_ anlama geldiği anlamına gelir. Bir ((beyan))ın başında olduklarında, bir beyanlar ((bloğunu)) başlatırlar. Herhangi bir başka konumda, bir nesnenin oluşturulmasını sağlarlar. Neyse ki, bir beyanı süslü parantezle başlatmak pek nadiren kullanışlıdır, bu yüzden bu ikisi arasındaki belirsizlik pek bir problem değildir. Bu iki durumun çakıştığı tek durum, bir kısayol ok fonksiyonundan değer olarak bir nesne döndürmek istediğinizde ortaya çıkar—`n => {prop: n}` yazamazsınız çünkü süslü parantezler fonksiyon gövdesi olarak yorumlanacaktır, obje olduğunu belirtmek için nesnenin etrafına bir parantez kümesi koymak zorundasınız.

{{index undefined}}

Mevcut olmayan bir özelliği okumak size `undefined` değerini verecektir.

{{index [property, assignment], mutability, "= operator"}}

Bir özellik ifadesine bir değer atamak mümkündür. Bu, özellik zaten varsa değerini değiştirir, eğer yoksa da verilend değeri barındıran yeni bir özellik oluşturur.

{{index "tentacle (analogy)", [property, "model of"], [binding, "model of"]}}

Kısaca ((bağlantı))larımızın ahtapot dokungaç modeline geri dönersek—özellik bağlantılarının da onlara benzer olduğunu görürüz. Değerleri kavrarlar ve kavradıkları değerler diğer bağlantı ve özellikler tarafından da sahip olunabilirdir. Nesneleri herhangi bir sayıda üzerine isimler dövmelenmiş dokungaçları olan bir ahtapot olarak düşünebilirsiniz.

{{index "delete operator", [property, deletion]}}

`delete` operatörü, böyle bir ahtapotun dokungaçlarından birini keser. Bu tekil bir operatördür ve herhangi bir nesne özelliğine uygulandığında, adı verilen özelliği nesneden kaldırır. Bu yaygın bir şey değildir, ancak mümkündür.

```
let anObject = {left: 1, right: 2};
console.log(anObject.left);
// → 1
delete anObject.left;
console.log(anObject.left);
// → undefined
console.log("left" in anObject);
// → false
console.log("right" in anObject);
// → true
```

{{index "in operator", [property, "testing for"], object}}

İkili `in` operatörü, bir dizeye veya bir nesneye uygulandığında, bu nesnenin o ada sahip bir özelliği olup olmadığını size söyler. Bir özelliği `undefined` değerini vermek ve gerçekten silmek arasındaki fark, ilk durumda nesnenin _hala özelliğe sahip olmasıdır_ (sadece çok ilginç bir değere sahip değil), ikinci durumda ise özelliğin artık mevcut olmaması ve `in` ikili operatörünün `false` değerini döndürmesidir.

{{index "Object.keys function"}}

Bir nesnenin hangi özelliklere sahip olduğunu öğrenmek için `Object.keys` fonksiyonunu kullanabilirsiniz. Bu fonksiyona argüman olarak nesne verirsiniz ve size nesnenin özellik adlarını içnide barındıran bir dizi döndürür.

```
console.log(Object.keys({x: 0, y: 0, z: 2}));
// → ["x", "y", "z"]
```

Bir nesneden başka bir nesneye tüm özellikleri kopyalayan bir `Object.assign` fonksiyonu vardır.

```
let objectA = {a: 1, b: 2};
Object.assign(objectA, {b: 3, c: 4});
console.log(objectA);
// → {a: 1, b: 3, c: 4}
```

{{index array, collection}}

Öyleyse dizileri belirli bir sırada olan şeylerin dizilerini depolamak için özelleştirilmiş bir nesne türü olarak düşünebiliriz. `typeof []` ifadesini değerlendirirseniz, `"object"` değerini ürettiğini gözlemlersiniz. Onları, uzun, tüm tentakülleri düzenli bir sırayla ve sayılarla dövmelenmiş düz ahtapotlar olarak da düşünebilirsiniz.

{{index journal, "weresquirrel example"}}

Jacques'ın tuttuğu günlüğü, nesnelerden oluşan bir dizi olarak temsil edeceğiz.

```{test: wrap}
let journal = [
  {events: ["work", "touched tree", "pizza",
            "running", "television"],
   squirrel: false},
  {events: ["work", "ice cream", "cauliflower",
            "lasagna", "touched tree", "brushed teeth"],
   squirrel: false},
  {events: ["weekend", "cycling", "break", "peanuts",
            "beer"],
   squirrel: true},
  /* And so on... */
];
```

## Değiştirilebilirlik

Çok yakında _gerçek_ programlamaya geçeceğiz. İlk olarak, anlaşılması gereken biraz daha teori var.

{{index mutability, "side effect", number, string, Boolean, [object, mutability]}}

Önceki bölümlerde tartışılan değer sayılar, dizeler ve Booleans gibi türlerinin tümü ((_değiştirilemezdir_)). Onları birleştirebilir ve onlardan yeni değerler türetebilirsiniz, ancak belirli bir dize değeri aldığınızda, o değer her zaman aynı kalacaktır. İçindeki metin değiştirilemez. İçinde `"cat"` yazan bir dizeniz olduğunda, başka bir kodun dizenizdeki bir karakteri değiştirerek `"rat"` şeklinde yazmasına izin verilmez.

Nesneler farklı çalışır. Özelliklerini _değiştirebilirsiniz_, böylece tek bir nesne değeri farklı zamanlarda farklı içeriğe sahip olabilir.

{{index [object, identity], identity, [memory, organization], mutability}}

120 ve 120 gibi iki sayımız olduğunda, onları depolandıkları fiziksel bitlerin yerlerinin aynı olup olmadığına bakmaksızın tam olarak aynı sayı olarak düşünebiliriz. Objelerde, aynı nesnenin depolandığı alana olan iki referansa sahip olmanın ve aynı özelliklere sahip iki farklı nesnenin bir farkı vardır. Aşağıdaki kodu düşünün:

```
let object1 = {value: 10};
let object2 = object1;
let object3 = {value: 10};

console.log(object1 == object2);
// → true
console.log(object1 == object3);
// → false

object1.value = 15;
console.log(object2.value);
// → 15
console.log(object3.value);
// → 10
```

{{index "tentacle (analogy)", [binding, "model of"]}}

`object1` ve `object2` bağlantıları aynı nesneyi tutar, bu yüzden `object1i` değiştirmek `object2` bağlantısının değerini değiştirir. Bunların aynı _kimliğe_ sahip oldukları söylenir. `object3` bağlantısı, başlangıçta `object1` ile aynı özellik ve değerlere sahip ancak ayrı bir yaşama sahip farklı bir objeye işaret eder.

{{index "const keyword", "let keyword", [binding, "as state"]}}

Bağlantılar ayrıca değiştirilebilir veya sabit olabilir, ancak bu, değerlerinin nasıl davrandığından ayrıdır. Sayı değerleri değişmese de, bir `let` bağlantısını, bağlantının işaret ettiği değeri değiştirerek değişen bir sayıyı takip etmek için kullanabilirsiniz. Benzer şekilde, bir nesneye yapılan bir `const` bağlantısı kendisi değiştirilemeyip sadece aynı nesneye işaret etmeye devam etse de, o nesnenin içerisindeki özellikler değişebilir, bu durumda nesne aynı nesnedir ve kimliği değişmemiştir ancak aynı kimliğe sahip bu nesnenin içerisindeki özellikler değişmiştir gibi düşünebilirsiniz.

```{test: no}
const score = {visitors: 0, home: 0};
// This is okay
score.visitors = 1;
// This isn't allowed
score = {visitors: 1, home: 1};
```

{{index "== operator", [comparison, "of objects"], "deep comparison"}}

JavaScript'in `==` operatörüyle nesneleri karşılaştırdığınızda, kimliğe göre karşılaştırır: Yalnızca her iki nesne de tam olarak aynı değerse `true` değerini üretecektir. Farklı nesneleri karşılaştırmak içeriklerinin tamamen aynı özellik ve değerlerden oluşsa dahil `false` değerinin döndürülmesine sebep olur. JavaScript'e objeleri o objelerin içeriklerine göre karşılaştıran yerleşik "derin" bir karşılaştırma işlemi bulunmamaktadır, ancak içeriklerine göre nesneleri karşılaştıracak bir fonksiyonu kenidiniz yazmanız mümlündür(bu, bu bölümün sonundaki [alıştırmalardan](data#exercise_deep_compare) biridir).

## Sincap kurtadamının günlüğü

{{index "weresquirrel example", lycanthropy, "addEntry function"}}

Bu arada, Jacques JavaScript yorumlayıcısını başlatır ve ((günlüğünü)) tutması için gereken ortamı kurar.

```{includeCode: true}
let journal = [];

function addEntry(events, squirrel) {
  journal.push({events, squirrel});
}
```

{{index [braces, object], "{} (object)", [property, definition]}}

Günlüğe eklenen nesne biraz garip görünüyor. Özelliklerin `events: events` gibi bildirilmesi yerine, sadece bir özellik adı verilmiştir. Bu, aynı anlama gelir- eğer parantez notasyonundaki bir özellik adı bir değerle takip edilmiyorsa, değeri o özellik adıyla aynı adda olan bir bağlantının değerinden alınır.

Böylelikle, her akşam saat 10.00'da—veya bazen ertesi sabah, kitaplığının en üst rafından indikten sonra—Jacques günü kaydeder.

```
addEntry(["work", "touched tree", "pizza", "running",
          "television"], false);
addEntry(["work", "ice cream", "cauliflower", "lasagna",
          "touched tree", "brushed teeth"], false);
addEntry(["weekend", "cycling", "break", "peanuts",
          "beer"], true);
```

Yeterince veri noktasına sahip olduktan sonra, bu olaylardan hangilerinin sincaplaşmayla ilişkili olabileceğini bulmak için istatistikleri kullanmayı amaçlıyor.

{{index correlation}}

_Korelasyon_, istatistiksel değişkenler arasındaki ((bağımlılık)) ölçüsüdür ve istatistiksel değişken programlamadaki değişkenle tam olarak aynı değildir. İstatistikte genelde belirli ölçümler vardır ve her değişken bu ölçümlerle ölçülmektedir. Değişkenler arasındaki korelasyon genellikle -1 ile 1 arasında değişen bir değer olarak ifade edilir. Sıfır korelasyon, değişkenlerin ilişkili olmadığı anlamına gelir. Değeri bir olan bir korelasyon, iki değişkenin mükemmel bir şekilde ilişkili olduğunu gösterir - birini bildiğinizde, diğerini de bilmenizi sağlar. Değeri eksi bir olan bir korelasyon, değişkenlerin mükemmel bir şekilde ilişkili olduğunu ancak bunların zıt olduğunu gösterir - biri doğru olduğunda, diğerinin olmadığını bilmenizi sağlar.

{{index "phi coefficient"}}

İki Boolean değişken arasındaki korelasyon ölçümünü hesaplamak için _fi katsayısını_ (_ϕ_) kullanabiliriz. Bu, girdisi değişkenlerin kaç kere gözlemlendiğini içinde barındıran bir ((frekans tablosu)) olan bir formüldür. Formülün çıktısı, korelasyonu açıklayan -1 ile 1 arasında bir sayıdır.

Yeme olayını içindeki her sayı ölçülerimizde o kombinasyonun kaç kez meydana geldiğini gösteren bir pizza frekans tablosuna yerleştirebiliriz:

{{figure {url: "img/pizza-squirrel.svg", alt: "A two-by-two table showing the pizza variable on the horizontal, and the squirrel variable on the vertical axis. Each cell show how many time that combination occurred. In 76 cases, neither happened. In 9 cases, only pizza was true. In 4 cases only squirrel was true. And in one case both occurred.", width: "7cm"}}}

Eğer o tabloya _n_ dersek, _ϕ_ değerini aşağıdaki formülle hesaplayabiliriz:

{{if html

<div> <table style="border-collapse: collapse; margin-left: 1em;"><tr>   <td style="vertical-align: middle"><em>ϕ</em> =</td>   <td style="padding-left: .5em">     <div style="border-bottom: 1px solid black; padding: 0 7px;"><em>n</em><sub>11</sub><em>n</em><sub>00</sub> −       <em>n</em><sub>10</sub><em>n</em><sub>01</sub></div>     <div style="padding: 0 7px;">√<span style="border-top: 1px solid black; position: relative; top: 2px;">       <span style="position: relative; top: -4px"><em>n</em><sub>1•</sub><em>n</em><sub>0•</sub><em>n</em><sub>•1</sub><em>n</em><sub>•0</sub></span>     </span></div>   </td> </tr></table> </div>

if}}

{{if tex

[\begin{equation}\varphi = \frac{n_{11}n_{00}-n_{10}n_{01}}{\sqrt{n_{1\bullet}n_{0\bullet}n_{\bullet1}n_{\bullet0}}}\end{equation}]{latex}

if}}

(Eğer bu noktada kitabı bırakıp 10. sınıf matematik dersine yoğunlaşmaya başladıysanız—bekleyin! Sizi anlaşılmaz işaretlerle dolu sonsuz sayfalık bir işkenceye tabi tutmak niyetinde değilim—şimdilik sadece bu formül. Ve bu formülle yapacağımız tek şey onu sadece JavaScript'e dönüştürmek.)

Notasyon [_n_~01~]{if html}[[$n_{01}$]{latex}]{if tex}, ilk değişkenin (sincaplık) yanlış (0) ve ikinci değişkenin (pizza) doğru (1) olduğu ölçümlerin sayısını gösterir. Pizza tablosunda, [_n_~01~]{if html}[[$n_{01}$]{latex}]{if tex} 9'dur.

Değer [_n_~1•~]{if html}[[$n_{1\bullet}$]{latex}]{if tex}, ilk değişkenin doğru olduğu tüm ölçümlerin toplamını ifade eder, örneğin tabloda 5'tir. Benzer şekilde, [_n_~•0~]{if html}[[$n_{\bullet0}$]{latex}]{if tex} değeri, ikinci değişkenin yanlış olduğu ölçümlerin toplamını ifade eder.

{{index correlation, "phi coefficient"}}

Dolayısıyla pizza tablosu için, bölümün üst kısmı (pay) 1×76−4×9 = 40 olur ve alt kısmı (payda) 5×85×10×80'ın karekökü, veya [√340000]{if html}[[$\sqrt{340000}$]{latex}]{if tex}. Bu, ϕ ≈ 0.069 olur, yani çok küçüktür. Pizza yemenin dönüşümler üzerinde bir etkisi olmadığı görünmektedir.

## Korelasyonu hesaplama

{{index [array, "as table"], [nesting, "of arrays"]}}

JavaScript'te iki satır iki sütun ((tablo))'yu dört elemanlı bir dizi ile temsil edebiliriz (`[76, 9, 4, 1]`). Ayrıca, diğer temsilleri kullanabiliriz, örneğin, iki iki elemanlı dizi içeren bir dizi (`[[76, 9], [4, 1]]`) veya `"11"` ve `"01"` gibi özellik adlarına sahip bir nesne, ancak düz dizi basittir ve tabloya erişimi kolaylaştırır. Dizinin index değerlerini iki bitlik ((ikili sayı))lar olarak yorumlayacak, soldaki (en önemli) basamak sincap değişkenine ve sağdaki (en önemsiz) basamak olay değişkenine atıfta bulunmasını sağlayacağız. Örneğin, ikili sayı `10`, Jacques'nin bir sincap haline geldiği ancak olayın (örneğin, "pizza") gerçekleşmediği durumu ifade eder. Bu dört kez oldu. Ve iki gösterimdeki `10` sayısı ondalık gösterimde 2 olduğundan ötürü bu sayıyı dizinin 2. index değer pozisyonuna kaydedeceğiz.

{{index "phi coefficient", "phi function"}}

{{id phi_function}}

Böyle bir diziyle ϕ katsayısını hesaplayan fonksiyon budur:

```{includeCode: strip_log, test: clip}
function phi(table) {
  return (table[3] * table[0] - table[2] * table[1]) /
    Math.sqrt((table[2] + table[3]) *
              (table[0] + table[1]) *
              (table[1] + table[3]) *
              (table[0] + table[2]));
}

console.log(phi([76, 9, 4, 1]));
// → 0.068599434
```

{{index "square root", "Math.sqrt function"}}

Bu, _ϕ_ formülünün JavaScript'e doğrudan çevirisidir. `Math.sqrt`, standart bir JavaScript ortamında `Math` nesnesi tarafından sağlanan karekök işlemidir. [n~1•~]{if html}[[$n_{1\bullet}$]{latex}]{if tex} gibi alanları elde etmek için tablodan iki alan eklememiz gerekmektedir çünkü satır veya sütunların toplamları doğrudan veri yapımızda saklanmamaktadır.

{{index "JOURNAL dataset"}}

Jacques günlüğünü üç ay boyunca tuttu. Ortaya çıkan ((veri seti)), bu bölüm için[ ([_https://eloquentjavascript.net/code#4_](https://eloquentjavascript.net/code#4))]{if book} kod [kum havuzunda](https://eloquentjavascript.net/code#4) mevcuttur, burada `JOURNAL` bağlantısında saklanır ve bir [dosya](https://eloquentjavascript.net/code/journal.js) halinde indirilebilir.

{{index "tableFor function"}}

Günlükten belirli bir olay için iki satır iki sütun bir ((tablo)) çıkarmak adına tüm girişler üzerinde döngü yapıp olayın sincap dönüşümlerine göre kaç kere yaşandığını saymalıyız.

```{includeCode: strip_log}
function tableFor(event, journal) {
  let table = [0, 0, 0, 0];
  for (let i = 0; i < journal.length; i++) {
    let entry = journal[i], index = 0;
    if (entry.events.includes(event)) index += 1;
    if (entry.squirrel) index += 2;
    table[index] += 1;
  }
  return table;
}

console.log(tableFor("pizza", JOURNAL));
// → [76, 9, 4, 1]
```

{{index [array, searching], "includes method"}}

Dizilerin `includes` metodu, verilen bir değerin dizide var olup olmadığını kontrol eder. Fonksiyon, bunu kullanır ilgilendiği olayın o günkü olay listesinin bir parçası olup olmadığını belirlemek için kullanır.

{{index [array, indexing]}}

`tableFor` içindeki döngünün gövdesi, her günlük girişinin özel olarak ilgilenilen olayı içerip içermediğini ve olayın bir sincap olayıyla aynı anda gerçekleşip gerçekleşmediğini kontrol ederek tablodaki hangi kutuya düştüğünü belirler. Döngü daha sonra tablodaki doğru kutuya bir ekler.

Şimdi, bireysel ((korelasyon))ları hesaplamak için ihtiyacımız olan araçlara sahibiz. Kalan tek adım, kaydedilen her tür olay için bir korelasyon bulmak ve herhangi bir şeyin dikkat çekip çekmediğini görmektir.

{{id for_of_loop}}

## Dizi döngüleri

{{index "for loop", loop, [array, iteration]}}

`tableFor` fonksiyonunda şöyle bir döngü var:

```
for (let i = 0; i < JOURNAL.length; i++) {
  let entry = JOURNAL[i];
  // Do something with entry
}
```

Bu tür bir döngü, klasik JavaScript'te yaygındır—dizilerin her bir elemanını tek tek geçmek sık sık karşılaşılan bir durumdur ve bunu yapmak için dizinin uzunluğu üzerinde bir sayaç çalıştırarak sırayla her elemanı seçersiniz.

Modern JavaScript'te böyle döngüleri daha basit bir şekilde yazmanın bir yolu var.

```
for (let entry of JOURNAL) {
  console.log(`${entry.events.length} events.`);
}
```

{{index "for/of loop"}}

Bir `for` döngüsü şu şekilde görünüyorsa, bir değişken tanımından sonra `of` kelimesi varsa, `of` kelimesinden sonra verilen değerin öğeleri üzerinde döngüyü başlatır. Bu yalnızca diziler için değil dizeler ve bazı diğer veri yapıları için de çalışır. Nasıl çalıştığını [Bölüm ?](object)’de tartışacağız.

{{id analysis}}

## Son analiz

{{index journal, "weresquirrel example", "journalEvents function"}}

Veri setinde bulunan her tür olay için bir korelasyon hesaplamamız gerekiyor. Bunun için önce her tür olayı _bulmalıyız_.

{{index "includes method", "push method"}}

```{includeCode: "strip_log"}
function journalEvents(journal) {
  let events = [];
  for (let entry of journal) {
    for (let event of entry.events) {
      if (!events.includes(event)) {
        events.push(event);
      }
    }
  }
  return events;
}

console.log(journalEvents(JOURNAL));
// → ["carrot", "exercise", "weekend", "bread", …]
```

Tüm olayların üzerinden geçerek, içinde var olmayanları olayları `events` dizisine ekleyerek, fonksiyon her tür olayı toplar.

Bunu kullanarak, tüm ((korelasyon))ları görebiliriz.

```{test: no}
for (let event of journalEvents(JOURNAL)) {
  console.log(event + ":", phi(tableFor(event, JOURNAL)));
}
// → carrot:   0.0140970969
// → exercise: 0.0685994341
// → weekend:  0.1371988681
// → bread:   -0.0757554019
// → pudding: -0.0648203724
// And so on...
```

Çoğu korelasyonun sıfıra yakın olduğu görünüyor. Havuç, ekmek veya puding yemek açıkça sincapa dönüşmeyi tetiklemiyor gibi görünüyor. Bununla birlikte, hafta sonlarında biraz daha sık meydana gelme eğiliminde olduğunu fark ediyoruz. Sonuçları, 0,1'den büyük veya -0,1'den küçük olan korelasyonları göstermek için filtreleyelim.

```{test: no, startCode: true}
for (let event of journalEvents(JOURNAL)) {
  let correlation = phi(tableFor(event, JOURNAL));
  if (correlation > 0.1 || correlation < -0.1) {
    console.log(event + ":", correlation);
  }
}
// → weekend:        0.1371988681
// → brushed teeth: -0.3805211953
// → candy:          0.1296407447
// → work:          -0.1371988681
// → spaghetti:      0.2425356250
// → reading:        0.1106828054
// → peanuts:        0.5902679812
```

Aha! Diğerlerinden açıkça daha güçlü bir ((korelasyon))a sahip olan iki faktör var. Fıstık yemek, bir sincap haline dönüşme şansı üzerinde güçlü bir pozitif etkiye sahipken, dişlerini fırçalamak ise önemli bir negatif etkiye sahiptir.

İlginç. Bir şey deneyelim.

```
for (let entry of JOURNAL) {
  if (entry.events.includes("peanuts") &&
     !entry.events.includes("brushed teeth")) {
    entry.events.push("peanut teeth");
  }
}
console.log(phi(tableFor("peanut teeth", JOURNAL)));
// → 1
```

Bu güçlü bir sonuç. Olay, Jacques fıstık yediği ve dişlerini fırçalamadığı zaman meydana geliyor. Keşke dental hijyen konusunda böylesine dikkatsiz olmasaydı, belki de bu hastalığını hiç fark etmeyecekti.

Bunu öğrendikten sonra, Jacques fıstık yemeyi tamamen bırakır ve dönüşümlerinin durduğunu fark eder.

{{index "weresquirrel example"}}

Ancak, tamamen insanca yaşama şeklinde eksik bir şey olduğunu fark etmesi birkaç ayını alır. Vahşi maceraları olmadan Jacques kendini neredeyse hiç yaşamıyor gibi hisseder. Tam zamanlı bir vahşi hayvan olmayı tercih eder. Ormanda güzel bir ağaç ev inşa eder ve kurduğu bir fıstık ezmesi dağıtıcısına on yıllık fıstık ezmesi stoku sağladıktan sonra, son bir kez daha değişir ve bir sincap olarak kısa ve enerjik bir yaşam sürer.

## Diziler hakkında daha fazla bilgi

{{index [array, methods], [method, array]}}

Bu bölümü bitirmeden önce, size birkaç daha objelerle ilgili kavramı tanıtmak istiyorum. Genel olarak kullanışlı birkaç dizi metodu tanıtarak başlayacağım.

{{index "push method", "pop method", "shift method", "unshift method"}}

Bu bölümde [daha önce](data#array_methods) gördüğümüz `push` ve `pop` yöntemleri, bir dizinin sonuna eleman ekler ve kaldırır. Bir dizinin başına şeyler eklemek ve kaldırmak için karşılık gelen yöntemler `unshift` ve `shift` olarak adlandırılır.

```
let todoList = [];
function remember(task) {
  todoList.push(task);
}
function getTask() {
  return todoList.shift();
}
function rememberUrgently(task) {
  todoList.unshift(task);
}
```

{{index "task management example"}}

Bu program, görevlerden oluşan bir kuyruğu yönetir. `remember("groceries")` çağrısıyla görevleri kuyruğun sonuna eklersiniz ve bir şey yapmaya hazır olduğunuzda, `getTask()` çağrısıyla kuyruğun önündeki öğeyi alırsınız (ve kaldırırsınız). `rememberUrgently` fonksiyonu da bir görev ekler ancak bunu kuyruğun sonuna değil önüne ekler.

{{index [array, searching], "indexOf method", "lastIndexOf method"}}

Belirli bir değeri aramak için, diziler `indexOf` metodunu sağlar. Bu yöntem, istenen değerin bulunduğu dizinin indexini bulur ve döndürür - veya bulunamadıysa -1 değerini döndürür. Arama için dizinin sonundan başlamak isterseniz, benzer bir yöntem olan `lastIndexOf` vardır.

```
console.log([1, 2, 3, 2, 1].indexOf(2));
// → 1
console.log([1, 2, 3, 2, 1].lastIndexOf(2));
// → 3
```

`indexOf` ve `lastIndexOf` her ikisi de başlamak için opsiyonel olan ikinci argüman alır ve nereden aramaya başlanacağını belirtir.

{{index "slice method", [array, indexing]}}

Başka bir temel dizi metodu olan `slice`, başlangıç ve bitiş index değerlerini alır ve yalnızca bunlar arasındaki öğeleri içeren bir dizi döndürür. Başlangıç index değerinde bulunan değer döndürülen diziye dahilken bitiş index değerindeki değer hariçtir.

```
console.log([0, 1, 2, 3, 4].slice(2, 4));
// → [2, 3]
console.log([0, 1, 2, 3, 4].slice(2));
// → [2, 3, 4]
```

{{index [string, indexing]}}

Bitiş dizini verilmediğinde, `slice` başlangıç index değerinden sonraki tüm öğeleri alır. Ayrıca tüm diziyi kopyalamak adına başlangıç index değerini de vermeyebilirsiniz.

{{index concatenation, "concat method"}}

`concat` metodu dizileri bir araya getirerek yeni bir dizi oluşturmada da kullanılabilir, bu işlem `+` operatörünün dizinlere yaptığı işleme benzerdir.

Aşağıdaki örnek, hem `concat` hem de `slice` metodlarının kullanımını gösteriyor. Bir dizi ve bir index değeri alıp verilen index değerindeki öğe çıkarılmış olan orijinal dizinin bir kopyasını döndürür.

```
function remove(array, index) {
  return array.slice(0, index)
    .concat(array.slice(index + 1));
}
console.log(remove(["a", "b", "c", "d", "e"], 2));
// → ["a", "b", "d", "e"]
```

`concat` metoduna bir dizi olmayan bir argüman verirseniz, bu değer yeni diziye tek bir öğe barındıran bir diziymiş gibi eklenecektir.

## Dizeler ve özellikleri

{{index [string, properties]}}

Dizin değerlerinden `length` ve `toUpperCase` gibi özellikleri okuyabiliriz. Ancak yeni bir özellik eklemeye çalışırsanız, yapışmaz.

```
let kim = "Kim";
kim.age = 88;
console.log(kim.age);
// → undefined
```

Dize, sayı ve Boolean türlerinin değerleri nesneler değildir ve dil bunlara yeni özellikler eklemeye çalışırsanız şikayet etmese de aslında bu özellikleri saklamaz. Daha önce belirtildiği gibi, bu tür değerler değiştirilemezler.

{{index [string, methods], "slice method", "indexOf method", [string, searching]}}

Ancak, bu türlerin yerleşik özellikleri vardır. Her dize değeri bir belirli özelliklere sahiptir. Bazı çok kullanışlı olanları `slice` ve `indexOf` metodlarıdır ve aynı isimde olan dizi metodlarına benzerler.

```
console.log("coconuts".slice(4, 7));
// → nut
console.log("coconut".indexOf("u"));
// → 5
```

Bir fark, bir dizenin `indexOf` metodunun birden fazla karakter içeren bir dizeyi arayabilmesidir, oysa ilgili dizi metodu yalnızca tek bir öğe arar.

```
console.log("one two three".indexOf("ee"));
// → 11
```

{{index [whitespace, trimming], "trim method"}}

`trim` metodu, bir dizinin başından ve sonundan boşlukları (boşluklar, yeni satırlar, tab vb. karakterler) kaldırır.

```
console.log("  okay \n ".trim());
// → okay
```

{{id padStart}}

[Önceki bölüm](functions)'deki `zeroPad` fonksiyonu aynı zamanda bir metod olarak da mevcuttur. `padStart` olarak adlandırılır ve istenen uzunluğu ve dolgu karakterini argüman olarak alır.

```
console.log(String(6).padStart(3, "0"));
// → 006
```

{{id split}}

{{index "split method"}}

Bir dizeyi başka bir dizenin her görünümünde `split` aracılıyla bölebilir ve onu tekrar `join` ile birleştirebilirsiniz.

```
let sentence = "Secretarybirds specialize in stomping";
let words = sentence.split(" ");
console.log(words);
// → ["Secretarybirds", "specialize", "in", "stomping"]
console.log(words.join(". "));
// → Secretarybirds. specialize. in. stomping
```

{{index "repeat method"}}

Bir dizeyi `repeat` metodunu kullanarak tekrarlayabilirsiniz, böylelikle eski dizeyi birden fazla kez içerisinde barındıran başka yeni bir dize oluşturmuş olursunuz.

```
console.log("LA".repeat(3));
// → LALALA
```

{{index ["length property", "for string"], [string, indexing]}}

Dize türünün `length` özelliğini zaten gördük. Bir dizideki bireysel karakterlere erişmek, dizi öğelerine erişmek gibi görünür ([bölüm ?](higher_order#code_units)'da inceleyeceğimiz bir karmaşıklıkla).

```
let string = "abc";
console.log(string.length);
// → 3
console.log(string[1]);
// → b
```

{{id rest_parameters}}

## Kalan parametreleri

{{index "Math.max function", "period character", "max example", spread, [array, "of rest arguments"]}}

Bir fonksiyonunun belirli olmayan, herhangi bir sayıda argüman kabul etmesi yararlı olabilir. Örneğin, `Math.max`, verildiğinde tüm verilen argümanların maksimumunu hesaplar.

{{index "period character", "max example", spread, [array, "of rest arguments"]}}

Böyle bir fonksiyon yazmak için, fonksiyonun son ((parametresi))nın önüne üç nokta koyarsınız:

```{includeCode: strip_log}
function max(...numbers) {
  let result = -Infinity;
  for (let number of numbers) {
    if (number > result) result = number;
  }
  return result;
}
console.log(max(4, 1, 9, -2));
// → 9
```

Böyle bir fonksiyon çağrıldığında, _((kalan parametre))_ tüm diğer argümanları içeren bir diziyle ilişkilendirilir. Eğer ondan önce başka parametreler varsa, bu değerler bu dizinin bir parçası olmayacaktır ancak eğer `max` fonksiyonda olduğu gibi tek başına bir kalan parametresi varsa o zaman tüm değişkenleri içerecektir.

{{index [function, application]}}

Benzer bir üç nokta gösterimi kullanarak bir fonksiyonu bir dizi argümanla çağırmak da mümkündür.

```
let numbers = [5, 1, 7];
console.log(max(...numbers));
// → 7
```

Bu, diziyi fonksiyon çağrısına (("yayarak")) öğelerini ayrı argümanlar olarak geçirir. Bu şekilde, `max(9, ...numbers, 2)` şeklinde hem bir diziyi yayarak hem de yaymayarak farklı argümanlar vermek mümkündür.

{{index "[] (array)"}}

Köşeli parantez dizisi gösterimi, üç nokta operatörünü başka bir diziyi yeni diziye yaymak için de kullanılabilir.

```
let words = ["never", "fully"];
console.log(["will", ...words, "understand"]);
// → ["will", "never", "fully", "understand"]
```

{{index "{} (object)"}}

Bu süslü parantez nesnelerinde de çalışmaktadır ve başka bir nesnedeki tüm özellikleri diğer nesneye ekler. Eğer aynı addaki bir özellik aynı objeye tekrar ve tekrar farklı değerlerle eklenirse, en son eklenmiş olan değer o isimdeki özelliğin değeri olacaktır.

```
let coordinates = {x: 10, y: 0};
console.log({...coordinates, y: 5, z: 1});
// → {x: 10, y: 5, z: 1}
```

## Math nesnesi

{{index "Math object", "Math.min function", "Math.max function", "Math.sqrt function", minimum, maximum, "square root"}}

Gördüğümüz gibi, `Math`, `Math.max` (maksimum), `Math.min` (minimum) ve `Math.sqrt` (karekök) gibi sayılarla ilgili yardımcı fonksiyonları bir arada barındıran bir nesnedir.

{{index namespace, [object, property]}}

{{id namespace_pollution}}

`Math` nesnesi, bir dizi ilgili fonksiyonaliteyi gruplamak için bir konteyner olarak kullanılır. Yalnızca bir `Math` nesnesi vardır ve hemen hemen hiç bir zaman değer olarak yararlı değildir. Daha çok, tüm bu fonksiyonların ve değerlerin global bağlantıları olmasına gerek kalmaması için bir _ad alanı_ sağlar.

{{index [binding, naming]}}

Çok fazla global bağlantıların varlığı ad alanını "kirletir". Ne kadar çok isim alındıysa, bir varolan bağlantının değerini yanlışlıkla değiştirme olasılığınız o kadar artar. Örneğin, programlarınızdan birinde bir şeyi `max` olarak adlandırmak istemek olasıdır. JavaScript'in yerleşik `max` işlevi güvenli bir şekilde `Math` nesnesinin içine gizlenmiş olduğundan ötürü onun değerini istemeden değiştirmemiz olasılığı üzerine endişelenmemize gerek yoktur.

{{index "let keyword", "const keyword"}}

Birçok dil, zaten alınmış bir isme sahip bir bağlantı tanımladığınızda sizi durdurur veya en azından uyarır. JavaScript bunu, `let` veya `const` ile tanımladığınız bağlanmalar için yapar ama tuhaf bir şekilde standart bağlantılar ya da `var` veya `function` ile tanımlanan bağlantılar için yapmaz.

{{index "Math.cos function", "Math.sin function", "Math.tan function", "Math.acos function", "Math.asin function", "Math.atan function", "Math.PI constant", cosine, sine, tangent, "PI constant", pi}}

`Math` nesnesine geri dönelim. Eğer ((trigonometri)) yapmanız gerekiyorsa, `Math` size yardımcı olabilir. `cos` (kosinüs), `sin` (sinüs) ve `tan` (tanjant) gibi trigonometrik fonksiyonları, ayrıca bunların ters fonksiyonlarını, sırasıyla `acos`, `asin` ve `atan` içerir. Pi sayısı—veya en azından bir JavaScript sayısına sığan en yakın yaklaşım—`Math.PI` olarak mevcuttur. Sabit değerlerin adlarını tamamı büyük harflerle yazma gibi eski bir programlama geleneği vardır.

```{test: no}
function randomPointOnCircle(radius) {
  let angle = Math.random() * 2 * Math.PI;
  return {x: radius * Math.cos(angle),
          y: radius * Math.sin(angle)};
}
console.log(randomPointOnCircle(2));
// → {x: 0.3667, y: 1.966}
```

Eğer sinüs ve kosinüslerle aşina değilseniz, endişelenmeyin. Kitapta kullanıldıklarında, [bölümün ?](dom#sin_cos)'da açıklayacağım.

{{index "Math.random function", "random number"}}

Önceki örnek, `Math.random` kullanıyordu. Bu, her çağrıldığında sıfır (dahil) ile bir (hariç) arasında bir yarı rastgele sayı döndüren bir fonksiyondur.

```{test: no}
console.log(Math.random());
// → 0.36993729369714856
console.log(Math.random());
// → 0.727367032552138
console.log(Math.random());
// → 0.40180766698904335
```

{{index "pseudorandom number", "random number"}}

Bilgisayarlar deterministik makinelerdir—her zaman aynı giriş verildiğinde her zaman aynı şekilde tepki verirler—ancak onları rastgele görünen sayılar üretmeleri için yönlendirebilirsiniz. Bunun için, makine bazı gizli bir değeri saklar ve yeni bir rastgele sayı istediğinizde, bu gizli değer üzerinde karmaşık hesaplamalar yaparak yeni bir değer oluşturur. Yeni bir değer saklar ve ondan türetilmiş bir sayı döndürür. Bu şekilde her zaman rastgele gibi görünen yeni ve tahmin edilmesi zor sayılar üretebilir.

{{index rounding, "Math.floor function"}}

Kesirli bir sayı yerine bütün rastgele bir sayı istiyorsak, `Math.random` fonksiyonunun sonucuna `Math.floor` (en yakın tam sayıya yuvarlar) kullanabiliriz.

```{test: no}
console.log(Math.floor(Math.random() * 10));
// → 2
```

Rastgele sayıyı 10 ile çarptığımızda, 0 veya daha büyük bir sayı ve 10'un altında bir sayı elde ederiz. `Math.floor` yuvarladığı için, bu ifade, eşit bir şansla, 0 ile 9 arasındaki herhangi bir sayıyı üretecektir.

{{index "Math.ceil function", "Math.round function", "Math.abs function", "absolute value"}}

`Math.ceil`(en yakın bir üst tam sayıya yuvarlar), `Math.round`(en yakın tam sayıya yuvarlar) ve `Math.abs` gibi bir sayının mutlak değerini alan, yani verilen sayıyı eksi ile çarpan ancak verilen sayı zaten pozitifse olduğu gibi bırakan fonksiyonlar da vardır.

## Parçalara ayırma

{{index "phi function"}}

Bir an için `phi` fonksiyonuna geri dönelim.

```{test: wrap}
function phi(table) {
  return (table[3] * table[0] - table[2] * table[1]) /
    Math.sqrt((table[2] + table[3]) *
              (table[0] + table[1]) *
              (table[1] + table[3]) *
              (table[0] + table[2]));
}
```

{{index "destructuring binding", parameter}}

Bu fonksiyonun okunması zor olmasının bir nedeni, dizimize işaret eden bir bağlantımızın olması, ancak dizinin elemanları için `let n00 = table[0]` benzeri bir bağlantımızın olmasını bize okunurlukta çok daha yardımcı olacaktır. Neyse ki, JavaScript'te bunu kısa ve öz bir şekilde yapmanın yolu bulunmakta.

```
function phi([n00, n01, n10, n11]) {
  return (n11 * n00 - n10 * n01) /
    Math.sqrt((n10 + n11) * (n00 + n01) *
              (n01 + n11) * (n00 + n10));
}
```

{{index "let keyword", "var keyword", "const keyword", [binding, destructuring]}}

Bu, `let`, `var` veya `const` ile oluşturulan bağlantılar için çalışmaktadır. Bağlantı oluşturduğunuz değerin bir dizi olduğunu bildiğinizde, içeriğine "bakmak" için ((köşeli parantezleri)) kullanabilir ve içeriğindeki değerlere bağlantılar oluşturabilirsiniz.

{{index [object, property], [braces, object]}}

Köşeli parantezler yerine süslü parantezler kullanılan ve nesneler için çalışan diğer bir yöntem.

```
let {name} = {name: "Faraji", age: 23};
console.log(name);
// → Faraji
```

{{index null, undefined}}

Unutmayın ki, `null` veya `undefined`'i ayrıştırmaya çalışırsanız, bu değerlerin özelliklerine doğrudan erişmeye çalıştığınızdan ötürü bir hata alırsınız.

## Opsiyonel özellik erişimi

{{index "optional chaining", "period character"}}

Belirli bir nesnenin var olduğundan emin değilseniz, ancak var olduğunda ondan bir özelliği okumak istiyorsanız, nokta notasyonunun bir varyantını kullanabilirsiniz: `object?.property`.

```
function city(object) {
  return object.address?.city;
}
console.log(city({address: {city: "Toronto"}}));
// → Toronto
console.log(city({name: "Vera"}));
// → undefined
```

`a?.b` ifadesi, `a` değeri `null` veya `undefined` değilse `a.b` ifadesiyle aynı anlamına gelir ancak eğer `null` veya `undefined` ise o zaman, değeri `undefined` olur. Örnekte de olduğu gibi, belirli bir özelliğin varlığından emin olmadığınızda kullanışlı olabilir.

Benzer bir notasyon `?.` koyularak köşeli parantez erişimi ile köşeli parantezlerden önce, hatta fonksiyon çağrılarında parantezlerden önce de kullanılabilir.

```
console.log("string".notAMethod?.());
// → undefined
console.log({}.arrayProp?.[0]);
// → undefined
```

## JSON

{{index [array, representation], [object, representation], "data format", [memory, organization]}}

Özellikler değerlerini içermek yerine kavradığındna ötürü, nesneler ve diziler bilgisayarın belleğinde, içeriklerinin _adresini_ bit dizileri halinde depolamaktadır. Dolayısıyla, içinde başka bir dizi bulunan bir dizi, iç dizi için en az bir bellek bölgesi ve iç dizenin adresini temsil eden bir numara içeren dış dizi için başka bir bellek bölgesinden oluşur.

Veriyi daha sonra bir dosyada saklamak veya ağ üzerinden başka bir bilgisayara göndermek istiyorsanız, bu bellek adreslerinin karmakarışık dizilerini saklanabilir veya gönderilebilir bir açıklamaya dönüştürmek zorundasınız. Tahminimce, ilgilendiğiniz değerin adresiyle birlikte tüm bilgisayar belleğinizi gönderebilirsiniz, ancak bu en iyi yaklaşım gibi görünmüyor.

{{indexsee "JavaScript Object Notation", JSON}}

{{index serialization, "World Wide Web"}}

Yapabileceğimiz şey, veriyi _serileştirmek_. Bu, verinin düz bir açıklamaya dönüştürülmesi anlamına gelir. Popüler bir seri hale getirme biçimi, _((JSON))_ olarak adlandırılan (ceysın olarak telaffuz edilen) bir biçimdir ve JavaScript Nesne Notasyonu anlamına gelir. Web'de JavaScript dışındaki dillerde bile veri depolama ve iletişim biçimi olarak geniş bir şekilde kullanılmaktadır.

{{index [array, notation], [object, creation], [quoting, "in JSON"], comment}}

JSON, JavaScript'in dizileri ve nesneleri yazma şekline benzer, ancak bazı kısıtlamaları vardır. Tüm özellik adları çift tırnaklarla çevrelenmelidir ve yalnızca basit veri ifadelerine izin verilir - fonksiyon çağrıları, bağlantılar veya gerçek hesaplamayı içeren hiçbir şey yoktur. JSON'da yorum satırlarına da izin verilmemektedir.

Bir günlük girişi, JSON verisi olarak temsil edildiğinde şöyle görünebilir:

```{lang: "json"}
{
  "squirrel": false,
  "events": ["work", "touched tree", "pizza", "running"]
}
```

{{index "JSON.stringify function", "JSON.parse function", serialization, deserialization, parsing}}

JavaScript, veriyi bu formata dönüştürmek ve bu formattan dönüştürmek için `JSON.stringify` ve `JSON.parse` fonksiyonlarını sağlar. İlki bir JavaScript değerini alır ve bir JSON formatında kodlanmış bir dize döndürür. İkincisi, JSON formatında kodlanmış bir dizeyi alır ve onu kodlandığı değere dönüştürür.

```
let string = JSON.stringify({squirrel: false,
                             events: ["weekend"]});
console.log(string);
// → {"squirrel":false,"events":["weekend"]}
console.log(JSON.parse(string).events);
// → ["weekend"]
```

## Özet

Nesneler ve diziler(ki diziler de belirli bir tür nesnedir) birden fazla değeri tek bir değere gruplama yolları sağlar. Kavramsal olarak, bu bize tüm bireysel şeylerin etrafına kollarımızı sarmak ve bunları ayrı ayrı tutmaya çalışmak yerine bir grup ilgili şeyi bir çantaya koyup çantayla koşmamıza olanak tanır.

`null` ve `undefined` değerleri dışında JavaScript'teki değerlerler özelliklere sahiptir. Özelliklere `value.prop` veya `value["prop"]` kullanılarak erişilir. Nesneler özelliklerinin adlarını kullanır ve bunların sabit bir kümesini saklar. Diziler ise genellikle kavramsal olarak aynı değerlerin değişen miktarlarını içerebilir ve özelliklerinin adları olarak sayıları (0'dan başlayarak) kullanır.

Dizilerde bazı adlandırılmış özellikler _vardır_, bunlar `length` ve metod isimleridir. Yöntemler, özelliklerde yaşayan ve genellikle özelliği oldukları değer üzerinde hareket eden fonksiyonlardır.

Diziler üzerinde bir tür özel `for` döngüsü kullanarak yineleme yapabilirsiniz, `for (let element of array)`.

## Egzersizler

### Belirli bir sayı aralığının toplamı

{{index "summing (exercise)"}}

Bu kitabın [giriş](intro) kısmı, aşağıdakini bir aralıktaki sayıların toplamını hesaplamanın güzel bir yol olduğunu size söyledi:

```{test: no}
console.log(sum(range(1, 10)));
```

{{index "range function", "sum function"}}

`start` ve `end` adında iki argüman alan `range` adlı bir fonksiyon yazın ki `start` argümanında verilen değerden başlayarak `end` argümanında bitecek şekilde her ikisini ve aralarındaki sayıları da içinde barındıracak bir dizi döndürsün.

Sonra, `sum` adlı içinde numaralar barındıran bir diziyi alan ve bunların toplamını hesaplayan bir fonksiyon yazın. Bunları bir araya getirip örnek programı çalıştırdığınızda 55 değerinin döndürülüp döndürülmediğini kontrol edin.

{{index "optional argument"}}

Bonus bir görev olarak, `range` fonksiyonunuzu, diziyi oluşturulurken kullanılan "adım" değerini belirten isteğe bağlı üçüncü bir argümanı alacak şekilde değiştirin. Adım verilmediğinde, öğeler normal davranış olan bir bir artırılarak gider. Fonksiyon çağrısı `range(1, 10, 2)`, `[1, 3, 5, 7, 9]` değerini döndürmelidir. Negatif adım değerleriyle de çalıştığından emin olmak için `aralık(5, 2, -1)` fonksiyon çağrısı `[5, 4, 3, 2]` değerini üretmelidir.

{{if interactive

```{test: no}
// Kodunuz buraya.

console.log(range(1, 10));
// → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(range(5, 2, -1));
// → [5, 4, 3, 2]
console.log(sum(range(1, 10)));
// → 55
```

if}}

{{hint

{{index "summing (exercise)", [array, creation], "square brackets"}}

Bir dizi oluşturmanın en kolay yolu, öncelikle [] (temiz, boş bir dizi) için bir bağlantıyla başlamak ve bir değer eklemek için tekrar tekrar `push` metodunu çağırmaktır. Fonksiyonun sonunda diziyi döndürmeyi unutmayın.

{{index [array, indexing], comparison}}

Son sınır için verilen numara da dahil olduğu için, döngünün bitip bitmediğini kontrol etmek için `<` yerine `<=` operatörünü kullanmanız gerekecek.

{{index "arguments object"}}

`step`, varsayılan olarak 1 olan bir parametre olabilir (`=` operatörünü kullanarak).

{{index "range function", "for loop"}}

Negatif adım değerlerini `range` fonksiyonun anlaması için iki biri yukarı biri aşağı doğru sayan iki ayrı döngü yazılabilir. Döngünün bitip bitmediğini kontrol eden karşılaştırmanın, aşağı doğru sayarken `<=` yerine `>=` olması gerektiğini unutmamak önemlidir.

Bitiş noktası, başlangıçtan küçük olduğunda farklı bir varsayılan `step` parametresi değeri, yani, -1 kullanmak da faydalı olabilir. Bu şekilde, `range(5, 2)` anlamlı bir şey döndürür ve sonsuz bir döngüye sıkışmaz. Bir parametrenin varsayılan değerinde önceki parametre değerlerine başvurmak mümkündür.

hint}}

### Bir diziyi tersine çevirmek

{{index "reversing (exercise)", "reverse method", [array, methods]}}

Dizilerin, öğelerin sırasını tersine çeviren bir `reverse` yöntemi vardır. Bu alıştırma için, `reverseArray` ve `reverseArrayInPlace` olmak üzere iki fonksiyon yazın. İlk fonksiyon, `reverseArray`, bir dizi alır ve ters sıradaki aynı öğelere sahip _yeni_ bir dizi üretir. İkinci fonksiyon, `reverseArrayInPlace`, `reverse` yönteminin yaptığı şeyi yapar: argüman olarak verilen diziyi öğelerini tersine çevirerek değiştirir. Hiçbiri standart `reverse` yöntemini kullanamaz.

{{index efficiency, "pure function", "side effect"}}

[Önceki bölümde](functions#pure) yan etkiler ve saf fonksiyonlar hakkındaki notlara geri dönüp düşünerek, hangi varyantın daha fazla durumda kullanışlı olacağını ve hangisinin daha hızlı çalışmasını beklersiniz?

{{if interactive

```{test: no}
// Kodunuz buraya.

let myArray = ["A", "B", "C"];
console.log(reverseArray(myArray));
// → ["C", "B", "A"];
console.log(myArray);
// → ["A", "B", "C"];
let arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]
```

if}}

{{hint

{{index "reversing (exercise)"}}

Iterating over an array backwards requires a (somewhat awkward) `for` specification, like `(let i = array.length - 1; i >= 0; i--)`.
`reverseArray`'yı uygulamanın iki belirgin yolu vardır. İlk yöntem, verilen diziyi baştan sona doğru geçmek ve her öğeyi başlangıcına yerleştirmek için yeni dizi üzerinde `unshift` metodunu kullanmaktır. İkincisi, giriş dizisini tersten geçmek ve `push` yöntemini kullanmaktır. Bir diziyi tersten yinelemek için biraz garip bir `for` döngüsü gerektirir, örneğin `(let i = array.length - 1; i >= 0; i--)`.

{{index "slice method"}}

Diziyi yerinde ters çevirmek daha zordur. Daha sonra ihtiyacınız olacak öğelerin üzerine yanlışlıkla yazıp onları kaybetmemeye dikkat etmelisiniz. `reverseArray` kullanmak veya aksi takdirde tüm diziyi kopyalamak (`array.slice()` bir diziyi kopyalamanın iyi bir yoludur) çalışır ancak hile yapmaktır.

Püf noktası, ilk ve son öğeleri, ikinci ve sondan bir önceki öğeleri ve böylece devam ederek _değiştirmektir_. Bunun için dizinin uzunluğunun yarısı kadar döngü yapmanız gerekir (`Math.floor` kullanarak aşağı yuvarlama yapın - tek sayıda öğeye sahip bir dizide ortadaki öğeye dokunmanıza gerek yoktur) ve pozisyon `i` bağlantısındaki öğeyi `array.length - 1 - i` pozisyonundaki ile değiştirmektir. Bir öğeyi geçici olarak tutmak için yerel bir bağlantı kullanabilir, bunu aynasıyla değiştirerek üzerine yazabilir ve daha sonra yerel bağlantının değerini aynanın yerine koyabilirsiniz.

hint}}

{{id list}}

### Bir liste

{{index ["data structure", list], "list (exercise)", "linked list", array, collection}}

Nesneler, genel değer birikintileri olarak, çeşitli veri yapılarını oluşturmak için kullanılabilir. Yaygın bir veri yapısı, dizi ile karıştırılmaması gereken listedir. Bir liste, birbirini referans alan nesnelerin iç içe geçmiş bir kümesidir, ilk nesne ikinciyi, ikinci nesne üçüncüyü ve böyle devam eder.

```{includeCode: true}
let list = {
  value: 1,
  rest: {
    value: 2,
    rest: {
      value: 3,
      rest: null
    }
  }
};
```

Oluşan nesneler şu şekilde bir zincir oluşturur:

{{figure {url: "img/linked-list.svg", alt: "A diagram showing the memory structure of a linked list. There are 3 cells, each with a value field holding a number, and a 'rest' field with an arrow to the rest of the list. The first cell's arrow points at the second cell, the second cell's arrow at the last cell, and the last cell's 'rest' field holds null.",width: "8cm"}}}

{{index "structure sharing", [memory, structure sharing]}}

Listelerin güzel bir özelliği, yapılarının bir kısmını paylaşabilmesidir. Örneğin, `{value: 0, rest: list}` ve `{value: -1, rest: list}` (önceki bağlantıya referansta bulunarak) gibi iki yeni değer oluşturursam, bunlar bağımsız listelerdir, ancak son üç öğeyi oluşturan yapıyı paylaşırlar. Orjinal liste hala geçerli bir üç öğeli listedir.

Then add the helper functions `prepend`, which takes an element and a list and creates a new list that adds the element to the front of the input list, and `nth`, which takes a list and a number and returns the element at the given position in the list (with zero referring to the first element) or `undefined` when there is no such element.
`[1, 2, 3]` olarak verildiğinde gösterilen gibi bir liste yapısı oluşturan `arrayToList` adlı fonksiyonu yazın. Ayrıca, bir listeden bir dizi üreten `listToArray` adlı fonksiyonu da yazın. Ardından, bir öğe ve bir liste alıp öğeyi giriş listesinin önüne ekleyen yeni bir liste oluşturan `prepend`, bir liste ve bir sayı alıp listenin verilen konumundaki öğeyi (sıfır ilk öğeyi belirtir) veya böyle bir öğe yoksa `undefined` değeri döndüren `nth` yardımcı fonksiyonlarını ekleyin.

{{index recursion}}

Henüz yapmadıysanız, `nth` fonksiyonunun özyineli bir sürümünü de yazın.

{{if interactive

```{test: no}
// Kodunuz buraya.

console.log(arrayToList([10, 20]));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(listToArray(arrayToList([10, 20, 30])));
// → [10, 20, 30]
console.log(prepend(10, prepend(20, null)));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(nth(arrayToList([10, 20, 30]), 1));
// → 20
```

if}}

{{hint

{{index "list (exercise)", "linked list"}}

Bir listeyi arkadan öne doğru oluşturmak daha kolaydır. Bu nedenle, `arrayToList`, her öğe için bir nesne ekleyerek diziyi tersten geçebilir (önceki alıştırmaya bakın), bunu yaparken her öğe için listeye bir nesne ekleyin. O ana kadar akümüle edilmiş listeyi tutabilmek adına lokal bir bağlantı kullanabilir ve bir element eklemek adına `list = {value: X, rest: list}` gibi bir atama işlemi yapabilirsiniz.

{{index "for loop"}}

Bir listenin üzerinden geçebilmek için(`listToArray` ve `nth` fonksiyonlarını kullanarak) bir `for` döngüsü kullanılabilir:

```
for (let node = list; node; node = node.rest) {}
```

Nasıl çalıştığını görebiliyor musunuz? Döngünün her bir iterasyonunda `node` adlı bağlantı güncel alt listeye sahip ve böylelikle döngü gövdesi `value` özelliğini okuyarak güncel elementi alabiliyor. Döngü sonunda, `node` diğer alt listeye geçmekte. O değer `null` olduğunda listenin sonuna gelmiş ve döngüyü bitirmiş oluyoruz.

{{index recursion}}

`nth` fonksiyonunun özyinelemeli sürümü, benzer şekilde, listenin "kuyruğunun" giderek daha küçük bir kısmına bakacak ve aynı zamanda dizini sıfıra kadar azaltacak ve sıfır olduğunda, baktığı düğümün `value` özelliğini döndürebilecektir. Bir listenin sıfırıncı öğesini almak için, baş düğümünün `value` özelliğini alırsınız. _N_ + 1 öğeyi almak için, bu listenin `rest` özelliğindeki listenin N'inci öğesini alırsınız.

hint}}

{{id exercise_deep_compare}}

### Derin karşılaştırma

{{index "deep comparison (exercise)", [comparison, deep], "deep comparison", "== operator"}}

`==` operatörü nesneleri kimliğine göre karşılaştırır. Ancak bazen, gerçek özelliklerinin değerlerini karşılaştırmayı tercih edebilirsiniz.

`deepEqual` adında iki değeri alıp yalnızca aynı değer olduklarında veya özellikleri aynı olan nesneler olduklarında ve özelliklerin değerleri, `deepEqual` fonksiyonuna özyinelemeli bir çağrı ile karşılaştırıldığında eşitse true döndüren bir fonksiyon yazın.

{{index null, "=== operator", "typeof operator"}}

Değerlerin doğrudan karşılaştırılıp karşılaştırılmaması gerektiğini (`===` operatörünü kullanarak) veya özelliklerinin karşılaştırılması gerektiğini belirlemek için `typeof` operatörünü kullanabilirsiniz. İki değer için de `"object"` üretirse, derin bir karşılaştırma yapmalısınız. Ancak, bir saçma istisnayı hesaba katmanız gerekir: bir tarih öncesi kazadan dolayı, `typeof null` da "object" üretir.

{{index "Object.keys function"}}

`Object.keys` fonksiyonu nesnelerin özelliklerini karşılaştırmak için özelliklerin üzerinden geçmeniz gerektiğinde faydalı olacaktır.

{{if interactive

```{test: no}
// Kodunuz buraya.

let obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
// → true
```

if}}

{{hint

{{index "deep comparison (exercise)", [comparison, deep], "typeof operator", "=== operator"}}

Gerçek bir nesne ile ilgilendiğinizi belirlemek için testiniz, `typeof x == "object" && x != null` gibi görünecektir. Özellikleri yalnızca _her iki_ argümanın da nesneler olduğunda karşılaştırmaya dikkat edin. Diğer tüm durumlarda, sadece `===` uygulamanın sonucunu hemen döndürebilirsiniz.

{{index "Object.keys function"}}

Özelliklerin üzerinden geçmek için Object.keys kullanın. İki nesnenin aynı özellik isim kümesine sahip olup olmadığını ve bu özelliklerin aynı değerlere sahip olup olmadığını test etmeniz gerekir. Bunu yapmanın bir yolu, her iki nesnenin de aynı sayıda özellik ismine sahip olmasını sağlamaktır (özellik listelerinin uzunlukları aynıdır). Ve sonra, onları karşılaştırmak için bir nesnenin özelliklerini dolaşırken, diğerinin o adla bir özelliğe sahip olduğundan emin olun. Eğer iki nesnenin de aynı sayıda özelliği varsa ve birindeki tüm özellik adları diğerinde de varsa, aynı özellik kümesine sahiptirler.

{{index "return value"}}

Fonksiyondan doğru değeri döndürmek, bir eşleşme bulunduğunda hemen `false` döndürerek ve fonksiyonun sonunda `true` döndürerek en iyi şekilde yapılır.

hint}}
