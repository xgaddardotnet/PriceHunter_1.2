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
    const price = basePrice * (0.9 + Math.random() * 0.2);
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
      discount: 15,
      inStock: true,
      rating: (4 + Math.random()).toFixed(1),
      reviewCount: Math.floor(Math.random() * 500),
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
    tags: [category.toLowerCase(), brand.toLowerCase()],
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
  // Televizyon
  createProduct(201, 'Televizyon', 'Samsung QLED 4K Smart TV', 'Samsung', 25000),
  createProduct(202, 'Televizyon', 'LG OLED Evo C3 TV', 'LG', 45000),
  createProduct(203, 'Televizyon', 'Sony Bravia XR TV', 'Sony', 35000),
  
  // Elbise / Tişört (Women)
  createProduct(204, 'Elbise', 'Kadın Yazlık Çiçekli Elbise', 'Zara', 899),
  createProduct(205, 'Elbise', 'Kadın Siyah Gece Elbisesi', 'Mango', 1299),
  createProduct(206, 'Elbise', 'Kadın Basic Beyaz Tişört', 'H&M', 299),
  createProduct(207, 'Elbise', 'Kadın Oversize Grafik Tişört', 'Pull&Bear', 450),
  
  // Elbise / Tişört (Men)
  createProduct(208, 'Elbise', 'Erkek Slim Fit Keten Gömlek', 'Massimo Dutti', 1499),
  createProduct(209, 'Elbise', 'Erkek Pamuklu Chino Pantolon', 'Zara', 999),
  createProduct(210, 'Elbise', 'Erkek Polo Yaka Tişört', 'Lacoste', 1899),
  createProduct(211, 'Elbise', 'Erkek V Yaka Basic Tişört', 'Koton', 199),
  
  // Ayakkabı
  createProduct(212, 'Ayakkabı', 'Nike Air Max Pro', 'Nike', 4500),
  createProduct(213, 'Ayakkabı', 'Adidas Ultraboost 22', 'Adidas', 3999),
  createProduct(214, 'Ayakkabı', 'Kadın Topuklu Deri Ayakkabı', 'Nine West', 2499),
  createProduct(215, 'Ayakkabı', 'Erkek Klasik Deri Ayakkabı', 'Kemal Tanca', 2999),
  
  // Aksesuarlar
  createProduct(216, 'Aksesuarlar', 'Logitech MX Master 3S Mouse', 'Logitech', 3500),
  createProduct(217, 'Aksesuarlar', 'Razer BlackWidow V4 Klavye', 'Razer', 5500),
  createProduct(218, 'Aksesuarlar', 'Apple MagSafe Cüzdan', 'Apple', 1800),
];

// Add to existing products
db.products = [...db.products, ...newProducts];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Added ${newProducts.length} products to database.`);
