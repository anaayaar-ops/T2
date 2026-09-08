import 'dotenv/config';
import wolfjs from 'wolf.js';
const { WOLF } = wolfjs;

// ========== التوكن المستخرج من جلسة المتصفح ==========
// ملاحظة: هذا التوكن له صلاحية محدودة، استبدله بآخر جديد عند انتهائه.
const AUTH_TOKEN = 'WE-998d6cbf-5d43-45e8-a2ce-f1cc49289a1c';
// =====================================================

const service = new WOLF();

// ========== حدث جاهزية البوت ==========
service.on('ready', () => {
    console.log('✅ تم تسجيل الدخول بنجاح!');
    console.log(`   الاسم: ${service.currentSubscriber.nickname}`);
    console.log(`   المعرف: ${service.currentSubscriber.id}`);
    console.log('🎯 البوت جاهز للعمل.');
    
    // يمكنك إضافة أي كود تريده هنا بعد تسجيل الدخول
});

// ========== حدث الأخطاء ==========
service.on('error', (err) => {
    console.error('❌ خطأ في الاتصال:', err);
});

// ========== تسجيل الدخول ==========
(async () => {
    try {
        // المعامل الثالث هو التوكن (apiKey)
        await service.login(
            process.env.U_MAIL,   // البريد الإلكتروني من .env
            process.env.U_PASS,   // كلمة المرور من .env
            AUTH_TOKEN            // التوكن المستخرج
        );
        console.log('✅ تم إرسال طلب تسجيل الدخول بالتوكن.');
    } catch (err) {
        console.error('❌ فشل تسجيل الدخول:', err.message || err);
        process.exit(1);
    }
})();
