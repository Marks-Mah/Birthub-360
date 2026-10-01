const fs = require('fs');

let content = fs.readFileSync('src/features/companies/components/CompanyList.tsx', 'utf-8');

// Replace Gold/Brand colors with Blue (#1677FF) for tables
content = content.replace(/accent-brand focus:ring-brand/g, 'accent-[#1677FF] focus:ring-[#1677FF]');
content = content.replace(/bg-soft border border-brand\/30 flex items-center justify-center text-brand/g, 'bg-[#1677FF]/5 border border-[#1677FF]/30 flex items-center justify-center text-[#1677FF]');
content = content.replace(/text-ink hover:text-brand/g, 'text-ink hover:text-[#1677FF]');
content = content.replace(/hover:border-brand\/40 rounded-3xl/g, 'hover:border-[#1677FF]/40 rounded-3xl');
content = content.replace(/hover:text-brand-ink dark:hover:text-brand-2 hover:bg-brand\/10/g, 'hover:text-[#1677FF] hover:bg-[#1677FF]/10');
content = content.replace(/ring-2 ring-brand bg-soft/g, 'ring-2 ring-[#1677FF] bg-[#1677FF]/5');

fs.writeFileSync('src/features/companies/components/CompanyList.tsx', content);

console.log('Tables updated.');
