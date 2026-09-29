const fs = require('fs');
let chatModel = fs.readFileSync('src/lib/ai/gateway/chat-model.ts', 'utf8');
chatModel = chatModel.replace(/const \{ logAiUsage \} = await import\('\.\.\/usage-log\.js'\);\s*await logAiUsage\(\{[\s\S]*?\}\s*as any\);/g, '// logAiUsage removed');
fs.writeFileSync('src/lib/ai/gateway/chat-model.ts', chatModel);
