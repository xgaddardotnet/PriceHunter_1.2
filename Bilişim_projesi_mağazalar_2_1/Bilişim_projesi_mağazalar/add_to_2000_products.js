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

const targetCount = 2000;
let currentCount = db.products.length;
console.log('Current count:', currentCount);

const techDefs = [
  { category: 'Akıllı Telefon', brand: 'Samsung', names: ['Galaxy S24 Ultra', 'Galaxy Z Fold 5', 'Galaxy A54', 'Galaxy S23 FE'], price: 35000, images: ['akilli_telefon_4.jpg', 'akilli_telefon_5.jpg', 'akilli_telefon_7.jpg', 'akilli_telefon_8.jpg'] },
  { category: 'Laptop', brand: 'ASUS', names: ['ROG Zephyrus G14', 'Vivobook Pro 16', 'Zenbook S13', 'TUF Gaming F15'], price: 38000, images: ['labtop_4.jpg', 'labtop_5.jpg', 'labtop_6.jpg', 'labtop_7.jpg'] },
  { category: 'Kulaklık', brand: 'JBL', names: ['Tune 510BT', 'Live 660NC', 'Quantum 100', 'Wave 300TWS'], price: 2500, images: ['kulaklik_5.jpg', 'kulaklik_6.jpg', 'kulaklik_7.jpg', 'kulaklik_8.jpg'] },
  { category: 'Televizyon', brand: 'Samsung', names: ['QLED 4K Smart TV', 'Neo QLED 8K', 'The Frame TV', 'Crystal UHD'], price: 28000, images: ['televizyon_1.jpg', 'televizyon_3.jpg', 'televizyon_5.jpg', 'televizyon_6.jpg'] },
  { category: 'Akıllı Saat', brand: 'Huawei', names: ['Watch GT 4', 'Watch Ultimate', 'Watch Fit 2', 'Band 8'], price: 6500, images: ['akilli_saat_1.jpg', 'akilli_saat_2.jpg', 'akilli_saat_3.jpg', 'akilli_saat_4.jpg'] },
  { category: 'Monitör', brand: 'MSI', names: ['Optix G241', 'MAG274QRF-QD', 'Oculux NXG253R', 'Summit MS321UP'], price: 8500, images: ['monitor_1.jpg', 'monitor_2.jpg', 'monitor_3.jpg', 'monitor_4.jpg'] },
];

const accessoryDefs = [
  { brand: 'Pandora', names: ['Gümüş Bileklik', 'Kalp Kolye', 'Papatya Yüzük', 'Yıldız Küpe'], price: 2500, type: 'bileklik' },
  { brand: 'Swarovski', names: ['Kuğu Kolye', 'Zodiac Bileklik', 'Attract Yüzük', 'Tennis Bileklik'], price: 4500, type: 'kolye' },
];

const homeDefs = [
  { brand: 'Karaca', names: ['BioGranit Tencere Seti', '6 Kişilik Yemek Takımı', 'Çay Makinesi', 'Blender Seti'], price: 3500, type: 'tencere' },
  { brand: 'Tefal', names: ['Ingenio Set', 'Actifry Fritöz', 'Ütü Ultimate', 'Düdüklü Tencere'], price: 5500, type: 'tencere' },
];

const images = {
  bileklik: ['aksesuar_bileklik_1.jpg', 'aksesuar_bileklik_2.jpg', 'aksesuar_bileklik_3.jpg', 'aksesuar_bileklik_4.jpg'],
  kolye: ['aksesuar_kolye_1.jpg', 'aksesuar_kolye_2.jpg', 'aksesuar_kolye_3.jpg', 'aksesuar_kolye_4.jpg'],
  tencere: ['ev_esyalari_tencere_1.jpg', 'ev_esyalari_tencere_2.jpg', 'ev_esyalari_tencere_3.jpg'],
};

if (currentCount < targetCount) {
  const needed = targetCount - currentCount;
  let startId = Math.max(0, ...db.products.map(p => p.id)) + 1;
  
  for (let i = 0; i < needed; i++) {
    let category, name, brand, basePrice, image;
    
    // 40% chance for Tech
    if (Math.random() < 0.4) {
      const def = techDefs[Math.floor(Math.random() * techDefs.length)];
      category = def.category;
      brand = def.brand;
      name = def.names[Math.floor(Math.random() * def.names.length)] + ' ' + (Math.floor(i / techDefs.length) + 1);
      basePrice = def.price * (0.8 + Math.random() * 0.4);
      image = def.images[Math.floor(Math.random() * def.images.length)];
    } 
    // 30% chance for Accessories
    else if (Math.random() < 0.7) {
      category = 'Aksesuarlar';
      const def = accessoryDefs[Math.floor(Math.random() * accessoryDefs.length)];
      brand = def.brand;
      name = def.names[Math.floor(Math.random() * def.names.length)] + ' ' + (Math.floor(i / accessoryDefs.length) + 1);
      basePrice = def.price * (0.8 + Math.random() * 0.4);
      const imgPool = images[def.type] || images.bileklik;
      image = imgPool[Math.floor(Math.random() * imgPool.length)];
    }
    // 30% chance for Home Goods
    else {
      category = 'Ev Eşyaları';
      const def = homeDefs[Math.floor(Math.random() * homeDefs.length)];
      brand = def.brand;
      name = def.names[Math.floor(Math.random() * def.names.length)] + ' ' + (Math.floor(i / homeDefs.length) + 1);
      basePrice = def.price * (0.8 + Math.random() * 0.4);
      const imgPool = images[def.type] || images.tencere;
      image = imgPool[Math.floor(Math.random() * imgPool.length)];
    }
    
    db.products.push(createProduct(startId + i, category, name, brand, basePrice, image));
  }
  
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Success: Total products is now ${db.products.length}`);
} else {
  console.log('Database already has enough products.');
}
