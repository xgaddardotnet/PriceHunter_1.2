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
    const price = basePrice * (0.85 + Math.random() * 0.3);
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
      discount: Math.floor(Math.random() * 30),
      inStock: true,
      rating: (4 + Math.random()).toFixed(1),
      reviewCount: Math.floor(Math.random() * 1000),
      seller: `${brand} Resmi Satıcı`,
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

const productDefinitions = [
  { category: 'Akıllı Telefon', brand: 'Apple', names: ['iPhone 15 Pro Max', 'iPhone 14 Plus', 'iPhone 13 Mini'], price: 60000 },
  { category: 'Akıllı Telefon', brand: 'Samsung', names: ['Galaxy S24 Ultra', 'Galaxy Z Fold 5', 'Galaxy A54'], price: 40000 },
  { category: 'Laptop', brand: 'ASUS', names: ['ROG Strix G16', 'Zenbook 14 OLED', 'Vivobook Pro'], price: 35000 },
  { category: 'Laptop', brand: 'Apple', names: ['MacBook Pro M3', 'MacBook Air M2'], price: 55000 },
  { category: 'Televizyon', brand: 'LG', names: ['OLED G3 Series', 'QNED 81 Series', 'Nanocell TV'], price: 40000 },
  { category: 'Televizyon', brand: 'Philips', names: ['Ambilight 4K TV', 'The One Series'], price: 25000 },
  { category: 'Elbise', brand: 'Zara', names: ['Kadın Midi Elbise', 'Erkek Keten Takım', 'Kadın Blazer Ceket'], price: 1500 },
  { category: 'Elbise', brand: 'Mango', names: ['Kadın İpek Elbise', 'Erkek Deri Ceket'], price: 2500 },
  { category: 'Tişört', brand: 'Lacoste', names: ['Erkek Slim Fit Polo', 'Kadın Klasik Polo'], price: 2200 },
  { category: 'Tişört', brand: 'Nike', names: ['Erkek Dri-FIT Tişört', 'Kadın Training Top'], price: 800 },
  { category: 'Ayakkabı', brand: 'Adidas', names: ['Ultraboost Light', 'Stan Smith Klasik', 'Forum Low'], price: 3500 },
  { category: 'Ayakkabı', brand: 'Nike', names: ['Air Jordan 1', 'Dunk Low Retro', 'Air Force 1'], price: 4500 },
  { category: 'Aksesuarlar', brand: 'Logitech', names: ['MX Keys Keyboard', 'G502 Hero Mouse'], price: 2500 },
  { category: 'Aksesuarlar', brand: 'Sony', names: ['WH-1000XM5 Kulaklık', 'WF-1000XM5 Earbuds'], price: 12000 },
  { category: 'Ev Eşyaları', brand: 'Karaca', names: ['6 Kişilik Yemek Takımı', 'Döküm Tencere Seti'], price: 4500 },
  { category: 'Ev Eşyaları', brand: 'IKEA', names: ['Poäng Koltuk', 'Billy Kitaplık'], price: 3000 },
];

let startId = 300;
const addedProducts = [];

for (let i = 0; i < 50; i++) {
  const def = productDefinitions[i % productDefinitions.length];
  const name = def.names[Math.floor(Math.random() * def.names.length)] + ' ' + (Math.floor(i / productDefinitions.length) + 1);
  addedProducts.push(createProduct(startId + i, def.category, name, def.brand, def.price * (0.8 + Math.random() * 0.4)));
}

db.products = [...db.products, ...addedProducts];
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Successfully added ${addedProducts.length} new products.`);
