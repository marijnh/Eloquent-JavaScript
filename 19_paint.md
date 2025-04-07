{{meta {load_files: ["code/chapter/19_paint.js"], zip: "html include=[\"css/paint.css\"]"}}}

# Proje: Bir Piksel Sanatı Editörü

{{quote {author: "Joan Miró", chapter: true}

Önümdeki birçok renge bakıyorum. Boş tuvalime bakıyorum. Sonra, renkleri, şiirleri şekillendiren kelimeler gibi, müziği şekillendiren notalar gibi uygulamaya çalışıyorum.

quote}}

{{index "Miró, Joan", "drawing program example", "project chapter"}}

{{figure {url: "img/chapter_picture_19.jpg", alt: "Bir mozaik siyah karolar gösteren illüstrasyon, yanında diğer karoların kavanozları", chapter: "framed"}}}

Önceki bölümlerdeki materyal, size temel bir ((web uygulaması)) oluşturmak için gereken tüm öğeleri sunuyor. Bu bölümde tam olarak bunu yapacağız.

{{index [file, image]}}

((Uygulamamız)), bir ((piksel)) ((çizim)) programı olacak. Bu programda, bir resmi piksel piksel değiştirebilir, renkli karelerden oluşan bir ızgara şeklinde gösterilen büyütülmüş bir görünümünü manipüle ederek düzenleyebilirsiniz. Programı kullanarak görüntü dosyalarını açabilir, fareniz veya başka bir işaretleme cihazıyla üzerine karalama yapabilir ve bunları kaydedebilirsiniz. İşte böyle görünecek:

{{figure {url: "img/pixel_editor.png", alt: "Piksel düzenleyicinin arayüzünü gösteren ekran görüntüsü: Üstte renkli piksellerden oluşan bir ızgara ve altında HTML alanları ve düğmeler şeklinde bir dizi kontrol", width: "8cm"}}}

Bilgisayarda resim yapmak harika bir şey. Malzemeler, ((yetenek)) veya beceri konusunda endişelenmenize gerek yok. Sadece karalamaya başlar ve nerede sonlanacağını görürsünüz.

## Bileşenler

{{index drawing, "select (HTML tag)", "canvas (HTML tag)", component}}

Uygulamanın arayüzü, üstte büyük bir `<canvas>` elemanı ve altında birkaç form ((alanı)) gösterir. Kullanıcı, bir `<select>` alanından bir araç seçip ardından tuvale tıklayarak, ((dokunarak)) veya ((sürükleyerek)) resim üzerinde çizim yapar. Tek pikseller veya dikdörtgenler çizmek, bir alanı doldurmak ve resimden bir ((renk)) seçmek için ((araçlar)) vardır.

{{index [DOM, components]}}

Editör arayüzünü, bir kısmı DOM’dan sorumlu olan ve içinde başka bileşenler barındırabilen _((bileşen))ler_ olarak yapılandıracağız.

{{index [state, "of application"]}}

Uygulamanın durumu (state), mevcut resim, seçilen araç ve seçilen renkten oluşur. Durumun tek bir değer içinde tutulacağı ve arayüz bileşenlerinin görünümlerini her zaman mevcut duruma dayandıracağı şekilde ayarlamalar yapacağız.

Bunun neden önemli olduğunu anlamak için alternatif bir yöntemi düşünelim: durumu arayüz boyunca parçalara dağıtmak. Belirli bir noktaya kadar, bu programlaması daha kolay bir yaklaşımdır. Örneğin, bir ((renk alanı)) koyup, mevcut rengi bilmemiz gerektiğinde değerini okuyabiliriz.

Ancak ardından bir ((renk seçici)) ekleriz—resimdeki bir pikselin rengini seçmek için tıklamanıza olanak tanıyan bir araç. Renk alanının doğru rengi göstermesini sağlamak için, bu aracın renk alanının var olduğunu bilmesi ve her yeni renk seçtiğinde onu güncellemesi gerekir. Eğer bir gün başka bir yerde rengi görünür hale getiren bir şey eklerseniz (belki fare imleci bunu gösterebilir), renk değiştirme kodunuzu da senkronize tutmak için güncellemeniz gerekir.

{{index modularity}}

Bu durum, arayüzün her bir bölümünün diğer tüm bölümleri bilmesi gerektiği bir problem yaratır ki bu çok modüler bir yaklaşım değildir. Bu bölümdeki gibi küçük uygulamalarda bu bir sorun olmayabilir. Ancak daha büyük projelerde tam bir kâbusa dönüşebilir.

Bu kâbustan prensip olarak kaçınmak için _((veri akışı))_ konusunda katı davranacağız. Bir durum vardır ve arayüz bu duruma göre çizilir. Bir arayüz bileşeni, kullanıcı eylemlerine yanıt vererek durumu güncelleyebilir. Bu noktada, bileşenler kendilerini bu yeni duruma göre senkronize etme şansı bulur.

{{index library, framework}}

Pratikte, her ((bileşen)), yeni bir durum (state) verildiğinde, güncellenmesi gereken yerlerde çocuk bileşenlerini de bilgilendirecek şekilde yapılandırılır. Bunu ayarlamak biraz zahmetlidir. Bu durumu daha kolay hale getirmek, birçok tarayıcı programlama kütüphanesinin temel satış noktasıdır. Ancak bu gibi küçük bir uygulama için böyle bir altyapıya ihtiyaç duymadan bunu yapabiliriz.

{{index [state, transitions]}}

Durumdaki güncellemeler, _((eylem))_ (action) adını vereceğimiz nesneler olarak temsil edilir. Bileşenler bu eylemleri oluşturabilir ve _((yönlendirebilir))_ (dispatch)—bunları merkezi bir durum yönetimi fonksiyonuna verebilir. Bu fonksiyon, bir sonraki durumu hesaplar, ardından arayüz bileşenleri kendilerini bu yeni duruma göre günceller.

{{index [DOM, components]}}

Bir ((kullanıcı arayüzü)) çalıştırmanın karmaşık işini ele alıp buna biraz ((yapı)) uyguluyoruz. DOM ile ilgili parçalar hala ((yan etki))lerle dolu olsa da, bunlar kavramsal olarak basit bir omurga ile desteklenir: durum güncelleme döngüsü. Durum, DOM’un nasıl göründüğünü belirler ve DOM olaylarının durumu değiştirebilmesinin tek yolu, duruma eylemler yönlendirmektir.

{{index "data flow"}}

Bu yaklaşımın _çok_ sayıda varyasyonu vardır; her biri kendi avantaj ve dezavantajlarına sahiptir. Ancak merkezi fikir aynıdır: Durum değişiklikleri, iyi tanımlanmış tek bir kanal üzerinden geçmelidir; her yerde gerçekleşmemelidir.

{{index "dom property", [interface, object]}}

Bileşenlerimiz, bir arayüze uyan ((sınıf))lar olacaktır. Constructor'ları bir durum alır—bu durum tüm uygulama durumu ya da her şeye erişim gerektirmeyen daha küçük bir değer olabilir—ve bunu bir `dom` özelliği oluşturmak için kullanır. Bu, bileşeni temsil eden DOM elemanıdır. Çoğu constructor, zamanla değişmeyecek bazı diğer değerler de alır; örneğin, bir eylemi ((yönlendirmek)) için kullanabilecekleri fonksiyon.

{{index "syncState method"}}

Her bileşenin, onu yeni bir durum değeriyle senkronize etmek için kullanılan bir `syncState` metodu vardır. Bu metod, constructor'ının ilk argümanıyla aynı türde bir argüman olan durumu alır.

## Durum

{{index "Picture class", "picture property", "tool property", "color property"}}

Uygulama durumu, `picture`, `tool` ve `color` özelliklerine sahip bir nesne olacaktır. Resim (picture), genişlik, yükseklik ve piksel içeriğini depolayan bir nesnedir. ((Piksel))ler, yukarıdan aşağıya, sıra sıra tek bir dizi içinde saklanır.

```{includeCode: true}
class Picture {
  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }
  static empty(width, height, color) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }
  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }
  draw(pixels) {
    let copy = this.pixels.slice();
    for (let {x, y, color} of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
}
```

{{index "side effect", "persistent data structure"}}

Resmi bir ((değişmez)) değer olarak ele almak istiyoruz, bunun nedenini bu bölümde daha sonra açıklayacağız. Ancak bazen bir seferde birçok pikseli güncellememiz gerekir. Bunu yapabilmek için, sınıfta `draw` adında bir metod bulunur. Bu metod, `x`, `y` ve `color` özelliklerine sahip güncellenmiş piksellerden oluşan bir dizi bekler ve bu piksellerin üzerine yazıldığı yeni bir resim oluşturur. Bu metod, tüm piksel dizisini kopyalamak için `slice` metodunu, argümansız olarak kullanır—`slice` metodunun başlangıç değeri varsayılan olarak 0, bitiş değeri ise dizinin uzunluğudur.

{{index "Array constructor", "fill method", ["length property", "for array"], [array, creation]}}

`empty` metodu, daha önce görmediğimiz iki dizi işlevini kullanır. `Array` constructor'ı, belirli bir uzunlukta boş bir dizi oluşturmak için bir sayı ile çağrılabilir. Daha sonra `fill` metodu, bu diziyi belirli bir değerle doldurmak için kullanılabilir. Bu yöntem, tüm piksellerin aynı renge sahip olduğu bir dizi oluşturmak için kullanılır.

{{index "hexadecimal number", "color component", "color field", "fillStyle property"}}

Renkler, bir ((kare işareti)) (`#`) ile başlayan ve altı onaltılık (taban-16) rakamdan oluşan geleneksel ((CSS)) ((renk kodları)) olarak saklanır—iki tanesi ((kırmızı)) bileşen, iki tanesi ((yeşil)) bileşen ve iki tanesi ((mavi)) bileşen içindir. Bu, renkleri yazmanın biraz karmaşık ve kullanışsız bir yolu olsa da, HTML renk giriş alanının kullandığı format budur ve bir canvas çizim bağlamında `fillStyle` özelliğinde kullanılabilir. Bu nedenle, bu programda renkleri kullanma yollarımız için yeterince pratiktir.

{{index black}}

Tüm bileşenlerin sıfır olduğu siyah, `"#000000"` olarak yazılır ve parlak ((pembe)), kırmızı ve mavi bileşenlerin maksimum değeri olan 255'e (onaltılık ((rakam))larla `ff` olarak yazılır) sahip olduğu `"#ff00ff"` gibi görünür.

{{index [state, transitions]}}

Arayüze, önceki durumun özelliklerini geçersiz kılan özelliklere sahip nesneler olarak ((eylem))ler ((yönlendirme)) yetkisi vereceğiz. Örneğin, kullanıcı renk alanını değiştirdiğinde `{color: field.value}` gibi bir nesne yönlendirebilir ve bu güncelleme fonksiyonu yeni bir durum hesaplayabilir.

{{index "updateState function"}}

```{includeCode: true}
function updateState(state, action) {
  return {...state, ...action};
}
```

{{index "period character"}}

Bu model, mevcut bir nesnenin özelliklerini önce eklemek ve ardından bazılarını geçersiz kılmak için nesne ((spread)) sözdiziminin kullanıldığı yaygın bir JavaScript desenidir. ((Değişmez)) nesnelerle çalışan kodlarda sıkça görülür.

## DOM oluşturma

{{index "createElement method", "elt function", [DOM, construction]}}

Arayüz bileşenlerinin yaptığı ana şeylerden biri, DOM yapısını oluşturmaktır. Yine, bunun için ayrıntılı DOM metotlarını doğrudan kullanmak istemiyoruz, bu nedenle `elt` fonksiyonunun biraz genişletilmiş bir versiyonunu sunuyoruz:

```{includeCode: true}
function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}
```

{{index "setAttribute method", "attribute", "onclick property", "click event", "event handling"}}

Bu versiyon ile [Bölüm ?](game#domdisplay)'de kullandığımız versiyon arasındaki temel fark, _nitelikler_ yerine DOM düğümlerine _özellikler_ atamasıdır. Bu, keyfi nitelikler ayarlamak için kullanılamayacağı anlamına gelir, ancak `onclick` gibi bir değeri dize olmayan özellikleri ayarlamak için kullanılabilir. `onclick`, bir tıklama olay işleyicisi kaydetmek için bir fonksiyona ayarlanabilir.

{{index "button (HTML tag)"}}

Bu, olay işleyicileri kaydetmek için şu kullanışlı stili mümkün kılar:

```{lang: html}
<body>
  <script>
    document.body.appendChild(elt("button", {
      onclick: () => console.log("click")
    }, "The button"));
  </script>
</body>
```

## Tuval

Tanımlayacağımız ilk bileşen, resmi renkli kutuların bir ızgarası olarak görüntüleyen arayüz parçasıdır. Bu bileşen iki şeyden sorumludur: bir resmi göstermek ve o resimdeki ((işaretçi olayı))nı uygulamanın geri kalanına iletmek.

{{index "PictureCanvas class", "callback function", "scale constant", "canvas (HTML tag)", "mousedown event", "touchstart event", [state, "of application"]}}

Bu nedenle, yalnızca mevcut resmi bilen, tüm uygulama durumu hakkında bilgi sahibi olmayan bir bileşen olarak tanımlayabiliriz. Uygulamanın bir bütün olarak nasıl çalıştığını bilmediği için, doğrudan ((eylem)) yönlendiremez. Bunun yerine, işaretçi olaylarına yanıt verirken, onu oluşturan kod tarafından sağlanan ve uygulamaya özgü parçaları yönetecek bir geri çağırma fonksiyonunu çağırır.

```{includeCode: true}
const scale = 10;

class PictureCanvas {
  constructor(picture, pointerDown) {
    this.dom = elt("canvas", {
      onmousedown: event => this.mouse(event, pointerDown),
      ontouchstart: event => this.touch(event, pointerDown)
    });
    this.syncState(picture);
  }
  syncState(picture) {
    if (this.picture == picture) return;
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
  }
}
```

{{index "syncState method", efficiency}}

Her pikseli, `scale` sabiti tarafından belirlenen 10'a 10'luk bir kare olarak çizeriz. Gereksiz işlemleri önlemek için, bileşen mevcut resmini takip eder ve yalnızca `syncState` yeni bir resim verildiğinde yeniden çizer.

{{index "drawPicture function"}}

Gerçek çizim fonksiyonu, ölçek ve resim boyutuna göre canvas'ın boyutunu ayarlar ve her piksel için bir kare olacak şekilde doldurur.

```{includeCode: true}
function drawPicture(picture, canvas, scale) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  let cx = canvas.getContext("2d");

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      cx.fillStyle = picture.pixel(x, y);
      cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}
```

{{index "mousedown event", "mousemove event", "button property", "buttons property", "pointerPosition function"}}

Sol fare düğmesine, fare resim canvas'ı üzerindeyken basıldığında, bileşen tıklanan pikselin konumunu (resim koordinatlarında) içeren bir `pointerDown` geri çağırmasını çağırır. Bu, resimle fare etkileşimini gerçekleştirmek için kullanılacaktır. Geri çağırma, düğme basılıyken işaretçi farklı bir piksele taşındığında bilgilendirilmek için başka bir geri çağırma fonksiyonu döndürebilir.

```{includeCode: true}
PictureCanvas.prototype.mouse = function(downEvent, onDown) {
  if (downEvent.button != 0) return;
  let pos = pointerPosition(downEvent, this.dom);
  let onMove = onDown(pos);
  if (!onMove) return;
  let move = moveEvent => {
    if (moveEvent.buttons == 0) {
      this.dom.removeEventListener("mousemove", move);
    } else {
      let newPos = pointerPosition(moveEvent, this.dom);
      if (newPos.x == pos.x && newPos.y == pos.y) return;
      pos = newPos;
      onMove(newPos);
    }
  };
  this.dom.addEventListener("mousemove", move);
};

function pointerPosition(pos, domNode) {
  let rect = domNode.getBoundingClientRect();
  return {x: Math.floor((pos.clientX - rect.left) / scale),
          y: Math.floor((pos.clientY - rect.top) / scale)};
}
```

{{index "getBoundingClientRect method", "clientX property", "clientY property"}}

((Piksel))lerin boyutunu bildiğimizden ve canvas'ın ekrandaki konumunu bulmak için `getBoundingClientRect` kullanabildiğimizden, fare olayı koordinatlarından (`clientX` ve `clientY`) resim koordinatlarına geçmek mümkündür. Bu koordinatlar her zaman aşağı yuvarlanır, böylece belirli bir piksele işaret eder.

{{index "touchstart event", "touchmove event", "preventDefault method"}}

((Dokunma olayı)) için benzer bir şey yapmamız gerekir, ancak farklı olayları kullanarak ve `"touchstart"` olayında ((kaydırma))yı önlemek için `preventDefault` çağırmayı unutmadan.

```{includeCode: true}
PictureCanvas.prototype.touch = function(startEvent,
                                         onDown) {
  let pos = pointerPosition(startEvent.touches[0], this.dom);
  let onMove = onDown(pos);
  startEvent.preventDefault();
  if (!onMove) return;
  let move = moveEvent => {
    let newPos = pointerPosition(moveEvent.touches[0],
                                 this.dom);
    if (newPos.x == pos.x && newPos.y == pos.y) return;
    pos = newPos;
    onMove(newPos);
  };
  let end = () => {
    this.dom.removeEventListener("touchmove", move);
    this.dom.removeEventListener("touchend", end);
  };
  this.dom.addEventListener("touchmove", move);
  this.dom.addEventListener("touchend", end);
};
```

{{index "touches property", "clientX property", "clientY property"}}

Dokunma olayları için, `clientX` ve `clientY` doğrudan olay nesnesinde bulunmaz, ancak `touches` özelliğindeki ilk dokunma nesnesinin koordinatlarını kullanabiliriz.

## Uygulama

Uygulamayı parça parça inşa edilebilir hale getirmek için, ana bileşeni bir resim canvas'ı ve constructor'a geçirdiğimiz dinamik bir ((araç)) ve ((kontrol)) seti etrafında bir kabuk olarak uygulayacağız.

_Kontroller_, resmin altında görünen arayüz elemanlarıdır. Bunlar, bir dizi ((bileşen)) constructor'ı olarak sağlanacaktır.

{{index "br (HTML tag)", "flood fill", "select (HTML tag)", "PixelEditor class", dispatch}}

_Araçlar_, piksel çizmek veya bir alanı doldurmak gibi işlemler yapar. Uygulama, kullanılabilir araçları bir `<select>` alanında gösterir. Kullanıcının bir işaretçi cihazıyla resimle etkileşime geçtiğinde ne olacağını, seçili araç belirler. Mevcut araç seti, açılır listede görünen adları araçları uygulayan fonksiyonlara eşleyen bir nesne olarak sağlanır. Bu tür fonksiyonlar, bir resim konumu, mevcut uygulama durumu ve bir `dispatch` fonksiyonu argümanları alır. İşaretçi farklı bir piksele hareket ettiğinde yeni bir konum ve mevcut durumla çağrılan bir hareket işleyici fonksiyonu döndürebilirler.

```{includeCode: true}
class PixelEditor {
  constructor(state, config) {
    let {tools, controls, dispatch} = config;
    this.state = state;

    this.canvas = new PictureCanvas(state.picture, pos => {
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);
      if (onMove) return pos => onMove(pos, this.state);
    });
    this.controls = controls.map(
      Control => new Control(state, config));
    this.dom = elt("div", {}, this.canvas.dom, elt("br"),
                   ...this.controls.reduce(
                     (a, c) => a.concat(" ", c.dom), []));
  }
  syncState(state) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (let ctrl of this.controls) ctrl.syncState(state);
  }
}
```

`PictureCanvas`'a verilen işaretçi işleyici, uygun argümanlarla seçili aracı çağırır ve eğer bu bir hareket işleyici döndürürse, onu durumu da alacak şekilde uyarlar.

{{index "reduce method", "map method", [whitespace, "in HTML"], "syncState method"}}

Tüm kontroller, uygulama durumu değiştiğinde güncellenebilmeleri için `this.controls` içinde oluşturulup saklanır. `reduce` çağrısı, kontrollerin DOM elemanları arasına boşluklar ekler. Böylece, çok sıkışık görünmezler.

{{index "select (HTML tag)", "change event", "ToolSelect class", "syncState method"}}

İlk kontrol, ((araç)) seçim menüsüdür. Her araç için bir seçenek içeren bir `<select>` elementi oluşturur ve kullanıcı farklı bir araç seçtiğinde uygulama durumunu güncelleyen bir `"change"` olay işleyicisi ayarlar.

```{includeCode: true}
class ToolSelect {
  constructor(state, {tools, dispatch}) {
    this.select = elt("select", {
      onchange: () => dispatch({tool: this.select.value})
    }, ...Object.keys(tools).map(name => elt("option", {
      selected: name == state.tool
    }, name)));
    this.dom = elt("label", null, "🖌 Tool: ", this.select);
  }
  syncState(state) { this.select.value = state.tool; }
}
```

{{index "label (HTML tag)"}}

Etiket metnini ve alanı bir `<label>` elementi içinde sararak, tarayıcıya, etiketin o alana ait olduğunu belirtiriz. Bu sayede, örneğin etikete tıklayarak alanı odaklayabilirsiniz.

{{index "color field", "input (HTML tag)"}}

Ayrıca rengi değiştirebilmemiz gerektiğinden, bunun için bir kontrol ekleyelim. `type` özelliği `color` olan bir HTML `<input>` elementi, renk seçimi için özelleştirilmiş bir form alanı sağlar. Bu tür bir alanın değeri her zaman `"#RRGGBB"` formatında (kırmızı, yeşil ve mavi bileşenler, her renk için iki haneli) bir CSS renk kodudur. Kullanıcı bu alanla etkileşime geçtiğinde, tarayıcı bir ((renk seçici)) arayüz gösterecektir.

{{if book

Tarayıcıya bağlı olarak, renk seçici şu şekilde görünebilir:

{{figure {url: "img/color-field.png", alt: "Renk alanının ekran görüntüsü", width: "6cm"}}}

if}}

{{index "ColorSelect class", "syncState method"}}

Bu ((kontrol)), böyle bir alan oluşturur ve uygulama durumunun `color` özelliğiyle senkronize olacak şekilde yapılandırır.

```{includeCode: true}
class ColorSelect {
  constructor(state, {dispatch}) {
    this.input = elt("input", {
      type: "color",
      value: state.color,
      onchange: () => dispatch({color: this.input.value})
    });
    this.dom = elt("label", null, "🎨 Color: ", this.input);
  }
  syncState(state) { this.input.value = state.color; }
}
```

## Çizim araçları

Bir şey çizebilmeden önce, canvas üzerindeki mouse veya dokunma olaylarının işlevselliğini kontrol edecek ((araç))ları uygulamamız gerekiyor.

{{index "draw function"}}

En temel araç, herhangi bir tıklanan veya dokunulan ((piksel))i seçili renge dönüştüren çizim aracıdır. Bu araç, işaret edilen pikselin seçili renge sahip olduğu bir versiyonuyla resmi güncelleyen bir eylem ((dispatch)) eder.

```{includeCode: true}
function draw(pos, state, dispatch) {
  function drawPixel({x, y}, state) {
    let drawn = {x, y, color: state.color};
    dispatch({picture: state.picture.draw([drawn])});
  }
  drawPixel(pos, state);
  return drawPixel;
}
```

Fonksiyon, hemen `drawPixel` fonksiyonunu çağırır, ardından kullanıcı resmi sürüklerken veya ((kaydırır))ken yeni dokunulan pikseller için tekrar çağrılması amacıyla bu fonksiyonu döndürür.

{{index "rectangle function"}}

Daha büyük şekiller çizmek için hızlı bir şekilde ((dikdörtgen)) oluşturmak faydalı olabilir. `rectangle` aracı, sürüklemeye başladığınız nokta ile sürüklediğiniz nokta arasında bir dikdörtgen çizer.

```{includeCode: true}
function rectangle(start, state, dispatch) {
  function drawRectangle(pos) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({x, y, color: state.color});
      }
    }
    dispatch({picture: state.picture.draw(drawn)});
  }
  drawRectangle(start);
  return drawRectangle;
}
```

{{index "persistent data structure", [state, persistence]}}

Bu uygulamadaki önemli bir detay, sürükleme sırasında dikdörtgenin _orijinal_ durumdan itibaren resme yeniden çizilmesidir. Bu sayede, dikdörtgeni oluştururken boyutunu büyütüp küçültebilir ve ara dikdörtgenler son resimde kalmaz. Bu, ((immutable)) resim nesnelerinin neden faydalı olduğuna dair bir örnek sunar—bunun başka bir nedenini ileride göreceğiz.

((Alan doldurma)) işlemini uygulamak biraz daha karmaşıktır. Bu araç, işaretçi altındaki pikseli ve aynı renge sahip olan tüm bitişik pikselleri doldurur. "Bitişik", doğrudan yatay veya dikey bitişik anlamına gelir, çapraz bitişik değil. Bu resim, alan doldurma aracının işaretlenen pikselde kullanıldığında boyadığı piksellerin setini gösterir:

{{figure {url: "img/flood-grid.svg", alt: "Alan doldurma işleminin sonucunu gösteren bir piksel ızgarasının diyagramı", width: "6cm"}}}

{{index "fill function"}}

İlginç bir şekilde, bunu yapma yöntemi, [Bölüm ?](robot) içerisindeki ((yol bulma)) koduna benzer. O kod bir rota bulmak için bir grafiği arıyordu; bu kod ise "bağlantılı" tüm pikselleri bulmak için bir ızgarayı arıyor. Dallanmış bir olası yollar kümesini takip etme problemi, her iki durumda da benzerdir.

```{includeCode: true}
const around = [{dx: -1, dy: 0}, {dx: 1, dy: 0},
                {dx: 0, dy: -1}, {dx: 0, dy: 1}];

function fill({x, y}, state, dispatch) {
  let targetColor = state.picture.pixel(x, y);
  let drawn = [{x, y, color: state.color}];
  let visited = new Set();
  for (let done = 0; done < drawn.length; done++) {
    for (let {dx, dy} of around) {
      let x = drawn[done].x + dx, y = drawn[done].y + dy;
      if (x >= 0 && x < state.picture.width &&
          y >= 0 && y < state.picture.height &&
          !visited.has(x + "," + y) &&
          state.picture.pixel(x, y) == targetColor) {
        drawn.push({x, y, color: state.color});
        visited.add(x + "," + y);
      }
    }
  }
  dispatch({picture: state.picture.draw(drawn)});
}
```

Çizilen piksellerin dizisi, fonksiyonun ((iş listesi)) olarak kullanılır. Ulaşılan her piksel için, herhangi bir bitişik pikselin aynı renge sahip olup olmadığını ve daha önce boyanıp boyanmadığını kontrol etmemiz gerekir. Döngü sayacı, yeni pikseller eklendikçe `drawn` dizisinin uzunluğunun gerisinde kalır. Sayacın önündeki herhangi bir piksel hâlâ keşfedilmesi gereken bir durumdadır. Sayaç dizinin uzunluğuna ulaştığında, keşfedilmemiş piksel kalmaz ve fonksiyon tamamlanır.

{{index "pick function"}}

Son ((araç)) bir ((renk seçici))dir ve resimde bir rengi işaret ederek onu mevcut çizim rengi olarak kullanmanızı sağlar.

```{includeCode: true}
function pick(pos, state, dispatch) {
  dispatch({color: state.picture.pixel(pos.x, pos.y)});
}
```

{{if interactive

Artık uygulamamızı test edebiliriz!

```{lang: html}
<div></div>
<script>
  let state = {
    tool: "draw",
    color: "#000000",
    picture: Picture.empty(60, 30, "#f0f0f0")
  };
  let app = new PixelEditor(state, {
    tools: {draw, fill, rectangle, pick},
    controls: [ToolSelect, ColorSelect],
    dispatch(action) {
      state = updateState(state, action);
      app.syncState(state);
    }
  });
  document.querySelector("div").appendChild(app.dom);
</script>
```

if}}

## Kaydetme ve yükleme

{{index "SaveButton class", "drawPicture function", [file, image]}}

Başyapıtımızı çizdiğimizde, daha sonrası için kaydetmek isteyeceğiz. Mevcut resmi bir resim dosyası olarak ((indirmek)) için bir düğme eklemeliyiz. Bu ((kontrol)) o düğmeyi sağlar:

```{includeCode: true}
class SaveButton {
  constructor(state) {
    this.picture = state.picture;
    this.dom = elt("button", {
      onclick: () => this.save()
    }, "💾 Save");
  }
  save() {
    let canvas = elt("canvas");
    drawPicture(this.picture, canvas, 1);
    let link = elt("a", {
      href: canvas.toDataURL(),
      download: "pixelart.png"
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  syncState(state) { this.picture = state.picture; }
}
```

{{index "canvas (HTML tag)"}}

Bileşen, kaydederken erişebilmek için mevcut resmin kaydını tutar. Resim dosyasını oluşturmak için, resmi üzerine çizdiği bir `<canvas>` öğesi kullanır (piksel başına bir piksel ölçekte).

{{index "toDataURL method", "data URL"}}

Bir canvas öğesindeki `toDataURL` yöntemi, `data:` ile başlayan bir URL oluşturur. http:`ve`https:` URL`lerinin aksine, data URL`leri URL`deki tüm kaynağı içerir. Genellikle çok uzundurlar, ancak tarayıcıda rastgele resimlere çalışan bağlantılar oluşturmamızı sağlarlar.

{{index "a (HTML tag)", "download attribute"}}

Tarayıcının resmi indirmesini sağlamak için, bu URL'yi işaret eden ve `download` niteliğine sahip bir ((link)) öğesi oluştururuz. Bu tür bağlantılar tıklandığında tarayıcının bir dosya kaydetme iletişim kutusu göstermesini sağlar. Bu bağlantıyı belgeye ekliyoruz, üzerine tıklanmasını simüle ediyoruz ve tekrar kaldırıyoruz.

((Tarayıcı)) teknolojisi ile çok şey yapabilirsiniz, ancak bazen bunu yapmanın yolu oldukça gariptir.

{{index "LoadButton class", control, [file, image]}}

Ve durum daha da kötüleşiyor. Mevcut resim dosyalarını da uygulamamıza yükleyebilmek isteyeceğiz. Bunu yapmak için yine bir düğme bileşeni tanımlıyoruz.

```{includeCode: true}
class LoadButton {
  constructor(_, {dispatch}) {
    this.dom = elt("button", {
      onclick: () => startLoad(dispatch)
    }, "📁 Load");
  }
  syncState() {}
}

function startLoad(dispatch) {
  let input = elt("input", {
    type: "file",
    onchange: () => finishLoad(input.files[0], dispatch)
  });
  document.body.appendChild(input);
  input.click();
  input.remove();
}
```

{{index [file, access], "input (HTML tag)"}}

Kullanıcının bilgisayarındaki bir dosyaya erişmek için, kullanıcının bir dosya giriş alanı aracılığıyla dosyayı seçmesi gerekir. Ancak yükleme düğmesinin bir dosya giriş alanı gibi görünmesini istemiyorum, bu nedenle düğmeye tıklandığında dosya girişini oluşturuyoruz ve ardından bu dosya girişinin kendisine tıklanmış gibi davranıyoruz.

{{index "FileReader class", "img (HTML tag)", "readAsDataURL method", "Picture class"}}

Kullanıcı bir dosya seçtiğinde, içeriğine erişmek için `FileReader` kullanabiliriz ve bu içeriğe tekrar bir ((veri URL'si)) olarak erişebiliriz. Bu URL bir `<img>` elementi oluşturmak için kullanılabilir, ancak böyle bir görüntünün piksellerine doğrudan erişemediğimiz için bir `Picture` nesnesi oluşturamayız.

```{includeCode: true}
function finishLoad(file, dispatch) {
  if (file == null) return;
  let reader = new FileReader();
  reader.addEventListener("load", () => {
    let image = elt("img", {
      onload: () => dispatch({
        picture: pictureFromImage(image)
      }),
      src: reader.result
    });
  });
  reader.readAsDataURL(file);
}
```

{{index "canvas (HTML tag)", "getImageData method", "pictureFromImage function"}}

Piksellere erişmek için önce resmi bir `<canvas>` elementine çizmeliyiz. Canvas bağlamı, bir betiğin piksellerini okumasına olanak tanıyan bir `getImageData` metoduna sahiptir. Bu nedenle, resim canvas üzerinde olduğunda ona erişebilir ve bir `Picture` nesnesi oluşturabiliriz.

```{includeCode: true}
function pictureFromImage(image) {
  let width = Math.min(100, image.width);
  let height = Math.min(100, image.height);
  let canvas = elt("canvas", {width, height});
  let cx = canvas.getContext("2d");
  cx.drawImage(image, 0, 0);
  let pixels = [];
  let {data} = cx.getImageData(0, 0, width, height);

  function hex(n) {
    return n.toString(16).padStart(2, "0");
  }
  for (let i = 0; i < data.length; i += 4) {
    let [r, g, b] = data.slice(i, i + 3);
    pixels.push("#" + hex(r) + hex(g) + hex(b));
  }
  return new Picture(width, height, pixels);
}
```

Görüntülerin boyutunu 100'e 100 piksel ile sınırlandıracağız çünkü daha büyük bir şey ekranımızda _çok büyük_ görünecek ve arayüzü yavaşlatabilir.

{{index "getImageData method", color, transparency}}

`getImageData` tarafından döndürülen nesnenin `data` özelliği, renk bileşenlerinden oluşan bir dizidir. Argümanlarla belirtilen dikdörtgendeki her piksel için bu dizi, pikselin renginin kırmızı, yeşil, mavi ve _((alfa))_ bileşenlerini temsil eden dört değer içerir. Bu değerler 0 ile 255 arasında değişir. Alfa kısmı opaklığı temsil eder—0 olduğunda piksel tamamen şeffaf, 255 olduğunda ise tamamen opaktır. Amacımız için bu kısmı görmezden gelebiliriz.

{{index "hexadecimal number", "toString method"}}

Renk notasyonumuzda kullanılan her bileşen için iki onaltılık basamak, tam olarak 0 ile 255 aralığına karşılık gelir—iki taban-16 basamağı, 16^2^ = 256 farklı sayıyı ifade edebilir. Sayıların `toString` metodu bir taban argümanı alabilir, bu yüzden `n.toString(16)` taban 16'da bir string temsil oluşturur. Her sayının iki basamak kapladığından emin olmalıyız, bu yüzden `hex` yardımcı fonksiyonu, gerekirse başa sıfır eklemek için `padStart` çağrısı yapar.

Artık yükleyip kaydedebiliyoruz! Bitirmeden önce sadece bir özellik kaldı.

## Geçmişi geri alma

Düzenleme sürecinin yarısı küçük hatalar yapmak ve bunları düzeltmektir. Bu nedenle, bir çizim programında önemli bir özellik, bir ((geri alma geçmişi))dir.

{{index "persistent data structure", [state, "of application"]}}

Değişiklikleri geri alabilmek için resmin önceki sürümlerini saklamamız gerekiyor. Bu, bir ((değiştirilemez)) değer olduğu için oldukça kolaydır. Ancak uygulama durumunda ek bir alan gerektirir.

{{index "done property"}}

Önceki ((resim)) sürümlerini saklamak için bir `done` dizisi ekleyeceğiz. Bu özelliği sürdürmek, resimleri diziye ekleyen daha karmaşık bir durum güncelleme fonksiyonu gerektirir.

{{index "doneAt property", "historyUpdateState function", "Date.now function"}}

Ancak _her_ değişikliği saklamak istemiyoruz, yalnızca belirli bir ((zaman)) aralığında olan değişiklikleri. Bunu yapabilmek için, geçmişte bir resmi en son ne zaman sakladığımızı izleyen ikinci bir özellik olan `doneAt`'a ihtiyacımız olacak.

```{includeCode: true}
function historyUpdateState(state, action) {
  if (action.undo == true) {
    if (state.done.length == 0) return state;
    return {
      ...state,
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0
    };
  } else if (action.picture &&
             state.doneAt < Date.now() - 1000) {
    return {
      ...state,
      ...action,
      done: [state.picture, ...state.done],
      doneAt: Date.now()
    };
  } else {
    return {...state, ...action};
  }
}
```

{{index "undo history"}}

Eylem bir geri alma eylemi olduğunda, fonksiyon geçmişten en son resmi alır ve bunu geçerli resim yapar. `doneAt`'i sıfıra ayarlar, böylece bir sonraki değişikliğin resmi yeniden geçmişe kaydetmesi garanti edilir. Bu, istediğiniz takdirde tekrar ona dönebilmenizi sağlar.

Aksi takdirde, eylem yeni bir resim içeriyorsa ve en son bir şey kaydettiğimiz zaman bir saniyeden (1000 milisaniye) daha önceyse, `done` ve `doneAt` özellikleri önceki resmi saklayacak şekilde güncellenir.

{{index "UndoButton class", control}}

Geri alma düğmesi ((bileşeni)) çok fazla iş yapmaz. Tıklandığında geri alma eylemleri gönderir ve geri alınacak bir şey olmadığında kendini devre dışı bırakır.

```{includeCode: true}
class UndoButton {
  constructor(state, {dispatch}) {
    this.dom = elt("button", {
      onclick: () => dispatch({undo: true}),
      disabled: state.done.length == 0
    }, "⮪ Undo");
  }
  syncState(state) {
    this.dom.disabled = state.done.length == 0;
  }
}
```

## Haydi çizelim

{{index "PixelEditor class", "startState constant", "baseTools constant", "baseControls constant", "startPixelEditor function"}}

Uygulamayı kurmak için bir durum, bir dizi ((araç)), bir dizi ((kontrol)) ve bir ((dispatch)) fonksiyonu oluşturmamız gerekiyor. Bunları ana bileşeni oluşturmak için `PixelEditor` constructor'ına iletebiliriz. Egzersizlerde birkaç düzenleyici oluşturmamız gerekeceğinden, önce bazı bağlamalar tanımlıyoruz.

```{includeCode: true}
const startState = {
  tool: "draw",
  color: "#000000",
  picture: Picture.empty(60, 30, "#f0f0f0"),
  done: [],
  doneAt: 0
};

const baseTools = {draw, fill, rectangle, pick};

const baseControls = [
  ToolSelect, ColorSelect, SaveButton, LoadButton, UndoButton
];

function startPixelEditor({state = startState,
                           tools = baseTools,
                           controls = baseControls}) {
  let app = new PixelEditor(state, {
    tools,
    controls,
    dispatch(action) {
      state = historyUpdateState(state, action);
      app.syncState(state);
    }
  });
  return app.dom;
}
```

{{index "destructuring binding", "= operator", [property, access]}}

Bir nesneyi veya diziyi parçalarına ayırırken, bir bağlama adına `=` koyarak bir ((varsayılan değer)) atayabilirsiniz. Bu, ilgili özellik eksik olduğunda veya `undefined` içerdiğinde kullanılır. `startPixelEditor` fonksiyonu, bir dizi isteğe bağlı özellik içeren bir nesneyi argüman olarak kabul etmek için bunu kullanır. Örneğin, bir `tools` özelliği sağlamazsanız, `tools` `baseTools`'a bağlanacaktır.

Bir düzenleyiciyi ekranda bu şekilde elde ederiz:

```{lang: html, startCode: true}
<div></div>
<script>
  document.querySelector("div")
    .appendChild(startPixelEditor({}));
</script>
```

{{if interactive

Haydi bir şey çiz.

if}}

## Neden bu kadar zor?

Tarayıcı teknolojisi inanılmaz. Güçlü bir dizi arayüz oluşturma bloğu, bunları şekillendirip manipüle etme yolları ve uygulamalarınızı inceleyip hata ayıklama araçları sağlar. Tarayıcı için yazdığınız yazılım, dünyadaki neredeyse her bilgisayar ve telefonda çalıştırılabilir.

Aynı zamanda, tarayıcı teknolojisi saçma bir yapıya sahip. Onu tam anlamıyla öğrenmek için birçok anlamsız numara ve karmaşık bilgi öğrenmeniz gerekiyor. Ayrıca, sağladığı varsayılan programlama modeli o kadar sorunlu ki, çoğu programcı doğrudan bununla uğraşmak yerine birkaç katman ((soyutlama)) ile bunu örtmeyi tercih ediyor.

{{index standard, evolution}}

Durum kesinlikle iyileşiyor olsa da, bu genellikle eksiklikleri gidermek için daha fazla öğe eklenmesi şeklinde gerçekleşiyor—bu da daha fazla ((karmaşıklık)) yaratıyor. Bir milyon web sitesi tarafından kullanılan bir özellik kolayca değiştirilemez. Değiştirilebilse bile, yerine ne konulması gerektiğine karar vermek zor olurdu.

{{index "social factors", "economic factors", history}}

Teknoloji asla bir boşlukta var olmaz—araçlarımız ve onları üreten sosyal, ekonomik ve tarihsel faktörlerle sınırlıyız. Bu sinir bozucu olabilir, ancak mevcut teknik gerçekliğin nasıl çalıştığını ve neden böyle olduğunu anlamaya çalışmak, buna kızmaktan ya da başka bir gerçeklik için beklemekten genellikle daha üretkendir.

Yeni ((soyutlama))lar _yararlı_ olabilir. Bu bölümde kullandığım bileşen modeli ve ((veri akışı)) düzeni bunun kaba bir biçimidir. Daha önce de belirtildiği gibi, kullanıcı arayüzü programlamasını daha keyifli hale getirmeye çalışan kütüphaneler vardır. Bu yazının yazıldığı dönemde [React](https://reactjs.org/) ve [Svelte](https://svelte.dev/) popüler seçeneklerdir, ancak bu tür çerçevelerin kendine özgü bir sektörü vardır. Web uygulamaları programlamasıyla ilgileniyorsanız, nasıl çalıştıklarını ve hangi faydaları sağladıklarını anlamak için bunlardan birkaçını incelemenizi öneririm.

## Alıştırmalar

Programımızda iyileştirme için hala yer var. Alıştırma olarak birkaç yeni özellik ekleyelim.

### Klavye kısayolları

{{index "keyboard bindings (exercise)"}}

Uygulamaya ((klavye)) kısayolları ekleyin. Bir aracın adının ilk harfi o aracı seçer ve [control]{tuşadı}-Z veya [command]{tuşadı}-Z tuş kombinasyonları geri alma işlevini aktif eder.

{{index "PixelEditor class", "tabindex attribute", "elt function", "keydown event"}}

Bunu `PixelEditor` bileşenini değiştirerek yapın. Sarma `<div>` öğesine 0 değeriyle bir `tabIndex` özelliği ekleyin, böylece klavye ((odak)) alabilir. Burada dikkat edilmesi gereken nokta, `tabindex` _özniteliğine_ karşılık gelen _özelliğin_ adının `tabIndex` olduğu ve büyük I harfiyle yazıldığıdır. `elt` fonksiyonumuz, bu özelliğin adını bekler. Tuş olay işleyicilerini doğrudan bu öğe üzerinde kaydedin. Bu, klavye ile uygulama üzerinde işlem yapabilmek için uygulamaya tıklamanız, dokunmanız veya sekme tuşuyla odaklanmanız gerektiği anlamına gelir.

{{index "ctrlKey property", "metaKey property", "control key", "command key"}}

Unutmayın, klavye olaylarının `ctrlKey` ve Mac'te [command]{tuşadı} için `metaKey` özellikleri vardır. Bu özellikleri kullanarak bu tuşların basılı olup olmadığını kontrol edebilirsiniz.

{{if interactive

```{test: no, lang: html}
<div></div>
<script>
  // Orijinal PixelEditor sınıfı. constructor fonksiyonunu devam ettir.
  class PixelEditor {
    constructor(state, config) {
      let {tools, controls, dispatch} = config;
      this.state = state;

      this.canvas = new PictureCanvas(state.picture, pos => {
        let tool = tools[this.state.tool];
        let onMove = tool(pos, this.state, dispatch);
        if (onMove) {
          return pos => onMove(pos, this.state, dispatch);
        }
      });
      this.controls = controls.map(
        Control => new Control(state, config));
      this.dom = elt("div", {}, this.canvas.dom, elt("br"),
                     ...this.controls.reduce(
                       (a, c) => a.concat(" ", c.dom), []));
    }
    syncState(state) {
      this.state = state;
      this.canvas.syncState(state.picture);
      for (let ctrl of this.controls) ctrl.syncState(state);
    }
  }

  document.querySelector("div")
    .appendChild(startPixelEditor({}));
</script>
```

if}}

{{hint

{{index "keyboard bindings (exercise)", "key property", "shift key"}}

Olayların `key` özelliği, harf tuşları için [shift]{tuşadı} basılı değilse küçük harfini döndürecektir. Bu durumda, [shift]{tuşadı} ile ilgili tuş olaylarına ilgi duymuyoruz.

{{index "keydown event"}}

Bir `"keydown"` işlemcisi, olay nesnesini inceleyerek bu olayın bir kısayolla eşleşip eşleşmediğini kontrol edebilir. `tools` nesnesinden ilk harflerin listesini otomatik olarak alabilirsiniz; böylece bu harfleri elle yazmak zorunda kalmazsınız.

{{index "preventDefault method"}}

Eğer tuş olayı bir kısayolla eşleşiyorsa, `preventDefault` çağrısını yaparak varsayılan davranışı engelleyebilir ve ardından ((dispatch)) işlemini gerçekleştirerek uygun eylemi tetikleyebilirsiniz.

hint}}

### Verimli çizim

{{index "efficient drawing (exercise)", "canvas (HTML tag)", efficiency}}

Çizim sırasında, uygulamamızın yaptığı işlemlerin büyük kısmı `drawPicture` içinde gerçekleşir. Yeni bir durum oluşturmak ve DOM'un geri kalanını güncellemek çok maliyetli değildir; ancak canvas üzerindeki tüm piksellerin yeniden boyanması oldukça yoğun bir işlemdir.

{{index "syncState method", "PictureCanvas class"}}

`PictureCanvas` sınıfının `syncState` metodunu daha hızlı hale getirmenin bir yolunu bulun ve yalnızca gerçekten değişen pikselleri yeniden çizin.

{{index "drawPicture function", compatibility}}

Unutmayın ki `drawPicture`, kaydetme düğmesi tarafından da kullanılıyor. Eğer değişiklik yaparsanız, eski kullanımı bozmadığınızdan emin olun veya farklı bir adla yeni bir sürüm oluşturun.

{{index "width property", "height property"}}

Ayrıca `<canvas>` öğesinin `width` veya `height` özelliklerini değiştirmenin, canvas'ı temizleyerek tamamen şeffaf bir hale getirdiğini unutmayın.

{{if interactive

```{test: no, lang: html}
<div></div>
<script>
  // Change this method
  PictureCanvas.prototype.syncState = function(picture) {
    if (this.picture == picture) return;
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
  };

  // You may want to use or change this as well
  function drawPicture(picture, canvas, scale) {
    canvas.width = picture.width * scale;
    canvas.height = picture.height * scale;
    let cx = canvas.getContext("2d");

    for (let y = 0; y < picture.height; y++) {
      for (let x = 0; x < picture.width; x++) {
        cx.fillStyle = picture.pixel(x, y);
        cx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }

  document.querySelector("div")
    .appendChild(startPixelEditor({}));
</script>
```

if}}

{{hint

{{index "efficient drawing (exercise)"}}

Bu alıştırma, ((değiştirilemez)) veri yapılarının kodu _daha hızlı_ hale getirebileceği iyi bir örnektir. Eski ve yeni resmi karşılaştırabildiğimiz için yalnızca renk değiştiren pikselleri yeniden çizebiliriz. Bu sayede çoğu durumda çizim işlemlerinin %99'undan fazlasından tasarruf sağlanabilir.

{{index "drawPicture function"}}

Yeni bir `updatePicture` fonksiyonu yazabilir veya `drawPicture`'a isteğe bağlı ek bir argüman olarak önceki resmi iletebilirsiniz. Bu fonksiyon, her ((piksel)) için, aynı konumdaki önceki resimde aynı renkte bir renk olup olmadığını kontrol eder ve eğer varsa o pikseli atlar.

{{index "width property", "height property", "canvas (HTML tag)"}}

Canvas boyutunu değiştirdiğimizde temizlendiğinden, eski resim ve yeni resim aynı boyutta olduğunda `width` ve `height` özelliklerini değiştirmekten kaçının. Eğer farklılarsa (örneğin yeni bir resim yüklendiğinde), canvas boyutunu değiştirdikten sonra eski resmi tutan referansı null olarak ayarlayın. Bu, yeni bir resim yükledikten sonra piksel atlamamanızı sağlar.

hint}}

### Daireler

{{index "circles (exercise)", dragging}}

Bir `circle` adında ((tool)) tanımlayın; bu araç sürüklediğinizde dolu bir daire çizecek. Dairenin merkezi, sürükleme veya dokunma işleminin başladığı noktadadır ve ((radius)) sürükleme mesafesine göre belirlenir.

{{if interactive

```{test: no, lang: html}
<div></div>
<script>
  function circle(pos, state, dispatch) {
    // Kodunuz buraya
  }

  let dom = startPixelEditor({
    tools: {...baseTools, circle}
  });
  document.querySelector("div").appendChild(dom);
</script>
```

if}}

{{hint

{{index "circles (exercise)", "rectangle function"}}

`rectangle` aracından bazı ilhamlar alabilirsiniz. Bu araç gibi, imleç hareket ettiğinde mevcut resmi değil, _başlangıç_ resminde çizmeye devam etmek isteyeceksiniz.

Hangi piksellerin renklendirileceğini bulmak için ((Pisagor teoremi))ni kullanabilirsiniz. Öncelikle, imlecin mevcut pozisyonu ile başlangıç pozisyonu arasındaki mesafeyi `Math.sqrt` fonksiyonu kullanarak x-koordinatlarındaki farkın karesi (`Math.pow(x, 2)`) ve y-koordinatlarındaki farkın karesinin toplamının karekökünü alarak hesaplayın. Daha sonra başlangıç pozisyonunun etrafında, kenar uzunlukları en az iki katı olan bir kare piksel alanında döngü oluşturun ve dairenin yarıçapına dahil olan pikselleri yine Pisagor formülünü kullanarak belirleyin.

Resim sınırlarının dışındaki pikselleri renklendirmeye çalışmadığınızdan emin olun.

hint}}

### Doğru çizgiler

{{index "proper lines (exercise)", "line drawing"}}

Bu, önceki iki egzersizden daha karmaşık bir alıştırma ve çözüm tasarlama yeteneğinizi test eden bir probleme dayanıyor. Bu egzersize başlamadan önce bolca zaman ve ((sabır))ınız olduğundan emin olun ve ilk başarısızlıklardan cesaretinizi kırmayın.

{{index "draw function", "mousemove event", "touchmove event"}}

Çoğu tarayıcıda, `draw` ((tool)) seçildiğinde ve resmi hızlı bir şekilde sürüklediğinizde, kapalı bir çizgi elde etmezsiniz. Bunun yerine, aralarında boşluklar bulunan noktalar elde edersiniz çünkü `"mousemove"` veya `"touchmove"` olayları yeterince hızlı tetiklenmez ve tüm ((piksel))lere ulaşamaz.

`draw` aracını geliştirin, böylece tam bir çizgi çizecek şekilde çalışsın. Bu, hareket işleyici fonksiyonunun önceki pozisyonu hatırlaması ve mevcut pozisyonla birleştirmesi gerektiği anlamına gelir.

Bunu yapmak için, piksellerin arası mesafe çok farklı olabileceğinden, genel bir çizgi çizme fonksiyonu yazmanız gerekecek.

İki piksel arasındaki çizgi, mümkün olduğunca düz bir şekilde başlangıçtan sona kadar birleştirilen piksel zinciridir. Çapraz olarak komşu olan pikseller de birbirine bağlı kabul edilir. Bu nedenle eğik bir çizgi, soldaki resimdeki gibi görünmelidir; sağdaki gibi olmamalıdır.

{{figure {url: "img/line-grid.svg", alt: "İki piksel benzeri çizgi diyagramı: biri açık ve pikselatlar boyunca çapraz atlamalar yaparken, diğeri kalın ve yalnızca yatay veya dikey olarak tüm pikselleri birbirine bağlıyor.", width: "6cm"}}}

Son olarak, iki nokta arasında bir çizgi çizen bir kodumuz varsa, bunu aynı zamanda bir `line` aracı tanımlamak için kullanabiliriz. Bu araç, bir sürükleme işleminin başlangıç ve bitiş noktası arasında düz bir çizgi çizecek.

{{if interactive

```{test: no, lang: html}
<div></div>
<script>
  // The old draw tool. Rewrite this.
  function draw(pos, state, dispatch) {
    function drawPixel({x, y}, state) {
      let drawn = {x, y, color: state.color};
      dispatch({picture: state.picture.draw([drawn])});
    }
    drawPixel(pos, state);
    return drawPixel;
  }

  function line(pos, state, dispatch) {
    // Kodunuz buraya
  }

  let dom = startPixelEditor({
    tools: {draw, line, fill, rectangle, pick}
  });
  document.querySelector("div").appendChild(dom);
</script>
```

if}}

{{hint

{{index "proper lines (exercise)", "line drawing"}}

Pikselle çizgi çekme probleminin karmaşıklığı, aslında dört benzer fakat biraz farklı probleme dayanır. Soldan sağa doğru yatay bir çizgi çekmek kolaydır—x-koordinatları üzerinde bir döngü kurarak her adımda bir piksel renklendirirsiniz. Eğer çizgi hafif bir eğime sahipse (45 dereceden veya ¼π radyanından küçükse), eğim boyunca y-koordinatını içe aktarabilirsiniz. Bu durumda her _x_ pozisyonu için bir piksel gerekir ve bu piksellerin _y_ koordinatları eğime göre belirlenir.

Ancak eğim 45 dereceyi geçtiğinde, koordinat işleme şeklini değiştirmeniz gerekir. Artık dikey bir çizgi gibi çalışmalısınız; yani her _y_ pozisyonu için bir piksel renklendirmelisiniz çünkü çizgi yukarı doğru ilerliyor ve sola gitmiyor. Daha sonra 135 dereceyi geçtiğinizde, tekrar x-koordinatları üzerinde döngü kurmalısınız, fakat bu sefer sağdan sola doğru.

Aslında dört farklı döngü yazmak zorunda değilsiniz. Çünkü _A_ noktasından _B_ noktasına çizgi çekmek, aynı zamanda _B_ noktasından _A_ noktasına çizgi çekmekle aynıdır. Bu nedenle sağdan sola doğru çizgi çizerken başlangıç ve bitiş noktalarını değiştirebilirsiniz ve bunu sola doğru çizgi çekme olarak ele alabilirsiniz.

Bu durumda yalnızca iki farklı döngüye ihtiyacınız var. Çizgi çekme fonksiyonunuzun yapacağı ilk işlem, x-koordinatları arasındaki farkın y-koordinatları arasındaki farktan büyük olup olmadığını kontrol etmektir. Eğer büyükse bu yatay bir çizgi olur; aksi takdirde dikey bir çizgi olur.

{{index "Math.abs function", "absolute value"}}

_Öncelikle_, x ve y farklarının _mutlak değerlerini_ karşılaştırdığınızdan emin olun; bu işlemi `Math.abs` kullanarak elde edebilirsiniz.

{{index "swapping bindings"}}

((axis)) boyunca döngü kuracağınızı bildiğinizde, başlangıç noktasının bu eksen boyunca son noktadan daha yüksek bir koordinata sahip olup olmadığını kontrol edebilir ve gerekirse değerleri değiştirebilirsiniz. JavaScript'te iki değişkenin değerlerini değiştirmek için kısa bir yöntem ((destructuring assignment)) kullanmaktır:

```{test: no}
[start, end] = [end, start];
```

{{index rounding}}

Ardından, çizginin ((slope)) değerini hesaplayabilirsiniz. Bu, ana eksen boyunca her adım attığınızda diğer eksendeki koordinatın ne kadar değiştiğini belirler. Bu sayede, ana eksen boyunca bir döngü çalıştırabilir ve aynı zamanda diğer eksendeki karşılık gelen konumu takip edebilirsiniz. Her döngü adımında piksel çizebilirsiniz. Diğer eksendeki koordinatlar kesirli olabileceğinden, bunları yuvarladığınızdan emin olun çünkü `draw` metodu kesirli koordinatlarla iyi çalışmaz.

hint}}
