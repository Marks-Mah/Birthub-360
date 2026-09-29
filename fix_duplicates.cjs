const fs = require('fs');
const glob = require('glob');
glob.sync('src/**/*.tsx').forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/(\s*type="button"\s*)+/g, '\n  type="button"\n');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log('Fixed duplicates in ' + file);
  }
});
