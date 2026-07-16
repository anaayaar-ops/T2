import { WOLF } from 'wolf.js';
import fs from 'fs';
import imageSize from 'image-size';

const client = new WOLF();

client.on('ready', () => {
  console.log('Bot is ready!');

  // اطبع إعدادات الأفاتار الخاصة بالقنوات (الأنواع المسموحة + الحجم الأقصى)
  console.log(client._frameworkConfig.get('multimedia.avatar.channel'));
});

client.login();
