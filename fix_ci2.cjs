const fs = require('fs');
let ci = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
ci = ci.split('wget --no-verbose --tries=1 -O - http://localhost:7700/health >/dev/null 2>&1 ').join('wget --no-verbose --tries=1 --spider http://127.0.0.1:7700/health ');
ci = ci.split('wget --no-verbose --tries=1 --spider http://localhost:7700/health ').join('wget --no-verbose --tries=1 --spider http://127.0.0.1:7700/health ');
fs.writeFileSync('.github/workflows/ci.yml', ci);
