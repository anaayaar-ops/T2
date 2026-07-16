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
  console.log('✅ Bot connected successfully\n');

  // ===== 1) فحص صلاحية الحساب على القناة =====
  const channel = await client.channel.getById(CHANNEL_ID);

  if (!channel.exists) {
    console.log(`❌ القناة ${CHANNEL_ID} غير موجودة أو الحساب مش عضو فيها`);
    return client.logout();
  }

  console.log('===== فحص الصلاحيات =====');
  console.log(`🔍 اسم القناة: ${channel.name}`);
  console.log(`🔍 Owner ID الخاص بالقناة: ${channel.owner.id}`);
  console.log(`🔍 معرف الحساب الحالي (Bot): ${client.currentSubscriber.id}`);
  console.log(`🔍 هل الحساب هو Owner؟: ${channel.isOwner ? 'نعم ✅' : 'لا ❌'}`);
  console.log(`🔍 Capabilities الحالية: ${channel.capabilities}`);
  console.log('');

  // ===== 2) فحص الملف نفسه =====
  console.log('===== فحص الملف =====');

  if (!fs.existsSync(FILE_PATH)) {
    console.log(`❌ الملف غير موجود: ${FILE_PATH}`);
    return client.logout();
  }

  const buffer = fs.readFileSync(FILE_PATH);
  const typeResult = await fileTypeFromBuffer(buffer);

  if (!typeResult) {
    console.log('❌ تعذر التعرف على نوع الملف');
    return client.logout();
  }

  const { mime } = typeResult;
  const size = imageSize(buffer);
  const fileSizeBytes = Buffer.byteLength(buffer);
  const fileSizeMB = (fileSizeBytes / 1024 / 1024).toFixed(2);

  const avatarConfig = client._frameworkConfig.get('multimedia.avatar.channel');
  const mimeConfig = avatarConfig.mimes.find((m) => m.type === mime);

  console.log(`🔍 نوع الملف (mime): ${mime}`);
  console.log(`🔍 الأبعاد: ${size.width}x${size.height}`);
  console.log(`🔍 الحجم: ${fileSizeMB} MB (${fileSizeBytes} بايت)`);
  console.log('');

  const checks = {
    'النوع مدعوم': !!mimeConfig,
    'الشكل مربّع': size.width === size.height,
    'الحجم ضمن الحد المسموح': mimeConfig ? fileSizeBytes <= mimeConfig.size : false,
    'الحساب هو Owner': channel.isOwner
  };

  console.log('===== نتيجة الفحص النهائية =====');
  let allPassed = true;
  for (const [check, passed] of Object.entries(checks)) {
    console.log(`${passed ? '✅' : '❌'} ${check}`);
    if (!passed) allPassed = false;
  }

  console.log('');
  console.log(allPassed
    ? '🎉 كل الشروط متحققة — الملف والصلاحيات جاهزين للرفع.'
    : '⚠️ فيه شرط أو أكتر مش متحقق — لن يتم الرفع.');

  client.logout();
});

client.login();
