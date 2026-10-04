const fs = require('fs');
let html = fs.readFileSync('raw_login.html', 'utf8');

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const styles = styleMatch ? styleMatch[1] : '';

const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<script>/);
let jsx = bodyMatch ? bodyMatch[1] : '';

jsx = jsx.replace(/class=/g, 'className=');
jsx = jsx.replace(/for=/g, 'htmlFor=');

jsx = jsx.replace(/style="([^"]*)"/g, (match, styleStr) => {
    const rules = styleStr.split(';');
    const jsxStyle = [];
    for (const rule of rules) {
        if (!rule.includes(':')) continue;
        let [k, ...vParts] = rule.split(':');
        k = k.trim();
        let v = vParts.join(':').trim().replace(/'/g, "\\'");
        const kCamel = k.replace(/-([a-z])/g, g => g[1].toUpperCase());
        jsxStyle.push(`${kCamel}: '${v}'`);
    }
    return `style={{ ${jsxStyle.join(', ')} }}`;
});

const svgProps = ['stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule', 'stroke-dasharray', 'stroke-dashoffset', 'stop-color'];
for (const p of svgProps) {
    const camel = p.replace(/-([a-z])/g, g => g[1].toUpperCase());
    jsx = jsx.replace(new RegExp(p + '=', 'g'), camel + '=');
}

// self closing tags
jsx = jsx.replace(/<input([^>]*?)>/g, (m, p1) => {
    if (p1.trim().endsWith('/')) return m;
    return `<input${p1} />`;
});
jsx = jsx.replace(/<img([^>]*?)>/g, (m, p1) => {
    if (p1.trim().endsWith('/')) return m;
    return `<img${p1} />`;
});
jsx = jsx.replace(/<br([^>]*?)>/g, '<br$1 />');
jsx = jsx.replace(/<hr([^>]*?)>/g, '<hr$1 />');

// comments
jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

// onclick
jsx = jsx.replace(/onclick="([^"]*)"/g, 'onClick={() => {$1}}');

const tsxContent = `import React, { useEffect } from "react";
import "./NewLoginScreen.css";

export function NewLoginScreen() {
  useEffect(() => {
    // Scripts go here
  }, []);
  return (
    <>
      ${jsx}
    </>
  );
}
`;

fs.writeFileSync('src/features/auth/components/NewLoginScreen.tsx', tsxContent);
fs.writeFileSync('src/features/auth/components/NewLoginScreen.css', styles);
console.log('Conversion done');
