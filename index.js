import 'dotenv/config';
import wolfjs from 'wolf.js';
const { WOLF } = wolfjs;

const service = new WOLF();

function getAllMethods(obj) {
    let methods = new Set();
    let current = obj;
    while (current) {
        Object.getOwnPropertyNames(current).forEach(name => {
            if (typeof obj[name] === 'function') methods.add(name);
        });
        current = Object.getPrototypeOf(current);
    }
    return [...methods];
}

service.on('ready', async () => {
    console.log(`✅ ${service.currentSubscriber.nickname}`);

    console.log("\n--- دوال multimedia ---");
    console.log(getAllMethods(service.multimedia));

    console.log("\n--- دوال websocket ---");
    console.log(getAllMethods(service.websocket));

    console.log("\n--- دوال group (نفتش عن أي شي فيه event أو image) ---");
    console.log(getAllMethods(service.group).filter(m => 
        m.toLowerCase().includes('event') || m.toLowerCase().includes('image')
    ));

    process.exit(0);
});

service.login(process.env.U_MAIL, process.env.U_PASS);
