{{meta {load_files: ["code/chapter/16_game.js", "code/levels.js"], zip: "html include=[\"css/game.css\"]"}}}

# Project: Bir Platform Oyunu

{{quote {author: "Iain Banks", title: "Oyunların Oyuncusu", chapter: true}

Bütün gerçeklik bir oyundur.

quote}}

{{index "Banks, Ian", "project chapter", simulation}}

{{figure {url: "img/chapter_picture_16.jpg", alt: "Illustration showing a computer game character jumping over lava in a two dimensional world", chapter: "framed"}}}

Bilgisayarlara olan ilk hayranlığımın çoğu, birçok nerd çocuk gibi, bilgisayar ((oyun))larıyla ilgiliydi. Manipüle edebileceğim ve hikayelerin (bir şekilde) ortaya çıktığı minik simüle edilmiş ((dünya))lara çekildim - sanırım, aslında sundukları olasılıklardan çok, ((hayal gücümü)) onlara yansıtma şeklimden dolayı.

Oyun programlamada kimseye bir ((kariyer)) dilemem. ((Müzik)) endüstrisi gibi, bu alanda çalışmak isteyen istekli gençlerin sayısı ile bu tür insanlara olan gerçek talep arasındaki tutarsızlık oldukça sağlıksız bir ortam yaratır. Ancak eğlence için oyun yazmak eğlencelidir.

{{index "jump-and-run game", dimensions}}

Bu bölüm küçük bir ((platform oyunu)) uygulamasını ele alacaktır. Platform oyunları (veya "zıpla ve koş" oyunları), ((oyuncunun)) genellikle iki boyutlu ve yandan görülen bir ((dünya)) içinde bir figürü hareket ettirmesini ve bu sırada şeylerin üzerinden ve üstüne atlamasını bekleyen oyunlardır.

## Oyun

{{index minimalism, "Palef, Thomas", "Dark Blue (game)"}}

((Oyunumuz)) kabaca Thomas Palef'in [Dark Blue](http://www.lessmilk.com/games/10)[ (_www.lessmilk.com/games/10_)]{if book} adlı kitabına dayanacak. Bu oyunu seçtim çünkü hem eğlenceli hem de minimalist ve çok fazla ((kod)) olmadan inşa edilebilir. Şuna benziyor:

{{figure {url: "img/darkblue.png", alt: "Renkli kutulardan oluşan bir dünyayı gösteren 'Dark Blue' oyununun ekran görüntüsü. Mavi bir arka plan üzerinde beyaz çizgiler üzerinde duran oyuncuyu temsil eden siyah bir kutu var. Küçük sarı paralar havada süzülüyor ve arka planın bazı kısımları lavı temsil eden kırmızı renkte."}}}

{{index coin, lava}}

Koyu ((kutu)), görevi kırmızı şeylerden (lav) kaçınırken sarı kutuları (madeni paralar) toplamak olan ((oyuncu)) temsil eder. Tüm paralar toplandığında bir ((seviye)) tamamlanır.

{{index keyboard, jumping}}

Oyuncu sol ve sağ ok tuşları ile etrafta dolaşabilir ve yukarı ok ile zıplayabilir. Zıplamak bu oyun karakterinin bir özelliğidir. Kendi yüksekliğinin birkaç katına ulaşabilir ve havada yön değiştirebilir. Bu tamamen gerçekçi olmayabilir, ancak oyuncuya ekrandaki ((avatar)) üzerinde doğrudan kontrol sahibi olduğu hissini vermeye yardımcı olur.

{{index "fractional number", discretization, "artificial life", "electronic life"}}

((Oyun)), bir ((ızgara)) gibi yerleştirilmiş statik bir ((arka plan)) ve bu arka planın üzerine yerleştirilmiş hareketli öğelerden oluşur. Izgaradaki her alan boş, katı veya ((lav)) şeklindedir. Hareketli öğeler oyuncu, madeni paralar ve belirli lav parçalarıdır. Bu öğelerin konumları ızgarayla kısıtlı değildir - koordinatları kesirli olabilir ve yumuşak ((hareket)) sağlar.

## Teknoloji

{{index "event handling", keyboard, [DOM, graphics]}}

((Tarayıcı)) kullanacağız oyunu görüntülemek için DOM'u kullanacağız ve tuş olaylarını işleyerek kullanıcı girdisini okuyacağız.

{{index rectangle, "background (CSS)", "position (CSS)", graphics}}

Ekran ve klavyeyle ilgili kod, bu ((oyunu)) oluşturmak için yapmamız gereken işin yalnızca küçük bir kısmıdır. Her şey renkli ((kutu))'lar gibi göründüğünden, çizim karmaşık değildir: DOM öğeleri oluştururuz ve onlara bir arka plan rengi, boyutu ve konumu vermek için stil kullanırız

{{index "table (HTML tag)"}}

Karelerden oluşan değişmeyen bir ((ızgara)) olduğu için arka planı bir tablo olarak temsil edebiliriz. Serbest hareket eden öğeler, kesinlikle konumlandırılmış öğeler kullanılarak üst üste bindirilebilir.

{{index performance, [DOM, graphics]}}

Oyunlarda ve ((grafikleri)) canlandırması ve kullanıcı ((girdisine)) fark edilir bir gecikme olmadan yanıt vermesi gereken diğer programlarda ((verimlilik)) önemlidir. DOM başlangıçta yüksek performanslı grafikler için tasarlanmamış olsa da, aslında bu konuda beklediğinizden daha iyidir. [Bölüm ?](dom#animation) içinde bazı ((animasyon))'lar gördünüz. Modern bir makinede, ((optimizasyon)) hakkında çok fazla endişelenmesek bile, bunun gibi basit bir oyun iyi performans gösterir.

{{index canvas, [DOM, graphics]}}

[Bir sonraki bölümde](canvas), DOM öğeleri yerine şekiller ve ((piksel)) açısından çalışarak grafik çizmek için daha geleneksel bir yol sağlayan başka bir ((tarayıcı)) teknolojisi olan `<canvas>` etiketini keşfedeceğiz.

## Seviyeler

{{index dimensions}}

Seviyeleri belirtmek için insan tarafından okunabilir, insan tarafından düzenlenebilir bir yol isteyeceğiz. Her şeyin bir ızgara üzerinde başlaması uygun olduğundan, her karakterin bir öğeyi temsil ettiği büyük dizeler kullanabiliriz - ya arka plan ızgarasının bir parçası ya da hareketli bir öğe.

Küçük bir seviye için plan şöyle görünebilir:

```{includeCode: true}
let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;
```

{{index level}}

Noktalar boş alan, hash (`#`) karakterleri duvar ve artı işaretleri lavdır. ((oyuncu))'nun başlangıç pozisyonu ((at işareti)) (`@`)'dir. Her O karakteri bir madeni paradır ve en üstteki eşittir işareti (`=`) yatay olarak ileri geri hareket eden bir lav bloğudur.

{{index bouncing}}

İki ek hareketli ((lav)) türünü destekleyeceğiz: boru karakteri (`|`) dikey olarak hareket eden lekeler oluşturur ve `v` _damlayan_ lavı gösterir - ileri geri zıplamayan, sadece aşağı doğru hareket eden ve yere çarptığında başlangıç konumuna geri sıçrayan dikey olarak hareket eden lav.

Bütün bir ((oyun)), ((oyuncu))'nun tamamlaması gereken birden fazla ((seviye))'den oluşur. Tüm ((jeton))lar toplandığında bir seviye tamamlanmış olur. Oyuncu ((lav))'a dokunursa, mevcut seviye başlangıç konumuna geri yüklenir ve oyuncu tekrar deneyebilir.

{{id level}}

## Reading a level

{{index "Level class"}}

Aşağıdaki ((class)) bir ((level)) nesnesini saklar. Argümanı, seviyeyi tanımlayan dize olmalıdır.

```{includeCode: true}
class Level {
  constructor(plan) {
    let rows = plan.trim().split("\n").map(l => [...l]);
    this.height = rows.length;
    this.width = rows[0].length;
    this.startActors = [];

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelChars[ch];
        if (typeof type != "string") {
          let pos = new Vec(x, y);
          this.startActors.push(type.create(pos, ch));
          type = "empty";
        }
        return type;
      });
    });
  }
}
```

{{index "trim method", "split method", [whitespace, trimming]}}

Plan dizesinin başındaki ve sonundaki boşlukları kaldırmak için `trim` yöntemi kullanılır. Bu, örnek planımızın bir yeni satırla başlamasını sağlar, böylece tüm satırlar doğrudan birbirinin altında olur. Kalan dize ((yeni satır karakteri))lere bölünür ve her satır bir diziye yayılarak karakter dizileri üretilir.

{{index [array, "as matrix"]}}

Yani `rows` karakter dizilerinden oluşan bir diziyi, planın satırlarını tutar. Seviyenin genişliğini ve yüksekliğini bunlardan türetebiliriz. Ancak yine de hareketli öğeleri arka plan ızgarasından ayırmalıyız. Hareketli öğelere _aktörler_ diyeceğiz. Bunlar bir dizi nesne içinde saklanacaktır. Arka plan, `"empty"`, `"wall"` veya `"lava"` gibi alan türlerini tutan dizelerden oluşan bir dizi olacaktır.

{{index "map method"}}

Bu dizileri oluşturmak için, satırları ve ardından içeriklerini eşleriz. Unutmayın ki `map` dizinin indeksini eşleme fonksiyonuna ikinci bir argüman olarak aktarır, bu da bize belirli bir karakterin x ve y koordinatlarını söyler. Oyundaki konumlar, sol üst 0,0 ve her arka plan karesi 1 birim yüksekliğinde ve genişliğinde olacak şekilde koordinat çiftleri olarak saklanacaktır.

{{index "static method"}}

Plandaki karakterleri yorumlamak için, `Level` kurucusu, seviye açıklamalarında kullanılan her karakter için, bir arka plan türüyse bir dize ve bir aktör üretiyorsa bir sınıf tutan `levelChars` nesnesini kullanır. `type` bir aktör sınıfı olduğunda, `startActors` öğesine eklenen bir nesne oluşturmak için statik `create` yöntemi kullanılır ve eşleme işlevi bu arka plan karesi için `"empty"` döndürür.

{{index "Vec class"}}

Aktörün konumu bir `Vec` nesnesi olarak saklanır. Bu iki boyutlu bir vektördür, [bölüm ?](object#exercise_vector) içindeki alıştırmalarında görüldüğü gibi `x` ve `y` özelliklerine sahip bir nesnedir.

{{index [state, in objects]}}

Oyun çalıştıkça, aktörler farklı yerlere gidecek veya hatta tamamen kaybolacaktır (madeni paraların toplandığında yaptığı gibi). Çalışan bir oyunun durumunu izlemek için bir `State` sınıfı kullanacağız.

```{includeCode: true}
class State {
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  static start(level) {
    return new State(level, level.startActors, "playing");
  }

  get player() {
    return this.actors.find(a => a.type == "player");
  }
}
```

Oyun sona erdiğinde `status` özelliği `"lost"` veya `"won"` olarak değişecektir.

Bu yine kalıcı bir veri yapısıdır-oyun durumunu güncellemek yeni bir durum oluşturur ve eskisini olduğu gibi bırakır.

## Aktörler

{{index actor, "Vec class", [interface, object]}}

Aktör nesneleri, oyunumuzdaki belirli bir hareketli öğenin mevcut konumunu ve durumunu temsil eder. Tüm aktör nesneleri aynı arayüze uygundur. Onların `pos` özelliği elemanın sol üst köşesinin koordinatlarını tutar ve `size` özelliği de boyutunu tutar.

Daha sonra, belirli bir zaman adımından sonra yeni durumlarını ve konumlarını hesaplamak için kullanılan bir `update` yöntemine sahiptirler. Aktörün yaptığı şeyi simüle eder -oyuncu için ok tuşlarına yanıt olarak hareket eder ve lav için ileri geri zıplar- ve yeni, güncellenmiş bir aktör nesnesi döndürür.

Bir `type` özelliği, aktörün türünü tanımlayan bir dize içerir - `"player"`, `"coin"` veya `"lava"`. Bu, oyunu çizerken kullanışlıdır; bir aktör için çizilen dikdörtgenin görünümü aktörün türüne bağlıdır.

Aktör sınıfları, seviye planındaki bir karakterden bir aktör oluşturmak için `Level` kurucusu tarafından kullanılan statik bir `create` yöntemine sahiptir. Karakterin koordinatları ve karakterin kendisi verilir; `Lava` sınıfı birkaç farklı karakteri işlediği için bu gereklidir.

{{id vector}}

Bu, aktörlerin konumu ve boyutu gibi iki boyutlu değerlerimiz için kullanacağımız `Vec` sınıfıdır.

```{includeCode: true}
class Vec {
  constructor(x, y) {
    this.x = x; this.y = y;
  }
  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }
  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
}
```

{{index "times method", multiplication}}

`times` yöntemi bir vektörü belirli bir sayı ile ölçeklendirir. Bir hız vektörünü bir zaman aralığıyla çarparak o süre içinde kat edilen mesafeyi elde etmemiz gerektiğinde faydalı olacaktır.

Farklı aktör türleri, davranışları çok farklı olduğu için kendi sınıflarına sahip olurlar. Şimdi bu sınıfları tanımlayalım. Onların `update` yöntemlerine daha sonra değineceğiz.

{{index simulation, "Player class"}}

Oyuncu sınıfı, momentum ve yerçekimini simüle etmek için mevcut hızını depolayan bir `speed` özelliğine sahiptir.

```{includeCode: true}
class Player {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  get type() { return "player"; }

  static create(pos) {
    return new Player(pos.plus(new Vec(0, -0.5)),
                      new Vec(0, 0));
  }
}

Player.prototype.size = new Vec(0.8, 1.5);
```

Bir oyuncu bir buçuk kare yüksekliğinde olduğu için, ilk konumu `@` karakterinin göründüğü konumdan yarım kare yukarıda olacak şekilde ayarlanır. Bu şekilde, alt kısmı göründüğü karenin alt kısmıyla hizalanır.

Boyut özelliği tüm `Player` örnekleri için aynıdır, bu nedenle bunu örneklerin kendileri yerine prototipte saklarız. `type` gibi bir ((getter)) kullanabilirdik, ancak bu, özellik her okunduğunda yeni bir `Vec` nesnesi oluşturacak ve döndürecektir, bu da israf olacaktır. (Dizeler, ((değişmez)) olduklarından, her değerlendirildiklerinde yeniden oluşturulmaları gerekmez).

{{index "Lava class", bouncing}}

Bir `Lava` aktörü oluştururken, nesneyi dayandığı karaktere bağlı olarak farklı şekilde başlatmamız gerekir. Dinamik lav, bir engele çarpana kadar mevcut hızında ilerler. Bu noktada, eğer `reset` özelliğine sahipse, başlangıç konumuna (damlayarak) geri atlayacaktır. Eğer yoksa, hızını tersine çevirir ve diğer yönde devam eder (zıplama).

`create` yöntemi `Level` kurucusunun aktardığı karaktere bakar ve uygun lav aktörünü oluşturur.

```{includeCode: true}
class Lava {
  constructor(pos, speed, reset) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }

  get type() { return "lava"; }

  static create(pos, ch) {
    if (ch == "=") {
      return new Lava(pos, new Vec(2, 0));
    } else if (ch == "|") {
      return new Lava(pos, new Vec(0, 2));
    } else if (ch == "v") {
      return new Lava(pos, new Vec(0, 3), pos);
    }
  }
}

Lava.prototype.size = new Vec(1, 1);
```

{{index "Coin class", animation}}

`coin` aktörleri nispeten basittir. Çoğunlukla sadece yerlerinde otururlar. Ancak oyunu biraz canlandırmak için, onlara hafif bir dikey ileri geri hareket olan bir "yalpalama" verilir. Bunu izlemek için, bir madeni para nesnesi bir temel konumun yanı sıra zıplama hareketinin ((fazını)) izleyen bir `wobble` özelliği saklar. Bunlar birlikte madeni paranın gerçek konumunu belirler (`pos` özelliğinde saklanır).

```{includeCode: true}
class Coin {
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }

  get type() { return "coin"; }

  static create(pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1));
    return new Coin(basePos, basePos,
                    Math.random() * Math.PI * 2);
  }
}

Coin.prototype.size = new Vec(0.6, 0.6);
```

{{index "Math.random function", "random number", "Math.sin function", sine, wave}}

[Bölüm ?](dom#sin_cos) içinde, `Math.sin`'in bize daire üzerindeki bir noktanın y-koordinatını verdiğini gördük. Bu koordinat, daire boyunca hareket ettikçe düzgün bir dalga formunda ileri geri gider, bu da sinüs fonksiyonunu dalgalı bir hareketi modellemek için kullanışlı hale getirir.

{{index pi}}

Tüm madeni paraların eşzamanlı olarak yukarı ve aşağı hareket ettiği bir durumdan kaçınmak için, her madeni paranın başlangıç aşaması rastgele belirlenir. `Math.sin` dalgasının periyodu, yani ürettiği dalganın genişliği 2π'dir. Madeni paraya dalga üzerinde rastgele bir başlangıç konumu vermek için `Math.random` tarafından döndürülen değeri bu sayı ile çarpıyoruz.

{{index map, [object, "as map"]}}

Artık plan karakterlerini arka plan ızgara türlerine veya aktör sınıflarına eşleyen `levelChars` nesnesini tanımlayabiliriz.

```{includeCode: true}
const levelChars = {
  ".": "empty", "#": "wall", "+": "lava",
  "@": Player, "o": Coin,
  "=": Lava, "|": Lava, "v": Lava
};
```

Bu bize bir `Level` örneği oluşturmak için gereken tüm parçaları verir.

```{includeCode: strip_log}
let simpleLevel = new Level(simpleLevelPlan);
console.log(`${simpleLevel.width} by ${simpleLevel.height}`);
// → 22 by 9
```

Önümüzdeki görev, bu seviyeleri ekranda görüntülemek ve içlerindeki zaman ve hareketi modellemektir.

## Bir yük olarak kapsülleme

{{index "programming style", "program size", complexity}}

Bu bölümdeki kodların çoğu iki nedenden dolayı ((kapsülleme)) hakkında çok fazla endişelenmez. Birincisi, kapsülleme fazladan çaba gerektirir. Programları büyütür ve ek kavram ve arayüzlerin tanıtılmasını gerektirir. Bir okuyucunun gözleri kamaşmadan önce ona ancak bu kadar çok kod atabileceğiniz için, programı küçük tutmaya gayret ettim.

{{index [interface, design]}}

İkincisi, bu oyundaki çeşitli unsurlar birbirine o kadar sıkı bağlıdır ki, bunlardan birinin davranışı değişirse, diğerlerinin aynı kalması pek olası değildir. Unsurlar arasındaki arayüzler, oyunun çalışma şekli hakkında pek çok varsayımı kodlar hale gelecektir. Bu da onları çok daha az etkili hale getirir - sistemin bir parçasını değiştirdiğinizde, bunun diğer parçaları nasıl etkileyeceği konusunda endişelenmeniz gerekir çünkü arayüzleri yeni durumu kapsamayacaktır.

Bir sistemdeki bazı _((kesme noktası))lar_ kendilerini titiz arayüzler yoluyla ayırmaya iyi bir şekilde borçludur, ancak diğerleri değildir. Uygun bir sınır olmayan bir şeyi kapsüllemeye çalışmak, çok fazla enerji harcamanın kesin bir yoludur. Bu hatayı yaptığınızda, genellikle arayüzlerinizin garip bir şekilde büyük ve ayrıntılı hale geldiğini ve program geliştikçe sık sık değiştirilmeleri gerektiğini fark edeceksiniz.

{{index graphics, encapsulation, graphics}}

Kapsülleyeceğimiz tek bir şey var, o da ((çizim)) alt sistemi. Bunun nedeni, aynı oyunu [bir sonraki bölümde](canvas#canvasdisplay) farklı bir şekilde ((görüntüleyeceğiz)). Çizimi bir arayüzün arkasına koyarak, aynı oyun programını oraya yükleyebilir ve yeni bir ekran ((modülü)) takabiliriz.

{{id domdisplay}}

## Çizmek

{{index "DOMDisplay class", [DOM, graphics]}}

((Çizim)) kodunun kapsüllenmesi, belirli bir ((seviye)) ve durumu gösteren bir _((display))_ nesnesi tanımlanarak yapılır. Bu bölümde tanımladığımız görüntüleme türüne `DOMDisplay` adı verilir çünkü seviyeyi göstermek için DOM öğelerini kullanır.

{{index "style attribute", CSS}}

Oyunu oluşturan öğelerin gerçek renklerini ve diğer sabit özelliklerini ayarlamak için bir stil sayfası kullanacağız. Öğeleri oluştururken doğrudan `style` özelliğine atama yapmak da mümkün olabilir, ancak bu daha ayrıntılı programlar üretecektir.

{{index "class attribute"}}

Aşağıdaki yardımcı fonksiyon, bir eleman oluşturmak ve ona bazı nitelikler ve alt düğümler vermek için kısa ve öz bir yol sağlar:

```{includeCode: true}
function elt(name, attrs, ...children) {
  let dom = document.createElement(name);
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (let child of children) {
    dom.appendChild(child);
  }
  return dom;
}
```

Bir ekran, kendisini eklemesi gereken bir üst öğe ve bir ((level)) nesnesi verilerek oluşturulur.

```{includeCode: true}
class DOMDisplay {
  constructor(parent, level) {
    this.dom = elt("div", {class: "game"}, drawGrid(level));
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }

  clear() { this.dom.remove(); }
}
```

{{index level}}

Seviyenin hiç değişmeyen ((arka plan)) ızgarası bir kez çizilir. Aktörler, ekran belirli bir durumla her güncellendiğinde yeniden çizilir. Aktörleri tutan öğeyi izlemek için `actorLayer` özelliği kullanılır, böylece kolayca kaldırılabilir ve değiştirilebilirler.

{{index scaling, "DOMDisplay class"}}

((Koordinatlarımız)) ve boyutlarımız ((ızgara)) birimlerinde izlenir; burada 1'lik bir boyut veya mesafe bir ızgara bloğu anlamına gelir. ((piksel)) boyutlarını ayarlarken, bu koordinatları ölçeklendirmemiz gerekecektir-oyundaki her şey kare başına tek bir pikselde gülünç derecede küçük olacaktır. `scale` sabiti, tek bir birimin ekranda kapladığı piksel sayısını verir.

```{includeCode: true}
const scale = 20;

function drawGrid(level) {
  return elt("table", {
    class: "background",
    style: `width: ${level.width * scale}px`
  }, ...level.rows.map(row =>
    elt("tr", {style: `height: ${scale}px`},
        ...row.map(type => elt("td", {class: type})))
  ));
}
```

{{index "table (HTML tag)", "tr (HTML tag)", "td (HTML tag)", "spread operator"}}

Belirtildiği gibi, arka plan bir `<table>` öğesi olarak çizilir. Bu, seviyenin `rows` özelliğinin yapısına güzel bir şekilde karşılık gelir - ızgaranın her satırı bir tablo satırına (`<tr>` elemanı) dönüştürülür. Izgaradaki dizeler, tablo hücresi (`<td>`) elemanları için sınıf adları olarak kullanılır. Yayma (üçlü nokta) operatörü, çocuk düğüm dizilerini `elt` öğesine ayrı argümanlar olarak iletmek için kullanılır.

{{id game_css}}

Aşağıdaki ((CSS)) tablonun istediğimiz arka plan gibi görünmesini sağlar:

```{lang: "css"}
.background    { background: rgb(52, 166, 251);
                 table-layout: fixed;
                 border-spacing: 0;              }
.background td { padding: 0;                     }
.lava          { background: rgb(255, 100, 100); }
.wall          { background: white;              }
```

{{index "padding (CSS)"}}

Bunlardan bazıları (`table-layout`, `border-spacing` ve `padding`) istenmeyen varsayılan davranışı bastırmak için kullanılır. ((table))'ın düzeninin hücrelerinin içeriğine bağlı olmasını istemiyoruz ve ((table)) hücreleri arasında boşluk veya içlerinde dolgu istemiyoruz.

{{index "background (CSS)", "rgb (CSS)", CSS}}

`background` kuralı arka plan rengini belirler. CSS, renklerin hem sözcük olarak (`white`) hem de rengin kırmızı, yeşil ve mavi bileşenlerinin 0 ile 255 arasında üç sayıya ayrıldığı `rgb(R, G, B)` gibi bir formatla belirtilmesine izin verir. Yani, `rgb(52, 166, 251)`de kırmızı bileşen 52, yeşil 166 ve mavi 251'dir. Mavi bileşen en büyük olduğundan, ortaya çıkan renk mavimsi olacaktır. `.lava` kuralında ilk sayının (kırmızı) en büyük olduğunu görebilirsiniz.

{{index [DOM, graphics]}}

Her ((aktör)) için bir DOM öğesi oluşturarak ve bu öğenin konumunu ve boyutunu aktörün özelliklerine göre ayarlayarak çiziyoruz. Oyun birimlerinden piksellere geçmek için değerlerin `scale` ile çarpılması gerekir.

```{includeCode: true}
function drawActors(actors) {
  return elt("div", {}, ...actors.map(actor => {
    let rect = elt("div", {class: `actor ${actor.type}`});
    rect.style.width = `${actor.size.x * scale}px`;
    rect.style.height = `${actor.size.y * scale}px`;
    rect.style.left = `${actor.pos.x * scale}px`;
    rect.style.top = `${actor.pos.y * scale}px`;
    return rect;
  }));
}
```

{{index "position (CSS)", "class attribute"}}

Bir öğeye birden fazla sınıf vermek için, sınıf adlarını boşluklarla ayırırız. Yanda gösterilen ((CSS)) kodunda, `actor` sınıfı aktörlere mutlak konumlarını verir. Tür adları, onlara bir renk vermek için ekstra bir sınıf olarak kullanılır. Daha önce tanımladığımız lav ızgarası kareleri için bu sınıfı yeniden kullandığımızdan `lava` sınıfını yeniden tanımlamamız gerekmiyor.

```{lang: "css"}
.actor  { position: absolute;            }
.coin   { background: rgb(241, 229, 89); }
.player { background: rgb(64, 64, 64);   }
```

{{index graphics, optimization, efficiency, [state, "of application"], [DOM, graphics]}}

Ekranın belirli bir durumu göstermesini sağlamak için `syncState` yöntemi kullanılır. Önce varsa eski aktör grafiklerini kaldırır ve ardından aktörleri yeni konumlarında yeniden çizer. Aktörler için DOM öğelerini yeniden kullanmayı denemek cazip gelebilir, ancak bunun işe yaraması için, aktörleri DOM öğeleriyle ilişkilendirmek ve aktörleri kaybolduğunda öğeleri kaldırdığımızdan emin olmak için çok fazla ek defter tutmamız gerekir. Oyunda genellikle sadece bir avuç aktör olacağından, hepsini yeniden çizmek pahalı değildir.

```{includeCode: true}
DOMDisplay.prototype.syncState = function(state) {
  if (this.actorLayer) this.actorLayer.remove();
  this.actorLayer = drawActors(state.actors);
  this.dom.appendChild(this.actorLayer);
  this.dom.className = `game ${state.status}`;
  this.scrollPlayerIntoView(state);
};
```

{{index level, "class attribute"}}

Seviyenin mevcut durumunu sarmalayıcıya bir sınıf adı olarak ekleyerek, yalnızca oyuncunun belirli bir sınıfa sahip bir ((ata öğesi)) olduğunda etkili olan bir ((CSS)) kuralı ekleyerek oyun kazanıldığında veya kaybedildiğinde oyuncu aktörünü biraz farklı şekillendirebiliriz.

```{lang: "css"}
.lost .player {
  background: rgb(160, 64, 64);
}
.won .player {
  box-shadow: -4px -7px 8px white, 4px -7px 8px white;
}
```

{{index player, "box shadow (CSS)"}}

((Lav))'a dokunduktan sonra oyuncunun rengi koyu kırmızıya dönerek kavrulduğunu gösteriyor. Son para toplandığında, beyaz bir hale efekti oluşturmak için biri sol üstte diğeri sağ üstte olmak üzere iki bulanık beyaz gölge ekliyoruz.

{{id viewport}}

{{index "position (CSS)", "max-width (CSS)", "overflow (CSS)", "max-height (CSS)", viewport, scrolling, [DOM, graphics]}}

Seviyenin her zaman _viewport_-oyunu içine çizdiğimiz öğeye sığdığını varsayamayız. Bu yüzden `scrollPlayerIntoView` çağrısına ihtiyaç vardır. Eğer seviye görüntü alanının dışına taşıyorsa, oyuncunun görüntü alanının merkezine yakın olduğundan emin olmak için görüntü alanını kaydırmamızı sağlar. Aşağıdaki ((CSS)), oyunun saran DOM öğesine maksimum bir boyut verir ve öğenin kutusunun dışına çıkan herhangi bir şeyin görünmemesini sağlar. Ayrıca, içindeki oyuncuların seviyenin sol üst köşesine göre konumlandırılması için ona göreli bir konum veriyoruz.

```{lang: css}
.game {
  overflow: hidden;
  max-width: 600px;
  max-height: 450px;
  position: relative;
}
```

{{index scrolling}}

`scrollPlayerIntoView` yönteminde, oyuncunun konumunu buluruz ve saran öğenin kaydırma konumunu güncelleriz. Oyuncu kenara çok yaklaştığında, bu öğenin `scrollLeft` ve `scrollTop` özelliklerini manipüle ederek kaydırma konumunu değiştiririz.

```{includeCode: true}
DOMDisplay.prototype.scrollPlayerIntoView = function(state) {
  let width = this.dom.clientWidth;
  let height = this.dom.clientHeight;
  let margin = width / 3;

  // The viewport
  let left = this.dom.scrollLeft, right = left + width;
  let top = this.dom.scrollTop, bottom = top + height;

  let player = state.player;
  let center = player.pos.plus(player.size.times(0.5))
                         .times(scale);

  if (center.x < left + margin) {
    this.dom.scrollLeft = center.x - margin;
  } else if (center.x > right - margin) {
    this.dom.scrollLeft = center.x + margin - width;
  }
  if (center.y < top + margin) {
    this.dom.scrollTop = center.y - margin;
  } else if (center.y > bottom - margin) {
    this.dom.scrollTop = center.y + margin - height;
  }
};
```

{{index center, coordinates, readability}}

Oyuncunun merkezinin bulunma şekli, `Vec` tipimizdeki yöntemlerin nesnelerle hesaplamaların nispeten okunabilir bir şekilde yazılmasına nasıl izin verdiğini göstermektedir. Oyuncunun merkezini bulmak için, konumunu (sol üst köşesi) ve boyutunun yarısını ekliyoruz. Bu, seviye koordinatlarındaki merkezdir, ancak piksel koordinatlarında ihtiyacımız var, bu yüzden ortaya çıkan vektörü ekran ölçeğimizle çarpıyoruz.

{{index validation}}

Ardından, bir dizi kontrol, oyuncu konumunun izin verilen aralığın dışında olmadığını doğrular. Bunun bazen sıfırın altında veya öğenin kaydırılabilir alanının ötesinde olan saçma kaydırma koordinatlarını ayarlayacağını unutmayın. Bu sorun değildir; DOM bunları kabul edilebilir değerlerle sınırlayacaktır. `scrollLeft` değerinin -10 olarak ayarlanması 0 olmasına neden olacaktır.

Oynatıcıyı her zaman ((viewport))'un merkezine kaydırmaya çalışmak biraz daha basit olabilirdi. Ancak bu oldukça sarsıcı bir etki yaratır. Siz zıplarken, görünüm sürekli olarak yukarı ve aşağı kayacaktır. Ekranın ortasında herhangi bir kaydırmaya neden olmadan hareket edebileceğiniz "nötr" bir alana sahip olmak daha hoştur.

{{index [game, screenshot]}}

Artık küçük seviyemizi görüntüleyebiliyoruz.

```{lang: html}
<link rel="stylesheet" href="css/game.css">

<script>
  let simpleLevel = new Level(simpleLevelPlan);
  let display = new DOMDisplay(document.body, simpleLevel);
  display.syncState(State.start(simpleLevel));
</script>
```

{{if book

{{figure {url: "img/game_simpleLevel.png", alt: "Oluşturulan seviyenin ekran görüntüsü", width: "7cm"}}}

if}}

{{index "link (HTML tag)", CSS}}

`<link>` etiketi, `rel="stylesheet"` ile birlikte kullanıldığında, bir CSS dosyasını sayfaya yüklemenin bir yoludur. `game.css` dosyası oyunumuz için gerekli stilleri içerir.

## Hareket ve çarpışma

{{index physics, [animation, "platform game"]}}

Şimdi hareket eklemeye başlayabileceğimiz noktadayız. Bunun gibi çoğu oyun tarafından benimsenen temel yaklaşım, ((zaman)) küçük adımlara bölmek ve her adımda aktörleri hızlarının zaman adımının boyutuyla çarpımına karşılık gelen bir mesafe kadar hareket ettirmektir. Zamanı saniye cinsinden ölçeceğiz, bu nedenle hızlar saniye başına birim olarak ifade edilir.

{{index obstacle, "collision detection"}}

Eşyaları taşımak kolaydır. Zor olan kısım, öğeler arasındaki etkileşimlerle başa çıkmaktır. Oyuncu bir duvara veya zemine çarptığında, sadece içinden geçmemelidir. Oyun, belirli bir hareketin bir nesnenin başka bir nesneye çarpmasına neden olduğunu fark etmeli ve buna göre yanıt vermelidir. Duvarlar için hareket durdurulmalıdır. Bir madeni paraya çarpıldığında, para toplanmalıdır. Lavlara dokunulduğunda oyun kaybedilmelidir.

Bunu genel durum için çözmek büyük bir görevdir. Fiziksel nesneler arasındaki etkileşimi iki veya üç ((boyutta)) simüle eden, genellikle _((fizik motoru))s_ olarak adlandırılan kütüphaneler bulabilirsiniz. Bu bölümde daha mütevazı bir yaklaşım benimseyeceğiz, sadece dikdörtgen nesneler arasındaki çarpışmaları ele alacağız ve bunları oldukça basit bir şekilde işleyeceğiz.

{{index bouncing, "collision detection", [animation, "platform game"]}}

((oyuncu)) veya bir ((lav)) bloğunu hareket ettirmeden önce, hareketin onu bir duvarın içine alıp almayacağını test ederiz. Eğer yaparsa, hareketi tamamen iptal ederiz. Böyle bir çarpışmaya verilecek tepki aktörün türüne bağlıdır; oyuncu dururken lav bloğu geri seker.

{{index discretization}}

Bu yaklaşım, ((zaman)) adımlarımızın oldukça küçük olmasını gerektirir çünkü nesneler gerçekten temas etmeden önce hareketin durmasına neden olur. Zaman adımları (ve dolayısıyla hareket adımları) çok büyük olursa, oyuncu yerden belirgin bir mesafe yukarıda asılı kalacaktır. Muhtemelen daha iyi ancak daha karmaşık olan bir başka yaklaşım ise tam çarpışma noktasını bulmak ve oraya hareket etmek olacaktır. Biz basit yaklaşımı benimseyeceğiz ve animasyonun küçük adımlarla ilerlemesini sağlayarak sorunlarını gizleyeceğiz.

{{index obstacle, "touches method", "collision detection"}}

{{id touches}}

Bu yöntem bize bir ((dikdörtgen)) (bir konum ve bir boyut ile belirtilen) verilen türdeki bir ızgara elemanına dokunup dokunmadığını söyler.

```{includeCode: true}
Level.prototype.touches = function(pos, size, type) {
  let xStart = Math.floor(pos.x);
  let xEnd = Math.ceil(pos.x + size.x);
  let yStart = Math.floor(pos.y);
  let yEnd = Math.ceil(pos.y + size.y);

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let isOutside = x < 0 || x >= this.width ||
                      y < 0 || y >= this.height;
      let here = isOutside ? "wall" : this.rows[y][x];
      if (here == type) return true;
    }
  }
  return false;
};
```

{{index "Math.floor function", "Math.ceil function"}}

Yöntem, ((koordinatları)) üzerinde `Math.floor` ve `Math.ceil` kullanarak gövdenin ((örtüştüğü)) ızgara kareler kümesini hesaplar. ((Izgara)) karelerinin 1'e 1 birim boyutunda olduğunu unutmayın. Bir kutunun kenarlarını yukarı ve aşağı ((yuvarlayarak)), kutunun temas ettiği ((arka plan)) karelerinin aralığını elde ederiz.

{{figure {url: "img/game-grid.svg", alt: "Üzerine siyah bir kutu yerleştirilmiş bir ızgarayı gösteren diyagram. Blok tarafından kısmen kapsanan tüm ızgara kareleri işaretlenmiştir.", width: "3cm"}}}

((koordinatları)) ((yuvarlayarak)) bulunan ((ızgara)) kareler bloğu üzerinde döngü yaparız ve eşleşen bir kare bulunduğunda `true` döndürürüz. Seviyenin dışındaki kareler, oyuncunun dünyayı terk edemeyeceğinden ve yanlışlıkla `rows` dizimizin sınırlarının dışını okumaya çalışmayacağımızdan emin olmak için her zaman `"wall"` olarak kabul edilir.

Durum `update` yöntemi, oyuncunun lavlara dokunup dokunmadığını anlamak için `touches` kullanır.

```{includeCode: true}
State.prototype.update = function(time, keys) {
  let actors = this.actors
    .map(actor => actor.update(time, this, keys));
  let newState = new State(this.level, actors, this.status);

  if (newState.status != "playing") return newState;

  let player = newState.player;
  if (this.level.touches(player.pos, player.size, "lava")) {
    return new State(this.level, actors, "lost");
  }

  for (let actor of actors) {
    if (actor != player && overlap(actor, player)) {
      newState = actor.collide(newState);
    }
  }
  return newState;
};
```

Yönteme bir zaman adımı ve hangi anahtarların basılı tutulduğunu söyleyen bir veri yapısı iletilir. Yaptığı ilk şey, tüm aktörler üzerinde `update` yöntemini çağırmak ve güncellenmiş aktörlerden oluşan bir dizi üretmektir. Aktörler ayrıca zaman adımını, anahtarları ve durumu alırlar, böylece güncellemelerini bunlara dayandırabilirler. Klavye tarafından kontrol edilen tek aktör olduğu için aslında sadece oyuncu tuşları okuyacaktır.

Eğer oyun zaten bitmişse, başka bir işlem yapılmasına gerek yoktur (oyun kaybedildikten sonra kazanılamaz ya da tam tersi). Aksi takdirde, yöntem oyuncunun arka plandaki lavlara dokunup dokunmadığını test eder. Eğer öyleyse, oyun kaybedilir ve işimiz biter. Son olarak, eğer oyun gerçekten devam ediyorsa, başka aktörlerin oyuncuyla çakışıp çakışmadığına bakılır.

Aktörler arasındaki çakışma `overlap` fonksiyonu ile tespit edilir. İki aktör nesnesi alır ve dokunduklarında true döndürür - bu, hem x ekseni hem de y ekseni boyunca üst üste geldikleri durumdur.

```{includeCode: true}
function overlap(actor1, actor2) {
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
         actor1.pos.x < actor2.pos.x + actor2.size.x &&
         actor1.pos.y + actor1.size.y > actor2.pos.y &&
         actor1.pos.y < actor2.pos.y + actor2.size.y;
}
```

Herhangi bir aktör çakışırsa, `collide` yöntemi durumu güncelleme şansı elde eder. Bir lav aktörüne dokunmak oyun durumunu `"lost"` olarak ayarlar. Paralar, onlara dokunduğunuzda kaybolur ve seviyenin son parası olduklarında durumu `"won"` olarak ayarlar.

```{includeCode: true}
Lava.prototype.collide = function(state) {
  return new State(state.level, state.actors, "lost");
};

Coin.prototype.collide = function(state) {
  let filtered = state.actors.filter(a => a != this);
  let status = state.status;
  if (!filtered.some(a => a.type == "coin")) status = "won";
  return new State(state.level, filtered, status);
};
```

{{id actors}}

## Aktör güncellemeleri

{{index actor, "Lava class", lava}}

Aktör nesnelerinin `update` yöntemleri argüman olarak zaman adımını, durum nesnesini ve bir `keys` nesnesini alır. `Lava` aktör tipi için olan `keys` nesnesini yok sayar.

```{includeCode: true}
Lava.prototype.update = function(time, state) {
  let newPos = this.pos.plus(this.speed.times(time));
  if (!state.level.touches(newPos, this.size, "wall")) {
    return new Lava(newPos, this.speed, this.reset);
  } else if (this.reset) {
    return new Lava(this.reset, this.speed, this.reset);
  } else {
    return new Lava(this.pos, this.speed.times(-1));
  }
};
```

{{index bouncing, multiplication, "Vec class", "collision detection"}}

Bu `update` yöntemi, ((zaman)) adımı ile mevcut hızın çarpımını eski konumuna ekleyerek yeni bir konum hesaplar. Yeni konumu engelleyen bir engel yoksa, oraya hareket eder. Bir engel varsa, davranış ((lav)) bloğunun türüne bağlıdır - damlayan lavın bir `reset` konumu vardır ve bir şeye çarptığında geri atlar. Zıplayan lav, hızını -1 ile çarparak tersine çevirir, böylece ters yönde hareket etmeye başlar.

{{index "Coin class", coin, wave}}

Madeni paralar sallanmak için `update` yöntemini kullanırlar. Sadece kendi karelerinin içinde yalpaladıkları için ızgara ile çarpışmaları göz ardı ederler.

```{includeCode: true}
const wobbleSpeed = 8, wobbleDist = 0.07;

Coin.prototype.update = function(time) {
  let wobble = this.wobble + time * wobbleSpeed;
  let wobblePos = Math.sin(wobble) * wobbleDist;
  return new Coin(this.basePos.plus(new Vec(0, wobblePos)),
                  this.basePos, wobble);
};
```

{{index "Math.sin function", sine, phase}}

Zamanı izlemek için `wobble` özelliği artırılır ve ardından ((dalga)) üzerindeki yeni konumu bulmak için `Math.sin` için bir argüman olarak kullanılır. Madeni paranın mevcut konumu daha sonra temel konumundan ve bu dalgaya dayalı bir ofsetten hesaplanır.

{{index "collision detection", "Player class"}}

Geriye ((oyuncu))'nun kendisi kalıyor. Oyuncu hareketi her ((axis)) için ayrı ayrı ele alınır çünkü yere çarpmak yatay hareketi engellememelidir ve bir duvara çarpmak düşme veya zıplama hareketini durdurmamalıdır.

```{includeCode: true}
const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;

Player.prototype.update = function(time, state, keys) {
  let xSpeed = 0;
  if (keys.ArrowLeft) xSpeed -= playerXSpeed;
  if (keys.ArrowRight) xSpeed += playerXSpeed;
  let pos = this.pos;
  let movedX = pos.plus(new Vec(xSpeed * time, 0));
  if (!state.level.touches(movedX, this.size, "wall")) {
    pos = movedX;
  }

  let ySpeed = this.speed.y + time * gravity;
  let movedY = pos.plus(new Vec(0, ySpeed * time));
  if (!state.level.touches(movedY, this.size, "wall")) {
    pos = movedY;
  } else if (keys.ArrowUp && ySpeed > 0) {
    ySpeed = -jumpSpeed;
  } else {
    ySpeed = 0;
  }
  return new Player(pos, new Vec(xSpeed, ySpeed));
};
```

{{index [animation, "platform game"], keyboard}}

Yatay hareket, sol ve sağ ok tuşlarının durumuna göre hesaplanır. Bu hareket tarafından oluşturulan yeni konumu engelleyen bir duvar yoksa kullanılır. Aksi takdirde, eski konum korunur.

{{index acceleration, physics}}

Dikey hareket benzer şekilde çalışır ancak ((zıplama)) ve ((yerçekimi)) simüle edilmelidir. Oyuncunun dikey hızı (`ySpeed`) ilk olarak ((yerçekimi)) hesaba katmak için hızlandırılır.

{{index "collision detection", keyboard, jumping}}

Duvarları tekrar kontrol ederiz. Herhangi birine çarpmazsak, yeni konum kullanılır. Eğer bir duvar varsa, iki olası sonuç vardır. Yukarı oka basıldığında _ve_ aşağı doğru hareket ettiğimizde (yani çarptığımız şey altımızda olduğunda), hız nispeten büyük, negatif bir değere ayarlanır. Bu da oyuncunun zıplamasına neden olur. Eğer durum böyle değilse, oyuncu basitçe bir şeye çarpmıştır ve hız sıfıra ayarlanmıştır.

Bu oyundaki yerçekimi gücü, ((zıplama)) hızı ve hemen hemen tüm diğer ((sabitler)) tamamen ((deneme yanılma)) ile ayarlanmıştır. Beğendiğim bir kombinasyon bulana kadar değerleri test ettim.

## İzleme tuşları

{{index keyboard}}

Bunun gibi bir ((oyun)) için, tuşların her basışta bir kez etkili olmasını istemiyoruz. Aksine, etkilerinin (oyuncu figürünü hareket ettirme) basılı tutuldukları sürece aktif kalmasını istiyoruz.

{{index "preventDefault method"}}

Sol, sağ ve yukarı ok tuşlarının mevcut durumunu saklayan bir tuş işleyici ayarlamamız gerekir. Ayrıca, bu tuşlar için `preventDefault` özelliğini çağırmak isteyeceğiz, böylece sayfayı ((kaydırma)) sonlandırmayacaklar.

{{index "trackKeys function", "key code", "event handling", "addEventListener method"}}

Aşağıdaki fonksiyon, bir dizi anahtar adı verildiğinde, bu anahtarların geçerli konumunu izleyen bir nesne döndürür. `"keydown"` ve `"keyup"` olayları için olay işleyicileri kaydeder ve olaydaki anahtar kodu, izlediği kod kümesinde mevcut olduğunda nesneyi günceller.

```{includeCode: true}
function trackKeys(keys) {
  let down = Object.create(null);
  function track(event) {
    if (keys.includes(event.key)) {
      down[event.key] = event.type == "keydown";
      event.preventDefault();
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}

const arrowKeys =
  trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);
```

{{index "keydown event", "keyup event"}}

Her iki olay türü için de aynı işleyici işlevi kullanılır. Anahtar durumunun true (`"keydown"`) veya false (`"keyup"`) olarak güncellenmesi gerekip gerekmediğini belirlemek için olay nesnesinin `type` özelliğine bakar.

{{id runAnimation}}

## Oyunu çalıştırmak

{{index "requestAnimationFrame function", [animation, "platform game"]}}

[Bölüm ?](dom#animationFrame) içinde gördüğümüz `requestAnimationFrame` fonksiyonu bir oyunu canlandırmak için iyi bir yol sağlar. Ancak arayüzü oldukça ilkeldir - onu kullanmak, fonksiyonumuzun en son çağrıldığı zamanı takip etmemizi ve her kareden sonra `requestAnimationFrame` fonksiyonunu tekrar çağırmamızı gerektirir.

{{index "runAnimation function", "callback function", [function, "as value"], [function, "higher-order"], [animation, "platform game"]}}

Bu sıkıcı kısımları kullanışlı bir arayüzle saran ve basitçe `runAnimation` çağrısı yapmamızı sağlayan bir yardımcı fonksiyon tanımlayalım ve ona argüman olarak bir zaman farkı bekleyen ve tek bir kare çizen bir fonksiyon verelim. Frame fonksiyonu `false` değerini döndürdüğünde animasyon durur.

```{includeCode: true}
function runAnimation(frameFunc) {
  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      if (frameFunc(timeStep) === false) return;
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
```

{{index time, discretization}}

Maksimum çerçeve adımını 100 milisaniye (saniyenin onda biri) olarak belirledim. Sayfamızın bulunduğu tarayıcı sekmesi veya penceresi gizlendiğinde, `requestAnimationFrame` çağrıları sekme veya pencere tekrar gösterilinceye kadar askıya alınacaktır. Bu durumda, `lastTime` ile `time` arasındaki fark, sayfanın gizlendiği sürenin tamamı olacaktır. Oyunu tek bir adımda bu kadar ilerletmek aptalca görünür ve oyuncunun yere düşmesi gibi garip yan etkilere neden olabilir.

Fonksiyon ayrıca zaman adımlarını milisaniyeden daha kolay düşünülebilen saniyelere dönüştürür.

{{index "callback function", "runLevel function", [animation, "platform game"]}}

`runLevel` fonksiyonu bir `Level` nesnesi ve bir ((display)) yapıcı alır ve bir söz döndürür. Seviyeyi görüntüler (`document.body` içinde) ve kullanıcının oynamasına izin verir. Seviye bittiğinde (kaybedildiğinde veya kazanıldığında), `runLevel` bir saniye daha bekler (kullanıcının ne olduğunu görmesini sağlamak için) ve ardından ekranı temizler, animasyonu durdurur ve sözü oyunun bitiş durumuna çözer.

```{includeCode: true}
function runLevel(level, Display) {
  let display = new Display(document.body, level);
  let state = State.start(level);
  let ending = 1;
  return new Promise(resolve => {
    runAnimation(time => {
      state = state.update(time, arrowKeys);
      display.syncState(state);
      if (state.status == "playing") {
        return true;
      } else if (ending > 0) {
        ending -= time;
        return true;
      } else {
        display.clear();
        resolve(state.status);
        return false;
      }
    });
  });
}
```

{{index "runGame function"}}

Bir oyun bir dizi ((seviye))dir. ((oyuncu)) her öldüğünde, mevcut seviye yeniden başlatılır. Bir seviye tamamlandığında, bir sonraki seviyeye geçilir. Bu, bir dizi seviye planı (string) ve bir ((display)) yapıcısı alan aşağıdaki fonksiyonla ifade edilebilir:

```{includeCode: true}
async function runGame(plans, Display) {
  for (let level = 0; level < plans.length;) {
    let status = await runLevel(new Level(plans[level]),
                                Display);
    if (status == "won") level++;
  }
  console.log("You've won!");
}
```

{{index "asynchronous programming", "event handling"}}

`runLevel`ın bir promise döndürmesini sağladığımız için, `runGame` [Bölüm ?](async) içinde gösterildiği gibi bir `async` fonksiyonu kullanılarak yazılabilir. Oyuncu oyunu bitirdiğinde çözümlenen başka bir söz döndürür.

{{index game, "GAME_LEVELS data set"}}

[Bu bölümün sanal alanı](https://eloquentjavascript.net/code#16)[ ([_https://eloquentjavascript.net/code#16_](https://eloquentjavascript.net/code#16))]{if book} içinde `GAME_LEVELS` bağlayıcısında bir dizi ((seviye)) planı mevcuttur. Bu sayfa onları `runGame` ile besleyerek gerçek bir oyun başlatır.

```{sandbox: null, focus: yes, lang: html, startCode: true}
<link rel="stylesheet" href="css/game.css">

<body>
  <script>
    runGame(GAME_LEVELS, DOMDisplay);
  </script>
</body>
```

{{if interactive

Bakalım onları yenebilecek misin? Onları yaparken çok eğlendim.

if}}

## Egzersizler

### Oyun bitti

{{index "lives (exercise)", game}}

((Platform oyunları)) için geleneksel olan, oyuncunun sınırlı sayıda _can_ ile başlaması ve her öldüğünde bir can eksiltmesidir. Oyuncunun canı bittiğinde, oyun baştan başlar.

{{index "runGame function"}}

Canları uygulamak için `runGame`i ayarlayın. Oyuncunun üç canla başlamasını sağlayın. Bir seviye her başladığında mevcut can sayısını (`console.log` kullanarak) çıktı olarak verin.

{{if interactive

```{lang: html, test: no, focus: yes}
<link rel="stylesheet" href="css/game.css">

<body>
<script>
  // The old runGame function. Modify it...
  async function runGame(plans, Display) {
    for (let level = 0; level < plans.length;) {
      let status = await runLevel(new Level(plans[level]),
                                  Display);
      if (status == "won") level++;
    }
    console.log("You've won!");
  }
  runGame(GAME_LEVELS, DOMDisplay);
</script>
</body>
```

if}}

### Oyunu durdurmak

{{index "pausing (exercise)", "escape key", keyboard}}

Esc tuşuna basarak oyunu duraklatmayı (askıya almayı) ve duraklatmayı kaldırmayı mümkün kılın.

{{index "runLevel function", "event handling"}}

Bu, `runLevel` işlevini başka bir klavye olay işleyicisi kullanacak şekilde değiştirerek ve Esc tuşuna her basıldığında animasyonu keserek veya devam ettirerek yapılabilir.

{{index "runAnimation function"}}

İlk bakışta `runAnimation` arayüzü bunun için uygun gibi görünmeyebilir, ancak `runLevel` arayüzünü çağırma şeklini yeniden düzenlerseniz uygundur.

{{index [binding, global], "trackKeys function"}}

Bunu çalıştırdığınızda, deneyebileceğiniz başka bir şey daha var. Klavye olay işleyicilerini kaydetme şeklimiz biraz sorunlu. `arrowKeys` nesnesi şu anda küresel bir bağlayıcıdır ve olay işleyicileri oyun çalışmadığında bile etrafta tutulur. Sistemimizden _((sızıntı))_ yaptıklarını söyleyebilirsiniz. `trackKeys`i genişleterek işleyicilerinin kaydını kaldırmanın bir yolunu sağlayın ve ardından `runLevel`ı, başladığında işleyicilerini kaydedecek ve bittiğinde tekrar kaydını kaldıracak şekilde değiştirin.

{{if interactive

```{lang: html, focus: yes, test: no}
<link rel="stylesheet" href="css/game.css">

<body>
<script>
  // The old runLevel function. Modify this...
  function runLevel(level, Display) {
    let display = new Display(document.body, level);
    let state = State.start(level);
    let ending = 1;
    return new Promise(resolve => {
      runAnimation(time => {
        state = state.update(time, arrowKeys);
        display.syncState(state);
        if (state.status == "playing") {
          return true;
        } else if (ending > 0) {
          ending -= time;
          return true;
        } else {
          display.clear();
          resolve(state.status);
          return false;
        }
      });
    });
  }
  runGame(GAME_LEVELS, DOMDisplay);
</script>
</body>
```

if}}

{{hint

{{index "pausing (exercise)", [animation, "platform game"]}}

Bir animasyon `runAnimation`a verilen fonksiyondan `false` döndürülerek kesilebilir. Animasyon `runAnimation` tekrar çağrılarak devam ettirilebilir.

{{index closure}}

Bu yüzden oyunu duraklattığımızı `runAnimation`a verilen fonksiyona iletmemiz gerekiyor. Bunun için, hem olay işleyicinin hem de bu fonksiyonun erişebileceği bir bağlayıcı kullanabilirsiniz.

{{index "event handling", "removeEventListener method", [function, "as value"]}}

`trackKeys` tarafından kaydedilen işleyicilerin kaydını silmenin bir yolunu bulurken, bir işleyiciyi başarıyla kaldırmak için `addEventListener` fonksiyonuna aktarılan _aynı_ fonksiyon değerinin `removeEventListener` fonksiyonuna da aktarılması gerektiğini unutmayın. Bu nedenle, `trackKeys` içinde oluşturulan `handler` fonksiyon değeri, işleyicilerin kaydını kaldıran kod tarafından kullanılabilir olmalıdır.

`trackKeys` tarafından döndürülen nesneye, bu işlev değerini ya da kaydı kaldırma işlemini doğrudan gerçekleştiren bir yöntemi içeren bir özellik ekleyebilirsiniz.

hint}}

### Bir canavar

{{index "monster (exercise)"}}

Platform oyunlarında yenmek için üzerine atlayabileceğiniz düşmanların olması gelenekseldir. Bu alıştırma sizden oyuna böyle bir aktör tipi eklemenizi istiyor.

Biz buna canavar diyeceğiz. Canavarlar sadece yatay olarak hareket eder. Oyuncunun yönünde hareket etmelerini, yatay lav gibi ileri geri sıçramalarını veya istediğiniz herhangi bir hareket modeline sahip olmalarını sağlayabilirsiniz. Sınıfın düşmeyi idare etmesi gerekmez, ancak canavarın duvarlardan geçmediğinden emin olmalıdır.

Bir canavar oyuncuya dokunduğunda, etki oyuncunun üzerine atlayıp atlamadığına bağlıdır. Oyuncunun alt kısmının canavarın üst kısmına yakın olup olmadığını kontrol ederek bunu yaklaşık olarak yapabilirsiniz. Eğer durum böyleyse, canavar kaybolur. Değilse, oyun kaybedilir.

{{if interactive

```{test: no, lang: html, focus: yes}
<link rel="stylesheet" href="css/game.css">
<style>.monster { background: purple }</style>

<body>
  <script>
    // Complete the constructor, update, and collide methods
    class Monster {
      constructor(pos, /* ... */) {}

      get type() { return "monster"; }

      static create(pos) {
        return new Monster(pos.plus(new Vec(0, -1)));
      }

      update(time, state) {}

      collide(state) {}
    }

    Monster.prototype.size = new Vec(1.2, 2);

    levelChars["M"] = Monster;

    runLevel(new Level(`
..................................
.################################.
.#..............................#.
.#..............................#.
.#..............................#.
.#...........................o..#.
.#..@...........................#.
.##########..............########.
..........#..o..o..o..o..#........
..........#...........M..#........
..........################........
..................................
`), DOMDisplay);
  </script>
</body>
```

if}}

{{hint

{{index "monster (exercise)", "persistent data structure"}}

Zıplama gibi duruma bağlı bir hareket türü uygulamak istiyorsanız, gerekli durumu aktör nesnesinde sakladığınızdan emin olun; bunu yapıcı argüman olarak dahil edin ve bir özellik olarak ekleyin.

Unutmayın ki `update` eskisini değiştirmek yerine _new_ bir nesne döndürür.

{{index "collision detection"}}

Çarpışmayı ele alırken, oyuncuyu `state.actors` içinde bulun ve konumunu canavarın konumuyla karşılaştırın. Oyuncunun _altını_ elde etmek için, dikey boyutunu dikey konumuna eklemeniz gerekir. Güncellenmiş bir durumun oluşturulması, oyuncunun konumuna bağlı olarak ya `Coin`in `collide` yöntemine (aktörü kaldırmak) ya da `Lava`nınkine (durumu `lost` olarak değiştirmek) benzeyecektir.

hint}}
