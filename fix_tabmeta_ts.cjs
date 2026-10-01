const fs = require('fs');
let content = fs.readFileSync('src/components/layout/tabMeta.ts', 'utf-8');
content = content.replace(/icon: typeof Home;/g, 'icon: any;');
fs.writeFileSync('src/components/layout/tabMeta.ts', content);
