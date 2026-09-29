const fs = require('fs');
let qdrant = fs.readFileSync('src/lib/ai/embeddings/qdrant.ts', 'utf8');
qdrant = qdrant.replace(/return response\.map/g, 'return (response as any).map');
fs.writeFileSync('src/lib/ai/embeddings/qdrant.ts', qdrant);
