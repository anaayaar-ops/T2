import { WOLF } from 'wolf.js';
import fs from 'fs';
import { fileTypeFromBuffer } from 'file-type';

const client = new WOLF();

client.config.framework.login.email = process.env.U_MAIL;
client.config.framework.login.password = process.env.U_PASS;

const FILE_PATH = './avatar.gif';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

client.on('ready', async () => {
  console.log('✅ Bot connected successfully\n');

  const buffer = fs.readFileSync(FILE_PATH);

  const MAX_RETRIES = 5;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    attempt++;
    console.log(`🔄 المحاولة رقم ${attempt}...`);

    const response = await client.update({ avatar: buffer });

    if (response.success && response.body?.avatarUpload) {
      const uploadResult = response.body.avatarUpload;

      if (uploadResult.code === 200 || uploadResult.success) {
        console.log('🎉 تم تحديث صورة الحساب بنجاح!');
        console.log(uploadResult);
        break;
      }

      if (uploadResult.code === 429) {
        console.log('⏳ Rate limited (429) — هننتظر 15 ثانية ونعيد المحاولة...');
        await sleep(15000); // 15 ثانية
        continue;
      }

      console.log('❌ فشل برمز غير متوقع:', uploadResult);
      break;
    } else {
      console.log('❌ فشل تحديث البروفايل نفسه:', response);
      break;
    }
  }

  if (attempt >= MAX_RETRIES) {
    console.log('❌ استنفذنا عدد المحاولات المسموح، جرب تاني بعد شوية.');
  }

  client.logout();
});

client.login();
