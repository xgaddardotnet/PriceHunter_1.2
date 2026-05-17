const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'src', 'data', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// The user wants erkek_elbise_1 and erkek_elbise_8 used EXACTLY ONCE.
// Let's find two random 'Elbise' products (maybe the very last ones so they don't pollute the first page)
let target1, target2;
for (let i = db.products.length - 1; i >= 0; i--) {
    if (db.products[i].category === 'Elbise') {
        if (!target1) target1 = db.products[i];
        else if (!target2) {
            target2 = db.products[i];
            break;
        }
    }
}

if (target1) target1.image = '/magaza_resimler/erkek_elbise_1.jpg';
if (target2) target2.image = '/magaza_resimler/erkek_elbise_8.jpg';

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Successfully assigned erkek_elbise_1 and erkek_elbise_8 exactly ONCE at the end of the database.');
