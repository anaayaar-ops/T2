import 'dotenv/config';
import fs from 'fs';
import path from 'path';

function findFiles(dir, keyword, results = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            findFiles(fullPath, keyword, results);
        } else if (file.toLowerCase().includes(keyword.toLowerCase())) {
            results.push(fullPath);
        }
    }
    return results;
}

console.log("=== ملفات فيها كلمة event ===");
console.log(findFiles('./node_modules/wolf.js/src', 'event', []));
