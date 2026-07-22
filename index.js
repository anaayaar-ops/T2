import { WOLF } from 'wolf.js';
const client = new WOLF();


const CHANNEL_ID = 66266;
const TARGET_MEMBER = "002002";

// دالة مخصصة لعملية الانتظار (بالمللي ثانية)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

client.on('ready', async () => {
    console.log('تم تسجيل الدخول بنجاح وتشغيل البوت!');
    
    // الدخول إلى القناة المحددة
    await client.channel.join(CHANNEL_ID);
    console.log(`تم الدخول إلى القناة رقم: ${CHANNEL_ID}`);

    // بدء حلقة الأوامر المتكررة
    startLoop();
});

async function startLoop() {
    while (true) {
        try {
            console.log('بدء تنفيذ دورة الأوامر الجديدة...');

            // 1. إرسال أمر القصف
            await client.channel.send(CHANNEL_ID, '!ط قصف');
            await sleep(1000); // انتظار ثانية واحدة

            // 2. إرسال أمر الهدية مع العضوية المحددة
            await client.channel.send(CHANNEL_ID, `!ط هدية "${TARGET_MEMBER}" 2000`);
            await sleep(1000); // انتظار ثانية واحدة

            // 3. إرسال أمر الهجوم مع العضوية المحددة
            await client.channel.send(CHANNEL_ID, `!ط هجوم "${TARGET_MEMBER}"`);
            await sleep(1000); // انتظار ثانية واحدة

            // 4. إرسال أمر التحالف
            await client.channel.send(CHANNEL_ID, '!ط تحالف ايداع كل');

            console.log('تم الانتهاء من إرسال الأوامر. جاري الانتظار لمدة 6 دقائق...');
            
            // الانتظار لمدة 6 دقائق (6 دقائق × 60 ثانية × 1000 مللي ثانية = 360,000)
            await sleep(6 * 60 * 1000);

        } catch (error) {
            console.error('حدث خطأ أثناء التنفيذ:', error);
            await sleep(10000); // انتظار 10 ثوانٍ قبل إعادة المحاولة في حال حدوث خطأ مفاجئ
        }
    }
}

client.login(U_MAIL, U_PASS);
