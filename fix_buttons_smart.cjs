const fs = require('fs');
const glob = require('glob');

let fixedCount = 0;

glob.sync('src/**/*.tsx').forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/<button(\s+[^>]*?)?>/g, (match, attrs) => {
    if (!attrs) {
      return '<button type="button">';
    }
    if (/\btype\s*=\s*['"]/.test(attrs)) {
      return match;
    }
    return `<button type="button"${attrs}>`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
    fixedCount++;
  }
});
console.log('Fixed buttons in ' + fixedCount + ' files.');
