const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'src', 'data', 'database.json');
const imagesDir = path.join(__dirname, 'frontend', 'public', 'magaza_resimler');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const files = fs.readdirSync(imagesDir);

const elbiseImages = files.filter(f => f.includes('elbise') || f.includes('tisort') || f.includes('tişört'));

const elbiseProducts = db.products.filter(p => p.category === 'Elbise');

console.log(`Total Elbise Products: ${elbiseProducts.length}`);
console.log(`Total Elbise Images: ${elbiseImages.length}`);

console.log('Sample elbise images: ', elbiseImages.slice(0, 10));
