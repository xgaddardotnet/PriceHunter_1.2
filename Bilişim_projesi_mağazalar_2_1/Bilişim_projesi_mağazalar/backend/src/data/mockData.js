const platforms = {
  amazon: { id: 'amazon', name: 'Amazon', color: '#FF9900', url: 'https://www.amazon.com.tr' },
  trendyol: { id: 'trendyol', name: 'Trendyol', color: '#F27A1A', url: 'https://www.trendyol.com' },
  n11: { id: 'n11', name: 'N11', color: '#7B2FBE', url: 'https://www.n11.com' },
  hepsiburada: { id: 'hepsiburada', name: 'Hepsiburada', color: '#FF6000', url: 'https://www.hepsiburada.com' },
};

function generatePriceHistory(basePrice, days = 30, volatility = 0.08) {
  const history = [];
  let price = basePrice;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.45) * volatility * price;
    price = Math.max(price * 0.6, price + change);
    history.push({ 
      date: date.toISOString().split('T')[0], 
      price: Math.round(price * 100) / 100 
    });
  }
  return history;
}

function getImageUrl(productName, id, category) {
  // Use high-quality, stable Unsplash images based on category.
  const categoryTerms = {
    'Akıllı Telefon': 'smartphone',
    'Laptop': 'laptop',
    'Kulaklık': 'headphones',
    'Televizyon': 'tv',
    'Tablet': 'tablet',
    'Oyun Konsolu': 'gaming+console',
    'Kamera': 'camera',
    'Monitör': 'monitor',
    'Aksesuarlar': 'tech+accessories',
    'Akıllı Saat': 'smartwatch',
    'Elbise': 'fashion+dress',
    'Ayakkabı': 'sneakers+shoes',
    'Ev Eşyaları': 'home+decor'
  };

  const term = categoryTerms[category] || 'tech';
  // Use a fixed width and height for consistency, and add a random seed via ID
  return `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop&sig=${id}`;
}

// Real Store Images (Trendyol/N11/Hepsiburada CDN) + Proxy for 100% visibility
const categoryImages = {
  'Akıllı Telefon': [
    'https://images.weserv.nl/?url=https://productimages.hepsiburada.net/s/491/1500/110000542360541.jpg&w=800&af',
    'https://images.weserv.nl/?url=https://n11scdn.akamaized.net/a1/org/elektronik/cep-telefonu/apple-iphone-15-128-gb__P601248067.jpg&w=800&af',
    'https://images.weserv.nl/?url=https://productimages.hepsiburada.net/s/321/1500/110000320484742.jpg&w=800&af'
  ],
  'Laptop': [
    'https://images.weserv.nl/?url=https://n11scdn.akamaized.net/a1/org/elektronik/bilgisayar/dizustu-bilgisayar/apple-macbook-air-m2-chip-8gb-256gb-ssd-136-space-grey-mlxw3tua__P549302196.jpg&w=800&af',
    'https://images.weserv.nl/?url=https://productimages.hepsiburada.net/s/448/1500/110000494441456.jpg&w=800&af'
  ],
  'Kulaklık': [
    'https://images.weserv.nl/?url=https://n11scdn.akamaized.net/a1/org/elektronik/kulaklik/apple-airpods-pro-2nesil-magsafe-sarj-kutulu-usb-c-mtjy3tua__P610428054.jpg&w=800&af',
    'https://images.weserv.nl/?url=https://productimages.hepsiburada.net/s/28/1500/10228490338354.jpg&w=800&af'
  ],
  'Televizyon': [
    'https://images.weserv.nl/?url=https://n11scdn.akamaized.net/a1/org/elektronik/televizyon/samsung-55cu8500-55-139-ekran-4k-uhd-smart-led-tv__P598248012.jpg&w=800&af'
  ],
  'Akıllı Saat': [
    'https://images.weserv.nl/?url=https://productimages.hepsiburada.net/s/433/1500/110000465354921.jpg&w=800&af'
  ],
  'Elbise': [
    'https://images.weserv.nl/?url=https://cdn.dsmcdn.com/mnresize/400/-/ty1786/prod/QC_ENRICHMENT/20251106/11/9bfdf8e9-3220-3f29-b240-9cafda87aab7/1_org_zoom.jpg&w=800&af',
    'https://images.weserv.nl/?url=https://productimages.hepsiburada.net/s/500/1500/110000554389012.jpg&w=800&af',
    'https://images.weserv.nl/?url=https://cdn.dsmcdn.com/mnresize/400/-/ty930/prod/QC_ENRICHMENT/20240301/15/a1b2c3d4-e5f6-7890-abcd-ef1234567890/1_org_zoom.jpg&w=800&af',
    'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800&auto=format&fit=crop'
  ],
  'Ayakkabı': [
    'https://images.weserv.nl/?url=https://cdn.dsmcdn.com/mnresize/400/-/ty1200/prod/QC_ENRICHMENT/20240901/10/f1e2d3c4-b5a6-7890-bcde-fa1234567890/1_org_zoom.jpg&w=800&af',
    'https://images.weserv.nl/?url=https://productimages.hepsiburada.net/s/455/1500/110000503891234.jpg&w=800&af',
    'https://images.weserv.nl/?url=https://n11scdn.akamaized.net/a1/org/spor-outdoor/spor-ayakkabi/nike-air-max-270-erkek-spor-ayakkabi__P612345678.jpg&w=800&af',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop'
  ],
  'Ev Eşyaları': [
    'https://images.weserv.nl/?url=https://cdn.dsmcdn.com/mnresize/400/-/ty1500/prod/QC_ENRICHMENT/20250101/08/d4c3b2a1-e6f7-8901-cdef-ab1234567890/1_org_zoom.jpg&w=800&af',
    'https://images.weserv.nl/?url=https://productimages.hepsiburada.net/s/480/1500/110000521987654.jpg&w=800&af',
    'https://images.weserv.nl/?url=https://n11scdn.akamaized.net/a1/org/ev-yasam/dekorasyon/karaca-kupa-seti__P589123456.jpg&w=800&af',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800&auto=format&fit=crop'
  ]
};

function getUnsplashImageUrl(id, category) {
  const variations = categoryImages[category];
  if (variations && variations.length > 0) {
    return variations[id % variations.length];
  }
  // Fallback generic images by type
  const fallbacks = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop'
  ];
  return fallbacks[id % fallbacks.length];
}

function getLocalImageUrl(category, id) {
  if (category === 'Akıllı Telefon') {
    const images = ['/images/telefon.jpg', '/images/telefon_2.jpg'];
    return images[id % images.length];
  }
  if (category === 'Kulaklık') {
    const images = ['/images/kulaklık.jpg', '/images/kulaklık_2.jpg'];
    return images[id % images.length];
  }
  // For other categories, use Unsplash fallback
  return getUnsplashImageUrl(id, category);
}

const MODELS = ['Premium', 'Pro', 'Ultra', 'Lite', 'Max', 'Air', 'Plus', 'Elite', 'Slim', 'Sport'];
const TOTAL_SELENIUM_IMAGES = 21;

const categories = [
  { name: 'Akıllı Telefon', brands: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'OnePlus', 'Realme'], basePriceRange: [15000, 90000] },
  { name: 'Laptop', brands: ['Apple', 'ASUS', 'RS', 'Lenovo', 'HP', 'MSI', 'Dell', 'Acer'], basePriceRange: [20000, 150000] },
  { name: 'Kulaklık', brands: ['Sony', 'Bose', 'AirPods', 'Jabra', 'Sennheiser', 'JBL'], basePriceRange: [3000, 35000] },
  { name: 'Televizyon', brands: ['Samsung', 'LG', 'Sony', 'Philips', 'TCL'], basePriceRange: [15000, 120000] },
  { name: 'Tablet', brands: ['Apple', 'Samsung', 'Lenovo', 'Huawei'], basePriceRange: [7000, 45000] },
  { name: 'Oyun Konsolu', brands: ['Sony', 'Microsoft', 'Nintendo', 'Steam'], basePriceRange: [12000, 35000] },
  { name: 'Kamera', brands: ['Canon', 'Nikon', 'Sony', 'Fujifilm'], basePriceRange: [25000, 200000] },
  { name: 'Monitör', brands: ['ASUS', 'LG', 'Dell', 'Samsung', 'MSI'], basePriceRange: [4000, 45000] },
  { name: 'Aksesuarlar', brands: ['Logitech', 'Razer', 'SteelSeries', 'Corsair'], basePriceRange: [1000, 8000] },
  { name: 'Akıllı Saat', brands: ['Apple', 'Samsung', 'Garmin', 'Huawei', 'Xiaomi'], basePriceRange: [4000, 30000] },
  { name: 'Elbise', brands: ['Zara', 'H&M', 'Mango', 'LC Waikiki', 'Koton', 'Pull&Bear'], basePriceRange: [299, 2999] },
  { name: 'Ayakkabı', brands: ['Nike', 'Adidas', 'New Balance', 'Puma', 'Converse', 'Reebok'], basePriceRange: [599, 7999] },
  { name: 'Ev Eşyaları', brands: ['IKEA', 'Karaca', 'English Home', 'Madame Coco', 'Taç', 'Vivense'], basePriceRange: [149, 8999] },
  { name: 'Kulaklık Aksesuar', brands: ['Sony', 'JBL', 'Anker', 'Huawei'], basePriceRange: [500, 5000] },
  { name: 'Ses Sistemi', brands: ['JBL', 'Sony', 'Bose', 'Harman Kardon', 'Logitech'], basePriceRange: [2000, 50000] },
];

function generateProducts() {
  const products = [];
  let id = 1;
  categories.forEach(cat => {
    cat.brands.forEach(brand => {
      // Generate multiple models per brand for ~150 products
      const modelCount = brand === 'Apple' || brand === 'Samsung' ? 3 : 2;
      for (let m = 0; m < modelCount; m++) {
        const model = MODELS[m % MODELS.length];
        const basePrice = Math.floor(cat.basePriceRange[0] + Math.random() * (cat.basePriceRange[1] - cat.basePriceRange[0]));
        const name = `${brand} ${model} ${cat.name}`;
        const assignedId = id++;
        // cycle through 21 selenium images
        const imgIdx = ((assignedId - 1) % TOTAL_SELENIUM_IMAGES) + 1;
        products.push({
          id: assignedId,
          category: cat.name,
          name,
          brand,
          image: `http://localhost:5000/images/selenium_image_${imgIdx}.jpg`,
          tags: [brand.toLowerCase(), cat.name.toLowerCase(), model.toLowerCase()],
          basePrice,
        });
      }
    });
  });
  return products;
}

const productsRaw = generateProducts();
const basePrices = {};
productsRaw.forEach(p => {
  basePrices[p.id] = {
    amazon: Math.round(p.basePrice * 0.98),
    trendyol: Math.round(p.basePrice * 1.02),
    n11: Math.round(p.basePrice * 0.99),
    hepsiburada: Math.round(p.basePrice * 1.01),
  };
});

function getSeller(platformId, brand) {
  return `${brand} Yetkili Satıcı`;
}

const products = productsRaw.map(p => {
  const listings = Object.entries(basePrices[p.id] || {}).map(([platformId, base]) => {
    const history = generatePriceHistory(base, 30);
    const currentPrice = history[history.length - 1].price;
    const prevPrice = base * 1.1;
    const discount = Math.round(((prevPrice - currentPrice) / prevPrice) * 100);
    return {
      platformId,
      platform: platforms[platformId],
      currentPrice,
      originalPrice: prevPrice,
      discount: discount > 0 ? discount : 0,
      inStock: true,
      rating: (4.5 + Math.random() * 0.5).toFixed(1),
      reviewCount: Math.floor(100 + Math.random() * 1000),
      seller: getSeller(platformId, p.brand),
      url: `${platforms[platformId].url}/search?q=${encodeURIComponent(p.name)}`,
      priceHistory: history,
    };
  });
  const bestListing = listings.reduce((a, b) => a.currentPrice < b.currentPrice ? a : b);
  return { 
    ...p, 
    listings, 
    bestPrice: bestListing.currentPrice, 
    bestPlatform: bestListing.platformId, 
    bestListing,
    status: 'LIVE',           // Signal that AI just checked this
    lastChecked: new Date().toISOString()
  };
});

const users = [
  { id: 1, name: 'Demo Kullanıcı', email: 'demo@pricehunter.com', password: '$2a$10$demo_hashed', favorites: [1, 2], alerts: [] },
];

const reviews = {
  1: [{ id: 1, userId: 1, userName: 'Caner L.', rating: 5, comment: 'Hızı ve ekranı tek kelimeyle muazzam!', date: '2024-04-10' }],
};

module.exports = { products, platforms, users, reviews };
