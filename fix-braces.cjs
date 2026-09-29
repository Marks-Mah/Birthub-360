const fs = require('fs');

function fixFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/buildBirthhub360OutboundIdempotencyKey\(\s*([a-zA-Z0-9_]+):/g, 'buildBirthhub360OutboundIdempotencyKey({ $1:');
    content = content.replace(/,\);/g, ' });');
    content = content.replace(/company: 'Acme',\s*\);/g, "company: 'Acme' });");
    content = content.replace(/company: 'acme',\s*\);/g, "company: 'acme' });");
    content = content.replace(/company: 'X',\s*\);/g, "company: 'X' });");
    content = content.replace(/company: 'Y',\s*\);/g, "company: 'Y' });");
    content = content.replace(/payload\.name,\s*\);/g, "payload.name });");
    fs.writeFileSync(file, content);
}

fixFile('src/lib/voice-hub/features/prospecting/lib/webhookIdempotency.test.ts');
fixFile('src/lib/voice-hub/features/prospecting/services/voice.service.ts');
