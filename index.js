import 'dotenv/config';
import wolfjs from 'wolf.js';
const { WOLF } = wolfjs;

const service = new WOLF();

service.on('ready', async () => {
    console.log(`✅ ${service.currentSubscriber.nickname}`);

    console.log("\n=== كود دالة multimedia.upload ===");
    console.log(service.multimedia.upload.toString());

    console.log("\n=== كود دالة multimedia.request ===");
    console.log(service.multimedia.request.toString());

    process.exit(0);
});

service.login(process.env.U_MAIL, process.env.U_PASS);
