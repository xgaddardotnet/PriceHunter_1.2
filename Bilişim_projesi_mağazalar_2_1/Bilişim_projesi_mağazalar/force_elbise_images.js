const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'src', 'data', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Find first few elbise products
const elbiseProducts = db.products.filter(p => p.category === 'Elbise');

if (elbiseProducts.length >= 2) {
  // Force specific images
  const target1 = db.products.find(p => p.id === elbiseProducts[0].id);
  const target2 = db.products.find(p => p.id === elbiseProducts[1].id);
  const target3 = db.products.find(p => p.id === elbiseProducts[2].id);
  
  if (target1) target1.image = '/magaza_resimler/elbise_60.jpg';
  if (target2) target2.image = '/magaza_resimler/elbise_70.jpg';
  if (target3) target3.image = '/magaza_resimler/elbise_50.png'; // Example
  
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('Forced elbise_60.jpg and elbise_70.jpg to the first elbise products.');
} else {
  console.log('Not enough elbise products found.');
}
