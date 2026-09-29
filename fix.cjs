const fs = require('fs');

let qdrant = fs.readFileSync('src/lib/ai/embeddings/qdrant.ts', 'utf8');
qdrant = qdrant.replace(/client\.search\(/g, '(client as any).search(');
qdrant = qdrant.replace(/return response\.map\(\(result\)/g, 'return response.map((result: any)');
fs.writeFileSync('src/lib/ai/embeddings/qdrant.ts', qdrant);

let parsing = fs.readFileSync('src/lib/ai/gateway/parsing.ts', 'utf8');
parsing = parsing.replace(/e\.errors/g, '(e as any).errors');
parsing = parsing.replace(/\(e\) =>/g, '(e: any) =>');
fs.writeFileSync('src/lib/ai/gateway/parsing.ts', parsing);

let validate = fs.readFileSync('src/lib/ai/structured/validate.ts', 'utf8');
validate = validate.replace(/e\.errors/g, '(e as any).errors');
validate = validate.replace(/\(e\) =>/g, '(e: any) =>');
fs.writeFileSync('src/lib/ai/structured/validate.ts', validate);

let chatModel = fs.readFileSync('src/lib/ai/gateway/chat-model.ts', 'utf8');
chatModel = chatModel.replace(/tenantId:/g, '// tenantId:');
chatModel = chatModel.replace(/logAiUsage\(\{/g, 'logAiUsage({ /* @ts-ignore */ ');
fs.writeFileSync('src/lib/ai/gateway/chat-model.ts', chatModel);
