#!/usr/bin/env node
// Generate API-ready JSON from scraped product detail files.
// Output: ../server/data/products.json

const fs = require('fs');
const path = require('path');

const DETAIL_DIR = path.join(__dirname, 'products-detail');
const OUTPUT_DIR = path.join(__dirname, '..', 'server', 'data');

// Hex → color name (Vietnamese)
const COLOR_MAP = {
  '#FFFFFF': 'Trắng', '#ffffff': 'Trắng',
  '#000000': 'Đen', '#1A1A1A': 'Đen',
  '#FF0000': 'Đỏ', '#ff0000': 'Đỏ',
  '#0000FF': 'Xanh dương',
  '#00FF00': 'Xanh lá',
  '#FFFF00': 'Vàng',
  '#FFA500': 'Cam',
  '#800080': 'Tím',
  '#FFC0CB': 'Hồng',
  '#C0C0C0': 'Bạc',
  '#808080': 'Xám',
  '#A52A2A': 'Nâu',
  '#dfe0e2': 'Xám nhạt',
  '#a98e70': 'Nâu nhạt',
  '#a3dddf': 'Xanh mint',
  '#ddb9b8': 'Hồng nhạt',
  '#a5c4e1': 'Xanh pastel',
};

function hexToName(hex) {
  const lower = hex.toLowerCase();
  // Check exact match first
  for (const [k, v] of Object.entries(COLOR_MAP)) {
    if (k.toLowerCase() === lower) return v;
  }
  // Approximate by hue
  const r = parseInt(lower.slice(1, 3), 16);
  const g = parseInt(lower.slice(3, 5), 16);
  const b = parseInt(lower.slice(5, 7), 16);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2 / 255;
  if (l > 0.9) return 'Trắng';
  if (l < 0.15) return 'Đen';
  if (max - min < 30) return 'Xám';
  if (r > g && r > b) return g > 180 ? 'Vàng' : g > 100 ? 'Cam' : 'Đỏ';
  if (g > r && g > b) return 'Xanh lá';
  if (b > r && b > g) return r > 150 ? 'Tím' : 'Xanh dương';
  return 'Khác';
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Seeded random — deterministic per product id
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// Main
const cats = fs.readdirSync(DETAIL_DIR)
  .filter(f => fs.statSync(path.join(DETAIL_DIR, f)).isDirectory())
  .sort();

const allProducts = [];
let id = 1;

for (const cat of cats) {
  const files = fs.readdirSync(path.join(DETAIL_DIR, cat)).filter(f => f.endsWith('.json'));
  for (const file of files.sort()) {
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(DETAIL_DIR, cat, file), 'utf8'));
      const rng = seededRandom(id * 31 + 7);
      const rating = rng() > 0.3 ? 5 : 4;           // ~70% get 5★, 30% get 4★
      const reviews = Math.floor(rng() * 280) + 12;  // 12–291
      allProducts.push({
        id: id++,
        name: raw.name || file.replace('.json', ''),
        code: raw.code || '',
        category: raw.category || cat,
        image: (raw.images && raw.images[0]) || raw.thumbnail || '',
        images: raw.images || [],
        thumbnail: raw.thumbnail || '',
        badge: raw.badge || null,
        rating,
        reviews,
        colors: (raw.colors || []).map(hex => ({ name: hexToName(hex), hex })),
        dimensions: raw.dimensions || '',
        material: raw.material || '',
        packaging: raw.packaging || '',
        url: raw.url || '',
        // desc/advantages/usage/storage — raw for now
        description: raw.description || '',
      });
    } catch (e) {
      console.log('⚠', cat + '/' + file, e.message);
    }
  }
}

ensureDir(OUTPUT_DIR);
fs.writeFileSync(path.join(OUTPUT_DIR, 'products.json'), JSON.stringify(allProducts, null, 2));

console.log('✅', allProducts.length, 'products →', path.join(OUTPUT_DIR, 'products.json'));
console.log('\nSample (#1):');
console.log(JSON.stringify(allProducts[0], null, 2));
console.log('\nSample (#500):');
console.log(JSON.stringify(allProducts[Math.min(499, allProducts.length - 1)], null, 2));
