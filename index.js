import 'dotenv/config';
import * as wolf from 'wolf.js';

console.log("========================================");
console.log("🔍 تشخيص تسجيل الدخول فقط");
console.log("الوقت:", new Date().toISOString());
console.log("========================================");

// فحص المتغيرات (بدون كشف القيم الحساسة)
console.log("U_MAIL موجود؟", !!process.env.U_MAIL);
console.log("U_PASS موجود؟", !!process.env.U_PASS);

// إنشاء العميل
const client = new wolf.WOLF({
    device: wolf.DeviceType.ANDROID
});
console.log("✅ تم إنشاء العميل");

// التقاط أي أخطاء أو أحداث متعلقة بالاتصال
client.on('error', (err) => {
    console.error("💥 EVENT [error]:", err);
});

client.on('ready', () => {
    console.log("------------------------------------------");
    console.log("✅✅✅ تم تسجيل الدخول بنجاح!");
    console.log("الاسم:", client.currentSubscriber?.nickname || "غير معروف");
    console.log("المعرف:", client.currentSubscriber?.id || "غير معروف");
    console.log("الوقت:", new Date().toISOString());
    console.log("------------------------------------------");
    process.exit(0); // نخرج فوراً لأن الهدف فقط التأكد من الدخول
});

// مهلة زمنية: لو ما صار ready خلال 25 ثانية نعتبرها معلّقة
const timeout = setTimeout(() => {
    console.error("⏱️ فشل: مرت 25 ثانية ولم يحدث تسجيل دخول (لا ready ولا خطأ صريح).");
    console.error("   هذا يدل على أن الاتصال معلّق من جهة السيرفر.");
    process.exit(1);
}, 25000);

// محاولة تسجيل الدخول
console.log("🔐 جاري محاولة تسجيل الدخول...");
try {
    const result = await client.login(process.env.U_MAIL, process.env.U_PASS);
    console.log("🔓 login() انتهى بدون استثناء. الناتج:");
    try {
        console.log(JSON.stringify(result).slice(0, 800));
    } catch {
        console.log(result);
    }
} catch (err) {
    clearTimeout(timeout);
    console.error("❌❌❌ فشل تسجيل الدخول بخطأ صريح:");
    console.error("   الرسالة:", err.message);
    console.error("   الكود:", err.code);
    console.error("   الحالة:", err.status || err.statusCode);
    console.error("   التفاصيل:", err.stack);
    process.exit(1);
}
