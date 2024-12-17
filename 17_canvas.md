{{meta {load_files: ["code/chapter/16_game.js", "code/levels.js", "code/chapter/17_canvas.js"], zip: "html include=[\"img/player.png\", \"img/sprites.png\"]"}}}

# Tuval Üzerine Çizim

{{quote {author: "M.C. Escher", title: "Bruno Ernst tarafından M.C. Escher'in Sihirli Aynası'nda alıntılanmıştır", chapter: true}

Çizim bir aldatmacadır.

quote}}

{{index "Escher, M.C."}}

{{figure {url: "img/chapter_picture_17.jpg", alt: "Endüstriyel görünümlü bir robot kolunun bir kağıt parçasına bir şehir çizdiğini gösteren illüstrasyon", chapter: "framed"}}}

{{index CSS, "transform (CSS)", [DOM, graphics]}}

Tarayıcılar bize ((grafik)) görüntülemek için çeşitli yollar sunar. En basit yol, normal DOM öğelerini konumlandırmak ve renklendirmek için stilleri kullanmaktır. Bu, [önceki bölüm](game)'daki oyunun gösterdiği gibi sizi oldukça ileriye götürebilir. Düğümlere kısmen saydam arka plan ((resim)) ekleyerek, tam olarak istediğimiz şekilde görünmelerini sağlayabiliriz. Hatta `transform` stili ile düğümleri döndürmek ya da eğmek bile mümkündür.

Ancak DOM'u başlangıçta tasarlanmadığı bir şey için kullanmış oluruz. Rastgele noktalar arasında bir ((çizgi)) çizmek gibi bazı görevleri normal HTML öğeleriyle yapmak son derece gariptir.

{{index SVG, "img (HTML tag)"}}

İki alternatif vardır. İlki, DOM tabanlıdır ancak HTML yerine _Scalable Vector Graphics_ (SVG) kullanır. SVG'yi, metin yerine ((şekil))lere odaklanan bir ((belge))-markup diyalektiği olarak düşünebilirsiniz. Bir SVG belgesini doğrudan bir HTML belgesine gömebilir veya bir `<img>` etiketi ile dahil edebilirsiniz.

{{index clearing, [DOM graphics], [interface, canvas]}}

İkinci alternatif _((canvas))_ olarak adlandırılır. Tuval, bir ((resim))'i kapsülleyen tek bir DOM öğesidir. Düğüm tarafından kaplanan alana ((şekil)) çizmek için bir programlama arayüzü sağlar. Bir tuval ile bir SVG resmi arasındaki temel fark, SVG'de şekillerin orijinal tanımının korunması ve böylece herhangi bir zamanda taşınabilmeleri veya yeniden boyutlandırılabilmeleridir. Öte yandan bir tuval, şekilleri çizildikleri anda ((piksel))lere (bir raster üzerindeki renkli noktalar) dönüştürür ve bu piksellerin neyi temsil ettiğini hatırlamaz. Tuval üzerindeki bir şekli taşımanın tek yolu, tuvali (veya tuvalin şeklin etrafındaki kısmını) temizlemek ve şekli yeni bir konuma getirerek yeniden çizmektir.

## SVG

Bu kitap ((SVG))'yi ayrıntılı olarak ele almayacak, ancak nasıl çalıştığını kısaca açıklayacağım. [Bölümün sonunda](canvas#graphics_tradeoffs), belirli bir uygulama için hangi ((çizim)) mekanizmasının uygun olduğunu belirlerken göz önünde bulundurmanız gereken ödünleşmelere tekrar döneceğim.

Bu, içinde basit bir SVG ((resim)) bulunan bir HTML belgesidir:

```{lang: html, sandbox: "svg"}
<p>Normal HTML here.</p>
<svg xmlns="http://www.w3.org/2000/svg">
  <circle r="50" cx="50" cy="50" fill="red"/>
  <rect x="120" y="5" width="90" height="90"
        stroke="blue" fill="none"/>
</svg>
```

{{index "circle (SVG tag)", "rect (SVG tag)", "XML namespace", XML, "xmlns attribute"}}

`xmlns` özelliği, bir öğeyi (ve çocuklarını) farklı bir _XML ad alanına_ değiştirir. Bu ad alanı, bir ((URL)) ile tanımlanır ve şu anda konuştuğumuz diyalektiği belirtir. HTML'de bulunmayan `<circle>` ve `<rect>` etiketleri, SVG'de bir anlama sahiptir—özellikleriyle belirtilen stil ve pozisyonu kullanarak şekiller çizerler.

{{if book

Belge şu şekilde görüntülenir:

{{figure {url: "img/svg-demo.png", alt: "Bir HTML belgesine gömülmüş SVG görüntüsünü gösteren ekran görüntüsü", width: "4.5cm"}}}

if}}

{{index [DOM, graphics]}}

Bu etiketler, tıpkı HTML etiketleri gibi, komut dosyalarının etkileşime girebileceği DOM öğeleri oluşturur. Örneğin, bu `<circle>` öğesini ((color))ed cyan olarak değiştirir:

```{sandbox: "svg"}
let circle = document.querySelector("circle");
circle.setAttribute("fill", "cyan");
```

## Canvas öğesi

{{index [canvas, size], "canvas (HTML tag)"}}

Canvas ((grafikleri)), bir `<canvas>` öğesi üzerine çizilebilir. Böyle bir öğeye, boyutunu ((piksel)) cinsinden belirlemek için `width` ve `height` özellikleri verebilirsiniz.

Yeni bir canvas boştur, yani tamamen ((şeffaf))tır ve bu nedenle belgede boş alan olarak görünür.

{{index "2d (canvas context)", "webgl (canvas context)", OpenGL, [canvas, context], dimensions, [interface, canvas]}}

`<canvas>` etiketi, farklı ((çizim)) stillerine olanak tanımak için tasarlanmıştır. Gerçek bir çizim arayüzüne erişmek için önce bir _((context))_ oluşturmamız gerekir; bu, yöntemleri çizim arayüzünü sağlayan bir nesnedir. Şu anda yaygın olarak desteklenen üç çizim stili vardır: iki boyutlu grafikler için `"2d"`, OpenGL arayüzü aracılığıyla üç boyutlu grafikler için `"webgl"` ve WebGL ile aynı rolü dolduran, ancak daha modern bir arayüz sunan `"webgpu"`.

{{index rendering, graphics, efficiency}}

Bu kitap WebGL veya WebGPU'yu ele almayacak—iki boyutla sınırlı kalacağız. Ancak üç boyutlu grafiklere ilgi duyuyorsanız, WebGPU'yu incelemenizi tavsiye ederim. Grafik donanımına doğrudan bir arayüz sağlar ve JavaScript kullanarak karmaşık sahneleri bile verimli bir şekilde render etmenizi sağlar.

{{index "getContext method", [canvas, context]}}

`<canvas>` DOM öğesi üzerinde `getContext` yöntemiyle bir ((context)) oluşturursunuz.

```{lang: html}
<p>Before canvas.</p>
<canvas width="120" height="60"></canvas>
<p>After canvas.</p>
<script>
  let canvas = document.querySelector("canvas");
  let context = canvas.getContext("2d");
  context.fillStyle = "red";
  context.fillRect(10, 10, 100, 50);
</script>
```

Örnek, bağlam nesnesini oluşturduktan sonra, sol üst köşesi (10,10) koordinatlarında olacak şekilde 100 ((piksel)) genişliğinde ve 50 piksel yüksekliğinde kırmızı bir ((dikdörtgen)) çizer.

{{if book

{{figure {url: "img/canvas_fill.png", alt: "Üzerinde dikdörtgen bulunan bir tuvalin ekran görüntüsü", width: "2.5cm"}}}

if}}

{{index SVG, coordinates}}

Tıpkı HTML'de (ve SVG'de) olduğu gibi, tuvalin kullandığı koordinat sistemi (0,0)'ı sol üst köşeye koyar ve pozitif y-((eksen)) oradan aşağı iner. Yani (10,10) sol üst köşenin 10 piksel altında ve sağındadır.

{{id fill_stroke}}

## Çizgiler ve yüzeyler

{{index filling, stroking, drawing, SVG}}

((Canvas)) arayüzünde, bir şekil _doldurulabilir_, yani alanına belirli bir renk veya desen verilebilir veya _okşanabilir_, yani kenarı boyunca bir ((çizgi)) çizilebilir. Aynı terminoloji SVG tarafından da kullanılır.

{{index "fillRect method", "strokeRect method"}}

`fillRect` yöntemi bir ((dikdörtgen)) doldurur. Önce dikdörtgenin sol üst köşesinin x- ve y-((koordinatlarını)), sonra genişliğini ve sonra da yüksekliğini alır. Benzer bir yöntem olan `strokeRect`, bir dikdörtgenin ((anahatlarını)) çizer.

{{index [state, "of canvas"]}}

Her iki yöntem de başka parametre almaz. Dolgunun rengi, konturun kalınlığı ve benzerleri, yöntemin bir argümanı tarafından değil (makul olarak bekleyebileceğiniz gibi), bağlam nesnesinin özellikleri tarafından belirlenir.

{{index filling, "fillStyle property"}}

`fillStyle` özelliği şekillerin doldurulma şeklini kontrol eder. ((CSS)) tarafından kullanılan renk gösterimini kullanarak bir ((renk)) belirten bir dizeye ayarlanabilir.

{{index stroking, "line width", "strokeStyle property", "lineWidth property", canvas}}

`strokeStyle` özelliği de benzer şekilde çalışır, ancak konturlu bir çizgi için kullanılan rengi belirler. Bu çizginin genişliği, herhangi bir pozitif sayı içerebilen `lineWidth` özelliği tarafından belirlenir.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.strokeStyle = "blue";
  cx.strokeRect(5, 5, 50, 50);
  cx.lineWidth = 5;
  cx.strokeRect(135, 5, 50, 50);
</script>
```

{{if book

Bu kod, ikincisi için daha kalın bir çizgi kullanarak iki mavi kare çizer.

{{figure {url: "img/canvas_stroke.png", alt: "İki ana hatlı kareyi gösteren ekran görüntüsü", width: "5cm"}}}

if}}

{{index "default value", [canvas, size]}}

Örnekte olduğu gibi `width` veya `height` niteliği belirtilmediğinde, bir canvas öğesi varsayılan olarak 300 piksel genişlik ve 150 piksel yükseklik alır.

## Yollar

{{index [path, canvas], [interface, design], [canvas, path]}}

Bir yol, ((çizgi))lerin bir dizisidir. 2B tuval arayüzü böyle bir yolu tanımlamak için kendine özgü bir yaklaşım benimser. Bu tamamen ((yan etki))ler aracılığıyla yapılır. Yollar saklanabilen ve aktarılabilen değerler değildir. Bunun yerine, bir yolla bir şey yapmak istiyorsanız, şeklini tanımlamak için bir dizi yöntem çağrısı yaparsınız.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  for (let y = 10; y < 100; y += 10) {
    cx.moveTo(10, y);
    cx.lineTo(90, y);
  }
  cx.stroke();
</script>
```

{{index canvas, "stroke method", "lineTo method", "moveTo method", shape}}

Bu örnek, bir dizi yatay ((çizgi)) parçadan oluşan bir yol oluşturur ve ardından `stroke` yöntemini kullanarak bu yolu konturlar. `lineTo` ile oluşturulan her segment yolun _current_ konumundan başlar. Bu konum, `moveTo` çağrılmadığı sürece, genellikle son segmentin sonudur. Bu durumda, bir sonraki segment `moveTo` metoduna aktarılan pozisyondan başlar.

{{if book

Önceki program tarafından tanımlanan yol şu şekildedir:

{{figure {url: "img/canvas_path.png", alt: "Bir dizi dikey çizgiyi gösteren ekran görüntüsü", width: "2.1cm"}}}

if}}

{{index [path, canvas], filling, [path, closing], "fill method"}}

Bir yol doldurulurken (`fill` yöntemi kullanılarak), her ((shape)) ayrı ayrı doldurulur. Bir yol birden fazla şekil içerebilir - her `moveTo` hareketi yeni bir tane başlatır. Ancak yolun doldurulabilmesi için önce _kapalı_ olması (yani başlangıç ve bitişinin aynı konumda olması) gerekir. Yol zaten kapalı değilse, sonundan başlangıcına bir çizgi eklenir ve tamamlanan yol tarafından çevrelenen şekil doldurulur.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  cx.moveTo(50, 10);
  cx.lineTo(10, 70);
  cx.lineTo(90, 70);
  cx.fill();
</script>
```

Bu örnekte içi dolu bir üçgen çizilmektedir. Üçgenin kenarlarından yalnızca ikisinin açıkça çizildiğine dikkat edin. Üçüncüsü, sağ alt köşeden yukarıya doğru, ima edilmiştir ve yolu vurduğunuzda orada olmayacaktır.

{{if book

{{figure {url: "img/canvas_triangle.png", alt: "Doldurulmuş bir yolu gösteren ekran görüntüsü", width: "2.2cm"}}}

if}}

{{index "stroke method", "closePath method", [path, closing], canvas}}

Ayrıca, yolun başlangıcına gerçek bir ((çizgi)) segment ekleyerek bir yolu açıkça kapatmak için `closePath` yöntemini de kullanabilirsiniz. Bu parça, yola vurulduğunda \_çizilir.

## Eğriler

{{index [path, canvas], canvas, drawing}}

Bir yol ayrıca ((eğri))d ((çizgi))ler de içerebilir. Bunların çizimi ne yazık ki biraz daha karmaşıktır.

{{index "quadraticCurveTo method"}}

`quadraticCurveTo` yöntemi, verilen bir noktaya bir eğri çizer. Çizginin eğriliğini belirlemek için, yönteme bir hedef noktasının yanı sıra bir ((kontrol noktası)) verilir. Bu kontrol noktasını çizgiyi _çeken_ ve ona eğrisini veren nokta olarak düşünün. Çizgi kontrol noktasından geçmeyecektir, ancak başlangıç ve bitiş noktalarındaki yönü, o yöndeki düz bir çizginin kontrol noktasını göstereceği şekilde olacaktır. Aşağıdaki örnek bunu göstermektedir:

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  cx.moveTo(10, 90);
  // control=(60,10) goal=(90,90)
  cx.quadraticCurveTo(60, 10, 90, 90);
  cx.lineTo(60, 10);
  cx.closePath();
  cx.stroke();
</script>
```

{{if book

Şuna benzeyen bir yol üretir:

{{figure {url: "img/canvas_quadraticcurve.png", alt: "İkinci dereceden bir eğrinin ekran görüntüsü", width: "2.3cm"}}}

if}}

{{index "stroke method"}}

Kontrol noktası (60,10) olacak şekilde soldan sağa doğru bir ((ikinci dereceden eğri)) çiziyoruz ve ardından bu kontrol noktasından geçip doğrunun başlangıcına geri dönen iki ((doğru)) parçası çiziyoruz. Sonuç biraz _((Star Trek))_ amblemine benziyor. Kontrol noktasının etkisini görebilirsiniz: alt köşelerden çıkan çizgiler kontrol noktası yönünde başlar ve sonra hedeflerine doğru ((eğrilir)).

{{index canvas, "bezierCurveTo method"}}

`bezierCurveTo` yöntemi de benzer türde bir eğri çizer. Tek bir ((kontrol noktası)) yerine, bunun iki tane ((çizgi))'nin uç noktalarının her biri için bir tane vardır. İşte böyle bir eğrinin davranışını göstermek için benzer bir taslak:

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  cx.moveTo(10, 90);
  // control1=(10,10) control2=(90,10) goal=(50,90)
  cx.bezierCurveTo(10, 10, 90, 10, 50, 90);
  cx.lineTo(90, 10);
  cx.lineTo(10, 10);
  cx.closePath();
  cx.stroke();
</script>
```

İki kontrol noktası eğrinin her iki ucundaki yönü belirler. Karşılık gelen noktadan ne kadar uzakta olurlarsa, eğri o yönde o kadar fazla "çıkıntı" yapacaktır.

{{if book

{{figure {url: "img/canvas_beziercurve.png", alt: "Bir bezier eğrisinin ekran görüntüsü", width: "2.2cm"}}}

if}}

{{index "trial and error"}}

Bu tür ((eğri))lerle çalışmak zor olabilir - aradığınız ((şekli)) sağlayan ((kontrol noktası))ları nasıl bulacağınız her zaman net değildir. Bazen bunları hesaplayabilirsiniz, bazen de deneme yanılma yoluyla uygun bir değer bulmanız gerekir.

{{index "arc method", arc}}

`arc` yöntemi, bir dairenin kenarı boyunca kıvrılan bir çizgi çizmenin bir yoludur. Yay merkezi için bir çift ((koordinat)), bir yarıçap ve ardından bir başlangıç açısı ve bitiş açısı alır.

{{index pi, "Math.PI constant"}}

Bu son iki parametre dairenin sadece bir kısmını çizmeyi mümkün kılar. ((açı))lar ((derece))lerle değil ((radyan))larla ölçülür. Bu, tam bir ((daire))'nin 2π veya `2 * Math.PI` açısına sahip olduğu anlamına gelir, bu da yaklaşık 6.28'dir. Açı, dairenin merkezinin sağındaki noktadan saymaya başlar ve oradan saat yönünde ilerler. Tam bir daire çizmek için 0'lık bir başlangıç ve 2π'den büyük bir son (örneğin 7) kullanabilirsiniz.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  // center=(50,50) radius=40 angle=0 to 7
  cx.arc(50, 50, 40, 0, 7);
  // center=(150,50) radius=40 angle=0 to ½π
  cx.arc(150, 50, 40, 0, 0.5 * Math.PI);
  cx.stroke();
</script>
```

{{index "moveTo method", "arc method", [path, " canvas"]}}

Sonuçta ortaya çıkan resim, tam dairenin sağından (`arc`'a ilk çağrı) çeyrek-((daire))'nin sağına (ikinci çağrı) bir ((çizgi)) içerir. Diğer yol çizme yöntemlerinde olduğu gibi, `arc` ile çizilen bir çizgi bir önceki yol parçasına bağlanır. Bunu önlemek için `moveTo` çağrısı yapabilir veya yeni bir yol başlatabilirsiniz.

{{if book

{{figure {url: "img/canvas_circle.png", alt: "Bir dairenin ekran görüntüsü", width: "4.9cm"}}}

if}}

{{id pie_chart}}

## Pasta grafiği çizme

{{index "pie chart example"}}

EconomiCorp, Inc. şirketinde yeni bir ((iş)) aldığınızı ve ilk görevinizin müşteri memnuniyeti ((anket)) sonuçlarının bir pasta grafiğini çizmek olduğunu düşünün.

`results` bağlayıcısı, anket yanıtlarını temsil eden bir dizi nesne içerir.

```{sandbox: "pie", includeCode: true}
const results = [
  {name: "Satisfied", count: 1043, color: "lightblue"},
  {name: "Neutral", count: 563, color: "lightgreen"},
  {name: "Unsatisfied", count: 510, color: "pink"},
  {name: "No comment", count: 175, color: "silver"}
];
```

{{index "pie chart example"}}

Bir pasta grafiği çizmek için, her biri bir ((yay)) ve bu yayın merkezine bir çift ((çizgi))'den oluşan bir dizi pasta dilimi çizeriz. Tam bir daireyi (2π) toplam yanıt sayısına bölerek ve ardından bu sayıyı (yanıt başına açı) belirli bir seçeneği işaretleyen kişi sayısıyla çarparak her bir yay tarafından kaplanan ((açıyı)) hesaplayabiliriz.

```{lang: html, sandbox: "pie"}
<canvas width="200" height="200"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let total = results
    .reduce((sum, {count}) => sum + count, 0);
  // Start at the top
  let currentAngle = -0.5 * Math.PI;
  for (let result of results) {
    let sliceAngle = (result.count / total) * 2 * Math.PI;
    cx.beginPath();
    // center=100,100, radius=100
    // from current angle, clockwise by slice's angle
    cx.arc(100, 100, 100,
           currentAngle, currentAngle + sliceAngle);
    currentAngle += sliceAngle;
    cx.lineTo(100, 100);
    cx.fillStyle = result.color;
    cx.fill();
  }
</script>
```

{{if book

Bu, aşağıdaki tabloyu çizer:

{{figure {url: "img/canvas_pie_chart.png", alt: "Pasta grafiğini gösteren ekran görüntüsü", width: "5cm"}}}

if}}

Ancak dilimlerin ne anlama geldiğini bize söylemeyen bir grafik çok yararlı değildir. Metni ((tuval)) üzerine çizmek için bir yola ihtiyacımız var.

## Metin

{{index stroking, filling, "fillStyle property", "fillText method", "strokeText method"}}

A 2D canvas drawing context provides the methods `fillText` and `strokeText`. The latter can be useful for outlining letters, but usually `fillText` is what you need. It will fill the outline of the given ((text)) with the current `fillStyle`.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.font = "28px Georgia";
  cx.fillStyle = "fuchsia";
  cx.fillText("I can draw text, too!", 10, 50);
</script>
```

2B tuval çizim bağlamı `fillText` ve `strokeText` yöntemlerini sağlar. İkincisi harflerin ana hatlarını çizmek için yararlı olabilir, ancak genellikle ihtiyacınız olan şey `fillText`tir. Verilen ((metin)) ana hatlarını geçerli `fillStyle` ile dolduracaktır.

Metnin boyutunu, stilini ve ((yazı tipi)) `font` özelliği ile belirtebilirsiniz. Bu örnek sadece bir yazı tipi boyutu ve aile adı verir. Bir stil seçmek için dizenin başına `italic` veya `bold` eklemek de mümkündür.

`fillText` ve `strokeText` için son iki bağımsız değişken, yazı tipinin çizileceği konumu sağlar. Varsayılan olarak, metnin alfabetik taban çizgisinin başlangıcının konumunu belirtirler; bu, _j_ veya _p_ gibi harflerdeki asılı kısımları saymazsak, harflerin "üzerinde durduğu" çizgidir. Yatay konumu `textAlign` özelliğini `"end"` veya `"center"` olarak ayarlayarak, dikey konumu ise `textBaseline` özelliğini `"top"`, `"middle"` veya `"bottom"` olarak ayarlayarak değiştirebilirsiniz.

{{index "pie chart example"}}

Pasta grafiğimize ve dilimleri ((etiketleme)) sorununa bölümün sonundaki [alıştırmalar](canvas#exercise_pie_chart) kısmında geri döneceğiz.

## Görüntüler

{{index "vector graphics", "bitmap graphics"}}

Bilgisayar ((grafikleri))nde, _vektör_ grafikleri ve _bitmap_ grafikleri arasında genellikle bir ayrım yapılır. İlk olarak bu bölümde şu ana kadar yaptığımız şey, bir resmi ((şekil))lerin mantıksal bir tanımını vererek belirlemektir. Öte yandan, bitmap grafikleri, gerçek şekilleri belirtmez, bunun yerine ((piksel)) verileriyle (renkli noktaların rastraları) çalışır.

{{index "load event", "event handling", "img (HTML tag)", "drawImage method"}}

`drawImage` metodu, bir ((canvas)) üzerine ((piksel)) verisi çizmemizi sağlar. Bu piksel verisi bir `<img>` öğesinden veya başka bir canvas'tan gelebilir. Aşağıdaki örnek, bağımsız bir `<img>` öğesi oluşturur ve içine bir görüntü dosyası yükler. Ancak, bu resimden hemen çizmeye başlayamaz çünkü tarayıcı henüz yüklemeyi tamamlamamış olabilir. Bunu çözmek için bir `"load"` olay işleyicisi kaydederiz ve resim yüklendikten sonra çizimi yaparız.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let img = document.createElement("img");
  img.src = "img/hat.png";
  img.addEventListener("load", () => {
    for (let x = 10; x < 200; x += 30) {
      cx.drawImage(img, x, 10);
    }
  });
</script>
```

{{index "drawImage method", scaling}}

Varsayılan olarak, `drawImage`, resmi orijinal boyutunda çizecektir. Ayrıca farklı bir genişlik ve yükseklik ayarlamak için iki ek argüman verebilirsiniz.

`drawImage`'e _dokuz_ argüman verildiğinde, yalnızca bir resmin bir parçasını çizmek için kullanılabilir. İkinci ila beşinci argümanlar, kaynak görüntüde kopyalanması gereken dikdörtgeni (x, y, width ve height) belirtir ve altıncı ila dokuzuncu argümanlar, bunun kopyalanması gereken (canvas üzerindeki) dikdörtgeni belirtir.

{{index "player", "pixel art"}}

Bu, birden fazla _((sprite))_ (görüntü öğesi) öğesini tek bir görüntü dosyasına sığdırmak ve ardından yalnızca ihtiyacınız olan kısmı çizmek için kullanılabilir. Örneğin, birden fazla ((poz))da oyun karakteri içeren bu resme sahibiz:

{{figure {url: "img/player_big.png", alt: "Bir bilgisayar oyunu karakterini 10 farklı pozda gösteren piksel sanatı. İlk 8'i koşma animasyon döngüsünü oluşturuyor, 9'uncuda karakter hareketsiz duruyor ve 10'uncusu zıplamasını gösteriyor.", width: "6cm"}}}

{{index [animation, "platform game"]}}

Hangi pozu çizeceğimizi değiştirerek, yürüyen bir karakter gibi görünen bir animasyon gösterebiliriz.

{{index "fillRect method", "clearRect method", clearing}}

Bir ((tuval)) üzerindeki bir ((resmi)) canlandırmak için `clearRect` yöntemi kullanışlıdır. Bu yöntem `fillRect` yöntemine benzer, ancak dikdörtgeni renklendirmek yerine, önceden çizilmiş pikselleri kaldırarak ((saydam)) hale getirir.

{{index "setInterval function", "img (HTML tag)"}}

Her _((sprite))_, her alt resmin 24 ((piksel)) genişliğinde ve 30 piksel yüksekliğinde olduğunu biliyoruz. Aşağıdaki kod görüntüyü yükler ve ardından bir sonraki ((frame)) çizmek için bir aralık (tekrarlanan zamanlayıcı) ayarlar:

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let img = document.createElement("img");
  img.src = "img/player.png";
  let spriteW = 24, spriteH = 30;
  img.addEventListener("load", () => {
    let cycle = 0;
    setInterval(() => {
      cx.clearRect(0, 0, spriteW, spriteH);
      cx.drawImage(img,
                   // source rectangle
                   cycle * spriteW, 0, spriteW, spriteH,
                   // destination rectangle
                   0,               0, spriteW, spriteH);
      cycle = (cycle + 1) % 8;
    }, 120);
  });
</script>
```

{{index "remainder operator", "% operator", [animation, "platform game"]}}

`cycle` bağı, animasyondaki konumumuzu izler. Her bir ((kare)) için arttırılır ve ardından kalan operatörü kullanılarak 0 ile 7 aralığına geri döndürülür. Bu bağlam, mevcut poz için sprite'ın resimdeki x koordinatını hesaplamak için kullanılır.

## Dönüşüm

{{index transformation, mirroring}}

{{indexsee flipping, mirroring}}

Peki ya karakterimizin sağa değil de sola yürümesini istersek? Elbette başka bir sprite seti çizebiliriz. Ancak ((canvas))'a resmi ters yönde çizmesini de söyleyebiliriz.

{{index "scale method", scaling}}

`scale` metodunu çağırmak, ondan sonra çizilen her şeyin ölçeklenmesine neden olur. Bu metod iki parametre alır: biri yatay ölçeği, diğeri dikey ölçeği ayarlamak için kullanılır.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.scale(3, .5);
  cx.beginPath();
  cx.arc(50, 50, 40, 0, 7);
  cx.lineWidth = 3;
  cx.stroke();
</script>
```

{{if book

`scale` çağrısından dolayı, daire üç kat geniş ve yarı yüksek olarak çizilir.

{{figure {url: "img/canvas_scale.png", alt: "Ölçeklendirilmiş bir dairenin ekran görüntüsü", width: "6.6cm"}}}

if}}

{{index mirroring}}

Ölçekleme, çizilen resimdeki her şeyi, ((çizgi genişliği)) de dahil olmak üzere belirtilen şekilde genişletir veya sıkıştırır. Negatif bir miktarla ölçekleme yapmak resmi ters çevirir. Ters çevirme, (0,0) noktasında gerçekleşir, bu da koordinat sisteminin yönünü de tersine çevireceği anlamına gelir. -1 yatay ölçek uygulandığında, x konumunda 100 olan bir şekil, artık -100 olan konumda sona erer.

{{index "drawImage method"}}

Bu nedenle, bir resmi ters çevirmek için `drawImage` çağrısından önce basitçe `cx.scale(-1, 1)` ekleyemeyiz çünkü bu, resmimizi ((canvas)) dışına taşıyacak ve bu da görünmez olmasına neden olacaktır. Bu durumu telafi etmek için resmi x konumunda 0 yerine -50'de çizerek `drawImage`'a verilen ((koordinatları)) ayarlayabilirsiniz. Çizim yapan kodun ölçek değişikliğinden haberdar olmasını gerektirmeyen bir başka çözüm ise ölçeklemenin gerçekleştiği ((eksen))i ayarlamaktır.

{{index "rotate method", "translate method", transformation}}

`scale` dışında, bir ((canvas)) için koordinat sistemini etkileyen birkaç başka metod daha vardır. `rotate` metodunu kullanarak daha sonra çizilen şekilleri döndürebilir ve `translate` metodu ile onları hareket ettirebilirsiniz. İlginç—ve kafa karıştırıcı—olan şey, bu dönüşümlerin _üst üste binmesi_, yani her birinin önceki dönüşümlere göre gerçekleşmesidir.

{{index "rotate method", "translate method"}}

Yani, iki kez 10 yatay piksel kadar öteleme yaparsak, her şey sağa doğru 20 piksel kaydırılacaktır. İlk olarak koordinat sisteminin merkezini (50,50) noktasına taşıyıp ardından 20 ((derece)) (yaklaşık 0.1π ((radyan))) döndürürsek, bu döndürme _(50,50) noktası etrafında_ gerçekleşecektir.

{{figure {url: "img/transform.svg", alt: "Dönüşümlerin üst üste binmesinin sonucunu gösteren diyagram. İlk diyagram, önce öteleme yapar ve ardından döndürme yapar, bu da ötelemenin normal şekilde gerçekleşmesine ve döndürmenin ötelemenin hedefi etrafında gerçekleşmesine neden olur. İkinci diyagram, önce döndürür ve ardından öteleme yapar, bu da döndürmenin orijin etrafında olmasına ve öteleme yönünün bu döndürme ile eğilmesine neden olur.", width: "9cm"}}}

{{index coordinates}}

Ancak önce 20 derece döndürme ve _sonra_ (50,50) öteleme yaparsak, öteleme döndürülmüş koordinat sisteminde gerçekleşir ve böylece farklı bir yönlenme oluşturur. Dönüşümlerin uygulanma sırası önemlidir.

{{index axis, mirroring}}

Belirli bir x konumundaki dikey çizgi etrafında bir resmi ters çevirmek için şu adımları izleyebiliriz:

```{includeCode: true}
function flipHorizontally(context, around) {
  context.translate(around, 0);
  context.scale(-1, 1);
  context.translate(-around, 0);
}
```

{{index "flipHorizontally method"}}

Y-((ekseni))ni aynanın olması gereken yere taşıyoruz, aynalamayı uyguluyoruz ve son olarak y-ekseni aynalanmış evrendeki doğru yerine geri taşıyoruz. Aşağıdaki resim bunun neden işe yaradığını açıklıyor:

{{figure {url: "img/mirror.svg", alt: "Üçgenin taşınması ve aynalanmasının etkisini gösteren diyagram", width: "8cm"}}}

{{index "translate method", "scale method", transformation, canvas}}

Bu, merkez çizgi boyunca aynalanmadan önce ve sonraki koordinat sistemlerini gösterir. Üçgenler, her adımı açıklamak için numaralandırılmıştır. Eğer pozitif bir x konumunda bir üçgen çizersek, varsayılan olarak üçgen 1'in bulunduğu yerde olurdu. `flipHorizontally` çağrısı ilk olarak sağa doğru bir öteleme yapar, bu da bizi üçgen 2'ye getirir. Ardından ölçeklendirme yapılır ve üçgeni pozisyon 3'e çevirir. Bu, verilen çizgide aynalanmış olması durumunda olması gereken yer değildir. İkinci `translate` çağrısı bunu düzeltir—ilk ötelemeyi "iptal eder" ve üçgen 4'ü tam olarak olması gereken yere getirir.

Şimdi, karakterin dikey merkezi etrafında dünyayı çevirerek (100,0) konumunda aynalanmış bir karakter çizebiliriz.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let img = document.createElement("img");
  img.src = "img/player.png";
  let spriteW = 24, spriteH = 30;
  img.addEventListener("load", () => {
    flipHorizontally(cx, 100 + spriteW / 2);
    cx.drawImage(img, 0, 0, spriteW, spriteH,
                 100, 0, spriteW, spriteH);
  });
</script>
```

## Dönüşümlerin depolanması ve temizlenmesi

{{index "side effect", canvas, transformation}}

Dönüşümler kalıcıdır. Aynalanmış karakteri çizdikten sonra çizdiğimiz her şey de aynalanmış olacaktır. Bu, rahatsız edici olabilir.

Geçerli dönüşümü kaydedip, bazı çizimler ve dönüşümler yapıp, ardından eski dönüşümü geri yüklemek mümkündür. Bu, genellikle koordinat sistemini geçici olarak dönüştürmesi gereken bir fonksiyon için yapılması gereken uygun bir işlemdir. İlk olarak, fonksiyonu çağıran kodun kullandığı dönüşüm ne olursa olsun kaydedilir. Ardından, fonksiyon kendi işlemlerini yapar ve mevcut dönüşümün üzerine daha fazla dönüşüm ekler. Son olarak, başladığımız dönüşüme geri döneriz.

{{index "save method", "restore method", [state, "of canvas"]}}

2D ((canvas)) bağlamındaki `save` ve `restore` metodları, bu ((dönüşüm)) yönetimini yapar. Kavramsal olarak, bir dönüşüm durumu yığını tutarlar. `save` çağrıldığında, mevcut durum yığına itilir ve `restore` çağrıldığında, yığının üstündeki durum alınır ve bağlamın geçerli dönüşümü olarak kullanılır. Ayrıca `resetTransform` çağrısıyla dönüşümü tamamen sıfırlayabilirsiniz.

{{index "branching recursion", "fractal example", recursion}}

Aşağıdaki örnekteki `branch` fonksiyonu, dönüşümü değiştiren ve ardından (bu durumda kendisi) bir fonksiyonu çağıran bir fonksiyonla neler yapabileceğinizi gösterir. Bu fonksiyon, verilen dönüşümle çizim yapmaya devam eder.

Bu fonksiyon, bir çizgi çizerek, koordinat sisteminin merkezini çizginin sonuna taşıyarak ve kendisini iki kez çağırarak—ilk önce sola, sonra sağa döndürerek—ağaç benzeri bir şekil çizer. Her çağrı, çizilen dalın uzunluğunu azaltır ve uzunluk 8'in altına düştüğünde özyineleme durur.

```{lang: html}
<canvas width="600" height="300"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  function branch(length, angle, scale) {
    cx.fillRect(0, 0, 1, length);
    if (length < 8) return;
    cx.save();
    cx.translate(0, length);
    cx.rotate(-angle);
    branch(length * scale, angle, scale);
    cx.rotate(2 * angle);
    branch(length * scale, angle, scale);
    cx.restore();
  }
  cx.translate(300, 0);
  branch(60, 0.5, 0.8);
</script>
```

{{if book

Sonuç, basit bir fraktal olur.

{{figure {url: "img/canvas_tree.png", alt: "Fraktalın ekran görüntüsü", width: "5cm"}}}

if}}

{{index "save method", "restore method", canvas, "rotate method"}}

Eğer `save` ve `restore` çağrıları olmasaydı, `branch` fonksiyonunun ikinci özyinelemeli çağrısı, ilk çağrı tarafından oluşturulan konum ve döndürme ile sonuçlanırdı. Mevcut dala bağlı olmazdı, bunun yerine ilk çağrı tarafından çizilen en içteki, en sağdaki dala bağlı olurdu. Ortaya çıkan şekil de ilginç olabilir, ancak kesinlikle bir ağaç olmazdı.

{{id canvasdisplay}}

## Oyuna geri dönelim

{{index "drawImage method"}}

Artık ((canvas)) çizimi hakkında yeterince bilgiye sahibiz, [önceki bölümdeki](game) ((oyun)) için ((canvas)) tabanlı bir ((görüntüleme)) sistemi üzerinde çalışmaya başlayabiliriz. Yeni görüntüleme sistemi artık sadece renkli kutular göstermeyecek. Bunun yerine, oyunun öğelerini temsil eden resimleri çizmek için `drawImage` kullanacağız.

{{index "CanvasDisplay class", "DOMDisplay class", [interface, object]}}

`DOMDisplay` gibi bir arabirimi destekleyen, `CanvasDisplay` adında başka bir görüntüleme nesne türü tanımlıyoruz, yani `syncState` ve `clear` metodları.

{{index [state, "in objects"]}}

Bu nesne, `DOMDisplay`'den biraz daha fazla bilgi tutar. DOM öğesinin kaydırma konumunu kullanmak yerine, şu anda seviyenin hangi bölümüne baktığımızı bize bildiren kendi ((görünüm alanını)) izler. Son olarak, oyuncu sabit durduğunda bile son hareket ettiği yöne bakmasını sağlamak için bir `flipPlayer` özelliği tutar.

```{sandbox: "game", includeCode: true}
class CanvasDisplay {
  constructor(parent, level) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = Math.min(600, level.width * scale);
    this.canvas.height = Math.min(450, level.height * scale);
    parent.appendChild(this.canvas);
    this.cx = this.canvas.getContext("2d");

    this.flipPlayer = false;

    this.viewport = {
      left: 0,
      top: 0,
      width: this.canvas.width / scale,
      height: this.canvas.height / scale
    };
  }

  clear() {
    this.canvas.remove();
  }
}
```

`syncState` metodu, önce yeni bir görünüm alanı (viewport) hesaplar ve ardından oyun sahnesini uygun konumda çizer.

```{sandbox: "game", includeCode: true}
CanvasDisplay.prototype.syncState = function(state) {
  this.updateViewport(state);
  this.clearDisplay(state.status);
  this.drawBackground(state.level);
  this.drawActors(state.actors);
};
```

{{index scrolling, clearing}}

`DOMDisplay`'in aksine, bu görüntüleme stili her güncellemede arka planı yeniden çizmek zorundadır. Çünkü bir canvas üzerindeki şekiller sadece ((piksel))lerden oluşur; onları çizdikten sonra hareket ettirmek veya kaldırmak için iyi bir yol yoktur. Canvas görüntülemeyi güncellemenin tek yolu, canvas'ı temizlemek ve sahneyi yeniden çizmektir. Ayrıca kaydırma yapmış olabiliriz, bu da arka planın farklı bir konumda olmasını gerektirir.

{{index "CanvasDisplay class"}}

`updateViewport` metodu, `DOMDisplay`'in `scrollPlayerIntoView` metoduna benzer. Oyuncunun ekranın kenarına çok yakın olup olmadığını kontrol eder ve bu durumda ((görünüm alanını)) hareket ettirir.

```{sandbox: "game", includeCode: true}
CanvasDisplay.prototype.updateViewport = function(state) {
  let view = this.viewport, margin = view.width / 3;
  let player = state.player;
  let center = player.pos.plus(player.size.times(0.5));

  if (center.x < view.left + margin) {
    view.left = Math.max(center.x - margin, 0);
  } else if (center.x > view.left + view.width - margin) {
    view.left = Math.min(center.x + margin - view.width,
                         state.level.width - view.width);
  }
  if (center.y < view.top + margin) {
    view.top = Math.max(center.y - margin, 0);
  } else if (center.y > view.top + view.height - margin) {
    view.top = Math.min(center.y + margin - view.height,
                        state.level.height - view.height);
  }
};
```

{{index boundary, "Math.max function", "Math.min function", clipping}}

`Math.max` ve `Math.min` çağrıları, görünüm alanının seviyenin dışındaki alanı göstermemesini sağlar. `Math.max(x, 0)`, elde edilen sayının sıfırdan küçük olmadığından emin olur. Benzer şekilde, `Math.min` bir değerin belirli bir sınırın altında kalmasını garanti eder.

Görüntüleme ((temizlenirken)), oyunun kazanılıp kazanılmadığına bağlı olarak (kazanıldıysa daha parlak, kaybedildiyse daha koyu) biraz farklı bir ((renk)) kullanacağız.

```{sandbox: "game", includeCode: true}
CanvasDisplay.prototype.clearDisplay = function(status) {
  if (status == "won") {
    this.cx.fillStyle = "rgb(68, 191, 255)";
  } else if (status == "lost") {
    this.cx.fillStyle = "rgb(44, 136, 214)";
  } else {
    this.cx.fillStyle = "rgb(52, 166, 251)";
  }
  this.cx.fillRect(0, 0,
                   this.canvas.width, this.canvas.height);
};
```

{{index "Math.floor function", "Math.ceil function", rounding}}

Arka planı çizmek için, [önceki bölümdeki](game#touches) `touches` metodunda kullanılan aynı yöntemi kullanarak, mevcut görünüm alanında görünen fayanslar arasında dolaşırız. Bu sayede sadece görünüm alanında olan fayanslar işlenir ve çizilir.

```{sandbox: "game", includeCode: true}
let otherSprites = document.createElement("img");
otherSprites.src = "img/sprites.png";

CanvasDisplay.prototype.drawBackground = function(level) {
  let {left, top, width, height} = this.viewport;
  let xStart = Math.floor(left);
  let xEnd = Math.ceil(left + width);
  let yStart = Math.floor(top);
  let yEnd = Math.ceil(top + height);

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let tile = level.rows[y][x];
      if (tile == "empty") continue;
      let screenX = (x - left) * scale;
      let screenY = (y - top) * scale;
      let tileX = tile == "lava" ? scale : 0;
      this.cx.drawImage(otherSprites,
                        tileX,         0, scale, scale,
                        screenX, screenY, scale, scale);
    }
  }
};
```

{{index "drawImage method", sprite, tile}}

Boş olmayan fayanslar `drawImage` ile çizilir. `otherSprites` resmi, oyuncu dışında kalan öğeler için kullanılan resimleri içerir. Soldan sağa, duvar fayansı, lav fayansı ve bir para sprite'ı içerir.

{{figure {url: "img/sprites_big.png", alt: "Piksel sanatı, üç sprite'ı gösteriyor: küçük beyaz taşlardan yapılmış bir duvar parçası, bir kare turuncu lav ve yuvarlak bir para.", width: "1.4cm"}}}

{{index scaling}}

Arka plan fayansları 20 x 20 pikseldir, çünkü `DOMDisplay`'de kullandığımız ölçeği (scale) aynı şekilde kullanacağız. Bu nedenle, lav fayanslarının kaydırma değeri 20'dir (`scale` bağlamının değeri) ve duvarlar için kaydırma değeri 0'dır.

{{index drawing, "load event", "drawImage method"}}

Sprite resmi yüklenmesini beklemiyoruz. Henüz yüklenmemiş bir resimle `drawImage` çağrısı yapmak, hiçbir şey yapmaz. Bu nedenle, resim hala yüklenirken ilk birkaç ((kare))de oyunu doğru şekilde çizemeyebiliriz, ancak bu ciddi bir sorun değildir. Ekranı sürekli olarak güncellediğimiz için yükleme tamamlandığında doğru sahne görünecektir.

{{index "player", [animation, "platform game"], drawing}}

Daha önce gösterilen ((yürüyen)) karakter, oyuncuyu temsil etmek için kullanılacaktır. Bunu çizen kod, oyuncunun mevcut hareketine göre doğru ((sprite))'ı ve yönü seçmelidir. İlk sekiz sprite, bir yürüme animasyonu içerir. Oyuncu bir zeminde hareket ederken, mevcut zamana göre bu animasyon kareleri arasında geçiş yaparız. Kareleri her 60 milisaniyede bir değiştirmek istiyoruz, bu yüzden ((zaman)) önce 60'a bölünür. Oyuncu hareketsiz durduğunda, dokuzuncu sprite'ı çizeriz. Dikey hızın sıfır olmamasıyla tanınan zıplamalar sırasında, sağdaki onuncu sprite'ı kullanırız.

{{index "flipHorizontally function", "CanvasDisplay class"}}

Çünkü ((sprite))ler, ayaklar ve kollar için biraz yer sağlamak amacıyla oyuncu nesnesinden biraz daha geniştir—24 piksel yerine 16 piksel—, metod x-koordinatını ve genişliği belirli bir miktar (`playerXOverlap`) ayarlamak zorundadır.

```{sandbox: "game", includeCode: true}
let playerSprites = document.createElement("img");
playerSprites.src = "img/player.png";
const playerXOverlap = 4;

CanvasDisplay.prototype.drawPlayer = function(player, x, y,
                                              width, height){
  width += playerXOverlap * 2;
  x -= playerXOverlap;
  if (player.speed.x != 0) {
    this.flipPlayer = player.speed.x < 0;
  }

  let tile = 8;
  if (player.speed.y != 0) {
    tile = 9;
  } else if (player.speed.x != 0) {
    tile = Math.floor(Date.now() / 60) % 8;
  }

  this.cx.save();
  if (this.flipPlayer) {
    flipHorizontally(this.cx, x + width / 2);
  }
  let tileX = tile * width;
  this.cx.drawImage(playerSprites, tileX, 0, width, height,
                                   x,     y, width, height);
  this.cx.restore();
};
```

`drawPlayer` metodu, oyundaki tüm aktörleri çizmekten sorumlu olan `drawActors` tarafından çağrılır.

```{sandbox: "game", includeCode: true}
CanvasDisplay.prototype.drawActors = function(actors) {
  for (let actor of actors) {
    let width = actor.size.x * scale;
    let height = actor.size.y * scale;
    let x = (actor.pos.x - this.viewport.left) * scale;
    let y = (actor.pos.y - this.viewport.top) * scale;
    if (actor.type == "player") {
      this.drawPlayer(actor, x, y, width, height);
    } else {
      let tileX = (actor.type == "coin" ? 2 : 1) * scale;
      this.cx.drawImage(otherSprites,
                        tileX, 0, width, height,
                        x,     y, width, height);
    }
  }
};
```

Oyuncu dışındaki bir şeyi ((çizerken)), doğru sprite'ın kaydırma değerini bulmak için türüne bakarız. ((Lava)) fayansı 20 kaydırma değerinde, ((coin)) sprite'ı ise 40 kaydırma değerinde (`scale`'in iki katı) bulunur.

{{index viewport}}

Aktörün pozisyonunu hesapladığımızda görünüm alanının konumunu çıkarmamız gerekir çünkü (0,0) canvas'ımızda seviyenin sol üst köşesi yerine görünüm alanının sol üst köşesine karşılık gelir. Bunun için `translate` de kullanılabilirdi. Her iki yöntem de işe yarar.

{{if interactive

Bu belge, yeni görüntüleme sistemini `runGame`'e bağlar:

```{lang: html, sandbox: game, focus: yes, startCode: true}
<body>
  <script>
    runGame(GAME_LEVELS, CanvasDisplay);
  </script>
</body>
```

if}}

{{if book

{{index [game, screenshot], [game, "with canvas"]}}

Bu, yeni ((görüntüleme)) sistemini tamamlar. Ortaya çıkan oyun aşağıdaki gibi görünür:

{{figure {url: "img/canvas_game.png", alt: "Canvas üzerinde gösterilen oyunun ekran görüntüsü", width: "8cm"}}}

if}}

{{id graphics_tradeoffs}}

## Bir grafik arayüzü seçme

Bu nedenle, tarayıcıda grafik üretmeniz gerektiğinde, düz HTML, ((SVG)) ve ((canvas)) arasında seçim yapabilirsiniz. Tüm durumlarda işe yarayan tek bir _en iyi_ yaklaşım yoktur. Her seçeneğin güçlü ve zayıf yönleri vardır.

{{index "text wrapping"}}

Düz HTML'nin basit olma avantajı vardır. Ayrıca, ((metin)) ile iyi entegre olur. Hem SVG hem de canvas metin çizmenizi sağlar, ancak bu metni konumlandırmanıza veya birden fazla satır aldığında sarmanıza yardımcı olmaz. HTML tabanlı bir resimde, metin bloklarını dahil etmek çok daha kolaydır.

{{index zooming, SVG}}

SVG, herhangi bir yakınlaştırma seviyesinde iyi görünen keskin ((grafikler)) üretmek için kullanılabilir. HTML'den farklı olarak, çizim için tasarlanmıştır ve bu nedenle bu amaç için daha uygundur.

{{index [DOM, graphics], SVG, "event handling", ["data structure", tree]}}

Hem SVG hem de HTML, resminizi temsil eden bir veri yapısı (DOM) oluşturur. Bu, çizildikten sonra öğeleri değiştirmenizi sağlar. Kullanıcının yaptığı şeye yanıt olarak veya bir ((animasyon))un parçası olarak büyük bir ((resmin)) küçük bir bölümünü tekrar tekrar değiştirmeniz gerekiyorsa, bunu canvas'ta yapmak gereksiz yere pahalı olabilir. DOM ayrıca resimdeki her öğe üzerinde (SVG ile çizilen şekillerde bile) fare olay işleyicileri kaydetmemize olanak tanır. Bunu canvas ile yapamazsınız.

{{index performance, optimization}}

Ancak ((canvas))'ın piksel odaklı yaklaşımı, çok sayıda küçük öğe çizerken avantaj sağlayabilir. Bir veri yapısı oluşturmaması ve yalnızca aynı piksel yüzeyine tekrar tekrar çizim yapması nedeniyle, canvas her şekil için daha düşük maliyete sahiptir.

{{index "ray tracer"}}

Bir sahneyi bir seferde bir piksel olarak işlemek (örneğin, bir ışın izleyici kullanarak) veya bir görüntüyü JavaScript ile son işleme tabi tutmak (bulanıklaştırma veya bozma gibi) gibi bazı efektler, sadece bir piksel tabanlı yaklaşımla gerçekçi bir şekilde ele alınabilir.

Bazı durumlarda, bu tekniklerin birkaçını birleştirmek isteyebilirsiniz. Örneğin, bir ((grafik))i ((SVG)) veya ((canvas)) ile çizebilir, ancak resmin üzerinde bir HTML öğesi konumlandırarak ((metin))sel bilgileri gösterebilirsiniz.

{{index display}}

Düşük gereksinimli uygulamalarda, hangi arayüzü seçeceğiniz gerçekten çok önemli değildir. Bu bölümde oyunumuz için oluşturduğumuz görüntüleme, metin çizmeye, fare etkileşimini işlemeye veya olağanüstü büyük sayıda öğe ile çalışmaya gerek duymadığı için, bu üç ((grafik)) teknolojisinden herhangi biri kullanılarak uygulanabilirdi.

## Özet

Bu bölümde, tarayıcıda grafik çizme tekniklerini, özellikle `<canvas>` öğesine odaklanarak ele aldık.

Bir canvas düğümü, programımızın üzerinde çizebileceği bir belge alanını temsil eder. Bu çizim, `getContext` metodu ile oluşturulan bir çizim bağlamı nesnesi aracılığıyla yapılır.

2D çizim arayüzü, çeşitli şekilleri doldurmamıza ve çizmemize olanak tanır. Bağlamın `fillStyle` özelliği, şekillerin nasıl doldurulacağını belirler. `strokeStyle` ve `lineWidth` özellikleri, çizgilerin nasıl çizileceğini kontrol eder.

Dikdörtgenler ve metin parçaları tek bir metod çağrısı ile çizilebilir. `fillRect` ve `strokeRect` metodları dikdörtgenleri çizer, `fillText` ve `strokeText` metodları ise metin çizer. Özel şekiller oluşturmak için önce bir yol oluşturmamız gerekir.

{{index stroking, filling}}

`beginPath` çağrısı, yeni bir yol başlatır. Bir dizi başka metod, mevcut yola çizgiler ve eğriler ekler. Örneğin, `lineTo` düz bir çizgi ekleyebilir. Bir yol tamamlandığında, `fill` metodu ile doldurulabilir veya `stroke` metodu ile çizilebilir.

Bir görüntüden veya başka bir canvastan pikselleri canvasımıza taşımak `drawImage` metodu ile yapılır. Varsayılan olarak, bu metot tüm kaynak görüntüyü çizer, ancak ona daha fazla parametre vererek görüntünün belirli bir alanını kopyalayabilirsiniz. Oyunumuzda, bu yöntemi, birden fazla poz içeren bir görüntüden oyun karakterinin tek tek pozlarını kopyalamak için kullandık.

Dönüşümler, bir şekli birden fazla yönde çizmenize olanak tanır. Bir 2D çizim bağlamı, `translate`, `scale` ve `rotate` metodları ile değiştirilebilen mevcut bir dönüşüme sahiptir. Bu, sonraki tüm çizim işlemlerini etkiler. Bir dönüşüm durumu `save` metodu ile kaydedilebilir ve `restore` metodu ile geri yüklenebilir.

Canvas üzerinde bir animasyon gösterilirken, yeniden çizmeden önce canvasın bir kısmını temizlemek için `clearRect` metodu kullanılabilir.

## Egzersizler

### Şekiller

{{index "shapes (exercise)"}}

Aşağıdaki ((şekil))leri bir ((canvas)) üzerine çizen bir program yazın:

{{index rotation}}

1. Bir ((trapezoid)) (bir tarafı daha geniş olan bir ((dikdörtgen)))

2. Kırmızı bir ((elmas)) (45 derece veya ¼π radyan döndürülmüş bir dikdörtgen)

3. Zigzag şeklinde bir ((çizgi))

4. 100 düz çizgi parçasından oluşan bir ((spiral))

5. Sarı bir ((yıldız))

{{figure {url: "img/exercise_shapes.png", alt: "Çizmeniz istenen şekilleri gösteren resim", width: "8cm"}}}

Son iki şekli çizerken, bu fonksiyonları kullanarak bir çember üzerindeki koordinatları nasıl elde edeceğinizi açıklayan [bölüm ?](dom#sin_cos) içindeki `Math.cos` ve `Math.sin` açıklamasına başvurmak isteyebilirsiniz.

{{index readability, "hard-coding"}}

Her şekil için bir fonksiyon oluşturmanızı öneririm. Pozisyonu ve isteğe bağlı olarak boyut veya nokta sayısı gibi diğer özellikleri parametre olarak geçirin. Alternatif olarak, kodunuzda her yere sabit sayılar yazmak, kodu gereksiz yere okunması ve değiştirilmesi zor hale getirme eğilimindedir.

{{if interactive

```{lang: html, test: no}
<canvas width="600" height="200"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");

  // Your code here.
</script>
```

if}}

{{hint

{{index [path, canvas], "shapes (exercise)"}}

((Trapezoid)) (1) bir yol kullanılarak çizilmesi en kolay olanıdır. Uygun merkez koordinatlarını seçin ve merkezin etrafına dört köşeyi ekleyin.

{{index "flipHorizontally function", rotation}}

((Diamond)) (2) bir yol ile doğrudan veya ilginç bir şekilde `rotate` ((dönüşüm))ü kullanarak çizilebilir. Dönüşüm kullanmak için, `flipHorizontally` fonksiyonunda yaptığımıza benzer bir hile uygulamanız gerekecek. Dikdörtgeninizin merkezi etrafında ve (0,0) noktası etrafında döndürmek istemediğinizden, önce oraya `translate` yapmalı, sonra döndürmeli ve ardından geri `translate` yapmalısınız.

Herhangi bir şekil çizdikten sonra, oluşturulan dönüşümün sıfırlandığından emin olun.

{{index "remainder operator", "% operator"}}

((Zigzag)) (3) için, her bir çizgi parçası için yeni bir `lineTo` çağrısı yazmak pratik olmaz. Bunun yerine bir ((döngü)) kullanmalısınız. Her yineleme iki ((çizgi)) segmenti (önce sağa, sonra tekrar sola) çizebilir veya bir segment çizebilir; bu durumda döngü indeksinin çiftliğini (`% 2`) kullanarak sola mı yoksa sağa mı gideceğinizi belirlemelisiniz.

((Spiral)) (4) için de bir döngüye ihtiyacınız olacak. Eğer spiral merkezinin etrafında bir daire boyunca ilerleyen bir dizi nokta çizerseniz, bir daire elde edersiniz. Döngü sırasında, mevcut noktayı koyduğunuz dairenin yarıçapını değiştirir ve birden fazla kez çevirirseniz, sonuç bir spiral olur.

{{index "quadraticCurveTo method"}}

Görseldeki ((yıldız)) (5), `quadraticCurveTo` çizgilerinden oluşmuştur. Düz çizgilerle de bir yıldız çizebilirsiniz. Sekiz noktaya sahip bir yıldız için bir çemberi sekiz parçaya bölün veya istediğiniz kadar parça yapın. Bu noktalar arasında çizgiler çizin, onları yıldızın merkezine doğru eğin. `quadraticCurveTo` ile merkezi kontrol noktası olarak kullanabilirsiniz.

hint}}

{{id exercise_pie_chart}}

### Pasta grafiği

{{index label, text, "pie chart example"}}

Bölümün [daha önceki](canvas#pie_chart) kısmında, bir pasta grafiği çizen örnek bir program gördük. Bu programı, her kategorinin adının, onu temsil eden dilimin yanında gösterilecek şekilde değiştireceğiz. Diğer veri setleri için de işe yarayacak, hoş görünümlü bir yol bulmaya çalışın. Kategorilerin, etiketleri için yeterince alan bırakacak kadar büyük olduğunu varsayabilirsiniz.

Yine `Math.sin` ve `Math.cos` fonksiyonlarına ihtiyaç duyabilirsiniz; bu fonksiyonlar [bölüm ?](dom#sin_cos) içinde açıklanmıştır.

{{if interactive

```{lang: html, test: no}
<canvas width="600" height="300"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let total = results
    .reduce((sum, {count}) => sum + count, 0);
  let currentAngle = -0.5 * Math.PI;
  let centerX = 300, centerY = 150;

  // Add code to draw the slice labels in this loop.
  for (let result of results) {
    let sliceAngle = (result.count / total) * 2 * Math.PI;
    cx.beginPath();
    cx.arc(centerX, centerY, 100,
           currentAngle, currentAngle + sliceAngle);
    currentAngle += sliceAngle;
    cx.lineTo(centerX, centerY);
    cx.fillStyle = result.color;
    cx.fill();
  }
</script>
```

if}}

{{hint

{{index "fillText method", "textAlign property", "textBaseline property", "pie chart example"}}

Etiketlerin konumlandırılması için `fillText` çağırmanız ve bağlamın `textAlign` ve `textBaseline` özelliklerini metnin istediğiniz yerde olması için ayarlamanız gerekecek.

Etiketleri konumlandırmanın mantıklı bir yolu, metni pastanın merkezinden dilimin ortasından geçen çizgi üzerinde yerleştirmek olacaktır. Metni pastanın yanına doğrudan koymak yerine, pastanın kenarından belirli bir piksel sayısı kadar dışarı taşımak isteyebilirsiniz.

Bu çizginin ((açısı)) `currentAngle + 0.5 * sliceAngle` şeklindedir. Aşağıdaki kod, merkezden 120 piksel uzaklıkta bu çizgi üzerindeki bir konumu bulur:

```{test: no}
let middleAngle = currentAngle + 0.5 * sliceAngle;
let textX = Math.cos(middleAngle) * 120 + centerX;
let textY = Math.sin(middleAngle) * 120 + centerY;
```

`textBaseline` için `"middle"` değeri, bu yaklaşımı kullanırken muhtemelen uygun olacaktır. `textAlign` için hangi değerin kullanılacağı, çemberin hangi tarafında olduğumuza bağlıdır. Sol tarafta, `"right"` kullanılmalı ve sağ tarafta `"left"` kullanılmalı, böylece metin pastadan uzağa konumlandırılır.

{{index "Math.cos function"}}

Belirli bir açının çemberin hangi tarafında olduğunu nasıl bulacağınızdan emin değilseniz, [bölüm ?](dom#sin_cos) içindeki `Math.cos` açıklamasına bakabilirsiniz. Bir açının kosinüsü, hangi x-koordinatına karşılık geldiğini ve dolayısıyla tam olarak çemberin hangi tarafında olduğumuzu bize bildirir.

hint}}

### Zıplayan bir top

{{index [animation, "bouncing ball"], "requestAnimationFrame function", bouncing}}

[Bölüm ?](dom#animationFrame) ve [bölüm ?](game#runAnimation) içinde gördüğümüz `requestAnimationFrame` tekniğini kullanarak bir ((kutu)) içinde zıplayan bir ((top)) çizin. Top sabit bir ((hız))da hareket eder ve kutunun kenarlarına çarptığında sekerek geri döner.

{{if interactive

```{lang: html, test: no}
<canvas width="400" height="400"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");

  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      updateAnimation(Math.min(100, time - lastTime) / 1000);
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function updateAnimation(step) {
    // Your code here.
  }
</script>
```

if}}

{{hint

{{index "strokeRect method", animation, "arc method"}}

Bir ((kutu)) `strokeRect` ile kolayca çizilebilir. Kutu genişliği ve yüksekliği farklıysa, boyutunu tutan bir bağlama veya iki bağlama tanımlayın. Yuvarlak bir ((top)) oluşturmak için bir yol başlatın ve `arc(x, y, radius, 0, 7)` çağrısı yapın; bu, sıfırdan tam bir çemberden daha fazlasına kadar bir yay oluşturur. Ardından yolu doldurun.

{{index "collision detection", "Vec class"}}

Topun konumunu ve ((hızını)) modellemek için [bölüm ?](game#vector) içindeki `Vec` sınıfını kullanabilirsiniz [(bu sayfada mevcuttur)]{if interactive}. Başlangıçta, tercihen tamamen dikey veya yatay olmayan bir hız verin ve her ((kare))de bu hızı geçen zaman miktarıyla çarpın. Top dikey bir duvara çok yaklaştığında, hızının x bileşenini ters çevirin. Aynı şekilde, yatay bir duvara çarptığında y bileşenini ters çevirin.

{{index "clearRect method", clearing}}

Topun yeni konumunu ve hızını bulduktan sonra, sahneyi silmek için `clearRect` kullanın ve yeni konumunu kullanarak sahneyi yeniden çizin.

hint}}

### Önceden hesaplanmış yansıtma

{{index optimization, "bitmap graphics", mirror}}

Dönüşümlerin (transformations) talihsiz bir yanı, bit eşlemlerinin (bitmaps) çizimini yavaşlatmalarıdır. Her ((piksel))in konumu ve boyutu dönüştürülmek zorundadır ve ((gelecekte)) tarayıcıların dönüşüm konusunda daha akıllı hale gelmesi mümkün olsa da, şu anda bu işlem bir bit eşlem çizmek için geçen sürede ölçülebilir bir artışa neden olur.

Bizimki gibi sadece tek bir dönüştürülmüş sprite çizen bir oyunda bu bir sorun değildir. Ancak, yüzlerce karakter veya bir patlamadan gelen binlerce dönen parçacık çizmemiz gerektiğini hayal edin.

Ek resim dosyaları yüklemeden ve her karede dönüştürülmüş `drawImage` çağrıları yapmadan ters çevrilmiş bir karakter çizmenin bir yolunu düşünün.

{{hint

{{index mirror, scaling, "drawImage method"}}

Çözümün anahtarı, `drawImage` kullanırken bir ((canvas)) öğesini kaynak resim olarak kullanabilmemizdir. Belgeye eklemeden, ek bir `<canvas>` öğesi oluşturmak ve ters çevrilmiş sprite'larımızı bir kez ona çizmek mümkündür. Gerçek bir kare çizerken, sadece önceden ters çevrilmiş sprite'ları ana canvas'a kopyalarız.

{{index "load event"}}

Dikkat edilmesi gereken bazı noktalar vardır, çünkü görüntüler anında yüklenmez. Ters çevrilmiş çizim işlemi yalnızca bir kez yapılır ve eğer görüntü yüklenmeden önce yaparsak, hiçbir şey çizilmeyecektir. Görüntü üzerine bir `"load"` olay işleyicisi yerleştirilebilir ve bu, ters çevrilmiş görüntüleri ek canvas'a çizebilir. Bu canvas, hemen bir çizim kaynağı olarak kullanılabilir (karakteri üzerine çizene kadar sadece boş olacaktır).

hint}}
