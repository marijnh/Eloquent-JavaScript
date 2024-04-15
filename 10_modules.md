{{meta {load_files: ["code/packages_chapter_10.js", "code/chapter/07_robot.js"]}}}

# Modüller

{{quote {author: "Tef", title: "Programlamak Korkunç", chapter: true}

Silmesi kolay olan kod yazın, üzerine daha fazla şey eklenmesi kolay olan kod değil.

quote}}

{{index "Yuan-Ma", "Programlamanın Kitabı"}}

{{figure {url: "img/chapter_picture_10.jpg", alt: "Modüler parçalardan inşa edilmiş karmaşık bir binanın illüstrasyonu.", chapter: framed}}}

{{index organization, [code, "structure of"]}}

İdeal olarak, bir programın açık ve anlaşılır bir yapısı vardır. Çalışma şeklini açıklamak kolaydır ve her bir parça iyi tanımlanmış bir rolü oynar.

{{index "organic growth"}}

Uygulamada, programlar organik olarak büyür. Yeni ihtiyaçlar belirlendikçe fonksiyonalite parçaları eklenir. Böyle bir programın iyi yapılandırılmış kalması sürekli dikkat ve çalışma gerektirir. Bu, sadece gelecekte, _bir sonraki_ kişi program üzerinde çalıştığında ödüllendirilecek bir çalışmadır. Bu nedenle, ihmal etmek ve programın çeşitli parçalarının derinlemesine birbirine karışmasına izin vermek caziptir.

{{index readability, reuse, isolation}}

Bu iki pratik soruna neden olur. İlk olarak, karışık bir sistem anlamak zordur. Her şey her şeye dokunabiliyorsa, herhangi bir parçayı izole olarak incelemek zor olur. Tüm şeyin bütünlüklü bir anlayışını oluşturmak zorundasınız. İkinci olarak, böyle bir programın işlevselliğini başka bir durumda kullanmak istiyorsanız, bunu içinde bulunduğu düğümü çözmektense programı tamamen yeniden yazmak daha kolay olabilir.

"((büyük çamur topu))" ifadesi genellikle böyle büyük, yapısal olmayan programlar için kullanılır. Her şey her şeye yapışır ve bir parça seçmeye çalıştığınızda, bütün şey parçalanır ve sadece bir karmaşa oluşturmayı başarırsınız.

## Modüler programlar

{{index dependency, [interface, module]}}

_Modüller_ bu sorunları önlemeye yönelik bir girişimdir. ((Modül)), başka hangi parçalara bağımlı olduğunu ve diğer modüllerin kullanması için hangi işlevsellikleri sağladığını(_arayüz_ünü) belirten bir program parçasıdır.

{{index "big ball of mud"}}

Modül arayüzleri, [bölüm ?](object#interface) içinde gördüğümüz nesne arayüzleriyle çok ortak noktaya sahiptir. Modülün bir kısmını dış dünyaya kullanılabilir hale getirir ve geri kalanını özel tutar.

{{index dependency}}

Ancak, bir modülün diğerlerinin kullanması için sağladığı arayüz sadece hikayenin yarısıdır. İyi bir modül sistemi ayrıca modüllerin diğer modüllerden _hangi kodları kullandıklarını_ belirtmelerini gerektirir. Bu ilişkiler _bağımlılıklar_ olarak adlandırılır. Modül A, modül B'den işlevsellik kullanıyorsa, buna _bağımlı_ olduğu söylenir. Bunlar modülde açıkça belirtildiğinde, bir modülü kullanabilmek için hangi diğer modüllerin mevcut olması gerektiğini anlayıp o bağımlılıkları otomatik olarak yüklemek için kullanılabilirler.

Modüllerin birbirleriyle etkileşim şekilleri açık olduğunda, bir sistem her şeyin her şeyle karıştığı çamur gibi olmak yerine parçaların iyi tanımlanmış bağlayıcılar aracılığıyla etkileştiği ((LEGO)) parçaları gibi olur.

{{id es}}

## ES modülleri

{{index "global scope", [binding, global]}}

Orijinal JavaScript dili herhangi bir modül kavramına sahip değildi. Tüm betikler aynı kapsamda çalışır ve başka bir betikte tanımlanan bir fonksiyona erişmek için o betik tarafından oluşturulan global bağlantılara referansla yapılırdı. Bu, kazara, görülmesi zor kod karışıklığına ve ilişkisiz betiklerin aynı bağlantı adını kullanmaya çalışmasına neden olurdu.

{{index "ES modules"}}

ECMAScript 2015'ten beri, JavaScript iki farklı program türünü desteklemektedir. _Betikler_ eski şekilde davranır: bağlantılar global kapsamda tanımlanır ve doğrudan diğer betiklere başvurma yolu yoktur. _Modüller_ kendi ayrı kapsamına sahiptir ve bağımlılıklarını ve arayüzlerini bildirmek için betiklerde bulunmayan `import` ve `export` anahtar kelimelerini destekler. Bu modül sistemi genellikle _ES modülleri_ olarak adlandırılır ("ES", "ECMAScript" anlamına gelir).

Modüler bir program, bu tür modüllerin, başka modüllerden kullandıkları fonksiyonaliteleri ve başka modüllere kullabilabilir hale getirdikleri fonksiyonaliteleri kullanarak birbirine bağlandığı bir dizi modülden oluşur.

{{index "Date class", "weekDay module"}}

Bu örnek modül, gün adları ile sayılar arasında dönüşüm yapar (`Date`'in `getDay` metodu tarafından döndürülenler aracılığıyla). Arayüzünün bir parçası olmayan bir sabit değer ve iki fonksiyon tanımlar. Hiçbir bağımlılığı yoktur.

```
const names = ["Sunday", "Monday", "Tuesday", "Wednesday",
               "Thursday", "Friday", "Saturday"];

export function dayName(number) {
  return names[number];
}
export function dayNumber(name) {
  return names.indexOf(name);
}
```

`export` anahtar kelimesi, bir işlevin, sınıfın veya bağlantı tanımının modül arayüzünün bir parçası olduğunu belirtmek için önüne konabilir. Bu, diğer modüllerin onu içe aktararak kullanabilmesini mümkün kılar.

```{test: no}
import {dayName} from "./dayname.js";
let now = new Date();
console.log(`Today is ${dayName(now.getDay())}`);
// → Today is Monday
```

{{index "import keyword", dependency, "ES modules"}}

`import` anahtar kelimesi, süslü parantez içinde bağlantı adlarından oluşan bir listenin yazılması ardından, başka bir modüldeki bağlantıları mevcut modülde kullanılabilir hale getirir. Modüller tırnak içinde belirtilir.

{{index [module, resolution], resolution}}

Bir modül adının bir gerçek programa nasıl çözümleneceği platforma göre farklılık gösterir. Tarayıcı, bunları Web adresleri olarak ele alırken, Node.js bunları dosyalara çözümler. Bir modülü çalıştırmak için, o modülün bağımlı olduğu tüm diğer modüller - ve _bu bağımlı olunan modüllerin de bağımlı olduğu modüller_ de - yüklenir ve export anahtar kelimesi kullanılan tanımalar dış kullanıma müsait hale getirilir.

İçe aktarma ve dışa aktarma bildirimleri, fonksiyonlar, döngüler veya diğer blokların içinde görünemez. Modül yüklendiğinde modüldeki kodun nasıl yürütüldüğünden bağımsız olarak hemen çözümlenirler ve bunu yansıtmak için modülün sadece dış gövdesinde görünmelidirler.

Bu nedenle, bir modülün arayüzü, onlara bağımlı olan diğer modüllerin erişebildiği adlandırılmış bağlantılardan oluşur. İçe aktarılan bağlantılar, adlarının ardından `as` kullanılarak yeni bir yerel isim verilerek yeniden adlandırılabilir.

```
import {dayName as nomDeJour} from "./dayname.js";
console.log(nomDeJour(3));
// → Wednesday
```

Ayrıca, bir modülün özel olarak adlandırılmış `default` adlı bir dışa aktarma bildirisi olması mümkündür, bu genellikle yalnızca tek bir bağlantıyı dışa aktaran modüller için kullanılır. Varsayılan bir dışa aktarım tanımlamak için, bir fonksiyon bildiriminin veya bir sınıf bildiriminin önüne `export default` yazılır.

```
export default ["Winter", "Spring", "Summer", "Autumn"];
```

Bu tür bir bağlantı, içe aktarmada adın etrafındaki süslü parantezleri kullanmadan içeri aktarılır.

```
import seasonNames from "./seasonname.js";
```

## Paketler

{{index bug, dependency, structure, reuse}}

Bir programı ayrı parçalardan oluşturmanın ve bazı parçaları kendi başlarına çalıştırabilmenin avantajlarından biri, aynı parçayı farklı programlarda kullanabilme olasılığınızdır.

{{index "parseINI function"}}

Ancak, bunu nasıl kurarsınız? Diyelim ki başka bir programda [bölüm ?](regexp#ini) içindeki `parseINI` fonksiyonunu kullanmak istiyorum. Fonksiyonun neye bağlı olduğu (bu durumda, hiçbir şeye) açıksa, sadece o modülü yeni projeme kopyalayabilir ve kullanabilirim. Ancak sonra, kodda bir hata bulursam, muhtemelen o sırada çalıştığım programda düzelteceğim ve aynı hatayı diğer programda da düzeltmeyi unutacağım.

{{index duplication, "copy-paste programming"}}

Kod kopyalamaya başladığınızda, zamanınızı ve enerjinizi kopyaları taşımak ve güncel tutmak için harcadığınızı hızla fark edersiniz.

İşte burada _((paket))_ler devreye giriyor. Bir paket, dağıtılabilen (kopyalanabilen ve yüklenen) bir kod parçasıdır. Bir veya daha fazla modül içerebilir ve ne tür paketlere bağımlı olduğu hakkında bilgi içerir. Bir paket genellikle ne yaptığını açıklayan belgelerle birlikte gelir, böylece o programı yazmamış sadece kullanmak isteyen insanlar bile onu kullanabilirler.

Bir pakette bir sorun bulunduğunda veya yeni bir özellik eklediğinde, paket güncellenir. Artık ona bağımlı olan programlar (ki bunlar da paketler olabilir) iyileştirmeleri almak için yeni ((sürümü)) kopyalayabilirler.

{{id modules_npm}}

{{index installation, upgrading, "package manager", download, reuse}}

Bu şekilde çalışmak ((altyapı)) gerektirir. Paketleri depolamak ve bulmak için bir yer ve bunları kurmak ve yükseltmek için uygun bir yer gereklidir. JavaScript dünyasında, bu altyapı ((NPM)) ([https://npmjs.org](https://npmjs.org)) tarafından sağlanır.

NPM iki şeydir: paketleri indirebileceğiniz (ve yükleyebileceğiniz) çevrimiçi bir hizmet ve onları kurmanıza ve yönetmenize yardımcı olan Node.js ile birlikte paketlenmiş bir program.

{{index "ini package"}}

Yazım sırasında, NPM'de üç milyondan fazla farklı paket bulunmaktadır. Adil olmak gerekirse, bunların büyük bir kısmı gereksizdir. Ancak neredeyse her kullanışlı, genel olarak erişilebilir JavaScript paketi NPM'de bulunabilir. Örneğin, [bölüm ?](regexp) içinde oluşturduğumuz bir INI dosyası ayrıştırıcısı, `ini` paketi adı altında bulunabilir.

{{index "command line"}}

[Chapter ?](node), bu tür paketleri `npm` komut satırı programını kullanarak yerel olarak nasıl kuracağınızı gösterecektir.

İndirilebilir kaliteli paketlere sahip olmak son derece değerlidir. 100 kişi tarafından yazılmış bir programı yeniden icat etmekten genellikle kaçınabilir ve birkaç tuşa basarak sağlam, iyi test edilmiş bir uygulama elde edebiliriz.

{{index maintenance}}

Yazılım kopyalamak ucuzdur, bu yüzden biri yazdığında, başkalarına dağıtmak verimli bir süreçtir. Ancak bunu baştan yazmak _iştir_, ayrıca kodunuzda sorun bulan veya yeni özellikler önermek isteyen kişilere cevap vermek daha fazla iştir.

Varsayılan olarak, yazdığınız kodun ((telif hakkı)) size aittir ve diğer kişiler yalnızca izninizle kullanabilirler. Ancak bazı insanlar nazik olduklarından ve iyi yazılım yayınlamak, yazılımcılar arasında biraz ünlü olmanıza yardımcı olabildiğinden ötürü birçok paket açıkça diğer insanların onu kullanmasına izin veren bir ((lisans)) altında yayınlanır.

((NPM))'deki çoğu kod bu şekilde lisanslanmıştır. Bazı lisanslar, paketin üzerine inşa ettiğiniz kodu da aynı lisans altında yayınlamanızı gerektirir. Diğerleri ise daha az talepkârdır ve sadece lisansı kodla birlikte dağıtmanızı isterler. JavaScript topluluğu genellikle bu son açıkladığım türdeki lisansları kullanır. Başkalarının paketlerini kullanırken, lisanslarını bilincinde olduğunuzdan emin olun.

{{id modules_ini}}

{{index "ini package"}}

Artık kendi INI dosyası ayrıştırıcımızı yazmak yerine, ((NPM)) üzerinden bir tane kullanabiliriz.

```
import {parse} from "ini";

console.log(parse("x = 10\ny = 20"));
// → {x: "10", y: "20"}
```

{{id commonjs}}

## CommonJS modülleri

2015'ten önce, JavaScript dilinde gerçek bir yerleşik modül sistemi olmadığı zamanlarda da insanlar JavaScript'te büyük sistemler inşa ediyorlardı. Bunu çalışabilir yapmak için ((modül))lere _ihtiyaçları vardı_.

{{index [function, scope], [interface, module], [object, as module]}}

Topluluk, kendi düzenlediği ((modül sistem))lerini dilden bağımsız olarak tasarladı. Bu modülleri, yerel bir kapsam oluştururken fonksiyonları kullanarak ve modül arayüzlerini temsil etmek için sıradan nesneleri kullanarak oluşturdular.

Başlangıçta, insanlar modüllerine ayrı bir bağlam oluşturmak için "((hemen çağrılan fonksiyon ifadesi))" içine manuel olarak sarıp arayüz nesnelerini tek bir global değişkene atarlardı.

```
const weekDay = function() {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday",
                 "Thursday", "Friday", "Saturday"];
  return {
    name(number) { return names[number]; },
    number(name) { return names.indexOf(name); }
  };
}();

console.log(weekDay.name(weekDay.number("Sunday")));
// → Sunday
```

{{index dependency, [interface, module]}}

Bu tür modüllerin stili, belirli bir dereceye kadar ((izolasyon)) sağlar, ancak bağımlılıkları bildirmez. Bunun yerine, arayüzünü ((genel kapsam))a koyar ve varsa bağımlılıklarının, aynısını yapmasını bekler. Bu ideal değildir.

{{index "CommonJS modules"}}

Eğer kendi modül yükleyicimizi uygularsak, daha iyi yapabiliriz. JavaScript modüllerini eklemek için en yaygın kullanılan yaklaşım _CommonJS modülleri_ olarak adlandırılır. ((Node.js)), bu tür modülleri başlangıçtan itibaren kullandı (ancak şimdi ayrıca ES modüllerini de yükleyebilir durumdadır) ve bu, NPM'deki birçok paket tarafından kullanılan modül sistemidir.

{{index "require function", [interface, module], "exports object"}}

Bir CommonJS modülü, düzenli bir betik gibi görünür, ancak diğer modüllerle etkileşim kurmak için kullandığı iki bağlantıya erişim sağlar. İlk olarak, `require` olarak adlandırılan bir fonskiyon. Bağımlılığınızın modül adıyla bunu çağırdığınızda, modülün yüklenip arayüzünü döndürmesini sağlar. İkincisi, modül için arayüz nesnesi olan `exports` adlı bir nesnedir. Başlangıçta boştur ve dışa aktarılan değerleri tanımlamak için ona özellikler eklersiniz.

{{index "formatDate module", "Date class", "ordinal package", "date-names package"}}

Bu CommonJS örnek modülü, bir tarih biçimlendirme fonksiyonu sağlar. NPM'den iki ((paket))  kullanır: sayıları `"1st"` ve `"2nd"` gibi dizelere dönüştürmek için `ordinal` paketini ve haftanın günler ve aylar için İngiliz isimlerini almak adına `date-names` paketini kullanır. Bir `Date` nesnesi ve bir ((şablon)) dizesi alan `formatDate` adlı tek bir fonksiyonu dışa aktarır.

Şablon dizesi, `YYYY` gibi biçimi yönlendiren kodları içerebilir ve ayın sıra günü için `Do` gibi dizeleri içerebilir. `"MMMM Do YYYY"` gibi bir dize verebilirsiniz ve çıktı olarak `"November 22nd 2017"` gibi bir çıktı alırsınız.

```
const ordinal = require("ordinal");
const {days, months} = require("date-names");

exports.formatDate = function(date, format) {
  return format.replace(/YYYY|M(MMM)?|Do?|dddd/g, tag => {
    if (tag == "YYYY") return date.getFullYear();
    if (tag == "M") return date.getMonth();
    if (tag == "MMMM") return months[date.getMonth()];
    if (tag == "D") return date.getDate();
    if (tag == "Do") return ordinal(date.getDate());
    if (tag == "dddd") return days[date.getDay()];
  });
};
```

{{index "destructuring binding"}}

`ordinal` paketinin arayüzü tek bir fonksiyon iken, `date-names` birçok şey içeren bir nesne dışa aktarır—`days` ve `months` isim dizileridir. İçe aktarılan arayüzler için bağlantılar oluştururken, parçalama yöntemi çok yararlı ve kullanışlıdır.

Modül, arayüz fonksiyonunu `exports` bağlantısına ekler ki böylece buna bağımlı olan modüller buna erişebilsin. Modülü şu şekilde kullanabiliriz:

```
const {formatDate} = require("./format-date.js");

console.log(formatDate(new Date(2017, 9, 13),
                       "dddd the Do"));
// → Friday the 13th
```

CommonJS, bir modülü yüklerken, kodunu bir fonksiyon içine sarar (kendi yerel kapsamını verir) ve `require` ve `exports` bağlantılarını bu fonksiyonu çağırırken argüman olarak bu bağlantılara argüman geçirir.

{{id require}}

{{index "require function", "CommonJS modules", "readFile function"}}

Bir dosyanın adını verip onun içeriğini bize döndüren `readFile` adlı bir fonksiyonuna erişiminiz olduğunu varsayarsak, bir `require` fonksiyonunu basitleştirilmiş bir şekilde şu şekilde tanımlayabiliriz:

```{test: wrap, sandbox: require}
function require(name) {
  if (!(name in require.cache)) {
    let code = readFile(name);
    let exports = require.cache[name] = {};
    let wrapper = Function("require, exports", code);
    wrapper(require, exports);
  }
  return require.cache[name];
}
require.cache = Object.create(null);
```

{{id eval}}

{{index "Function constructor", eval, security}}

`Function`, virgüllerle ayrılmış bir dize halinde bir liste argüman ve fonksiyon gövdesini içerisinde barındıran bir dizeyi argüman olarak alan ve bir fonksiyon değeri döndüren standart bir JavaScript fonksiyonudur. Bu ilginç olmakla beraber tehlikeli bir kavramdır—bir programın dize datasından yeni bir program oluşturmasını sağlar- çünkü birisi programınıza sağladığı bir dizeyi `Function` içine koymaya kandırabilirse, programa istediklerini yaptırabilirler.

{{index [file, access]}}

Standart JavaScript, `readFile` gibi bir fonksiyon sağlamaz sağlamaz—ancak tarayıcı ve Node.js gibi farklı JavaScript ortamları, dosyalara erişim için kendi yöntemlerini sağlar. Örnek, `readFile` fonksiyonunun var olduğunu varsayar.

Aynı modülü birden fazla kez yüklememek için, `require`, zaten yüklenmiş modüllerin bir deposunu (önbellek) tutar. Çağrıldığında, önce istenen modülün yüklenip yüklenmediğini kontrol eder ve yüklenmediyse, yükler. Bu, modülün kodunu okuyup bir fonksiyon içine sarıp onu çağırarak yapılır.

{{index "ordinal package", "exports object", "module object", [interface, module]}}

Oluşturulan sarıcı fonksiyon için için `require` ve `exports` değerlerini ((parametre))ler olarak tanımlayarak (ve fonksiyonu çağırırken uygun değerleri geçirerek), yükleyici bu bağlantıların modülün ((kapsam))ında kullanılabilir olduğundan emin olur.

Bu sistemle ES modülleri arasındaki önemli bir fark, ES modülü modül yüklemelerinin bir modülün betiği çalışmaya başlamadan önce gerçekleşmesidir, oysa `require` normal bir fonksiyondur ve modül çalışırken çağrılır. `import` beyanlarının aksine, `require` çağrıları fonksiyonların içinde _görünebilir_ ve bağımlılık adı, sadece düz tırnaklı dizelere izin veren `import`'a kıyasla herhangi bir ifade olabilir.

JavaScript topluluğunun CommonJS stilinden ES modülleri stiline geçişi yavaş ve biraz sancılı olmuştur. Ancak neyse ki, şu anda NPM'deki popüler paketlerin çoğu kodlarını ES modülleri olarak sağlıyor ve Node.js, ES modüllerinin içine CommonJS modüllerinden aktarılmasına kod aktarılmasına izin veriyor. Bu nedenle, Ortak JS kodu hala karşılaşacağınız bir şey olsa da, artık yeni programları bu tarzda yazmanın gerçek bir nedeni yoktur.

## Building and bundling

{{index compilation, "type checking"}}

Many JavaScript packages aren't, technically, written in JavaScript. There are extensions, such as TypeScript, the type checking ((dialect)) mentioned in [Chapter ?](error#typing), that are widely used. People also often start using planned extensions to the language long before they have been added to the platforms that actually run JavaScript.

To make this possible, they _compile_ their code, translating it from their chosen JavaScript dialect to plain old JavaScript—or even to a past version of JavaScript—so that ((browsers)) can run it.

{{index latency, performance, [file, access], [network, speed]}}

Including a modular program that consists of 200 different files in a ((web page)) produces its own problems. If fetching a single file over the network takes 50 milliseconds, loading the whole program takes 10 seconds, or maybe half that if you can load several files simultaneously. That's a lot of wasted time. Because fetching a single big file tends to be faster than fetching a lot of tiny ones, web programmers have started using tools that combine their programs (which they painstakingly split into modules) into a single big file before they publish it to the Web. Such tools are called _((bundler))s_.

{{index "file size"}}

And we can go further. Apart from the number of files, the _size_ of the files also determines how fast they can be transferred over the network. Thus, the JavaScript community has invented _((minifier))s_. These are tools that take a JavaScript program and make it smaller by automatically removing comments and whitespace, renaming bindings, and replacing pieces of code with equivalent code that take up less space.

{{index pipeline, tool}}

So it is not uncommon for the code that you find in an NPM package or that runs on a web page to have gone through _multiple_ stages of transformation—converted from modern JavaScript to historic JavaScript, then combining the modules into a single file, and minifying the code. We won't go into the details of these tools in this book since there are many of them, and which one is popular changes regularly. Just be aware that such things exist, and look them up when you need them.

## Module design

{{index [module, design], [interface, module], [code, "structure of"]}}

Structuring programs is one of the subtler aspects of programming. Any nontrivial piece of functionality can be organized in various ways.

Good program design is subjective—there are trade-offs involved, and matters of taste. The best way to learn the value of well-structured design is to read or work on a lot of programs and notice what works and what doesn't. Don't assume that a painful mess is “just the way it is”. You can improve the structure of almost everything by putting more thought into it.

{{index [interface, module]}}

One aspect of module design is ease of use. If you are designing something that is intended to be used by multiple people—or even by yourself, in three months when you no longer remember the specifics of what you did—it is helpful if your interface is simple and predictable.

{{index "ini package", JSON}}

That may mean following existing conventions. A good example is the `ini` package. This module imitates the standard `JSON` object by providing `parse` and `stringify` (to write an INI file) functions, and, like `JSON`, converts between strings and plain objects. So the interface is small and familiar, and after you've worked with it once, you're likely to remember how to use it.

{{index "side effect", "hard disk", composability}}

Even if there's no standard function or widely used package to imitate, you can keep your modules predictable by using simple ((data structure))s and doing a single, focused thing. Many of the INI-file parsing modules on NPM provide a function that directly reads such a file from the hard disk and parses it, for example. This makes it impossible to use such modules in the browser, where we don't have direct file system access, and adds complexity that would have been better addressed by _composing_ the module with some file-reading function.

{{index "pure function"}}

This points to another helpful aspect of module design—the ease with which something can be composed with other code. Focused modules that compute values are applicable in a wider range of programs than bigger modules that perform complicated actions with side effects. An INI file reader that insists on reading the file from disk is useless in a scenario where the file's content comes from some other source.

{{index "object-oriented programming"}}

Relatedly, stateful objects are sometimes useful or even necessary, but if something can be done with a function, use a function. Several of the INI file readers on NPM provide an interface style that requires you to first create an object, then load the file into your object, and finally use specialized methods to get at the results. This type of thing is common in the object-oriented tradition, and it's terrible. Instead of making a single function call and moving on, you have to perform the ritual of moving your object through its various states. And because the data is now wrapped in a specialized object type, all code that interacts with it has to know about that type, creating unnecessary interdependencies.

Often defining new data structures can't be avoided—only a few  basic ones are provided by the language standard, and many types of data have to be more complex than an array or a map. But when an array suffices, use an array.

An example of a slightly more complex data structure is the graph from [Chapter ?](robot). There is no single obvious way to represent a ((graph)) in JavaScript. In that chapter, we used an object whose properties hold arrays of strings—the other nodes reachable from that node.

There are several different pathfinding packages on ((NPM)), but none of them uses this graph format. They usually allow the graph's edges to have a weight, which is the cost or distance associated with it. That isn't possible in our representation.

{{index "Dijkstra, Edsger", pathfinding, "Dijkstra's algorithm", "dijkstrajs package"}}

For example, there's the `dijkstrajs` package. A well-known approach to pathfinding, quite similar to our `findRoute` function, is called _Dijkstra's algorithm_, after Edsger Dijkstra, who first wrote it down. The `js` suffix is often added to package names to indicate the fact that they are written in JavaScript. This `dijkstrajs` package uses a graph format similar to ours, but instead of arrays, it uses objects whose property values are numbers—the weights of the edges.

So if we wanted to use that package, we'd have to make sure that our graph was stored in the format it expects. All edges get the same weight since our simplified model treats each road as having the same cost (one turn).

```
const {find_path} = require("dijkstrajs");

let graph = {};
for (let node of Object.keys(roadGraph)) {
  let edges = graph[node] = {};
  for (let dest of roadGraph[node]) {
    edges[dest] = 1;
  }
}

console.log(find_path(graph, "Post Office", "Cabin"));
// → ["Post Office", "Alice's House", "Cabin"]
```

This can be a barrier to composition—when various packages are using different data structures to describe similar things, combining them is difficult. Therefore, if you want to design for composability, find out what ((data structure))s other people are using and, when possible, follow their example.

{{index design}}

Designing a fitting module structure for a program can be difficult. In the phase where you are still exploring the problem, trying  different things to see what works, you might want to not worry about it too much since keeping everything organized can be a big distraction. Once you have something that feels solid, that's a good time to take a step back and organize it.

## Summary

Modules provide structure to bigger programs by separating the code into pieces with clear interfaces and dependencies. The interface is the part of the module that's visible to other modules, and the dependencies are the other modules that it makes use of.

Because JavaScript historically did not provide a module system, the CommonJS system was built on top of it. Then at some point it _did_ get a built-in system, which now coexists uneasily with the CommonJS system.

A package is a chunk of code that can be distributed on its own. NPM is a repository of JavaScript packages. You can download all kinds of useful (and useless) packages from it.

## Exercises

### A modular robot

{{index "modular robot (exercise)", module, robot, NPM}}

{{id modular_robot}}

These are the bindings that the project from [Chapter ?](robot) creates:

```{lang: "null"}
roads
buildGraph
roadGraph
VillageState
runRobot
randomPick
randomRobot
mailRoute
routeRobot
findRoute
goalOrientedRobot
```

If you were to write that project as a modular program, what modules would you create? Which module would depend on which other module, and what would their interfaces look like?

Which pieces are likely to be available prewritten on NPM? Would you prefer to use an NPM package or write them yourself?

{{hint

{{index "modular robot (exercise)"}}

Here's what I would have done (but again, there is no single _right_ way to design a given module):

{{index "dijkstrajs package"}}

The code used to build the road graph lives in the `graph` module. Because I'd rather use `dijkstrajs` from NPM than our own pathfinding code, we'll make this build the kind of graph data that `dijkstrajs` expects. This module exports a single function, `buildGraph`. I'd have `buildGraph` accept an array of two-element arrays, rather than strings containing hyphens, to make the module less dependent on the input format.

The `roads` module contains the raw road data (the `roads` array) and the `roadGraph` binding. This module depends on `./graph.js` and exports the road graph.

{{index "random-item package"}}

The `VillageState` class lives in the `state` module. It depends on the `./roads` module because it needs to be able to verify that a given road exists. It also needs `randomPick`. Since that is a three-line function, we could just put it into the `state` module as an internal helper function. But `randomRobot` needs it too. So we'd have to either duplicate it or put it into its own module. Since this function happens to exist on NPM in the `random-item` package, a reasonable solution is to just make both modules depend on that. We can add the `runRobot` function to this module as well, since it's small and closely related to state management. The module exports both the `VillageState` class and the `runRobot` function.

Finally, the robots, along with the values they depend on such as `mailRoute`, could go into an `example-robots` module, which depends on `./roads` and exports the robot functions. To make it possible for `goalOrientedRobot` to do route-finding, this module also depends on `dijkstrajs`.

By offloading some work to ((NPM)) modules, the code became a little smaller. Each individual module does something rather simple and can be read on its own. Dividing code into modules also often suggests further improvements to the program's design. In this case, it seems a little odd that the `VillageState` and the robots depend on a specific road graph. It might be a better idea to make the graph an argument to the state's constructor and make the robots read it from the state object—this reduces dependencies (which is always good) and makes it possible to run simulations on different maps (which is even better).

Is it a good idea to use NPM modules for things that we could have written ourselves? In principle, yes—for nontrivial things like the pathfinding function you are likely to make mistakes and waste time writing them yourself. For tiny functions like `random-item`, writing them yourself is easy enough. But adding them wherever you need them does tend to clutter your modules.

However, you should also not underestimate the work involved in _finding_ an appropriate NPM package. And even if you find one, it might not work well or may be missing some feature you need. On top of that, depending on NPM packages means you have to make sure they are installed, you have to distribute them with your program, and you might have to periodically upgrade them.

So again, this is a trade-off, and you can decide either way depending on how much a given package actually helps you.

hint}}

### Roads module

{{index "roads module (exercise)"}}

Write an ES module, based on the example from [Chapter ?](robot), that contains the array of roads and exports the graph data structure representing them as `roadGraph`. It should depend on a module `./graph.js`, which exports a function `buildGraph` that is used to build the graph. This function expects an array of two-element arrays (the start and end points of the roads).

{{if interactive

```{test: no}
// Add dependencies and exports

const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];
```

if}}

{{hint

{{index "roads module (exercise)", "destructuring binding", "exports object"}}

Since this is an ES module, you have to use `import` to access the graph module. That was described as exporting a `buildGraph` function, which you can pick out of its interface object with a destructuring `const` declaration.

To export `roadGraph`, you put the keyword `export` before its definition. Because `buildGraph` takes a data structure that doesn't precisely match `roads`, the splitting of the road strings must happen in your module.

hint}}

### Circular dependencies

{{index dependency, "circular dependency", "require function"}}

A circular dependency is a situation where module A depends on B, and B also, directly or indirectly, depends on A. Many module systems simply forbid this because whichever order you choose for loading such modules, you cannot make sure that each module's dependencies have been loaded before it runs.

((CommonJS modules)) allow a limited form of cyclic dependencies. As long as the modules don't access each other's interface until after they finish loading, cyclic dependencies are okay.

The `require` function given [earlier in this chapter](modules#require) supports this type of dependency cycle. Can you see how it handles cycles?

{{hint

{{index overriding, "circular dependency", "exports object"}}

The trick is that `require` adds the interface object for a module to its cache _before_ it starts loading the module. That way, if any `require` call made while it is running try to load it, it is already known, and the current interface will be returned, rather than starting to load the module once more (which would eventually overflow the stack).

hint}}
