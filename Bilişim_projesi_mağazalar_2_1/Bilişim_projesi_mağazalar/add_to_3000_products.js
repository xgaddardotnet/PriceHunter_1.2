const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'src', 'data', 'database.json');
console.log('Target path:', dbPath);

if (!fs.existsSync(dbPath)) {
  console.error('Database file not found at:', dbPath);
  process.exit(1);
}

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

function createProduct(id, category, name, brand, basePrice, image) {
  const listings = Object.entries(platforms).map(([platformId, platform]) => {
    const history = generatePriceHistory(basePrice);
    const currentPrice = history[history.length - 1].price;
    return {
      platformId,
      platform,
      currentPrice,
      originalPrice: Math.round(currentPrice * (1.1 + Math.random() * 0.3)),
      discount: Math.floor(Math.random() * 50),
      inStock: true,
      rating: (4.0 + Math.random() * 1.0).toFixed(1),
      reviewCount: Math.floor(Math.random() * 10000),
      seller: `${brand} Resmi Mağaza`,
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
    image: `/magaza_resimler/${image}`,
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

const targetCount = 3000;
let currentCount = db.products.length;
console.log('Current count:', currentCount);

const categories = [
  { category: 'Akıllı Telefon', brands: ['Xiaomi', 'Oppo', 'Realme', 'Vivo'], names: ['Redmi Note 13', 'Reno 11', 'Realme GT', 'V29'], price: 15000, images: ['akilli_telefon_9.jpg', 'akilli_telefon_10.jpg', 'akilli_telefon_11.jpg', 'akilli_telefon_12.jpg'] },
  { category: 'Laptop', brands: ['MSI', 'Acer', 'HP', 'Dell'], names: ['Katana 15', 'Nitro 5', 'Victus 16', 'G15 Gaming'], price: 32000, images: ['labtop_8.jpg', 'labtop_9.jpg', 'labtop_10.jpg', 'labtop_11.jpg'] },
  { category: 'Kulaklık', brands: ['Bose', 'Sennheiser', 'Marshall', 'Beats'], names: ['QuietComfort', 'Momentum 4', 'Major IV', 'Studio Pro'], price: 9500, images: ['kulaklik_16.jpg', 'kulaklik_17.jpg', 'kulaklik_18.jpg', 'kulaklik_19.jpg'] },
  { category: 'Televizyon', brands: ['LG', 'Philips', 'Sony', 'Xiaomi'], names: ['OLED Evo', 'The One Ambilight', 'Bravia XR', 'TV A Pro'], price: 35000, images: ['televizyon_7.jpg', 'televizyon_8.jpg', 'televizyon_9.jpg', 'televizyon_10.jpg'] },
];

if (currentCount < targetCount) {
  const needed = targetCount - currentCount;
  let startId = Math.max(0, ...db.products.map(p => p.id)) + 1;
  
  for (let i = 0; i < needed; i++) {
    const def = categories[Math.floor(Math.random() * categories.length)];
    const brand = def.brands[Math.floor(Math.random() * def.brands.length)];
    const name = def.names[Math.floor(Math.random() * def.names.length)] + ' ' + (Math.floor(i / categories.length) + 1);
    const basePrice = def.price * (0.8 + Math.random() * 0.4);
    const image = def.images[Math.floor(Math.random() * def.images.length)];
    
    db.products.push(createProduct(startId + i, def.category, name, brand, basePrice, image));
  }
  
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Success: Total products is now ${db.products.length}`);
} else {
  console.log('Database already has enough products.');
}
