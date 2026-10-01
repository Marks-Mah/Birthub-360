const fs = require('fs');
let content = fs.readFileSync('src/components/brand/PillarIcons.tsx', 'utf-8');

content = content.replace(/React\.SVGProps<SVGSVGElement>/g, "Omit<React.SVGProps<SVGSVGElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'>");

fs.writeFileSync('src/components/brand/PillarIcons.tsx', content);
