# JavaScript ve Tarayıcı(Browser)

{{quote {author: "Tim Berners-Lee", title: "World Wide Web: Kısa kişisel bir tarih", chapter: true}

Web’in ardındaki hayal, bilgi paylaşarak iletişim kurduğumuz ortak bir bilgi alanıdır. Evrenselliği esastır: Bir hiper metin bağlantısının, kişisel, yerel veya küresel, taslak veya çok iyi hazırlanmış olmasına bakılmaksızın herhangi bir şeye işaret edebilmesidir.

quote}}

{{index "Berners-Lee, Tim", "World Wide Web", HTTP, [JavaScript, "history of"], "World Wide Web"}}

{{figure {url: "img/chapter_picture_13.jpg", alt: "Bir telefon santralini gösteren illüstrasyon", chapter: "framed"}}}

Bu kitabın sonraki bölümleri web tarayıcılarından bahsedecek. Web ((tarayıcı))ları olmadan, JavaScript de olmazdı. Olsa bile, kimse ona asla dikkat etmezdi.

{{index decentralization, compatibility}}

Web teknolojisi başlangıçtan itibaren sadece teknik olarak değil, aynı zamanda evrim şekli bakımından da merkezi olmayan bir yapıya sahip olmuştur. Çeşitli tarayıcı satıcıları, bazen düzensiz ve bazen de kötü düşünülmüş yollarla yeni fonksiyonellikler eklemiş, bu da bazen diğerleri tarafından benimsenmiş ve sonunda ((standartlar)) olarak belirlenmiştir.

Bu hem bir nimet hem de bir lanettir. Bir yandan, merkezi bir otoritenin bir sistemi kontrol etmemesi ve bunun yerine çeşitli taraflarca gevşek ((işbirliği)) içinde (ya da bazen açık düşmanlıkla) geliştirilmesi güçlendirici bir durumdur. Diğer yandan, Web’in gelişigüzel bir şekilde geliştirilmiş olması, ortaya çıkan sistemin içsel ((tutarlılık)) açısından parlak bir örnek olmamasına neden olur. Bazı kısımları oldukça kafa karıştırıcı ve kötü tasarlanmış durumdadır.

## Ağlar ve İnternet

Bilgisayar ((ağ))ları 1950’lerden beri var. İki veya daha fazla bilgisayar arasında kablolar döşeyip bu kablolar aracılığıyla veri alışverişi yapmalarına izin verirseniz, her türlü harika şeyi yapabilirsiniz.

Ve aynı binadaki iki makineyi bağlamak harika şeyler yapmamızı sağlıyorsa, tüm gezegen üzerindeki makineleri bağlamak daha da iyi olmalıdır. Bu vizyonu hayata geçirecek teknoloji 1980’lerde geliştirildi ve ortaya çıkan ağa _((İnternet))_ adı verildi. Bu sözünü yerine getirdi.

Bir bilgisayar bu ağı kullanarak başka bir bilgisayara bit gönderebilir. Bu bit gönderiminden etkili bir ((iletişim)) sağlamak için, her iki uçtaki bilgisayarlar bitlerin neyi temsil etmesi gerektiğini bilmelidir. Herhangi bir bit dizisinin anlamı, tamamen ifade etmeye çalıştığı şeye ve kullanılan ((kodlama)) mekanizmasına bağlıdır.

{{index [network, protocol]}}

Bir ağ ((protokolü)), bir ağ üzerindeki iletişim tarzını tanımlar. E-posta göndermek, e-posta almak, dosya paylaşmak ve hatta kötü niyetli yazılımlarla enfekte olmuş bilgisayarları kontrol etmek için protokoller vardır.

{{indexsee "Hypertext Transfer Protocol", HTTP}}

_Hypertext Transfer Protocol_ (((HTTP))), adlandırılmış ((kaynak))ların (web sayfaları veya resimler gibi bilgi parçalarının) alınması için bir protokoldür. İstek yapan tarafın, kaynağı ve kullanmak istediği protokolün sürümünü adlandıran şöyle bir satırla başlamasını belirtir:

```{lang: http}
GET /index.html HTTP/1.1
```

İstek yapan tarafın daha fazla bilgi ekleyebilmesi ve diğer tarafın kaynağı nasıl paketlediği hakkında daha fazla kural vardır. HTTP’yi [bölüm ?](http) içinde biraz daha detaylı inceleyeceğiz.

{{index layering, stream, ordering}}

Çoğu protokol, diğer protokoller üzerine kuruludur. HTTP, ağın içine bitler koyabileceğiniz ve bunların doğru sırayla doğru yere varmasını sağlayan bir cihaz gibi davranır. Ağın sağladığı bu ilkel veri gönderimi üzerinde bu işi sağlamak oldukça zor bir problemdir.

{{index TCP}}

{{indexsee "Transmission Control Protocol", TCP}}

_Transmission Control Protocol_ (TCP), bu problemi ele alan bir ((protokol))dür. Tüm internet bağlantılı cihazlar bunu “konuşur” ve İnternet’teki çoğu iletişim bunun üzerine kuruludur.

{{index "listening (TCP)"}}

Bir TCP ((bağlantısı)) şu şekilde çalışır: Bir bilgisayar, diğer bilgisayarların kendisiyle konuşmaya başlamasını bekler ya da _dinler_. Aynı makinede aynı anda farklı türlerde iletişimleri dinleyebilmek için, her dinleyicinin kendisiyle ilişkilendirilen bir numarası (bir _((port))_) vardır. Çoğu ((protokol)), varsayılan olarak hangi portun kullanılacağını belirtir. Örneğin, ((SMTP)) protokolünü kullanarak bir e-posta göndermek istediğimizde, gönderdiğimiz makinenin port 25’te dinlemesi beklenir.

Daha sonra başka bir bilgisayar, doğru port numarasını kullanarak hedef makineye bağlanarak bir ((bağlantı)) kurabilir. Hedef makineye erişilebilir ve o portta dinliyorsa, bağlantı başarılı bir şekilde kurulur. Dinleyen bilgisayara _((server))_, bağlanan bilgisayara ise _((client))_ denir.

{{index [abtraction, "of the network"]}}

Böyle bir bağlantı, iki yönlü bir ((boru)) gibi davranır - her iki uçtaki makineler de içine veri koyabilir. Bitler başarıyla iletildikten sonra, karşı taraftaki makine tarafından yeniden okunabilir. Bu, uygun bir modeldir. ((TCP))’nin ağa bir soyutlama sağladığı söylenebilir.

{{id web}}

## Web

_((World Wide Web))_ (tüm ((Internet)) ile karıştırılmamalıdır), bir tarayıcıda web sayfalarını ziyaret etmemizi sağlayan bir dizi ((protokol)) ve formattır. İsmin “Web” kısmı, bu sayfaların kolayca birbirine bağlanabilmesine ve böylece kullanıcıların içinde hareket edebileceği büyük bir ((ağ)) oluşturmasına atıfta bulunur.

Web’in bir parçası olmak için yapmanız gereken tek şey, bir makineyi ((Internet))e bağlamak ve ((HTTP)) protokolü ile port 80’de dinlemesini sağlamaktır, böylece diğer bilgisayarlar belgeleri isteyebilir.

{{index URL}}

{{indexsee "Uniform Resource Locator", URL}}

Web’deki her ((belge))ye Uniform Resource Locator (URL) adı verilir ve şu şekilde görünür:

```{lang: null}
  http://eloquentjavascript.net/13_browser.html
 |      |                      |               |
 protocol       server               path
```

{{index HTTPS}}

İlk kısım, bu URL’nin HTTP ((protokolü))nü kullandığını belirtir (örneğin, şifrelenmiş HTTP, _https://_ olacaktır). Ardından, belgenin hangi ((server))dan isteneceğini belirleyen kısım gelir. Son olarak, ilgilendiğimiz belirli belgeyi (veya _((kaynak))_) tanımlayan bir yol dizesi gelir.

İnternete bağlanan makineler bir _((IP adresi))_ alır, bu, o makineye mesaj göndermek için kullanılabilen bir numaradır ve `149.210.142.219` veya `2001:4860:4860::8888` gibi görünür. Ancak rastgele sayıların listeleri hatırlaması zor ve yazması zahmetlidir, bu yüzden belirli bir adres veya adres seti için bir _((domain))_ adı kaydedebilirsiniz. Kontrol ettiğim bir makineye işaret etmek için eloquentjavascript.net kaydettim ve bu domain adını kullanarak web sayfaları sunabilirim.

{{index browser}}

Bu URL’yi tarayıcınızın ((adres çubuğu))na yazarsanız, tarayıcı bu URL’deki ((belge))yi almaya ve görüntülemeye çalışacaktır. Önce tarayıcınız _eloquentjavascript.net_‘in hangi adrese karşılık geldiğini bulmalıdır. Ardından, ((HTTP)) protokolünü kullanarak, o adresteki server’a bir bağlantı kuracak ve _/13_browser.html_ kaynağını isteyecektir. Her şey yolunda giderse, server bir belge gönderir ve tarayıcınız bu belgeyi ekranınızda görüntüler.

## HTML

{{index HTML}}

{{indexsee "Hypertext Markup Language", HTML}}

HTML, _Hypertext Markup Language_’ın kısaltması olup, web sayfaları için kullanılan belge formatıdır. Bir HTML belgesi, metin ile birlikte, metne yapı kazandıran, bağlantılar, paragraflar ve başlıklar gibi şeyleri tanımlayan _((etiketler))_ içerir.

Kısa bir HTML belgesi şu şekilde görünebilir:

```{lang: "html"}
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>My home page</title>
  </head>
  <body>
    <h1>My home page</h1>
    <p>Hello, I am Marijn and this is my home page.</p>
    <p>I also wrote a book! Read it
      <a href="http://eloquentjavascript.net">here</a>.</p>
  </body>
</html>
```

{{if book

Böyle bir belgenin tarayıcıda görünümü şöyle olacaktır:

{{figure {url: "img/home-page.png", alt: "Ana sayfa örnek HTML'sinin işlenmiş bir sürümü",width: "6.3cm"}}}

if}}

{{index [HTML, notation]}}

Açı ((parantez))ler (`<` ve` >`, _küçüktür_ ve _büyüktür_ sembolleri), belgenin ((yapısı)) hakkında bilgi sağlar. Diğer ((metin)) ise sade metindir.

{{index doctype, version}}

Belge `<!doctype html>` ile başlar, bu da tarayıcıya sayfayı _modern_ HTML olarak yorumlamasını, geçmişte kullanılan eski stillerden farklı olarak belirtir.

{{index "head (HTML tag)", "body (HTML tag)", "title (HTML tag)", "h1 (HTML tag)", "p (HTML tag)"}}

HTML belgeleri bir baş ve bir gövdeye sahiptir. Baş, belge _hakkında_ bilgileri içerirken, gövde belgenin kendisini içerir. Bu durumda, baş, belgenin başlığının “Ana sayfam” olduğunu ve UTF-8 kodlamasını kullandığını belirtir; bu, Unicode metnini ikili veri olarak kodlama yöntemidir. Belgenin gövdesi bir başlık (`<h1>`, “başlık 1” anlamına gelir—`<h2>`’den `<h6>`’ya kadar alt başlıklar oluşturur) ve iki ((paragraf)) (`<p>`) içerir.

{{index "href attribute", "a (HTML tag)"}}

Etiketler birkaç formda gelir. Gövde, bir paragraf veya bağlantı gibi bir ((öğe)), bir _((açılış etiketi))_ `<p>` ile başlatılır ve bir _((kapanış etiketi))_ `</p>` ile sonlandırılır. Bağlantı için kullanılan etiket (`<a>`) gibi bazı açılış etiketleri, `name="value"` çiftleri şeklinde ek bilgi içerir. Bunlara _((özellikler))_ denir. Bu durumda, bağlantının hedefi `href="http://eloquentjavascript.net"` ile belirtilir, burada `href` “hiper metin referansı” anlamına gelir.

{{index "src attribute", "self-closing tag", "img (HTML tag)"}}

Bazı ((etiket)) türleri herhangi bir şeyi kapsamaz ve bu nedenle kapatılmaları gerekmez. `<meta charset="utf-8">` etiketi bunun bir örneğidir.

{{index [escaping, "in HTML"]}}

Bir belgenin metninde açı ((parantez))ler kullanabilmek için, HTML’de özel bir anlamı olan bu semboller için özel bir gösterim biçimi tanıtılmalıdır. Düz bir açılış açı parantezi `&lt;` (“küçüktür”) ve kapanış parantezi `&gt;` (“büyüktür”) olarak yazılır. HTML’de, bir isim veya karakter kodu ve noktalı virgül (`;`) ile takip edilen bir ampersand (`&`) karakterine _((varlık))_ denir ve kodladığı karakterle değiştirilir.

{{index ["backslash character", "in strings"], "ampersand character", "double-quote character"}}

Bu, JavaScript dizelerinde ters eğik çizgilerin kullanılma şekline benzer. Bu mekanizma ampersand karakterlerine de özel bir anlam verdiğinden, `&amp;` olarak kaçırılmaları gerekir. Çift tırnak içine alınmış özellik değerleri içinde, gerçek bir tırnak karakteri eklemek için `&quot;` kullanılabilir.

{{index "error tolerance", parsing}}

HTML, oldukça hata tolere eden bir şekilde ayrıştırılır. Eksik olması gereken etiketler olduğunda, tarayıcı bunları otomatik olarak ekler. Bunun yapılma şekli standartlaştırılmıştır ve tüm modern tarayıcıların aynı şekilde yapmasını bekleyebilirsiniz.

Aşağıdaki belge daha önce gösterilen belge ile aynı şekilde ele alınacaktır:

```{lang: "html"}
<!doctype html>

<meta charset=utf-8>
<title>My home page</title>

<h1>My home page</h1>
<p>Hello, I am Marijn and this is my home page.
<p>I also wrote a book! Read it
  <a href=http://eloquentjavascript.net>here</a>.
```

{{index "title (HTML tag)", "head (HTML tag)", "body (HTML tag)", "html (HTML tag)"}}

`<html>`, `<head>`, ve `<body>` etiketleri tamamen ortadan kalkmıştır. Tarayıcı `<meta>` ve `<title>` etiketlerinin başta olduğunu ve `<h1>` etiketinin gövdenin başladığını bilir. Ayrıca, paragrafları açıkça kapatmıyorum çünkü yeni bir paragraf açmak veya belgeyi sonlandırmak onları örtük olarak kapatacaktır. Özellik değerlerinin etrafındaki tırnak işaretleri de yok.

Bu kitap genellikle örneklerde `<html>`, `<head>`, ve `<body>` etiketlerini kısa ve karmaşadan uzak tutmak için ihmal edecektir. Ancak, etiketleri _kapatacağım_ ve özelliklerin etrafında tırnak işaretleri kullanacağım.

{{index browser}}

Ayrıca genellikle ((doctype)) ve `charset` beyanını ihmal edeceğim. Bu, bunları HTML belgelerinden çıkarmanızı teşvik etmek için alınmamalıdır. Tarayıcılar, bunları unuttuğunuzda genellikle saçma şeyler yapar. Örneklerde, bunlar metinde gösterilmediğinde bile, doctype ve `charset` meta verilerinin örtük olarak mevcut olduğunu varsaymalısınız.

{{id script_tag}}

## HTML ve JavaScript

{{index [JavaScript, "in HTML"], "script (HTML tag)"}}

Bu kitabın bağlamında en önemli HTML etiketi `<script>`’tir. Bu etiket, bir belgeye bir parça JavaScript eklememizi sağlar.

```{lang: "html"}
<h1>Testing alert</h1>
<script>alert("hello!");</script>
```

{{index "alert function", timeline}}

Tarayıcı HTML’yi okurken `<script>` etiketi ile karşılaştığında böyle bir betik çalışacaktır. Bu sayfa açıldığında bir iletişim kutusu açılır—`alert` fonksiyonu, küçük bir pencere açarak bir `prompt` gösterir, ancak giriş istemez.

{{index "src attribute"}}

Including large programs directly in HTML documents is often impractical. The `<script>` tag can be given an `src` attribute to fetch a script file (a text file containing a JavaScript program) from a URL.

```{lang: "html"}
<h1>Testing alert</h1>
<script src="code/hello.js"></script>
```

Burada dahil edilen _code/hello.js_ dosyası aynı programı içerir—`alert("hello!")`. Bir HTML sayfası, kendisinin bir parçası olarak diğer URL’lere referans verdiğinde—örneğin, bir resim dosyası veya bir betik—web tarayıcıları bunları hemen alır ve sayfaya dahil eder.

{{index "script (HTML tag)", "closing tag"}}

Bir betik etiketi her zaman `</script>` ile kapatılmalıdır, eğer bir betik dosyasına referans veriyorsa ve herhangi bir kod içermiyorsa bile. Bunu unutursanız, sayfanın geri kalanı betiğin bir parçası olarak yorumlanacaktır.

{{index "relative path", dependency}}

((ES modülleri)) (bkz. [bölüm ?](modules#es)) tarayıcıda betik etiketinize `type="module"` özelliği vererek yükleyebilirsiniz. Bu tür modüller, `import` deklarasyonlarında modül adı olarak kendilerine göre nispeten URL’leri kullanarak diğer modüllere bağımlı olabilir.

{{index "button (HTML tag)", "onclick attribute"}}

Bazı özellikler de bir JavaScript programı içerebilir. Bir sonraki gösterilen `<button>` etiketi (bir düğme olarak görünür) bir `onclick` özelliğine sahiptir. Bu özelliğin değeri, düğmeye tıklandığında çalışacaktır.

```{lang: "html"}
<button onclick="alert('Boom!');">DO NOT PRESS</button>
```

{{index "single-quote character", [escaping, "in HTML"]}}

Dikkat edin, `onclick` özelliğindeki dize için tek tırnak kullanmam gerekti çünkü tüm özelliği tırnak içine almak için zaten çift tırnak kullanılmıştı. `&quot;` de kullanılabilirdi.

## Kum havuzunda

{{index "malicious script", "World Wide Web", browser, website, security}}

((İnternetten)) indirilen programları çalıştırmak potansiyel olarak tehlikelidir. Ziyaret ettiğiniz çoğu sitenin arkasındaki insanlar hakkında pek fazla bir şey bilmiyorsunuz ve onların iyi niyetli oldukları söylenemez. İyi niyetli olmayan insanların programlarını çalıştırmak, bilgisayarınıza ((virüs)) bulaştırmanın, verilerinizi çaldırmanın ve hesaplarınızın hacklenmesinin yollarından biridir.

Buna karşın, Web’in cazibesi, tüm ziyaret ettiğiniz sayfalara ((güvenmeden)) gezinmenizi sağlamasıdır. Bu nedenle tarayıcılar, bir JavaScript programının yapabileceği şeyleri ciddi şekilde sınırlar: bilgisayarınızdaki dosyalara bakamaz veya yerleştirildiği web sayfasıyla ilgili olmayan herhangi bir şeyi değiştiremez.

{{index isolation}}

Bu şekilde bir programlama ortamını izole etmeye _((sandbox))ing_ denir, yani programın zararsız bir şekilde bir kum havuzunda oynadığı varsayılır. Ancak bu özel türde kum havuzunu, içinde oynayan programların gerçekten dışarı çıkamayacağı kalın çelik çubuklardan oluşan bir kafes olarak hayal etmelisiniz.

Sandboxing’in zor kısmı, programlara faydalı olabilecek kadar alan sağlamak, ancak aynı zamanda tehlikeli bir şey yapmalarını engellemektir. Diğer sunucularla iletişim kurmak veya ((kopyala-yapıştır panosu)) içeriğini okumak gibi birçok kullanışlı fonksiyonellik, aynı zamanda sorunlu, ((mahremiyet)) ihlal edici şeyler yapmak için de kullanılabilir.

{{index leak, exploit, security}}

Zaman zaman, birisi bir ((tarayıcının)) sınırlamalarını aşmanın ve zararlı bir şey yapmanın yeni bir yolunu bulur; bu, küçük özel bilgileri sızdırmaktan tarayıcının çalıştığı tüm makineyi ele geçirmeye kadar çeşitlilik gösterebilir. Tarayıcı geliştiricileri deliği kapatarak yanıt verir ve her şey tekrar düzelir—ta ki bir sonraki sorun keşfedilip, umarım gizlice istismar edilmek yerine kamuya açıklanana kadar, bu bir hükümet ajansı veya ((mafya)) tarafından.

## Uyumluluk ve tarayıcı savaşları

{{index Microsoft, "World Wide Web"}}

Web’in erken aşamalarında, ((Mosaic)) adlı bir tarayıcı piyasaya hakim oldu. Birkaç yıl sonra, denge ((Netscape))’e kaydı, ancak o da büyük ölçüde Microsoft’un ((Internet Explorer))’ı tarafından yerinden edildi. Tek bir tarayıcının hakim olduğu her noktada, o tarayıcının satıcısı Web için tek taraflı olarak yeni özellikler icat etme hakkını kendinde bulurdu. Çoğu kullanıcı en popüler tarayıcıyı kullandığından, ((web sitesi))ler bu özellikleri kullanmaya başlardı—diğer tarayıcıları umursamadan.

Bu, genellikle _((tarayıcı savaşları))_ olarak adlandırılan ((uyumluluk)) karanlık çağlarıydı. Web geliştiricileri, tek bir birleşik Web yerine iki veya üç uyumsuz platformla baş başa kalıyordu. Daha da kötüsü, 2003 civarında kullanılan tarayıcılar, farklı tarayıcılarda farklı ((hata))larla doluydu. Web sayfası yazan insanlar için hayat zordu.

{{index Apple, "Internet Explorer", Mozilla}}

((Netscape))’in kar amacı gütmeyen bir yan ürünü olan Mozilla ((Firefox)), 2000’lerin sonlarında Internet Explorer’ın konumunu zorladı. O dönemde ((Microsoft)), rekabetçi kalmakla pek ilgilenmediği için, Firefox ondan büyük bir pazar payı aldı. Aynı dönemde, ((Google)) Chrome tarayıcısını tanıttı ve Apple’ın ((Safari)) tarayıcısı popülerlik kazandı, bu da dört büyük oyuncunun olduğu bir duruma yol açtı.

{{index compatibility}}

Yeni oyuncular, ((standartlar))a daha ciddi bir yaklaşım ve daha iyi ((mühendislik)) uygulamaları benimseyerek, daha az uyumsuzluk ve daha az ((hata)) ile karşımıza çıktı. Pazar payının eridiğini gören Microsoft, bu tutumları benimseyerek Internet Explorer’ın yerini alan Edge tarayıcısını geliştirdi. Eğer bugün web geliştirmeyi öğrenmeye başlıyorsanız, kendinizi şanslı sayın. Büyük tarayıcıların en son sürümleri oldukça tutarlı davranır ve nispeten az sayıda hataya sahiptir.
