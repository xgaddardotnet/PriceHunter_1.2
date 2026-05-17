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
    image: `/magaza_resimler/laptop.jpg`, // imageHelper handles the mapping
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

const newProducts = [
  // Aksesuarlar
  { category: 'Aksesuarlar', brand: 'Pandora', name: 'Gümüş Zincir Bileklik', price: 1500 },
  { category: 'Aksesuarlar', brand: 'Swarovski', name: 'Kristal Kolye Ucu', price: 2500 },
  { category: 'Aksesuarlar', brand: 'Michael Kors', name: 'Siyah Deri Kol Çantası', price: 4500 },
  { category: 'Aksesuarlar', brand: 'Altınbaş', name: 'Pırlanta Tektaş Yüzük', price: 15000 },
  { category: 'Aksesuarlar', brand: 'Atasay', name: 'Zümrüt Taşlı Kolye', price: 8000 },
  { category: 'Aksesuarlar', brand: 'Guess', name: 'Zincir Detaylı Omuz Çantası', price: 3200 },
  
  // Ev Eşyaları
  { category: 'Ev Eşyaları', brand: 'Paşabahçe', name: '6\'lı Meşrubat Bardağı Seti', price: 350 },
  { category: 'Ev Eşyaları', brand: 'Korkmaz', name: 'Granit Tencere Takımı 7 Parça', price: 2800 },
  { category: 'Ev Eşyaları', brand: 'Karaca', name: 'Retro Çaydanlık Takımı', price: 1200 },
  { category: 'Ev Eşyaları', brand: 'Emsan', name: 'Paslanmaz Çelik Tencere', price: 950 },
  { category: 'Ev Eşyaları', brand: 'Lava', name: 'Döküm Demir Izgara Tavası', price: 1400 },
  { category: 'Ev Eşyaları', brand: 'IKEA', name: 'Cam Su Bardağı 4 adet', price: 180 }
];

let startId = Math.max(...db.products.map(p => p.id)) + 1;
const added = [];

newProducts.forEach((p, index) => {
  added.push(createProduct(startId + index, p.category, p.name, p.brand, p.price));
});

db.products = [...db.products, ...added];
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Added ${added.length} specific accessory and home goods. Total: ${db.products.length}`);
