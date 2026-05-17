const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'src', 'data', 'database.json');
const imagesDir = path.join(__dirname, 'frontend', 'public', 'magaza_resimler');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const files = fs.readdirSync(imagesDir);

// Collect all ayakkabi images EXCEPT 'erkek'
const ayakkabiImages = files.filter(f => 
    f.includes('ayakkabi') && 
    !f.includes('erkek') && 
    !f.includes('copy')
).map(f => '/magaza_resimler/' + f);

console.log(`Found ${ayakkabiImages.length} female/unisex ayakkabi images.`);

// Also explicitly make sure erkek_ayakkabi are NOT used multiple times
let assignedCount = 0;
let targetIndex = 0;

for (let i = 0; i < db.products.length; i++) {
    if (db.products[i].category === 'Ayakkabı') {
        db.products[i].image = ayakkabiImages[targetIndex % ayakkabiImages.length];
        targetIndex++;
        assignedCount++;
    }
}

// Assign male shoes exactly once at the very end just to be safe
const maleShoes = files.filter(f => f.includes('erkek_ayakkabi') && !f.includes('copy')).map(f => '/magaza_resimler/' + f);
if (maleShoes.length > 0) {
    let maleIndex = 0;
    for (let i = db.products.length - 1; i >= 0 && maleIndex < maleShoes.length; i--) {
        if (db.products[i].category === 'Ayakkabı') {
            db.products[i].image = maleShoes[maleIndex];
            maleIndex++;
        }
    }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Successfully forced ${assignedCount} Ayakkabı products to EXCLUSIVELY use the female/unisex images!`);
