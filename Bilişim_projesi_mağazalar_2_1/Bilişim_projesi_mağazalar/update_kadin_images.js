const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'src', 'data', 'database.json');
const imagesDir = path.join(__dirname, 'frontend', 'public', 'magaza_resimler');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const files = fs.readdirSync(imagesDir);

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. Gather all kadin images
const allKadinElbise = files.filter(f => f.includes('kadin_elbise') || f.includes('kadin_tisort') || f.includes('elbise_'));
const allKadinAyakkabi = files.filter(f => f.includes('kadin_ayakkabi') || (f.includes('ayakkabi') && !f.includes('erkek')));

// 2. We'll update the database to use these specifically for the first few hundred products
let elbiseIndex = 0;
let ayakkabiIndex = 0;

const shuffledKadinElbise = shuffleArray(allKadinElbise);
const shuffledKadinAyakkabi = shuffleArray(allKadinAyakkabi);

let updatedElbise = 0;
let updatedAyakkabi = 0;

for (let p of db.products) {
    if (p.category === 'Elbise') {
        if (shuffledKadinElbise.length > 0) {
            p.image = '/magaza_resimler/' + shuffledKadinElbise[elbiseIndex % shuffledKadinElbise.length];
            elbiseIndex++;
            updatedElbise++;
        }
    } else if (p.category === 'Ayakkabı') {
        if (shuffledKadinAyakkabi.length > 0) {
            p.image = '/magaza_resimler/' + shuffledKadinAyakkabi[ayakkabiIndex % shuffledKadinAyakkabi.length];
            ayakkabiIndex++;
            updatedAyakkabi++;
        }
    }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`Successfully mapped ${updatedElbise} Elbise products using ${shuffledKadinElbise.length} kadin/elbise images.`);
console.log(`Successfully mapped ${updatedAyakkabi} Ayakkabı products using ${shuffledKadinAyakkabi.length} kadin/ayakkabi images.`);
