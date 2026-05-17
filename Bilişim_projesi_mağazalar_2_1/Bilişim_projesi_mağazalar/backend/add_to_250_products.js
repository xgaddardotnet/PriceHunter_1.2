const fs = require('fs');
const path = require('path');

const dbPath = 'c:/Users/HP/Desktop/Bilişim_projesi_mağazalar_2_1/Bilişim_projesi_mağazalar/backend/src/data/database.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const platforms = {
  amazon: { id: 'amazon', name: 'Amazon', color: '#FF9900', url: 'https://www.amazon.com.tr' },
  trendyol: { id: 'trendyol', name: 'Trendyol', color: '#F27A1A', url: 'https://www.trendyol.com' },
  n11: { id: 'n11', name: 'N11', color: '#7B2FBE', url: 'https://www.n11.com' },
  hepsiburada: { id: 'hepsiburada', name: 'Hepsiburada', color: '#FF6000', url: 'https://www.hepsiburada.com' },
};

function generatePriceHistory(basePrice) {
  const history = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const price = basePrice * (0.8 + Math.random() * 0.4);
    history.push({ date: date.toISOString().split('T')[0], price: Math.round(price) });
  }
  return history;
}

function createProduct(id, category, name, brand, basePrice) {
  const listings = Object.entries(platforms).map(([platformId, platform]) => {
    const history = generatePriceHistory(basePrice);
    const currentPrice = history[history.length - 1].price;
    return {
      platformId,
      platform,
      currentPrice,
      originalPrice: Math.round(currentPrice * 1.2),
      discount: Math.floor(Math.random() * 40),
      inStock: true,
      rating: (4 + Math.random()).toFixed(1),
      reviewCount: Math.floor(Math.random() * 2000),
      seller: `${brand} Yetkili Bayi`,
      url: `${platform.url}/search?q=${encodeURIComponent(name)}`,
      priceHistory: history
    };
  });
  
  const bestListing = listings.reduce((a, b) => a.currentPrice < b.currentPrice ? a : b);
  
  return {
    id,
    category,
    name,
    brand,
    image: `http://localhost:5000/images/selenium_image_${(id % 20) + 1}.jpg`,
    tags: [category.toLowerCase(), brand.toLowerCase(), ...name.toLowerCase().split(' ')],
    basePrice,
    listings,
    bestPrice: bestListing.currentPrice,
    bestPlatform: bestListing.platformId,
    bestListing,
    status: 'LIVE',
    lastChecked: new Date().toISOString()
  };
}

const targetCount = 250;
const currentCount = db.products.length;
const needed = targetCount - currentCount;

if (needed <= 0) {
  console.log(`Already have ${currentCount} products.`);
} else {
  const productDefinitions = [
    { category: 'Akıllı Telefon', brand: 'Xiaomi', names: ['Redmi Note 13 Pro', 'Xiaomi 14 Ultra', 'Poco F6'], price: 20000 },
    { category: 'Laptop', brand: 'HP', names: ['Victus 16 Gaming', 'Pavilion Aero', 'Spectre x360'], price: 28000 },
    { category: 'Kulaklık', brand: 'JBL', names: ['Tune 510BT', 'Live 660NC', 'Quantum 810'], price: 2500 },
    { category: 'Televizyon', brand: 'TCL', names: ['Mini LED 4K TV', 'C845 Series'], price: 30000 },
    { category: 'Aksesuarlar', brand: 'Razer', names: ['DeathAdder V3', 'Huntsman V2', 'BlackShark V2'], price: 4000 },
    { category: 'Ayakkabı', brand: 'Puma', names: ['RS-X Efekt', 'Suede Classic', 'Caven 2.0'], price: 3000 },
    { category: 'Elbise', brand: 'LC Waikiki', names: ['Basic Oduncu Gömlek', 'Slim Fit Kot Pantolon'], price: 600 },
  ];

  let startId = Math.max(...db.products.map(p => p.id)) + 1;
  const newOnes = [];

  for (let i = 0; i < needed; i++) {
    const def = productDefinitions[i % productDefinitions.length];
    const name = def.names[Math.floor(Math.random() * def.names.length)] + ' ' + (Math.floor(i / productDefinitions.length) + 10);
    newOnes.push(createProduct(startId + i, def.category, name, def.brand, def.price * (0.7 + Math.random() * 0.6)));
  }

  db.products = [...db.products, ...newOnes];
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Added ${newOnes.length} products. Total: ${db.products.length}`);
}
