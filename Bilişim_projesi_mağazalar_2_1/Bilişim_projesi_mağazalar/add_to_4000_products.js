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
    // Generate a more "realistic" looking URL
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
    const productUrl = `${platform.url}/p/${slug}-${id}`;
    
    return {
      platformId,
      platform,
      currentPrice,
      originalPrice: Math.round(currentPrice * (1.1 + Math.random() * 0.3)),
      discount: Math.floor(Math.random() * 50),
      inStock: true,
      rating: (4.0 + Math.random() * 1.0).toFixed(1),
      reviewCount: Math.floor(Math.random() * 5000),
      seller: `${brand} Official Store`,
      url: productUrl,
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

const targetCount = 4000;
let currentCount = db.products.length;
console.log('Current count:', currentCount);

const fashionImages = [
  'kadin_elbise_1.jpg', 'kadin_elbise_2.jpg', 'kadin_elbise_3.jpg', 'kadin_elbise_5.jpg', 'kadin_elbise_6.jpg', 'kadin_elbise_7.jpg',
  'kadin_elbise_8.jpg', 'kadin_elbise_9.jpg', 'kadin_elbise_10.jpg', 'kadin_elbise_12.jpg', 'kadin_elbise_20.jpg', 'kadin_elbise_25.jpg',
  'erkek_elbise_1.jpg', 'erkek_elbise_2.jpg', 'erkek_elbise_3.jpg', 'erkek_elbise_4.jpg', 'erkek_elbise_6.jpg', 'erkek_elbise_8.jpg',
  'kadin_ayakkabi1.jpg', 'kadin_ayakkabi_2.jpg', 'kadin_ayakkabi_4.jpg', 'kadin_ayakkabi_17.jpg', 'kadin_ayakkabi_20.jpg', 'kadin_ayakkabi_22.jpg',
  'erkek_ayakkabi_1.jpg', 'erkek_ayakkabi_2_copy.jpg', 'erkek_ayakkabi_4_copy.jpg', 'erkek_ayakkabi_6_copy.jpg'
];

const brands = ['Zara', 'Mango', 'Mavi', 'Nike', 'Adidas', 'Koton', 'H&M', 'Lacoste', 'Tommy Hilfiger', 'Puma'];
const types = ['Ceket', 'Elbise', 'Jean', 'Tişört', 'Spor Ayakkabı', 'Gömlek', 'Pantolon', 'Sweatshirt'];

if (currentCount < targetCount) {
  const needed = targetCount - currentCount;
  let startId = Math.max(0, ...db.products.map(p => p.id)) + 1;
  
  for (let i = 0; i < needed; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const category = type.includes('Ayakkabı') ? 'Ayakkabı' : 'Elbise';
    const name = `${brand} Premium ${type} - New Season ${Math.floor(i/10) + 1}`;
    const basePrice = 500 + Math.random() * 5000;
    const image = fashionImages[Math.floor(Math.random() * fashionImages.length)];
    
    db.products.push(createProduct(startId + i, category, name, brand, basePrice, image));
  }
  
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log(`Success: Total products is now ${db.products.length}`);
} else {
  console.log('Database already has enough products.');
}
