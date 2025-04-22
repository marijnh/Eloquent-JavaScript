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

_Modüller_ bu sorunları önlemeye yönelik bir girişimdir. ((Modül)), başka hangi parçalara bağımlı olduğunu ve diğer modüllerin kullanması için hangi işlevsellikleri sağladığını(*arayüz*ünü) belirten bir program parçasıdır.

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

İşte burada \_((paket))\_ler devreye giriyor. Bir paket, dağıtılabilen (kopyalanabilen ve yüklenen) bir kod parçasıdır. Bir veya daha fazla modül içerebilir ve ne tür paketlere bağımlı olduğu hakkında bilgi içerir. Bir paket genellikle ne yaptığını açıklayan belgelerle birlikte gelir, böylece o programı yazmamış sadece kullanmak isteyen insanlar bile onu kullanabilirler.

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

Bu CommonJS örnek modülü, bir tarih biçimlendirme fonksiyonu sağlar. NPM'den iki ((paket)) kullanır: sayıları `"1st"` ve `"2nd"` gibi dizelere dönüştürmek için `ordinal` paketini ve haftanın günler ve aylar için İngiliz isimlerini almak adına `date-names` paketini kullanır. Bir `Date` nesnesi ve bir ((şablon)) dizesi alan `formatDate` adlı tek bir fonksiyonu dışa aktarır.

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

## İnşaa etme ve paketleme

{{index compilation, "type checking"}}

Çoğu JavaScript paketi, teknik olarak, JavaScript'te yazılmamaktadır. [Bölüm ?](error#typing) içinde bahsedilen tip denetimi ((lehçe))si olan TypeScript gibi uzantılar yaygın olarak kullanılmaktadır. İnsanlar ayrıca, gerçekte JavaScript'i çalıştıran platformlara henüz eklenmeden önce uzun süre planlanan dil uzantılarını kullanmaya başlarlar.

Bunu mümkün kılmak için, kodlarını seçtikleri JavaScript lehçesinden düz eski JavaScript'e—veya hatta JavaScript'in bir önceki sürümüne—_çevirerek_ ((tarayıcı))ların onu çalıştırabilmesini sağlarlar.

{{index latency, performance, [file, access], [network, speed]}}

200 farklı dosyadan oluşan modüler bir programın bir ((web sayfası))na dahil edilmesi kendi sorunlarını ortaya çıkarır. Ağ üzerinden tek bir dosya almak 50 milisaniye sürerse, tüm programı yüklemek 10 saniye alır veya aynı anda birkaç dosya yükleyebilirseniz belki yarısı kadar. Bu çok zaman kaybettir. Tek büyük bir dosya almanın, birçok küçük dosya almaktan daha hızlı olma eğiliminde olması nedeniyle, web programcıları, programlarını (ki bunları titizlikle modüllerde bölmüşlerdi) web'e yayınlamadan önce birleştiren araçlar kullanmaya başlamışlardır. Bu tür araçlara \_((paketleyici))\_ler denir.

{{index "file size"}}

Ve daha da ileri gidebiliriz. Dosyaların sayısının yanı sıra, dosyaların _büyüklüğü_ de ağ üzerinden ne kadar hızlı aktarılabileceklerini belirler. Bu nedenle, JavaScript topluluğu \_((küçültücü))\_ler adını verdiği şeyi icat etmiştir. Bunlar, bir JavaScript programını alır ve yorumları ve boşlukları otomatik olarak kaldırır, bağlantıları yeniden adlandırır ve daha az yer kaplayan eşdeğer kod parçaları ile değiştirip onu küçültürler.

{{index pipeline, tool}}

Bu nedenle, bir NPM paketinde veya bir web sayfasında bulduğunuz kodun _çoklu_ dönüşüm aşamalarından geçmiş olması yüksek ihtimaldir—modern JavaScript'ten tarihi JavaScript'e dönüştürülmüş, sonra modülleri tek bir dosyaya birleştirilmiş ve kod küçültülmüştür. Bu kitapta bu araçların detaylarına girmeyeceğiz çünkü bunlardan birçok tane var ve hangisinin popüler olduğu sürekli değişiyor. Sadece böyle şeylerin var olduğunu unutmayın ve ihtiyacınız olduğunda araştırın.

## Modül dizaynı

{{index [module, design], [interface, module], [code, "structure of"]}}

Programları yapılandırma, programlamanın daha ince yönlerinden biridir. Herhangi bir önemli parçanın fonksiyonalitesi çeşitli şekillerde düzenlenebilir.

İyi bir program tasarımı, özneldir—bununla ilgili artı ve eksiler vardır ve insanların seçimleri farklıdır. İyi yapılandırılmış tasarımın değerini öğrenmenin en iyi yolu, birçok programı okumak veya üzerinde çalışmak ve işe yarayıp yaramayanları fark etmektir. Acılı bir karmaşanın "sadece olduğu gibi olduğunu" varsaymayın. Hemen hemen her şeyin yapısını daha fazla düşünerek iyileştirebilirsiniz.

{{index [interface, module]}}

Modül tasarımının bir yönü kullanım kolaylığıdır. Birden fazla kişi tarafından kullanılması amaçlanan bir şey tasarlıyorsanız—veya hatta kendiniz, üç ay sonra ne yaptığınızın ayrıntılarını hatırlamadığınızda—arayüzünüzün basit ve öngörülebilir olması yardımcı olur.

{{index "ini package", JSON}}

Bu, var olan gelenekleri takip etmek anlamına gelebilir. İyi bir örnek, `ini` paketidir. Bu modül, bir INI dosyası yazmak için `parse` ve `stringify` fonksiyonlarını sağlayarak standart `JSON` nesnesini taklit eder ve `JSON` gibi, dize ve düz nesneler arasında dönüşüm yapar. Bu nedenle, arayüz küçük ve tanıdıktır ve bir kez çalıştıktan sonra nasıl kullanılacağını hatırlamanız muhtemeldir.

{{index "side effect", "hard disk", composability}}

Standart bir fonksiyon veya yaygın olarak kullanılan bir paketi taklit edecek bir standart fonksiyon yoksa bile, modüllerinizi basit ((veri yapı))ları kullanarak ve tek bir, odaklanmış şey yaparak öngörülebilir tutabilirsiniz. Örneğin, NPM'deki birçok INI dosyası ayrıştırma modülü, bir dosyayı doğrudan sabit diskinizden okuyup ve ayrıştıran bir fonksiyon sağlar. Bu, doğrudan dosya sistemine erişimimiz olayan tarayıcı ortamında böyle bir modülü kullanmayı imkansız hale getirir, ve bu modülü bazı dosya okuma fonksiyonlarıyla _birleştirerek_ çözülebilecek bir karmaşıklık eklerdi.

{{index "pure function"}}

Bu, modül tasarımının başka bir yararlı yönünü işaret eder—bir şeyin diğer kodlarla nasıl birleştirilebileceğinin kolaylığı. Değerler hesaplayan odaklı modüller, yan etkileri olan ve karmaşık eylemler gerçekleştiren daha büyük modüllerden daha geniş bir program yelpazesine uygulanabilir. Diskten dosya okumak zorunda olan bir INI dosya okuyucusu, dosyanın içeriğinin başka bir kaynaktan geldiği senaryoda işe yaramaz.

{{index "object-oriented programming"}}

İlgili olarak, değişen bir durum barındıran nesneler bazen yararlı, hatta gereklidir ancak bir fonksiyonla yapılabilecek bir şey varsa, bir fonksiyon kullanın. NPM'deki birkaç INI dosyası okuyucusu, öncelikle bir nesne oluşturmanızı, ardından dosyayı nesnenize yüklemenizi ve son olarak sonuçlara erişmek için özel metodları kullanmanızı gerektiren bir arayüz stili sağlar. Bu tür şeyler, nesne yönelimli geleneğin bir parçasıdır ve korkunçtur. Tek bir fonksiyon çağrısı yapmak ve geçmek yerine, nesnenizi çeşitli durumlar boyunca hareket ettirme ritüelini gerçekleştirmeniz gerekir. Ve çünkü veri şimdi özelleşmiş bir nesne türüne sarılmış durumda olduğundan ötürü bununla etkileşim kuran tüm kodların o tür hakkında bilgi sahibi olması gerekir ve bu da gereksiz bağımlılıklar oluşmasını sağlar.

Yeni veri yapılarını tanımlamak bazen kaçınılmazdır—dil standardı sadece birkaç temel yapıyı sağlar ve birçok veri türü bir diziden veya map veri tipinden daha karmaşık olmak zorundadır. Ancak bir dizi yeterliyken, bir dizi kullanın.

Biraz daha karmaşık bir veri yapısının bir örneği, [bölüm ?](robot) içindeki grafiktir. JavaScript'te bir ((grafik)) nasıl temsil edileceğine dair tek bir açık bir yol yoktur. O bölümde, diğer düğümlere o düğümden erişilebilen yerleri barındıran dizelerin dizilerini tutan bir nesne kullandık.

((NPM))'de birkaç farklı yol bulma paketi vardır ancak bunların hiçbiri bu grafik formatını kullanmaz. Genellikle, kenarların bir ağırlığı olmasına izin verirler, bu da onunla ilişkilendirilmiş maliyet veya mesafe anlamına gelir. Bu, bizim temsilimizde mümkün değildir.

{{index "Dijkstra, Edsger", pathfinding, "Dijkstra's algorithm", "dijkstrajs package"}}

Örneğin, `dijkstrajs` paketi vardır. Bir yol bulma için iyi bilinen bir yaklaşım ve bizim `findRoute` fonksiyonumuza oldukça benzemektedir, Edsger Dijkstra tarafından ilk kez yazıldıktan sonra _Dijkstra'nın algoritması_ olarak adlandırılmıştır. `js` eki sıklıkla paket adlarına eklenir ve bunların JavaScript'te yazıldığını belirtmek içindir. Bu `dijkstrajs` paketi, bizimkinin benzer bir grafik formatını kullanır, ancak diziler yerine, kenarların ağırlıkları olan sayıların olduğu nesneler kullanır.

Bu paketi kullanmak istesek, grafik formatımızın beklediği formatta olduğundan emin olmalıyız. Tüm kenarlar, bizim basitleştirilmiş modelimizde her yolun aynı maliyeti (bir dönüş) varmışçasına varsayıldığından, aynı ağırlığa sahiptir.

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

Bu, birleştirme için bir engel olabilir—farklı veri yapılarını benzer şeyleri tanımlamak için kullanan çeşitli paketler onları birleştirmeyi zorlaştırır. Bu nedenle, birleşebilirlik için tasarım yapmak istiyorsanız, diğer insanların ne tür ((veri yapıları)) kullandığını bulun ve mümkünse onların örneğini takip edin.

{{index design}}

Bir programa uygun bir modül yapısı tasarlamak zor olabilir. Sorunu hala keşfetmeye çalıştığınız ve neyiş işe yarayıp yaramadığını test ettiğiniz aşamada her şeyi düzenli tutmaya çalışmak büyük bir dikkat dağıtıcı olabilir. Sağlam hisseden bir şeyiniz olduğunda, geri çekilip onu düzenlemek için iyi bir zamandır.

## Özet

Modüller, kodu net arayüzler ve bağımlılıklarla parçalara ayırarak daha büyük programlara yapı sağlar. Arayüz, modülün diğer modüller tarafından görülebilen kısmıdır ve bağımlılıklar, kullanılan diğer modüllerdir.

JavaScript, tarihsel olarak bir modül sistemi sağlamadığı için, CommonJS sistemi üzerine inşa edildi. Sonra bir noktada, gerçekten yerleşik bir sistem _inşaa edildi_ ve şu anda CommonJS sistemiyle pek de uyumlu olmayan bir şekilde yan yana var olmayı sürdürmekte.

Bir paket, kendi başına dağıtılabilen bir kod parçasıdır. NPM, JavaScript paketlerinin bir deposudur. Oradan her türlü yararlı (ve yararsız) paketi indirebilirsiniz.

## Egzersizler

### Modüler bir robot

{{index "modular robot (exercise)", module, robot, NPM}}

{{id modular_robot}}

[Bölüm ?](robot) içindeki proje tarafından oluşturulan bağlantılar şu şekildedir:

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

Eğer bu projeyi modüler bir program olarak yazsaydınız, hangi modülleri oluştururdunuz? Hangi modüller hangi diğer modüllere bağlı olurdu ve arayüzleri nasıl görünürdü?

Hangi parçaların muhtemelen NPM'de önceden yazılmış olarak bulunacağını düşünüyorsunuz? Bir NPM paketi kullanmayı mı yoksa kendiniz mi yazmayı mı tercih edersiniz?

{{hint

{{index "modular robot (exercise)"}}

İşte ben olsaydım yapacağım şeyler (ancak yine de, belirli bir modül tasarımı için _tek bir doğru yol_ yoktur):

{{index "dijkstrajs package"}}

Yol grafiğini oluşturmak için kullanılan kod `graph` modülünde bulunur. Kendi yol bulma kodumuz yerine NPM'den `dijkstrajs` paketini kullanmayı tercih ettiğim için, `dijkstrajs`'ın beklediği türde grafik verilerini oluşturacağız. Bu modül, `buildGraph` adlı tek bir fonksiyonu dışa aktarır. Modülün giriş formatına olan bağımlılığını azaltmak için `buildGraph` fonksiyonunun tirelerle içindekileri ayıran bir dize yerine bir dizi iki öğeli diziyi kabul etmesini sağlardım.

`roads` modülü, ham yol verilerini (`roads` dizisi) ve `roadGraph` bağlantısını içerir. Bu modül `./graph.js` dosyasına bağlıdır ve yol grafiğini dışa aktarır.

{{index "random-item package"}}

`VillageState` sınıfı, `state` modülünde yaşar. `./roads` modülüne bağımlıdır çünkü belirli bir yolun var olup olmadığını bilmesi gerekmektedir. Ayrıca `randomPick`'e ihtiyaç duyar. Bu, üç satırlık bir fonksiyon olduğu için bunu `state` modülüne bir dahili yardımcı fonksiyon olarak koyabiliriz. Ancak `randomRobot` da buna ihtiyaç duyar. Bu yüzden ya bunu kopyalamamız ya da kendi modülümüze koymamız gerekir. Bu fonksiyon, `random-item` paketinde zaten mevcut olduğu için, her iki modülü de buna bağlı hale getirmek uygun bir çözümdür. Bu modüle ayrıca, küçük olduğu ve durum yönetimiyle yakından ilgili olduğu için `runRobot` fonksiyonunu da ekleyebiliriz. Modül, hem `VillageState` sınıfını hem de `runRobot` fonksiyonunu dışa aktarır.

Son olarak robotlar, `mailRoute` gibi bağımlılıklarıyla beraber `./roads`'a bağımlı olan ve robot fonksiyonlarını dışa aktaran bir `example-robots` modülüne konabilir. `goalOrientedRobot` fonksiyonunun rotalama yapabilmesi için, bu modül ayrıca `dijkstrajs` paketine bağımlıdır.

((NPM)) modüllerine bazı işleri yükleyerek, kod biraz daha küçüldü. Her bir modül, oldukça basit bir şey yapar ve kendi başına okunabilir. Kodu modüllere bölmek ayrıca genellikle programın tasarımında daha ileri gelişmeleri önerir. Bu durumda, `VillageState` ve robotların belirli bir yol grafiğine bağlı olması biraz garip görünmektedir. Grafik, `state`'in constructor fonksiyonuna bir argüman olarak vermek ve robotların durum nesnesinden okumasını sağlamak daha iyi bir fikir olabilir—bu, bağımlılıkları azaltır (ki bu her zaman iyidir) ve farklı map değerlerinde simülasyonları çalıştırabilmeyi mümkün kılar (ki bu daha da iyidir).

NPM modüllerini yazabileceğimiz şeyler için kullanmak iyi bir fikir midir? İlkeler bakımından, evet—yol bulma gibi önemli olmayan şeyleri kendiniz yazarken muhtemelen hatalar yapar ve zaman kaybedersiniz. `random-item` gibi küçük fonksiyonlar için kendiniz yazmak yeterince kolaydır. Ancak onları ihtiyacınız olan her yere eklemek, modüllerinizi kalabalıklaştırmanızı sağlar.

Ancak, uygun bir NPM paketi _bulmanın_ getirdiği işi de küçümsememelisiniz. Ve bir tane bulsanız bile, iyi çalışmayabilir veya ihtiyacınız olan bazı özellikleri eksik olabilir. Üstelik, NPM paketlerine bağımlı olmak, onların kurulduğundan emin olmanızı ve programınızla birlikte dağıtmanız gerektiği anlamına gelir ve onları düzenli olarak güncellemeniz gerekebilir.

Bu yüzden, tekrar ediyorum, bu bir ödünleşmedir ve bir paketin ne kadar yardımcı olduğuna bağlı olarak her iki şekilde de karar verebilirsiniz.

hint}}

### Yollar modülü

{{index "roads module (exercise)"}}

[Chapter ?](robot) içindeki örneğe dayanarak bir ES modülü yazın, yolların bir dizisini içersin ve onları `roadGraph` olarak temsil eden grafik veri yapısını dışa aktarsın. Bu, grafik oluşturmak için kullanılan `buildGraph` adlı bir fonksiyonu dışa aktaran `./graph.js` adlı bir modüle bağımlı olmalıdır. Bu fonksiyon, iki öğeli dizilerden (yolların başlangıç ve bitiş noktaları) oluşan bir dizi bekler.

{{if interactive

```{test: no}
// Arayüz ve bağımlılıkları ekleyin

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

Bu bir ES modül olduğundan, grafiğe erişmek için `import` kullanmanız gerekir. Bu, `const` beyanı aracılığıyla yapılarına ayırarak arayüz nesnesinden `buildGraph` fonksiyonunu seçebileceğiniz şekilde açıklanmıştır.

`roadGraph` fonksiyonunu dışa aktarmak için, tanımının önüne `export` anahtar kelimesini koyarsınız. `buildGraph`, `roads` ile tam olarak eşleşmeyen bir veri yapısı aldığından ötürü yol dizilerinin bölünmesi kendi modülünüzde olmalıdır.

hint}}

### Döngüsel bağımlılıklar

{{index dependency, "circular dependency", "require function"}}

Dairesel bağımlılık, modül A'nın B'ye, ve B'nin de doğrudan veya dolaylı olarak A'ya bağlı olduğu bir durumdur. Birçok modül sistemi bunu yasaklar çünkü bu tür modüllerin yüklenmesi için hangi sırayı seçerseniz seçin, her modülün çalıştırılmadan önce bağımlılıklarının yüklenmiş olup olmadığından emin olamazsınız.

((CommonJS modülleri)) sınırlı bir dairesel bağımlılık biçimine izin verir. Modüller birbirlerinin arayüzlerine yüklenme işlemleri tamamlanmadan önce erişmedikçe, dairesel bağımlılıklar sorun değildir.

[Bu bölümün başlarında](modules#require) verilen `require` fonksiyonu bu tür bir bağımlılık döngüsünü destekler. Bununla nasıl başa çıktığını görebiliyor musunuz?

{{hint

{{index overriding, "circular dependency", "exports object"}}

Püf noktası, `require` fonksiyonunun modülü yüklemeye _başlamadan önce_ arayüz nesnesini önbelleğine eklemesidir. Bu şekilde, çalışırken yapılan herhangi bir `require` çağrısı, yüklenmiş olup olmadığı bilindiğinden, tüm modülü tekrar yüklemek yerine (bunu yapmak sonunda yığını taşmaya neden olurdu) mevcut arayüz döndürülmesini sağlar.

hint}}
