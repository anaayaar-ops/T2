import 'dotenv/config';
import fs from 'fs';

console.log("=== محتوى helper/event/Event.js ===\n");
console.log(fs.readFileSync('./node_modules/wolf.js/src/helper/event/Event.js', 'utf8'));
