import 'dotenv/config';
import fs from 'fs';
import path from 'path';

function searchFiles(dir, keyword, results = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            searchFiles(fullPath, keyword, results);
        } else if (file.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(keyword)) {
                results.push({ file: fullPath, content });
            }
        }
    }
    return results;
}

// نطبع الملف كامل لما يحتوي على multimedia.upload
const matches = searchFiles('./node_modules/wolf.js/src', 'multimedia.upload', []);

console.log(`عدد الملفات اللي فيها multimedia.upload: ${matches.length}\n`);

matches.forEach(m => {
    console.log(`\n========== ${m.file} ==========`);
    console.log(m.content);
});
