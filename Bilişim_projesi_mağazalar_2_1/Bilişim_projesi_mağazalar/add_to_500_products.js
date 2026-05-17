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
      reviewCount: Math.floor(Math.random() * 3000),
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

const targetCount = 500;
let currentCount = db.products.length;
console.log('Current count:', currentCount);

const fashionDefs = [
  { brand: 'Zara', names: ['Keten Blazer Ceket', 'Basic Poplin Gömlek', 'High Waist Pantolon', 'Floral Desenli Elbise'], price: 2500, gender: 'kadin' },
  { brand: 'H&M', names: ['Oversize Kaşmir Kazak', 'Premium Cotton Tişört', 'Mom Fit Jean', 'Saten Midi Etek'], price: 1500, gender: 'kadin' },
  { brand: 'Mango', names: ['Yün Karışımlı Palto', 'Desenli Şifon Elbise', 'Deri Görünümlü Tayt', 'Örgü Hırka'], price: 3200, gender: 'kadin' },
  { brand: 'Massimo Dutti', names: ['İpek Gömlek', 'Napa Deri Ceket', 'Takım Elbise Pantolonu', 'Kaşmir Atkı'], price: 5000, gender: 'erkek' },
  { brand: 'Mavi', names: ['Jake Jean', 'Mona Jean', 'Logo Baskılı Sweatshirt', 'Denim Ceket'], price: 1200, gender: 'erkek' },
  { brand: 'Koton', names: ['V Yaka Triko', 'Beli Lastikli Şort', 'Çizgili Tunik', 'Kadife Ceket'], price: 800, gender: 'kadin' },
  { brand: 'LC Waikiki', names: ['Pamuklu Pijama Takımı', 'Kapüşonlu Mont', 'Polo Yaka Tişört', 'Klasik Pantolon'], price: 600, gender: 'erkek' },
  { brand: 'Beymen', names: ['Design Koleksiyon Elbise', 'Lüks İpek Şal', 'Özel Kesim Ceket'], price: 15000, gender: 'kadin' },
];

const shoeDefs = [
  { brand: 'Nike', names: ['Air Jordan 1 Low', 'Blazer Mid 77', 'Pegasus 40', 'Court Vision'], price: 4500, gender: 'erkek' },
  { brand: 'Adidas', names: ['Samba OG', 'Gazelle Indoor', 'Stan Smith', 'Forum Low'], price: 3800, gender: 'erkek' },
  { brand: 'New Balance', names: ['550 White', '2002R Grey', '530 Silver', '9060 Sea Salt'], price: 6500, gender: 'kadin' },
  { brand: 'Skechers', names: ['Arch Fit', 'Go Walk 6', 'D Lites', 'Uno Stand On Air'], price: 2800, gender: 'kadin' },
];

const techDefs = [
  { category: 'Akıllı Telefon', brand: 'Apple', names: ['iPhone 15', 'iPhone 15 Pro'], price: 55000, images: ['akilli_telefon_1.jpg', 'akilli_telefon_3.jpg'] },
  { category: 'Laptop', brand: 'Lenovo', names: ['Legion 5', 'ThinkPad X1'], price: 42000, images: ['labtop_16.jpg', 'labtop_17.jpg'] },
  { category: 'Kulaklık', brand: 'Sony', names: ['LinkBuds S', 'WH-CH720N'], price: 4500, images: ['kulaklik_10.jpg', 'kulaklik_11.jpg'] },
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
    
    // 70% chance for Fashion (Elbise)
    if (Math.random() < 0.7) {
      category = 'Elbise';
      const def = fashionDefs[Math.floor(Math.random() * fashionDefs.length)];
      brand = def.brand;
      name = def.names[Math.floor(Math.random() * def.names.length)] + ' ' + (Math.floor(i / fashionDefs.length) + 1);
      basePrice = def.price * (0.8 + Math.random() * 0.4);
      
      const imgPool = def.gender === 'kadin' ? [...images.kadin_elbise, ...images.kadin_tisort] : [...images.erkek_elbise, ...images.erkek_tisort];
      image = imgPool[Math.floor(Math.random() * imgPool.length)];
    } 
    // 20% chance for Shoes (Ayakkabı)
    else if (Math.random() < 0.9) {
      category = 'Ayakkabı';
      const def = shoeDefs[Math.floor(Math.random() * shoeDefs.length)];
      brand = def.brand;
      name = def.names[Math.floor(Math.random() * def.names.length)] + ' ' + (Math.floor(i / shoeDefs.length) + 1);
      basePrice = def.price * (0.8 + Math.random() * 0.4);
      
      const imgPool = def.gender === 'kadin' ? images.kadin_ayakkabi : images.erkek_ayakkabi;
      image = imgPool[Math.floor(Math.random() * imgPool.length)];
    }
    // 10% chance for Tech/Other
    else {
      const def = techDefs[Math.floor(Math.random() * techDefs.length)];
      category = def.category;
      brand = def.brand;
      name = def.names[Math.floor(Math.random() * def.names.length)] + ' ' + (Math.floor(i / techDefs.length) + 1);
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
