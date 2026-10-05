const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_DIR = 'C:\\Github\\Birthub-360';
const OUTPUT_FILE = path.join(PROJECT_DIR, 'BirthHub360_Manual_Completo.html');

// Extrair rotas do App.tsx
function extractRoutes() {
  const appTsPath = path.join(PROJECT_DIR, 'src', 'App.tsx');
  const content = fs.readFileSync(appTsPath, 'utf-8');
  
  const routes = [];
  const routePattern = /<Route\s+path="([^"]+)"\s+element={([^}]+)}\s*\/>/g;
  let match;
  
  while ((match = routePattern.exec(content)) !== null) {
    routes.push({
      path: match[1],
      component: match[2].trim()
    });
  }
  
  return routes;
}

// Extrair ícones usados
function extractIcons() {
  const iconFiles = [];
  const iconFilesPath = path.join(PROJECT_DIR, 'src', 'components', 'ui', 'icons');
  
  if (fs.existsSync(iconFilesPath)) {
    const files = fs.readdirSync(iconFilesPath);
    files.forEach(file => {
      if (file.endsWith('.tsx')) {
        iconFiles.push(file);
      }
    });
  }
  
  return iconFiles;
}

// Extrair componentes UI
function extractUIComponents() {
  const uiPath = path.join(PROJECT_DIR, 'src', 'components', 'ui');
  const components = [];
  
  if (fs.existsSync(uiPath)) {
    const files = fs.readdirSync(uiPath);
    files.forEach(file => {
      if (file.endsWith('.tsx') && !file.includes('.stories.')) {
        components.push(file);
      }
    });
  }
  
  return components;
}

// Extrair tokens de cor do globals.css
function extractColors() {
  const cssPath = path.join(PROJECT_DIR, 'src', 'styles', 'globals.css');
  const content = fs.readFileSync(cssPath, 'utf-8');
  
  const colors = [];
  const colorPattern = /--([a-z0-9-]+):\s*([^;]+);/g;
  let match;
  
  while ((match = colorPattern.exec(content)) !== null) {
    if (match[2].includes('#') || match[2].includes('rgb') || match[2].includes('color-mix')) {
      colors.push({
        name: match[1],
        value: match[2].trim()
      });
    }
  }
  
  return colors;
}

// Extrair informações do tabMeta
function extractTabMeta() {
  const tabMetaPath = path.join(PROJECT_DIR, 'src', 'components', 'layout', 'tabMeta.ts');
  const content = fs.readFileSync(tabMetaPath, 'utf-8');
  
  const tabs = [];
  const tabPattern = /(\w+):\s*{\s*label:\s*'([^']+)',\s*icon:\s*([^,]+),\s*accent:\s*'([^']+)'\s*}/g;
  let match;
  
  while ((match = tabPattern.exec(content)) !== null) {
    tabs.push({
      key: match[1],
      label: match[2],
      icon: match[3],
      accent: match[4]
    });
  }
  
  return tabs;
}

// Gerar HTML
function generateHTML(routes, icons, components, colors, tabs) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BirthHub 360 — Manual Completo da Plataforma</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: #0b132b; color: #f8fafc; line-height: 1.6; }
    .container { max-width: 1400px; margin: 0 auto; padding: 40px; }
    h1 { font-size: 32px; margin-bottom: 40px; color: #00e5ff; }
    h2 { font-size: 24px; margin: 30px 0 20px; color: #3b82f6; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; }
    h3 { font-size: 18px; margin: 20px 0 10px; color: #8b5cf6; }
    .section { margin-bottom: 60px; }
    .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 15px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
    th { background: rgba(0,229,255,0.1); color: #00e5ff; }
    code { background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; font-family: monospace; }
    .color-swatch { display: inline-block; width: 24px; height: 24px; border-radius: 4px; margin-right: 10px; vertical-align: middle; border: 1px solid rgba(255,255,255,0.2); }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; background: rgba(0,229,255,0.2); color: #00e5ff; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
    .stat-card { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; text-align: center; }
    .stat-value { font-size: 32px; font-weight: bold; color: #00e5ff; }
    .stat-label { font-size: 14px; color: rgba(255,255,255,0.6); margin-top: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>BirthHub 360 — Manual Completo da Plataforma</h1>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">${routes.length}</div>
        <div class="stat-label">Rotas</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${icons.length}</div>
        <div class="stat-label">Ícones Customizados</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${components.length}</div>
        <div class="stat-label">Componentes UI</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${colors.length}</div>
        <div class="stat-label">Tokens de Cor</div>
      </div>
    </div>

    <div class="section">
      <h2>📁 Rotas da Aplicação</h2>
      <table>
        <thead>
          <tr>
            <th>Rota</th>
            <th>Componente</th>
          </tr>
        </thead>
        <tbody>
          ${routes.map(r => `
            <tr>
              <td><code>${r.path}</code></td>
              <td><code>${r.component}</code></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>🎨 Design System — Cores</h2>
      <div class="grid">
        ${colors.slice(0, 50).map(c => `
          <div class="card">
            <div class="color-swatch" style="background: ${c.value}"></div>
            <div>
              <strong><code>--${c.name}</code></strong><br>
              <small>${c.value}</small>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="section">
      <h2>🧭 Navegação — Tabs</h2>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Label</th>
            <th>Ícone</th>
            <th>Accent</th>
          </tr>
        </thead>
        <tbody>
          ${tabs.map(t => `
            <tr>
              <td><code>${t.key}</code></td>
              <td>${t.label}</td>
              <td><code>${t.icon}</code></td>
              <td><span class="badge">${t.accent}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>🎯 Ícones Customizados</h2>
      <div class="grid">
        ${icons.map(i => `
          <div class="card">
            <code>${i}</code>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="section">
      <h2>🧩 Componentes UI</h2>
      <div class="grid">
        ${components.map(c => `
          <div class="card">
            <code>${c}</code>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="section">
      <h2>📚 Arquitetura</h2>
      <div class="card">
        <h3>Estrutura de Pastas</h3>
        <ul>
          <li><code>src/features/</code> — Módulos de negócio (CRM, Inteligência, etc)</li>
          <li><code>src/components/ui/</code> — Componentes UI reutilizáveis</li>
          <li><code>src/components/layout/</code> — Layout global (Sidebar, Header)</li>
          <li><code>src/lib/</code> — Utilitários compartilhados</li>
          <li><code>src/styles/</code> — Estilos globais e tokens</li>
        </ul>
      </div>
    </div>

    <div class="section">
      <h2>⚡ Tecnologias</h2>
      <div class="card">
        <ul>
          <li><strong>Framework:</strong> React 19.3.0</li>
          <li><strong>Build:</strong> Vite 6.2.3</li>
          <li><strong>Estilização:</strong> Tailwind CSS 4.1.14</li>
          <li><strong>Router:</strong> React Router DOM 7.18.1</li>
          <li><strong>Estado:</strong> TanStack React Query 5.103.1</li>
          <li><strong>Forms:</strong> React Hook Form 7.88.0</li>
          <li><strong>Animações:</strong> Framer Motion 13.1.1</li>
          <li><strong>Ícones:</strong> Lucide React 1.38.0</li>
          <li><strong>Gráficos:</strong> Recharts 3.10.1</li>
          <li><strong>Database:</strong> Prisma 7.10.0 + PostgreSQL</li>
        </ul>
      </div>
    </div>

    <div class="section">
      <h2>🔄 Animações</h2>
      <div class="card">
        <h3>Tokens de Duração</h3>
        <ul>
          <li><code>--duration-instant:</code> 100ms</li>
          <li><code>--duration-fast:</code> 150ms</li>
          <li><code>--duration-normal:</code> 250ms</li>
          <li><code>--duration-slow:</code> 350ms</li>
          <li><code>--duration-slowest:</code> 500ms</li>
        </ul>
        <h3>Easings</h3>
        <ul>
          <li><code>--ease-standard:</code> cubic-bezier(0.4, 0, 0.2, 1)</li>
          <li><code>--ease-enter:</code> cubic-bezier(0.22, 1, 0.36, 1)</li>
          <li><code>--ease-exit:</code> cubic-bezier(0.4, 0, 1, 1)</li>
          <li><code>--ease-emphasized:</code> cubic-bezier(0.16, 1, 0.3, 1)</li>
        </ul>
      </div>
    </div>

    <div class="section">
      <h2>📝 Metadados</h2>
      <div class="card">
        <p><strong>Data:</strong> ${new Date().toISOString()}</p>
        <p><strong>Projeto:</strong> BirthHub 360</p>
        <p><strong>Versão:</strong> Extraído do código fonte</p>
        <p><strong>Status:</strong> Documentação completa baseada em análise estática do código</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// Executar extração
console.log('Extraindo informações do código...');

const routes = extractRoutes();
const icons = extractIcons();
const components = extractUIComponents();
const colors = extractColors();
const tabs = extractTabMeta();

console.log(`Rotas: ${routes.length}`);
console.log(`Ícones: ${icons.length}`);
console.log(`Componentes: ${components.length}`);
console.log(`Cores: ${colors.length}`);
console.log(`Tabs: ${tabs.length}`);

const html = generateHTML(routes, icons, components, colors, tabs);
fs.writeFileSync(OUTPUT_FILE, html);

console.log(`\nManual gerado: ${OUTPUT_FILE}`);
console.log(`Tamanho: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);
