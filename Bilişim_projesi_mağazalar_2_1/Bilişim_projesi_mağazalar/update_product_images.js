const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'src', 'data', 'database.json');
const imagesDir = path.join(__dirname, 'frontend', 'public', 'magaza_resimler');

if (!fs.existsSync(dbPath)) {
  console.error('Database file not found at:', dbPath);
  process.exit(1);
}

if (!fs.existsSync(imagesDir)) {
  console.error('Images directory not found at:', imagesDir);
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const files = fs.readdirSync(imagesDir);

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Group images by prefix/category and shuffle them
const imageGroups = {
  saat: shuffleArray(files.filter(f => f.includes('saat'))),
  telefon: shuffleArray(files.filter(f => f.includes('telefon'))),
  aksesuar: shuffleArray(files.filter(f => f.includes('aksesuar'))),
  ayakkabi: shuffleArray(files.filter(f => f.includes('ayakkabi'))),
  elbise: shuffleArray(files.filter(f => f.includes('elbise') || f.includes('tişört') || f.includes('tisort'))),
  ev_esyalari: shuffleArray(files.filter(f => f.includes('ev_esyalari'))),
  kamera: shuffleArray(files.filter(f => f.includes('kamera'))),
  kulaklik: shuffleArray(files.filter(f => f.includes('kulaklik') || f.includes('kulaklık'))),
  laptop: shuffleArray(files.filter(f => f.includes('laptop') || f.includes('laptob') || f.includes('labtop'))),
  monitor: shuffleArray(files.filter(f => f.includes('monitor'))),
  oyun_konsolu: shuffleArray(files.filter(f => f.includes('oyun_konsolu'))),
  tablet: shuffleArray(files.filter(f => f.includes('tablet'))),
  televizyon: shuffleArray(files.filter(f => f.includes('televizyon')))
};

const counters = {
  saat: 0, telefon: 0, aksesuar: 0, ayakkabi: 0, elbise: 0,
  ev_esyalari: 0, kamera: 0, kulaklik: 0, laptop: 0, monitor: 0,
  oyun_konsolu: 0, tablet: 0, televizyon: 0, fallback: 0
};

// Map function to find the best image group key
function getGroupKeyForProduct(product) {
  const text = (product.category + ' ' + product.name + ' ' + (product.tags || []).join(' ')).toLowerCase();
  
  if (text.includes('saat')) return 'saat';
  if (text.includes('telefon')) return 'telefon';
  if (text.includes('aksesuar') || text.includes('bileklik') || text.includes('yüzük') || text.includes('kolye') || text.includes('çanta')) return 'aksesuar';
  if (text.includes('ayakkab')) return 'ayakkabi';
  if (text.includes('elbise') || text.includes('tişört') || text.includes('tisort')) return 'elbise';
  if (text.includes('ev') || text.includes('bardak') || text.includes('tencere') || text.includes('çaydanlık')) return 'ev_esyalari';
  if (text.includes('kamera') || text.includes('fotoğraf')) return 'kamera';
  if (text.includes('kulaklık') || text.includes('kulaklik')) return 'kulaklik';
  if (text.includes('laptop') || text.includes('bilgisayar') || text.includes('dizüstü')) return 'laptop';
  if (text.includes('monitör') || text.includes('monitor')) return 'monitor';
  if (text.includes('konsol') || text.includes('playstation') || text.includes('xbox')) return 'oyun_konsolu';
  if (text.includes('tablet') || text.includes('ipad')) return 'tablet';
  if (text.includes('televizyon') || text.includes('tv')) return 'televizyon';
  
  return 'fallback'; 
}

let updated = 0;

db.products = db.products.map(product => {
  const key = getGroupKeyForProduct(product);
  
  if (key !== 'fallback') {
    const group = imageGroups[key];
    if (group.length > 0) {
      const idx = counters[key] % group.length;
      product.image = '/magaza_resimler/' + group[idx];
      counters[key]++;
      updated++;
    }
  } else {
    // fallback logic
    const fallbackImage = files[counters.fallback % files.length];
    product.image = '/magaza_resimler/' + fallbackImage;
    counters.fallback++;
    updated++;
  }
  return product;
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`Successfully mapped images for ${updated} out of ${db.products.length} products using round-robin distribution.`);

