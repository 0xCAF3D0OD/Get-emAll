// Petit serveur statique pour la sortie de `expo export -p web` (dossier dist/).
// Résout /lecon/points-forts vers /lecon/[id].html, comme le routeur d'Expo.
import { createServer } from 'node:http';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const root = process.argv[2] ?? 'dist';
const port = Number(process.argv[3] ?? 8081);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ttf': 'font/ttf',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
};

function resoudre(url) {
  const chemin = decodeURIComponent(url.split('?')[0]).replace(/\/$/, '') || '/index';
  for (const c of [chemin, `${chemin}.html`, `${chemin}/index.html`]) {
    const f = join(root, c);
    if (existsSync(f) && statSync(f).isFile()) return f;
  }
  // Segment dynamique : /dossier/valeur → /dossier/[param].html
  const i = chemin.lastIndexOf('/');
  const dossier = join(root, chemin.slice(0, i));
  if (existsSync(dossier)) {
    const dyn = readdirSync(dossier).find((n) => /^\[.+\]\.html$/.test(n));
    if (dyn) return join(dossier, dyn);
  }
  return join(root, '+not-found.html');
}

createServer((req, res) => {
  const f = resoudre(req.url ?? '/');
  res.writeHead(200, { 'content-type': types[extname(f)] ?? 'application/octet-stream' });
  res.end(readFileSync(f));
}).listen(port, () => console.log(`http://localhost:${port}`));
