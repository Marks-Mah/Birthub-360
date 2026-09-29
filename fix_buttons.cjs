const fs = require('fs');
const glob = require('glob');
glob.sync('src/**/*.tsx').forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/<button(?!\s+type=)([\s>])/g, '<button type="button"');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log('Updated ' + file);
  }
});
