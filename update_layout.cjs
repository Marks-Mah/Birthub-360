const fs = require('fs');

let content = fs.readFileSync('src/components/layout/MainLayout.tsx', 'utf-8');

if (!content.includes('DataFlowLines')) {
  content = content.replace("import { FloatingDock } from './FloatingDock.js';", "import { FloatingDock } from './FloatingDock.js';\nimport { DataFlowLines } from '../ui/DataFlowLines.js';");
}

const oldHalo = '<div className="absolute -right-48 -top-56 h-[36rem] w-[36rem] rounded-full bg-brand/15 blur-[160px] dark:bg-brand/10 transition-colors duration-1000 animate-pulse-slow" />';
const newHalo = `<div className="absolute -right-48 -top-56 h-[36rem] w-[36rem] rounded-full bg-[#1677FF]/15 blur-[160px] dark:bg-[#1677FF]/10 transition-colors duration-1000 animate-pulse-slow" />
        <div className="absolute -left-48 bottom-0 h-[36rem] w-[36rem] rounded-full bg-[#7C3AED]/10 blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50"><DataFlowLines /></div>`;

content = content.replace(oldHalo, newHalo);

fs.writeFileSync('src/components/layout/MainLayout.tsx', content);
