// Generates the CV PDFs (FR/EN) and the Open Graph images with a local headless
// Chrome or Edge, then copies them into the public/ folder of both sites.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const shared = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(shared, '..');
const out = join(shared, 'dist');
mkdirSync(out, { recursive: true });

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const browser = candidates.find((p) => existsSync(p));
if (!browser) {
  console.error('No Chrome/Edge found. Set CHROME_PATH.');
  process.exit(1);
}

const profileDir = mkdtempSync(join(tmpdir(), 'fa-assets-'));
const run = (args) =>
  execFileSync(browser, ['--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${profileDir}`, ...args], {
    stdio: 'ignore',
    timeout: 60_000,
  });

const files = [];

for (const lang of ['fr', 'en']) {
  const pdf = join(out, `cv-fanilo-andriantenaina-${lang}.pdf`);
  run(['--no-pdf-header-footer', `--print-to-pdf=${pdf}`, pathToFileURL(join(shared, 'cv', `cv-${lang}.html`)).href]);
  files.push(pdf);

  // Same identity as the sites: warm paper, Newsreader headline, IBM Plex, one vermilion rule.
  const text = {
    fr: { headline: 'Je construis des plateformes <em>data en temps réel</em> qui tournent en production.', meta: 'Antananarivo · disponible immédiatement' },
    en: { headline: 'I build <em>real-time data platforms</em> that run in production.', meta: 'Antananarivo · available now' },
  }[lang];
  const font = (pkg, file) => pathToFileURL(join(root, 'node_modules', pkg, 'files', file)).href;
  const html = join(profileDir, `og-${lang}.html`);
  writeFileSync(
    html,
    `<!doctype html><html><head><meta charset="utf-8"><style>
      @font-face{font-family:Display;src:url(${font('@fontsource-variable/bricolage-grotesque', 'bricolage-grotesque-latin-wght-normal.woff2')});font-weight:200 800}
      @font-face{font-family:Plex;src:url(${font('@fontsource-variable/ibm-plex-sans', 'ibm-plex-sans-latin-wght-normal.woff2')});font-weight:100 700}
      @font-face{font-family:PlexMono;src:url(${font('@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff2')})}
      *{margin:0;box-sizing:border-box}
      body{width:1200px;height:630px;background:radial-gradient(70% 60% at 80% 0%,rgba(77,134,255,.28),transparent 70%),#0b1120;color:#e8ecf4;font-family:Plex,sans-serif;padding:72px 84px;display:grid;grid-template-rows:auto 1fr auto}
      .top{display:flex;justify-content:space-between;font:22px PlexMono,monospace;color:#9aa8bf;border-bottom:1px solid rgba(148,163,184,.2);padding-bottom:22px}
      h1{align-self:center;font-family:Display,sans-serif;font-weight:650;font-size:80px;line-height:1.02;letter-spacing:-2.5px;max-width:1000px}
      h1 em{font-style:normal;color:#4d86ff}
      .bottom{display:flex;align-items:center;gap:20px;font-size:30px;font-weight:600}
      .rule{display:grid;place-items:center;width:52px;height:52px;border-radius:12px;background:#4d86ff;color:#06102a;font:500 20px PlexMono,monospace}
    </style></head><body>
      <div class="top"><span>Data &amp; DevOps Engineer</span><span>${text.meta}</span></div>
      <h1>${text.headline}</h1>
      <div class="bottom"><span class="rule">FA</span><span>Fanilo Andriantenaina</span></div>
    </body></html>`,
  );
  const png = join(out, `og-${lang}.png`);
  run(['--hide-scrollbars', '--window-size=1200,630', `--screenshot=${png}`, pathToFileURL(html).href]);
  files.push(png);
}

for (const site of ['pro', 'creative']) {
  const pub = join(root, site, 'public');
  if (!existsSync(join(root, site))) continue;
  mkdirSync(pub, { recursive: true });
  for (const f of files) copyFileSync(f, join(pub, f.split(/[\\/]/).pop()));
}

rmSync(profileDir, { recursive: true, force: true });
console.log(`Generated ${files.length} files with ${browser}`);
