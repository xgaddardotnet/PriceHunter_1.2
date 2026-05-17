const db = require('../lib/db');
const Fuse = require('fuse.js');
const notificationService = require('./notificationService');

// AI-powered fuzzy search
const fuseOptions = {
  keys: [
    { name: 'name', weight: 0.6 },
    { name: 'brand', weight: 0.3 },
    { name: 'category', weight: 0.2 },
    { name: 'tags', weight: 0.4 },
  ],
  threshold: 0.3, // More strict to avoid irrelevant results
  includeScore: true,
  minMatchCharLength: 2,
  useExtendedSearch: true, // Allows for better keyword matching
};

// We use database products - initialized at startup
const fuse = new Fuse(db.get('products'), fuseOptions);

// Function to refresh fuse index when database products change
function refreshSearchIndex() {
  fuse.setCollection(db.get('products'));
}

// Linear regression price prediction
function predictPrice(priceHistory, daysAhead = 30) {
  if (!priceHistory || priceHistory.length < 10) return null;
  const n = priceHistory.length;
  const x = priceHistory.map((_, i) => i);
  const y = priceHistory.map(h => h.price);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const predictedPrice = intercept + slope * (n + daysAhead);
  // Confidence: R²
  const yMean = sumY / n;
  const ssTot = y.reduce((acc, yi) => acc + Math.pow(yi - yMean, 2), 0);
  const ssRes = y.reduce((acc, yi, i) => acc + Math.pow(yi - (intercept + slope * x[i]), 2), 0);
  const r2 = Math.max(0, Math.min(1, 1 - ssRes / ssTot));
  return {
    predictedPrice: Math.max(0, Math.round(predictedPrice * 100) / 100),
    confidence: Math.round(r2 * 100),
    trend: slope > 0.5 ? 'rising' : slope < -0.5 ? 'falling' : 'stable',
    daysAhead,
  };
}

// In-memory simple LRU cache (simulates Redis)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data;
}
function setCache(key, data) {
  if (cache.size > 100) cache.delete(cache.keys().next().value); // evict oldest
  cache.set(key, { data, ts: Date.now() });
}

// Price change alerts check
function checkAlerts(productId) {
  const product = db.findProductById(productId);
  if (!product) return [];
  const triggered = [];
  const users = db.get('users');
  users.forEach(user => {
    const alerts = db.getAlerts(user.id);
    const alert = (alerts || []).find(a => a.productId === parseInt(productId) && !a.triggered);
    if (alert && product.bestPrice <= alert.targetPrice) {
      triggered.push({ user, alert, product });
    }
  });
  return triggered;
}

/**
 * Processes price updates and notifies users if targets are hit
 */
async function processPriceUpdates(updates) {
  console.log(`[AI-Service] Processing ${updates.length} product updates for alerts...`);
  
  for (const update of updates) {
    const product = db.findProductById(update.id);
    if (!product) continue;

    // Update product platform prices and bestPrice in DB
    product.platformPrices = update.platformPrices;
    product.bestPrice = update.bestPrice;
    product.updatedAt = new Date().toISOString();
    
    // Check for triggered alerts
    const triggered = checkAlerts(product.id);
    
    for (const item of triggered) {
      // Send notification
      await notificationService.sendPriceAlert({
        user: item.user,
        product: item.product,
        targetPrice: item.alert.targetPrice,
        currentPrice: item.product.bestPrice
      });

      // Mark alert as triggered so they don't get spammed
      item.alert.triggered = true;
      item.alert.triggeredAt = new Date().toISOString();
    }
  }
  
  db.save();
}

module.exports = { 
  fuse, 
  predictPrice, 
  getCache, 
  setCache, 
  getProducts: () => db.get('products'), 
  checkAlerts,
  processPriceUpdates,
  refreshSearchIndex
};

