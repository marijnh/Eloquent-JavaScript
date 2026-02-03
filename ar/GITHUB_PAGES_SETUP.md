# 🚀 دليل إعداد استضافة GitHub Pages

## الخطوات السريعة (5 دقائق)

### 1. تجهيز المشروع على GitHub

```bash
# أولاً، أنشئ Fork للمشروع الأصلي على GitHub
# اذهب إلى: https://github.com/marijnh/Eloquent-JavaScript
# اضغط على زر "Fork" في الأعلى

# ثم انسخ مشروعك Forked
 git clone https://github.com/YOUR_USERNAME/Eloquent-JavaScript.git
 cd Eloquent-JavaScript

# أو إذا كنت تعمل على المشروع المحلي مباشرة
cd /home/zeyad/projects/Eloquent-JavaScript

# تأكد من إضافة جميع الملفات الجديدة
 git add ar/ .github/workflows/
 git commit -m "إضافة البنية الأساسية للترجمة العربية

- مجلد ar/ للترجمة العربية
- نظام بناء مخصص مع دعم RTL
- معجم مصطلحات تقني
- سير عمل GitHub Actions للنشر التلقائي
- الفصل 00 (المقدمة) مترجم بالكامل"

 git push origin main
```

### 2. تفعيل GitHub Pages

1. اذهب إلى مستودعك على GitHub
2. اضغط على **Settings** ⚙️
3. في القائمة اليسرى، اضغط على **Pages** 📄
4. في قسم **Build and deployment**:
   - **Source**: اختر `GitHub Actions` ✅
5. اضغط **Save**

### 3. انتظر البناء

- سيظهر workflow يعمل في قسم **Actions** 🔧
- انتظر حتى يكتمل (2-3 دقائق)
- ستظهر رسالة "🚀 Your site is ready!"

### 4. زر موقعك! 🌐

```
https://YOUR_USERNAME.github.io/Eloquent-JavaScript/
```

---

## 📋 قائمة مهام بعد الإعداد

### ✅ فوراً
- [ ] اذهب إلى `ar/html/index.html` واكتب اسمك في مكان "[اسمك هنا]"
- [ ] عدّل `ar/README.md` وأضف اسمك كمترجم
- [ ] اختبر الموقع: هل يعمل RTL بشكل صحيح؟
- [ ] هل تعليقات الكود تظهر بالعربية؟

### 📚 الترجمة (فصول الكتاب)
- [ ] ترجمة الفصل 01: القيم، الأنواع، والعوامل
- [ ] ترجمة الفصل 02: بنية البرنامج  
- [ ] ترجمة الفصل 03: الدوال
- [ ] ... (تابع الترجمة)

### 🔄 بعد كل ترجمة
```bash
cd ar
node build.mjs          # بناء الملفات
 git add src/*.md         # إضافة الملفات المترجمة
 git commit -m "ترجمة الفصل X: [اسم الفصل]"
 git push origin main     # GitHub Pages سيتم تحديثه تلقائياً!
```

---

## 🛠️ التخصيص

### تغيير اسم النطاق (Domain)
إذا أردت اسم نطاق مخصص:

1. اشترِ نطاقاً (مثلاً من Namecheap أو GoDaddy)
2. في إعدادات GitHub Pages، أدخل اسم النطاق
3. أضف `CNAME` record يشير إلى `YOUR_USERNAME.github.io`

### إضافة Google Analytics
ضع هذا في `ar/html/index.html` داخل `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## ❌ حل المشاكل الشائعة

### المشكلة: الموقع لا يعمل
**الحل:**
```bash
# تأكد من وجود .nojekyll
touch ar/html/.nojekyll
 git add ar/html/.nojekyll
 git commit -m "Add .nojekyll"
 git push
```

### المشكلة: RTL لا يعمل
**الحل:** تأكد أن ملف `ejs-rtl.css` موجود ومرتبط في HTML:
```html
<link rel="stylesheet" href="css/ejs-rtl.css">
```

### المشكلة: البناء يفشل
**الحل:**
```bash
npm install  # تأكد من تثبيت الحزم
 cd ar
node build.mjs  # جرب البناء محلياً
```

---

## 📞 الحصول على مساعدة

- 💬 فتح Issue في المشروع
- 📧 التواصل معي: [بريدك الإلكتروني]

---

**🎉 مبروك! موقعك جاهز للنشر!**
