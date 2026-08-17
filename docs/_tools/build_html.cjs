const fs = require('fs');
const path = require('path');
const { marked } = require('/tmp/sitj-docbuild/node_modules/marked');

const DOCS = '/home/adhinath/JOKI/Sistem-Informasi-Titip-Jual/docs';
const SCREENSHOTS = path.join(DOCS, 'screenshots');

const files = [
  'README.md',
  '01-ringkasan.md',
  '02-arsitektur.md',
  '03-database.md',
  '04-api.md',
  '05-autentikasi-rbac.md',
  '06-instalasi-deploy.md',
  '07-panduan-pengguna.md',
];

function mdToHtml(md) {
  return marked.parse(md);
}

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function convertMermaid(html) {
  return html.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g, (match, code) => {
    return `<pre class="mermaid">${decodeEntities(code)}</pre>`;
  });
}

function inlineImages(html) {
  // Replace screenshots/*.png references with base64 data URIs
  return html.replace(/src="screenshots\/([^"]+\.png)"/g, (match, filename) => {
    const filepath = path.join(SCREENSHOTS, filename);
    if (fs.existsSync(filepath)) {
      const data = fs.readFileSync(filepath).toString('base64');
      return `src="data:image/png;base64,${data}"`;
    }
    return match;
  });
}

let sections = '';
let toc = '';

files.forEach((file, i) => {
  const filepath = path.join(DOCS, file);
  const md = fs.readFileSync(filepath, 'utf-8');
  let html = mdToHtml(md);
  html = convertMermaid(html);
  html = inlineImages(html);
  const id = 'sec-' + file.replace('.md', '');
  sections += `<section id="${id}" class="doc-section">${html}</section>\n<hr class="section-divider">\n`;
});

// Extract h1/h2 from first file for sidebar nav
let navHtml = '';
files.forEach(file => {
  const md = fs.readFileSync(path.join(DOCS, file), 'utf-8');
  const h1 = md.match(/^#\s+(.+)$/m);
  const id = 'sec-' + file.replace('.md', '');
  if (h1) {
    navHtml += `<a href="#${id}" class="nav-item">${h1[1]}</a>`;
  }
});

const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dokumentasi Teknis — SITJ (Sistem Informasi Titip Jual)</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #1a1a1a;
    line-height: 1.7;
    background: #f8f9fa;
  }
  .container {
    display: flex;
    min-height: 100vh;
  }
  /* Sidebar */
  .sidebar {
    width: 280px;
    background: #1e293b;
    color: #e2e8f0;
    padding: 24px 16px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    overflow-y: auto;
    z-index: 10;
  }
  .sidebar h2 {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #94a3b8;
    margin-bottom: 16px;
    padding: 0 8px;
  }
  .nav-item {
    display: block;
    padding: 8px 12px;
    color: #cbd5e1;
    text-decoration: none;
    border-radius: 6px;
    font-size: 14px;
    margin-bottom: 2px;
    transition: background 0.15s;
  }
  .nav-item:hover {
    background: #334155;
    color: #fff;
  }
  .sidebar-footer {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #334155;
    font-size: 12px;
    color: #64748b;
  }
  /* Main content */
  .main {
    margin-left: 280px;
    flex: 1;
    padding: 48px 64px;
    max-width: 960px;
  }
  .doc-section {
    margin-bottom: 48px;
  }
  .section-divider {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 48px 0;
  }
  h1 { font-size: 28px; margin-bottom: 16px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
  h2 { font-size: 22px; margin-top: 32px; margin-bottom: 12px; color: #1e293b; }
  h3 { font-size: 18px; margin-top: 24px; margin-bottom: 8px; color: #334155; }
  h4 { font-size: 16px; margin-top: 20px; margin-bottom: 8px; color: #475569; }
  p { margin-bottom: 12px; font-size: 15px; }
  ul, ol { margin: 12px 0; padding-left: 24px; }
  li { margin-bottom: 6px; font-size: 15px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
  th { background: #f1f5f9; font-weight: 600; text-align: left; padding: 10px 12px; border: 1px solid #e2e8f0; }
  td { padding: 8px 12px; border: 1px solid #e2e8f0; vertical-align: top; }
  tr:nth-child(even) { background: #f8fafc; }
  code {
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    color: #e11d48;
  }
  pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 16px 20px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;
    font-size: 13px;
    line-height: 1.6;
  }
  pre code {
    background: none;
    color: inherit;
    padding: 0;
  }
  .mermaid {
    background: #fff;
    border: 1px solid #e2e8f0;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;
  }
  blockquote {
    border-left: 4px solid #3b82f6;
    padding: 12px 16px;
    background: #eff6ff;
    margin: 16px 0;
    border-radius: 0 6px 6px 0;
    font-size: 14px;
    color: #1e40af;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    margin: 16px 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  em { color: #64748b; font-size: 13px; }
  strong { color: #0f172a; }
  a { color: #2563eb; text-decoration: none; }
  a:hover { text-decoration: underline; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
  /* Print */
  @media print {
    .sidebar { display: none; }
    .main { margin-left: 0; padding: 20px; max-width: 100%; }
    img { max-width: 100%; page-break-inside: avoid; }
    .doc-section { page-break-before: always; }
    pre { background: #f1f5f9; color: #1e293b; }
    blockquote { background: #f8fafc; }
  }
  @media (max-width: 768px) {
    .sidebar { display: none; }
    .main { margin-left: 0; padding: 24px; }
  }
</style>
</head>
<body>
<div class="container">
  <nav class="sidebar">
    <h2>SITJ Docs</h2>
    ${navHtml}
    <div class="sidebar-footer">
      <p>Sistem Informasi Titip Jual</p>
      <p style="margin-top:4px;">v1.0 — Agustus 2026</p>
      <p style="margin-top:8px;"><a href="https://sikons.herlambang.store" style="color:#93c5fd;">sikons.herlambang.store</a></p>
    </div>
  </nav>
  <main class="main">
    ${sections}
  </main>
</div>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });
// Smooth scroll for nav links
document.querySelectorAll('.nav-item').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
</script>
</body>
</html>`;

fs.writeFileSync(path.join(DOCS, 'dokumentasi-sitj.html'), fullHtml);
const sizeMB = (Buffer.byteLength(fullHtml) / 1024 / 1024).toFixed(2);
console.log('Generated: dokumentasi-sitj.html (' + sizeMB + ' MB)');
