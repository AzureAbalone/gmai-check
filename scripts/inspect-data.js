const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'products-detail');
const cats = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory()).sort();
let total = 0;
console.log('Category | Count | Img | Dim | Mat | Col | Desc');
console.log('---------|-------|-----|-----|-----|-----|-----');
for (const cat of cats) {
  const files = fs.readdirSync(path.join(dir, cat)).filter(f => f.endsWith('.json'));
  total += files.length;
  const s = JSON.parse(fs.readFileSync(path.join(dir, cat, files[0]), 'utf8'));
  const c = [
    cat,
    files.length,
    s.images?.length > 0 ? 'Y' : 'N',
    s.dimensions ? 'Y' : 'N',
    s.material ? 'Y' : 'N',
    s.colors?.length > 0 ? 'Y' : 'N',
    s.description ? 'Y' : 'N',
  ].join(' | ');
  console.log(c);
}
console.log('\nTotal:', total, 'products,', cats.length, 'categories');
// Show 2 random full samples
const randomCat = cats[Math.floor(Math.random() * cats.length)];
const rFiles = fs.readdirSync(path.join(dir, randomCat)).filter(f => f.endsWith('.json'));
const sample = JSON.parse(fs.readFileSync(path.join(dir, randomCat, rFiles[0]), 'utf8'));
console.log('\n--- Sample from', randomCat, '---');
console.log(JSON.stringify(sample, null, 2));
