const fs = require('fs');
let chatModel = fs.readFileSync('src/lib/ai/gateway/chat-model.ts', 'utf8');
chatModel = chatModel.replace(/logAiUsage\(\{[\s\S]*?\}\);/g, 'logAiUsage({} as any);');
fs.writeFileSync('src/lib/ai/gateway/chat-model.ts', chatModel);
