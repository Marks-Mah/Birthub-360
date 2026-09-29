const fs = require('fs');
let chatModel = fs.readFileSync('src/lib/ai/gateway/chat-model.ts', 'utf8');
chatModel = chatModel.replace(/agentRole: agentContext,\s*\}\);/g, 'agentRole: agentContext, } as any);');
fs.writeFileSync('src/lib/ai/gateway/chat-model.ts', chatModel);
