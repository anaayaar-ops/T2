import pkg from 'wolf.js';
const { WOLF } = pkg;

const CHANNEL_ID = 66266;
const TARGET_MEMBER = 2;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const client = new WOLF();

client.on('ready', async () => {
    console.log('تم تسجيل الدخول بنجاح وتشغيل البوت!');
    await client.channel.join(CHANNEL_ID);
    console.log(`تم الدخول إلى القناة رقم: ${CHANNEL_ID}`);
    startLoop();
});

async function startLoop() {
    while (true) {
        try {
            console.log('بدء تنفيذ دورة الأوامر الجديدة...');
            await client.channel.send(CHANNEL_ID, '!ط قصف');
            await sleep(1000);
            await client.channel.send(CHANNEL_ID, `!ط هدية "${TARGET_MEMBER}" 2000`);
            await sleep(1000);
            await client.channel.send(CHANNEL_ID, `!ط هجوم "${TARGET_MEMBER}"`);
            await sleep(1000);
            await client.channel.send(CHANNEL_ID, '!ط خزينة ايداع كل');

            console.log('تم الانتهاء من إرسال الأوامر. جاري الانتظار لمدة 6 دقائق...');
            await sleep(6 * 60 * 1000);

        } catch (error) {
            console.error('حدث خطأ أثناء التنفيذ:', error);
            await sleep(10000); 
        }
    }
}

client.login(process.env.U_MAIL, process.env.U_PASS);
