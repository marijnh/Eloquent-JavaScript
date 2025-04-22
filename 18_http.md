{{meta {}}}

# HTTP ve Formlar

{{quote {author: "Roy Fielding", title: "Mimari Tarzlar ve Ağ Tabanlı Yazılım Mimarilerinin Tasarımı", chapter: true}

İletişim doğası gereği durumsuz olmalıdır [...] öyle ki istemciden sunucuya yapılan her talep, talebin anlaşılması için gerekli tüm bilgileri içermelidir ve sunucuda depolanmış herhangi bir bağlamdan yararlanamaz.

quote}}

{{index "Fielding, Roy"}}

{{figure {url: "img/chapter_picture_18.jpg", alt: "Parşömen parşömen üzerinde bir web kayıt formunu gösteren illüstrasyon", chapter: "framed"}}}

{{index [browser, environment]}}

[Bölüm ?](browser#web) içinde daha önce bahsedilen _Hypertext Transfer Protocol_, ((World Wide Web))'de verilerin talep edildiği ve sağlandığı mekanizmadır. Bu bölüm ((protokol))'ü daha ayrıntılı olarak tanımlamakta ve tarayıcı JavaScript'in buna nasıl eriştiğini açıklamaktadır.

## Protokol

{{index "IP address"}}

Tarayıcınızın ((adres çubuğuna)) _eloquentjavascript.net/18_http.html_ yazarsanız, ((tarayıcı)) önce _eloquentjavascript.net_ ile ilişkili sunucunun ((adresini)) arar ve ((HTTP)) trafiği için varsayılan bağlantı noktası olan ((bağlantı noktası)) 80'de ((TCP)) ((bağlantı)) açmaya çalışır. Eğer ((sunucu)) mevcutsa ve bağlantıyı kabul ederse, tarayıcı buna benzer bir şey gönderebilir:

```{lang: http}
GET /18_http.html HTTP/1.1
Host: eloquentjavascript.net
User-Agent: Your browser's name
```

Ardından sunucu aynı bağlantı üzerinden yanıt verir.

```{lang: http}
HTTP/1.1 200 OK
Content-Length: 87320
Content-Type: text/html
Last-Modified: Fri, 13 Oct 2023 10:05:41 GMT

<!doctype html>
... the rest of the document
```

Tarayıcı, ((yanıt))'ın boş satırdan sonraki kısmını, _body_ (HTML `<body>` etiketiyle karıştırılmamalıdır) alır ve bunu bir ((HTML)) belgesi olarak görüntüler.

{{index HTTP}}

İstemci tarafından gönderilen bilgiye _((istek))_ denir. Bu satır ile başlar:

```{lang: http}
GET /18_http.html HTTP/1.1
```

{{index "DELETE method", "PUT method", "GET method", [method, HTTP]}}

İlk kelime ((istek))'in _metod_'udur. `GET` belirtilen kaynağı _get_ etmek istediğimiz anlamına gelir. Diğer yaygın yöntemler bir kaynağı silmek için `DELETE`, oluşturmak ya da değiştirmek için `PUT` ve ona bilgi göndermek için `POST`'tur. ((Sunucu))'nun aldığı her isteği yerine getirmek zorunda olmadığını unutmayın. Rastgele bir web sitesine gidip ana sayfasını `DELETE` etmesini söylerseniz, muhtemelen reddedecektir.

{{index [path, URL], GitHub, [file, resource]}}

Yöntem adından sonraki kısım, isteğin uygulandığı _((kaynağın))_ yoludur. En basit durumda, bir kaynak basitçe ((sunucu)) üzerindeki bir dosyadır, ancak protokol öyle olmasını gerektirmez. Bir kaynak, bir dosyaymış gibi aktarılabilen herhangi bir şey olabilir. Birçok sunucu ürettikleri yanıtları anında oluşturur. Örneğin, [_https://github.com/marijnh_](https://github.com/marijnh) adresini açarsanız, sunucu veritabanında "marijnh" adında bir kullanıcı arar ve bulursa, bu kullanıcı için bir profil sayfası oluşturur.

Kaynak yolundan sonra, isteğin ilk satırı, kullandığı ((HTTP)) ((protokol))'ün ((sürüm))'ünü belirtmek için `HTTP/1.1`den bahseder.

Pratikte birçok site, 1.1 sürümüyle aynı kavramları destekleyen ancak daha hızlı olabilmek için çok daha karmaşık olan HTTP sürüm 2'yi kullanır. Tarayıcılar belirli bir sunucuyla konuşurken otomatik olarak uygun protokol sürümüne geçer ve bir isteğin sonucu hangi sürümün kullanıldığına bakılmaksızın aynıdır. Sürüm 1.1 daha basit ve üzerinde oynaması daha kolay olduğu için buna odaklanacağız.

{{index "status code"}}

Sunucunun ((yanıtı)) da bir sürümle başlayacak, ardından önce üç basamaklı bir durum kodu ve ardından insan tarafından okunabilir bir dize olarak yanıtın durumu gelecektir.

```{lang: http}
HTTP/1.1 200 OK
```

{{index "200 (HTTP status code)", "error response", "404 (HTTP status code)"}}

2 ile başlayan durum kodları isteğin başarılı olduğunu gösterir. 4 ile başlayan kodlar ((istek)) ile ilgili bir sorun olduğu anlamına gelir. 404 muhtemelen en ünlü HTTP durum kodudur - kaynağın bulunamadığı anlamına gelir. 5 ile başlayan kodlar ((sunucu)) üzerinde bir hata olduğu ve isteğin suçlanamayacağı anlamına gelir.

{{index HTTP}}

{{id headers}}

Bir istek veya yanıtın ilk satırını herhangi bir sayıda _((header))s_ takip edebilir. Bunlar, istek veya yanıt hakkında ekstra bilgi belirten `name: value` biçimindeki satırlardır. Bu başlıklar örnek ((yanıt))'ın bir parçasıydı:

```{lang: null}
Content-Length: 87320
Content-Type: text/html
Last-Modified: Fri, 13 Oct 2023 10:05:41 GMT
```

{{index "Content-Length header", "Content-Type header", "Last-Modified header"}}

Bu bize yanıt belgesinin boyutunu ve türünü gösterir. Bu durumda, 87.320 baytlık bir HTML belgesidir. Ayrıca bize bu belgenin en son ne zaman değiştirildiğini de söyler.

İstemci ve sunucu, ((istek))lerine veya ((yanıt))larına hangi ((başlık))ları ekleyeceklerine karar vermekte özgürdür. Ancak bunların bazıları işlerin yürümesi için gereklidir. Örneğin, yanıtta `Content-Type` başlığı olmadan, tarayıcı belgeyi nasıl görüntüleyeceğini bilemez.

{{index "GET method", "DELETE method", "PUT method", "POST method", "body (HTTP)"}}

Başlıklardan sonra, hem istekler hem de yanıtlar boş bir satır ve ardından gönderilen gerçek belgeyi içeren bir gövde içerebilir. `GET` ve `DELETE` istekleri herhangi bir veri göndermez, ancak `PUT` ve `POST` istekleri gönderir. Hata yanıtları gibi bazı yanıt türleri de bir gövde gerektirmez.

## Tarayıcılar ve HTTP

{{index HTTP, [file, resource]}}

Örnekte gördüğümüz gibi, bir ((tarayıcı)), ((adres çubuğuna)) bir ((URL)) girdiğimizde bir istekte bulunacaktır. Ortaya çıkan HTML sayfası ((resim)) ve JavaScript dosyaları gibi diğer dosyalara referans verdiğinde, bunlar da alınır.

{{index parallelism, "GET method"}}

Orta derecede karmaşık bir ((web sitesi)) kolayca 10 ila 200 ((kaynak)) içerebilir. Bunları hızlı bir şekilde alabilmek için, tarayıcılar yanıtları teker teker beklemek yerine aynı anda birkaç `GET` isteği yapacaktır.

HTML sayfaları, kullanıcının bilgileri doldurmasına ve sunucuya göndermesine olanak tanıyan _((form))lar_ içerebilir. Bu bir form örneğidir:

```{lang: html}
<form method="GET" action="example/message.html">
  <p>Name: <input type="text" name="name"></p>
  <p>Message:<br><textarea name="message"></textarea></p>
  <p><button type="submit">Send</button></p>
</form>
```

{{index form, "method attribute", "GET method"}}

Bu kod, iki ((alan)) içeren bir formu tanımlamaktadır: küçük olanı bir ad sorar ve daha büyük olanı bir mesaj yazmak içindir. Gönder ((düğmesini)) tıkladığınızda, form _gönderilir_, yani alanının içeriği bir HTTP isteğine paketlenir ve tarayıcı bu isteğin sonucuna gider.

`<form>` öğesinin `method` niteliği `GET` olduğunda (veya atlandığında), formdaki bilgiler `action` URL'sinin sonuna _((query string))_ olarak eklenir. Tarayıcı bu URL'ye bir istekte bulunabilir:

```{lang: null}
GET /example/message.html?name=Jean&message=Yes%3F HTTP/1.1
```

{{index "ampersand character"}}

((soru işareti)) URL'nin yol kısmının sonunu ve sorgunun başlangıcını gösterir. Bunu, sırasıyla form alanı öğelerindeki `name` niteliğine ve bu öğelerin içeriğine karşılık gelen ad ve değer çiftleri izler. Çiftleri ayırmak için bir ampersand karakteri (`&`) kullanılır.

{{index [escaping, "in URLs"], "hexadecimal number", "encodeURIComponent function", "decodeURIComponent function"}}

URL'de kodlanan asıl mesaj "Evet mi?" şeklindedir, ancak soru işareti garip bir kodla değiştirilmiştir. Sorgu dizelerindeki bazı karakterlerin öncelenmesi gerekir. Soru işareti, `%3F` olarak gösterilir, bunlardan biridir. Her formatın kendi karakter kaçış yöntemine ihtiyacı olduğuna dair yazılı olmayan bir kural var gibi görünüyor. Bu, _((URL kodlaması))_ olarak adlandırılır ve bir ((yüzde işareti)) ve ardından karakter kodunu kodlayan iki onaltılık (taban 16) basamak kullanır. Bu durumda, ondalık gösterimde 63 olan 3F, bir soru işareti karakterinin kodudur. JavaScript, bu biçimi kodlamak ve kodunu çözmek için `encodeURIComponent` ve `decodeURIComponent` işlevlerini sağlar.

```
console.log(encodeURIComponent("Yes?"));
// → Yes%3F
console.log(decodeURIComponent("Yes%3F"));
// → Yes?
```

{{index "body (HTTP)", "POST method"}}

Daha önce gördüğümüz örnekteki HTML formunun `method` özelliğini `POST` olarak değiştirirsek, ((formu)) göndermek için yapılan ((HTTP)) isteği `POST` yöntemini kullanacak ve ((query string)) URL'ye eklemek yerine isteğin gövdesine koyacaktır.

```{lang: http}
POST /example/message.html HTTP/1.1
Content-length: 24
Content-type: application/x-www-form-urlencoded

name=Jean&message=Yes%3F
```

`GET` istekleri, ((yan etkisi)) olmayan ancak sadece bilgi isteyen istekler için kullanılmalıdır. Sunucuda bir şeyi değiştiren istekler, örneğin yeni bir hesap oluşturma veya bir mesaj gönderme, `POST` gibi diğer yöntemlerle ifade edilmelidir. Tarayıcı gibi istemci tarafı yazılımlar körü körüne `POST` istekleri yapmamaları gerektiğini bilirler, ancak genellikle dolaylı olarak `GET` istekleri yaparlar - örneğin kullanıcının yakında ihtiyaç duyacağını düşündüğü bir kaynağı önceden almak için.

Formlara ve JavaScript'ten onlarla nasıl etkileşim kuracağımıza [bölümün ilerleyen kısımlarında] geri döneceğiz (http#forms).

{{id fetch}}

## Fetch

{{index "fetch function", "Promise class", [interface, module]}}

Tarayıcı JavaScript'inin HTTP istekleri yapabildiği arayüze `fetch` adı verilir. Nispeten yeni olduğu için, uygun bir şekilde vaatleri kullanır.

```{test: no}
fetch("example/data.txt").then(response => {
  console.log(response.status);
  // → 200
  console.log(response.headers.get("Content-Type"));
  // → text/plain
});
```

{{index "Response class", "status property", "headers property"}}

`fetch` çağrısı, durum kodu ve başlıkları gibi sunucunun yanıtı hakkında bilgi tutan bir `Response` nesnesine çözümlenen bir söz döndürür. Başlıklar, anahtarlarını (başlık adları) büyük/küçük harf duyarsız olarak ele alan `Map` benzeri bir nesneye sarılır, çünkü başlık adlarının büyük/küçük harf duyarlı olması gerekmez. Bu, `headers.get("Content-Type")` ve `headers.get("content-TYPE")` öğelerinin aynı değeri döndüreceği anlamına gelir.

Sunucu bir hata koduyla yanıt verse bile `fetch` tarafından döndürülen sözün başarıyla çözümlendiğini unutmayın. Bir ağ hatası varsa veya isteğin gönderildiği ((sunucu)) bulunamazsa da reddedilebilir.

{{index [path, URL], "relative URL"}}

`fetch`'e ilk argüman, talep edilmesi gereken URL'dir. Bu ((URL)) bir protokol adıyla başlamadığında (_http:_ gibi), _relative_ olarak ele alınır, yani geçerli belgeye göre yorumlanır. Eğik çizgi (/) ile başladığında, sunucu adından sonraki kısım olan geçerli yolun yerini alır. Aksi takdirde, geçerli yolun son ((eğik çizgi karakteri)) kısmına kadar olan kısmı göreli URL'nin önüne konur.

{{index "text method", "body (HTTP)", "Promise class"}}

Bir yanıtın gerçek içeriğine ulaşmak için `text` yöntemini kullanabilirsiniz. İlk söz, yanıtın üstbilgileri alınır alınmaz çözümlendiğinden ve yanıt gövdesini okumak biraz daha uzun sürebileceğinden, bu yine bir söz döndürür.

```{test: no}
fetch("example/data.txt")
  .then(resp => resp.text())
  .then(text => console.log(text));
// → This is the content of data.txt
```

{{index "json method"}}

Benzer bir yöntem olan `json`, gövdeyi ((JSON)) olarak çözümlediğinizde elde ettiğiniz değeri çözümleyen veya geçerli JSON değilse reddeden bir söz döndürür.

{{index "GET method", "body (HTTP)", "DELETE method", "method property"}}

Varsayılan olarak, `fetch` istek yapmak için `GET` yöntemini kullanır ve bir istek gövdesi içermez. İkinci argüman olarak ekstra seçenekler içeren bir nesne ileterek farklı şekilde yapılandırabilirsiniz. Örneğin, bu istek `example/data.txt` dosyasını silmeye çalışır:

```{test: no}
fetch("example/data.txt", {method: "DELETE"}).then(resp => {
  console.log(resp.status);
  // → 405
});
```

{{index "405 (HTTP status code)"}}

405 durum kodu, HTTP sunucusunun "bunu yapamam" deme şekli olan "yönteme izin verilmiyor" anlamına gelir.

{{index "Range header", "body property", "headers property"}}

Bir istek gövdesi eklemek için bir `body` seçeneği ekleyebilirsiniz. Başlıkları ayarlamak için `headers` seçeneği vardır. Örneğin, bu istek, sunucuya bir belgenin yalnızca bir kısmını döndürmesi talimatını veren bir `Range` başlığı içerir.

```{test: no}
fetch("example/data.txt", {headers: {Range: "bytes=8-19"}})
  .then(resp => resp.text())
  .then(console.log);
// → the content
```

Tarayıcı, "Host" gibi bazı istek ((başlık))larını ve sunucunun gövde boyutunu anlaması için gerekenleri otomatik olarak ekleyecektir. Ancak kendi başlıklarınızı eklemek, kimlik doğrulama bilgileri gibi şeyleri dahil etmek veya sunucuya hangi dosya biçimini almak istediğinizi söylemek için genellikle yararlıdır.

{{id http_sandbox}}

## HTTP kum havuzlamak

{{index sandbox, [browser, security]}}

Web sayfası komut dosyalarında ((HTTP)) istekleri yapmak bir kez daha ((güvenlik)) ile ilgili endişeleri gündeme getirmektedir. Komut dosyasını kontrol eden kişi, bilgisayarında komut dosyası çalışan kişiyle aynı çıkarlara sahip olmayabilir. Daha açık bir ifadeyle, _themafia.org_ adresini ziyaret ettiğimde, script'in tarayıcımdaki kimlik bilgilerini kullanarak _mybank.com_ adresine tüm paramı transfer etme talimatları içeren bir talepte bulunmasını istemiyorum.

Bu nedenle tarayıcılar, komut dosyalarının diğer ((domain))lere (_themafia.org_ ve _mybank.com_ gibi isimler) HTTP istekleri yapmasına izin vermeyerek bizi korur.

{{index "Access-Control-Allow-Origin header", "cross-domain request"}}

Bu, meşru nedenlerle birkaç etki alanına erişmek isteyen sistemler oluştururken can sıkıcı bir sorun olabilir. Neyse ki, ((sunucu))'lar ((yanıt))'larına bunun gibi bir ((başlık)) ekleyerek tarayıcıya isteğin başka bir etki alanından gelmesinin uygun olduğunu açıkça belirtebilirler:

```{lang: null}
Access-Control-Allow-Origin: *
```

## HTTP'i takdir etmek

{{index client, HTTP, [interface, HTTP]}}

((Tarayıcı)) (istemci tarafı) üzerinde çalışan bir JavaScript programı ile ((sunucu)) (sunucu tarafı) üzerindeki bir program arasında ((iletişim)) gerektiren bir sistem oluştururken, bu iletişimi modellemenin birkaç farklı yolu vardır.

{{index [network, abstraction], abstraction}}

Yaygın olarak kullanılan bir model _((remote procedure call))s_ modelidir. Bu modelde iletişim, işlevin aslında başka bir makinede çalışıyor olması dışında, normal işlev çağrılarının kalıplarını izler. Fonksiyonun çağrılması, sunucuya fonksiyonun adını ve argümanlarını içeren bir istek yapılmasını içerir. Bu isteğe verilen yanıt, döndürülen değeri içerir.

Uzaktan yordam çağrıları açısından düşündüğünüzde, HTTP sadece iletişim için bir araçtır ve büyük olasılıkla bunu tamamen gizleyen bir soyutlama katmanı yazacaksınız.

{{index "media type", "document format", [method, HTTP]}}

Diğer bir yaklaşım ise iletişiminizi ((kaynak)) ve ((HTTP)) yöntemleri kavramı etrafında oluşturmaktır. `addUser` adlı bir uzak prosedür yerine, `/users/larry` için bir `PUT` isteği kullanırsınız. Kullanıcının özelliklerini işlev argümanlarında kodlamak yerine, kullanıcıyı temsil eden bir JSON belge biçimi tanımlarsınız (veya mevcut bir biçimi kullanırsınız). Yeni bir kaynak oluşturmak için `PUT` isteğinin gövdesi böyle bir belgedir. Bir kaynak, kaynağın URL'sine (örneğin, `/user/larry`) bir `GET` isteği yapılarak getirilir ve bu istek yine kaynağı temsil eden belgeyi döndürür.

Bu ikinci yaklaşım, kaynakların önbelleğe alınması (hızlı erişim için istemcide bir kopyasının tutulması) desteği gibi HTTP'nin sağladığı bazı özelliklerin kullanılmasını kolaylaştırır. HTTP'de kullanılan ve iyi tasarlanmış olan kavramlar, sunucu arayüzünüzü tasarlamak için yararlı bir dizi ilke sağlayabilir.

## Güvenlik ve HTTPS

{{index "man-in-the-middle", security, HTTPS, [network, security]}}

İnternet üzerinden seyahat eden veriler uzun ve tehlikeli bir yol izleme eğilimindedir. Hedefine ulaşmak için kahve dükkanı Wi-Fi bağlantı noktalarından çeşitli şirketler ve devletler tarafından kontrol edilen ağlara kadar her yerden geçmesi gerekir. Güzergahı boyunca herhangi bir noktada denetlenebilir ve hatta değiştirilebilir.

{{index tampering}}

((E-posta)) hesabınızın ((parolası)) gibi bir şeyin gizli kalması veya bankanızın web sitesi üzerinden para aktardığınız hesap numarası gibi hedefine değiştirilmeden ulaşması önemliyse, düz HTTP yeterince iyi değildir.

{{index cryptography, encryption}}

{{indexsee "Secure HTTP", HTTPS, [browser, security]}}

_https://_ ile başlayan ((URL))ler için kullanılan güvenli ((HTTP)) protokolü, HTTP trafiğini okumayı ve kurcalamayı zorlaştıracak şekilde sarar. Veri alışverişinden önce istemci, sunucunun iddia ettiği kişi olduğunu, tarayıcının tanıdığı bir sertifika yetkilisi tarafından verilen kriptografik ((sertifika)) sahibi olduğunu kanıtlamasını isteyerek doğrular. Daha sonra, ((bağlantı)) üzerinden giden tüm veriler, gizli dinleme ve kurcalamayı önleyecek şekilde şifrelenir.

Böylece, doğru çalıştığında, ((HTTPS)) diğer kişilerin konuşmaya çalıştığınız web sitesini taklit etmesini _ve_ iletişiminizi gözetlemesini önler. Mükemmel değildir ve HTTPS'nin sahte veya çalıntı sertifikalar ve bozuk yazılımlar nedeniyle başarısız olduğu çeşitli olaylar olmuştur, ancak düz HTTP'den _çok_ daha güvenlidir.

{{id forms}}

## Form alanları

Formlar ilk olarak JavaScript öncesi Web için, web sitelerinin kullanıcı tarafından gönderilen bilgileri bir HTTP isteğiyle göndermesini sağlamak üzere tasarlanmıştır. Bu tasarım, sunucu ile etkileşimin her zaman yeni bir sayfaya gidilerek gerçekleştiğini varsayar.

{{index [DOM, fields]}}

Ancak öğeleri sayfanın geri kalanı gibi DOM'un bir parçasıdır ve form ((alan))'ları temsil eden DOM öğeleri diğer öğelerde bulunmayan bir dizi özelliği ve olayı destekler. Bunlar, bu tür giriş alanlarını JavaScript programlarıyla incelemeyi ve kontrol etmeyi ve bir forma yeni işlevler eklemek veya formları ve alanları bir JavaScript uygulamasında yapı taşları olarak kullanmak gibi şeyler yapmayı mümkün kılar.

{{index "form (HTML tag)"}}

Bir web formu, bir `<form>` etiketi içinde gruplandırılmış herhangi bir sayıda girdi ((alan)) içerir. HTML, basit açma/kapama onay kutularından açılır menülere ve metin girişi için alanlara kadar çeşitli farklı alan stillerine izin verir. Bu kitap tüm alan türlerini kapsamlı bir şekilde tartışmaya çalışmayacaktır, ancak kabaca bir genel bakışla başlayacağız.

{{index "input (HTML tag)", "type attribute"}}

A lot of field types use the `<input>` tag. This tag's `type` attribute is used to select the field's style. These are some commonly used `<input>` types:

{{index "password field", checkbox, "radio button", "file field"}}

{{table {cols: [1,5]}}}

| `text` | A single-line ((text field))
| `password` | Same as `text` but hides the text that is typed
| `checkbox` | An on/off switch
| `color` | A color
| `date` | A calendar date
| `radio` | (Part of) a ((multiple-choice)) field
| `file` | Allows the user to choose a file from their computer

{{index "value attribute", "checked attribute", "form (HTML tag)"}}

Form alanlarının mutlaka bir `<form>` etiketi içinde görünmesi gerekmez. Bunları sayfanın herhangi bir yerine koyabilirsiniz. Bu tür formsuz alanlar ((submit)) edilemez (yalnızca bir bütün olarak form edilebilir), ancak JavaScript ile girdiye yanıt verirken, genellikle alanlarımızı normal şekilde göndermek istemeyiz.

```{lang: html}
<p><input type="text" value="abc"> (text)</p>
<p><input type="password" value="abc"> (password)</p>
<p><input type="checkbox" checked> (checkbox)</p>
<p><input type="color" value="orange"> (color)</p>
<p><input type="date" value="2023-10-13"> (date)</p>
<p><input type="radio" value="A" name="choice">
   <input type="radio" value="B" name="choice" checked>
   <input type="radio" value="C" name="choice"> (radio)</p>
<p><input type="file"> (file)</p>
```

{{if book

Bu HTML kodu ile oluşturulan alanlar aşağıdaki gibi görünür:

{{figure {url: "img/form_fields.png", alt: "Çeşitli giriş etiketi türlerini gösteren ekran görüntüsü", width: "4cm"}}}

if}}

Bu tür öğeler için JavaScript arayüzü, öğenin türüne göre farklılık gösterir.

{{index "textarea (HTML tag)", "text field"}}

Çok satırlı metin alanlarının kendine özgü bir etiketi vardır: `<textarea>`. Bunun nedeni, çok satırlı bir başlangıç değerini belirtmek için bir özellik kullanmanın garip olmasıdır. `<textarea>` etiketi, bir eşleşen `</textarea>` kapanış etiketine ihtiyaç duyar ve başlangıç metni olarak `value` özelliği yerine bu iki etiket arasındaki metni kullanır.

```{lang: html}
<textarea>
one
two
three
</textarea>
```

{{index "select (HTML tag)", "option (HTML tag)", "multiple choice", "drop-down menu"}}

Son olarak, `<select>` etiketi, kullanıcının önceden tanımlanmış seçenekler arasından seçim yapmasını sağlayan bir alan oluşturmak için kullanılır.

```{lang: html}
<select>
  <option>Pancakes</option>
  <option>Pudding</option>
  <option>Ice cream</option>
</select>
```

{{if book

Böyle bir alan şu şekilde görünür:

{{figure {url: "img/form_select.png", alt: "Ekran görüntüsü, bir `<select>` alanını gösteriyor.", width: "4cm"}}}

if}}

{{index "change event"}}

Bir form alanının değeri her değiştiğinde, bir `"change"` olayı tetiklenir.

## Odak

{{index keyboard, focus}}

{{indexsee "keyboard focus", focus}}

HTML belgelerindeki çoğu elementin aksine, form alanları _klavye ((odak))_ alabilir. Tıklandığında, [tab]{keyname} tuşu ile geçildiğinde veya başka bir şekilde etkinleştirildiğinde, o anda aktif olan element haline gelir ve klavye ((girdisi)) alıcısı olur.

{{index "option (HTML tag)", "select (HTML tag)"}}

Bu nedenle, bir ((metin alanı))na yalnızca odaklanıldığında yazabilirsiniz. Diğer alanlar klavye olaylarına farklı şekilde tepki verir. Örneğin, bir `<select>` menüsü, kullanıcının yazdığı metni içeren seçeneğe geçmeye çalışır ve ok tuşlarına yukarı ve aşağı seçim yaparak yanıt verir.

{{index "focus method", "blur method", "activeElement property"}}

JavaScript ile ((odak)) kontrolünü `focus` ve `blur` metodlarıyla sağlayabiliriz. İlk metod, çağrıldığı DOM elementine odaklanmayı taşır, ikinci metod ise odağı kaldırır. `document.activeElement` içindeki değer, şu anda odaklanılmış olan elemana karşılık gelir.

```{lang: html}
<input type="text">
<script>
  document.querySelector("input").focus();
  console.log(document.activeElement.tagName);
  // → INPUT
  document.querySelector("input").blur();
  console.log(document.activeElement.tagName);
  // → BODY
</script>
```

{{index "autofocus attribute"}}

Bazı sayfalarda, kullanıcının bir form alanıyla hemen etkileşime geçmesi beklenir. Belge yüklendiğinde JavaScript kullanılarak bu alan ((odaklanabilir)), ancak HTML ayrıca aynı etkiyi sağlayan `autofocus` özelliğini sunar ve tarayıcının ne yapmaya çalıştığımızı anlamasını sağlar. Bu, tarayıcıya, kullanıcının odağı başka bir yere koyduğu durumlarda bu davranışı devre dışı bırakma seçeneği sunar.

{{index "tab key", keyboard, "tabindex attribute", "a (HTML tag)"}}

Tarayıcılar ayrıca kullanıcının [tab]{keyname} tuşunu basarak odağı belge boyunca hareket ettirmesine, bir sonraki odaklanabilir elemente geçmesine ve [shift-tab]{keyname} tuşunu basarak bir önceki elemana geri dönmesine olanak tanır. Varsayılan olarak, elemanlar belgede göründükleri sırayla ziyaret edilir. Bu sıralamayı değiştirmek için `tabindex` özelliği kullanılabilir. Aşağıdaki örnek belge, odağın önce yardım bağlantısına gitmek yerine, metin girişinden OK butonuna atlamasına olanak tanır:

```{lang: html, focus: true}
<input type="text" tabindex=1> <a href=".">(help)</a>
<button onclick="console.log('ok')" tabindex=2>OK</button>
```

{{index "tabindex attribute"}}

Varsayılan olarak, çoğu HTML elemanı odaklanabilir değildir. Ancak, odaklanabilir hale getirmek için herhangi bir elemana `tabindex` özelliği ekleyebilirsiniz. Bir `tabindex` değeri 0 olan bir eleman, odak sırasını etkilemeden odaklanabilir hale gelir.

## Engelli alanlar

{{index "disabled attribute"}}

Tüm ((form)) ((alanları)) `disabled` özelliği aracılığıyla _devre dışı_ bırakılabilir. Bu, değeri olmadan belirtilebilen bir ((özelliktir)); yalnızca mevcut olması, elementi devre dışı bırakır.

```{lang: html}
<button>I'm all right</button>
<button disabled>I'm out</button>
```

Devre dışı alanlar ((odaklanamaz)) veya değiştirilemez ve tarayıcılar, bunları gri ve solmuş şekilde gösterir.

{{if book

{{figure {url: "img/button_disabled.png", alt: "Devre dışı bırakılmış bir butonun ekran görüntüsü", width: "3cm"}}}

if}}

{{index "user experience"}}

Bir program, bazı ((buton)) veya başka bir kontrol tarafından tetiklenen ve sunucu ile iletişim gerektirebilecek (ve dolayısıyla bir süre alabilecek) bir eylemi işlerken, eylem bitene kadar kontrolü devre dışı bırakmak iyi bir fikir olabilir. Böylece, kullanıcı sabırsızlanıp tekrar tıkladığında, eylemi yanlışlıkla tekrarlamamış olur.

## Formun tamamı

{{index "array-like object", "form (HTML tag)", "form property", "elements property"}}

Bir ((alan)) bir `<form>` elemanının içinde bulunduğunda, DOM elemanı, formun DOM elemanına geri bağlanan bir `form` özelliğine sahip olacaktır. `<form>` elemanı ise, içinde bulunan alanların array-benzeri bir koleksiyonunu içeren `elements` adında bir özelliğe sahiptir.

{{index "elements property", "name attribute"}}

Bir form alanının `name` özelliği, form ((gönderildiğinde)) değerinin nasıl tanımlanacağını belirler. Ayrıca, formun `elements` özelliğine erişirken bir özellik adı olarak da kullanılabilir; bu özellik hem array-benzeri bir nesne (sayıyla erişilebilir) hem de bir ((harita)) (isimle erişilebilir) olarak işlev görür.

```{lang: html}
<form action="example/submit.html">
  Name: <input type="text" name="name"><br>
  Password: <input type="password" name="password"><br>
  <button type="submit">Log in</button>
</form>
<script>
  let form = document.querySelector("form");
  console.log(form.elements[1].type);
  // → password
  console.log(form.elements.password.type);
  // → password
  console.log(form.elements.name.form == form);
  // → true
</script>
```

{{index "button (HTML tag)", "type attribute", submit, "enter key"}}

Bir `type` özelliği `submit` olan bir buton, tıklandığında formun gönderilmesine neden olur. Bir form alanı odaklandığında [enter]{keyname} tuşuna basmak aynı etkiye yol açar.

{{index "submit event", "event handling", "preventDefault method", "page reload", "GET method", "POST method"}}

Bir ((form))u göndermek genellikle, ((tarayıcı))nın formun `action` özelliğinde belirtilen sayfaya, ya bir `GET` ya da bir `POST` ((isteği)) kullanarak yönlendirilmesi anlamına gelir. Ancak bundan önce, bir `"submit"` olayı tetiklenir. Bu olayı JavaScript ile işleyebilir ve olay nesnesi üzerinde `preventDefault` çağrısı yaparak bu varsayılan davranışı engelleyebilirsiniz.

```{lang: html}
<form>
  Value: <input type="text" name="value">
  <button type="submit">Save</button>
</form>
<script>
  let form = document.querySelector("form");
  form.addEventListener("submit", event => {
    console.log("Saving value", form.elements.value.value);
    event.preventDefault();
  });
</script>
```

{{index "submit event", validation}}

JavaScript'te `"submit"` olaylarını yakalamanın çeşitli kullanımları vardır. Kullanıcının girdiği değerlerin mantıklı olup olmadığını doğrulayan bir kod yazabilir ve formu göndermek yerine hemen bir hata mesajı gösterebiliriz. Veya formun gönderilme işleminin normal yolunu tamamen devre dışı bırakabiliriz, örneğin bu örnekte olduğu gibi, ve programımızın girdiyi işlemesini sağlayabiliriz, muhtemelen sayfayı yenilemeden sunucuya göndermek için `fetch` kullanarak.

## Metin alanları

{{index "value attribute", "input (HTML tag)", "text field", "textarea (HTML tag)", [DOM, fields], [interface, object]}}

`<textarea>` etiketleriyle oluşturulan alanlar veya `text` veya `password` türünde olan `<input>` etiketleri, ortak bir arayüze sahiptir. Bu elemanların DOM elemanları, mevcut içeriklerini bir string değeri olarak tutan bir `value` özelliğine sahiptir. Bu özelliği başka bir string ile ayarlamak, alanın içeriğini değiştirir.

{{index "selectionStart property", "selectionEnd property"}}

((Metin alanı))nın `selectionStart` ve `selectionEnd` özellikleri, ((kursor)) ve ((seçim)) hakkında bize bilgi verir. Hiçbir şey seçilmediğinde, bu iki özellik aynı sayıyı tutar ve bu da kursorun konumunu belirtir. Örneğin, 0 metnin başlangıcını, 10 ise kursorun 10^'uncu^ ((karakter))den sonrasını belirtir. Alanın bir kısmı seçildiğinde, bu iki özellik farklı olur ve bize seçilen metnin başlangıcını ve sonunu verir. `value` gibi, bu özelliklere de yazılabilir.

{{index Khasekhemwy, "textarea (HTML tag)", keyboard, "event handling"}}

Farz edelim ki Khasekhemwy hakkında bir makale yazıyorsunuz, ancak adını yazmakta zorlanıyorsunuz. Aşağıdaki kod, F2 tuşuna basıldığında "Khasekhemwy" stringini sizin için ekleyen bir olay işleyicisiyle bir `<textarea>` etiketini bağlar.

```{lang: html}
<textarea></textarea>
<script>
  let textarea = document.querySelector("textarea");
  textarea.addEventListener("keydown", event => {
    if (event.key == "F2") {
      replaceSelection(textarea, "Khasekhemwy");
      event.preventDefault();
    }
  });
  function replaceSelection(field, word) {
    let from = field.selectionStart, to = field.selectionEnd;
    field.value = field.value.slice(0, from) + word +
                  field.value.slice(to);
    // Put the cursor after the word
    field.selectionStart = from + word.length;
    field.selectionEnd = from + word.length;
  }
</script>
```

{{index "replaceSelection function", "text field"}}

`replaceSelection` fonksiyonu, bir metin alanının mevcut seçili kısmını verilen kelimeyle değiştirir ve ardından ((kursor))u o kelimenin sonrasına taşır, böylece kullanıcı yazmaya devam edebilir.

{{index "change event", "input event"}}

Bir ((metin alanı)) için `"change"` olayı, her seferinde bir şey yazıldığında tetiklenmez. Bunun yerine, alanın içeriği değiştikten sonra odağını kaybettiğinde tetiklenir. Bir metin alanındaki değişikliklere hemen yanıt vermek için, bunun yerine kullanıcı her karakter yazdığında, metin sildiğinde veya alanın içeriğini başka şekilde manipüle ettiğinde tetiklenen `"input"` olayı için bir işleyici kaydetmelisiniz.

Aşağıdaki örnek, bir metin alanını ve alandaki metnin mevcut uzunluğunu gösteren bir sayacı gösterir:

```{lang: html}
<input type="text"> length: <span id="length">0</span>
<script>
  let text = document.querySelector("input");
  let output = document.querySelector("#length");
  text.addEventListener("input", () => {
    output.textContent = text.value.length;
  });
</script>
```

## Onay kutuları ve radyo düğmeleri

{{index "input (HTML tag)", "checked attribute"}}

Bir ((checkbox)) alanı ikili bir anahtarlamadır. Değeri, bir Boolean değeri tutan `checked` özelliği aracılığıyla alınabilir veya değiştirilebilir.

```{lang: html}
<label>
  <input type="checkbox" id="purple"> Make this page purple
</label>
<script>
  let checkbox = document.querySelector("#purple");
  checkbox.addEventListener("change", () => {
    document.body.style.background =
      checkbox.checked ? "mediumpurple" : "";
  });
</script>
```

{{index "for attribute", "id attribute", focus, "label (HTML tag)", labeling}}

`<label>` etiketi, bir belge parçasını bir input ((alanı))yla ilişkilendirir. Etikete herhangi bir yere tıklamak, alanı etkinleştirir, ona odaklanır ve eğer bir checkbox veya radyo butonuysa, değerini değiştirir.

{{index "input (HTML tag)", "multiple-choice"}}

Bir ((radyo butonu)), bir checkbox'a benzer, ancak aynı `name` özelliğine sahip diğer radyo butonlarıyla örtük olarak ilişkilendirilir, böylece yalnızca bir tanesi her zaman aktif olabilir.

```{lang: html}
Color:
<label>
  <input type="radio" name="color" value="orange"> Orange
</label>
<label>
  <input type="radio" name="color" value="lightgreen"> Green
</label>
<label>
  <input type="radio" name="color" value="lightblue"> Blue
</label>
<script>
  let buttons = document.querySelectorAll("[name=color]");
  for (let button of Array.from(buttons)) {
    button.addEventListener("change", () => {
      document.body.style.background = button.value;
    });
  }
</script>
```

{{index "name attribute", "querySelectorAll method"}}

`querySelectorAll`'a verilen CSS sorgusunda, ((köşeli parantezler)) özellikleri eşleştirmek için kullanılır. Bu, `name` özelliği `"color"` olan elemanları seçer.

## Seçim alanları

{{index "select (HTML tag)", "multiple-choice", "option (HTML tag)"}}

Select alanları, kavramsal olarak radyo butonlarına benzer—kullanıcının bir dizi seçenek arasından seçim yapmasına olanak tanır. Ancak bir radyo butonu seçeneklerin düzenini bizim kontrolümüze bırakırken, `<select>` etiketinin görünümü tarayıcı tarafından belirlenir.

{{index "multiple attribute", "drop-down menu"}}

Select alanlarının, radyo kutularına değil, daha çok bir dizi checkbox'a benzeyen bir varyantı da vardır. `multiple` özelliği verildiğinde, bir `<select>` etiketi, kullanıcıya yalnızca bir seçenek yerine istediği sayıda seçenek seçme olanağı tanır. Bu, çoğu tarayıcıda, genellikle seçenekleri yalnızca açıldığında gösteren bir _açılır_ kontrolü olarak çizilen normal bir select alanından farklı olarak görüntülenir.

{{index "option (HTML tag)", "value attribute"}}

Her `<option>` etiketinin bir değeri vardır. Bu değer, bir `value` özelliği ile tanımlanabilir. Eğer bu verilmemişse, seçeneğin içindeki ((metin)) değeri olarak sayılır. Bir `<select>` elemanının `value` özelliği, şu anda seçili olan seçeneği yansıtır. Ancak bir `multiple` alanı için bu özellik çok anlamlı değildir, çünkü yalnızca şu anda seçili olan _bir_ seçeneğin değerini verir.

{{index "select (HTML tag)", "options property", "selected attribute"}}

Bir `<select>` alanı için `<option>` etiketlerine, alanın `options` özelliği aracılığıyla array-benzeri bir nesne olarak erişilebilir. Her seçeneğin, o seçeneğin şu anda seçili olup olmadığını belirten `selected` adında bir özelliği vardır. Bu özellik, bir seçeneği seçmek veya seçiliğini kaldırmak için de yazılabilir.

{{index "multiple attribute", "binary number"}}

Bu örnek, bir `multiple` select alanından seçili değerleri çıkarır ve bunları bireysel bitlerden bir ikili sayı oluşturmak için kullanır. Birden fazla seçenek seçmek için [control]{keyname} tuşunu (veya bir Mac'te [command]{keyname} tuşunu) basılı tutun.

```{lang: html}
<select multiple>
  <option value="1">0001</option>
  <option value="2">0010</option>
  <option value="4">0100</option>
  <option value="8">1000</option>
</select> = <span id="output">0</span>
<script>
  let select = document.querySelector("select");
  let output = document.querySelector("#output");
  select.addEventListener("change", () => {
    let number = 0;
    for (let option of Array.from(select.options)) {
      if (option.selected) {
        number += Number(option.value);
      }
    }
    output.textContent = number;
  });
</script>
```

## Dosya alanları

{{index file, "hard drive", "filesystem", security, "file field", "input (HTML tag)"}}

Dosya alanları, başlangıçta kullanıcının bilgisayarından bir dosya yüklemek için bir form aracılığıyla tasarlanmıştı. Modern tarayıcılarda, bunlar aynı zamanda JavaScript programlarından bu tür dosyaları okuma yolu da sağlar. Alan, bir tür kapı bekçisi gibi davranır. Script, kullanıcının bilgisayarındaki özel dosyaları doğrudan okumaya başlayamaz, ancak kullanıcı bu alanda bir dosya seçtiğinde, tarayıcı bu eylemi scriptin dosyayı okuyabileceği şeklinde yorumlar.

Bir dosya alanı genellikle "dosya seç" veya "göz at" gibi bir etiketle yazılmış bir buton gibi görünür ve yanındaki seçilen dosya hakkında bilgi içerir.

```{lang: html}
<input type="file">
<script>
  let input = document.querySelector("input");
  input.addEventListener("change", () => {
    if (input.files.length > 0) {
      let file = input.files[0];
      console.log("You chose", file.name);
      if (file.type) console.log("It has type", file.type);
    }
  });
</script>
```

{{index "multiple attribute", "files property"}}

Bir ((dosya alanı)) elemanının `files` özelliği, alanda seçilen dosyaları içeren bir ((array-benzeri nesne))dir (yine, gerçek bir dizi değildir). Başlangıçta boştur. Basitçe bir `file` özelliği olmamasının nedeni, dosya alanlarının aynı zamanda bir `multiple` özelliğini desteklemesidir; bu da aynı anda birden fazla dosya seçmeyi mümkün kılar.

{{index "File type"}}

`files` içindeki nesneler, `name` (dosya adı), `size` (dosyanın boyutu byte cinsinden, 8 bitlik parçalar), ve `type` (dosyanın medya türü, örneğin `text/plain` veya `image/jpeg`) gibi özelliklere sahiptir.

{{index ["asynchronous programming", "reading files"], "file reading", "FileReader class"}}

{{id filereader}}

Dosyanın içeriğini içeren bir özelliğe sahip değildir. Buna erişmek biraz daha karmaşıktır. Diskten bir dosya okumak zaman alabileceğinden, belgenin donmaması için arayüzün asenkron olması gerekir.

```{lang: html}
<input type="file" multiple>
<script>
  let input = document.querySelector("input");
  input.addEventListener("change", () => {
    for (let file of Array.from(input.files)) {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        console.log("File", file.name, "starts with",
                    reader.result.slice(0, 20));
      });
      reader.readAsText(file);
    }
  });
</script>
```

{{index "FileReader class", "load event", "readAsText method", "result property"}}

Bir dosya okumak, bir `FileReader` nesnesi oluşturmak, ona bir `"load"` olay işleyicisi kaydetmek ve `readAsText` metodunu çağırarak okumak istediğimiz dosyayı vermekle yapılır. Yükleme tamamlandığında, okuyucunun `result` özelliği dosyanın içeriğini içerir.

{{index "error event", "FileReader class", "Promise class"}}

`FileReader`'lar, dosya okuma herhangi bir nedenle başarısız olduğunda bir `"error"` olayı da tetikler. Hata nesnesi, okuyucunun `error` özelliğinde bulunur. Bu arayüz, promises dilin bir parçası olmadan önce tasarlanmıştır. Bunu bir promise içinde şöyle sarmalayabilirsiniz:

```
function readFileText(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.addEventListener(
      "load", () => resolve(reader.result));
    reader.addEventListener(
      "error", () => reject(reader.error));
    reader.readAsText(file);
  });
}
```

## Verilerin istemci tarafında depolanması

{{index "web application"}}

Basit ((HTML)) sayfaları ve biraz JavaScript, "((mini uygulama))lar" için harika bir format olabilir—temel görevleri otomatikleştiren küçük yardımcı programlar. Birkaç form ((alanı))nı olay işleyicileriyle bağlayarak, santimetre ve inç arasında dönüşüm yapmaktan, bir ana şifre ve bir web sitesi adıyla şifreler hesaplamaya kadar her şeyi yapabilirsiniz.

{{index persistence, [binding, "as state"], [browser, storage]}}

Böyle bir uygulama oturumlar arasında bir şey hatırlaması gerektiğinde, JavaScript bağlamaları kullanamazsınız—bunlar sayfa her kapandığında silinir. Bir sunucu kurabilir, onu İnternete bağlayabilir ve uygulamanızın verileri orada depolamasını sağlayabilirsiniz. Bunu nasıl yapacağımızı [Bölüm ?](node)'de göreceğiz. Ama bu, çok fazla ekstra iş ve karmaşıklık anlamına gelir. Bazen veriyi sadece ((tarayıcı))da tutmak yeterli olabilir.

{{index "localStorage object", "setItem method", "getItem method", "removeItem method"}}

`localStorage` nesnesi, verilerin ((sayfa yeniden yükleme))lerine rağmen saklanmasını sağlar. Bu nesne, adlar altında dize (string) değerler dosyalamanıza olanak tanır.

```
localStorage.setItem("username", "marijn");
console.log(localStorage.getItem("username"));
// → marijn
localStorage.removeItem("username");
```

{{index "localStorage object"}}

`localStorage`'daki bir değer, üzerine yazılana kadar kalır, `removeItem` ile silinir veya kullanıcı yerel verilerini temizlerse kaldırılır.

{{index security}}

Farklı ((domain))lerden gelen siteler, farklı depolama bölmeleri alır. Bu, bir web sitesinin `localStorage`'a kaydettiği verilerin, prensipte yalnızca o aynı sitedeki betikler tarafından okunabilir (ve üzerine yazılabilir) olduğu anlamına gelir.

{{index "localStorage object"}}

Tarayıcılar, bir sitenin `localStorage`'a depolayabileceği veri miktarı üzerinde bir sınır koyar. Bu kısıtlama, ayrıca insanların ((hard disk))lerini gereksiz verilerle doldurmanın gerçekten karlı olmaması gerçeği, bu özelliğin çok fazla alan kaplamasını engeller.

{{index "localStorage object", "note-taking example", "select (HTML tag)", "button (HTML tag)", "textarea (HTML tag)"}}

Aşağıdaki kod, basit bir not alma uygulamasını uygular. Adlandırılmış bir dizi not tutar ve kullanıcıya notları düzenleme ve yenilerini oluşturma imkanı verir.

```{lang: html, startCode: true}
Notes: <select></select> <button>Add</button><br>
<textarea style="width: 100%"></textarea>

<script>
  let list = document.querySelector("select");
  let note = document.querySelector("textarea");

  let state;
  function setState(newState) {
    list.textContent = "";
    for (let name of Object.keys(newState.notes)) {
      let option = document.createElement("option");
      option.textContent = name;
      if (newState.selected == name) option.selected = true;
      list.appendChild(option);
    }
    note.value = newState.notes[newState.selected];

    localStorage.setItem("Notes", JSON.stringify(newState));
    state = newState;
  }
  setState(JSON.parse(localStorage.getItem("Notes")) ?? {
    notes: {"shopping list": "Carrots\nRaisins"},
    selected: "shopping list"
  });

  list.addEventListener("change", () => {
    setState({notes: state.notes, selected: list.value});
  });
  note.addEventListener("change", () => {
    let {selected} = state;
    setState({
      notes: {...state.notes, [selected]: note.value},
      selected
    });
  });
  document.querySelector("button")
    .addEventListener("click", () => {
      let name = prompt("Note name");
      if (name) setState({
        notes: {...state.notes, [name]: ""},
        selected: name
      });
    });
</script>
```

{{index "getItem method", JSON, "?? operator", "default value"}}

Betik, başlangıç durumunu `localStorage`'da depolanan `"Notes"` değerinden alır veya bu değer eksikse içinde yalnızca bir alışveriş listesi bulunan örnek bir durum oluşturur. `localStorage`'dan var olmayan bir alan okunduğunda `null` döner. `null`'ı `JSON.parse`'a geçirmek, `"null"` dizesini çözümlemesine ve `null` döndürmesine neden olur. Bu nedenle, `||` operatörü, böyle bir durumda varsayılan bir değer sağlamak için kullanılabilir.

`setState` metodu, DOM'un verilen bir durumu gösterdiğinden emin olur ve yeni durumu `localStorage`'a depolar. Olay işleyicileri, yeni bir duruma geçmek için bu fonksiyonu çağırır.

{{index [object, creation], property, "computed property"}}

Örnekteki `...` sözdizimi, eski `state.notes` nesnesinin bir kopyasını oluşturan yeni bir nesne yaratmak için kullanılır, ancak bir özellik eklenir veya üzerine yazılır. İlk olarak eski nesneden özellikleri eklemek için ((spread)) sözdizimi kullanılır, ardından yeni bir özellik atanır. Nesne literal'inde ((square brackets)) gösterimi, adının bazı dinamik değerlere dayalı olduğu bir özellik oluşturmak için kullanılır.

{{index "sessionStorage object", [browser, storage]}}

`localStorage`'a benzer bir başka nesne daha vardır, o da `sessionStorage`'dır. İkisi arasındaki fark, `sessionStorage`'ın içeriğinin her _((session))_ sonunda unutulmasıdır; bu, çoğu tarayıcı için tarayıcı kapandığında anlamına gelir.

## Özet

Bu bölümde, HTTP protokolünün nasıl çalıştığını tartıştık. Bir _istemci_ bir istek gönderir, bu istek genellikle bir `GET` metodu ve bir kaynağı tanımlayan bir yol içerir. _Sunucu_ ise isteği ne yapacağına karar verir ve bir durum kodu ve yanıt gövdesi ile yanıt verir. Hem istekler hem de yanıtlar, ek bilgi sağlayan başlıklar içerebilir.

Tarayıcı JavaScript'inin HTTP istekleri yapabileceği arayüz `fetch` olarak adlandırılır. Bir istek yapmak şu şekilde görünür:

```
fetch("/18_http.html").then(r => r.text()).then(text => {
  console.log(`The page starts with ${text.slice(0, 15)}`);
});
```

Tarayıcılar, bir web sayfasını görüntülemek için gerekli kaynakları almak amacıyla `GET` istekleri yapar. Bir sayfa ayrıca, kullanıcı tarafından girilen bilgilerin, form gönderildiğinde yeni bir sayfa için istek olarak gönderilmesine olanak tanıyan formlar içerebilir.

HTML, metin alanları, onay kutuları, çoktan seçmeli alanlar ve dosya seçiciler gibi çeşitli form alanlarını temsil edebilir.

Bu tür alanlar JavaScript ile denetlenebilir ve manipüle edilebilir. Değiştirildiklerinde `"change"` olayı tetiklerler, metin yazıldığında `"input"` olayı tetiklerler ve klavye odaklandığında klavye olaylarını alırlar. `value` (metin ve seçme alanları için) veya `checked` (onay kutuları ve radyo düğmeleri için) gibi özellikler, alanın içeriğini okumak veya ayarlamak için kullanılır.

Bir form gönderildiğinde, üzerine bir `"submit"` olayı tetiklenir. Bir JavaScript işleyicisi, bu olay üzerinde `preventDefault` çağrısı yaparak tarayıcının varsayılan davranışını devre dışı bırakabilir. Form alanı elemanları, bir form etiketi dışında da bulunabilir.

Kullanıcı, bir dosya seçici alanında yerel dosya sisteminden bir dosya seçtiğinde, `FileReader` arayüzü, JavaScript programından bu dosyanın içeriğine erişmek için kullanılabilir.

`localStorage` ve `sessionStorage` nesneleri, sayfa yeniden yüklense bile bilgiyi kaydetmek için kullanılabilir. İlk nesne veriyi sonsuza kadar (veya kullanıcı temizlemeye karar verene kadar) saklar, ikinci nesne ise veriyi tarayıcı kapatılana kadar saklar.

## Egzersizler

### İçerik müzakeresi

{{index "Accept header", "media type", "document format", "content negotiation (exercise)"}}

HTTP'nin yapabileceği şeylerden biri de _içerik müzakeresi_ olarak adlandırılır. `Accept` istek başlığı, istemcinin almak istediği belge türünü sunucuya bildirmek için kullanılır. Birçok sunucu bu başlığı görmezden gelir, ancak bir sunucu, bir kaynağı kodlamak için çeşitli yollar bildiğinde, bu başlığa bakarak istemcinin tercih ettiği belgeyi gönderebilir.

{{index "MIME type"}}

[_https://eloquentjavascript.net/author_](https://eloquentjavascript.net/author) URL'su, istemcinin talep ettiği formata göre düz metin, HTML veya JSON ile yanıt verecek şekilde yapılandırılmıştır. Bu formatlar, standartlaştırılmış _((medya türü))_ `text/plain`, `text/html` ve `application/json` ile tanımlanır.

{{index "headers property", "fetch function"}}

Bu kaynağın tüm üç formatını almak için istekler gönderin. `fetch`'e geçirilen seçenekler nesnesinde `headers` özelliğini kullanarak `Accept` başlığını istenen medya türüne ayarlayın.

Son olarak, `application/rainbows+unicorns` medya türünü istemeyi deneyin ve hangi durum kodunu ürettiğine bakın.

{{if interactive

```{test: no}
// Kodunuz buraya.
```

if}}

{{hint

{{index "content negotiation (exercise)"}}

Kodunuzu, [önceki bölümlerdeki `fetch` örneklerine](http#fetch) dayandırın.

{{index "406 (HTTP status code)", "Accept header"}}

Geçersiz bir medya türü istemek, 406 kodlu bir yanıt döndürecektir, "Kabul Edilemez" anlamına gelir. Bu, bir sunucunun `Accept` başlığını yerine getiremeyeceği zaman döndürmesi gereken koddur.

hint}}

### Bir JavaScript çalışma tezgahı

{{index "JavaScript console", "workbench (exercise)"}}

İnsanların JavaScript kodu yazıp çalıştırmalarına olanak tanıyan bir arayüz oluşturun.

{{index "textarea (HTML tag)", "button (HTML tag)", "Function constructor", "error message"}}

Yanına bir `<textarea>` alanı ekleyin ve bu alana basıldığında, [Bölüm ?](modules#eval)'de gördüğümüz `Function` constructor'ını kullanarak metni bir fonksiyonla sarıp çağıran bir buton ekleyin. Fonksiyonun döndürdüğü değeri veya oluşturduğu hatayı bir string'e çevirin ve bu metni, metin alanının altına görüntüleyin.

{{if interactive

```{lang: html, test: no}
<textarea id="code">return "hi";</textarea>
<button id="button">Run</button>
<pre id="output"></pre>

<script>
  // Kodunuz buraya.
</script>
```

if}}

{{hint

{{index "click event", "mousedown event", "Function constructor", "workbench (exercise)"}}

HTML'nizde tanımlanan elemanlara erişmek için `document.querySelector` veya `document.getElementById` kullanın. Butona tıklama veya fareyle tıklama `"click"` ya da `"mousedown"` olayları için bir olay işleyicisi, metin alanının `value` özelliğini alabilir ve buna `Function` çağırabilir.

{{index "try keyword", "exception handling"}}

Hem `Function` çağrısını hem de sonucuna yapılan çağrıyı bir `try` bloğuna sarmayı unutmayın, böylece ürettiği istisnaları yakalayabilirsiniz. Bu durumda, hangi türde bir istisna ile karşılaşacağımızı gerçekten bilmiyoruz, bu yüzden her şeyi yakalayın.

{{index "textContent property", output, text, "createTextNode method", "newline character"}}

Çıktı öğesinin `textContent` özelliği, onu bir metin mesajı ile doldurmak için kullanılabilir. Veya eski içeriği korumak istiyorsanız, `document.createTextNode` kullanarak yeni bir metin düğümü oluşturun ve bunu öğeye ekleyin. Unutmayın, tüm çıktının tek bir satırda görünmemesi için sonuna bir satır sonu karakteri eklemelisiniz.

hint}}

### Conway'in Hayat Oyunu

{{index "game of life (exercise)", "artificial life", "Conway's Game of Life"}}

Conway'nin Hayat Oyunu, her hücresinin ya canlı ya da ölü olduğu bir ((ızgara)) üzerinde yapay "hayat" yaratan basit bir ((simülasyon))dur. Her ((nesil)) (tur), aşağıdaki kurallar uygulanır:

- İki veya daha fazla canlı ((komşu))ya sahip olan herhangi bir canlı ((hücre)) ölür.

- İki veya üç canlı komşuya sahip olan herhangi bir canlı hücre bir sonraki nesile geçer.

- Tam olarak üç canlı komşuya sahip olan herhangi bir ölü hücre, canlı bir hücreye dönüşür.

Bir _komşu_, herhangi bir komşu hücreyi, çapraz komşular dahil olmak üzere tanımlar.

{{index "pure function"}}

Bu kuralların tamamının bir kerede, tüm ızgaraya uygulandığını unutmayın, her bir kareye tek tek değil. Bu, komşuların sayılmasının neslin başlangıcındaki duruma dayandığı anlamına gelir ve bu nesil sırasında komşu hücrelerde meydana gelen değişiklikler, belirli bir hücrenin yeni durumunu etkilememelidir.

{{index "Math.random function"}}

Bu oyunu, uygun bulduğunuz herhangi bir ((veri yapısı))nı kullanarak uygulayın. İlk başta ızgarayı rastgele bir desenle doldurmak için `Math.random` kullanın. Bunu, yanına bir ((düğme)) ekleyerek ve her bir ((checkbox)) ((alan))ı olarak ızgarayı görüntüleyerek yapın, böylece bir sonraki ((nesil))e geçiş sağlanabilir. Kullanıcı onay kutularını işaretlediğinde veya işaretini kaldırdığında, bu değişiklikler bir sonraki nesli hesaplamada dikkate alınmalıdır.

{{if interactive

```{lang: html, test: no}
<div id="grid"></div>
<button id="next">Next generation</button>

<script>
  // Kodunuz buraya.
</script>
```

if}}

{{hint

{{index "game of life (exercise)"}}

Değişikliklerin kavramsal olarak aynı anda gerçekleşmesi sorununu çözmek için, ((nesil)) hesaplamasını bir ((saf fonksiyon)) olarak görmeye çalışın; bu fonksiyon, bir ((ızgara)) alır ve bir sonraki turu temsil eden yeni bir ızgara üretir.

Matrisin temsil edilmesi, genişlik × yükseklik öğeleri içeren tek bir diziyle yapılabilir, değerler satır satır saklanır, bu nedenle örneğin beşinci satırdaki üçüncü öğe (sıfır tabanlı indeksleme kullanarak) 4 × _genişlik_ + 2 pozisyonunda saklanır. Canlı ((komşu)) sayısını, her iki boyutta bitişik koordinatlar üzerinde dönen iki iç içe döngüyle sayabilirsiniz. Alanın dışındaki hücreleri saymamaya ve saydığımız hücrenin komşusu olan merkez hücresini görmezden gelmeye dikkat edin.

{{index "event handling", "change event"}}

((Checkbox))lerdeki değişikliklerin bir sonraki nesilde etkili olmasını sağlamak iki şekilde yapılabilir. Bir olay işleyicisi bu değişiklikleri fark edebilir ve mevcut ızgarayı yansıtacak şekilde güncelleyebilir, ya da bir sonraki dönüşü hesaplamadan önce, checkbox'lardaki değerlerden taze bir ızgara oluşturabilirsiniz.

Olay işleyicilerini tercih ederseniz, her checkbox'ın hangi hücreye karşılık geldiğini kolayca bulmak için her bir checkbox'a pozisyonu tanımlayan ((özellik))ler eklemek isteyebilirsiniz.

{{index drawing, "table (HTML tag)", "br (HTML tag)"}}

Checkbox'ların ızgarasını çizmek için ya bir `<table>` elementi kullanabilirsiniz (bkz. [Bölüm ?](dom#exercise_table)) ya da hepsini aynı elementte toplayıp satırlar arasına `<br>` (satır sonu) elemanları ekleyebilirsiniz.

hint}}
