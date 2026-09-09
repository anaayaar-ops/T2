require('dotenv').config();
const wolfjs = require('wolf.js');

const { WOLF } = wolfjs;

// قراءة البريد وكلمة المرور من ملف .env
const email = process.env.U_MAIL;
const password = process.env.U_PASS;

if (!email || !password) {
    console.error('❌ يرجى تعيين U_MAIL و U_PASS في ملف .env');
    process.exit(1);
}

console.log(`🔐 محاولة تسجيل الدخول بـ ${email}...`);

const service = new WOLF();

// عند نجاح الاتصال
service.on('ready', () => {
    console.log('✅ تم تسجيل الدخول بنجاح!');
    console.log(`👤 اسم المستخدم: ${service.currentSubscriber?.nickname || 'غير معروف'}`);
    
    // محاولة استخراج التوكن من عدة خصائص محتملة
    const token = service.token || service.accessToken || service._token || 
                  service.currentSubscriber?.token || null;
    
    // محاولة استخراج AppCheckToken إن وجد
    const appCheckToken = service.appCheckToken || service._appCheckToken || 
                          service.firebaseToken || null;

    console.log('🔑 التوكن (Token):', token || '⚠️ غير موجود');
    console.log('🔐 AppCheckToken:', appCheckToken || '⚠️ غير موجود');

    // طباعة كامل كائن الخدمة لاستكشاف الأخطاء (اختياري)
    // console.log('📦 كامل كائن الخدمة:', JSON.stringify(service, null, 2));

    // إنهاء البرنامج بعد الطباعة
    process.exit(0);
});

// عند حدوث خطأ
service.on('error', (err) => {
    console.error('❌ خطأ في الاتصال:', err);
    process.exit(1);
});

// بدء محاولة تسجيل الدخول
service.login(email, password);
