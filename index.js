import { WOLF } from 'wolf.js';
import fs from 'fs';
import imageSize from 'image-size';
import { fileTypeFromBuffer } from 'file-type';

const client = new WOLF();

client.config.framework.login.email = process.env.U_MAIL;
client.config.framework.login.password = process.env.U_PASS;

const CHANNEL_ID = 81889058;
const FILE_PATH = './avatar.gif';

client.on('ready', async () => {
  console.log('✅ Bot connected successfully\n');

  const channel = await client.channel.getById(CHANNEL_ID);

  console.log('===== تفاصيل القناة الكاملة =====');
  console.log(`Premium: ${channel.premium}`);
  console.log(`Official: ${channel.official}`);
  console.log(`Verification Tier: ${channel.verificationTier}`);
  console.log(`Capabilities: ${channel.capabilities}`);
  console.log(`Members Count: ${channel.membersCount}`);
  console.log('');

  const buffer = fs.readFileSync(FILE_PATH);
  const { mime } = await fileTypeFromBuffer(buffer);

  console.log('===== محاولة تحديث بدون صورة أولاً (تأكيد إن باقي الصلاحيات شغالة) =====');
  const testResponse = await client.channel.update(CHANNEL_ID, {
    description: channel.description
  });
  console.log('Update (no avatar) result:', testResponse.success, testResponse.code);
  console.log('');

  console.log('===== الآن محاولة رفع الصورة مع طباعة كل التفاصيل =====');
  try {
    const avatarConfig = client._frameworkConfig.get('multimedia.avatar.channel');

    const uploadResponse = await client.multimedia.request(
      avatarConfig,
      {
        data: buffer.toString('base64'),
        mimeType: mime,
        id: parseInt(CHANNEL_ID),
        source: client.currentSubscriber.id
      }
    );

    console.log('Upload response FULL:', JSON.stringify(uploadResponse, null, 2));
  } catch (error) {
    console.log('Upload error FULL:', JSON.stringify(error, null, 2));
    console.log('Error message:', error.message);
  }

  client.logout();
});

client.login();
