{{meta {load_files: ["code/intro.js"]}}}

# Giriş

{{quote {author: "Ellen Ullman", title: "Close to the Machine: Technophilia and its Discontents", chapter: true}

Sistemleri kendi amaçlarımız için oluşturduğumuzu düşünüyoruz. Onu kendi görüntümüzde yapıyor olduğumuza inanıyoruz... Ancak bilgisayar gerçekten bizim gibi değil. Aslında, çok ince bir kısmımızın yansımasıdır: mantık, düzen, kural ve netliğe adanmış kısmın bir yansımasıdır.

quote}}

{{figure {url: "img/chapter_picture_00.jpg", alt: "Illustration of a screwdriver next to a circuit board of about the same size", chapter: "framed"}}}

Bu bir bilgisayarlara talimat verme kitabıdır. Bilgisayarlar bugün tornavida kadar yaygın olsa da, oldukça karmaşıklar ve onları istediğiniz şekilde hareket ettirmek her zaman kolay değildir.

Bilgisayarınız için göreviniz yaygın, iyi anlaşılmış bir görevse, örneğin e-postanızı göstermek veya bir hesap makinesi gibi davranmak gibi, uygun uygulamayı açabilir ve işe koyulabilirsiniz. Ancak benzersiz veya açık uçlu görevler için muhtemelen bir uygulama yoktur.

İşte programlamaya girilen yer burası olabilir. _Programlama_, bir programı oluşturma eylemidir - bir bilgisayara ne yapması gerektiğini söyleyen kesin talimatlar kümesi. Çünkü bilgisayarlar aptal, pedantik yaratıklardır, programlama temelde sıkıcı ve sinir bozucudur.

{{index [programming, "joy of"], speed}}

Neyse ki, eğer bu gerçeği aşabilir ve hatta aptal makinelerin anlayabileceği terimlerle düşünmenin titizliğinden zevk alırsanız, programlama ödüllendirici olabilir. Size _saatler_ sürecek şeyleri anında yapma olanağı sağlar. Bilgisayar aracınızın önce yapamadığı şeyleri yapmasını sağlar. Ve soyut düşünme için harika bir egzersiz sunar.

Çoğu programlama, programlama dilleri ile yapılır. Bir _programlama dili_, bilgisayarlara talimat vermek için kullanılan yapay bir dil. Bir bilgisayarla iletişim kurmanın en etkili yolunun, birbirimizle iletişim kurma şeklimizden ağır şekilde ödünç alınması ilginçtir. İnsan dilleri gibi, bilgisayar dilleri de kelimelerin ve ifadelerin yeni yollarla birleştirilmesine izin verir, böylece her zaman yeni kavramları ifade etmek mümkün olur.

{{index [JavaScript, "availability of"], "casual computing"}}

Bir zamanlar BASIC ve DOS gibi dil tabanlı arayüzler, 1980'lerin ve 1990'ların ana bilgisayarlarla etkileşim yöntemiydi. Daha rutin bilgisayar kullanımı için bunlar genel olarak kullanımı öğrenmesi kolay olan ancak özgürlüğünüzü sınırlandıran görsel arayüzlerle değiştirildi. Ancak bilgisayar dilleri hala orada, tabii nereye bakacağınızı bilirseniz. O dillerden bir tanesi olan JavaScript, her modern web tarayıcısına yerleştirilmiştir ve böylece neredeyse her cihazda bulunur.

{{indexsee "web browser", browser}}

Bu kitap, bu dili yararlı ve eğlenceli şeyler yapmak için yeterince tanımanıza yardımcı olmaya çalışacaktır.

## Programlama hakkında

{{index [programming, "difficulty of"]}}

JavaScript'i açıklamanın yanı sıra, programlamanın temel prensiplerini de tanıtacağım. Programlama, anlaşıldığı kadarıyla zor bir iştir. Temel kurallar basit ve net olsa da, bu kuralların üzerine inşa edilen programlar kendi kurallarını ve karmaşıklıklarını tanıtmaya yeterince karmaşık hale gelir. Bir bakıma kendi labirentinizi oluşturuyorsunuz ve bundan ötürü içinde kolayca kaybolabilirsiniz.

{{index learning}}

Bu kitabı okurken bazen son derece sinir bozucu hissedeceğiniz zamanlar olacak. Eğer programlamaya yeni başlayan biriyseniz, sindirmeniz gereken çok yeni malzeme olacak. Bu materyalin büyük bir kısmı daha sonra ek bağlantılar kurmanızı gerektiren şekillerde _birleştirilecek_.

Gereken çabayı göstermek size bağlıdır. Kitabı takip etmekte zorlandığınızda, kendi yeteneklerinizle ilgili herhangi bir sonuca varmayın. Sorun yok, sadece devam etmeniz gerekiyor. Ara verin, bazı materyalleri tekrar okuyun, örnek programları ve ((alıştırmaları)) okuyup anladığınızdan emin olun. Öğrenmek zor bir iş olabilir, ancak öğrendiğiniz her şey sizindir ve daha sonraki öğrenmeyi kolaylaştıracaktır.

{{quote {author: "Ursula K. Le Guin", title: "The Left Hand of Darkness"}

{{index "Le Guin, Ursula K."}}

Eylem faydasız hale geldiğinde, bilgi toplayın; bilgi faydasız hale geldiğinde, uyuyun.

quote}}

{{index [program, "nature of"], data}}

Bir program birçok şeydir. Bir programcı tarafından yazılan bir metindir, bilgisayarın yaptığı işi yapan yönlendirici güçtür, bilgisayarın belleğindeki veridir ve aynı zamanda bu bellekte gerçekleştirilen eylemleri kontrol eder. Programları tanıdık nesnelerle karşılaştırmaya çalışan benzetmeler genellikle eksik kalır. Yüzeysel olarak uygun olanlardan biri, bir programı bir makineye benzetmektir - genellikle birçok ayrı parça içerir ve tümünün çalışmasını sağlamak için bu parçaların nasıl birbirine bağlandığını ve tümünün işleyişine nasıl katkıda bulunduğunu düşünmemiz gerekir.

Bir bilgisayar, bu soyut makinelerin barındırıcısı olarak işlev gören fiziksel bir makinadır. Bilgisayarlar kendileri sadece aptalca basit şeyler yapabilir. Onların bu kadar faydalı olmasının nedeni, bu işleri inanılmaz derecede yüksek bir hızda yapmalarıdır. Bir program, çok karmaşık şeyler yapmak için birçok bu tür basit eylemi ustaca birleştirebilir.

{{index [programming, "joy of"]}}

Bir program bir düşünce binasıdır. İnşa etmek bedelsizdir, ağırlıksızdır ve yazarak ellerimizin altında kolayca büyür. Ancak bir program büyüdükçe, karmaşıklığı da artar. Programlamanın becerisi, kendinizi kafanızı karıştırmayan programlar oluşturma becerisidir. En iyi programlar, anlaşılması kolay olmasına rağmen ilginç bir şey yapmayı başaranlardır.

{{index "programming style", "best practices"}}

Some programmers believe that this complexity is best managed by using only a small set of well-understood techniques in their programs. They have composed strict rules ("best practices") prescribing the form programs should have and carefully stay within their safe little zone.
Bazı programcılar, bu karmaşıklığın programlarında yalnızca iyi anlaşılan birkaç teknik kullanılarak en iyi şekilde yönetildiğine inanırlar. Programların hangi formda olması ve küçük güvenli alanlarında dikkatlice kalmaları gerektiğini düşündükleri katı kurallar ("en iyi pratikler") oluşturdular.

{{index experiment}}

Bu sadece sıkıcı değil, etkisizdir de. Yeni sorunlar genellikle yeni çözümler gerektirir. Programlama alanı genç ve hala hızla gelişmekte olup, oldukça farklı yaklaşımlar için yer bulacak kadar çeşitlidir. Program tasarımında yapılacak pek çok korkunç hata vardır ve onları anlamanız için en azından bir kez yapmalısınız. İyi bir programın nasıl göründüğüne dair bir anlayış, pratikle geliştirilir, kurallar listesinden öğrenilmez.

## Dil neden önemlidir

{{index "programming language", "machine code", "binary data"}}

Başta, bilgisayarların doğuşunda herhangi bir programlama dili yoktu. Programlar şu şekilde gözüküyordu:

```{lang: null}
00110001 00000000 00000000
00110001 00000001 00000001
00110011 00000001 00000010
01010001 00001011 00000010
00100010 00000010 00001000
01000011 00000001 00000000
01000001 00000001 00000001
00010000 00000010 00000000
01100010 00000000 00000000
```

{{index [programming, "history of"], "punch card", complexity}}

Bu, sayıları 1'den 10'a kadar toplayıp sonucu yazdıran bir programdır: 1 + 2 + ... + 10 = 55. Basit bir varsayımsal makinede çalışabilirdi. Erken bilgisayarları programlamak için, büyük anahtar dizilerini doğru konuma ayarlamak veya karton şeritlere delikler açmak ve bunları bilgisayara beslemek gerekiyordu. Bu prosedürün ne kadar sıkıcı ve hata yapmaya açık olduğunu hayal edebilirsiniz. Basit programları yazmak bile çok zeka ve disiplin gerektirirdi. Karmaşık olanlar neredeyse hayal edilemezdi.

{{index bit, "wizard (mighty)"}}

Tabii ki, bu gizemli desenlerin (birler ve sıfırlar) el ile girilmesi, programcıya güçlü bir büyücü hissi veriyordu. Ve bu, iş tatmini açısından bir şeylere değer olmalı.

{{index memory, instruction}}

Önceki programın her satırı yalnızca bir talimat içerir. Bu İngilizce olarak şöyle yazılabilir:

 1. Bellek konumu 0'da 0 sayısını saklayın.
 2. Bellek konumu 1'de 1 sayısını saklayın.
 3. Bellek konumu 1'in değerini bellek konumu 2'ye saklayın.
 4. Bellek konumu 2'deki değerden 11'i çıkarın.
 5. Bellek konumu 2'deki değer 0 ise, talimat 9 ile devam edin.
 6. Bellek konumu 0'ın değerine bellek konumu 1'in değerini ekleyin.
 7. Bellek konumu 1'in değerine 1 sayısını ekleyin.
 8. Talimat 3 ile devam edin.
 9. Bellek konumu 0'ın değerini sonuç olarak çıkarın.


{{index readability, naming, binding}}

Bu, artık bitlerin karışımından daha okunabilir olsa da, hala oldukça belirsizdir. Talimatlar ve bellek konumları için sayılar yerine isimler kullanmak çok daha yardımcı olur.

```{lang: "null"}
 “total” değerini 0 yap.
 “count” değerini 1 yap.
[while]
 “compare” değerini “count” değerine ata.
 “compare” değerinden 11 çıkar.
 Eğer “compare” sıfırsa şuradan devam et: [end].
 “count” değerini “total” değerine ekle.
 “count” değerine 1 ekle.
 Şuradan devam et: [loop].
[end]
 Sonuç “total”.
```

{{index loop, jump, "summing example"}}

Artık programın nasıl çalıştığını görebiliyor musunuz? İlk iki satır, iki bellek konumuna başlangıç değerlerini verir: `total`, hesaplamanın sonucunu oluşturmak için kullanılacak ve `count`, şu anda baktığımız sayıyı takip edecek. `compare` değerini kullanan satırlar muhtemelen en karışık olanlardır. Program, çalışmayı durdurup durduramayacağını belirlemek için `count` değerinin 11'e eşit olup olmadığını görmek istiyor. Varsayımsal makinemiz oldukça ilkel olduğundan, yalnızca bir sayının sıfır olup olmadığını test edebip buna dayanarak bir karar verebiliyor. Bu nedenle, `compare` olarak etiketlenmiş bellek konumunu kullanarak `count - 11` değerini hesaplar ve bu değere dayanarak bir karar verir. Bir sonraki iki satır, `count` değerini `total` değerine ekler ve `count` değerninin 11 olmadığına karar verdiğinde `count` değerini bir artırır.

Aynı programın JavaScript'teki hali:

```
let total = 0, count = 1;
while (count <= 10) {
  total += count;
  count += 1;
}
console.log(total);
// → 55
```

{{index "while loop", loop, [braces, block]}}

Bu versiyon bize birkaç iyileştirme sağlar. En önemlisi, artık programa ileri geri nasıl atlamak istediğimizi belirtmemize gerek yoktur - `while` yapısı bununla ilgilenir. Verilen koşul geçerli olduğu sürece, onun altında (süslü parantezlerle sarılı) bloğu devam ettirir. Bu koşul `sayac <= 10`dur, yani "sayım 10'a eşit veya daha azdır" anlamına gelir. Artık geçici bir değer oluşturup bunu sıfır ile karşılaştırmamıza gerek yoktur, bu sadece ilgisiz bir ayrıntıydı. Programlama dillerinin gücünün bir kısmıysa bizim için o tür ilgisiz ayrıntıları ele alabilmeleridir.

{{index "console.log"}}


Programın sonunda, `while` yapısı bitirdikten sonra, sonucu yazmak için `console.log` işlemi kullanılır.

{{index "sum function", "range function", abstraction, function}}

Finally, here is what the program could look like if we happened to have the convenient operations `range` and `sum` available, which respectively create a ((collection)) of numbers within a range and compute the sum of a collection of numbers:
Son olarak, `range` ve `sum` adlı belirli değerler arasında sayılar koleksiyonu oluşturup onların toplamını bulan kullanışlı fonksiyonlarımızın mevcut olduğu bir durumda programımızın nasıl görünebileceğine dair:

```{startCode: true}
console.log(sum(range(1, 10)));
// → 55
```

{{index readability}}

Bu hikayenin özü, aynı programın uzun ve kısa, okunaksız ve okunabilir yollarla ifade edilebileceğidir. Programın ilk versiyonu son derece belirsizken, bu son versiyon neredeyse İngilizce gibidir: 1'den 10'a kadar olan sayıların aralığının(`range(10)`) toplamını(`sum`) konsolda görüntüleyin(`console.log`). (Sonraki bölümlerde toplam ve aralık gibi işlemleri nasıl tanımlayacağımızı göreceğiz.)

{{index ["programming language", "power of"], composability}}

İyi bir programlama dili, programcının daha yüksek bir seviyede bilgisayarın gerçekleştirmesi gereken eylemler hakkında konuşmasına izin vererek ona yardımcı olur. Detayları atlamasına yardımcı olur, uygun yapı taşları sağlar (`while` ve `console.log` gibi), kendi yapı taşlarınızı tanımlamanıza izin verir (`sum` ve `range` gibi) ve bu blokları kolayca birleştirmenizi sağlar.


## JavaScript nedir?

{{index history, Netscape, browser, "web application", JavaScript, [JavaScript, "history of"], "World Wide Web"}}

{{indexsee WWW, "World Wide Web"}}

{{indexsee Web, "World Wide Web"}}

JavaScript is also used in more traditional websites to provide various forms of interactivity and cleverness.
JavaScript, 1995 yılında Netscape Navigator tarayıcısına websitelere interaktif programlar oluşturmanın bir yolu olarak eklendi. O zamandan beri, dil diğer tüm önemli grafiksel web tarayıcıları tarafından benimsendi. JavaScript, bugünkü her eylem için sayfanın yeniden yüklenmesine gerek kalmadan doğrudan etkileşimde bulunabileceğiniz modern web uygulamalarını mümkün kıldı, ayrıca daha geleneksel web sitelerinde de çeşitli etkileşim sağlamak için kullanıldı.

{{index Java, naming}}

JavaScript'in Java adındaki programlama diliyle neredeyse hiçbir ilgisi olmadığını belirtmek önemlidir. Benzer ad, iyi bir değerlendirme yerine pazarlama düşüncelerinden esinlenmiştir. JavaScript tanıtıldığında, Java dili yoğun bir şekilde pazarlanıyor ve popülerlik kazanıyordu. Birisi bu başarıya eşlik etmeyi denemek için iyi bir fikir olduğunu düşündü. Şimdi ise isimle sıkışıp kaldık.

{{index ECMAScript, compatibility}}

Netscape dışında benimsenmesinin ardından, JavaScript dilini desteklendiğini iddia eden çeşitli yazılımların aslında aynı dili desteklediklerini garanti edebilemek adına bir standart belgesi yazıldı. Bu, standardizasyonu gerçekleştiren Ecma International organizasyonunun adından ECMAScript standardı olarak adlandırıldı. Uygulamada, ECMAScript ve JavaScript terimleri değiştirilebilir şekilde kullanılabilir— bu iki isim aynı programlama diline hitap etmektedir.

{{index [JavaScript, "weaknesses of"], debugging}}

JavaScript hakkında _korkunç_ şeyler söyleyenler vardır ve söylenen bu şeylerin pek çoğu doğrudur. İlk kez JavaScript'te bir şeyler yazmam gerektiğinde, ondan nefret etmeye hızlıca başladım çünkü JavaScript neredeyse yazdığım her şeyi kabul eder, ancak yazdıkalrımı hep istediğimden başka bir şekilde yorumlardı. Bu durum, tabii ki ne yaptığımı bilmediğim gerçeğiyle çok ilgiliydi, ancak burada gerçek bir sorun var: JavaScript, maalesef izin verdiği şeylerde son derece cömerttir. Bu tasarımın arkasındaki fikir, JavaScript'te programlamanın yeni başlayanlar için daha kolay olmasını sağlamaktı ama aslında bu, programlarınızdaki sorunları bulmayı çoğunlukla daha zor hale getirir çünkü sistem size bunları işaret etmez.

{{index [JavaScript, "flexibility of"], flexibility}}

Ancak bu esnekliğin avantajları da vardır. Daha katı dillerde mümkün olmayan tekniklere olanak tanır ve hoş, gayri resmi bir programlama tarzı sunar. Dilin düzgün bir şekilde öğrendikten ve bir süre kendisiyle çalıştıktan sonra JavaScript'i aslında _sevmeye_ başladım.

{{index future, [JavaScript, "versions of"], ECMAScript, "ECMAScript 6"}}

JavaScript'in birkaç versiyonu olmuştur. ECMAScript sürüm 3, yaklaşık olarak 2000 ile 2010 arasında JavaScript'in hakimiyetinin arttığı dönemde yaygın olarak desteklenen sürümdü. Bu dönemde, dili radikal bir şekilde iyileştirmeyi ve genişletmeyi planlayan cesur bir sürüm 4 üzerinde çalışmalar devam ediyordu. Ancak, geniş kullanılan bir dilin bu kadar radikal bir şekilde değiştirilmesi politik olarak zorlu çıktı ve sürüm 4 üzerindeki çalışmalar 2008'de terkedildi. Yalnızca bazı tartışmasız iyileştirmeler getiren çok daha iddiasız bir sürüm olan 5. sürüm, 2009'da piyasaya çıktı. 2015'te, sürüm 6, sürüm 4 için planlanan bazı fikirleri içeren önemli bir güncelleme olarak yayınlandı. O zamandan beri her yıl yeni, küçük güncellemeler yapılmaktadır.

JavaScript'in gelişmekte olması, tarayıcıların sürekli olarak ayak uydurması gerektiği anlamına gelir. Eski bir tarayıcı kullanıyorsanız, JavaScript'in her özelliğini desteklemeyebilir. Dil tasarımcıları, mevcut programları bozabilecek herhangi bir değişiklik yapmamaya dikkat eder, bu nedenle yeni tarayıcılar hala eski programları çalıştırabilir. Bu kitapta, 2023 sürümünü kullanıyorum.

{{index [JavaScript, "uses of"]}}

Web tarayıcıları, JavaScript'in kullanıldığı tek platformlar değildir. MongoDB ve CouchDB gibi bazı veritabanları JavaScript'i scripting ve sorgu dili olarak kullanır. Masaüstü ve sunucu programlama için birçok platform, özellikle Node.js projesi tarayıcı dışında JavaScript kullanabilmek için bir ortam sağlar.

## Kod ve onunla ne yapılacağı

{{index "reading code", "writing code"}}

_Kod_, programları oluşturan metindir. Bu kitaptaki çoğu bölüm oldukça fazla kod içerir. Kod okumak ve kod yazmak, programlamayı öğrenmenin vazgeçilmez parçaları olduğuna inanıyorum. Örnekleri sadece gözden geçirmeyin ve onları dikkatlice okuyup anlamaya çalışın. Başlangıçta bu yavaş ve kafa karıştırıcı olabilir, ancak hızlıca alışacaksınıza söz veriyorum. Aynı şey ((alıştırmalar)) için de geçerlidir, lütfen bir çalışan çözüm yazmadan önce onları anladığınızı varsaymayın.

{{index interpretation}}

Çözümlerinizi gerçek bir JavaScript yorumlayıcısında denemenizi öneririm. Böylece, yaptıklarınızın çalışıp çalışmadığı konusunda hemen geri bildirim alırsınız ve umarım, ((deney yapmaya)) ve alıştırmaların ötesine geçmeye teşvik edilirsiniz.

{{if interactive

Bu kitabı tarayıcınızda okurken, tüm örnek programları düzenleyip çalıştırabilir ve üzerlerine tıklayarak çalıştırabilirsiniz.

if}}

{{if book

{{index download, sandbox, "running code"}}

Kitaptaki örnek kodları çalıştırmanın ve bunlarla deney yapmanın en kolay yolu, kitabın çevrimiçi sürümünü [_https://eloquentjavascript.net_](https://eloquentjavascript.net/) adresinden bulmaktır. Orada, herhangi bir kod örneğine tıklayarak onu düzenleyebilir, çalıştırabilir ve ürettiği çıktıyı görebilirsiniz. Alıştırmalar üzerinde çalışmak için, [_https://eloquentjavascript.net/code_](https://eloquentjavascript.net/code) adresine gidin, bu adres her programlama alıştırması için başlangıç kodu sağlar ve çözümleri görebilmenize olanak tanır.

if}}

{{index "developer tools", "JavaScript console"}}

Bu kitapta tanımlanan programları kitabın web sitesinin dışında çalıştırmak biraz dikkat gerektirir. Birçok örnek kendi başına durur ve herhangi bir JavaScript ortamında normal çalışabilmelidir. Ancak, daha sonraki bölümlerdeki kodlar genellikle belirli bir ortam için yazılmıştır (tarayıcı veya Node.js) ve yalnızca orada çalışabilir. Ayrıca, birçok bölüm daha büyük programlar tanımlar ve onlarda görünen kod parçaları birbirlerine veya dış dosyalara bağlıdır. Web sitesindeki [dijital kum havuzu](https://eloquentjavascript.net/code), belirli bir bölüm için kodu çalıştırmak için gerekli tüm betikleri ve veri dosyalarını içeren ZIP dosyalarına bağlantılar sağlar.

## Kitaba genel bakış

Bu kitap yaklaşık üç bölüm içerir. İlk 12 bölüm JavaScript dilini tartışır. Sonraki yedi bölüm web ((tarayıcıları)) ve JavaScript'in onları programlamak için kullanımı hakkındadır. Son olarak, iki bölüm, JavaScript programlamak için başka bir ortam olan ((Node.js))'e adanmıştır. Kitapta, gerçek programlamaya bir tat vermek için daha büyük örnek programları açıklayan beş _proje bölümü_ bulunmaktadır.

Kitabın dil kısmı, JavaScript dilinin temel yapısını tanıtan dört bölümle başlar. Bunlar [kontrol yapıları](program_structure) (bu girişte gördüğünüz while kelimesi gibi), [fonksiyonlar](functions) (kendi yapı taşlarınızı yazma), ve veri [yapıları'nı](data) tartışır. Bunlardan sonra, temel programlar yazabilir duruma geleceksiniz. Ardından, [?](higher_order) ve [?](object) numaralı bölümler, daha _soyut_ kod yazmak ve karmaşıklığı kontrol altında tutmak için fonksiyonlar ve nesneleri kullanma tekniklerini tanıtır.

[İlk bir proje bölümü](robot) olan robot adlı bölümün ardından, kitabın dil kısmı, [hata işleme ve hata düzeltme](error), [düzenli ifadeler](regexp) (metinle çalışmak için önemli bir araç), [modülerlik](modules) (karmaşıklığa karşı bir diğer savunma) ve [asenkron programlama](async) (zaman alan olaylarla başa çıkma) üzerine bölümlerle devam eder. Bir programlama dilini uyguladığımız [ikinci proje bölümü](language), kitabın ilk bölümünü tamamlar.

Kitabın ikinci bölümü, [?](browser) ile [?](paint) arasındaki bölümler, tarayıcı içindeki JavaScript'in erişebileceği araçları tanımlar. Ekran üzerinde şeyler görüntülemeyi ([?](dom) ve [?](canvas) numaralı bölümler), kullanıcı girişlerine yanıt vermeyi ([?](event) numaralı bölüm), ve ağ üzerinden iletişim kurmayı ([?](http) numaralı bölüm) öğreneceksiniz. Bu bölümde yine iki proje bölümü bulunmaktadır, biri [platform oyunu](game) ve diğeri [piksel boya programı](paint) oluşturur.

[?](node) numaralı bölüm Node.js'yi tanımlarken, [?](skillsharing) numaralı bölüm bu aracı kullanarak küçük bir web sitesi oluşturur.

{{if commercial

Son olarak, [?](fast) numaralı bölüm, JavaScript programlarını hız için optimize etmesi adına dikkate alınması gereken bazı hususlar hakkında bilgi verir.

if}}

## Tipografik kurallar

{{index "factorial function"}}

Bu kitapta, `monospace` fontuyla yazılmış metinler program öğelerini temsil edecektir. Bazı durumlarda bunlar kendi başına yeterli parçalar olabilir, bazen ise yalnızca yanındaki bir programın bir parçasına atıfta bulunabilirler. Programlar (birkaçını zaten gördünüz) şu şekilde yazılır:

```
function factorial(n) {
  if (n == 0) {
    return 1;
  } else {
    return factorial(n - 1) * n;
  }
}
```

{{index "console.log"}}

Bazen, bir programın ürettiği çıktıyı göstermek için, beklenen çıktı programın sonrasına, iki eğik çizgi ve bir ok ile yazılır.

```
console.log(factorial(8));
// → 40320
```

İyi şanslar!
