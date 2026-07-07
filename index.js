import 'dotenv/config';
import fs from 'fs';
import wolfjs from 'wolf.js';
const { WOLF } = wolfjs;

const service = new WOLF();

service.on('ready', async () => {
    console.log(`✅ تم تسجيل الدخول: ${service.currentSubscriber.nickname}`);

    const targetChannelId = 66266; // قناة "واو"
    const imagePath = './178332617173751.jpeg'; // 👈 اسم الصورة الصحيح

    if (!fs.existsSync(imagePath)) {
        console.error(`❌ الصورة غير موجودة بالمسار: ${imagePath}`);
        process.exit(1);
    }

    const thumbnailBuffer = fs.readFileSync(imagePath);

    const eventTitle = 'واو';
    const startsAt = new Date(2026, 6, 15, 21, 0, 0);
    const endsAt = new Date(startsAt.getTime() + 60 * 60000);
    const shortDescription = 'فعالية واو الجديدة';
    const longDescription = 'وصف تفصيلي أطول عن فعالية واو، تقدر تعدله بالشكل اللي يناسبك.';

    try {
        const result = await service.event.group.create(targetChannelId, {
            title: eventTitle,
            startsAt: startsAt,
            endsAt: endsAt,
            shortDescription: shortDescription,
            longDescription: longDescription,
            thumbnail: thumbnailBuffer
        });

        const [eventResponse, imageResponse] = Array.isArray(result) ? result : [result, null];

        if (eventResponse.success) {
            console.log(`🚀 تم إنشاء الفعالية بنجاح!`);
            console.log(`📌 ID الفعالية: ${eventResponse.body.id}`);
            if (imageResponse) {
                console.log(imageResponse.success
                    ? `🖼️ تم رفع الصورة بنجاح`
                    : `⚠️ الفعالية اتنشأت بس الصورة فشلت: ${JSON.stringify(imageResponse)}`
                );
            }
        } else {
            console.log(`❌ فشل إنشاء الفعالية:`, eventResponse);
        }
    } catch (err) {
        console.error(`❌ خطأ:`, err.message);
    }

    process.exit(0);
});

service.login(process.env.U_MAIL, process.env.U_PASS);
