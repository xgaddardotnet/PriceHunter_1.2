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
    image: `/magaza_resimler/laptop.jpg`,
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
let currentCount = db.products.length;
let needed = targetCount - currentCount;

if (needed > 0) {
  const defs = [
    { category: 'Aksesuarlar', brand: 'Pandora', names: ['Gümüş Bileklik', 'Charm Kolye', 'Altın Kaplama Yüzük'], price: 2000 },
    { category: 'Aksesuarlar', brand: 'Guess', names: ['Omuz Çantası', 'El Çantası', 'Sırt Çantası'], price: 3500 },
    { category: 'Ev Eşyaları', brand: 'Paşabahçe', names: ['Su Bardağı', 'Şarap Kadehi', 'Çay Bardağı'], price: 400 },
    { category: 'Ev Eşyaları', brand: 'Karaca', names: ['Granit Tencere', 'Çelik Tencere', 'Düdüklü Tencere'], price: 1500 },
    { category: 'Ev Eşyaları', brand: 'Korkmaz', name: ['Çaydanlık Takımı', 'Cezve Seti'], price: 1200 },
    { category: 'Akıllı Telefon', brand: 'Samsung', names: ['Galaxy S24 Ultra', 'Galaxy A55', 'Galaxy Z Fold 6'], price: 45000 },
    { category: 'Televizyon', brand: 'Samsung', names: ['QLED 4K TV', 'Neo QLED 8K', 'The Frame'], price: 55000 },
  ];

  let startId = Math.max(...db.products.map(p => p.id)) + 1;
  for (let i = 0; i < needed; i++) {
    const d = defs[i % defs.length];
    const names = Array.isArray(d.names) ? d.names : [d.name];
    const name = names[Math.floor(Math.random() * names.length)] + ' ' + (Math.floor(i / defs.length) + 1);
    db.products.push(createProduct(startId + i, d.category, name, d.brand, d.price * (0.8 + Math.random() * 0.4)));
  }
  
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Final sync: Total products reach ${db.products.length}`);
} else {
  console.log('Already have enough products.');
}
