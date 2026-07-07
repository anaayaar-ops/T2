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
                const lines = content.split('\n');
                lines.forEach((line, i) => {
                    if (line.includes(keyword)) {
                        results.push(`${fullPath}:${i + 1} → ${line.trim()}`);
                    }
                });
            }
        }
    }
    return results;
}

const results = searchFiles('./node_modules/wolf.js/src', 'route:', []);
results.forEach(r => console.log(r));
