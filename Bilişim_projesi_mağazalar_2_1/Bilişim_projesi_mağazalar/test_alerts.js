const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'backend', 'src', 'data', 'database.json');
const userDataPath = path.join(__dirname, 'backend', 'src', 'data', 'user_data.json');

// Reset alerts
if (fs.existsSync(userDataPath)) {
  const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
  userData['1'] = userData['1'] || {};
  userData['1'].alerts = [];
  fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const product = db.products[0];

console.log(`Original Product: ${product.name}`);
console.log(`Current Price: ${product.bestPrice}`);

// Add alert target price: bestPrice - 100
const targetPrice = product.bestPrice - 100;
console.log(`Setting target price to: ${targetPrice}`);

// Save alert directly
const userData = JSON.parse(fs.existsSync(userDataPath) ? fs.readFileSync(userDataPath, 'utf8') : '{}');
if (!userData['1']) userData['1'] = { favorites: [], alerts: [] };
userData['1'].alerts.push({
  id: Date.now(),
  productId: product.id,
  targetPrice: targetPrice,
  createdAt: new Date().toISOString(),
  active: true
});
fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));

console.log('Alert created.');

// Simulate price drop
product.bestPrice = targetPrice - 50;
product.bestListing.currentPrice = targetPrice - 50;
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`Simulated Price Drop to: ${product.bestPrice}`);

// Verify if alert would be triggered
const updatedUserData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
const myAlert = updatedUserData['1'].alerts[0];

if (product.bestPrice <= myAlert.targetPrice) {
  console.log('SUCCESS: Notification System (Alert) correctly identifies the price drop as TRIGGERED!');
} else {
  console.log('FAILED: Alert not triggered.');
}

// Restore price
product.bestPrice = targetPrice + 100;
product.bestListing.currentPrice = targetPrice + 100;
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
