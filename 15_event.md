# Olayların Ele Alınması

{{quote {author: "Marcus Aurelius", title: Meditasyonlar, chapter: true}

Zihniniz üzerinde gücünüz var, dışarıdaki olaylar üzerinde değil. Bunun farkına varın ve güç bulacaksınız.

quote}}

{{index stoicism, "Marcus Aurelius", input, timeline}}

{{figure {url: "img/chapter_picture_15.jpg", alt: "Bir ampulü yakan zincirleme reaksiyonda birbirlerini etkileyen bir top, bir tahterevalli, bir makas ve bir çekiç içeren bir Rube Goldberg makinesini gösteren illüstrasyon.", chapter: "framed"}}}

Bazı programlar fare ve klavye eylemleri gibi doğrudan kullanıcı girdileriyle çalışır. Bu tür bir girdi, iyi organize edilmiş bir veri yapısı olarak önceden mevcut değildir; parça parça, gerçek zamanlı olarak gelir ve programın buna gerçekleştiği anda yanıt vermesi gerekir.

## Olay işleyicileri

{{index polling, button, "real-time"}}

((Klavye)) üzerindeki bir tuşa basılıp basılmadığını öğrenmenin tek yolunun o tuşun mevcut durumunu okumak olduğu bir arayüz hayal edin. Tuşa basıldığında tepki verebilmek için, tuşun durumunu sürekli olarak okumanız gerekir, böylece tekrar bırakılmadan önce yakalayabilirsiniz. Bir tuşa basmayı kaçırabileceğiniz için diğer zaman yoğun hesaplamaları yapmak tehlikeli olacaktır.

Bazı ilkel makineler girişi bu şekilde ele alır. Bunun bir adım ötesi, donanımın ya da işletim sisteminin tuşa basıldığını fark etmesi ve bunu bir kuyruğa koymasıdır. Bir program daha sonra yeni olaylar için kuyruğu periyodik olarak kontrol edebilir ve orada bulduklarına tepki verebilir.

{{index responsiveness, "user experience"}}

Elbette kuyruğa bakmayı ve bunu sık sık yapmayı hatırlaması gerekir, çünkü tuşa basılmasıyla programın olayı fark etmesi arasında geçen herhangi bir süre yazılımın tepkisiz kalmasına neden olacaktır. Bu yaklaşıma _((polling))_ denir. Çoğu programcı bundan kaçınmayı tercih eder.

{{index "callback function", "event handling"}}

Daha iyi bir mekanizma, bir olay meydana geldiğinde sistemin kodumuzu aktif olarak bilgilendirmesidir. Tarayıcılar bunu, belirli olaylar için işlevleri _handlers_ olarak kaydetmemize izin vererek yapar.

```{lang: html}
<p>Click this document to activate the handler.</p>
<script>
  window.addEventListener("click", () => {
    console.log("You knocked?");
  });
</script>
```

{{index "click event", "addEventListener method", "window object", [browser, window]}}

`window` bağlayıcısı, tarayıcı tarafından sağlanan yerleşik bir nesneyi ifade eder. Belgeyi içeren tarayıcı penceresini temsil eder. addEventListener` yöntemi çağrıldığında, ilk bağımsız değişken tarafından tanımlanan olay gerçekleştiğinde çağrılmak üzere ikinci bağımsız değişken kaydedilir.

## Olaylar ve DOM düğümleri

{{index "addEventListener method", "event handling", "window object", browser, [DOM, events]}}

Her tarayıcı olay işleyicisi bir bağlama kaydedilir. Önceki örnekte, tüm pencere için bir işleyici kaydetmek üzere `window` nesnesi üzerinde `addEventListener` yöntemini çağırdık. Böyle bir yöntem DOM öğelerinde ve diğer bazı nesne türlerinde de bulunabilir. Olay dinleyicileri yalnızca kaydedildikleri nesnenin bağlamında olay gerçekleştiğinde çağrılır.

```{lang: html}
<button>Click me</button>
<p>No handler here.</p>
<script>
  let button = document.querySelector("button");
  button.addEventListener("click", () => {
    console.log("Button clicked.");
  });
</script>
```

{{index "click event", "button (HTML tag)"}}

Bu örnek, düğme düğümüne bir işleyici ekler. Düğmeye tıklandığında bu işleyici çalışır, ancak belgenin geri kalanına tıklandığında işleyici çalışmaz.

{{index "onclick attribute", encapsulation}}

Bir düğüme `onclick` niteliği vermek de benzer bir etkiye sahiptir. Bu, çoğu olay türü için işe yarar; adı olay adı olan ve önünde `on` bulunan öznitelik aracılığıyla bir işleyici ekleyebilirsiniz.

Ancak bir düğümün yalnızca bir `onclick` niteliği olabilir, bu nedenle bu şekilde düğüm başına yalnızca bir işleyici kaydedebilirsiniz. addEventListener` yöntemi, istediğiniz sayıda işleyici eklemenize olanak tanır, böylece öğe üzerinde zaten başka bir işleyici olsa bile işleyici eklemek güvenlidir.

{{index "removeEventListener method"}}

`addEventListener` yöntemine benzer argümanlarla çağrılan `removeEventListener` yöntemi bir işleyiciyi kaldırır.

```{lang: html}
<button>Act-once button</button>
<script>
  let button = document.querySelector("button");
  function once() {
    console.log("Done.");
    button.removeEventListener("click", once);
  }
  button.addEventListener("click", once);
</script>
```

{{index [function, "as value"]}}

`removeEventListener` metoduna verilen fonksiyon, `addEventListener` metoduna verilen fonksiyon değeri ile aynı olmalıdır. Bu nedenle, bir işleyicinin kaydını kaldırmak için, her iki yönteme de aynı işlev değerini aktarabilmek için işleve bir ad (örnekte `once`) vermek isteyeceksiniz.

## Olay nesneleri

{{index "button property", "event handling"}}

Şimdiye kadar göz ardı etmiş olsak da, olay işleyici işlevlerine bir argüman aktarılır: _((olay nesnesi))_. Bu nesne olay hakkında ek bilgiler tutar. Örneğin, _hangi_ ((fare düğmesine)) basıldığını bilmek istiyorsak, olay nesnesinin `button` özelliğine bakabiliriz.

```{lang: html}
<button>Click me any way you want</button>
<script>
  let button = document.querySelector("button");
  button.addEventListener("mousedown", event => {
    if (event.button == 0) {
      console.log("Left button");
    } else if (event.button == 1) {
      console.log("Middle button");
    } else if (event.button == 2) {
      console.log("Right button");
    }
  });
</script>
```

{{index "event type", "type property"}}

Bir olay nesnesinde saklanan bilgiler olay türüne göre farklılık gösterir. Bölümün ilerleyen kısımlarında farklı türleri tartışacağız. Nesnenin `type` özelliği her zaman olayı tanımlayan bir dize tutar (örneğin `“click”` veya `“mousedown”`).

## Yayılma

{{index "event propagation", "parent node"}}

{{indexsee bubbling, "event propagation"}}

{{indexsee propagation, "event propagation"}}

Çoğu olay türü için, çocukları olan düğümlerde kayıtlı işleyiciler, çocuklarda meydana gelen olayları da alır. Bir paragrafın içindeki bir düğmeye tıklanırsa, paragraftaki olay işleyicileri de tıklama olayını görür.

{{index "event handling"}}

Ancak hem paragrafın hem de düğmenin bir işleyicisi varsa, daha spesifik olan işleyici - düğmedeki - önce gider. Olayın gerçekleştiği düğümden o düğümün üst düğümüne ve belgenin köküne doğru _propagate_ ettiği söylenir. Son olarak, belirli bir düğüm üzerinde kayıtlı tüm işleyiciler sıralarını aldıktan sonra, tüm ((pencere)) üzerinde kayıtlı işleyiciler olaya yanıt verme şansına sahip olur.

{{index "stopPropagation method", "click event"}}

Herhangi bir noktada, bir olay işleyici olay nesnesi üzerinde `stopPropagation` yöntemini çağırarak daha yukarıdaki işleyicilerin olayı almasını engelleyebilir. Bu, örneğin, başka bir tıklanabilir öğenin içinde bir düğmeniz olduğunda ve düğmeye tıklandığında dış öğenin tıklama davranışının etkinleştirilmesini istemediğinizde yararlı olabilir.

{{index "mousedown event", "pointer event"}}

Aşağıdaki örnek, hem bir düğme hem de etrafındaki paragraf üzerinde `“mousedown”` işleyicilerini kaydeder. Farenin sağ tuşuyla tıklandığında, düğmenin işleyicisi `stopPropagation` öğesini çağırır ve bu da paragraftaki işleyicinin çalışmasını engeller. Düğmeye başka bir ((fare düğmesi)) ile tıklandığında, her iki işleyici de çalışacaktır.

```{lang: html}
<p>A paragraph with a <button>button</button>.</p>
<script>
  let para = document.querySelector("p");
  let button = document.querySelector("button");
  para.addEventListener("mousedown", () => {
    console.log("Handler for paragraph.");
  });
  button.addEventListener("mousedown", event => {
    console.log("Handler for button.");
    if (event.button == 2) event.stopPropagation();
  });
</script>
```

{{index "event propagation", "target property"}}

Çoğu olay nesnesi, kaynaklandıkları düğümü ifade eden bir `target` özelliğine sahiptir. Bu özelliği, işlemek istemediğiniz bir düğümden yayılan bir şeyi yanlışlıkla işlemediğinizden emin olmak için kullanabilirsiniz.

Belirli bir olay türü için geniş bir ağ oluşturmak amacıyla `target` özelliğini kullanmak da mümkündür. Örneğin, uzun bir düğme listesi içeren bir düğümünüz varsa, tüm düğmelere ayrı ayrı işleyiciler kaydetmek yerine, dış düğümde tek bir tıklama işleyicisi kaydetmek ve bir düğmenin tıklanıp tıklanmadığını anlamak için `target` özelliğini kullanmasını sağlamak daha uygun olabilir.

```{lang: html}
<button>A</button>
<button>B</button>
<button>C</button>
<script>
  document.body.addEventListener("click", event => {
    if (event.target.nodeName == "BUTTON") {
      console.log("Clicked", event.target.textContent);
    }
  });
</script>
```

## Varsayılan eylemler

{{index scrolling, "default behavior", "event handling"}}

Birçok olayın kendileriyle ilişkili varsayılan bir eylemi vardır. Eğer bir ((link))'e tıklarsanız, linkin hedefine yönlendirilirsiniz. Aşağı oka basarsanız, tarayıcı sayfayı aşağı kaydırır. Sağ tıklarsanız, bir içerik menüsü alırsınız. Ve bu böyle devam eder.

{{index "preventDefault method"}}

Çoğu olay türü için JavaScript olay işleyicileri varsayılan davranış gerçekleşmeden _önce_ çağrılır. İşleyici bu normal davranışın gerçekleşmesini istemiyorsa, genellikle olayı zaten ele aldığı için, olay nesnesi üzerinde `preventDefault` yöntemini çağırabilir.

{{index expectation}}

Bu, kendi ((klavye)) kısayollarınızı veya ((içerik menüsü)) uygulamak için kullanılabilir. Ayrıca kullanıcıların beklediği davranışa iğrenç bir şekilde müdahale etmek için de kullanılabilir. Örneğin, burada takip edilemeyen bir bağlantı var:

```{lang: html}
<a href="https://developer.mozilla.org/">MDN</a>
<script>
  let link = document.querySelector("a");
  link.addEventListener("click", event => {
    console.log("Nope.");
    event.preventDefault();
  });
</script>
```

{{index usability}}

Gerçekten iyi bir nedeniniz olmadıkça böyle şeyler yapmamaya çalışın. Beklenen davranış bozulduğunda sayfanızı kullanan kişiler için hoş olmayacaktır.

Tarayıcıya bağlı olarak, bazı olaylar hiç yakalanamaz. Örneğin Chrome'da, geçerli sekmeyi kapatmak için kullanılan ((klavye)) kısayolu ([control]{keyname}-W veya [command]{keyname}-W) JavaScript tarafından işlenemez.

## Tuş olayları

{{index keyboard, "keydown event", "keyup event", "event handling"}}

Klavyedeki bir tuşa basıldığında, tarayıcınız bir `“keydown”` olayı başlatır. Bırakıldığında, bir `“keyup”` olayı alırsınız.

```{lang: html, focus: true}
<p>This page turns violet when you hold the V key.</p>
<script>
  window.addEventListener("keydown", event => {
    if (event.key == "v") {
      document.body.style.background = "violet";
    }
  });
  window.addEventListener("keyup", event => {
    if (event.key == "v") {
      document.body.style.background = "";
    }
  });
</script>
```

{{index "repeating key"}}

Adına rağmen, `“keydown”` sadece tuş fiziksel olarak aşağı itildiğinde ateşlenmez. Bir tuşa basıldığında ve basılı tutulduğunda, tuş her _tekrar_ ettiğinde olay tekrar ateşlenir. Bazen bu konuda dikkatli olmanız gerekir. Örneğin, bir tuşa basıldığında DOM'a bir düğme eklerseniz ve tuş bırakıldığında tekrar kaldırırsanız, tuş daha uzun süre basılı tutulduğunda yanlışlıkla yüzlerce düğme ekleyebilirsiniz.

{{index "key property"}}

Örnekte, olayın hangi tuşla ilgili olduğunu görmek için olay nesnesinin `key` özelliğine bakılmıştır. Bu özellik, çoğu tuş için o tuşa basıldığında yazılacak şeye karşılık gelen bir dize tutar. [enter]{keyname} gibi özel tuşlar için, tuşu adlandıran bir dize tutar (bu durumda `“Enter”`). Bir tuşa basarken [shift]{keyname} tuşunu basılı tutarsanız, bu tuşun adını da etkileyebilir - `“v”` `“V”` olur ve `“1”` `“!”` olabilir, eğer [shift]{keyname}-1 tuşuna basmak klavyenizde bunu üretiyorsa.

{{index "modifier key", "shift key", "control key", "alt key", "meta key", "command key", "ctrlKey property", "shiftKey property", "altKey property", "metaKey property"}}

[shift]{keyname}, [control]{keyname}, [alt]{keyname} ve [meta]{keyname} ([command]{keyname} Mac'te) gibi değiştirici tuşlar, tıpkı normal tuşlar gibi tuş olayları oluşturur. Ancak tuş kombinasyonlarını ararken, klavye ve fare olaylarının `shiftKey`, `ctrlKey`, `altKey` ve `metaKey` özelliklerine bakarak bu tuşların basılı tutulup tutulmadığını da öğrenebilirsiniz.

```{lang: html, focus: true}
<p>Press Control-Space to continue.</p>
<script>
  window.addEventListener("keydown", event => {
    if (event.key == " " && event.ctrlKey) {
      console.log("Continuing!");
    }
  });
</script>
```

{{index "button (HTML tag)", "tabindex attribute", [DOM, events]}}

Bir tuş olayının kaynaklandığı DOM düğümü, tuşa basıldığında ((focus)) olan öğeye bağlıdır. Çoğu düğüm `tabindex` niteliği verilmediği sürece odağa sahip olamaz, ancak ((link))ler, düğmeler ve form alanları gibi şeyler olabilir. Form ((alan))larına [Bölüm ?](http#forms) içinde geri döneceğiz. Belirli bir şey odağa sahip olmadığında, `document.body` anahtar olayların hedef düğümü olarak hareket eder.

Kullanıcı metin yazarken, ne yazıldığını anlamak için tuş olaylarını kullanmak sorunludur. Bazı platformlar, özellikle de ((Android)) ((telefon))lardaki ((sanal klavye)), tuş olaylarını ateşlemez. Ancak eski moda bir klavyeniz olduğunda bile, bazı metin girişi türleri, komut dosyaları klavyeye sığmayan kişiler tarafından kullanılan _input method editor_ (((IME))) yazılımı gibi, karakterleri oluşturmak için birden fazla tuş vuruşunun birleştirildiği tuş basışlarıyla doğrudan eşleşmez.

Bir şeyin ne zaman yazıldığını fark etmek için, `<input>` ve `<textarea>` etiketleri gibi içine yazabileceğiniz öğeler, kullanıcı içeriğini değiştirdiğinde `“input”` olaylarını tetikler. Yazılan gerçek içeriği almak için, en iyisi bunu doğrudan odaklanılan alandan okumaktır. [Bölüm ?](http#forms) nasıl yapılacağını gösterecektir.

## İşaret etme olayları

Şu anda ekranda bir şeyleri işaret etmenin yaygın olarak kullanılan iki yolu vardır: fareler (dokunmatik yüzeyler ve iztopları gibi fare gibi davranan cihazlar dahil) ve dokunmatik ekranlar. Bunlar farklı türde olaylar üretir.

### Mouse tıklamaları

{{index "mousedown event", "mouseup event", "mouse cursor"}}

Bir ((fare düğmesine)) basmak bir dizi olayın tetiklenmesine neden olur. `“mousedown"` ve `‘mouseup’` olayları, `‘keydown’` ve `‘keyup’` olaylarına benzer ve düğmeye basılıp bırakıldığında gerçekleşir. Bunlar, olay gerçekleştiğinde fare işaretçisinin hemen altında bulunan DOM düğümlerinde gerçekleşir.

{{index "click event"}}

`“mouseup“` olayından sonra, düğmeye hem basılmasını hem de bırakılmasını içeren en belirli düğümde bir `”click"` olayı gerçekleşir. Örneğin, bir paragrafta fare düğmesine basarsam ve ardından işaretçiyi başka bir paragrafa taşıyıp düğmeyi bırakırsam, `“click”` olayı her iki paragrafı da içeren öğede gerçekleşir.

{{index "dblclick event", "double click"}}

İki tıklama birbirine yakın gerçekleşirse, ikinci tıklama olayından sonra bir `“dblclick”` (çift tıklama) olayı da ateşlenir.

{{index pixel, "clientX property", "clientY property", "pageX property", "pageY property", "event object"}}

Bir fare olayının gerçekleştiği yer hakkında kesin bilgi almak için, olayın pencerenin sol üst köşesine göre ((koordinatlarını)) (piksel cinsinden) içeren `clientX` ve `clientY` özelliklerine veya tüm belgenin sol üst köşesine göre olan `pageX` ve `pageY` özelliklerine bakabilirsiniz (pencere kaydırıldığında farklı olabilir).

{{index "border-radius (CSS)", "absolute positioning", "drawing program example"}}

{{id mouse_drawing}}

Aşağıda ilkel bir çizim programı uygulanmaktadır. Belgeye her tıkladığınızda, fare işaretçinizin altına bir nokta ekler. Daha az ilkel bir çizim programı için [bölüm ?](paint) içine bakın.

```{lang: html}
<style>
  body {
    height: 200px;
    background: beige;
  }
  .dot {
    height: 8px; width: 8px;
    border-radius: 4px; /* rounds corners */
    background: teal;
    position: absolute;
  }
</style>
<script>
  window.addEventListener("click", event => {
    let dot = document.createElement("div");
    dot.className = "dot";
    dot.style.left = (event.pageX - 4) + "px";
    dot.style.top = (event.pageY - 4) + "px";
    document.body.appendChild(dot);
  });
</script>
```

### Mouse hareketi

{{index "mousemove event"}}

Fare işaretçisi her hareket ettiğinde, bir `“mousemove”` olayı ateşlenir. Bu olay, farenin konumunu izlemek için kullanılabilir. Bunun yararlı olduğu yaygın bir durum, bir tür fare-((sürükleme)) işlevselliğinin uygulanmasıdır.

{{index "draggable bar example"}}

Örnek olarak, aşağıdaki program bir çubuk görüntüler ve bu çubuk üzerinde sola veya sağa sürüklemenin çubuğu daraltması veya genişletmesi için olay işleyicileri ayarlar:

```{lang: html, startCode: true}
<p>Drag the bar to change its width:</p>
<div style="background: orange; width: 60px; height: 20px">
</div>
<script>
  let lastX; // Tracks the last observed mouse X position
  let bar = document.querySelector("div");
  bar.addEventListener("mousedown", event => {
    if (event.button == 0) {
      lastX = event.clientX;
      window.addEventListener("mousemove", moved);
      event.preventDefault(); // Prevent selection
    }
  });

  function moved(event) {
    if (event.buttons == 0) {
      window.removeEventListener("mousemove", moved);
    } else {
      let dist = event.clientX - lastX;
      let newWidth = Math.max(10, bar.offsetWidth + dist);
      bar.style.width = newWidth + "px";
      lastX = event.clientX;
    }
  }
</script>
```

{{if book

Ortaya çıkan sayfa şu şekilde görünür:

{{figure {url: "img/drag-bar.png", alt: "Sürüklenebilir çubuk resmi", width: "5.3cm"}}}

if}}

{{index "mouseup event", "mousemove event"}}

`“mousemove"` işleyicisinin tüm ((pencere)) üzerinde kayıtlı olduğuna dikkat edin. Yeniden boyutlandırma sırasında fare çubuğun dışına çıksa bile, düğme basılı tutulduğu sürece boyutunu güncellemek isteriz.

{{index "buttons property", "button property", "bitfield"}}

Fare düğmesi bırakıldığında çubuğun yeniden boyutlandırılmasını durdurmalıyız. Bunun için, bize o anda basılı tutulan düğmeler hakkında bilgi veren `buttons` özelliğini (çoğul olduğuna dikkat edin) kullanabiliriz. Bu değer sıfır olduğunda, hiçbir düğme basılı değildir. Düğmeler basılı tutulduğunda, değeri bu düğmelerin kodlarının toplamıdır - sol düğme 1, sağ düğme 2 ve ortadaki düğme 4 koduna sahiptir. Örneğin sol ve sağ düğmeler basılı tutulduğunda `buttons` değeri 3 olacaktır.

Bu kodların sırasının, ortadaki düğmenin sağdakinden önce geldiği `button` tarafından kullanılandan farklı olduğuna dikkat edin. Belirtildiği gibi, tutarlılık tarayıcının programlama arayüzünün güçlü bir noktası değildir.

### Dokunma olayları

{{index touch, "mousedown event", "mouseup event", "click event"}}

Kullandığımız grafik tarayıcı tarzı, dokunmatik ekranların nadir olduğu bir dönemde fare arayüzleri düşünülerek tasarlanmıştır. Web'in ilk dokunmatik ekranlı telefonlarda “çalışmasını” sağlamak için, bu cihazlara yönelik tarayıcılar bir dereceye kadar dokunma olaylarının fare olayları olduğunu varsaymıştır. Ekranınıza dokunursanız, `“mousedown”`, `“mouseup”` ve `“click”` olaylarını alırsınız.

Ancak bu yanılsama çok sağlam değildir. Dokunmatik ekran fareden farklı çalışır: birden fazla düğmesi yoktur, ekranda değilken parmağınızı takip edemezsiniz (“mousemove”`ı simüle etmek için) ve aynı anda birden fazla parmağın ekranda olmasına izin verir.

Fare olayları yalnızca basit durumlarda dokunmatik etkileşimi kapsar - bir düğmeye `“click”` işleyicisi eklerseniz, dokunmatik kullanıcılar bunu kullanmaya devam edebilir. Ancak önceki örnekteki yeniden boyutlandırılabilir çubuk gibi bir şey dokunmatik ekranda çalışmaz.

{{index "touchstart event", "touchmove event", "touchend event"}}

Dokunma etkileşimi tarafından ateşlenen belirli olay türleri vardır. Bir parmak ekrana dokunmaya başladığında, bir `“touchstart”` olayı elde edersiniz. Dokunurken hareket ettirildiğinde, `“touchmove”` olayları ateşlenir. Son olarak, ekrana dokunmayı bıraktığında, bir `“touchend”` olayı görürsünüz.

{{index "touches property", "clientX property", "clientY property", "pageX property", "pageY property"}}

Birçok dokunmatik ekran aynı anda birden fazla parmağı algılayabildiğinden, bu olayların kendileriyle ilişkili tek bir koordinat kümesi yoktur. Bunun yerine, ((olay nesnesi)), her biri kendi `clientX`, `clientY`, `pageX` ve `pageY` özelliklerine sahip olan bir ((dizi benzeri nesne)) nokta tutan bir `touches` özelliğine sahiptir.

Dokunan her parmağın etrafında kırmızı daireler göstermek için böyle bir şey yapabilirsiniz:

```{lang: html}
<style>
  dot { position: absolute; display: block;
        border: 2px solid red; border-radius: 50px;
        height: 100px; width: 100px; }
</style>
<p>Touch this page</p>
<script>
  function update(event) {
    for (let dot; dot = document.querySelector("dot");) {
      dot.remove();
    }
    for (let i = 0; i < event.touches.length; i++) {
      let {pageX, pageY} = event.touches[i];
      let dot = document.createElement("dot");
      dot.style.left = (pageX - 50) + "px";
      dot.style.top = (pageY - 50) + "px";
      document.body.appendChild(dot);
    }
  }
  window.addEventListener("touchstart", update);
  window.addEventListener("touchmove", update);
  window.addEventListener("touchend", update);
</script>
```

{{index "preventDefault method"}}

Tarayıcının varsayılan davranışını (kaydırma sırasında sayfanın kaydırılmasını içerebilir) geçersiz kılmak ve _ayrıca_ bir işleyiciye sahip olabileceğiniz fare olaylarının tetiklenmesini önlemek için genellikle dokunma olayı işleyicilerinde `preventDefault'u çağırmak isteyeceksiniz.

## Kaydırma etkinlikleri

{{index scrolling, "scroll event", "event handling"}}

Bir öğe kaydırıldığında, üzerinde bir `“scroll”` olayı tetiklenir. Bunun, kullanıcının o anda neye baktığını bilmek (ekran dışı ((animasyon))ları devre dışı bırakmak veya şeytani karargahınıza ((casus)) raporları göndermek için) veya bazı ilerleme göstergelerini göstermek (içindekiler tablosunun bir kısmını vurgulayarak veya bir sayfa numarası göstererek) gibi çeşitli kullanımları vardır.

Aşağıdaki örnek, belgenin üzerine bir ((ilerleme çubuğu)) çizer ve siz aşağı kaydırdıkça dolacak şekilde günceller:

```{lang: html}
<style>
  #progress {
    border-bottom: 2px solid blue;
    width: 0;
    position: fixed;
    top: 0; left: 0;
  }
</style>
<div id="progress"></div>
<script>
  // Create some content
  document.body.appendChild(document.createTextNode(
    "supercalifragilisticexpialidocious ".repeat(1000)));

  let bar = document.querySelector("#progress");
  window.addEventListener("scroll", () => {
    let max = document.body.scrollHeight - innerHeight;
    bar.style.width = `${(pageYOffset / max) * 100}%`;
  });
</script>
```

{{index "unit (CSS)", scrolling, "position (CSS)", "fixed positioning", "absolute positioning", percentage, "repeat method"}}

Bir öğeye `fixed` bir `position` vermek, `absolute` bir konum gibi davranır, ancak aynı zamanda belgenin geri kalanıyla birlikte kaymasını da önler. Bunun etkisi, ilerleme çubuğumuzun en üstte kalmasını sağlamaktır. Genişliği mevcut ilerlemeyi gösterecek şekilde değiştirilir. Genişliği ayarlarken birim olarak `px` yerine `%` kullanırız, böylece öğe sayfa genişliğine göre boyutlandırılır.

{{index "innerHeight property", "innerWidth property", "pageYOffset property"}}

Global `innerHeight` bağlayıcısı bize pencerenin yüksekliğini verir, bunu toplam kaydırılabilir yükseklikten çıkarmamız gerekir-belgenin altına ulaştığınızda kaydırmaya devam edemezsiniz. Pencere genişliği için de bir `innerWidth` vardır. Geçerli kaydırma konumu olan `pageYOffset`i maksimum kaydırma konumuna bölerek ve 100 ile çarparak ilerleme çubuğunun yüzdesini elde ederiz.

{{index "preventDefault method"}}

Bir kaydırma olayında `preventDefault` çağrısı yapmak kaydırmanın gerçekleşmesini engellemez. Aslında, olay işleyici yalnızca kaydırma gerçekleştikten _sonra_ çağrılır.

## Odak etkinlikleri

{{index "event handling", "focus event", "blur event"}}

Bir öğe ((odak)) kazandığında, tarayıcı üzerinde bir `“focus”` olayı ateşler. Odağı kaybettiğinde, öğe bir `“blur”` olayı alır.

{{index "event propagation"}}

Daha önce tartışılan olayların aksine, bu iki olay yayılmaz. Bir üst öğedeki işleyici, bir alt öğe odak kazandığında veya kaybettiğinde bilgilendirilmez.

{{index "input (HTML tag)", "help text example"}}

Aşağıdaki örnek, o anda odağa sahip olan ((metin alanı)) için yardım metnini görüntüler:

```{lang: html}
<p>Name: <input type="text" data-help="Your full name"></p>
<p>Age: <input type="text" data-help="Your age in years"></p>
<p id="help"></p>

<script>
  let help = document.querySelector("#help");
  let fields = document.querySelectorAll("input");
  for (let field of Array.from(fields)) {
    field.addEventListener("focus", event => {
      let text = event.target.getAttribute("data-help");
      help.textContent = text;
    });
    field.addEventListener("blur", event => {
      help.textContent = "";
    });
  }
</script>
```

{{if book

Bu ekran görüntüsü yaş alanı için yardım metnini göstermektedir.

{{figure {url: "img/help-field.png", alt: "Yaş alanının altındaki yardım metninin ekran görüntüsü", width: "4.4cm"}}}

if}}

{{index "focus event", "blur event"}}

((`window`)) nesnesi, kullanıcı belgenin gösterildiği tarayıcı sekmesinden veya penceresinden hareket ettiğinde `“focus”` ve `“blur”` olaylarını alacaktır.

## Yükleme olayı

{{index "script (HTML tag)", "load event"}}

Bir sayfa yüklenmeyi bitirdiğinde, `“load”` olayı pencere ve belge gövdesi nesneleri üzerinde ateşlenir. Bu genellikle tüm ((belgenin)) oluşturulmasını gerektiren ((başlatma)) eylemlerini zamanlamak için kullanılır. `<script>` etiketlerinin içeriğinin, etiketle karşılaşıldığında hemen çalıştırıldığını unutmayın. Bu, örneğin komut dosyasının belgenin `<script>` etiketinden sonra görünen bölümleriyle bir şeyler yapması gerektiğinde çok erken olabilir.

{{index "event propagation", "img (HTML tag)"}}

Harici bir dosya yükleyen ((görüntü))ler ve script etiketleri gibi öğeler de referans verdikleri dosyaların yüklendiğini gösteren bir `“load”` olayına sahiptir. Odakla ilgili olaylar gibi, yükleme olayları da yayılmaz.

{{index "beforeunload event", "page reload", "preventDefault method"}}

Bir sayfa kapatıldığında veya sayfadan uzaklaşıldığında (örneğin, bir bağlantı takip edilerek), bir `“beforeunload”` olayı ateşlenir. Bu olayın ana kullanımı, kullanıcının bir belgeyi kapatarak yanlışlıkla işini kaybetmesini önlemektir. Bu olayda varsayılan davranışı engellerseniz _ve_ olay nesnesindeki `returnValue` özelliğini bir dizeye ayarlarsanız, tarayıcı kullanıcıya sayfadan gerçekten ayrılmak isteyip istemediğini soran bir iletişim kutusu gösterecektir. Bu iletişim kutusu sizin dizenizi içerebilir, ancak bazı kötü niyetli siteler bu iletişim kutularını kullanarak insanların kafasını karıştırıp sayfalarında kalmalarını ve tehlikeli zayıflama reklamlarına bakmalarını sağlamaya çalıştığından, çoğu tarayıcı artık bunları göstermemektedir.

{{id timeline}}

## Olaylar ve olay döngüsü

{{index "requestAnimationFrame function", "event handling", timeline, "script (HTML tag)"}}

[Bölüm ?](async) içinde tartışıldığı gibi olay döngüsü bağlamında, tarayıcı olay işleyicileri diğer asenkron bildirimler gibi davranır. Olay meydana geldiğinde zamanlanırlar, ancak çalışma şansı bulmadan önce çalışan diğer komut dosyalarının bitmesini beklemeleri gerekir.

Olayların yalnızca başka hiçbir şey çalışmıyorken işlenebilmesi gerçeği, olay döngüsünün başka işlerle meşgul olması durumunda, sayfayla (olaylar aracılığıyla gerçekleşen) her türlü etkileşimin işlenecek zaman bulunana kadar erteleneceği anlamına gelir. Dolayısıyla, uzun süre çalışan olay işleyicileriyle ya da çok sayıda kısa süre çalışan olay işleyicileriyle çok fazla iş planlarsanız, sayfa yavaşlayacak ve kullanımı hantal hale gelecektir.

Sayfayı dondurmadan arka planda zaman alıcı bir şey yapmak istediğiniz durumlar için tarayıcılar _((web worker))s_ adı verilen bir şey sağlar. Çalışan, ana komut dosyasının yanında, kendi zaman çizelgesinde çalışan bir JavaScript işlemidir.

Bir sayının karesini almanın, ayrı bir ((thread)) içinde gerçekleştirmek istediğimiz ağır ve uzun süren bir hesaplama olduğunu düşünün. Bir kare hesaplayarak ve geri bir mesaj göndererek mesajlara yanıt veren `code/squareworker.js` adlı bir dosya yazabiliriz.

```
addEventListener("message", event => {
  postMessage(event.data * event.data);
});
```

Aynı veriye dokunan birden fazla ((iş parçacığı)) olmasından kaynaklanan sorunlardan kaçınmak için, işçiler ((global kapsam)) veya başka herhangi bir veriyi ana kodun ortamıyla paylaşmazlar. Bunun yerine, ileri geri mesajlar göndererek onlarla iletişim kurmanız gerekir.

Bu kod, söz konusu betiği çalıştıran bir işçiyi ortaya çıkarır, ona birkaç mesaj gönderir ve yanıtları çıktı olarak verir.

```{test: no}
let squareWorker = new Worker("code/squareworker.js");
squareWorker.addEventListener("message", event => {
  console.log("The worker responded:", event.data);
});
squareWorker.postMessage(10);
squareWorker.postMessage(24);
```

{{index "postMessage method", "message event"}}

`postMessage` fonksiyonu, alıcıda bir `“message”` olayının tetiklenmesine neden olacak bir mesaj gönderir. Çalışanı oluşturan kod `Worker` nesnesi aracılığıyla mesaj gönderir ve alır, çalışan ise doğrudan ((global kapsam)) göndererek ve dinleyerek kendisini oluşturan kodla konuşur. Yalnızca JSON olarak temsil edilebilen değerler mesaj olarak gönderilebilir; karşı taraf değerin kendisi yerine bir _kopyasını_ alır.

## Zamanlayıcılar

{{index timeout, "setTimeout function", "clearTimeout function"}}

`setTimeout` fonksiyonunu [bölüm ?](async) içinde gördük. Belirli bir milisaniye sayısından sonra başka bir fonksiyonun çağrılmasını planlar.

{{index "clearTimeout function"}}

Bazen zamanladığınız bir işlevi iptal etmeniz gerekir. Bu, `setTimeout` tarafından döndürülen değeri saklayarak ve üzerinde `clearTimeout` çağrısı yaparak yapılır.

```
let bombTimer = setTimeout(() => {
  console.log("BOOM!");
}, 500);

if (Math.random() < 0.5) { // 50% chance
  console.log("Defused.");
  clearTimeout(bombTimer);
}
```

{{index "cancelAnimationFrame function", "requestAnimationFrame function"}}

`cancelAnimationFrame` fonksiyonu `clearTimeout` ile aynı şekilde çalışır - `requestAnimationFrame` tarafından döndürülen bir değer üzerinde çağrılması o kareyi iptal eder (daha önce çağrılmadığını varsayarak).

{{index "setInterval function", "clearInterval function", repetition}}

Benzer bir fonksiyon seti olan `setInterval` ve `clearInterval`, her _X_ milisaniyede bir _tekrarlanması_ gereken zamanlayıcıları ayarlamak için kullanılır.

```
let ticks = 0;
let clock = setInterval(() => {
  console.log("tick", ticks++);
  if (ticks == 10) {
    clearInterval(clock);
    console.log("stop.");
  }
}, 200);
```

## Geri tepme(debouncing)

{{index optimization, "mousemove event", "scroll event", blocking}}

Bazı olay türleri hızlı bir şekilde, arka arkaya birçok kez tetiklenme potansiyeline sahiptir (örneğin `“mousemove”` ve `“scroll”` olayları). Bu tür olayları işlerken, çok zaman alıcı bir şey yapmamaya dikkat etmelisiniz, aksi takdirde işleyiciniz o kadar çok zaman alır ki, belge ile etkileşim yavaş hissettirmeye başlar.

{{index "setTimeout function"}}

Böyle bir işleyicide önemsiz bir şey yapmanız gerekiyorsa, bunu çok sık yapmadığınızdan emin olmak için `setTimeout` kullanabilirsiniz. Buna genellikle _((debouncing))_ olay adı verilir. Bu konuda biraz farklı birkaç yaklaşım vardır.

{{index "textarea (HTML tag)", "clearTimeout function", "keydown event"}}

İlk örnekte, kullanıcı bir şey yazdığında tepki vermek istiyoruz, ancak bunu her girdi olayı için hemen yapmak istemiyoruz. Hızlı bir şekilde ((yazdıklarında)), sadece bir duraklama gerçekleşene kadar beklemek istiyoruz. Olay işleyicide hemen bir eylem gerçekleştirmek yerine, bir zaman aşımı ayarlıyoruz. Ayrıca önceki zaman aşımını (varsa) temizleriz, böylece olaylar birbirine yakın olduğunda (zaman aşımı gecikmemizden daha yakın), önceki olayın zaman aşımı iptal edilir.

```{lang: html}
<textarea>Type something here...</textarea>
<script>
  let textarea = document.querySelector("textarea");
  let timeout;
  textarea.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => console.log("Typed!"), 500);
  });
</script>
```

{{index "sloppy programming"}}

`clearTimeout`'a tanımlanmamış bir değer vermenin veya zaten ateşlenmiş bir zaman aşımında çağırmanın hiçbir etkisi yoktur. Bu nedenle, onu ne zaman çağıracağımız konusunda dikkatli olmamız gerekmez ve bunu her olay için yaparız.

{{index "mousemove event"}}

Yanıtları en az belirli bir ((zaman)) uzunluğuyla ayrılacak şekilde yerleştirmek istiyorsak, ancak bunları sadece sonrasında değil, bir dizi olay sırasında ateşlemek istiyorsak biraz farklı bir model kullanabiliriz.Örneğin, `“mousemove”` olaylarına farenin geçerli koordinatlarını göstererek yanıt vermek isteyebiliriz, ancak yalnızca her 250 milisaniyede bir.

```{lang: html}
<script>
  let scheduled = null;
  window.addEventListener("mousemove", event => {
    if (!scheduled) {
      setTimeout(() => {
        document.body.textContent =
          `Mouse at ${scheduled.pageX}, ${scheduled.pageY}`;
        scheduled = null;
      }, 250);
    }
    scheduled = event;
  });
</script>
```

## Özet

Olay işleyicileri, web sayfamızda meydana gelen olayları tespit etmeyi ve bunlara tepki vermeyi mümkün kılar. Böyle bir işleyiciyi kaydetmek için `addEventListener` yöntemi kullanılır.

Her olayın onu tanımlayan bir türü (`“keydown”`, `“focus”`, vb.) vardır. Çoğu olay belirli bir DOM öğesinde çağrılır ve ardından bu öğenin atalarına _propagate_ edilerek bu öğelerle ilişkili işleyicilerin bunları işlemesine izin verilir.

Bir olay işleyicisi çağrıldığında, olay hakkında ek bilgiler içeren bir olay nesnesi aktarılır. Bu nesne ayrıca daha fazla yayılmayı durdurmamıza (`stopPropagation`) ve tarayıcının olayı varsayılan olarak işlemesini engellememize (`preventDefault`) izin veren yöntemlere sahiptir.

Bir tuşa basmak `“keydown”` ve `“keyup”` olaylarını tetikler. Bir fare düğmesine basmak `“mousedown”`, `“mouseup”` ve `“click”` olaylarını tetikler. Farenin hareket ettirilmesi `“mousemove”` olaylarını ateşler. Dokunmatik ekran etkileşimi `“touchstart”`, `“touchmove”` ve `“touchend”` olaylarına neden olur.

Kaydırma `“scroll”` olayı ile, odak değişiklikleri ise `“focus”` ve `“blur”` olayları ile algılanabilir. Belge yüklenmeyi bitirdiğinde, pencerede bir `“load”` olayı ateşlenir.

Translated with DeepL.com (free version)

## Egzersizler

### Balon

{{index "balloon (exercise)", "arrow key"}}

Bir ((balon)) gösteren bir sayfa yazın (balon ((emoji)) kullanarak, 🎈). Yukarı oka bastığınızda yüzde 10 şişmeli (büyümeli) ve aşağı oka bastığınızda yüzde 10 sönmelidir (küçülmelidir).

{{index "font-size (CSS)"}}

Üst öğesinde `font-size` CSS özelliğini (`style.fontSize`) ayarlayarak metnin (emoji metindir) boyutunu kontrol edebilirsiniz. Değere bir birim eklemeyi unutmayın; örneğin, piksel (`10px`).

Ok tuşlarının anahtar adları `“ArrowUp”` ve `“ArrowDown”` şeklindedir. Tuşların sayfayı kaydırmadan yalnızca balonu değiştirdiğinden emin olun.

Bu işe yaradığında, balonu belirli bir boyutu geçecek şekilde şişirdiğinizde patlayacağı bir özellik ekleyin. Bu durumda patlaması, bir 💥 emojisi ile değiştirilmesi ve olay işleyicisinin kaldırılması anlamına gelir (böylece patlamayı şişiremez veya söndüremezsiniz).

{{if interactive

```{test: no, lang: html, focus: yes}
<p>🎈</p>

<script>
  // Kodunuz buraya
</script>
```

if}}

{{hint

{{index "keydown event", "key property", "balloon (exercise)"}}

`“keydown"` olayı için bir işleyici kaydetmek ve yukarı veya aşağı ok tuşuna basılıp basılmadığını anlamak için `event.key` olayına bakmak isteyeceksiniz.

Geçerli boyut bir bağlayıcıda tutulabilir, böylece yeni boyutu buna dayandırabilirsiniz. Boyutu (hem bağlayıcıyı hem de DOM'daki balonun stilini) güncelleyen bir fonksiyon tanımlamak yararlı olacaktır; böylece olay işleyicinizden ve muhtemelen başlangıçta ilk boyutu ayarlamak için bir kez çağırabilirsiniz.

{{index "replaceChild method", "textContent property"}}

Metin düğümünü başka bir düğümle değiştirerek (`replaceChild` kullanarak) veya üst düğümünün `textContent` özelliğini yeni bir dizeye ayarlayarak balonu bir patlamaya dönüştürebilirsiniz.

hint}}

### Fare izi

{{index animation, "mouse trail (exercise)"}}

JavaScript'in ilk günlerinde, yani çok sayıda animasyonlu görüntünün yer aldığı ((şatafatlı ana sayfalar)) zamanında, insanlar dili kullanmak için gerçekten ilham verici yollar buldular.

Bunlardan biri _mouse trail_ idi - fare işaretçisini sayfada hareket ettirdiğinizde onu takip eden bir dizi öğe.

{{index "absolute positioning", "background (CSS)"}}

In this exercise, I want you to implement a mouse trail. Use absolutely positioned `<div>` elements with a fixed size and background color (refer to the [code](event#mouse_drawing) in the “Mouse Clicks” section for an example). Create a bunch of such elements and, when the mouse moves, display them in the wake of the mouse pointer.

{{index "mousemove event"}}

Bu alıştırmada, sizden bir fare izi uygulamanızı istiyorum. Sabit bir boyuta ve arka plan rengine sahip, kesinlikle konumlandırılmış `<div>` öğeleri kullanın (örnek için “Fare Tıklamaları” bölümündeki [code](event#mouse_drawing) kısmına bakın). Bu tür öğelerden bir grup oluşturun ve fare hareket ettiğinde bunları fare işaretçisinin ardından görüntüleyin.

{{if interactive

```{lang: html, test: no}
<style>
  .trail { /* className for the trail elements */
    position: absolute;
    height: 6px; width: 6px;
    border-radius: 3px;
    background: teal;
  }
  body {
    height: 300px;
  }
</style>

<script>
  // Your code here.
</script>
```

if}}

{{hint

{{index "mouse trail (exercise)"}}

Öğeleri oluşturmak en iyi şekilde bir döngü ile yapılır. Gösterilmelerini sağlamak için bunları belgeye ekleyin. Daha sonra konumlarını değiştirmek üzere bunlara erişebilmek için öğeleri bir dizide saklamak isteyeceksiniz.

{{index "mousemove event", [array, indexing], "remainder operator", "% operator"}}

Bir ((sayaç değişkeni)) tutarak ve `“mousemove”` olayı her ateşlendiğinde buna 1 ekleyerek bunlar arasında geçiş yapılabilir. Kalan operatörü (`% elements.length`) daha sonra belirli bir olay sırasında konumlandırmak istediğiniz öğeyi seçmek için geçerli bir dizi indeksi elde etmek için kullanılabilir.

{{index simulation, "requestAnimationFrame function"}}

Bir başka ilginç etki de basit bir ((fizik)) sistemi modelleyerek elde edilebilir. `“mousemove"`olayını yalnızca fare konumunu izleyen bir çift binding'i güncellemek için kullanın. Daha sonra `requestAnimationFrame` kullanarak fare işaretçisinin konumuna çekilen arkadaki öğeleri simüle edin. Her animasyon adımında, işaretçiye göre konumlarını (ve isteğe bağlı olarak her öğe için depolanan bir hızı) temel alarak konumlarını güncelleyin. Bunu yapmanın iyi bir yolunu bulmak size kalmış.

hint}}

### Sekmeler

{{index "tabbed interface (exercise)"}}

Sekmeli paneller kullanıcı arayüzlerinde yaygın olarak kullanılır. Bir öğenin üzerine “yapışan” bir dizi sekme arasından seçim yaparak bir arayüz paneli seçmenize olanak tanırlar.

{{index "button (HTML tag)", "display (CSS)", "hidden element", "data attribute"}}

Bu egzersizde basit bir sekmeli arayüz uygulamanız gerekiyor. Bir DOM düğümü alan ve o düğümün alt öğelerini gösteren bir sekmeli arayüz oluşturan `asTabs` adlı bir fonksiyon yazın. Düğümün en üstüne, her bir alt öğe için `data-tabname` özniteliğinden alınan metni içeren birer `<button>` elementi içeren bir liste eklemelidir. Orijinal çocuklardan biri hariç hepsi gizlenmeli (gizli stil olarak `none` verilmelidir). Şu anda görünür düğüm, butonlara tıklanarak seçilebilir.

Bu çalıştığında, mevcut seçili sekmenin düğmesini farklı bir şekilde stillendirerek hangi sekmenin seçildiğinin belirgin olmasını sağlayın.

{{if interactive

```{lang: html, test: no}
<tab-panel>
  <div data-tabname="one">Tab one</div>
  <div data-tabname="two">Tab two</div>
  <div data-tabname="three">Tab three</div>
</tab-panel>
<script>
  function asTabs(node) {
    // Your code here.
  }
  asTabs(document.querySelector("tab-panel"));
</script>
```

if}}

{{hint

{{index "text node", "childNodes property", "live data structure", "tabbed interface (exercise)", [whitespace, "in HTML"]}}

Karşılaşabileceğiniz bir tuzak, düğümün `childNodes` özelliğini doğrudan sekme düğümleri koleksiyonu olarak kullanamamaktır. Birincisi, butonları eklediğinizde, bunlar da çocuk düğümler haline gelecek ve bu nesneye dahil olacaktır çünkü bu canlı bir veri yapısıdır. İkincisi, düğümler arasındaki boşluk için oluşturulan metin düğümleri de `childNodes` içinde yer alır ancak kendi sekmelerini almamalıdır. Metin düğümlerini göz ardı etmek için `childNodes` yerine `children` kullanabilirsiniz.

{{index "TEXT_NODE code", "nodeType property"}}

Sekmelerin kolay erişimini sağlamak için bir dizi sekme oluşturarak başlayabilirsiniz. Butonların stilini uygulamak için, hem sekme panelini hem de butonunu içeren nesneleri saklayabilirsiniz.

Sekmeleri değiştirmek için ayrı bir fonksiyon yazmanızı öneririm. Ya daha önce seçilen sekmeyi saklayıp sadece onu gizlemek ve yenisini göstermek için gereken stilleri değiştirebilir ya da her yeni sekme seçildiğinde tüm sekmelerin stilini güncelleyebilirsiniz.

Arayüzün ilk sekme görünür olacak şekilde başlaması için bu fonksiyonu hemen çağırmak isteyebilirsiniz..

hint}}
