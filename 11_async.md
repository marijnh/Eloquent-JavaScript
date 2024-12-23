{{meta {load_files: ["code/hangar2.js", "code/chapter/11_async.js"], zip: "node/html"}}}

# Asynchronous Programming

{{quote {author: "Laozi", title: "Tao Te Ching", chapter: true}

Çamur çökene kadar kim sessizce bekleyebilir?\
Kim eylem anına kadar hareketsiz kalabilir?

quote}}

{{index "Laozi"}}

{{figure {url: "img/chapter_picture_11.jpg", alt: "Bir ağaç dalındaki iki kargayı gösteren illüstrasyon.", chapter: framed}}}

Bilgisayarın merkezi parçası, programlarımızı oluşturan bireysel adımları gerçekleştiren kısım _((işlemci))_ olarak adlandırılır. Şimdiye kadar gördüğümüz programlar işlerini bitirene kadar işlemciyi meşgul tutarlar. Sayıları manipüle eden bir döngü gibi bir şeyin çalıştırılma hızı, büyük ölçüde bilgisayarın işlemcisinin ve belleğinin hızına bağlıdır.

{{index [memory, speed], [network, speed]}}

Ancak birçok program, işlemcinin dışındaki şeylerle etkileşime geçer. Örneğin, bir bilgisayar ağı üzerinden iletişim kurabilir veya ((hard disk))ten veri isteyebilir - bu, bellekten veri almaktan çok daha yavaştır.

Böyle bir şey olurken, işlemciyi boşta bekletmek pek efektik olmaz çünkü bu sırada yapabileceği başka bir iş olabilir. Bu işlemciyi birden çok çalışan programlar arasında geçirerek kısmen işletim sistemi tarafından ele alınır. Ancak bu, bir tek programın bir ağ isteği beklerken ilerleme kaydetmesini istediğimizde işe yaramaz.

## Eşzamansızlık

{{index "synchronous programming"}}

Bir _eşzamanlı_ program modelinde, olaylar teker teker gerçekleşir. Uzun süren bir eylemi gerçekleştiren bir fonksiyonu çağırdığınızda, yalnızca eylem tamamlandığında ve sonucu döndüğünde geri döner. Bu, eylemin zaman aldığı süre boyunca programınızın durmasına sebep olur.

{{index "asynchronous programming"}}

Bir _eşzamansız_ model, aynı anda birden çok şeyin gerçekleşmesine izin verir. Bir eylemi başlattığınızda, programınız çalışmaya devam eder. Eylem tamamlandığında, program bilgilendirilir ve sonuca erişir (örneğin, diskten okunan veri).

Eşzamanlı ve eşzamansız programlamayı bir örnekle karşılaştırabiliriz: ((network)) üzerinden iki istek yapan ve ardından sonucu birleştiren bir program.

{{index "synchronous programming"}}

Bir eşzamanlı ortamda, talep fonksiyonu yalnızca işini bitirdikten sonra döndüğünde, bu görevi gerçekleştirmenin en kolay yolu istekleri birbiri ardına yapmaktır. Bu, ikinci istek yalnızca ilk istek tamamlandığında başlatılacağından dezavantajlıdır. Toplam süre en az iki yanıt süresinin toplamı olacaktır.

{{index parallelism}}

Bu sorunun çözümü, eşzamanlı bir sistemde ek kontrol ((thread))leri başlatmaktır. Bir _thread_, bir başka çalışan programdır ve işletim sistemi tarafından diğer programlarla birlikte aralıklı bir şekilde çalıştırılabilir - çoğu modern bilgisayar birden çok işlemci içerdiğinden, birden çok thread aynı anda farklı işlemcilerde çalışabilir. İkinci bir thread, ikinci isteği başlatabilir ve ardından her iki thread de sonuçlarını bekler, sonrasında sonuçlarını birleştirmek için yeniden senkronize olurlar.

{{index CPU, blocking, "asynchronous programming", timeline, "callback function"}}

Aşağıdaki diyagramda, kalın çizgiler programın normal çalıştığı zamanı temsil ederken, ince çizgiler ağda beklenen zamanı temsil eder. Senkron modelde, ağın alması gereken süre, belirli bir kontrol ((thread))inin zaman çizelgesinin bir \_parçası_dır. Asenkron modelde ağ eyleminin başlatılması, programın devam etmesine izin verir ve ağ iletişimi yanında gerçekleşir, işlem sona erdiğinde programı bilgilendirir.

{{figure {url: "img/control-io.svg", alt: "Senkron ve asenkron programlarda kontrol akışını gösteren diyagram. İlk bölüm, programın aktif ve bekleme aşamalarının tek bir sıralı satırda gerçekleştiği senkronize bir programı göstermektedir. İkinci bölümde, bekleme parçalarının yan yana yer aldığı, programın daha hızlı bitmesine neden olan, iki paralel çizgiye sahip, çok iş parçacıklı bir senkronize program gösterilmektedir. Son bölüm, birden fazla eşzamansız eylemin ana programdan ayrıldığı, bir noktada duran ve beklediği ilk şey bittiğinde devam ettiği eşzamansız bir programı gösterir.",width: "8cm"}}}

{{index ["control flow", asynchronous], "asynchronous programming", verbosity, performance}}

Farkı açıklamanın başka bir yolu, eylemlerin bitmesini beklemenin eşzamanlı modelde _örtük_ ancak asenkron modelde ise bizim kontrolümüz altında _açıkça_ olduğudur.

Eşzamansızlık iki yönde de keser. Doğrudan çizgi kontrol modeline uymayan programları ifade etmeyi kolaylaştırır, ancak doğrudan bir çizgi izleyen programları ifade etmeyi daha zor hale getirebilir. Bu zorluğu azaltmanın bazı yollarını bölümün ilerleyen kısımlarında göreceğiz.

Öne çıkan JavaScript programlama platformları - ((browser))lar ve ((Node.js)) - zaman alabilecek işlemleri ((thread))lerden ziyade asenkron olarak yaparlar. Çünkü thread'lerle programlamak ünlü bir şekilde zordur (bir programın ne yaptığını anlamak, aynı anda birden fazla iş yaptığında çok daha zordur), bu genellikle iyi bir şey olarak kabul edilir.

## Geri aramalar

{{indexsee [function, callback], "callback function"}}

((Asenkron programlama)) yaklaşımlarından biri, bir şeyi beklemesi gereken fonksiyonlara ek bir argüman olarak bir _((geri çağrı fonksiyonu))_ vermektedir. Bir fonksiyon, bir işlemi başlatır, işlem tamamlandığında geri çağrı fonksiyonunun çağrılması için düzenlemeler yapar ve ardından değerini döndürür.

{{index "setTimeout function", waiting}}

Örneğin, Node.js ve tarayıcılarda bulunan `setTimeout` fonksiyonu, belirli bir milisaniye (bir saniye bin milisaniyedir) bekler ve ardından bir fonksiyonu çağırır.

```{test: no}
setTimeout(() => console.log("Tick"), 500);
```

Bekleme genellikle çok önemli bir iş türü değildir, ancak belirli bir zamanda bir şeyin yapılmasını ayarlamak veya başka bir eylemin beklenenden daha uzun sürüp sürmediğini kontrol etmek gerektiğinde çok kullanışlı olabilir.

{{index "readTextFile function"}}

Diğer bir yaygın asenkron işlemlerse cihazın depolama biriminden bir dosya okumaktır. Diyelim ki bir `readTextFile` fonksiyonunuz var ve bu bir dosyanın içeriğini bir dize olarak okur ve bunu bir geri çağrı fonksiyonuna verir.

```
readTextFile("shopping_list.txt", content => {
  console.log(`Shopping List:\n${content}`);
});
// → Shopping List:
// → Peanut butter
// → Bananas
```

`readTextFile` fonksiyonu standart JavaScript'in bir parçası değildir. Tarayıcıda ve Node.js'te dosya okumanın nasıl yapıldığını sonraki bölümlerde göreceğiz.

Geri aramalar kullanarak ardışık olarak birden fazla asenkron işlem gerçekleştirmek, işlemlerden sonra hesaplamanın devamını ele almak için sürekli yeni fonksiyonlar geçirmeniz gerektiği anlamına gelir. İki dosyayı karşılaştıran ve içeriklerinin aynı olup olmadığını belirten bir asenkron fonksiyon, şu şekilde yazılabilir.

```
function compareFiles(fileA, fileB, callback) {
  readTextFile(fileA, contentA => {
    readTextFile(fileB, contentB => {
      callback(contentA == contentB);
    });
  });
}
```

Bu programlama tarzı çalışabilir, ancak her asenkron işlemle girinti seviyesi artar çünkü başka bir fonksiyona girersiniz. Daha karmaşık şeyler yapmak, örneğin asenkron işlemleri bir döngü içine almak, garip olabilir.

Bir bakıma, eşzamansızlık bulaşıcıdır. Asenkron olarak çalışan bir fonksiyonu çağıran herhangi bir fonksiyon, sonucunu iletmek için bir geri çağrı veya benzeri bir mekanizma kullanarak kendisi de asenkron olmalıdır. Bir geri çağrı çağırmak, sadece bir değeri döndürmekten biraz daha karmaşıktır ve hata yapma olasılığı daha yüksektir, bu nedenle programınızın büyük kısımlarını bu şekilde yapılandırmanız gerektiğinde pek de iyi bir seçenek değildir.

## Promise'lar

Asenkron bir program oluşturmanın biraz farklı bir yolu, asenkron fonksiyonların geri arama fonksiyonlarını dolaştırmak yerine, gelecekteki sonucunu temsil eden bir nesne döndürmeleridir. Bu şekilde, böyle fonksiyonlar aslında anlamlı bir şey döndürür ve programın yapısı, eşzamanlı programlarınkine daha yakın olur.

{{index "Promise class", "asynchronous programming", "resolving (a promise)", "then method", "callback function"}}

Standart `Promise` sınıfı bunun için kullanılır. Bir _promise_, henüz mevcut olmayan bir değeri temsil eden bir makbuzdur. `then` metodunu sağlar, böylece beklenen eylem tamamlandığında çağrılması gereken bir fonksiyonu kaydedebilirsiniz. `Promise` çözüldüğünde, yani değeri mevcut olduğunda, böyle fonksiyonlar (çoklu olabilir) sonuç değeriyle çağrılır. Zaten çözülmüş bir promise üzerinde `then` çağrısı yapmak mümkündür—fonksiyonunuz hala çağrılacaktır.

{{index "Promise.resolve function"}}

Bir promise oluşturmanın en kolay yolu, `Promise.resolve` çağrısını kullanmaktır. Bu fonksiyon, verdiğiniz değerin bir promise içine sarıldığından emin olur. Zaten bir promise ise, sadece döndürülür—aksi halde, değerinizi sonucu olarak hemen çözülen yeni bir promise alırsınız.

```
let fifteen = Promise.resolve(15);
fifteen.then(value => console.log(`Got ${value}`));
// → Got 15
```

{{index "Promise class"}}

Hemen çözülmeyen bir promise oluşturmak için, `Promise`'ı bir constructor olarak kullanabilirsiniz. Biraz garip bir arayüze sahiptir—constructor, hemen çağrılan ve promise'i çözmek için kullanabileceği bir fonksiyon geçmesini bekler.

`readTextFile` fonksiyonu için promise tabanlı bir arayüzü bu şekilde oluşturabilirsiniz:

{{index "textFile function"}}

```
function textFile(filename) {
  return new Promise(resolve => {
    readTextFile(filename, text => resolve(text));
  });
}

textFile("plans.txt").then(console.log);
```

Bu eşzamansız fonksiyonun anlamlı bir değer döndürdüğüne dikkat edin—gelecekte bir noktada dosyanın içeriğini size verecek bir promise.

{{index "then method"}}

`then` metodunun yararlı bir yönü, kendisinin de callback fonksiyonunun döndürdüğü değere çözülen başka bir promise döndürmesidir veya eğer o fonksiyon bir promise döndürürse, o promise'in çözüldüğü değere çözülen bir promise döndürür. Böylece, eşzamansız eylemler dizisini oluşturmak için birden fazla `then` çağrısını “zincirleyebilirsiniz”.

Bir dosya dolusu dosya adını okuyan ve listedeki rastgele bir dosyanın içeriğini döndüren bu fonksiyon, bu tür bir eşzamansız promise boru hattını gösterir.

```
function randomFile(listFile) {
  return textFile(listFile)
    .then(content => content.trim().split("\n"))
    .then(ls => ls[Math.floor(Math.random() * ls.length)])
    .then(filename => textFile(filename));
}
```

Fonksiyon, `then` çağrıları zincirinin sonucunu döndürür. İlk promise, dosya listesini bir dize olarak alır. İlk `then` çağrısı, bu dizeyi bir dizi satıra dönüştürerek yeni bir promise üretir. İkinci `then` çağrısı, rastgele bir satır seçer ve tek bir dosya adı veren üçüncü bir promise üretir. Son `then` çağrısı bu dosyayı okur, böylece fonksiyonun tamamının sonucu, rastgele bir dosyanın içeriğini döndüren bir promise olur.

Bu kodda, ilk iki `then` çağrısında kullanılan fonksiyonlar normal bir değer döndürür, bu değer fonksiyon döndüğünde hemen `then` tarafından döndürülen promise'e geçer. Sonuncusu bir promise (textFile(filename)) döndürür ve bu onu gerçek bir eşzamansız adım yapar.

Bu adımların hepsini tek bir `then` callback içinde yapmak da mümkün olurdu, çünkü aslında sadece son adım eşzamansızdır. Ancak sadece bazı eşzamanlı veri dönüşümleri yapan `then` sarmalayıcıları, genellikle bir eşzamansız sonucun işlenmiş bir sürümünü üreten bir promise döndürmek istediğinizde olduğu gibi, kullanışlıdır.

```
function jsonFile(filename) {
  return textFile(filename).then(JSON.parse);
}

jsonFile("package.json").then(console.log);
```

Genel olarak, promise'leri, bir değerin ne zaman geleceği sorusunu kodun görmezden gelmesine izin veren bir cihaz olarak düşünmek faydalıdır. Normal bir değer, ona referans verebilmemiz için aslında var olmalıdır. Promise edilen bir değer, zaten orada olabilecek veya gelecekte bir noktada ortaya çıkabilecek bir değerdir. Promise'lerle tanımlanan hesaplamalar, `then` çağrılarıyla birbirine bağlanarak, girdileri kullanılabilir hale geldikçe eşzamansız olarak yürütülür.

## Arıza

{{index "exception handling"}}

Normal JavaScript hesaplamaları bir istisna fırlatarak başarısız olabilir. Eşzamansız hesaplamalar da genellikle buna benzer bir şeye ihtiyaç duyar. Bir ağ isteği başarısız olabilir, bir dosya mevcut olmayabilir veya eşzamansız hesaplamanın bir parçası olan bazı kodlar bir istisna fırlatabilir.

{{index "callback function", error}}

Eşzamansız programlamanın callback stilindeki en acil sorunlardan biri, hataların doğru şekilde callback'lere bildirilmesini sağlamanın son derece zor olmasıdır.

Yaygın olarak kullanılan bir konvansiyon, callback'in ilk argümanının eylemin başarısız olduğunu belirtmek için kullanılması ve ikincisinin eylemin başarılı olduğunda ürettiği değeri içermesidir.

```
someAsyncFunction((error, value) => {
  if (error) handleError(error);
  else processValue(value);
});
```

Bu tür callback fonksiyonları her zaman bir istisna alıp almadıklarını kontrol etmeli ve neden oldukları herhangi bir sorunun, çağırdıkları fonksiyonlar tarafından fırlatılan istisnalar da dahil olmak üzere, yakalanıp doğru fonksiyona iletildiğinden emin olmalıdır.

{{index "rejecting (a promise)", "resolving (a promise)", "then method"}}

Promises bunu kolaylaştırır. Bir promise ya çözülebilir (eylem başarıyla tamamlandı) ya da reddedilebilir (başarısız oldu). `then` ile kayıtlı çözümleyici fonksiyonlar yalnızca eylem başarılı olduğunda çağrılır ve reddedilmeler, `then` tarafından döndürülen yeni promise'e aktarılır. Bir handler bir istisna fırlattığında, bu otomatik olarak `then` çağrısının ürettiği promise'in reddedilmesine neden olur. Dolayısıyla, eşzamansız eylemler zincirindeki herhangi bir öğe başarısız olursa, tüm zincirin sonucu reddedilmiş olarak işaretlenir ve başarısız olduğu noktadan sonra hiçbir başarı handler'ı çağrılmaz.

{{index "Promise.reject function", "Promise class"}}

Bir promise'i çözmek nasıl bir değer sağlıyorsa, bir promise'i reddetmek de bir değer sağlar, genellikle reddetmenin nedeni olarak adlandırılır. Bir handler fonksiyonundaki bir istisna reddetmeye neden olduğunda, istisna değeri neden olarak kullanılır. Benzer şekilde, bir handler reddedilen bir promise döndürdüğünde, bu reddetme bir sonraki promise'e akar. `Promise.reject` fonksiyonu, yeni, anında reddedilen bir promise oluşturur.

{{index "catch method"}}

Bu tür reddetmeleri açıkça ele almak için, promise'lerin, reddedildiğinde bir handler kaydeden `catch` metodu vardır, tıpkı `then` handler'larının normal çözümlemeyi ele alması gibi. Ayrıca, `then` gibi, orijinal promise'in değeri normal olarak çözüldüğünde ve `catch` handler'ının sonucuna göre çözüldüğünde yeni bir promise döndürür. Eğer bir `catch` handler bir hata fırlatırsa, yeni promise de reddedilir.

{{index "then method"}}

Kısa bir yol olarak, `then` ikinci argüman olarak bir reddetme handler'ını da kabul eder, böylece her iki tür handler'ı tek bir metod çağrısında kurabilirsiniz.

`Promise` constructor'ına geçen bir fonksiyon, resolve fonksiyonunun yanında reddetmek için kullanabileceği ikinci bir argüman alır.

{{index "textFile function"}}

`readTextFile` fonksiyonumuz bir sorunla karşılaştığında, hatayı callback fonksiyonuna ikinci bir argüman olarak iletir. textFile sarmalayıcımız aslında bu argümana bakmalı, böylece bir başarısızlık döndürdüğü promise'in reddedilmesine neden olur.

```{includeCode: true}
function textFile(filename) {
  return new Promise((resolve, reject) => {
    readTextFile(filename, (text, error) => {
      if (error) reject(error);
      else resolve(text);
    });
  });
}
```

`then` ve `catch` çağrılarıyla oluşturulan promise değer zincirleri, bu şekilde eşzamansız değerlerin veya hataların geçtiği bir boru hattı oluşturur. Bu tür zincirler handler'ları kaydederek oluşturulduğundan, her bağlantıda bir başarı handler'ı veya bir reddetme handler'ı (veya her ikisi) bulunur. Sonucun türüne (başarı veya başarısızlık) uymayan handler'lar yok sayılır. Ancak uyum sağlayanlar çağrılır ve sonuçları, sıradaki değerin türünü belirler—bir promise döndürmeyen bir değer döndüğünde başarı, bir istisna fırlattığında reddedilme ve bir promise döndürdüğünde promise'in sonucu.

```{test: no}
new Promise((_, reject) => reject(new Error("Fail")))
  .then(value => console.log("Handler 1:", value))
  .catch(reason => {
    console.log("Caught failure " + reason);
    return "nothing";
  })
  .then(value => console.log("Handler 2:", value));
// → Caught failure Error: Fail
// → Handler 2: nothing
```

lk normal handler fonksiyonu çağrılmaz, çünkü boru hattının o noktasında promise bir reddetme taşır. `catch` handler bu reddetmeyi ele alır ve ikinci handler fonksiyonuna verilen bir değer döndürür.

{{index "uncaught exception", "exception handling"}}

Yakalanmamış bir istisnanın ortam tarafından ele alınması gibi, JavaScript ortamları bir promise reddedilmesinin ele alınmadığını tespit edebilir ve bunu bir hata olarak bildirecektir.

## Carla

{{index "Carla the crow"}}

Berlin'de güneşli bir gün. Eski, hizmet dışı bırakılmış havaalanının pisti bisikletçiler ve patencilerle dolu. Bir çöp konteynerinin yanında, çimenlerin üzerinde, bir grup turistin sandviçlerinden vazgeçirmeye çalışan bir sürü karga gürültülü bir şekilde dolaşıyor.

Kargalardan biri öne çıkıyor—sağ kanadında birkaç beyaz tüy olan büyük, dağınık bir dişi. İnsanları uzun zamandır bu işi yaptığına işaret eden bir beceri ve güvenle kandırıyor. Yaşlı bir adam başka bir karganın maskaralıklarıyla dikkati dağılırken, bu dişi karga rahatça süzülüyor, adamın elindeki yarısı yenmiş çöreği kapıyor ve uzaklaşıyor.

Grubun geri kalanının burada vakit geçirip eğlenmekten mutlu göründüğünün aksine, büyük karga amaçlı görünüyor. Ganimetini taşıyan karga, doğruca hangar binasının çatısına doğru uçuyor ve bir hava deliğinde kayboluyor.

Binanın içinde, tuhaf bir tıklama sesi duyulabiliyor—yumuşak ama ısrarcı. Ses, bitmemiş bir merdivenin çatısının altındaki dar bir alandan geliyor. Karga orada, çalınmış atıştırmalıklarının, yarım düzine akıllı telefonun (bunların birkaç tanesi açık) ve kabloların karmaşası arasında oturuyor. Gagasıyla hızla telefonlardan birinin ekranına tıklıyor. Ekranda kelimeler beliriyor. Eğer daha iyi bilmeseydiniz, yazı yazdığını düşünebilirdiniz.

Bu karga, akranları tarafından “cāāw-krö” olarak bilinir. Ancak bu sesler insan ses tellerine pek uygun olmadığından, ona Carla diyeceğiz.

Carla, biraz tuhaf bir karga. Gençliğinde, insan diline hayrandı ve insanların ne söylediklerini iyice anlayana kadar onları gizlice dinlerdi. Daha sonraki yaşamında, ilgisi insan teknolojisine kaydı ve telefonları çalmaya başladı. Şu anki projesi programlamayı öğrenmek. Gizli laboratuvarında yazdığı metin aslında bir JavaScript kod parçası.

## Zorla Girmek

{{index "Carla the crow"}}

Carla internete bayılıyor. Ne yazık ki, üzerinde çalıştığı telefonun ön ödemeli veri kotası bitmek üzere. Binada bir kablosuz ağ var, ancak erişim için bir kod gerekiyor.

Neyse ki, binadaki kablosuz yönlendiriciler 20 yıllık ve kötü bir şekilde güvenlik sağlanmış. Biraz araştırma yaptıktan sonra, Carla ağın kimlik doğrulama mekanizmasında kullanabileceği bir açık buluyor. Ağa katılırken, cihazın doğru 6 haneli şifreyi göndermesi gerekiyor. Erişim noktası, doğru kod sağlandığında bir başarı mesajı, yanlış kod sağlandığında ise bir hata mesajı ile yanıt veriyor. Ancak, yalnızca kısmi bir kod (örneğin, sadece 3 hane) gönderildiğinde, yanıt bu hanelerin kodun doğru başlangıcı olup olmadığına göre değişiyor—yanlış bir sayı gönderildiğinde hemen bir hata mesajı alıyorsunuz. Doğru sayıları gönderdiğinizde ise erişim noktası daha fazla sayı bekliyor.

Bu, sayıyı tahmin etme sürecini büyük ölçüde hızlandırmayı mümkün kılar. Carla, ilk haneyi bulmak için her sayıyı sırayla deneyebilir ve hemen hata mesajı almayan sayıyı bulabilir. Bir haneyi bulduktan sonra, aynı şekilde ikinci haneyi de bulabilir ve bu şekilde devam ederek tüm şifreyi öğrenebilir.

Bir `joinWifi` fonksiyonuna sahip olduğumuzu varsayalım. Ağ adını ve şifreyi (bir string olarak) verdiğinizde, ağa katılmayı dener ve başarılı olursa çözülür, kimlik doğrulama başarısız olursa reddedilen bir promise döner. İlk olarak, bir promise'yi belirli bir süre sonra otomatik olarak reddedecek şekilde sarmanın bir yoluna ihtiyacımız var, böylece erişim noktası yanıt vermezse hızla ilerleyebiliriz.

```{includeCode: true}
function withTimeout(promise, time) {
  return new Promise((resolve, reject) => {
    promise.then(resolve, reject);
    setTimeout(() => reject("Timed out"), time);
  });
}
```

Bu, bir promise'in yalnızca bir kez çözülebileceği veya reddedilebileceği gerçeğinden yararlanır—argüman olarak verilen promise önce çözülür veya reddedilirse, bu sonuç `withTimeout` tarafından döndürülen promise'nin sonucu olacaktır. Öte yandan, `setTimeout` önce çalışırsa ve promise'yi reddederse, sonraki çözme veya reddetme çağrıları yok sayılır.

Tüm şifreyi bulmak için, her haneyi deneyerek sıradaki haneyi tekrar tekrar aramamız gerekiyor. Kimlik doğrulama başarılı olursa, aradığımız şeyi bulduğumuzu biliriz. Hemen başarısız olursa, o hanenin yanlış olduğunu biliriz ve bir sonraki haneyi denememiz gerekir. İstek zaman aşımına uğrarsa, başka bir doğru haneyi bulduğumuzu ve bir sonraki haneyi ekleyerek devam etmemiz gerektiğini anlarız.

Bir `for` döngüsü içinde bir promise'yi bekleyemediğiniz için, Carla bu süreci yönlendirmek için özyinelemeli bir fonksiyon kullanıyor. Her çağrıda, şimdiye kadar bildiğimiz kodu ve denenecek bir sonraki haneyi alıyor. Olanlara bağlı olarak, bitmiş bir kod döndürebilir veya kodun bir sonraki pozisyonunu kırmaya başlamak ya da başka bir haneyle tekrar denemek için kendini çağırabilir.

```{includeCode: true}
function crackPasscode(networkID) {
  function nextDigit(code, digit) {
    let newCode = code + digit;
    return withTimeout(joinWifi(networkID, newCode), 50)
      .then(() => newCode)
      .catch(failure => {
        if (failure == "Timed out") {
          return nextDigit(newCode, 0);
        } else if (digit < 9) {
          return nextDigit(code, digit + 1);
        } else {
          throw failure;
        }
      });
  }
  return nextDigit("", 0);
}
```

Erişim noktası, kötü kimlik doğrulama isteklerine genellikle yaklaşık 20 milisaniyede yanıt verir, bu yüzden güvenli olmak için bu fonksiyon bir isteğin zaman aşımına uğraması için 50 milisaniye bekler.

```
crackPasscode("HANGAR 2").then(console.log);
// → 555555
```

Carla başını yana eğip iç çeker. Kodun tahmin edilmesi biraz daha zor olsaydı daha tatmin edici olurdu.

## Eşzamansız Fonksiyonlar

{{index "Promise class", recursion}}

Hatta promise'lerle bile, bu tür asenkron kod yazmak can sıkıcıdır. Promise'ler genellikle uzun ve karmaşık görünümlü şekillerde birbirine bağlanmak zorunda kalır. Ve sadece bir döngü oluşturmak için özyinelemeli bir fonksiyon kullanmak zorunda kaldık.

{{index "synchronous programming", "asynchronous programming"}}

Kırma fonksiyonunun aslında yaptığı şey tamamen doğrusaldır—her zaman bir sonraki adıma başlamadan önce önceki adımın tamamlanmasını bekler. Senkron bir programlama modelinde, bunu ifade etmek daha basit olurdu.

{{index "async function", "await keyword"}}

İyi haber şu ki, JavaScript asenkron hesaplamayı tanımlamak için sözde senkron kod yazmanıza izin verir. Bir `async` fonksiyon, bir promise döndüren ve gövdesinde başka promise'leri senkronmuş gibi `await` edebilen bir fonksiyondur.

{{index "findInStorage function"}}

`crackPasscode` fonksiyonunu şöyle yeniden yazabiliriz:

```
async function crackPasscode(networkID) {
  for (let code = "";;) {
    for (let digit = 0;; digit++) {
      let newCode = code + digit;
      try {
        await withTimeout(joinWifi(networkID, newCode), 50);
        return newCode;
      } catch (failure) {
        if (failure == "Timed out") {
          code = newCode;
          break;
        } else if (digit == 9) {
          throw failure;
        }
      }
    }
  }
}
```

Bu sürüm, fonksiyonun çift döngü yapısını daha net bir şekilde gösterir (iç döngü 0'dan 9'a kadar olan rakamları dener, dış döngü ise şifreye rakamlar ekler).

{{index "async function", "return keyword", "exception handling"}}

Bir `async` fonksiyon, `function` anahtar kelimesinin önüne `async` kelimesi eklenerek işaretlenir. Metodlar da adlarının önüne `async` eklenerek `async` yapılabilir. Böyle bir fonksiyon veya metod çağrıldığında, bir promise döner. Fonksiyon bir şey döner dönmez, o promise çözülür. Eğer gövdesi bir istisna fırlatırsa, promise reddedilir.

{{index "await keyword", ["control flow", asynchronous]}}

Bir `async` fonksiyonun içinde, `await` kelimesi bir ifadenin önüne konularak bir promise'in çözülmesini bekler ve ancak o zaman fonksiyonun yürütülmesine devam eder. Promise reddedilirse, `await` noktasında bir istisna ortaya çıkar.

Böyle bir fonksiyon artık, normal bir JavaScript fonksiyonu gibi, başlangıçtan sona kadar tek seferde çalışmaz. Bunun yerine, `await` bulunan herhangi bir noktada dondurulabilir ve daha sonra devam ettirilebilir.

Çoğu asenkron kod için, bu notasyon promise'leri doğrudan kullanmaktan daha kullanışlıdır. Yine de promise'leri anlamanız gerekir, çünkü birçok durumda onlarla doğrudan etkileşime girersiniz. Ancak, promise'leri birbirine bağlarken, `async` fonksiyonları genellikle `then` çağrı zincirlerinden daha hoş yazılır.

## Generator'lar

{{index "async function"}}

Fonksiyonların duraklatılıp yeniden başlatılabilme yeteneği sadece `async` fonksiyonlara özgü değildir. JavaScript'in ayrıca _((generator))_ fonksiyonlar adlı bir özelliği de vardır. Bunlar benzer şekilde çalışır, ancak promise'sızdir.

`function*` ile bir fonksiyon tanımladığınızda (kelimenin yanına bir yıldız işareti koyarak), bu bir generator olur. Bir generator çağırdığınızda, bir ((iterator)) döner ki bu, [Bölüm ?](object) bölümünde gördüğümüz gibidir.

```
function* powers(n) {
  for (let current = n;; current *= n) {
    yield current;
  }
}

for (let power of powers(3)) {
  if (power > 50) break;
  console.log(power);
}
// → 3
// → 9
// → 27
```

{{index "next method", "yield keyword"}}

Başlangıçta, `powers` fonksiyonunu çağırdığınızda, fonksiyon başlangıçta dondurulmuş olur. Iterator üzerinde her `next` çağrıldığında, fonksiyon bir `yield` ifadesine ulaşana kadar çalışır, bu noktada duraklatılır ve elde edilen değer, iterator tarafından üretilen bir sonraki değer olur. Fonksiyon döndüğünde (örnekteki fonksiyon hiç dönmez), iterator tamamlanmış olur.

Iterator'ları generator fonksiyonlar kullanarak yazmak genellikle çok daha kolaydır. `Group` sınıfı için iterator (egzersizden [Bölüm ?](object#group_iterator)) bu generator ile yazılabilir:

{{index "Group class"}}

```
Group.prototype[Symbol.iterator] = function*() {
  for (let i = 0; i < this.members.length; i++) {
    yield this.members[i];
  }
};
```

```{hidden: true, includeCode: true}
class Group {
  constructor() { this.members = []; }
  add(m) { this.members.add(m); }
}
```

{{index [state, in iterator]}}

Artık iterasyon durumunu tutacak bir nesne oluşturmaya gerek yok—generator'lar her yield ettiklerinde yerel durumlarını otomatik olarak kaydederler.

Bu tür `yield` ifadeleri sadece doğrudan generator fonksiyonun kendisinde meydana gelebilir ve içinde tanımladığınız bir iç fonksiyonda olamaz. Bir generator yield ettiğinde kaydettiği durum yalnızca _yerel_ çevresi ve yield ettiği pozisyondur.

{{index "await keyword"}}

Bir `async` fonksiyon, özel bir tür generator'dır. Çağrıldığında bir promise üretir ve bu promise, fonksiyon döndüğünde (tamamlandığında) çözülür ve bir istisna fırlattığında reddedilir. Bir promise yield ettiğinde (await), o promise'in sonucu (değer veya fırlatılan istisna) `await` ifadesinin sonucu olur.

## Corvid Sanat Projesi

{{index "Carla the crow"}}

Bu sabah, Carla hangarının dışındaki asfalt pistten gelen alışılmadık bir gürültüyle uyandı. Çatı kenarına atlayarak insanların bir şeyler kurduğunu görüyor. Çok sayıda elektrik kablosu, bir sahne ve büyük siyah bir duvar inşa ediliyor.

Meraklı bir karga olan Carla, duvarı daha yakından inceliyor. Görünüşe göre bu duvar, kablolarla bağlanmış büyük cam önlü cihazlardan oluşuyor. Cihazların arkasında “LedTec SIG-5030” yazıyor.

Hızlı bir internet araması, bu cihazlar için bir kullanıcı kılavuzu ortaya çıkarıyor. Bu cihazlar, amber LED ışıkların programlanabilir bir matrisi ile trafik işaretleri gibi görünüyor. İnsanların amacı, muhtemelen etkinlikleri sırasında bu ekranlarda bir tür bilgi görüntülemek. İlginç bir şekilde, ekranlar kablosuz bir ağ üzerinden programlanabiliyor. Acaba bunlar binanın yerel ağına mı bağlı?

Bir ağdaki her cihaz bir IP adresi alır, bu adres diğer cihazların ona mesaj göndermesini sağlar. [Bölüm ?](browser) bölümünde bundan daha fazla bahsediyoruz. Carla, kendi telefonlarının `10.0.0.20` veya `10.0.0.33` gibi adresler aldığını fark eder. Bu adreslere mesaj göndermeyi denemek ve herhangi birinin, kılavuzda tarif edilen arabirime yanıt verip vermediğini görmek ilginç olabilir.

[Bölüm ?](<(http)>), gerçek ağlarda gerçek istekler yapmayı gösteriyor. Bu bölümde, ağ iletişimi için `request` adında basitleştirilmiş bir sahte fonksiyon kullanacağız. Bu fonksiyon iki argüman alır—bir ağ adresi ve JSON olarak gönderilebilecek herhangi bir mesaj—ve verilen adresteki makineden bir yanıtla çözülmüş veya bir sorun olduğunda reddedilmiş bir promise döner.

Kılavuza göre, bir SIG-5030 tabelasında görüntülenen içeriği, `{"command": "display", "data": [0, 0, 3, …]}` gibi bir mesaj göndererek değiştirebilirsiniz, burada `data` her LED noktası için bir parlaklık değeri tutar—0 kapalı demektir, 3 maksimum parlaklık demektir. Her tabela 50 ışık genişliğinde ve 30 ışık yüksekliğindedir, bu yüzden bir güncelleme komutu 1500 sayı göndermelidir.

Bu kod, yerel ağdaki tüm adreslere bir ekran güncelleme mesajı gönderir, neyin işe yaradığını görmek için. Bir IP adresindeki sayılar 0'dan 255'e kadar gidebilir. Gönderdiği verilerde, ağ adresinin son numarasına karşılık gelen sayıda ışığı etkinleştirir.

```
for (let addr = 1; addr < 256; addr++) {
  let data = [];
  for (let n = 0; n < 1500; n++) {
    data.push(n < addr ? 3 : 0);
  }
  let ip = `10.0.0.${addr}`;
  request(ip, {command: "display", data})
    .then(() => console.log(`Request to ${ip} accepted`))
    .catch(() => {});
}
```

Çoğu adres var olmayacağı veya bu tür mesajları kabul etmeyeceği için, `catch` çağrısı ağ hatalarının programı çökertmediğinden emin olur. İstekler, makinelerin bazıları yanıt vermediğinde zaman kaybetmemek için diğer isteklerin bitmesini beklemeden hemen gönderilir.

Ağ taramasını başlattıktan sonra, Carla sonucu görmek için tekrar dışarı çıkar. Neşe içinde, tüm ekranların sol üst köşelerinde bir ışık şeridi gösterdiğini fark eder. Evet, yerel ağda _olduklarını_ ve komutları _kabul ettiklerini_ anlar. Hızla her ekranda gösterilen numaraları not eder. 9 ekran vardır, üç yüksekte ve üç genişlikte düzenlenmişlerdir. Aşağıdaki ağ adreslerine sahiptirler:

```{includeCode: true}
const screenAddresses = [
  "10.0.0.44", "10.0.0.45", "10.0.0.41",
  "10.0.0.31", "10.0.0.40", "10.0.0.42",
  "10.0.0.48", "10.0.0.47", "10.0.0.46"
];
```

Bu, her türlü yaramazlık için imkanlar açar. Duvara kocaman harflerle "crows rule, humans drool" (kargalar hükmeder, insanlar salya akar) yazabilir. Ama bu biraz kaba gelir. Bunun yerine, gece boyunca tüm ekranları kaplayan uçan bir karga videosu göstermeyi planlar.

Carla, karga kanat çırpmasını gösteren tekrarlayan bir video oluşturmak için bir buçuk saniyelik uygun bir video klip bulur. Dokuz ekrana (her biri 50 x 30 piksel gösterebilen) sığdırmak için, videoları keser ve yeniden boyutlandırır, böylece 150 x 90 boyutunda, saniyede on görüntü elde eder. Bunlar daha sonra dokuz dikdörtgen kesilerek işlenir, ve videodaki karanlık noktalar (karganın olduğu yerler) parlak ışık olarak gösterilir, ve aydınlık noktalar (karganın olmadığı yerler) karanlık bırakılır, bu da siyah bir arka plana karşı amber renginde uçan bir karga efekti yaratır.

`clipImages` değişkeni, her karenin dokuz set pikselden oluşan bir dizi çerçeveyi tutacak şekilde ayarlanmıştır—her ekran için bir tane—tabelaların beklediği formatta.

Videonun tek bir karesini göstermek için, Carla'nın tüm ekranlara aynı anda bir istek göndermesi gerekir. Ancak aynı zamanda bu isteklerin sonucunu beklemesi de gerekir, hem mevcut kare düzgün bir şekilde gönderilmeden önce bir sonraki kareyi göndermemek için, hem de isteklerin başarısız olup olmadığını fark etmek için.

{{index "Promise.all function"}}

`Promise` statik `all` metoduna sahiptir, bu metot bir dizi promisi, sonuçların bir dizisine çözülmüş tek bir promise dönüştürmek için kullanılabilir. Bu, bazı asenkron işlemlerin aynı anda gerçekleşmesini sağlamak, hepsinin bitmesini beklemek ve sonra sonuçlarıyla bir şeyler yapmak (veya en azından başarısız olmadıklarından emin olmak için beklemek) için uygun bir yol sağlar.

```{includeCode: true}
function displayFrame(frame) {
  return Promise.all(frame.map((data, i) => {
    return request(screenAddresses[i], {
      command: "display",
      data
    });
  }));
}
```

Bu, `frame` içindeki görüntüler üzerinde (bir dizi görüntü verisi dizisi) gezinir ve bir dizi istek promisi oluşturur. Ardından, bunları birleştiren bir promise döner.

Bir videoyu oynatmayı durdurabilmek için, işlem bir sınıf içinde sarılır. Bu sınıf, yalnızca `stop` metodu ile oynatma tekrar durdurulduğunda çözülen bir promise dönen asenkron `play` metoduna sahiptir.

```{includeCode: true}
function wait(time) {
  return new Promise(accept => setTimeout(accept, time));
}

class VideoPlayer {
  constructor(frames, frameTime) {
    this.frames = frames;
    this.frameTime = frameTime;
    this.stopped = true;
  }

  async play() {
    this.stopped = false;
    for (let i = 0; !this.stopped; i++) {
      let nextFrame = wait(this.frameTime);
      await displayFrame(this.frames[i % this.frames.length]);
      await nextFrame;
    }
  }

  stop() {
    this.stopped = true;
  }
}
```

`wait` fonksiyonu, verilen milisaniye miktarından sonra çözülen bir promise içinde `setTimeout` fonksiyonunu sarar. Bu, oynatma hızını kontrol etmek için yararlıdır.

```{startCode: true}
let video = new VideoPlayer(clipImages, 100);
video.play().catch(e => {
  console.log("Playback failed: " + e);
});
setTimeout(() => video.stop(), 15000);
```

Ekran duvarının bir hafta boyunca durduğu her akşam, karanlık olduğunda, üzerinde gizemli bir şekilde devasa bir parlayan turuncu kuş belirir.

## Olay Döngüsü

{{index "asynchronous programming", scheduling, "event loop", timeline}}

Asenkron bir program, genellikle daha sonra çağrılacak geri çağrıları ayarlayan ana betiği çalıştırarak başlar. Bu ana betik ve geri çağrılar, bir parça halinde, kesintisiz olarak tamamlanır. Ancak bunlar arasında program, bir şeyin olmasını bekleyerek boşta kalabilir.

{{index "setTimeout function"}}

Bu yüzden geri çağrılar doğrudan onları zamanlamış olan kod tarafından çağrılmaz. Bir fonksiyon içinden `setTimeout` çağırırsam, geri çağrı fonksiyonu çağrıldığında o fonksiyon zaten dönmüş olur. Ve geri çağrı döndüğünde, kontrolü onu zamanlamış olan fonksiyona geri götürmez.

{{index "Promise class", "catch keyword", "exception handling"}}

Asenkron davranış, kendi başına boş bir fonksiyon ((çağrı yığını)) üzerinde gerçekleşir. Bu promise'lar olamadan eşzamansız kodu yönetmenin zor olmasını sağlayan sebeplerden biridir. Her çağrı yığını genel olarak boş başladığından ötürü, `catch` fonksiyonu bir istisna fırlatıldığında yığında olmayacak.

```
try {
  setTimeout(() => {
    throw new Error("Woosh");
  }, 20);
} catch (e) {
  // This will not run
  console.log("Caught", e);
}
```

{{index thread, queue}}

Zamanlayıcılar veya gelen istekler gibi olaylar ne kadar yakın bir zamanda gerçekleşirse gerçekleşsin, JavaScript ortamı yalnızca bir programı aynı anda çalıştırır. Bu, programınızın _etrafında_ büyük bir döngü olan _olay döngüsü_ olarak düşünebilirsiniz. Bir şey yapılacak bir şey olmadığında, bu döngü durur. Ancak olaylar geldikçe, bunlar bir kuyruğa eklenir ve kodları sırayla yürütülür. Aynı anda iki şey çalışmadığı için, yavaş çalışan kodlar diğer olayların işlenmesini geciktirebilir.

Bu örnek bir zamanlayıcı ayarlar ancak zamanlayıcının amaçlanan zaman noktasından sonra beklerken, zamanlayıcının geç olmasına neden olur.

```
let start = Date.now();
setTimeout(() => {
  console.log("Timeout ran at", Date.now() - start);
}, 20);
while (Date.now() < start + 50) {}
console.log("Wasted time until", Date.now() - start);
// → Wasted time until 50
// → Timeout ran at 55
```

{{index "resolving (a promise)", "rejecting (a promise)", "Promise class"}}

Promise'lar her zaman yeni bir olay olarak çözülür veya reddedilir. Bir promise zaten çözülmüş olsa bile, onu beklemek mevcut betiği bitirdikten sonra gerçekleştirir, hemen değil.

```
Promise.resolve("Done").then(console.log);
console.log("Me first!");
// → Me first!
// → Done
```

Sonraki bölümlerde olay döngüsünde çalışan çeşitli diğer olay türlerini göreceğiz.

## Eşzamansız hatalar

{{index "asynchronous programming", [state, transitions]}}

Programınız senkron olarak, tek seferde çalıştığında, programın kendisinin yaptığı değişiklikler dışında herhangi bir durum değişikliği olmaz. Asenkron programlar için bu farklıdır—diğer kodun çalışabileceği _boşluklar_ olabilir.

Bir örneğe bakalım. Bu, bir dosya dizisindeki her dosyanın boyutunu rapor etmeye çalışan ve hepsini aynı anda okumaya çalışan bir fonksiyondur.

{{index "fileSizes function"}}

```{includeCode: true}
async function fileSizes(files) {
  let list = "";
  await Promise.all(files.map(async fileName => {
    list += fileName + ": " +
      (await textFile(fileName)).length + "\n";
  }));
  return list;
}
```

{{index "async function"}}

`async fileName =>` kısmı, ((ok fonksiyonu))ların önüne `async` koyarak `async` yapılabileceğini gösterir.

{{index "Promise.all function"}}

Kod hemen şüpheli görünmüyor... `async` ok fonksiyonunu isimler dizisine uygular, bir dizi söz oluşturur ve ardından `Promise.all` kullanarak bunların hepsini bekler ve oluşturdukları listeyi döner.

Ama tamamen hatalıdır. Her zaman yalnızca tek bir çıktı satırı dönecek, en uzun sürede okunan dosyayı listeleyecektir.

{{if interactive

```
fileSizes(["plans.txt", "shopping_list.txt"])
  .then(console.log);
```

if}}

Neden böyle olduğunu bulabilir misin?

{{index "+= operator"}}

Sorun `+=` operatöründe yatıyor, bu operatör ifadenin yürütülmeye başladığı zamandaki _mevcut_ `list` değerini alır ve ardından `await` bittiğinde, `list` bağlamasını o değer artı eklenen string olarak ayarlar.

{{index "await keyword"}}

Ancak ifadenin yürütülmeye başladığı zaman ile bittiği zaman arasında asenkron bir boşluk vardır. `map` ifadesi listeye herhangi bir şey eklenmeden önce çalışır, bu nedenle her bir `+=` operatörü boş bir stringden başlar ve depolama işlemi bittiğinde, `list`i satırın boş stringe eklenmesi sonucu olarak ayarlar.

{{index "side effect"}}

Bu, mapped sözlerden satırları döndürerek ve bir bağlamayı değiştirmek yerine `Promise.all` sonucunda `join` çağırarak kolayca önlenebilirdi. Her zamanki gibi, yeni değerler hesaplamak, mevcut değerleri değiştirmekten daha az hata yapma olasılığı taşır.

{{index "fileSizes function"}}

```
async function fileSizes(files) {
  let lines = files.map(async fileName => {
    return fileName + ": " +
      (await textFile(fileName)).length;
  });
  return (await Promise.all(lines)).join("\n");
}
```

Bu tür hataları yapmak kolaydır, özellikle `await` kullanırken, ve kodunuzdaki boşlukların nerede olduğunu bilmelisiniz. JavaScript'in _açık_ asenkronitesinin (geri çağrılar, sözler veya `await` yoluyla) bir avantajı, bu boşlukları fark etmenin nispeten kolay olmasıdır.

## Özet

Asenkron programlama, tüm programı dondurmadan uzun süreli işlemler için beklemeyi ifade etme imkanı sağlar. JavaScript ortamları genellikle bu tür programlamayı, işlemler tamamlandığında çağrılan fonksiyonlar olan geri çağrılar kullanarak uygular. Bir olay döngüsü, bu geri çağrıların uygun olduğunda sırayla çağrılmasını planlar, böylece bunların yürütülmesi örtüşmez.

Asenkron programlama, gelecekte tamamlanabilecek işlemleri temsil eden nesneler olan sözler ve asenkron bir programı senkronmuş gibi yazmanıza izin veren `async` fonksiyonlar sayesinde daha kolay hale gelir.

## Egzersizler

### Sessiz Zamanlar

{{index "quiet times (exercise)", "security camera", "Carla the crow", "async function"}}

Carla'nın laboratuvarının yakınında bir hareket sensörü tarafından etkinleştirilen bir güvenlik kamerası var. Bu kamera ağa bağlı ve aktif olduğunda bir video akışı göndermeye başlar. Keşfedilmek istemediği için Carla, bu tür kablosuz ağ trafiğini fark eden ve dışarıda hareket olduğunda inişindeki bir ışığı açan bir sistem kurdu, böylece ne zaman sessiz kalması gerektiğini biliyor.

{{index "Date class", "Date.now function", timestamp}}

Ayrıca bir süredir kameranın ne zaman etkinleştirildiğini kaydediyor ve bu bilgiyi kullanarak, ortalama bir haftada hangi zamanların sessiz, hangi zamanların yoğun olduğunu görselleştirmek istiyor. Kayıt, her satırda bir zaman damgası numarası (`Date.now()` tarafından döndürülen) tutan dosyalarda saklanır.

```{lang: null}
1695709940692
1695701068331
1695701189163
```

`"camera_logs.txt"` dosyası, günlük dosyalarının bir listesini tutar. Haftanın belirli bir günü için, o günün her saati için, o saatte görülen kamera ağ trafiği gözlemlerinin miktarını tutan 24 sayılık bir dizi döndüren asenkron bir fonksiyon `activityTable(day)` yazın. Günler, `Date.getDay` tarafından kullanılan sisteme göre numaralandırılır, Pazar 0 ve Cumartesi 6'dır.

Kum havuzu tarafından sağlanan `activityGraph` fonksiyonu, bu tür bir tabloyu bir string olarak özetler.

{{index "textFile function"}}

Daha önce tanımlanan `textFile` fonksiyonunu kullanın—bir dosya adı verildiğinde, dosyanın içeriğine çözülen bir söz döner. `new Date(timestamp)` bir `Date` nesnesi oluşturduğunu ve bu nesnenin haftanın günü ve günün saati döndüren `getDay` ve `getHours` metodlarına sahip olduğunu unutmayın.

Hem günlük dosyaları listesi hem de günlük dosyalarının kendileri, her veri parçasını kendi satırında, yeni satır (`"\n"`) karakterleriyle ayrılmış olarak tutar.

{{if interactive

```{test: no}
async function activityTable(day) {
  let logFileList = await textFile("camera_logs.txt");
  // Your code here
}

activityTable(1)
  .then(table => console.log(activityGraph(table)));
```

if}}

{{hint

{{index "quiet times (exercise)", "split method", "textFile function", "Date class"}}

Bu dosyaların içeriğini bir diziye dönüştürmeniz gerekecek. Bunu yapmanın en kolay yolu, `textFile` tarafından üretilen string üzerinde `split` metodunu kullanmaktır. Günlük dosyaları için, bu hala size bir dizi string verecektir, bunları `new Date`'e geçmeden önce sayılara dönüştürmeniz gerekecek.

Tüm zaman noktalarını saatlerin bir tablosuna özetlemek, günün her saati için bir sayı tutan bir tablo (dizi) oluşturarak yapılabilir. Ardından, tüm zaman damgalarını (günlük dosyaları ve her günlük dosyasındaki numaraları) üzerinde dönebilir ve her biri için, doğru günde olmuşsa, gerçekleştiği saati alıp, tablodaki ilgili sayıya bir ekleyebilirsiniz.

{{index "async function", "await keyword", "Promise class"}}

Asenkron fonksiyonların sonucunu kullanmadan önce `await` kullandığınızdan emin olun, aksi takdirde bir string beklerken bir `Promise` ile karşılaşırsınız.

hint}}

### Gerçek Promise'lar

{{index "real promises (exercise)", "Promise class"}}

Önceki alıştırmadan gelen fonksiyonu `async`/`await` olmadan, düz `Promise` metodlarını kullanarak yeniden yazın.

{{if interactive

```{test: no}
function activityTable(day) {
  // Your code here
}

activityTable(6)
  .then(table => console.log(activityGraph(table)));
```

if}}

{{index "async function", "await keyword", performance}}

Bu stilde, `Promise.all` kullanmak, günlük dosyalarının üzerinde bir döngü modellemeye çalışmaktan daha uygun olacaktır. `async` fonksiyonunda, bir döngüde `await` kullanmak daha basittir. Bir dosyanın okunması biraz zaman alırsa, bu iki yaklaşımdan hangisi çalışması en az zaman alır?

{{index "rejecting (a promise)"}}

Dosya listesindeki dosyalardan biri yazım hatası içeriyorsa ve okunması başarısız olursa, bu hata fonksiyonunuzun döndürdüğü `Promise` nesnesinde nasıl son bulur?

{{hint

{{index "real promises (exercise)", "then method", "textFile function", "Promise.all function"}}

Bu fonksiyonu yazmanın en basit yaklaşımı, bir `then` çağrıları zinciri kullanmaktır. İlk söz, günlük dosyalarının listesini okuyarak üretilir. İlk geri çağrı bu listeyi bölebilir ve `textFile`'i üzerinde haritalayarak `Promise.all`'a geçilecek bir dizi söz elde edebilir. `Promise.all` tarafından döndürülen nesneyi dönebilir, böylece onun döndürdüğü şey, bu ilk `then`'in dönüş değerinin sonucu olur.

{{index "asynchronous programming"}}

Artık günlük dosyalarının bir dizisini döndüren bir sözümüz var. Bunun üzerinde tekrar `then` çağırabilir ve zaman damgası sayma mantığını oraya koyabiliriz. Şöyle bir şey:

```{test: no}
function activityTable(day) {
  return textFile("camera_logs.txt").then(files => {
    return Promise.all(files.split("\n").map(textFile));
  }).then(logs => {
    // analyze...
  });
}
```

Veya daha iyi iş planlaması için, her dosyanın analizini `Promise.all` içine koyabilir, böylece diskten gelen ilk dosya geri gelmeden diğer dosyalar gelmeden bile bu iş başlatılabilir.

```{test: no}
function activityTable(day) {
  let table = []; // init...
  return textFile("camera_logs.txt").then(files => {
    return Promise.all(files.split("\n").map(name => {
      return textFile(name).then(log => {
        // analyze...
      });
    }));
  }).then(() => table);
}
```

{{index "await keyword", scheduling}}

Bu, sözlerinizi nasıl yapılandırdığınızın, işin planlanma şeklini gerçekten etkileyebileceğini gösterir. İçinde `await` olan basit bir döngü süreci tamamen doğrusal hale getirir—ilerlemeden önce her dosyanın yüklenmesini bekler. `Promise.all`, kavramsal olarak birden fazla görevin aynı anda çalışmasına, dosyalar hala yüklenirken ilerleme kaydetmelerine izin verir. Bu daha hızlı olabilir, ancak işlerin hangi sırayla gerçekleşeceğini daha az tahmin edilebilir hale getirir. Bu durumda, bir tablodaki sayıları artıracağımız için, bunu güvenli bir şekilde yapmak zor değildir. Diğer tür sorunlar için, bu çok daha zor olabilir.

{{index "rejecting (a promise)", "then method"}}

Listede bir dosya bulunmadığında, `textFile` tarafından döndürülen söz reddedilir. `Promise.all`, verilen sözlerden herhangi biri başarısız olursa reddedildiği için, ilk `then`'e verilen geri çağrının dönüş değeri de reddedilen bir söz olacaktır. Bu, `then` tarafından döndürülen sözün başarısız olmasına neden olur, böylece ikinci `then`'e verilen geri çağrı bile çağrılmaz ve fonksiyondan reddedilen bir söz döner.

hint}}

### Promise.all'ı İnşaa Etmek

{{index "Promise class", "Promise.all function", "building Promise.all (exercise)"}}

Gördüğümüz gibi, bir dizi ((söz)) verildiğinde, `Promise.all`, dizideki tüm sözlerin bitmesini bekleyen bir söz döner. Ardından başarılı olur, sonuç değerlerinin bir dizisini verir. Dizideki bir söz başarısız olursa, `all` tarafından döndürülen söz de, başarısız olan sözden gelen başarısızlık nedeni ile başarısız olur.

Kendi `Promise_all` adlı düzenli bir fonksiyon olarak bunun gibi bir şey uygulayın.

Bir söz başarılı veya başarısız olduktan sonra, tekrar başarılı veya başarısız olamayacağını ve onu çözen fonksiyonlara yapılan sonraki çağrıların yoksayılacağını unutmayın. Bu, sözünüzün başarısızlığını ele alma biçiminizi basitleştirebilir.

{{if interactive

```{test: no}
function Promise_all(promises) {
  return new Promise((resolve, reject) => {
    // Your code here.
  });
}

// Test code.
Promise_all([]).then(array => {
  console.log("This should be []:", array);
});
function soon(val) {
  return new Promise(resolve => {
    setTimeout(() => resolve(val), Math.random() * 500);
  });
}
Promise_all([soon(1), soon(2), soon(3)]).then(array => {
  console.log("This should be [1, 2, 3]:", array);
});
Promise_all([soon(1), Promise.reject("X"), soon(3)])
  .then(array => {
    console.log("We should not get here");
  })
  .catch(error => {
    if (error != "X") {
      console.log("Unexpected failure:", error);
    }
  });
```

if}}

{{hint

{{index "Promise.all function", "Promise class", "then method", "building Promise.all (exercise)"}}

`Promise` yapıcısına geçirilen fonksiyon, verilen dizideki her söz üzerinde `then` çağırmak zorunda kalacaktır. Bir tanesi başarılı olduğunda, iki şeyin olması gerekir. Elde edilen değer, bir sonuç dizisinin doğru konumunda saklanmalı ve bu son bekleyen ((söz)) olup olmadığını kontrol etmeliyiz ve öyleyse kendi sözümüzü bitirmeliyiz.

{{index "counter variable"}}

Bu, giriş dizisinin uzunluğuna göre başlatılan ve her seferinde 1 çıkarılan bir sayaçla yapılabilir. 0'a ulaştığında, işimiz biter. Girdi dizisinin boş olduğu (ve dolayısıyla hiçbir sözün asla çözülmeyeceği) durumu dikkate aldığınızdan emin olun.

Başarısızlığı ele almak biraz düşünmeyi gerektirir, ancak son derece basit olduğu ortaya çıkar. Sadece sarıcı sözün `reject` fonksiyonunu dizi içerisindeki her bir sarılan söze `catch` ya da `then` fonksiyonunun ikici argümanı olarak verin ki böylelikle bu sarılmış sözlerde ortaya çıkan bir hata sarıcı sözün hata fonksiyonunu başlatsın.

hint}}
