const fs = require('fs');
let content = fs.readFileSync('src/features/chatbook/components/FloatingChatbook.tsx', 'utf-8');

if (!content.includes('AiReasoningVisualizer')) {
  content = content.replace("import { Button } from '../../../components/ui/Button.js';", "import { Button } from '../../../components/ui/Button.js';\nimport { AiReasoningVisualizer } from '../../../components/ui/AiReasoningVisualizer.js';");
}

const oldLoaderRegex = /<div className="flex items-center gap-2 text-xs text-brand-ink dark:text-brand bg-surface-2 p-3 rounded-2xl border border-line w-fit animate-pulse">[\s\S]*?<\/div>/;

content = content.replace(oldLoaderRegex, '<AiReasoningVisualizer />');

fs.writeFileSync('src/features/chatbook/components/FloatingChatbook.tsx', content);
console.log('Loader replaced.');
