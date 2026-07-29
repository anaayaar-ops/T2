import { WOLF } from 'wolf.js';
const client = new WOLF();

const CHANNEL_ID = 66266;
const TARGET_MEMBER = "002002";

// دالة مخصصة لعملية الانتظار (بالمللي ثانية)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

client.on('ready', async () => {
    console.log('تم تسجيل الدخول بنجاح وتشغيل البوت!');
    
    // بدء حلقة الأوامر المتكررة مباشرة
    startLoop();
});

async function startLoop() {
    while (true) {
        try {
            console.log('بدء تنفيذ دورة الأوامر الجديدة...');

            // 1. إرسال أمر القصف
            await client.messaging.sendGroupMessage(CHANNEL_ID, '!ط قصف');
            await sleep(2000); // انتظار ثانيتين

            // 2. إرسال أمر الهدية مع العضوية بدون علامات تنصيص
            await client.messaging.sendGroupMessage(CHANNEL_ID, `!ط هدية ${TARGET_MEMBER} 2000`);
            await sleep(2000); // انتظار ثانيتين

            // 3. إرسال أمر الهجوم مع العضوية بدون علامات تنصيص
            await client.messaging.sendGroupMessage(CHANNEL_ID, `!ط هجوم ${TARGET_MEMBER}`);
            await sleep(2000); // انتظار ثانيتين

            // 4. إرسال أمر التحالف
            await client.messaging.sendGroupMessage(CHANNEL_ID, '!ط خزينة ايداع كل');

            console.log('تم الانتهاء من إرسال الأوامر. جاري الانتظار لمدة 6 دقائق...');
            
            // الانتظار لمدة 6 دقائق
            await sleep(6 * 60 * 1000);

        } catch (error) {
            console.error('حدث خطأ أثناء التنفيذ:', error);
            await sleep(10000); // انتظار 10 ثوانٍ قبل إعادة المحاولة في حال حدوث خطأ مفاجئ
        }
    }
}

client.login(process.env.U_MAIL, process.env.U_PASS);
