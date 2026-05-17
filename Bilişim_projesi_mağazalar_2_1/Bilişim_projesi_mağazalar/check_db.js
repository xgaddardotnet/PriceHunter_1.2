const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'src', 'data', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let erkekCounts = {};
for (let p of db.products) {
    if (p.image && p.image.includes('erkek_elbise')) {
        erkekCounts[p.image] = (erkekCounts[p.image] || 0) + 1;
    }
}

console.log('Erkek elbise usage counts:', erkekCounts);
