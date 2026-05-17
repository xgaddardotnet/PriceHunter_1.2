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
      discount: Math.floor(Math.random() * 40),
      inStock: true,
      rating: (4.0 + Math.random() * 1.0).toFixed(1),
      reviewCount: Math.floor(Math.random() * 5000),
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

const targetCount = 1000;
let currentCount = db.products.length;
console.log('Current count:', currentCount);

const defs = [
  { category: 'Akıllı Telefon', brand: 'Samsung', names: ['Galaxy S23 FE', 'Galaxy M34', 'Galaxy A34'], price: 18000, images: ['akilli_telefon_1.jpg', 'akilli_telefon_5.jpg'] },
  { category: 'Laptop', brand: 'Dell', names: ['XPS 15 9530', 'Inspiron 14 Plus', 'Latitude 5440'], price: 45000, images: ['laptop_2.jpg', 'labtop_11.jpg'] },
  { category: 'Televizyon', brand: 'Philips', names: ['The One 4K UHD', 'OLED 808 Ambilight', 'LED 8508'], price: 35000, images: ['televizyon_1.jpg', 'televizyon_3.jpg'] },
  { category: 'Aksesuarlar', brand: 'Fossil', names: ['Gen 6 Smartwatch', 'Machine Chronograph', 'Grant Automatic'], price: 6500, images: ['aksesuar_1.jpg', 'aksesuar_kolye_3.jpg'] },
  { category: 'Elbise', brand: 'Mango', names: ['Şifon Elbise', 'Deri Görünümlü Pantolon', 'Oversize Gömlek'], price: 2000, images: ['kadin_elbise_6.jpg', 'kadin_elbise_8.jpg'] },
  { category: 'Ayakkabı', brand: 'New Balance', names: ['530 Sneakers', '9060 Unisex', '550 White Blue'], price: 5800, images: ['kadin_ayakkabi_17.jpg', 'erkek_ayakkabi_1.jpg'] },
  { category: 'Ev Eşyaları', brand: 'Bosch', names: ['Mum 5 Mikser', 'ErgoMixx El Blender', 'VitaPower Sürahi'], price: 5500, images: ['ev_esyalari_tencere_5.jpg', 'ev_esyalari_caydanlik_4.jpg'] },
];

if (currentCount < targetCount) {
  const needed = targetCount - currentCount;
  let startId = Math.max(0, ...db.products.map(p => p.id)) + 1;
  
  for (let i = 0; i < needed; i++) {
    const d = defs[i % defs.length];
    const name = d.names[Math.floor(Math.random() * d.names.length)] + ' ' + (Math.floor(i / defs.length) + 1);
    const image = d.images[Math.floor(Math.random() * d.images.length)];
    
    db.products.push(createProduct(
      startId + i, 
      d.category, 
      name, 
      d.brand, 
      d.price * (0.8 + Math.random() * 0.4),
      image
    ));
  }
  
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Success: Total products is now ${db.products.length}`);
} else {
  console.log('Database already has enough products.');
}
