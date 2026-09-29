const fs = require('fs');
const glob = require('glob');

let count = 0;

glob.sync('src/**/*.tsx').forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace for div, span, p, article, section, etc. that have onClick but lack onKeyDown
  // We will do a generic replacement for <Tag ... onClick={...} ...>
  // Tag can be div, span, p, li, article, section
  const tags = ['div', 'span', 'p', 'li', 'article', 'section', 'tr', 'td', 'main', 'aside'];
  
  tags.forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*?)\\bonClick=([^>]*?)>`, 'g');
    content = content.replace(regex, (match, before, onClickAttr) => {
      // If it already has onKeyDown or role="button" or tabIndex, skip to avoid messing up
      if (match.includes('onKeyDown=') || match.includes('role=') || match.includes('tabIndex=')) {
        // Wait, if it has tabIndex but no onKeyDown, we should still fix it, but let's be conservative.
        // Actually, let's just add them if they are missing.
      }
      
      let newMatch = match;
      if (!newMatch.includes('role=')) {
        newMatch = newMatch.replace(`onClick=${onClickAttr}`, `role="button" onClick=${onClickAttr}`);
      }
      if (!newMatch.includes('tabIndex=')) {
        newMatch = newMatch.replace(`onClick=${onClickAttr}`, `tabIndex={0} onClick=${onClickAttr}`);
      }
      if (!newMatch.includes('onKeyDown=')) {
        newMatch = newMatch.replace(`onClick=${onClickAttr}`, `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }} onClick=${onClickAttr}`);
      }
      return newMatch;
    });
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
    count++;
  }
});
console.log('Fixed static interactions in ' + count + ' files.');
