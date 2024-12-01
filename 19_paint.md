{{meta {load_files: ["code/chapter/19_paint.js"], zip: "html include=[\"css/paint.css\"]"}}}

# Proje: Bir Piksel Sanatı Editörü

{{quote {author: "Joan Miro", chapter: true}

Önümdeki birçok renge bakıyorum. Boş tuvalime bakıyorum. Sonra, renkleri, şiirleri şekillendiren kelimeler gibi, müziği şekillendiren notalar gibi uygulamaya çalışıyorum.

quote}}

{{index "Miro, Joan", "drawing program example", "project chapter"}}

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
  for (let done = 0; done < drawn.length; done++) {
    for (let {dx, dy} of around) {
      let x = drawn[done].x + dx, y = drawn[done].y + dy;
      if (x >= 0 && x < state.picture.width &&
          y >= 0 && y < state.picture.height &&
          state.picture.pixel(x, y) == targetColor &&
          !drawn.some(p => p.x == x && p.y == y)) {
        drawn.push({x, y, color: state.color});
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

When we've drawn our masterpiece, we'll want to save it for later. We should add a button for ((download))ing the current picture as an image file. This ((control)) provides that button:

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

The component keeps track of the current picture so that it can access it when saving. To create the image file, it uses a `<canvas>` element that it draws the picture on (at a scale of one pixel per pixel).

{{index "toDataURL method", "data URL"}}

The `toDataURL` method on a canvas element creates a URL that starts with `data:`. Unlike `http:` and `https:` URLs, data URLs contain the whole resource in the URL. They are usually very long, but they allow us to create working links to arbitrary pictures, right here in the browser.

{{index "a (HTML tag)", "download attribute"}}

To actually get the browser to download the picture, we then create a ((link)) element that points at this URL and has a `download` attribute. Such links, when clicked, make the browser show a file save dialog. We add that link to the document, simulate a click on it, and remove it again.

You can do a lot with ((browser)) technology, but sometimes the way to do it is rather odd.

{{index "LoadButton class", control, [file, image]}}

And it gets worse. We'll also want to be able to load existing image files into our application. To do that, we again define a button component.

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

To get access to a file on the user's computer, we need the user to select the file through a file input field. But I don't want the load button to look like a file input field, so we create the file input when the button is clicked and then pretend that this file input itself was clicked.

{{index "FileReader class", "img (HTML tag)", "readAsDataURL method", "Picture class"}}

When the user has selected a file, we can use `FileReader` to get access to its contents, again as a ((data URL)). That URL can be used to create an `<img>` element, but because we can't get direct access to the pixels in such an image, we can't create a `Picture` object from that.

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

To get access to the pixels, we must first draw the picture to a `<canvas>` element. The canvas context has a `getImageData` method that allows a script to read its ((pixel))s. So, once the picture is on the canvas, we can access it and construct a `Picture` object.

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

We'll limit the size of images to 100 by 100 pixels since anything bigger will look _huge_ on our display and might slow down the interface.

{{index "getImageData method", color, transparency}}

The `data` property of the object returned by `getImageData` is an array of color components. For each pixel in the rectangle specified by the arguments, it contains four values, which represent the red, green, blue, and _((alpha))_ components of the pixel's color, as numbers between 0 and 255. The alpha part represents opacity—when it is zero, the pixel is fully transparent, and when it is 255, it is fully opaque. For our purpose, we can ignore it.

{{index "hexadecimal number", "toString method"}}

The two hexadecimal digits per component, as used in our color notation, correspond precisely to the 0 to 255 range—two base-16 digits can express 16^2^ = 256 different numbers. The `toString` method of numbers can be given a base as argument, so `n.toString(16)` will produce a string representation in base 16. We have to make sure that each number takes up two digits, so the `hex` helper function calls `padStart` to add a leading zero when necessary.

We can load and save now! That leaves one more feature before we're done.

## Geçmişi geri alma

Half of the process of editing is making little mistakes and correcting them. So an important feature in a drawing program is an ((undo history)).

{{index "persistent data structure", [state, "of application"]}}

To be able to undo changes, we need to store previous versions of the picture. Since it's an ((immutable)) value, that is easy. But it does require an additional field in the application state.

{{index "done property"}}

We'll add a `done` array to keep previous versions of the ((picture)). Maintaining this property requires a more complicated state update function that adds pictures to the array.

{{index "doneAt property", "historyUpdateState function", "Date.now function"}}

But we don't want to store _every_ change, only changes a certain amount of ((time)) apart. To be able to do that, we'll need a second property, `doneAt`, tracking the time at which we last stored a picture in the history.

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

When the action is an undo action, the function takes the most recent picture from the history and makes that the current picture. It sets `doneAt` to zero so that the next change is guaranteed to store the picture back in the history, allowing you to revert to it another time if you want.

Otherwise, if the action contains a new picture and the last time we stored something is more than a second (1000 milliseconds) ago, the `done` and `doneAt` properties are updated to store the previous picture.

{{index "UndoButton class", control}}

The undo button ((component)) doesn't do much. It dispatches undo actions when clicked and disables itself when there is nothing to undo.

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

To set up the application, we need to create a state, a set of ((tool))s, a set of ((control))s, and a ((dispatch)) function. We can pass them to the `PixelEditor` constructor to create the main component. Since we'll need to create several editors in the exercises, we first define some bindings.

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

When destructuring an object or array, you can use `=` after a binding name to give the binding a ((default value)), which is used when the property is missing or holds `undefined`. The `startPixelEditor` function makes use of this to accept an object with a number of optional properties as an argument. If you don't provide a `tools` property, for example, `tools` will be bound to `baseTools`.

This is how we get an actual editor on the screen:

```{lang: html, startCode: true}
<div></div>
<script>
  document.querySelector("div")
    .appendChild(startPixelEditor({}));
</script>
```

{{if interactive

Go ahead and draw something.

if}}

## Neden bu kadar zor?

Browser technology is amazing. It provides a powerful set of interface building blocks, ways to style and manipulate them, and tools to inspect and debug your applications. The software you write for the ((browser)) can be run on almost every computer and phone on the planet.

At the same time, browser technology is ridiculous. You have to learn a large number of silly tricks and obscure facts to master it, and the default programming model it provides is so problematic that most programmers prefer to cover it in several layers of ((abstraction)) rather than deal with it directly.

{{index standard, evolution}}

And though the situation is definitely improving, it mostly does so in the form of more elements being added to address shortcomings—creating even more ((complexity)). A feature used by a million websites can't really be replaced. Even if it could, it would be hard to decide what it should be replaced with.

{{index "social factors", "economic factors", history}}

Technology never exists in a vacuum—we're constrained by our tools and the social, economic, and historical factors that produced them. This can be annoying, but it is generally more productive to try to build a good understanding of how the _existing_ technical reality works—and why it is the way it is—than to rage against it or hold out for another reality.

New ((abstraction))s _can_ be helpful. The component model and ((data flow)) convention I used in this chapter is a crude form of that. As mentioned, there are libraries that try to make user interface programming more pleasant. At the time of writing, [React](https://reactjs.org/) and [Svelte](https://svelte.dev/) are popular choices, but there's a whole cottage industry of such frameworks. If you're interested in programming web applications, I recommend investigating a few of them to understand how they work and what benefits they provide.

## Alıştırmalar

There is still room for improvement in our program. Let's add a few more features as exercises.

### Klavye kısayolları

{{index "keyboard bindings (exercise)"}}

Add ((keyboard)) shortcuts to the application. The first letter of a tool's name selects the tool, and [control]{keyname}-Z or [command]{keyname}-Z activates undo.

{{index "PixelEditor class", "tabindex attribute", "elt function", "keydown event"}}

Do this by modifying the `PixelEditor` component. Add a `tabIndex` property of 0 to the wrapping `<div>` element so that it can receive keyboard ((focus)). Note that the _property_ corresponding to the `tabindex` _attribute_ is called `tabIndex`, with a capital I, and our `elt` function expects property names. Register the key event handlers directly on that element. This means you have to click, touch, or tab to the application before you can interact with it with the keyboard.

{{index "ctrlKey property", "metaKey property", "control key", "command key"}}

Remember that keyboard events have `ctrlKey` and `metaKey` (for the [command]{keyname} key on Mac) properties that you can use to see whether those keys are held down.

{{if interactive

```{test: no, lang: html}
<div></div>
<script>
  // The original PixelEditor class. Extend the constructor.
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

The `key` property of events for letter keys will be the lowercase letter itself, if [shift]{keyname} isn't being held. We're not interested in key events with [shift]{keyname} here.

{{index "keydown event"}}

A `"keydown"` handler can inspect its event object to see whether it matches any of the shortcuts. You can automatically get the list of first letters from the `tools` object so that you don't have to write them out.

{{index "preventDefault method"}}

When the key event matches a shortcut, call `preventDefault` on it and ((dispatch)) the appropriate action.

hint}}

### Verimli çizim

{{index "efficient drawing (exercise)", "canvas (HTML tag)", efficiency}}

During drawing, the majority of work that our application does happens in `drawPicture`. Creating a new state and updating the rest of the DOM isn't very expensive, but repainting all the pixels on the canvas is quite a bit of work.

{{index "syncState method", "PictureCanvas class"}}

Find a way to make the `syncState` method of `PictureCanvas` faster by redrawing only the pixels that actually changed.

{{index "drawPicture function", compatibility}}

Remember that `drawPicture` is also used by the save button, so if you change it, either make sure the changes don't break the old use or create a new version with a different name.

{{index "width property", "height property"}}

Also note that changing the size of a `<canvas>` element, by setting its `width` or `height` properties, clears it, making it entirely transparent again.

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

This exercise is a good example of how ((immutable)) data structures can make code _faster_. Because we have both the old and the new picture, we can compare them and redraw only the pixels that changed color, saving more than 99 percent of the drawing work in most cases.

{{index "drawPicture function"}}

You can either write a new function `updatePicture` or have `drawPicture` take an extra argument, which may be undefined or the previous picture. For each ((pixel)), the function checks whether a previous picture was passed with the same color at this position and skips the pixel when that is the case.

{{index "width property", "height property", "canvas (HTML tag)"}}

Because the canvas gets cleared when we change its size, you should also avoid touching its `width` and `height` properties when the old picture and the new picture have the same size. If they are different, which will happen when a new picture has been loaded, you can set the binding holding the old picture to null after changing the canvas size because you shouldn't skip any pixels after you've changed the canvas size.

hint}}

### Daireler

{{index "circles (exercise)", dragging}}

Define a ((tool)) called `circle` that draws a filled circle when you drag. The center of the circle lies at the point where the drag or touch gesture starts, and its ((radius)) is determined by the distance dragged.

{{if interactive

```{test: no, lang: html}
<div></div>
<script>
  function circle(pos, state, dispatch) {
    // Your code here
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

You can take some inspiration from the `rectangle` tool. Like that tool, you'll want to keep drawing on the _starting_ picture, rather than the current picture, when the pointer moves.

To figure out which pixels to color, you can use the ((Pythagorean theorem)). First figure out the distance between the current pointer position and the start position by taking the square root (`Math.sqrt`) of the sum of the square (`Math.pow(x, 2)`) of the difference in x-coordinates and the square of the difference in y-coordinates. Then loop over a square of pixels around the start position, whose sides are at least twice the ((radius)), and color those that are within the circle's radius, again using the Pythagorean formula to figure out their ((distance)) from the center.

Make sure you don't try to color pixels that are outside of the picture's boundaries.

hint}}

### Doğru çizgiler

{{index "proper lines (exercise)", "line drawing"}}

This is a more advanced exercise than the preceding two, and it will require you to design a solution to a nontrivial problem. Make sure you have plenty of time and ((patience)) before starting to work on this exercise, and do not get discouraged by initial failures.

{{index "draw function", "mousemove event", "touchmove event"}}

On most browsers, when you select the `draw` ((tool)) and quickly drag across the picture, you don't get a closed line. Rather, you get dots with gaps between them because the `"mousemove"` or `"touchmove"` events did not fire quickly enough to hit every ((pixel)).

Improve the `draw` tool to make it draw a full line. This means you have to make the motion handler function remember the previous position and connect that to the current one.

To do this, since the pixels can be an arbitrary distance apart, you'll have to write a general line drawing function.

A line between two pixels is a connected chain of pixels, as straight as possible, going from the start to the end. Diagonally adjacent pixels count as connected. So a slanted line should look like the picture on the left, not the picture on the right.

{{figure {url: "img/line-grid.svg", alt: "Diagram of two pixelated lines, one light, skipping across pixels diagonally, and one heavy, with all pixels connected horizontally or vertically", width: "6cm"}}}

Finally, if we have code that draws a line between two arbitrary points, we might as well use it to also define a `line` tool, which draws a straight line between the start and end of a drag.

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
    // Your code here
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

The thing about the problem of drawing a pixelated line is that it is really four similar but slightly different problems. Drawing a horizontal line from the left to the right is easy—you loop over the x-coordinates and color a pixel at every step. If the line has a slight slope (less than 45 degrees or ¼π radians), you can interpolate the y-coordinate along the slope. You still need one pixel per _x_ position, with the _y_ position of those pixels determined by the slope.

But as soon as your slope goes across 45 degrees, you need to switch the way you treat the coordinates. You now need one pixel per _y_ position since the line goes up more than it goes left. And then, when you cross 135 degrees, you have to go back to looping over the x-coordinates, but from right to left.

You don't actually have to write four loops. Since drawing a line from _A_ to _B_ is the same as drawing a line from _B_ to _A_, you can swap the start and end positions for lines going from right to left and treat them as going left to right.

So you need two different loops. The first thing your line drawing function should do is check whether the difference between the x-coordinates is larger than the difference between the y-coordinates. If it is, this is a horizontal-ish line, and if not, a vertical-ish one.

{{index "Math.abs function", "absolute value"}}

Make sure you compare the _absolute_ values of the _x_ and _y_ difference, which you can get with `Math.abs`.

{{index "swapping bindings"}}

Once you know along which ((axis)) you will be looping, you can check whether the start point has a higher coordinate along that axis than the endpoint and swap them if necessary. A succinct way to swap the values of two bindings in JavaScript uses ((destructuring assignment)) like this:

```{test: no}
[start, end] = [end, start];
```

{{index rounding}}

Then you can compute the ((slope)) of the line, which determines the amount the coordinate on the other axis changes for each step you take along your main axis. With that, you can run a loop along the main axis while also tracking the corresponding position on the other axis, and you can draw pixels on every iteration. Make sure you round the non-main axis coordinates since they are likely to be fractional and the `draw` method doesn't respond well to fractional coordinates.

hint}}
