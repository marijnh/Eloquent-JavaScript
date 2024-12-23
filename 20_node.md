{{meta {code_links: ["code/file_server.mjs"]}}}

# Node.js

{{quote {author: "Master Yuan-Ma", title: "The Book of Programming", chapter: true}

Bir öğrenci sordu: "Eski programcılar yalnızca basit makineler ve programlama dilleri kullanmadan güzel programlar yaptılar. Neden karmaşık makineler ve programlama dilleri kullanıyoruz?" Fu-Tzu cevap verdi: "Eski inşaatçılar yalnızca çubuklar ve kili kullanarak güzel kulübeler yaptılar."

quote}}

{{index "Yuan-Ma", "Book of Programming"}}

{{figure {url: "img/chapter_picture_20.jpg", alt: "Bir telefon direği üzerinde dört bir yana karmaşık şekilde dağılmış tellerin gösterildiği bir illüstrasyon.", chapter: "framed"}}}

{{index "command line"}}

Şu ana kadar yalnızca tarayıcı ortamında JavaScript dilini kullandık. Bu bölüm ve [bir sonraki bölüm](skillsharing), JavaScript becerilerinizi tarayıcı dışında da kullanmanıza olanak tanıyan `((Node.js))` adında bir programı kısa bir şekilde tanıtacaktır. Bu araç sayesinde, küçük komut satırı araçlarından dinamik `((website))`leri çalıştıran HTTP `((server))`lerine kadar birçok şeyi oluşturabilirsiniz.

Bu bölümler, Node.js’in temel konseptlerini öğretmeyi amaçlıyor ve bu platformda faydalı programlar yazmak için yeterli bilgi sağlıyor. Platformun tam ve kapsamlı bir açıklamasını hedeflemiyor.

{{if interactive

Önceki bölümlerdeki kodu doğrudan bu sayfalarda çalıştırabiliyordunuz çünkü ya ham JavaScript'ti ya da tarayıcı için yazılmıştı; ancak bu bölümdeki örnekler Node için yazılmış durumda ve genellikle tarayıcıda çalıştırılamazlar.

if}}

Bu bölümü takip edip örnek kodları çalıştırmak isterseniz, Node.js sürüm 18 veya daha üstünü yüklemeniz gerekiyor. Bunu yapmak için [_https://nodejs.org_](https://nodejs.org) adresine gidin ve işletim sisteminize uygun yükleme talimatlarını takip edin. Ayrıca Node.js için daha fazla `((documentation))` bilgisine de buradan ulaşabilirsiniz.

## Arka Plan

{{index responsiveness, input, [network, speed]}}

Ağ üzerinden iletişim kuran sistemler yazarken yaşanan en zor sorunlardan biri, giriş ve `((output))` yönetimidir—yani ağdan ve ağlara veri okuma ve yazma işlemleriyle `((hard drive))` arasındaki veri taşınması. Verileri taşımak zaman alır ve bunu akıllıca `((scheduling))` yapmak, bir sistemin kullanıcıya ya da ağ isteklerine yanıt verme hızında büyük fark yaratabilir.

{{index ["asynchronous programming", "in Node.js"]}}

Bu tür programlarda asenkron programlama genellikle yardımcıdır. Asenkron programlama, karmaşık thread yönetimi ve senkronizasyon olmadan aynı anda birden fazla cihazdan veri alıp göndermeyi sağlar.

{{index "programming language", "Node.js", standard}}

Node, başlangıçta asenkron programlamayı kolay ve kullanışlı hale getirmek amacıyla tasarlandı. JavaScript, Node gibi bir sistem için uygundur. JavaScript, yerleşik bir giriş-çıkış yöntemi bulunmayan nadir programlama dillerinden biridir. Böylece, JavaScript'in, Node'un giriş-çıkış açısından biraz sıra dışı yaklaşımına uyarlanması, iki tutarsız arayüzün ortaya çıkmasına sebep olmadan gerçekleştirilmiştir. 2009'da Node tasarlandığında, tarayıcıda zaten geri çağırma tabanlı programlamalar yapan insanlar vardı, bu nedenle ((community)), dilin asenkron programlama tarzına alışkındı.

## Node Komutu

{{index "node program"}}

Bir sistemde ((Node.js)) kurulduğunda, JavaScript dosyalarını çalıştırmak için kullanılan `node` adında bir program sağlar. Diyelim ki `hello.js` adında bir dosyanız var ve şu kodu içeriyor:

```
let message = "Hello world";
console.log(message);
```

`node` komutunu şu şekilde kullanabilirsiniz:

```{lang: null}
$ node hello.js
Hello world
```

{{index "console.log"}}

Node'daki `console.log` metodu, tarayıcıda yaptığı işlemlerle benzer şekilde çalışır. Bir metni ekrana yazdırır. Ancak Node'da bu yazdırılan metin, tarayıcının ((JavaScript console)) yerine işlemin ((standart çıktı)) akışına gider. `node` komutunu komut satırından çalıştırdığınızda, bu durumda yazdırılan değerleri ((terminal)) üzerinde görürsünüz.

{{index "node program", "read-eval-print loop"}}

Eğer `node` komutunu bir dosya vermeden çalıştırırsanız, JavaScript kodu yazabileceğiniz bir istemci (prompt) sağlanır ve yazdığınız kodun sonucunu anında görebilirsiniz.

```{lang: null}
$ node
> 1 + 1
2
> [-1, -2, -3].map(Math.abs)
[1, 2, 3]
> process.exit(0)
$
```

{{index "process object", "global scope", [binding, global], "exit method", "status code"}}

`process` bağlaması, `console` bağlaması gibi Node'da küresel olarak mevcut bir bağlamadır. Mevcut programı incelemek ve manipüle etmek için çeşitli yöntemler sunar. `exit` metodu, işlemi sonlandırır ve bir çıkış durumu kodu verilebilir. Bu durum kodu, `node` komutunu başlatan programa (bu örnekte komut satırı kabuğu) işlemin başarılı bir şekilde tamamlandığını (kod sıfır) ya da bir hata ile karşılaştığını (başka bir kod) belirtir.

{{index "command line", "argv property"}}

Komut dosyanıza verilen komut satırı argümanlarını bulmak için, dizelerden oluşan bir dizi olan `process.argv` dosyasını okuyabilirsiniz. Bu dizinin `node` komutunun adını ve komut dosyanızın adını da içerdiğini, dolayısıyla gerçek argümanların 2. dizinden başladığını unutmayın. Eğer `showargv.js` `console.log(process.argv)` ifadesini içeriyorsa, bunu şu şekilde çalıştırabilirsiniz:

```{lang: null}
$ node showargv.js one --and two
["node", "/tmp/showargv.js", "one", "--and", "two"]
```

{{index [binding, global]}}

`Array`, `Math` ve `JSON` gibi tüm ((standart)) JavaScript global bağları Node ortamında da mevcuttur. Tarayıcı ile ilgili `document` veya `prompt` gibi işlevler ise mevcut değildir.

## Modüller

{{index "Node.js", "global scope", "module loader"}}

Bahsettiğim `console` ve `process` gibi bağlayıcıların ötesinde, Node global kapsama birkaç ek bağlayıcı koyar. Yerleşik işlevselliğe erişmek istiyorsanız, modül sisteminden bunu istemeniz gerekir.

{{index "require function"}}

Node, [Bölüm ?](modules#commonjs)'de gördüğümüz `require` fonksiyonuna dayanan ((CommonJS)) modül sistemini kullanmaya başladı. Bir `.js` dosyası yüklediğinizde varsayılan olarak bu sistemi kullanmaya devam edecektir.

{{index "import keyword", "ES modules"}}

Ancak daha modern ES modül sistemini de destekler. Bir betiğin dosya adı `.mjs` ile bitiyorsa, böyle bir modül olarak kabul edilir ve içinde `import` ve `export` kullanabilirsiniz (ancak `require` kullanamazsınız). Bu bölümde ES modüllerini kullanacağız.

{{index [path, "filesystem"], "relative path", resolution}}

Bir modülü içe aktarırken -ister `require` ister `import` ile olsun-Node, verilen dizeyi yükleyebileceği gerçek bir ((dosya)) olarak çözümlemek zorundadır. `/`, `./` veya `../` ile başlayan isimler, geçerli modülün yoluna göre dosya olarak çözümlenir. Burada `.` geçerli dizini, `../` bir dizin yukarıyı ve `/` dosya sisteminin kökünü temsil eder. Yani `/tmp/robot/robot.mjs` dosyasından `“./graph.mjs”` isterseniz, Node `/tmp/robot/graph.mjs` dosyasını yüklemeye çalışacaktır.

{{index "node_modules directory", directory}}

Göreceli veya mutlak yol gibi görünmeyen bir dize içe aktarıldığında, yerleşik ((modül)) veya `node_modules` dizininde yüklü bir modüle başvurduğu varsayılır. Örneğin, `“node:fs”` modülünü içe aktarmak size Node'un yerleşik dosya sistemi modülünü verecektir. Ve `“robot”` içe aktarıldığında `node_modules/robot/` dizininde bulunan kütüphane yüklenmeye çalışılabilir. Bu tür kütüphaneleri yüklemenin yaygın bir yolu, birazdan geri döneceğimiz ((NPM)) kullanmaktır.

{{index "import keyword", "Node.js", "garble example"}}

İki dosyadan oluşan küçük bir proje kuralım. Bunlardan ilki olan `main.mjs`, bir dizeyi tersine çevirmek için ((komut satırından)) çağrılabilecek bir betik tanımlar.

```
import {reverse} from "./reverse.mjs";

// Index 2 ilk gerçek komut satırı argümanını tutar
let argument = process.argv[2];

console.log(reverse(argument));
```

{{index reuse, "Array.from function", "join method"}}

The `reverse.mjs` file defines a library for string reversal that can be used both by this command line tool and by other scripts that need direct access to string reversal functionality.

```
export function reverse(string) {
  return Array.from(string).reverse().join("");
}
```

{{index "export keyword", "ES modules", [interface, module]}}

Bir bağlayıcının modülün arayüzünün bir parçası olduğunu bildirmek için `export` kullanıldığını unutmayın. Bu `main.mjs`nin fonksiyonu içe aktarmasına ve kullanmasına izin verir.

Artık aracımızı şu şekilde çağırabiliriz:

```{lang: null}
$ node main.mjs JavaScript
tpircSavaJ
```

## NPM ile kurulum

{{index NPM, "Node.js", "npm program", library}}

[Bölüm ?](modules#modules_npm)'de tanıtılan NPM, birçoğu Node için özel olarak yazılmış JavaScript ((modül))lerinden oluşan çevrimiçi bir depodur. Node'u bilgisayarınıza kurduğunuzda, bu depo ile etkileşimde bulunmak için kullanabileceğiniz `npm` komutunu da alırsınız.

{{index "ini package"}}

NPM'nin ana kullanım alanı paketleri ((indirmek))tir. [Bölüm ?](modules#modules_ini)'de `ini` paketini gördük. Bu paketi bilgisayarımıza getirmek ve kurmak için NPM'yi kullanabiliriz.

```{lang: null}
$ npm install ini
added 1 package in 723ms

$ node
> const {parse} = require("ini");
> parse("x = 1\ny = 2");
{ x: '1', y: '2' }
```

{{index "require function", "node_modules directory", "npm program"}}

`npm install` çalıştırıldıktan sonra, ((NPM)) `node_modules` adında bir dizin oluşturacaktır. Bu dizinin içinde ((kütüphane)) içeren bir `ini` dizini olacaktır. Bunu açabilir ve koda bakabilirsiniz. `“ini"`yi içe aktardığımızda, bu kütüphane yüklenir ve bir yapılandırma dosyasını ayrıştırmak için `parse` özelliğini çağırabiliriz.

NPM varsayılan olarak paketleri merkezi bir yer yerine geçerli dizinin altına yükler. Diğer paket yöneticilerine alışkınsanız, bu alışılmadık görünebilir, ancak avantajları vardır - her uygulamanın yüklediği paketleri tam olarak kontrol etmesini sağlar ve sürümleri yönetmeyi ve bir uygulamayı kaldırırken temizlemeyi kolaylaştırır.

### Paket dosyaları

{{index "package.json", dependency}}

Bir paketi yüklemek için `npm install` çalıştırdıktan sonra, yalnızca bir `node_modules` dizini değil, aynı zamanda geçerli dizininizde `package.json` adlı bir dosya da bulacaksınız. Her proje için böyle bir dosyanın olması tavsiye edilir. Bu dosyayı elle oluşturabilir ya da `npm init` komutunu çalıştırabilirsiniz. Bu dosya, proje hakkında adı ve ((sürüm)) gibi bilgileri içerir ve bağımlılıklarını listeler.

[Bölüm ?](robot)'daki robot simülasyonu, [Bölüm ?](modules#modular_robot)'daki alıştırmada modülerleştirildiği gibi, aşağıdaki gibi bir `package.json` dosyasına sahip olabilir:

```{lang: "json"}
{
  "author": "Marijn Haverbeke",
  "name": "eloquent-javascript-robot",
  "description": "Simulation of a package-delivery robot",
  "version": "1.0.0",
  "main": "run.mjs",
  "dependencies": {
    "dijkstrajs": "^1.0.1",
    "random-item": "^1.0.0"
  },
  "license": "ISC"
}
```

{{index "npm program", tool}}

Yüklenecek bir paket belirtmeden `npm install` komutunu çalıştırdığınızda, NPM `package.json` dosyasında listelenen bağımlılıkları yükleyecektir. Daha önce bağımlılık olarak listelenmemiş belirli bir paketi yüklediğinizde, NPM bunu `package.json` dosyasına ekleyecektir.

### Versiyonlar

{{index "package.json", dependency, evolution}}

Bir `package.json` dosyası hem programın kendi ((sürüm))'ünü hem de bağımlılıklarının sürümlerini listeler. Sürümler, ((paket))'lerin ayrı ayrı geliştiği gerçeğiyle başa çıkmanın bir yoludur ve bir noktada var olduğu şekliyle bir paketle çalışmak için yazılan kod, paketin daha sonraki, değiştirilmiş bir sürümüyle çalışmayabilir.

{{index compatibility}}

NPM, paketlerinin _((semantic versioning))_ adı verilen ve sürüm numarasında hangi sürümlerin _uyumlu_ (eski arayüzü bozmayan) olduğu hakkında bazı bilgileri kodlayan bir şemayı takip etmesini talep eder. Anlamsal bir sürüm, `2.3.0` gibi noktalarla ayrılmış üç sayıdan oluşur. Her yeni işlevsellik eklendiğinde, ortadaki sayı artırılmalıdır. Uyumluluk her bozulduğunda, böylece paketi kullanan mevcut kod yeni sürümle çalışmayabilir, ilk sayı artırılmalıdır.

{{index "caret character"}}

`package.json`'daki bir bağımlılığın sürüm numarasının önündeki şapka karakteri (`^`), verilen numarayla uyumlu herhangi bir sürümün yüklenebileceğini gösterir. Örneğin, `“^2.3.0”`, 2.3.0'dan büyük veya eşit ve 3.0.0'dan küçük herhangi bir sürüme izin verildiği anlamına gelir.

{{index publishing}}

`npm` komutu yeni paketleri veya paketlerin yeni sürümlerini yayınlamak için de kullanılır. Bir `package.json` dosyasına sahip bir ((dizin)) içinde `npm publish` komutunu çalıştırırsanız, JSON dosyasında listelenen ad ve sürüme sahip bir paketi kayıt defterine yayınlayacaktır. Herkes NPM'de paket yayınlayabilir-ancak sadece henüz kullanılmayan bir paket adı altında, çünkü rastgele kişilerin mevcut paketleri güncelleyebilmesi iyi olmaz.

Bu kitap ((NPM)) kullanımının ayrıntılarına daha fazla girmeyecektir. Daha fazla dokümantasyon ve paket arama yöntemi için [_https://npmjs.org_](https://npmjs.org) adresine bakın.

## Dosya sistemi modülü

{{index directory, "node:fs package", "Node.js", [file, access]}}

Node'da en sık kullanılan yerleşik modüllerden biri _((dosya sistemi))_ anlamına gelen `node:fs` modülüdür. Dosya ve dizinlerle çalışmak için fonksiyonları dışa aktarır.

{{index "readFile function", "callback function"}}

Örneğin, `readFile` adlı işlev bir dosyayı okur ve ardından dosyanın içeriğiyle birlikte bir geri arama çağırır.

```
import {readFile} from "node:fs";
readFile("file.txt", "utf8", (error, text) => {
  if (error) throw error;
  console.log("The file contains:", text);
});
```

{{index "Buffer class"}}

`readFile`'ın ikinci argümanı, dosyayı bir dizeye dönüştürmek için kullanılan _((karakter kodlaması))_ kodunu belirtir. ((metin))'in ((ikili veri))'ye kodlanmasının çeşitli yolları vardır, ancak çoğu modern sistem ((UTF-8)) kullanır. Bu nedenle, başka bir kodlama kullanıldığına inanmak için nedenleriniz yoksa, bir metin dosyasını okurken `“utf8”` kodunu geçirin. Bir kodlama geçmezseniz, Node ikili verilerle ilgilendiğinizi varsayacak ve size bir dize yerine bir `Buffer` nesnesi verecektir. Bu, dosyalardaki baytları (8 bitlik veri parçaları) temsil eden sayıları içeren bir ((dizi benzeri nesne)).

```
import {readFile} from "node:fs";
readFile("file.txt", (error, buffer) => {
  if (error) throw error;
  console.log("The file contained", buffer.length, "bytes.",
              "The first byte is:", buffer[0]);
});
```

{{index "writeFile function", "filesystem", [file, access]}}

Benzer bir işlev olan `writeFile`, bir dosyayı diske yazmak için kullanılır.

```
import {writeFile} from "node:fs";
writeFile("graffiti.txt", "Node was here", err => {
  if (err) console.log(`Failed to write file: ${err}`);
  else console.log("File written.");
});
```

{{index "Buffer class", "character encoding"}}

Burada kodlamayı belirtmek gerekli değildi - `writeFile` kendisine yazması için bir `Buffer` nesnesi yerine bir dize verildiğinde, bunu varsayılan karakter kodlaması olan ((UTF-8)) kullanarak metin olarak yazması gerektiğini varsayacaktır.

{{index "node:fs package", "readdir function", "stat function", "rename function", "unlink function"}}

`node:fs` modülü başka birçok faydalı fonksiyon içerir: `readdir` bir ((dizin)) içindeki dosyaları bir dizi olarak döndürür, `stat` bir dosya hakkında bilgi alır, `rename` bir dosyayı yeniden adlandırır, `unlink` bir dosyayı kaldırır, vb. Ayrıntılar için [_https://nodejs.org_](https://nodejs.org) adresindeki belgelere bakın.

{{index ["asynchronous programming", "in Node.js"], "Node.js", "error handling", "callback function"}}

Bunların çoğu son parametre olarak ya bir hata (ilk argüman) ya da başarılı bir sonuç (ikinci) ile çağırdıkları bir geri arama fonksiyonu alır. [Bölüm ?](async)'de gördüğümüz gibi, bu tarz programlamanın dezavantajları vardır; bunlardan en önemlisi hata işlemenin ayrıntılı ve hataya açık hale gelmesidir.

{{index "Promise class", "node:fs/promises package"}}

`node:fs/promises` modülü eski `node:fs` modülüyle aynı işlevlerin çoğunu dışa aktarır, ancak geri arama işlevleri yerine vaatler kullanır.

```
import {readFile} from "node:fs/promises";
readFile("file.txt", "utf8")
  .then(text => console.log("The file contains:", text));
```

{{index "synchronous programming", "node:fs package", "readFileSync function"}}

Bazen eşzamansızlığa ihtiyacınız olmaz ve bu sadece yolunuza çıkar. `node:fs` içindeki fonksiyonların birçoğunun, sonuna `Sync` eklenmiş aynı isme sahip senkronize bir versiyonu da vardır. Örneğin, `readFile` fonksiyonunun senkron versiyonu `readFileSync` olarak adlandırılır.

```
import {readFileSync} from "node:fs";
console.log("The file contains:",
            readFileSync("file.txt", "utf8"));
```

{{index optimization, performance, blocking}}

Böyle bir eşzamanlı işlem gerçekleştirilirken programınızın tamamen durdurulduğunu unutmayın. Kullanıcıya veya ağdaki diğer makinelere yanıt vermesi gerekiyorsa, eşzamanlı bir eylemde takılı kalmak can sıkıcı gecikmelere neden olabilir.

## HTTP modülü

{{index "Node.js", "node:http package", [HTTP, server]}}

Bir diğer merkezi modül `node:http` olarak adlandırılır. HTTP ((sunucu))ları çalıştırmak ve HTTP ((istek))leri yapmak için işlevsellik sağlar.

{{index "listening (TCP)", "listen method", "createServer function"}}

Bir HTTP sunucusu başlatmak için gereken tek şey budur:

```
import {createServer} from "node:http";
let server = createServer((request, response) => {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(`
    <h1>Hello!</h1>
    <p>You asked for <code>${request.url}</code></p>`);
  response.end();
});
server.listen(8000);
console.log("Listening! (port 8000)");
```

{{index port, localhost}}

Bu betiği kendi makinenizde çalıştırırsanız, sunucunuza bir istekte bulunmak için web tarayıcınızı [_http://localhost:8000/hello_](http://localhost:8000/hello) adresine yönlendirebilirsiniz. Küçük bir HTML sayfası ile yanıt verecektir.

{{index "createServer function", HTTP}}

`createServer`'a argüman olarak aktarılan fonksiyon, bir istemci sunucuya her bağlandığında çağrılır. `request` ve `response` bağları gelen ve giden verileri temsil eden nesnelerdir. İlki, isteğin hangi URL'ye yapıldığını söyleyen `url` özelliği gibi ((istek)) hakkında bilgiler içerir.

Yani, bu sayfayı tarayıcınızda açtığınızda, kendi bilgisayarınıza bir istek gönderir. Bu, sunucu işlevinin çalışmasına ve daha sonra tarayıcıda görebileceğiniz bir yanıt göndermesine neden olur.

{{index "200 (HTTP status code)", "Content-Type header", "writeHead method"}}

İstemciye bir şey göndermek için `response` nesnesi üzerindeki yöntemleri çağırırsınız. İlki, `writeHead`, ((yanıt)) ((başlık))ları yazacaktır (bkz. [Bölüm ?](http#headers)). Ona durum kodunu (bu durumda “OK” için 200) ve başlık değerlerini içeren bir nesne verirsiniz. Örnek, istemciye bir HTML belgesi göndereceğimizi bildirmek için `Content-Type` başlığını ayarlar.

{{index "writable stream", "body (HTTP)", stream, "write method", "end method"}}

Ardından, asıl yanıt gövdesi (belgenin kendisi) `response.write` ile gönderilir. Yanıtı parça parça göndermek istiyorsanız, örneğin istemciye kullanılabilir hale geldikçe veri akışı sağlamak için bu yöntemi birden çok kez çağırmanıza izin verilir. Son olarak, `response.end` yanıtın sona erdiğini bildirir.

{{index "listen method"}}

`server.listen` çağrısı ((sunucu))'nun ((port)) 8000 üzerinde bağlantı beklemeye başlamasına neden olur. Bu nedenle, bu sunucuyla konuşmak için varsayılan 80 numaralı bağlantı noktasını kullanacak olan _localhost_ yerine _localhost:8000_ adresine bağlanmanız gerekir.

{{index "Node.js", "kill process"}}

Bu betiği çalıştırdığınızda, süreç orada oturur ve bekler. Bir kod olayları dinlerken (bu durumda, ağ bağlantıları), kodun sonuna ulaştığında `node` otomatik olarak çıkmayacaktır. Kapatmak için [control] tuşuna basın{keyname}-C.

{{index [method, HTTP]}}

Gerçek bir web ((sunucu)) genellikle örnektekinden daha fazlasını yapar - istemcinin hangi eylemi gerçekleştirmeye çalıştığını görmek için isteğin ((yöntem))'ine (`method` özelliği) bakar ve bu eylemin hangi kaynak üzerinde gerçekleştirildiğini bulmak için isteğin ((URL))'sine bakar. Daha gelişmiş bir sunucuyu [bu bölümün ilerleyen kısımlarında](node#file_server) göreceğiz.

{{index "node:http package", "request function", "fetch function", [HTTP, client]}}

`node:http` modülü ayrıca HTTP istekleri yapmak için kullanılabilecek bir `request` fonksiyonu da sağlar. Ancak, kullanımı [Bölüm ?](http)'de gördüğümüz `fetch` fonksiyonundan çok daha zahmetlidir. Neyse ki, `fetch` Node'da global bir bağlayıcı olarak da mevcuttur. Veriler ağ üzerinden geldikçe yanıt belgesini parça parça işlemek gibi çok özel bir şey yapmak istemiyorsanız, `fetch` kullanmanızı öneririm.

## Stream'ler

{{index "Node.js", stream, "writable stream", "callback function", ["asynchronous programming", "in Node.js"], "write method", "end method", "Buffer class"}}

HTTP sunucusunun yazabileceği yanıt nesnesi, Node'da yaygın olarak kullanılan bir _writable stream_ nesnesi örneğidir. Bu tür nesneler, bir akışa bir şey yazmak için bir string veya bir `Buffer` nesnesi geçirilebilen bir `write` metoduna sahiptir. `end` metodları akışı kapatır ve kapatmadan önce akışa yazmak için isteğe bağlı bir değer alabilir. Bu metodların her ikisine de ek bir argüman olarak bir callback verilebilir ve yazma veya kapatma işlemi tamamlandığında bu callback çağrılır.

{{index "createWriteStream function", "writeFile function", [file, stream]}}

`node:fs` modülünden `createWriteStream` fonksiyonuyla bir dosyaya işaret eden bir writable stream oluşturmak mümkündür. Ortaya çıkan nesne üzerindeki `write` metodu, dosyayı `writeFile` ile tek seferde yazmaktan ziyade, parça parça yazmak için kullanılabilir.

{{index "createServer function", "request function", "event handling", "readable stream"}}

\_Readable ((stream))\_ler biraz daha karmaşıktır. HTTP sunucusunun callback'ine iletilen `request` argümanı bir readable stream'dir. Bir akıştan okuma işlemi, metodlar yerine event handler'lar kullanılarak yapılır.

{{index "on method", "addEventListener method"}}

Node'da olay yayını yapan nesnelerin, tarayıcıdaki `addEventListener` metoduna benzer bir `on` metodu vardır. Bu metoda bir olay adı ve bir fonksiyon verirsiniz; belirtilen olay gerçekleştiğinde bu fonksiyon çağrılır.

{{index "createReadStream function", "data event", "end event", "readable stream"}}

_Readable ((stream))\_ler `"data"` ve `"end"` olaylarına sahiptir. İlki, her veri geldiğinde tetiklenir; ikincisi ise akışın sonuna gelindiğinde çağrılır. Bu model, tüm belge henüz mevcut olmasa bile hemen işlenebilecek \_streaming_ veri için en uygunudur. Bir dosya, `node:fs` modülünden `createReadStream` fonksiyonu kullanılarak readable stream olarak okunabilir.

{{index "upcasing server example", capitalization, "toUpperCase method"}}

Bu kod, istek gövdelerini okuyan ve bunları büyük harfli metin olarak istemciye geri gönderen bir ((server)) oluşturur:

```
import {createServer} from "node:http";
createServer((request, response) => {
  response.writeHead(200, {"Content-Type": "text/plain"});
  request.on("data", chunk =>
    response.write(chunk.toString().toUpperCase()));
  request.on("end", () => response.end());
}).listen(8000);
```

{{index "Buffer class", "toString method"}}

Veri handler'ına iletilen `chunk` değeri bir ikili `Buffer` olacaktır. Bu, `toString` metodu ile UTF-8 kodlu karakterler olarak çözülerek bir string'e dönüştürülebilir.

Aşağıdaki kod parçası, büyük harfe dönüştürme sunucusu aktifken çalıştırıldığında, bu sunucuya bir istek gönderecek ve aldığı yanıtı yazdıracaktır:

```
fetch("http://localhost:8000/", {
  method: "POST",
  body: "Hello server"
}).then(resp => resp.text()).then(console.log);
// → HELLO SERVER
```

{{id file_server}}

## Bir dosya sunucusu

{{index "file server example", "Node.js", [HTTP, server]}}

HTTP ((server))ler ve ((file system)) ile çalışma konusundaki yeni bilgilerimizi birleştirerek, dosya sistemine ((remote access)) sağlayan bir HTTP sunucusu oluşturabiliriz. Böyle bir sunucunun birçok kullanım alanı vardır—web uygulamalarının veri depolamasına ve paylaşmasına olanak tanır ya da bir grup insana bir dizi dosyaya ortak erişim sağlar.

{{index [path, URL], "GET method", "PUT method", "DELETE method", [file, resource]}}

Dosyaları HTTP ((resource))leri olarak ele aldığımızda, HTTP metodları olan `GET`, `PUT` ve `DELETE`, sırasıyla dosyaları okumak, yazmak ve silmek için kullanılabilir. İstek yolunu, isteğin atıfta bulunduğu dosyanın yolu olarak yorumlayacağız.

{{index [path, "filesystem"], "relative path"}}

Muhtemelen tüm dosya sistemimizi paylaşmak istemeyiz, bu yüzden bu yolları sunucunun çalışma ((directory))sinde (sunucunun başlatıldığı dizin) başladığı şekilde yorumlayacağız. Eğer sunucuyu `/tmp/public/` (veya Windows'ta `C:\tmp\public\`) dizininden çalıştırırsam, `/file.txt` için yapılan bir istek `/tmp/public/file.txt` (veya `C:\tmp\public\file.txt`) dosyasına atıfta bulunmalıdır.

{{index "file server example", "Node.js", "methods object", "Promise class"}}

Programı parça parça oluşturacağız ve çeşitli HTTP metodlarını işleyen fonksiyonları depolamak için `methods` adında bir nesne kullanacağız. Metod işleyicileri, istek nesnesini argüman olarak alan ve yanıtı tanımlayan bir nesneye çözümlenen bir promise döndüren `async` fonksiyonlardır.

```{includeCode: ">code/file_server.mjs"}
import {createServer} from "node:http";

const methods = Object.create(null);

createServer((request, response) => {
  let handler = methods[request.method] || notAllowed;
  handler(request).catch(error => {
    if (error.status != null) return error;
    return {body: String(error), status: 500};
  }).then(({body, status = 200, type = "text/plain"}) => {
    response.writeHead(status, {"Content-Type": type});
    if (body?.pipe) body.pipe(response);
    else response.end(body);
  });
}).listen(8000);

async function notAllowed(request) {
  return {
    status: 405,
    body: `Method ${request.method} not allowed.`
  };
}
```

{{index "405 (HTTP status code)"}}

Bu, sunucunun yalnızca 405 hata yanıtlarını döndürmesini sağlar. Bu kod, sunucunun belirli bir metodu işlemeyi reddettiğini belirtmek için kullanılır.

{{index "500 (HTTP status code)", "error handling", "error response"}}

Bir istek işleyicisinin promisi reddedildiğinde, `catch` çağrısı hatayı bir yanıt nesnesine dönüştürür (eğer zaten bir yanıt nesnesi değilse), böylece sunucu, isteği işleyemediğini müşteriye bildirmek için bir hata yanıtı gönderebilir.

{{index "200 (HTTP status code)", "Content-Type header"}}

Yanıt tanımındaki `status` alanı atlanabilir ve bu durumda varsayılan olarak 200 (OK) olur. `type` özelliğinde belirtilen içerik türü de bırakılabilir ve bu durumda yanıtın düz metin olduğu varsayılır.

{{index "end method", "pipe method", stream}}

`body` değerinin bir ((readable stream)) olması durumunda, tüm içeriği bir readable stream'den bir ((writable stream))e iletmek için kullanılan bir `pipe` metodu olacaktır. Eğer değilse, `null` (gövde yok), bir string veya bir buffer olduğu varsayılır ve doğrudan ((response))'un `end` metoduna iletilir.

{{index [path, URL], "urlPath function", "URL class", parsing, [escaping, "in URLs"], "decodeURIComponent function", "startsWith method"}}

Bir istek URL'sinin hangi dosya yoluna karşılık geldiğini anlamak için, `urlPath` fonksiyonu Node'un yerleşik `node:url` modülünü kullanarak URL'yi ayrıştırır. Bu fonksiyon, `"/file.txt"` gibi bir `pathname` alır, `%20` tarzı kaçış kodlarını temizlemek için çözer ve bunu programın çalışma dizinine göre çözümler.

```{includeCode: ">code/file_server.mjs"}
import {resolve, sep} from "node:path";

const baseDirectory = process.cwd();

function urlPath(url) {
  let {pathname} = new URL(url, "http://d");
  let path = resolve(decodeURIComponent(pathname).slice(1));
  if (path != baseDirectory &&
      !path.startsWith(baseDirectory + sep)) {
    throw {status: 403, body: "Forbidden"};
  }
  return path;
}
```

Bir programı ağ isteklerini kabul edecek şekilde kurduğunuzda, ((security)) endişeleriyle ilgilenmeye başlamalısınız. Bu durumda dikkatli olmazsak, tüm ((file system))imizi ağa açma riski taşırız.

Dosya yolları Node'da string şeklindedir. Bu tür bir string'i gerçek bir dosyaya eşlemek için karmaşık bir yorumlama işlemi yapılır. Örneğin, `../` dizinin üstüne atıfta bulunmak için kullanılabilir. Dolayısıyla `/../secret_file` gibi yollarla yapılan istekler sorunlara neden olabilir.

{{index "node:path package", "resolve function", "cwd function", "process object", "403 (HTTP status code)", "sep binding", ["backslash character", "as path separator"], "slash character"}}

Bu tür sorunları önlemek için, `urlPath` fonksiyonu `node:path` modülünden `resolve` fonksiyonunu kullanır; bu fonksiyon, ilişkisel yolları çözer. Daha sonra bu yolun çalışma dizininin _altında_ olduğunu doğrular. `process.cwd` fonksiyonu (burada `cwd` "current working directory"nin kısaltmasıdır) çalışma dizinini bulmak için kullanılır. `node:path` paketinden gelen `sep` bağlamı, sistemin yol ayırıcı sembolüdür—Windows'ta bir ters eğik çizgi (`\`) ve çoğu sistemde ileri eğik çizgi (`/`) şeklindedir. Eğer yol temel dizinle başlamıyorsa, fonksiyon bir hata yanıt nesnesi oluşturur ve erişimin yasak olduğunu belirten HTTP durum kodu döner.

{{index "file server example", "Node.js", "GET method", [file, resource]}}

Bir ((dizin)) okurken bir dosya listesi döndürmek ve normal bir dosyayı okurken dosyanın içeriğini döndürmek için `GET` yöntemini ayarlayacağız.

{{index "media type", "Content-Type header", "mime-types package"}}

Zor bir soru, bir dosyanın içeriğini döndürürken ne tür bir `Content-Type` başlığı belirlememiz gerektiğidir. Bu dosyalar herhangi bir şey olabileceğinden, sunucumuz hepsi için aynı içerik türünü döndüremez. ((NPM)) burada bize yine yardımcı olabilir. `mime-types` paketi (`text/plain` gibi içerik türü göstergeleri _((MIME type))s_ olarak da adlandırılır) çok sayıda ((file extension))s için doğru türü bilir.

{{index "npm program"}}

Aşağıdaki `npm` komutu, sunucu betiğinin bulunduğu dizine `mime`ın belirli bir sürümünü yükler:

```{lang: null}
$ npm install mime-types@2.1.0
```

{{index "404 (HTTP status code)", "stat function", [file, resource]}}

İstenen bir dosya mevcut olmadığında, döndürülmesi gereken doğru HTTP durum kodu 404'tür. Hem dosyanın var olup olmadığını hem de bir ((dizin)) olup olmadığını öğrenmek için bir dosya hakkında bilgi arayan `stat` fonksiyonunu kullanacağız.

```{includeCode: ">code/file_server.mjs"}
import {createReadStream} from "node:fs";
import {stat, readdir} from "node:fs/promises";
import {lookup} from "mime-types";

methods.GET = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return {status: 404, body: "File not found"};
  }
  if (stats.isDirectory()) {
    return {body: (await readdir(path)).join("\n")};
  } else {
    return {body: createReadStream(path),
            type: lookup(path)};
  }
};
```

{{index "createReadStream function", ["asynchronous programming", "in Node.js"], "error handling", "ENOENT (status code)", "Error type", inheritance}}

Diske dokunmak zorunda olduğu ve bu nedenle biraz zaman alabileceği için `stat` asenkrondur. Geri çağırma tarzı yerine vaatler kullandığımız için, doğrudan `node:fs` yerine `promises` içinden içe aktarılması gerekir.

Dosya mevcut olmadığında, `stat` `code` özelliği `“ENOENT”` olan bir hata nesnesi atacaktır. Bu biraz belirsiz, ((Unix))'ten esinlenen kodlar, Node'daki hata türlerini nasıl tanıdığınızı gösterir.

{{index "Stats type", "stat function", "isDirectory method"}}

`stat` tarafından döndürülen `stats` nesnesi bize bir ((dosya)) hakkında boyutu (`size` özelliği) ve ((değişiklik tarihi)) (`mtime` özelliği) gibi bir dizi şey söyler. Burada, `isDirectory` yönteminin bize söylediği gibi, bir ((dizin)) mi yoksa normal bir dosya mı olduğu sorusuyla ilgileniyoruz.

{{index "readdir function"}}

Bir ((dizin)) içindeki dosya dizisini okumak ve istemciye döndürmek için `readdir` kullanıyoruz. Normal dosyalar için `createReadStream` ile okunabilir bir akış oluşturur ve bunu `mime` paketinin dosya adı için bize verdiği içerik türüyle birlikte gövde olarak döndürürüz.

{{index "Node.js", "file server example", "DELETE method", "rmdir function", "unlink function"}}

`DELETE` isteklerini işlemek için kullanılan kod biraz daha basittir.

```{includeCode: ">code/file_server.mjs"}
import {rmdir, unlink} from "node:fs/promises";

methods.DELETE = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return {status: 204};
  }
  if (stats.isDirectory()) await rmdir(path);
  else await unlink(path);
  return {status: 204};
};
```

{{index "204 (HTTP status code)", "body (HTTP)"}}

Bir ((HTTP)) ((yanıt)) herhangi bir veri içermediğinde, bunu belirtmek için durum kodu 204 (“içerik yok”) kullanılabilir. Silme işlemine verilen yanıtın, işlemin başarılı olup olmadığının ötesinde herhangi bir bilgi iletmesi gerekmediğinden, burada döndürülecek en mantıklı şey budur.

{{index idempotence, "error response"}}

Var olmayan bir dosyayı silmeye çalışmanın neden bir hata yerine başarı durum kodu döndürdüğünü merak ediyor olabilirsiniz. Silinmek istenen dosya orada olmadığında, isteğin amacının zaten yerine getirildiğini söyleyebilirsiniz. ((HTTP)) standardı bizi istekleri _idempotent_ yapmaya teşvik eder, bu da aynı isteği birden fazla kez yapmanın bir kez yapmakla aynı sonucu vereceği anlamına gelir. Bir bakıma, zaten gitmiş olan bir şeyi silmeye çalışırsanız, yapmaya çalıştığınız etki elde edilmiştir - o şey artık orada değildir.

{{index "file server example", "Node.js", "PUT method"}}

Bu `PUT` istekleri için işleyicidir:

```{includeCode: ">code/file_server.mjs"}
import {createWriteStream} from "node:fs";

function pipeStream(from, to) {
  return new Promise((resolve, reject) => {
    from.on("error", reject);
    to.on("error", reject);
    to.on("finish", resolve);
    from.pipe(to);
  });
}

methods.PUT = async function(request) {
  let path = urlPath(request.url);
  await pipeStream(request, createWriteStream(path));
  return {status: 204};
};
```

{{index overwriting, "204 (HTTP status code)", "error event", "finish event", "createWriteStream function", "pipe method", stream}}

Bu sefer dosyanın var olup olmadığını kontrol etmemize gerek yok, eğer varsa üzerine yazacağız. Verileri okunabilir bir akıştan yazılabilir bir akışa, bu durumda istekten dosyaya taşımak için yine `pipe` kullanıyoruz. Ancak `pipe` bir promise döndürmek için yazılmadığından, `pipe` çağrısının sonucu etrafında bir promise oluşturan bir wrapper, `pipeStream` yazmamız gerekiyor.

{{index "error event", "finish event"}}

Dosya açılırken bir şeyler ters giderse, `createWriteStream` yine de bir akış döndürür, ancak bu akış bir `“error”` olayı tetikler. İstekten gelen akış da başarısız olabilir, örneğin ağ çökerse. Bu nedenle, her iki akışın `“error”` olaylarını vaadi reddetmek için bağlarız. `pipe` işi bittiğinde, çıktı akışını kapatacak ve bu da `“finish”` olayını ateşlemesine neden olacaktır. Bu, vaadi başarıyla çözebileceğimiz (hiçbir şey döndürmeyen) noktadır.

{{index download, "file server example", "Node.js"}}

Sunucu için tam betik [_https://eloquentjavascript.net/code/file_server.mjs_](https://eloquentjavascript.net/code/file_server.mjs) adresinde mevcuttur. Bunu indirebilir ve bağımlılıklarını yükledikten sonra kendi dosya sunucunuzu başlatmak için Node ile çalıştırabilirsiniz. Ve tabii ki, bu bölümün alıştırmalarını çözmek ya da deney yapmak için onu değiştirebilir ve genişletebilirsiniz.

{{index "body (HTTP)", "curl program", [HTTP, client], [method, HTTP]}}

((Unix)) benzeri sistemlerde (macOS ve Linux gibi) yaygın olarak bulunan komut satırı aracı `curl`, HTTP ((istek)) yapmak için kullanılabilir. Aşağıdaki oturum sunucumuzu kısaca test etmektedir. `-X` seçeneği isteğin yöntemini ayarlamak için, `-d` seçeneği ise istek gövdesini eklemek için kullanılır.

```{lang: null}
$ curl http://localhost:8000/file.txt
File not found
$ curl -X PUT -d CONTENT http://localhost:8000/file.txt
$ curl http://localhost:8000/file.txt
CONTENT
$ curl -X DELETE http://localhost:8000/file.txt
$ curl http://localhost:8000/file.txt
File not found
```

Dosya henüz mevcut olmadığından `file.txt` için yapılan ilk istek başarısız olur. `PUT` isteği dosyayı oluşturur ve bir sonraki istek dosyayı başarıyla alır. Bir `DELETE` isteği ile sildikten sonra, dosya yine kayıptır.

## Özet

{{index "Node.js"}}

Node, JavaScript'i tarayıcı dışı bir bağlamda çalıştırmamızı sağlayan güzel ve küçük bir sistemdir. Başlangıçta bir ağdaki _node_ rolünü oynamak üzere ağ görevleri için tasarlanmıştır. Ancak kendini her türlü komut dosyası görevine borçludur ve JavaScript yazmak hoşunuza giden bir şeyse, Node ile görevleri otomatikleştirmek işe yarar.

NPM, aklınıza gelebilecek her şey için (ve muhtemelen hiç aklınıza gelmeyecek birkaç şey için) paketler sağlar ve bu paketleri `npm` programı ile getirip yüklemenize olanak tanır. Node, dosya sistemiyle çalışmak için `node:fs` modülü ve HTTP sunucularını çalıştırmak için `node:http` modülü de dahil olmak üzere bir dizi yerleşik modülle birlikte gelir.

Node'daki tüm girdi ve çıktılar, `readFileSync` gibi bir fonksiyonun senkronize bir varyantını açıkça kullanmadığınız sürece asenkron olarak yapılır. Node başlangıçta asenkron işlevsellik için geri aramalar kullanıyordu, ancak `node:fs/promises` paketi dosya sistemine vaat tabanlı bir arayüz sağlar.

## Egzersizler

### Arama aracı

{{index grep, "search problem", "search tool (exercise)"}}

((Unix)) sistemlerinde, bir ((düzenli ifade)) için dosyaları hızlı bir şekilde aramak için kullanılabilen `grep` adlı bir komut satırı aracı vardır.

((Komut satırından)) çalıştırılabilen ve bir şekilde `grep` gibi davranan bir Node betiği yazın. İlk komut satırı argümanını düzenli bir ifade olarak ele alır ve diğer argümanları aranacak dosyalar olarak değerlendirir. İçeriği düzenli ifadeyle eşleşen herhangi bir dosyanın adını çıktı olarak vermelidir.

Bu işe yaradığında, argümanlardan biri ((dizin)) olduğunda, o dizindeki ve alt dizinlerindeki tüm dosyaları arayacak şekilde genişletin.

{{index ["asynchronous programming", "in Node.js"], "synchronous programming"}}

Uygun gördüğünüz şekilde eşzamansız veya eşzamanlı dosya sistemi işlevlerini kullanın. İşleri aynı anda birden fazla eşzamansız eylem talep edilecek şekilde ayarlamak işleri biraz hızlandırabilir, ancak çoğu dosya sistemi bir seferde yalnızca bir şeyi okuyabildiğinden çok büyük bir miktar değil.

{{hint

{{index "RegExp class", "search tool (exercise)"}}

İlk komut satırı argümanınız olan ((düzenli ifade)), `process.argv[2]` içinde bulunabilir. Girdi dosyaları bundan sonra gelir. Bir dizeden düzenli ifade nesnesine geçmek için `RegExp` yapıcısını kullanabilirsiniz.

{{index "readFileSync function"}}

Bunu `readFileSync` ile eşzamanlı olarak yapmak daha basittir, ancak söz döndüren işlevleri almak için `fs/promises` kullanırsanız ve bir `async` işlevi yazarsanız, kod benzer görünür.

{{index "stat function", "statSync function", "isDirectory method"}}

Bir şeyin dizin olup olmadığını anlamak için yine `stat` (veya `statSync`) ve stats nesnesinin `isDirectory` yöntemini kullanabilirsiniz.

{{index "readdir function", "readdirSync function"}}

Bir dizini keşfetmek dallanan bir süreçtir. Bunu ya özyinelemeli bir fonksiyon kullanarak ya da bir dizi iş (hala keşfedilmesi gereken dosyalar) tutarak yapabilirsiniz. Bir dizindeki dosyaları bulmak için `readdir` veya `readdirSync` fonksiyonlarını çağırabilirsiniz. Garip büyük harfe dikkat edin-Node'un dosya sistemi fonksiyon isimlendirmesi, `readdir` gibi standart Unix fonksiyonlarına gevşek bir şekilde dayanır, hepsi küçük harftir, ancak daha sonra büyük harfle `Sync` ekler.

`readdir` ile okunan bir dosya adından tam bir yol adına gitmek için, ya `node:path`ten `sep`i aralarına koyarak ya da aynı paketten `join` kullanarak dizinin adıyla birleştirmeniz gerekir.

hint}}

### Dizin oluşturma

{{index "file server example", "directory creation (exercise)", "rmdir function"}}

Dosya sunucumuzdaki `DELETE` yöntemi dizinleri silebilse de (`rmdir` kullanarak), sunucu şu anda bir ((dizin)) _oluşturmak_ için herhangi bir yol sağlamamaktadır.

{{index "MKCOL method", "mkdir function"}}

`MKCOL` yöntemi (“make collection”) için destek ekleyin, bu yöntem `node:fs` modülünden `mkdir` çağrısı yaparak bir dizin oluşturmalıdır. `MKCOL` yaygın olarak kullanılan bir HTTP yöntemi değildir, ancak _((WebDAV))_ standardında aynı amaç için mevcuttur, bu da ((HTTP)) üzerinde belge oluşturmak için uygun hale getiren bir dizi kural belirtir.

```{hidden: true, includeCode: ">code/file_server.mjs"}
import {mkdir} from "node:fs/promises";

methods.MKCOL = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    await mkdir(path);
    return {status: 204};
  }
  if (stats.isDirectory()) return {status: 204};
  else return {status: 400, body: "Not a directory"};
};
```

{{hint

{{index "directory creation (exercise)", "file server example", "MKCOL method", "mkdir function", idempotency, "400 (HTTP status code)"}}

`DELETE` yöntemini uygulayan işlevi `MKCOL` yöntemi için bir taslak olarak kullanabilirsiniz. Dosya bulunamadığında, `mkdir` ile bir dizin oluşturmaya çalışın. Bu yolda bir dizin bulunduğunda, dizin oluşturma isteklerinin idempotent olması için 204 yanıtı döndürebilirsiniz. Burada dizin olmayan bir dosya varsa, bir hata kodu döndürün. Kod 400 (“kötü istek”) uygun olacaktır.

hint}}

### Web'de kamusal bir alan

{{index "public space (exercise)", "file server example", "Content-Type header", website}}

Dosya sunucusu her türlü dosyayı sunduğundan ve hatta doğru `Content-Type` başlığını içerdiğinden, bunu bir web sitesi sunmak için kullanabilirsiniz. Herkesin dosyaları silmesine ve değiştirmesine izin verdiğinden, ilginç bir web sitesi türü olacaktır: doğru HTTP isteğini oluşturmak için zaman ayıran herkes tarafından değiştirilebilen, geliştirilebilen ve tahrip edilebilen bir web sitesi.

Basit bir JavaScript dosyası içeren temel bir ((HTML)) sayfası yazın. Dosyaları dosya sunucusu tarafından sunulan bir dizine koyun ve tarayıcınızda açın.

Daha sonra, ileri düzey bir alıştırma veya hatta bir ((hafta sonu projesi)) olarak, bu kitaptan edindiğiniz tüm bilgileri birleştirerek web sitesini _içinden_ değiştirmek için daha kullanıcı dostu bir arayüz oluşturun.

Web sitesini oluşturan dosyaların içeriğini düzenlemek için bir HTML ((form)) kullanın ve [Bölüm ?](http)'de açıklandığı gibi kullanıcının HTTP isteklerini kullanarak bunları sunucuda güncellemesine izin verin.

Sadece tek bir dosyayı düzenlenebilir hale getirerek başlayın. Daha sonra kullanıcının hangi dosyayı düzenleyeceğini seçebilmesini sağlayın. Dosya sunucumuzun bir dizini okurken dosya listeleri döndürdüğü gerçeğini kullanın.

{{index overwriting}}

Doğrudan dosya sunucusu tarafından açığa çıkarılan kodda çalışmayın, çünkü bir hata yaparsanız buradaki dosyalara zarar verebilirsiniz. Bunun yerine, çalışmanızı herkesin erişebileceği dizinin dışında tutun ve test ederken oraya kopyalayın.

{{hint

{{index "file server example", "textarea (HTML tag)", "fetch function", "relative path", "public space (exercise)"}}

Düzenlenmekte olan dosyanın içeriğini tutmak için bir `<textarea>` öğesi oluşturabilirsiniz. Bir `GET` isteği, `fetch` kullanarak dosyanın geçerli içeriğini alabilir. Çalışan kodla aynı sunucudaki dosyalara başvurmak için [_http://localhost:8000/index.html_](http://localhost:8000/index.html) yerine _index.html_ gibi göreli URL'ler kullanabilirsiniz.

{{index "form (HTML tag)", "submit event", "PUT method"}}

Ardından, kullanıcı bir düğmeye tıkladığında (bir `<form>` öğesi ve `“submit”` olayı kullanabilirsiniz), dosyayı kaydetmek için istek gövdesi olarak `<textarea>` içeriği ile aynı URL'ye bir `PUT` isteği yapın.

{{index "select (HTML tag)", "option (HTML tag)", "change event"}}

Daha sonra, `/` URL'sine bir `GET` isteği tarafından döndürülen satırları içeren `<option>` öğeleri ekleyerek sunucunun üst kısmındaki ((dizin)) tüm dosyaları içeren bir `<select>` öğesi ekleyebilirsiniz. Kullanıcı başka bir dosya seçtiğinde (alanda bir `“change”` olayı), kod bu dosyayı almalı ve görüntülemelidir. Bir dosyayı kaydederken, o anda seçili olan dosya adını kullanın.

hint}}
