import { WOLF } from 'wolf.js';

const client = new WOLF();

// بيانات الدخول من GitHub Secrets
client.config.framework.login.email = process.env.U_MAIL;
client.config.framework.login.password = process.env.U_PASS;

client.on('ready', () => {
  console.log('✅ Bot connected successfully\n');

  const avatarConfig = client._frameworkConfig.get('multimedia.avatar.channel');

  console.log('===== شروط رفع صورة القناة (Channel Avatar) =====\n');

  console.log(`🔲 يجب أن تكون الصورة مربعة (Square): ${avatarConfig.square ? 'نعم' : 'لا'}\n`);

  console.log('📋 الأنواع المسموحة (Mime Types) والحد الأقصى للحجم لكل نوع:\n');

  avatarConfig.mimes.forEach((mimeConfig) => {
    const sizeMB = (mimeConfig.size / 1024 / 1024).toFixed(2);
    console.log(`  • ${mimeConfig.type} → الحد الأقصى: ${mimeConfig.size} بايت (${sizeMB} MB)`);
  });

  console.log('\n===== الإعدادات الكاملة (Raw JSON) =====\n');
  console.log(JSON.stringify(avatarConfig, null, 2));

  client.logout();
});

client.login();
