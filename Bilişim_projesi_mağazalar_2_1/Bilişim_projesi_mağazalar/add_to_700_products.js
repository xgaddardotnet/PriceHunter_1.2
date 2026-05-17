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
    const price = basePrice * (0.75 + Math.random() * 0.5);
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
      originalPrice: Math.round(currentPrice * (1.1 + Math.random() * 0.4)),
      discount: Math.floor(Math.random() * 45),
      inStock: true,
      rating: (4.1 + Math.random() * 0.9).toFixed(1),
      reviewCount: Math.floor(Math.random() * 8000),
      seller: `${brand} Official Store`,
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

const targetCount = 700;
let currentCount = db.products.length;
console.log('Current count:', currentCount);

const luxuryFashion = [
  { brand: 'Prada', names: ['Saffiano Leather Bag', 'Re-Nylon Jacket', 'Logo Plaque Sneakers'], price: 45000, gender: 'kadin' },
  { brand: 'Gucci', names: ['GG Marmont Shoulder Bag', 'Horsebit Loafers', 'Silk Printed Scarf'], price: 38000, gender: 'kadin' },
  { brand: 'Louis Vuitton', names: ['Neverfull MM', 'Speedy 25', 'Keepall Bandoulière'], price: 55000, gender: 'kadin' },
  { brand: 'Balenciaga', names: ['Triple S Sneakers', 'Hourglass Blazer', 'Logo Print Hoodie'], price: 28000, gender: 'erkek' },
  { brand: 'Off-White', names: ['Out Of Office Sneakers', 'Arrows Print T-Shirt', 'Industrial Belt'], price: 12000, gender: 'erkek' },
  { brand: 'Stone Island', names: ['Compass Patch Jacket', 'Ghost Piece Knit', 'Cargo Pants'], price: 18000, gender: 'erkek' },
];

const casualFashion = [
  { brand: 'Pull&Bear', names: ['Cargo Pantolon', 'Denim Ceket', 'Baskılı Sweatshirt'], price: 1500, gender: 'erkek' },
  { brand: 'Bershka', names: ['Crop Top', 'Mini Etek', 'Biker Ceket'], price: 1200, gender: 'kadin' },
  { brand: 'Massimo Dutti', names: ['Keten Blazer', 'Yün Palto', 'Deri Ayakkabı'], price: 6500, gender: 'erkek' },
  { brand: 'Stradivarius', names: ['Büzgülü Elbise', 'Jean Şort', 'Saten Bluz'], price: 900, gender: 'kadin' },
];

const homeAndKitchen = [
  { brand: 'Tefal', names: ['Ingenio Tencere Seti', 'Ütü Ultimate Pure', 'Blender Seti'], price: 4500, category: 'Ev Eşyaları', images: ['ev_esyalari_tencere_1.jpg', 'ev_esyalari_tencere_2.jpg'] },
  { brand: 'Karaca', names: ['BioDiamond Tencere', '6 Kişilik Kahve Takımı', 'Hatır Hüps'], price: 3200, category: 'Ev Eşyaları', images: ['ev_esyalari_tencere_3.jpg', 'ev_esyalari_bardak_1.jpg'] },
  { brand: 'Nespresso', names: ['Vertuo Pop', 'Essenza Mini', 'Aeroccino 4'], price: 7500, category: 'Ev Eşyaları', images: ['ev_esyalari_caydanlik_1.jpg', 'ev_esyalari_caydanlik_2.jpg'] },
];

const images = {
  kadin_elbise: ['kadin_elbise_1.jpg', 'kadin_elbise_2.jpg', 'kadin_elbise_3.jpg', 'kadin_elbise_5.jpg', 'kadin_elbise_6.jpg', 'kadin_elbise_7.jpg', 'kadin_elbise_8.jpg', 'kadin_elbise_9.jpg', 'kadin_elbise_10.jpg', 'kadin_elbise_12.jpg', 'kadin_elbise_13.jpg', 'kadin_elbise_14.jpg'],
  kadin_tisort: ['kadin_tisort_2.jpg', 'kadin_tisort_3.jpg', 'kadin_tisort_5.jpg', 'kadin_tisort_6.jpg', 'kadin_tisort_7.jpg', 'kadin_tisort_9.jpg', 'kadin_tisort_11.jpg', 'kadin_tisort_13.jpg'],
  erkek_elbise: ['erkek_elbise_1.jpg', 'erkek_elbise_2.jpg', 'erkek_elbise_3.jpg', 'erkek_elbise_4.jpg', 'erkek_elbise_6.jpg', 'erkek_elbise_8.jpg'],
  erkek_tisort: ['erkek_tisort_6.jpg', 'erkek_tisort_8.jpg', 'erkek_tisort_9.jpg', 'erkek_tisort_11.jpg', 'erkek_tisort_12.jpg', 'erkek_tisort_13.jpg', 'erkek_tisort_14.jpg'],
  kadin_ayakkabi: ['kadin_ayakkabi1.jpg', 'kadin_ayakkabi_2.jpg', 'kadin_ayakkabi_4.jpg', 'kadin_ayakkabi_5.jpg', 'kadin_ayakkabi_6.jpg', 'kadin_ayakkabi_7.jpg', 'kadin_ayakkabi_17.jpg', 'kadin_ayakkabi_18.jpg', 'kadin_ayakkabi_19.jpg', 'kadin_ayakkabi_20.jpg', 'kadin_ayakkabi_21.jpg', 'kadin_ayakkabi_22.jpg'],
  erkek_ayakkabi: ['erkek_ayakkabi_1.jpg', 'erkek_ayakkabi_2_copy.jpg', 'erkek_ayakkabi_3_copy.jpg', 'erkek_ayakkabi_4_copy.jpg', 'erkek_ayakkabi_5_copy.jpg', 'erkek_ayakkabi_6_copy.jpg', 'erkek_ayakkabi_7_copy.jpg'],
};

if (currentCount < targetCount) {
  const needed = targetCount - currentCount;
  let startId = Math.max(0, ...db.products.map(p => p.id)) + 1;
  
  for (let i = 0; i < needed; i++) {
    let category, name, brand, basePrice, image;
    
    const rand = Math.random();
    
    if (rand < 0.3) { // Luxury Fashion
      category = 'Elbise';
      const def = luxuryFashion[Math.floor(Math.random() * luxuryFashion.length)];
      brand = def.brand;
      name = def.names[Math.floor(Math.random() * def.names.length)] + ' ' + (Math.floor(i / luxuryFashion.length) + 1);
      basePrice = def.price * (0.9 + Math.random() * 0.2);
      const imgPool = def.gender === 'kadin' ? [...images.kadin_elbise] : [...images.erkek_elbise];
      image = imgPool[Math.floor(Math.random() * imgPool.length)];
    } else if (rand < 0.7) { // Casual Fashion
      category = 'Elbise';
      const def = casualFashion[Math.floor(Math.random() * casualFashion.length)];
      brand = def.brand;
      name = def.names[Math.floor(Math.random() * def.names.length)] + ' ' + (Math.floor(i / casualFashion.length) + 1);
      basePrice = def.price * (0.8 + Math.random() * 0.4);
      const imgPool = def.gender === 'kadin' ? [...images.kadin_elbise, ...images.kadin_tisort] : [...images.erkek_elbise, ...images.erkek_tisort];
      image = imgPool[Math.floor(Math.random() * imgPool.length)];
    } else { // Home and Kitchen
      const def = homeAndKitchen[Math.floor(Math.random() * homeAndKitchen.length)];
      category = def.category;
      brand = def.brand;
      name = def.names[Math.floor(Math.random() * def.names.length)] + ' ' + (Math.floor(i / homeAndKitchen.length) + 1);
      basePrice = def.price * (0.8 + Math.random() * 0.4);
      image = def.images[Math.floor(Math.random() * def.images.length)];
    }
    
    db.products.push(createProduct(startId + i, category, name, brand, basePrice, image));
  }
  
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Success: Total products is now ${db.products.length}`);
} else {
  console.log('Database already has enough products.');
}
