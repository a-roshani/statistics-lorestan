# درگاه گروه آمار دانشگاه لرستان

این پروژه یک وب‌سایت استاتیک و بدون نیاز به سرور است و برای GitHub Pages آماده شده است.

## فایل‌هایی که معمولاً باید عوض کنید

- لوگو: `assets/logo-statistics.svg`
- چارت ۴۰۲: `files/chart-402.html`
- چارت ۴۰۴: `files/chart-404.html`
- سرفصل ۴۰۲: `files/syllabus-402.html` یا فایل PDF با تغییر لینک در تنظیمات
- سرفصل ۴۰۴: `files/syllabus-404.html`
- برنامه هفتگی ۴۰۵۱: `files/weekly-4051.html`

## ویرایش کلیدها از داخل سایت

در صفحه اصلی روی «مدیریت صفحه» بزنید. می‌توانید کلید جدید اضافه کنید، کلید موجود را ویرایش یا حذف کنید، متن معرفی و اطلاعات تماس را تغییر دهید.

نکته: چون GitHub Pages یک سایت استاتیک است، ویرایش‌های داخل مرورگر فقط روی همان دستگاه ذخیره می‌شوند. برای انتشار تغییرات برای همه کاربران:

1. در تب «انتشار» روی «دانلود portal-config.js» بزنید.
2. فایل دانلودشده را در مخزن، جایگزین `data/portal-config.js` کنید.
3. Commit کنید؛ GitHub Pages نسخه جدید را منتشر می‌کند.

## انتشار در GitHub Pages

1. در GitHub یک Repository جدید بسازید؛ مثلاً `statistics-lorestan`.
2. تمام محتویات این پوشه را در ریشه Repository قرار دهید؛ یعنی `index.html` باید در ریشه باشد.
3. Commit و Push کنید.
4. در Repository به `Settings` > `Pages` بروید.
5. در بخش Build and deployment گزینه `Deploy from a branch` را انتخاب کنید.
6. Branch را روی `main` و Folder را روی `/ (root)` بگذارید و Save کنید.
7. چند دقیقه بعد لینک سایت نمایش داده می‌شود؛ معمولاً به شکل:
   `https://USERNAME.github.io/statistics-lorestan/`

اگر نام Repository را دقیقاً `USERNAME.github.io` بگذارید، آدرس کوتاه‌تر می‌شود:
`https://USERNAME.github.io/`

## QR Code

بعد از فعال شدن آدرس نهایی GitHub Pages، همان URL را برای ساخت QR استفاده کنید. برای QR دارای لوگوی گروه، بهتر است ابتدا لوگوی نهایی را جایگزین کنید و سپس QR نهایی ساخته شود.
