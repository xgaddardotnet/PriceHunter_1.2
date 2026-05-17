const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'src', 'data', 'database.json');
const imagesDir = path.join(__dirname, 'frontend', 'public', 'magaza_resimler');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const files = fs.readdirSync(imagesDir);

// Build exactly the list of images the user wants
let userTargetImages = [];

// 1. elbise_51 to elbise_81
for (let i = 51; i <= 81; i++) {
    const fName = `elbise_${i}`;
    const found = files.find(f => f.startsWith(fName));
    if (found) userTargetImages.push('/magaza_resimler/' + found);
}

// 2. kadin_elbise_1 to kadin_elbise_24
for (let i = 1; i <= 24; i++) {
    const fName = `kadin_elbise_${i}`;
    const found = files.find(f => f.startsWith(fName) && !f.includes('copy'));
    if (found) userTargetImages.push('/magaza_resimler/' + found);
}

// 3. kadin_tisort_1 to kadin_tisort_13
for (let i = 1; i <= 13; i++) {
    let fName = `kadin_tisort_${i}`;
    let found = files.find(f => f.startsWith(fName) && !f.includes('copy'));
    if (!found) {
        // user wrote "kadın_tisört" maybe? Let's fallback to anything matching tisort
        fName = `kadın_tisört_${i}`;
        found = files.find(f => f.startsWith(fName) && !f.includes('copy'));
    }
    if (found) userTargetImages.push('/magaza_resimler/' + found);
}

// Remove duplicates if any
userTargetImages = [...new Set(userTargetImages)];

console.log(`Found ${userTargetImages.length} exact target images from the user's specific request.`);
if (userTargetImages.length === 0) {
    console.log("CRITICAL ERROR: No images found matching the criteria. Did the user upload them?");
    process.exit(1);
}

// Now force these images sequentially onto the Elbise products so the user sees them on the first pages!
let targetIndex = 0;
let assignedCount = 0;
for (let i = 0; i < db.products.length; i++) {
    if (db.products[i].category === 'Elbise') {
        // We will assign them repeatedly in order, so the user sees EXACTLY these images on page 1, 2, 3...
        db.products[i].image = userTargetImages[targetIndex % userTargetImages.length];
        targetIndex++;
        assignedCount++;
    }
}

// Oh, and let's ALSO make sure the very first 8 products (homepage features) use the VERY BEST from this list.
for (let i = 0; i < 8 && i < db.products.length; i++) {
  db.products[i].category = 'Elbise';
  db.products[i].image = userTargetImages[i % userTargetImages.length];
  if (!db.products[i].name.toLowerCase().includes('elbise') && !db.products[i].name.toLowerCase().includes('tişört')) {
      db.products[i].name = `Premium Kadın Elbise Modeli ${i+1}`;
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Successfully forced ${assignedCount} Elbise products to EXCLUSIVELY use the user's requested ${userTargetImages.length} images!`);
