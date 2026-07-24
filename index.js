import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    watchSubscriberId: 51660277 // العضوية اللي نراقب خاصها
};

const service = new WOLF();

service.on('ready', () => {
    console.log(`✅ متصل: ${service.currentSubscriber?.nickname ?? '(غير معروف)'}`);
    console.log(`👀 نراقب الخاص من العضوية: ${settings.watchSubscriberId}`);
    console.log('لا يوجد أي رد تلقائي أو تفاعل آخر — مراقبة فقط.\n');
});

service.on('message', async (message) => {
    const senderId = message.sourceSubscriberId ?? message.authorId;

    // نتجاهل أي شي مو خاص، أو خاص من شخص غير المطلوب
    if (message.isGroup) return;
    if (senderId !== settings.watchSubscriberId) return;

    console.log('──────── رسالة خاصة جديدة ────────');
    console.log('الوقت:', new Date().toLocaleString('ar-SA'));
    console.log('من:', senderId);
    console.log('المحتوى الكامل (JSON):');
    console.log(JSON.stringify(message, null, 2));
    console.log('───────────────────────────────────\n');
});

service.on('error', (err) => {
    console.error('❌ خطأ:', err);
});

service.login(settings.identity, settings.secret);
