import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;
const client = new WOLF();

const TARGET_USER_ID = 80055399;
const CHANNEL_ID = 81889058;

// دالة لتوليد تأخير عشوائي بين 5 و 10 ثواني
const randomDelay = () => {
    const min = 5000; // 5 ثواني
    const max = 10000; // 10 ثواني
    const delay = Math.floor(Math.random() * (max - min + 1) + min);
    return new Promise(resolve => setTimeout(resolve, delay));
};

client.on('groupMessage', async (message) => {
    // التأكد أن الرسالة من المستخدم المحدد وفي الغرفة المحددة
    if (message.sourceSubscriberId != TARGET_USER_ID || message.targetGroupId != CHANNEL_ID) {
        return;
    }

    const content = message.body;

    // البحث عن النمط |--> نص <--|
    const match = content.match(/\|-->\s*(.*?)\s*<--\|/u);

    if (match) {
        const textToReverse = match[1]; 
        const reversedText = textToReverse.split('').reverse().join('');

        // إضافة التأخير العشوائي قبل الإرسال ليبدو طبيعياً
        await randomDelay();

        // إرسال النص المعكوس
        await client.messaging.sendGroupMessage(CHANNEL_ID, reversedText);
        
        console.log(`تم استخراج: ${textToReverse} | تم العكس إلى: ${reversedText} (بعد انتظار عشوائي)`);
    }
});

client.login(process.env.U_MAIL, process.env.U_PASS);
