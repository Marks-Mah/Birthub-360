const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(fullPath));
        } else {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walkDir('src');
for (const file of files) {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('buildBirth Hub 360OutboundIdempotencyKey')) {
        content = content.replace(/buildBirth Hub 360OutboundIdempotencyKey/g, 'buildBirthhub360OutboundIdempotencyKey');
        fs.writeFileSync(file, content);
        console.log('Fixed ' + file);
    }
}
