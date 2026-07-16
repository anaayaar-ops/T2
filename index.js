import { WOLF } from 'wolf.js';
import fs from 'fs';
import imageSize from 'image-size';
import { fileTypeFromBuffer } from 'file-type';

const client = new WOLF();

client.config.framework.login.email = process.env.U_MAIL;
client.config.framework.login.password = process.env.U_PASS;

const CHANNEL_ID = 81889058;
const FILE_PATH = './avatar.gif'; // غيّر المسار لمكان ملفك الفعلي

client.on('ready', async () => {
  console.log('✅ Bot connected successfully');

  if (!fs.existsSync(FILE_PATH)) {
    console.log(`❌ File not found: ${FILE_PATH}`);
    return client.logout();
  }

  const buffer = fs.readFileSync(FILE_PATH);

  // تحقق سريع قبل الإرسال
  const { mime } = await fileTypeFromBuffer(buffer);
  const size = imageSize(buffer);
  const fileSizeMB = (Buffer.byteLength(buffer) / 1024 / 1024).toFixed(2);

  console.log(`🔍 Mime: ${mime} | Dimensions: ${size.width}x${size.height} | Size: ${fileSizeMB} MB`);

  if (mime !== 'image/gif') {
    console.log('❌ الملف مش GIF فعليًا');
    return client.logout();
  }

  if (size.width !== size.height) {
    console.log('❌ الصورة مش مربعة');
    return client.logout();
  }

  if (Buffer.byteLength(buffer) > 2621440) {
    console.log('❌ الحجم أكبر من المسموح (2.5MB)');
    return client.logout();
  }

  console.log('✅ كل الشروط متحققة، جاري الرفع...');

  try {
    const response = await client.channel.update(CHANNEL_ID, {
      avatar: buffer
    });

    if (response.success) {
      console.log('🎉 تم تحديث صورة القناة بنجاح!');
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
