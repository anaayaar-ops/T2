import { WOLF } from 'wolf.js';
import fs from 'fs';
import imageSize from 'image-size';
import { fileTypeFromBuffer } from 'file-type';

const client = new WOLF();

client.config.framework.login.email = process.env.U_MAIL;
client.config.framework.login.password = process.env.U_PASS;

const FILE_PATH = './avatar.gif'; // غيّر المسار لمكان ملفك الفعلي

client.on('ready', async () => {
  console.log('✅ Bot connected successfully\n');

  // 1) اطبع شروط الأفاتار الخاصة بالحساب (subscriber) - مختلفة عن شروط القناة
  const avatarConfig = client._frameworkConfig.get('multimedia.avatar.subscriber');
  console.log('===== شروط أفاتار الحساب (Subscriber) =====');
  console.log(JSON.stringify(avatarConfig, null, 2));
  console.log('');

  if (!fs.existsSync(FILE_PATH)) {
    console.log(`❌ الملف غير موجود: ${FILE_PATH}`);
    return client.logout();
  }

  const buffer = fs.readFileSync(FILE_PATH);
  const { mime } = await fileTypeFromBuffer(buffer);
  const size = imageSize(buffer);
  const fileSizeBytes = Buffer.byteLength(buffer);

  console.log(`🔍 Mime: ${mime} | Dimensions: ${size.width}x${size.height} | Size: ${(fileSizeBytes / 1024 / 1024).toFixed(2)} MB`);

  // فحص سريع قبل الإرسال
  const mimeConfig = avatarConfig.mimes.find((m) => m.type === mime);

  if (!mimeConfig) {
    console.log(`❌ النوع "${mime}" غير مدعوم لأفاتار الحساب`);
    return client.logout();
  }

  if (avatarConfig.square && size.width !== size.height) {
    console.log('❌ الصورة يجب أن تكون مربعة');
    return client.logout();
  }

  if (fileSizeBytes > mimeConfig.size) {
    console.log(`❌ الحجم أكبر من المسموح (${(mimeConfig.size / 1024 / 1024).toFixed(2)} MB)`);
    return client.logout();
  }

  console.log('✅ كل الشروط متحققة، جاري الرفع...\n');

  try {
    const response = await client.update({
      avatar: buffer
    });

    if (response.success) {
      console.log('🎉 تم تحديث صورة الحساب بنجاح!');
      console.log(response.body.avatarUpload);
    } else {
      console.log('❌ فشل التحديث:', response);
    }
  } catch (error) {
    console.error('❌ حصل خطأ أثناء الرفع:', error.message, error);
  }

  client.logout();
});

client.login();
