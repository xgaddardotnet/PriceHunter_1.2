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
    const price = basePrice * (0.85 + Math.random() * 0.3); // More stable price range
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
      originalPrice: Math.round(currentPrice * (1.1 + Math.random() * 0.2)),
      discount: Math.floor(Math.random() * 35),
      inStock: Math.random() > 0.05,
      rating: (4.2 + Math.random() * 0.8).toFixed(1),
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

const targetCount = 350;
let currentCount = db.products.length;
console.log('Current count:', currentCount);

const defs = [
  { 
    category: 'Akıllı Telefon', 
    brand: 'Apple', 
    names: ['iPhone 15 Pro Max', 'iPhone 14 Plus', 'iPhone 13 Mini'], 
    price: 60000,
    images: ['akilli_telefon_1.jpg', 'akilli_telefon_3.jpg', 'akilli_telefon_4.jpg']
  },
  { 
    category: 'Akıllı Telefon', 
    brand: 'Xiaomi', 
    names: ['Redmi Note 13 Pro', 'Xiaomi 14 Ultra', 'POCO F6'], 
    price: 15000,
    images: ['akilli_telefon_5.jpg', 'akilli_telefon_6.jpg', 'akilli_telefon_7.jpg']
  },
  { 
    category: 'Laptop', 
    brand: 'ASUS', 
    names: ['ROG Strix G16', 'Zenbook 14 OLED', 'Vivobook Pro'], 
    price: 35000,
    images: ['laptop_2.jpg', 'labtop_11.jpg', 'labtop_13.jpg']
  },
  { 
    category: 'Laptop', 
    brand: 'HP', 
    names: ['Victus 16', 'Pavilion Gaming', 'Spectre x360'], 
    price: 28000,
    images: ['labtop_5.jpg', 'labtop_6.jpg', 'labtop_7.jpg']
  },
  { 
    category: 'Kulaklık', 
    brand: 'Sony', 
    names: ['WH-1000XM5 ANC', 'WF-C700N TWS', 'MDR-ZX110'], 
    price: 12000,
    images: ['kulaklik_7.jpg', 'kulaklik_8.jpg', 'kulaklik_9.jpg']
  },
  { 
    category: 'Televizyon', 
    brand: 'LG', 
    names: ['OLED65C3 4K', 'NanoCell 55', 'QNED 81'], 
    price: 45000,
    images: ['televizyon_3.jpg', 'televizyon_8.jpg', 'televizyon_9.jpg']
  },
  { 
    category: 'Aksesuarlar', 
    brand: 'Ray-Ban', 
    names: ['Aviator Classic', 'Wayfarer Black', 'Clubmaster'], 
    price: 4500,
    images: ['aksesuar_1.jpg', 'aksesuar_kolye_1.jpg', 'aksesuar_yuzuk_1.jpg']
  },
  { 
    category: 'Elbise', 
    brand: 'Zara', 
    names: ['Keten Gömlek', 'Slim Fit Pantolon', 'Oversize Tişört'], 
    price: 1200,
    images: ['erkek_elbise_1.jpg', 'erkek_tisort_11.jpg', 'kadin_elbise_1.jpg']
  },
  { 
    category: 'Ayakkabı', 
    brand: 'Nike', 
    names: ['Air Max 270', 'Air Force 1', 'Dunk Low'], 
    price: 5500,
    images: ['erkek_ayakkabi_1.jpg', 'erkek_ayakkabi_2_copy.jpg', 'kadin_ayakkabi_17.jpg']
  },
  { 
    category: 'Ev Eşyaları', 
    brand: 'Philips', 
    names: ['Airfryer XXL', 'Lumea Prestige', 'Süpürge 8000'], 
    price: 8500,
    images: ['ev_esyalari_caydanlik_1.jpg', 'ev_esyalari_tencere_5.jpg', 'ev_esyalari_bardak_4.jpg']
  },
];

if (currentCount < targetCount) {
  const needed = targetCount - currentCount;
  let startId = Math.max(0, ...db.products.map(p => p.id)) + 1;
  
  for (let i = 0; i < needed; i++) {
    const d = defs[i % defs.length];
    const nameIndex = Math.floor(Math.random() * d.names.length);
    const name = d.names[nameIndex] + ' ' + (Math.floor(i / defs.length) + 1);
    const image = d.images[Math.floor(Math.random() * d.images.length)];
    
    db.products.push(createProduct(
      startId + i, 
      d.category, 
      name, 
      d.brand, 
      d.price * (0.7 + Math.random() * 0.6),
      image
    ));
  }
  
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Success: Total products is now ${db.products.length}`);
} else {
  console.log('Database already has enough products.');
}
