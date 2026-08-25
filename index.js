import { WOLF } from 'wolf.js';
const client = new WOLF();

const CHANNEL_ID = 66266;

// دالة الانتظار (بالمللي ثانية)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

client.on('ready', async () => {
    console.log('تم تسجيل الدخول بنجاح وتشغيل البوت!');
    startLoop();
});

async function startLoop() {
    while (true) {
        try {
            console.log('بدء تنفيذ دورة الأوامر الجديدة...');

            // 1. إرسال أمر "!مط ضرب 3"
            await client.messaging.sendGroupMessage(CHANNEL_ID, '!مط ضرب 3');
            await sleep(2000); // انتظار ثانيتين

            // 2. إرسال أمر "!مط فتح"
            await client.messaging.sendGroupMessage(CHANNEL_ID, '!مط فتح');

            console.log('تم الانتهاء من إرسال الأوامر. جاري الانتظار لمدة دقيقتين...');

            // الانتظار لمدة دقيقتين (120 ثانية) قبل التكرار
            await sleep(2 * 60 * 1000);

        } catch (error) {
            console.error('حدث خطأ أثناء التنفيذ:', error);
            await sleep(10000); // انتظار 10 ثوانٍ في حال حدوث خطأ
        }
    }
}

client.login(process.env.U_MAIL, process.env.U_PASS);
