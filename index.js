import 'dotenv/config';
import fs from 'fs';
import sharp from 'sharp';
import wolfjs from 'wolf.js';
const { WOLF } = wolfjs;

const service = new WOLF();

const eventNames = [
    "سوالف وافكار", "تحديات", "ساعة تسلية", "شغّل عقلك", "سوالف ونقاشات", "لعب وطرب",
    "خمن الرقم", "سوالف صباحيه", "تحديات خليجنا ذوق", "تحديات ذهنية", "تحدي التخمين",
    "صباحيات خليجنا ذوق", "تصادمات رقمية", "جيبها بالثانيه", "سوالف والعاب", "تحدي سهم",
    "فـ الصحيح", "رتب الحروف", "جلسات حوارية", "منوعات", "تحدي كرة", "سوالف خليجنا ذوق",
    "تحديات منوعة", "تحديات رقمية", "ساعه نقاش", "فقرات منوعة", "أرقام الحظ", "تحدي الزمن",
    "سوالف ليل", "تحدي الأرقام", "تحديات بوتات", "صناديق الحظ"
];

const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes}${ampm}`;
};

service.on('ready', async () => {
    console.log(`✅ تم تسجيل الدخول: ${service.currentSubscriber.nickname}`);

    const targetChannelId = 66266;
    const imagePath = './178332617173751.png';

    if (!fs.existsSync(imagePath)) {
        console.error(`❌ الصورة غير موجودة بالمسار: ${imagePath}`);
        process.exit(1);
    }

    console.log('🔄 جاري تحويل الصورة إلى JPEG...');
    const thumbnailBuffer = await sharp(imagePath)
        .jpeg({ quality: 90 })
        .toBuffer();
    console.log('✅ تم تحويل الصورة بنجاح');

    // 🔍 اجلب كل الفعاليات الموجودة حاليًا بالقناة (يدوية أو تلقائية)
    console.log('🔍 جاري فحص الفعاليات الموجودة بالقناة...');
    const existingEvents = await service.event.group.getList(targetChannelId, false, true);
    console.log(`📋 عدد الفعاليات الموجودة حاليًا: ${existingEvents.length}`);

    let startTime = new Date(2026, 6, 10, 21, 0, 0);
    const successList = [];
    const failList = [];
    const skippedList = [];

    for (let i = 0; i < eventNames.length; i++) {
        const title = eventNames[i];
        const endTime = new Date(startTime.getTime() + 45 * 60000);

        // ✅ فحص التعارض مع أي فعالية موجودة (يدوية أو مبرمجة)
        const isConflicting = existingEvents.some(event => {
            const eStart = new Date(event.startsAt).getTime();
            const eEnd = new Date(event.endsAt).getTime();
            return (startTime.getTime() < eEnd && endTime.getTime() > eStart);
        });

        if (isConflicting) {
            console.log(`⚠️ [${i + 1}/32] تجاوز [${title}]: الوقت ${formatAMPM(startTime)} محجوز مسبقًا.`);
            skippedList.push({ title, time: formatAMPM(startTime) });
            startTime = new Date(endTime.getTime());
            continue; // 👈 يتخطى هذا الوقت وينتقل للفعالية الجاية
        }

        try {
            const result = await service.event.group.create(targetChannelId, {
                title: title,
                startsAt: startTime,
                endsAt: endTime,
                shortDescription: `فعالية ${title}`,
                longDescription: `فعالية ${title} ضمن سلسلة فعاليات خليجنا ذوق.`,
                thumbnail: thumbnailBuffer
            });

            const [eventResponse, imageResponse] = Array.isArray(result) ? result : [result, null];

            if (eventResponse.success) {
                const fTime = formatAMPM(startTime);
                console.log(`🚀 [${i + 1}/32] تم: ${title} | ${fTime} | ID: ${eventResponse.body.id}`);

                if (imageResponse && !imageResponse.success) {
                    console.log(`   ⚠️ لكن الصورة فشلت: ${JSON.stringify(imageResponse)}`);
                }

                // 👇 نضيف الفعالية الجديدة لقائمة existingEvents فورًا
                // عشان الفعاليات الجاية بالـ loop تتفادى التعارض معاها هي كمان
                existingEvents.push({ startsAt: startTime, endsAt: endTime });

                successList.push({ title, id: eventResponse.body.id, time: fTime });
            } else {
                console.log(`❌ [${i + 1}/32] فشل: ${title}`, eventResponse);
                failList.push(title);
            }
        } catch (err) {
            console.error(`❌ [${i + 1}/32] خطأ بـ [${title}]:`, err.message);
            failList.push(title);
        }

        startTime = new Date(endTime.getTime());
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    console.log(`\n🏁 انتهى الرفع.`);
    console.log(`✅ نجح: ${successList.length} / 32`);
    console.log(`⚠️ متجاوز (تعارض): ${skippedList.length}`);
    console.log(`❌ فشل: ${failList.length}`);
    if (skippedList.length > 0) console.log(`الفعاليات المتجاوزة:`, skippedList);
    if (failList.length > 0) console.log(`الفعاليات الفاشلة:`, failList);

    process.exit(0);
});

service.login(process.env.U_MAIL, process.env.U_PASS);
