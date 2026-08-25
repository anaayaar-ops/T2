import { WOLF } from 'wolf.js';
const client = new WOLF();

const CHANNEL_ID = 66266;

// دالة الانتظار (بالمللي ثانية)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

client.on('ready', async () => {
    console.log('تم تسجيل الدخول بنجاح وتشغيل البوت!');

    // تشغيل الدورتين بشكل متزامن (بدون انتظار إحداهما للأخرى)
    startShortLoop();  // الدورة القصيرة
    startLongLoop();   // الدورة الطويلة
});

// الدورة القصيرة (كل دقيقتين)
async function startShortLoop() {
    while (true) {
        try {
            console.log('[قصيرة] بدء التنفيذ...');
            await client.messaging.sendGroupMessage(CHANNEL_ID, '!مط ضرب 3');
            await sleep(2000);
            await client.messaging.sendGroupMessage(CHANNEL_ID, '!مط فتح');
            console.log('[قصيرة] تم الإرسال، الانتظار دقيقتين...');
            await sleep(2 * 60 * 1000);
        } catch (error) {
            console.error('[قصيرة] خطأ:', error);
            await sleep(10000);
        }
    }
}

// الدورة الطويلة (كل 61 دقيقة)
async function startLongLoop() {
    while (true) {
        try {
            console.log('[طويلة] بدء التنفيذ...');
            await client.messaging.sendGroupMessage(CHANNEL_ID, '!مط شراء 1');
            await sleep(2000);
            await client.messaging.sendGroupMessage(CHANNEL_ID, '!مط بوست اضافي');
            await sleep(2000);
            await client.messaging.sendGroupMessage(CHANNEL_ID, 'نعم');
            console.log('[طويلة] تم الإرسال، الانتظار 61 دقيقة...');
            await sleep(61 * 60 * 1000);
        } catch (error) {
            console.error('[طويلة] خطأ:', error);
            await sleep(10000);
        }
    }
}

client.login(process.env.U_MAIL, process.env.U_PASS);
