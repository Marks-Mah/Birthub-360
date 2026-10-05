
const fs = require('fs');
let content = fs.readFileSync('src/features/prospecting/outbound/App.tsx', 'utf8');

if (!content.includes('useAuth')) {
    content = content.replace('import { useState, useEffect } from \'react\';', 'import { useState, useEffect } from \'react\';\nimport { useAuth } from \'../../../contexts/AuthContext.js\';\n');
}

const startIndex = content.indexOf('  // Auth state');
const endIndex = content.indexOf('  // Auth & RBAC (CPI follow-up): a sess');

if (startIndex !== -1 && endIndex !== -1) {
    const newBlock = '  const { currentUser } = useAuth();\n' +
    '  \n' +
    '  const user: User | null = currentUser ? {\n' +
    '    id: currentUser.id,\n' +
    '    email: currentUser.email,\n' +
    '    name: currentUser.name,\n' +
    '    role: currentUser.role === \'ADMIN\' ? \'admin\' : currentUser.role === \'GESTOR\' ? \'gestor\' : \'user\'\n' +
    '  } : null;\n\n' +
    '  const handleLogin = (u: User) => {};\n' +
    '  const handleLogout = () => {};\n\n';
    
    content = content.substring(0, startIndex) + newBlock + content.substring(endIndex);
    fs.writeFileSync('src/features/prospecting/outbound/App.tsx', content);
    console.log('Fixed');
} else {
    console.log('Blocks not found');
}

