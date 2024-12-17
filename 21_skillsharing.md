{{meta {code_links: ["code/skillsharing.zip"]}}}

# Proje: Beceri Paylaşım Web Sitesi

{{quote {author: "Margaret Fuller", chapter: true}

Eğer bilginiz varsa, bırakın başkaları da mumlarını yaksın.

quote}}

{{index "skill-sharing project", meetup, "project chapter"}}

{{figure {url: "img/chapter_picture_21.jpg", alt: "Posta kutusuna yaslanmış iki tek tekerlekli bisikleti gösteren çizim", chapter: "framed"}}}

Bir _((beceri paylaşımı))_ toplantısı, ortak bir ilgi alanına sahip insanların bir araya geldiği ve bildikleri şeyler hakkında küçük, gayri resmi sunumlar yaptığı bir etkinliktir. Bir ((bahçecilik)) beceri paylaşım toplantısında, birisi ((kereviz)) yetiştirmeyi açıklayabilir. Ya da bir programlama beceri paylaşım grubuna uğrayıp insanlara Node.js hakkında bilgi verebilirsiniz.

{{index learning, "users' group"}}

Bilgisayarlarla ilgili olduklarında genellikle _kullanıcı grupları_ olarak da adlandırılan bu tür buluşmalar, bir şeyler öğrenmek veya benzer ilgi alanlarına sahip insanlarla tanışmak için harika bir yol olabilir. Birçok büyük şehirde JavaScript buluşmaları vardır. Bu buluşmalara katılmak genellikle ücretsizdir ve ben ziyaret ettiğim buluşmaları arkadaş canlısı ve misafirperver buldum.

Bu son proje bölümünde amacımız, bir beceri paylaşım toplantısında verilen ((konuşma))ları yönetmek için bir ((web sitesi)) kurmaktır. Küçük bir grup insanın düzenli olarak üyelerden birinin ofisinde ((unicycling)) hakkında konuşmak için toplandığını hayal edin. Toplantıların önceki organizatörü başka bir şehre taşındı ve kimse bu görevi devralmak için öne çıkmadı. Aktif bir organizatör olmadan katılımcıların kendi aralarında konuşmalar önermesine ve tartışmasına izin verecek bir sistem istiyoruz.

[Tıpkı [önceki bölüm](node)'da olduğu gibi, bu bölümdeki kodların bazıları Node.js için yazılmıştır ve doğrudan baktığınız HTML sayfasında çalıştırılması pek olası değildir] {if interactive} Projenin tam kodu [_https://eloquentjavascript.net/code/skillsharing.zip_](https://eloquentjavascript.net/code/skillsharing.zip) adresinden ((indirilebilir)).

## Tasarım

{{index "skill-sharing project", persistence}}

Bu projenin ((Node.js)) için yazılmış bir _((sunucu))_ kısmı ve ((tarayıcı)) için yazılmış bir _((istemci))_ kısmı vardır. Sunucu, sistemin verilerini depolar ve istemciye sağlar. Ayrıca istemci tarafı sistemini uygulayan dosyaları da sunar.

{{index [HTTP, client]}}

Sunucu bir sonraki toplantı için önerilen ((konuşma))ların listesini tutar ve istemci bu listeyi gösterir. Her konuşmanın bir sunucu adı, bir başlığı, bir özeti ve onunla ilişkili bir dizi ((yorum)) vardır. İstemci, kullanıcıların yeni konuşmalar önermesine (bunları listeye ekleyerek), konuşmaları silmesine ve mevcut konuşmalar hakkında yorum yapmasına olanak tanır. Kullanıcı böyle bir değişiklik yaptığında, istemci sunucuya bunu bildirmek için bir HTTP ((request)) yapar.

{{figure {url: "img/skillsharing.png", alt: "Beceri paylaşım web sitesinin ekran görüntüsü", width: "10cm"}}}

{{index "live view", "user experience", "pushing data", connection}}

((Uygulama)), önerilen mevcut konuşmaların ve yorumlarının _canlı_ bir görünümünü gösterecek şekilde ayarlanacaktır. Birisi, bir yerde, yeni bir konuşma gönderdiğinde veya bir yorum eklediğinde, sayfayı tarayıcılarında açık tutan herkes değişikliği hemen görmelidir. Bu biraz zor bir iş; bir web sunucusunun bir istemciyle bağlantı kurmasının bir yolu olmadığı gibi, belirli bir web sitesine o anda hangi istemcilerin baktığını bilmenin de iyi bir yolu yok.

{{index "Node.js"}}

Bu soruna yaygın bir çözüm _((long polling))_ olarak adlandırılır ve bu, Node'un tasarımının motivasyonlarından biridir.

## Long polling

{{index firewall, notification, "long polling", network, [browser, security]}}

Bir istemciye bir şeyin değiştiğini anında bildirebilmek için, o istemciye bir ((bağlantı)) gerekir. Web tarayıcıları geleneksel olarak bağlantıları kabul etmediğinden ve istemciler genellikle bu tür bağlantıları engelleyecek ((yönlendirici))'lerin arkasında olduğundan, sunucunun bu bağlantıyı başlatması pratik değildir.

İstemcinin bağlantıyı açmasını ve sunucunun ihtiyaç duyduğunda bilgi göndermek için kullanabilmesi için bağlantıda tutmasını sağlayabiliriz.

{{index socket}}

Ancak bir ((HTTP)) isteği yalnızca basit bir bilgi akışına izin verir: istemci bir istek gönderir, sunucu tek bir yanıtla geri döner ve hepsi bu kadar. Modern tarayıcılar tarafından desteklenen _((WebSockets))_ adında bir teknoloji vardır ve bu teknoloji rastgele veri alışverişi için ((connection))lar açmayı mümkün kılar. Ancak bunları doğru şekilde kullanmak biraz zordur.

Bu bölümde, istemcilerin normal HTTP isteklerini kullanarak sürekli olarak sunucudan yeni bilgiler istediği ve sunucunun bildirecek yeni bir şeyi olmadığında yanıtını beklettiği daha basit bir teknik -((long polling))\_ kullanıyoruz.

{{index "live view"}}

İstemci sürekli olarak bir yoklama isteğinin açık olduğundan emin olduğu sürece, kullanılabilir hale geldikten sonra sunucudan hızlı bir şekilde bilgi alacaktır. Örneğin, Fatma'nın tarayıcısında beceri paylaşım uygulamamız açıksa, bu tarayıcı güncellemeler için bir istekte bulunmuş ve bu isteğe yanıt bekliyor olacaktır. Iman, Extreme Downhill Unicycling hakkında bir konuşma gönderdiğinde, sunucu Fatma'nın güncellemeleri beklediğini fark edecek ve bekleyen isteğine yeni konuşmayı içeren bir yanıt gönderecektir. Fatma'nın tarayıcısı verileri alacak ve konuşmayı göstermek için ekranı güncelleyecektir.

{{index robustness, timeout}}

Bağlantıların zaman aşımına uğramasını (etkinlik eksikliği nedeniyle iptal edilmesini) önlemek için, ((uzun yoklama)) teknikleri genellikle her istek için maksimum bir süre belirler, bu sürenin sonunda sunucu bildirecek hiçbir şeyi olmasa bile yine de yanıt verir. İstemci daha sonra yeni bir istek başlatabilir. İsteğin periyodik olarak yeniden başlatılması da tekniği daha sağlam hale getirerek istemcilerin geçici ((bağlantı)) arızalarından veya sunucu sorunlarından kurtulmasını sağlar.

{{index "Node.js"}}

Uzun yoklama kullanan yoğun bir sunucuda binlerce bekleyen istek ve dolayısıyla ((TCP)) bağlantısı açık olabilir. Her biri için ayrı bir kontrol iş parçacığı oluşturmadan birçok bağlantıyı yönetmeyi kolaylaştıran Node, böyle bir sistem için iyi bir seçimdir.

## HTTP arayüzü

{{index "skill-sharing project", [interface, HTTP]}}

Sunucuyu ya da istemciyi tasarlamaya başlamadan önce, temas ettikleri noktayı düşünelim: üzerinden iletişim kurdukları ((HTTP)) arayüzü.

{{index [path, URL], [method, HTTP]}}

İstek ve yanıt gövdelerimizin formatı olarak ((JSON)) kullanacağız. [Bölüm ?](node#file_server)'daki dosya sunucusunda olduğu gibi, HTTP yöntemlerini ve ((header))'ları iyi kullanmaya çalışacağız. Arayüz `/talks` yolu etrafında merkezlenmiştir. `/talks` ile başlamayan yollar ((statik dosya))ları (istemci tarafı sistemi için HTML ve JavaScript kodu) sunmak için kullanılacaktır.

{{index "GET method"}}

Bir `GET` isteği `/talks` için aşağıdaki gibi bir JSON belgesi döndürür:

```{lang: "json"}
[{"title": "Unituning",
  "presenter": "Jamal",
  "summary": "Modifying your cycle for extra style",
  "comments": []}]
```

{{index "PUT method", URL}}

Yeni bir konuşma oluşturmak için `/talks/Unituning` gibi bir URL'ye `PUT` isteği yapılır, burada ikinci eğik çizgiden sonraki kısım konuşmanın başlığıdır. `PUT` isteğinin gövdesi, `presenter` ve `summary` özelliklerine sahip bir ((JSON)) nesnesi içermelidir.

{{index "encodeURIComponent function", [escaping, "in URLs"], [whitespace, "in URLs"]}}

Konuşma başlıkları normalde bir URL'de görünmeyen boşluklar ve diğer karakterler içerebileceğinden, böyle bir URL oluşturulurken başlık dizeleri `encodeURIComponent` işlevi ile kodlanmalıdır.

```
console.log("/talks/" + encodeURIComponent("How to Idle"));
// → /talks/How%20to%20Idle
```

Rölanti hakkında bir konuşma oluşturma talebi şöyle görünebilir:

```{lang: http}
PUT /talks/How%20to%20Idle HTTP/1.1
Content-Type: application/json
Content-Length: 92

{"presenter": "Maureen",
 "summary": "Standing still on a unicycle"}
```

Bu tür URL'ler ayrıca bir konuşmanın JSON temsilini almak için `GET` isteklerini ve bir konuşmayı silmek için `DELETE` isteklerini de destekler.

{{index "POST method"}}

Bir konuşmaya ((yorum)) eklemek, `author` ve `message` özelliklerine sahip bir JSON gövdesi ile `/talks/Unituning/comments` gibi bir URL'ye `POST` isteği ile yapılır.

```{lang: http}
POST /talks/Unituning/comments HTTP/1.1
Content-Type: application/json
Content-Length: 72

{"author": "Iman",
 "message": "Will you talk about raising a cycle?"}
```

{{index "query string", timeout, "ETag header", "If-None-Match header"}}

((uzun yoklama)) desteklemek için, `/talks` için `GET` istekleri, sunucuya yeni bilgi mevcut değilse yanıtı geciktirmesini bildiren ekstra başlıklar içerebilir. Normalde önbelleğe almayı yönetmek için tasarlanmış bir çift başlık kullanacağız: `ETag` ve `If-None-Match`.

{{index "304 (HTTP status code)"}}

Sunucular bir yanıta `ETag` (“varlık etiketi”) başlığı ekleyebilir. Değeri, kaynağın geçerli sürümünü tanımlayan bir dizedir. İstemciler, daha sonra bu kaynağı tekrar talep ettiklerinde, değeri aynı dizeyi tutan bir `If-None-Match` başlığı ekleyerek bir _((koşullu istek))_ yapabilir. Kaynak değişmemişse, sunucu “değiştirilmemiş” anlamına gelen 304 durum koduyla yanıt verir ve istemciye önbelleğe alınmış sürümünün hala geçerli olduğunu söyler. Etiket eşleşmediğinde, sunucu normal şekilde yanıt verir.

{{index "Prefer header"}}

İstemcinin sunucuya konuşma listesinin hangi sürümüne sahip olduğunu söyleyebileceği ve sunucunun yalnızca bu liste değiştiğinde yanıt vereceği böyle bir şeye ihtiyacımız var. Ancak sunucu hemen bir 304 yanıtı döndürmek yerine, yanıtı bekletmeli ve yalnızca yeni bir şey mevcut olduğunda veya belirli bir süre geçtiğinde geri dönmelidir. Uzun yoklama isteklerini normal koşullu isteklerden ayırmak için, sunucuya istemcinin yanıt için 90 saniyeye kadar beklemeye istekli olduğunu söyleyen `Prefer: wait=90` adlı başka bir başlık veriyoruz.

Sunucu, görüşmeler her değiştiğinde güncellediği bir sürüm numarası tutacak ve bunu `ETag` değeri olarak kullanacaktır. İstemciler, konuşmalar değiştiğinde haberdar olmak için bunun gibi isteklerde bulunabilirler:

```{lang: null}
GET /talks HTTP/1.1
If-None-Match: "4"
Prefer: wait=90

(time passes)

HTTP/1.1 200 OK
Content-Type: application/json
ETag: "5"
Content-Length: 295

[....]
```

{{index security}}

Burada açıklanan protokol herhangi bir ((erişim kontrolü)) yapmaz. Herkes yorum yapabilir, görüşmeleri değiştirebilir ve hatta silebilir. (İnternet ((holigan))larla dolu olduğu için, böyle bir sistemi daha fazla koruma olmadan çevrimiçi hale getirmek muhtemelen iyi sonuçlanmayacaktır).

## Sunucu

{{index "skill-sharing project"}}

Programın ((sunucu)) tarafını oluşturarak başlayalım. Bu bölümdeki kod ((Node.js)) üzerinde çalışır.

### Yönlendirme

{{index "createServer function", [path, URL], [method, HTTP]}}

Sunucumuz bir HTTP sunucusu başlatmak için Node'un `createServer` özelliğini kullanacaktır. Yeni bir isteği işleyen işlevde, desteklediğimiz çeşitli istek türlerini (yöntem ve yol tarafından belirlendiği gibi) ayırt etmeliyiz. Bu, uzun bir `if` deyimleri zinciri ile yapılabilir, ancak daha güzel bir yol vardır.

{{index dispatch}}

Bir _((router))_, bir isteği onu işleyebilecek işleve göndermeye yardımcı olan bir bileşendir. Örneğin, yönlendiriciye `/^\/talks\/([^\/]+)$/` (`/talks/` ve ardından bir konuşma başlığı) düzenli ifadesiyle eşleşen bir yola sahip `PUT` isteklerinin belirli bir işlev tarafından işlenebileceğini söyleyebilirsiniz. Buna ek olarak, ((düzenli ifade)) içinde parantez içine alınmış yolun anlamlı kısımlarını (bu durumda konuşma başlığı) ayıklamaya ve bunları işleyici fonksiyona aktarmaya yardımcı olabilir.

((NPM))'de bir dizi iyi yönlendirici paketi vardır, ancak burada prensibi göstermek için kendimiz bir tane yazacağız.

{{index "import keyword", "Router class", module}}

Bu, daha sonra sunucu modülümüzden `import` edeceğimiz `router.mjs` dosyasıdır:

```{includeCode: ">code/skillsharing/router.mjs"}
import {parse} from "node:url";

export class Router {
  constructor() {
    this.routes = [];
  }
  add(method, url, handler) {
    this.routes.push({method, url, handler});
  }
}

async function resolveRequest(router, context, request) {
  let path = parse(request.url).pathname;

  for (let {method, url, handler} of this.routes) {
    let match = url.exec(path);
    if (!match || request.method != method) continue;
    let urlParts = match.slice(1).map(decodeURIComponent);
    let response =
      await handler(context, ...urlParts, request);
    if (response) return response;
  }
}
```

{{index "Router class"}}

Modül `Router` sınıfını dışa aktarır. Bir router nesnesi `add` yöntemiyle yeni işleyicilerin kaydedilmesine izin verir ve `resolve` yöntemiyle istekleri çözebilir.

{{index "some method"}}

İkincisi, bir işleyici bulunduğunda bir yanıt, aksi takdirde `null` döndürür. Eşleşen bir rota bulunana kadar rotaları teker teker (tanımlandıkları sırayla) dener.

{{index "capture group", "decodeURIComponent function", [escaping, "in URLs"]}}

İşleyici işlevleri `context` değeri (bizim durumumuzda sunucu örneği olacaktır), ((düzenli ifade)) içinde tanımladıkları herhangi bir grup için eşleşme dizeleri ve istek nesnesi ile çağrılır. Ham URL `%20` tarzı kodlar içerebileceğinden, dizelerin URL kodu çözülmelidir.

### Dosyaları servis etme

Bir istek yönlendiricimizde tanımlanan istek türlerinden hiçbiriyle eşleşmediğinde, sunucu bunu `public` dizinindeki bir dosya için istek olarak yorumlamalıdır. Bu tür dosyaları sunmak için [Bölüm ?](node#file_server)'da tanımlanan dosya sunucusunu kullanmak mümkün olabilir, ancak dosyalar üzerinde `PUT` ve `DELETE` isteklerini desteklemeye ne ihtiyacımız var ne de istiyoruz ve önbelleğe alma desteği gibi gelişmiş özelliklere sahip olmak istiyoruz. Bu yüzden bunun yerine ((NPM))'den sağlam, iyi test edilmiş bir ((statik dosya)) sunucusu kullanalım.

{{index "createServer function", "serve-static package"}}

Ben `serve-static`'i seçtim. Bu NPM'deki tek sunucu değil, ancak iyi çalışıyor ve amaçlarımıza uyuyor. `serve-static` paketi, bir istek işleyici işlevi üretmek için bir kök dizinle çağrılabilen bir işlevi dışa aktarır. İşleyici işlev, sunucu tarafından sağlanan `request` ve `response` argümanlarını ve üçüncü bir argümanı, istekle eşleşen bir dosya yoksa çağıracağı bir işlevi kabul eder. Sunucumuzun öncelikle yönlendiricide tanımlandığı gibi özel olarak ele almamız gereken istekleri kontrol etmesini istiyoruz, bu yüzden bunu başka bir fonksiyona sarıyoruz.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
import {createServer} from "node:http";
import serveStatic from "serve-static";

function notFound(request, response) {
  response.writeHead(404, "Not found");
  response.end("<h1>Not found</h1>");
}

class SkillShareServer {
  constructor(talks) {
    this.talks = talks;
    this.version = 0;
    this.waiting = [];

    let fileServer = serveStatic("./public");
    this.server = createServer((request, response) => {
      serveFromRouter(this, request, response, () => {
        fileServer(request, response, notFound);
      });
    });
  }
  start(port) {
    this.server.listen(port);
  }
  stop() {
    this.server.close();
  }
}
```

`serveFromRouter` fonksiyonu `fileServer` ile aynı arayüze sahiptir ve `(request, response, next)` argümanlarını alır. Bu, birkaç istek işleyicisini “zincirlememize” olanak tanıyarak her birinin isteği işlemesine veya bunun sorumluluğunu bir sonraki işleyiciye devretmesine izin verir. Son işleyici, `notFound`, sadece “bulunamadı” hatası ile yanıt verir.

Bizim `serveFromRouter` fonksiyonumuz, yanıtlar için [önceki bölüm](node)'daki dosya sunucusuna benzer bir konvansiyon kullanır-yönlendiricideki işleyici, yanıtı tanımlayan nesnelere çözümlenen vaatler döndürür.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
import {Router} from "./router.mjs";

const router = new Router();
const defaultHeaders = {"Content-Type": "text/plain"};

async function serveResponse(value, response) {
  let {body, status = 200, headers = defaultHeaders} =
    await resolved.catch(error => {
      if (error.status != null) return error;
      return {body: String(error), status: 500};
    });
  response.writeHead(status, headers);
  response.end(body);
}
```

### Kaynak olarak konuşmalar

Önerilen ((konuşma))lar, özellik adları konuşma başlıkları olan bir nesne olan sunucunun `talks` özelliğinde saklanır. Bunlar `/talks/[title]` altında HTTP ((resource))ları olarak gösterilecektir, bu nedenle yönlendiricimize istemcilerin bunlarla çalışmak için kullanabileceği çeşitli yöntemleri uygulayan işleyiciler eklememiz gerekir.

{{index "GET method", "404 (HTTP status code)" "hasOwn function"}}

Tek bir konuşmayı `GET`leyen isteklerin işleyicisi konuşmayı aramalı ve konuşmanın JSON verileriyle ya da 404 hata yanıtıyla yanıt vermelidir.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
const talkPath = /^\/talks\/([^\/]+)$/;

router.add("GET", talkPath, async (server, title) => {
  if (Object.hasOwn(server.talks, title)) {
    return {body: JSON.stringify(server.talks[title]),
            headers: {"Content-Type": "application/json"}};
  } else {
    return {status: 404, body: `No talk '${title}' found`};
  }
});
```

{{index "DELETE method"}}

Bir konuşmayı silmek, onu `talks` nesnesinden kaldırarak yapılır.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
router.add("DELETE", talkPath, async (server, title) => {
  if (Object.hasOwn(server.talks, title)) {
    delete server.talks[title];
    server.updated();
  }
  return {status: 204};
});
```

{{index "long polling", "updated method"}}

[Daha sonra](skillsharing#updated) tanımlayacağımız `updated` yöntemi, bekleyen uzun yoklama isteklerini değişiklik hakkında bilgilendirir.

{{index "readStream function", "body (HTTP)", stream}}

Bir istek gövdesinin içeriğini almak için, tüm içeriği bir ((okunabilir akış))'tan okuyan ve bir dizeye çözümlenen bir söz döndüren `readStream` adlı bir işlev tanımlarız.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
function readStream(stream) {
  return new Promise((resolve, reject) => {
    let data = "";
    stream.on("error", reject);
    stream.on("data", chunk => data += chunk.toString());
    stream.on("end", () => resolve(data));
  });
}
```

{{index validation, input, "PUT method"}}

İstek gövdelerini okuması gereken bir işleyici, yeni ((talk))'lar oluşturmak için kullanılan `PUT` işleyicisidir. Kendisine verilen verinin string olan `presenter` ve `summary` özelliklerine sahip olup olmadığını kontrol etmek zorundadır. Sistem dışından gelen herhangi bir veri saçma olabilir ve kötü istekler geldiğinde dahili veri modelimizi bozmak veya ((çökmek)) istemiyoruz.

{{index "updated method"}}

Veriler geçerli görünüyorsa, işleyici yeni konuşmayı temsil eden bir nesneyi `talks` nesnesinde saklar, muhtemelen bu başlığa sahip mevcut bir konuşmayı ((üzerine yazar)) ve tekrar `updated` çağrısı yapar.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
router.add("PUT", talkPath,
           async (server, title, request) => {
  let requestBody = await readStream(request);
  let talk;
  try { talk = JSON.parse(requestBody); }
  catch (_) { return {status: 400, body: "Invalid JSON"}; }

  if (!talk ||
      typeof talk.presenter != "string" ||
      typeof talk.summary != "string") {
    return {status: 400, body: "Bad talk data"};
  }
  server.talks[title] = {
    title,
    presenter: talk.presenter,
    summary: talk.summary,
    comments: []
  };
  server.updated();
  return {status: 204};
});
```

{{index validation, "readStream function"}}

Bir ((talk))'a ((comment)) eklemek de benzer şekilde çalışır. İsteğin içeriğini almak, elde edilen verileri doğrulamak ve geçerli göründüğünde bir yorum olarak saklamak için `readStream` kullanıyoruz.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
router.add("POST", /^\/talks\/([^\/]+)\/comments$/,
           async (server, title, request) => {
  let requestBody = await readStream(request);
  let comment;
  try { comment = JSON.parse(requestBody); }
  catch (_) { return {status: 400, body: "Invalid JSON"}; }

  if (!comment ||
      typeof comment.author != "string" ||
      typeof comment.message != "string") {
    return {status: 400, body: "Bad comment data"};
  } else if (Object.hasOwn(server.talks, title)) {
    server.talks[title].comments.push(comment);
    server.updated();
    return {status: 204};
  } else {
    return {status: 404, body: `No talk '${title}' found`};
  }
});
```

{{index "404 (HTTP status code)"}}

Var olmayan bir konuşmaya yorum eklemeye çalışmak 404 hatası döndürüyor.

### Long polling desteği

Sunucunun en ilginç yönü ((uzun yoklama)) ile ilgilenen kısmıdır. Bir `GET` isteği `/talks` için geldiğinde, bu normal bir istek ya da uzun bir yoklama isteği olabilir.

{{index "talkResponse method", "ETag header"}}

İstemciye bir dizi konuşma göndermemiz gereken birden fazla yer olacaktır, bu nedenle önce böyle bir dizi oluşturan ve yanıta bir `ETag` başlığı ekleyen bir yardımcı yöntem tanımlıyoruz.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
SkillShareServer.prototype.talkResponse = function() {
  let talks = Object.keys(this.talks)
    .map(title => this.talks[title]);
  return {
    body: JSON.stringify(talks),
    headers: {"Content-Type": "application/json",
              "ETag": `"${this.version}"`,
              "Cache-Control": "no-store"}
  };
};
```

{{index "query string", "url package", parsing}}

İşleyicinin kendisinin `If-None-Match` ve `Prefer` başlıklarının mevcut olup olmadığını görmek için istek başlıklarına bakması gerekir. Node, adları büyük/küçük harf duyarsız olarak belirtilen başlıkları küçük harf adları altında saklar.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
router.add("GET", /^\/talks$/, async (server, request) => {
  let tag = /"(.*)"/.exec(request.headers["if-none-match"]);
  let wait = /\bwait=(\d+)/.exec(request.headers["prefer"]);
  if (!tag || tag[1] != server.version) {
    return server.talkResponse();
  } else if (!wait) {
    return {status: 304};
  } else {
    return server.waitForChanges(Number(wait[1]));
  }
});
```

{{index "long polling", "waitForChanges method", "If-None-Match header", "Prefer header"}}

Hiçbir etiket verilmemişse veya sunucunun geçerli sürümüyle eşleşmeyen bir etiket verilmişse, işleyici görüşmelerin listesiyle yanıt verir. İstek koşulluysa ve görüşmeler değişmediyse, yanıtı geciktirmemiz veya hemen yanıtlamamız gerekip gerekmediğini görmek için `Prefer` başlığına bakarız.

{{index "304 (HTTP status code)", "setTimeout function", timeout, "callback function"}}

Geciken istekler için geri arama işlevleri sunucunun `waiting` dizisinde saklanır, böylece bir şey olduğunda bildirilebilirler. Ayrıca `waitForChanges` yöntemi, istek yeterince uzun süre beklediğinde 304 durumuyla yanıt vermek için hemen bir zamanlayıcı ayarlar.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
SkillShareServer.prototype.waitForChanges = function(time) {
  return new Promise(resolve => {
    this.waiting.push(resolve);
    setTimeout(() => {
      if (!this.waiting.includes(resolve)) return;
      this.waiting = this.waiting.filter(r => r != resolve);
      resolve({status: 304});
    }, time * 1000);
  });
};
```

{{index "updated method"}}

{{id updated}}

Bir değişikliği `updated` ile kaydetmek `version` özelliğini artırır ve bekleyen tüm istekleri uyandırır.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
SkillShareServer.prototype.updated = function() {
  this.version++;
  let response = this.talkResponse();
  this.waiting.forEach(resolve => resolve(response));
  this.waiting = [];
};
```

{{index [HTTP, server]}}

Sunucu kodu bu kadar. Bir `SkillShareServer` örneği oluşturur ve 8000 numaralı bağlantı noktasında başlatırsak, ortaya çıkan HTTP sunucusu `/talks` URL'si altında bir konuşma yönetimi arayüzünün yanı sıra `public` alt dizinindeki dosyaları sunar.

```{includeCode: ">code/skillsharing/skillsharing_server.mjs"}
new SkillShareServer({}).start(8000);
```

## Client uygulaması

{{index "skill-sharing project"}}

Beceri paylaşım web sitesinin ((istemci)) tarafındaki kısmı üç dosyadan oluşur: küçük bir HTML sayfası, bir stil sayfası ve bir JavaScript dosyası.

### HTML

{{index "index.html"}}

Bir dizine karşılık gelen bir yola doğrudan bir istek yapıldığında `index.html` adlı bir dosyayı sunmaya çalışmak web sunucuları için yaygın olarak kullanılan bir kuraldır. Kullandığımız ((dosya sunucusu)) modülü, `serve-static`, bu geleneği destekler. Bir istek `/` yoluna yapıldığında, sunucu `./public/index.html` dosyasını arar (`./public` ona verdiğimiz köktür) ve bulursa bu dosyayı döndürür.

Bu nedenle, bir tarayıcı sunucumuza yönlendirildiğinde bir sayfanın görünmesini istiyorsak, onu `public/index.html` dosyasına koymalıyız. Bu bizim dizin dosyamızdır:

```{lang: "html", includeCode: ">code/skillsharing/public/index.html"}
<!doctype html>
<meta charset="utf-8">
<title>Skill Sharing</title>
<link rel="stylesheet" href="skillsharing.css">

<h1>Skill Sharing</h1>

<script src="skillsharing_client.js"></script>
```

{{index CSS}}

Belgeyi ((başlık)) tanımlar ve diğer şeylerin yanı sıra konuşmalar arasında biraz boşluk olmasını sağlamak için birkaç stil tanımlayan bir stil sayfası içerir.

En altta, sayfanın üst kısmına bir başlık ekler ve ((istemci)) tarafındaki uygulamayı içeren komut dosyasını yükler.

### Aksiyonlar

Uygulama durumu, konuşmaların listesi ve kullanıcının adından oluşur ve bunu bir `{talks, user}` nesnesinde saklayacağız. Kullanıcı arayüzünün durumu doğrudan manipüle etmesine veya HTTP istekleri göndermesine izin vermiyoruz. Bunun yerine, kullanıcının ne yapmaya çalıştığını tanımlayan _actions_ yayabilir.

{{index "handleAction function"}}

`handleAction` fonksiyonu böyle bir eylemi alır ve gerçekleşmesini sağlar. Durum güncellemelerimiz çok basit olduğu için, durum değişiklikleri aynı fonksiyonda ele alınır.

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function handleAction(state, action) {
  if (action.type == "setUser") {
    localStorage.setItem("userName", action.user);
    return {...state, user: action.user};
  } else if (action.type == "setTalks") {
    return {...state, talks: action.talks};
  } else if (action.type == "newTalk") {
    fetchOK(talkURL(action.title), {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        presenter: state.user,
        summary: action.summary
      })
    }).catch(reportError);
  } else if (action.type == "deleteTalk") {
    fetchOK(talkURL(action.talk), {method: "DELETE"})
      .catch(reportError);
  } else if (action.type == "newComment") {
    fetchOK(talkURL(action.talk) + "/comments", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        author: state.user,
        message: action.message
      })
    }).catch(reportError);
  }
  return state;
}
```

{{index "localStorage object"}}

Kullanıcının adını `localStorage` içinde saklayacağız, böylece sayfa yüklendiğinde geri yüklenebilir.

{{index "fetch function", "status property"}}

Sunucunun dahil olması gereken eylemler, daha önce açıklanan HTTP arayüzüne `fetch` kullanarak ağ istekleri yapar. Sunucu bir hata kodu döndürdüğünde döndürülen sözün reddedilmesini sağlayan `fetchOK` adlı bir sarmalayıcı işlev kullanıyoruz.

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function fetchOK(url, options) {
  return fetch(url, options).then(response => {
    if (response.status < 400) return response;
    else throw new Error(response.statusText);
  });
}
```

{{index "talkURL function", "encodeURIComponent function"}}

Bu yardımcı işlev, belirli bir başlığa sahip bir konuşma için bir ((URL)) oluşturmak için kullanılır.

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function talkURL(title) {
  return "talks/" + encodeURIComponent(title);
}
```

{{index "error handling", "user experience", "reportError function"}}

İstek başarısız olduğunda, sayfamızın hiçbir açıklama yapmadan öylece durmasını istemiyoruz. Bu yüzden `reportError` adında bir fonksiyon tanımlıyoruz, bu fonksiyon en azından kullanıcıya bir şeylerin yanlış gittiğini söyleyen bir diyalog kutusu gösteriyor.

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function reportError(error) {
  alert(String(error));
}
```

### Bileşenlerin gösterimi

{{index "renderUserField function"}}

[Bölüm ?](paint)'da gördüğümüze benzer bir yaklaşım kullanarak uygulamayı bileşenlere ayıracağız. Ancak bazı bileşenlerin hiçbir zaman güncellenmesi gerekmediğinden ya da güncellendiğinde her zaman tamamen yeniden çizildiğinden, bunları sınıf olarak değil, doğrudan bir DOM düğümü döndüren işlevler olarak tanımlayacağız. Örneğin, burada kullanıcının adını girebileceği alanı gösteren bir bileşen bulunmaktadır:

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function renderUserField(name, dispatch) {
  return elt("label", {}, "Your name: ", elt("input", {
    type: "text",
    value: name,
    onchange(event) {
      dispatch({type: "setUser", user: event.target.value});
    }
  }));
}
```

{{index "elt function"}}

DOM öğelerini oluşturmak için kullanılan `elt` işlevi [Bölüm ?](paint)'da kullandığımız işlevdir.

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no, hidden: true}
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

{{index "renderTalk function"}}

Benzer bir işlev, yorumların bir listesini ve yeni bir ((yorum)) eklemek için bir form içeren konuşmaları oluşturmak için kullanılır.

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function renderTalk(talk, dispatch) {
  return elt(
    "section", {className: "talk"},
    elt("h2", null, talk.title, " ", elt("button", {
      type: "button",
      onclick() {
        dispatch({type: "deleteTalk", talk: talk.title});
      }
    }, "Delete")),
    elt("div", null, "by ",
        elt("strong", null, talk.presenter)),
    elt("p", null, talk.summary),
    ...talk.comments.map(renderComment),
    elt("form", {
      onsubmit(event) {
        event.preventDefault();
        let form = event.target;
        dispatch({type: "newComment",
                  talk: talk.title,
                  message: form.elements.comment.value});
        form.reset();
      }
    }, elt("input", {type: "text", name: "comment"}), " ",
       elt("button", {type: "submit"}, "Add comment")));
}
```

{{index "submit event"}}

`“submit“` olay işleyicisi, bir `”newComment"` eylemi oluşturduktan sonra formun içeriğini temizlemek için `form.reset` çağrısında bulunur.

Orta derecede karmaşık DOM parçaları oluştururken, bu programlama tarzı oldukça dağınık görünmeye başlar. Bundan kaçınmak için, insanlar genellikle dinamik öğelerin nereye gideceğini belirtmek için bazı özel işaretçilerle arayüzünüzü bir HTML dosyası olarak yazmanıza olanak tanıyan bir _((şablonlama dili))_ kullanırlar. Ya da programınızda HTML etiketlerine çok yakın bir şeyi JavaScript ifadeleriymiş gibi yazmanıza olanak tanıyan standart olmayan bir JavaScript lehçesi olan _((JSX))_ kullanırlar. Bu yaklaşımların her ikisi de kodu çalıştırmadan önce ön işleme tabi tutmak için ek araçlar kullanır ki bu bölümde bunlardan kaçınacağız.

Yorumların işlenmesi kolaydır.

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function renderComment(comment) {
  return elt("p", {className: "comment"},
             elt("strong", null, comment.author),
             ": ", comment.message);
}
```

{{index "form (HTML tag)", "renderTalkForm function"}}

Son olarak, kullanıcının yeni bir konuşma oluşturmak için kullanabileceği form şu şekilde oluşturulur:

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function renderTalkForm(dispatch) {
  let title = elt("input", {type: "text"});
  let summary = elt("input", {type: "text"});
  return elt("form", {
    onsubmit(event) {
      event.preventDefault();
      dispatch({type: "newTalk",
                title: title.value,
                summary: summary.value});
      event.target.reset();
    }
  }, elt("h3", null, "Submit a Talk"),
     elt("label", null, "Title: ", title),
     elt("label", null, "Summary: ", summary),
     elt("button", {type: "submit"}, "Submit"));
}
```

### Polling

{{index "pollTalks function", "long polling", "If-None-Match header", "Prefer header", "fetch function"}}

Uygulamayı başlatmak için mevcut konuşma listesine ihtiyacımız var. İlk yükleme uzun yoklama süreciyle yakından ilgili olduğundan -yüklemedeki `ETag` yoklama sırasında kullanılmalıdır- sunucuyu `/talks` için yoklamaya devam eden ve yeni bir konuşma kümesi mevcut olduğunda bir ((geri arama işlevi)) çağıran bir işlev yazacağız.

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
async function pollTalks(update) {
  let tag = undefined;
  for (;;) {
    let response;
    try {
      response = await fetchOK("/talks", {
        headers: tag && {"If-None-Match": tag,
                         "Prefer": "wait=90"}
      });
    } catch (e) {
      console.log("Request failed: " + e);
      await new Promise(resolve => setTimeout(resolve, 500));
      continue;
    }
    if (response.status == 304) continue;
    tag = response.headers.get("ETag");
    update(await response.json());
  }
}
```

{{index "async function"}}

Bu bir `async` işlevidir, böylece döngü oluşturmak ve isteği beklemek daha kolay olur. Sonsuz bir döngü çalıştırır ve her yinelemede görüşmelerin listesini alır - ya normal olarak ya da bu ilk istek değilse, uzun bir yoklama isteği yapan başlıklarla birlikte.

{{index "error handling", "Promise class", "setTimeout function"}}

Bir istek başarısız olduğunda, işlev bir süre bekler ve ardından tekrar dener. Bu şekilde, ağ bağlantınız bir süreliğine gider ve sonra geri gelirse, uygulama iyileşebilir ve güncellemeye devam edebilir. `setTimeout` aracılığıyla çözümlenen söz, `async` işlevini beklemeye zorlamanın bir yoludur.

{{index "304 (HTTP status code)", "ETag header"}}

Sunucu 304 yanıtı verdiğinde, bu uzun bir yoklama isteğinin zaman aşımına uğradığı anlamına gelir, bu nedenle işlev hemen bir sonraki isteği başlatmalıdır. Yanıt normal bir 200 yanıtı ise, gövdesi ((JSON)) olarak okunur ve geri aramaya aktarılır ve `ETag` başlık değeri bir sonraki yineleme için saklanır.

### Uygulama

{{index "SkillShareApp class"}}

Aşağıdaki bileşen tüm kullanıcı arayüzünü birbirine bağlar:

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
class SkillShareApp {
  constructor(state, dispatch) {
    this.dispatch = dispatch;
    this.talkDOM = elt("div", {className: "talks"});
    this.dom = elt("div", null,
                   renderUserField(state.user, dispatch),
                   this.talkDOM,
                   renderTalkForm(dispatch));
    this.syncState(state);
  }

  syncState(state) {
    if (state.talks != this.talks) {
      this.talkDOM.textContent = "";
      for (let talk of state.talks) {
        this.talkDOM.appendChild(
          renderTalk(talk, this.dispatch));
      }
      this.talks = state.talks;
    }
  }
}
```

{{index synchronization, "live view"}}

Konuşmalar değiştiğinde, bu bileşen hepsini yeniden çizer. Bu basit ama aynı zamanda savurgan bir işlemdir. Bu konuya alıştırmalarda geri döneceğiz.

Uygulamayı şu şekilde başlatabiliriz:

```{includeCode: ">code/skillsharing/public/skillsharing_client.js", test: no}
function runApp() {
  let user = localStorage.getItem("userName") || "Anon";
  let state, app;
  function dispatch(action) {
    state = handleAction(state, action);
    app.syncState(state);
  }

  pollTalks(talks => {
    if (!app) {
      state = {user, talks};
      app = new SkillShareApp(state, dispatch);
      document.body.appendChild(app.dom);
    } else {
      dispatch({type: "setTalks", talks});
    }
  }).catch(reportError);
}

runApp();
```

Sunucuyu çalıştırır ve [_http://localhost:8000_](http://localhost:8000/) için yan yana iki tarayıcı penceresi açarsanız, bir pencerede gerçekleştirdiğiniz eylemlerin diğerinde hemen görülebildiğini görebilirsiniz.

## Egzersizler

{{index "Node.js", NPM}}

Aşağıdaki alıştırmalar bu bölümde tanımlanan sistemi değiştirmeyi içerecektir. Bunlar üzerinde çalışmak için, önce kodu ((indirdiğinizden)) ([_https://eloquentjavascript.net/code/skillsharing.zip_](https://eloquentjavascript.net/code/skillsharing.zip)), Node'un kurulu olduğundan ([_https://nodejs.org_](https://nodejs.org)) ve projenin bağımlılığını `npm install` ile yüklediğinizden emin olun.

### Disk kalıcılığı

{{index "data loss", persistence, [memory, persistence]}}

Beceri paylaşım sunucusu verilerini tamamen bellekte tutar. Bu, herhangi bir nedenle ((çöktüğünde)) veya yeniden başlatıldığında, tüm konuşmaların ve yorumların kaybolacağı anlamına gelir.

{{index "hard drive"}}

Sunucuyu, konuşma verilerini diske depolayacak ve yeniden başlatıldığında verileri otomatik olarak yeniden yükleyecek şekilde genişletin. Verimlilik konusunda endişelenmeyin - işe yarayan en basit şeyi yapın.

{{hint

{{index "file system", "writeFile function", "updated method", persistence}}

Bulabildiğim en basit çözüm, tüm `talks` nesnesini ((JSON)) olarak kodlamak ve `writeFile` ile bir dosyaya dökmek. Sunucunun verileri her değiştiğinde çağrılan bir yöntem (`updated`) zaten var. Yeni verileri diske yazmak için genişletilebilir.

{{index "readFile function", "JSON.parse function"}}

Bir ((dosya)) adı seçin, örneğin `./talks.json`. Sunucu başladığında, bu dosyayı `readFile` ile okumaya çalışabilir ve bu başarılı olursa, sunucu dosyanın içeriğini başlangıç verisi olarak kullanabilir.

hint}}

### Yorum alanı sıfırlanması

{{index "comment field reset (exercise)", template, [state, "of application"]}}

Görüşmelerin toptan yeniden çizilmesi oldukça iyi çalışır, çünkü genellikle bir DOM düğümü ile onun aynısı arasındaki farkı anlayamazsınız. Ancak istisnalar da vardır. Bir tarayıcı penceresinde bir konuşma için yorum ((alanına)) bir şeyler yazmaya başlarsanız ve ardından başka bir pencerede bu konuşmaya bir yorum eklerseniz, ilk penceredeki alan hem içeriği hem de ((odağı)) kaldırılarak yeniden çizilecektir.

Birden fazla kişinin aynı anda yorum eklediği hararetli bir tartışmada bu can sıkıcı olabilir. Bunu çözmek için bir yol bulabilir misiniz?

{{hint

{{index "comment field reset (exercise)", template, "syncState method"}}

Bunu yapmanın en iyi yolu muhtemelen konuşma bileşenini bir `syncState` metodu ile bir nesne haline getirmektir, böylece konuşmanın değiştirilmiş bir versiyonunu gösterecek şekilde güncellenebilirler. Normal çalışma sırasında, bir konuşmanın değiştirilebilmesinin tek yolu daha fazla yorum eklemektir, bu nedenle `syncState` yöntemi nispeten basit olabilir.

İşin zor kısmı, değişen bir konuşma listesi geldiğinde, mevcut DOM bileşenleri listesini yeni listedeki konuşmalarla uzlaştırmak zorunda olmamızdır - konuşması silinen bileşenleri silmek ve konuşması değişen bileşenleri güncellemek.

{{index synchronization, "live view"}}

Bunu yapmak için, konuşma bileşenlerini konuşma başlıkları altında saklayan bir veri yapısı tutmak yararlı olabilir, böylece belirli bir konuşma için bir bileşenin mevcut olup olmadığını kolayca anlayabilirsiniz. Daha sonra yeni konuşma dizisi üzerinde döngü yapabilir ve her biri için mevcut bir bileşeni senkronize edebilir ya da yeni bir tane oluşturabilirsiniz. Silinen konuşmaların bileşenlerini silmek için, bileşenler üzerinde de döngü yapmanız ve ilgili konuşmaların hala var olup olmadığını kontrol etmeniz gerekir.

hint}}
