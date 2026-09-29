const fs = require('fs');
let chatModel = fs.readFileSync('src/lib/ai/gateway/chat-model.ts', 'utf8');
chatModel = chatModel.replace(/const timeoutMs = resolveFallbackTimeoutMs\(\);/g, 'const timeoutMs = resolveFallbackTimeoutMs(); const startTime = Date.now();');
fs.writeFileSync('src/lib/ai/gateway/chat-model.ts', chatModel);
