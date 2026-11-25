# مدار أمني | Madar Amney (Flask Web Only)

موقع ويب فقط باستخدام **Python Flask** — بدون React وبدون Flutter وبدون تطبيق جوال.

متوافق مع البحث النظري:
- **Central Dashboard (Web)** لغرفة القيادة
- **Mobile Interface** كصفحات ويب للضابط الميداني (من المتصفح)
- تسجيل دخول حسب الدور: Admin / Manager / Officer

## التشغيل

```powershell
git clone https://github.com/a84078373-commits/madarsa.git
cd madar
pip install -r requirements.txt
$env:MADAR_ADMIN_PASSWORD = Read-Host "Choose the Admin password"
$env:MADAR_MANAGER_PASSWORD = Read-Host "Choose the Manager password"
$env:MADAR_OFFICER_PASSWORD = Read-Host "Choose the Officer password"
python run.py
```

محليًا مع كاميرا الجوال استخدم `https://` (الشهادة التجريبية قد تحتاج موافقة في المتصفح).

## النشر على Render (إنترنت — مو لازم نفس الشبكة)

بعد الربط مع المستودع، الموقع يكون على رابط مثل `https://madar-amney.onrender.com`:
- الجوال يفتح نفس الرابط من أي شبكة ويتبث من الكاميرا
- غرفة العمليات تفتح نفس الرابط من أي جهاز

في Render Environment ضع:
- `MADAR_ADMIN_PASSWORD`
- `MADAR_MANAGER_PASSWORD`
- `MADAR_OFFICER_PASSWORD`
- `SECRET_KEY` (ثابت)

أمر التشغيل (موجود في `render.yaml`):
`gunicorn -b 0.0.0.0:$PORT --workers 1 --threads 8 --timeout 120 "run:app"`

ملاحظة: لازم `workers=1` لأن بث الكاميرا يُحفظ في ذاكرة العملية.

## الحسابات

تُنشأ الحسابات عند أول تشغيل بكلمات المرور التي تختارها في متغيرات البيئة أعلاه. لا توجد كلمات مرور افتراضية، ولا تحتاج لإعادة ضبط المتغيرات عند وجود قاعدة بيانات منشأة مسبقًا.

| الدور | البريد | متغير كلمة المرور عند الإنشاء |
|------|--------|-------------|
| Admin | admin@madaramney.sa | `MADAR_ADMIN_PASSWORD` |
| Manager | manager@madaramney.sa | `MADAR_MANAGER_PASSWORD` |
| Officer | officer1@madaramney.sa | `MADAR_OFFICER_PASSWORD` |

تستخدم حسابات الضباط التجريبية الثلاثة كلمة المرور التي تختارها للضباط. تبقى كلمات مرور قاعدة البيانات المحلية الحالية كما هي.

يُولّد مفتاح الجلسات عشوائيًا عند التشغيل. يمكن ضبط متغير البيئة `SECRET_KEY` بقيمة سرية ثابتة خارج المستودع لاستمرار الجلسات بين مرات التشغيل.

قاعدة البيانات والملفات المرفوعة والتقارير الشخصية والملفات المؤقتة مستبعدة من Git. تُنشأ قاعدة بيانات ببيانات تجريبية تلقائيًا عند أول تشغيل. هذا المشروع نموذج محلي للتجربة.

## صفحات الويب

### غرفة القيادة (Admin / Manager)
1. Login
2. لوحة GIS
3. التنبيهات
4. المراقبة المباشرة
5. التواصل المشفّر
6. المهام الميدانية
7. حالة المناطق
8. إدارة المستخدمين (Admin فقط)

### واجهة الميدان (Officer) — ويب فقط
1. الرئيسية
2. البث المباشر
3. الخريطة
4. التنبيهات
5. مهامي
6. التواصل
