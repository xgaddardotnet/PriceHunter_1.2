const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const { predictPrice } = require('../services/aiService');

// GET /api/products - list all
router.get('/', (req, res) => {
  const products = db.get('products');
  const summary = products.map(p => ({
    id: p.id, name: p.name, brand: p.brand, category: p.category,
    image: p.image, bestPrice: p.bestPrice, bestPlatform: p.bestPlatform,
    platformCount: p.listings.length,
    bestListing: p.listings.find(l => l.platformId === p.bestPlatform),
    status: p.status,
  }));
  res.json(summary);
});

// GET /api/products/:id - full product detail
router.get('/:id', (req, res) => {
  const product = db.findProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Ürün bulunamadı' });
  res.json(product);
});

// GET /api/products/:id/listings - all platform listings
router.get('/:id/listings', (req, res) => {
  const product = db.findProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Ürün bulunamadı' });
  const sorted = [...product.listings].sort((a, b) => a.currentPrice - b.currentPrice);
  res.json(sorted);
});

// GET /api/products/:id/history?platform=trendyol
router.get('/:id/history', (req, res) => {
  const product = db.findProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Ürün bulunamadı' });
  const { platform } = req.query;
  if (platform) {
    const listing = product.listings.find(l => l.platformId === platform);
    if (!listing) return res.status(404).json({ error: 'Platform bulunamadı' });
    return res.json({ platform, history: listing.priceHistory });
  }
  // Return all platforms
  const allHistory = product.listings.map(l => ({ platform: l.platformId, platformName: l.platform.name, color: l.platform.color, history: l.priceHistory }));
  res.json(allHistory);
});

// GET /api/products/:id/predict?platform=trendyol&days=30
router.get('/:id/predict', (req, res) => {
  const product = db.findProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Ürün bulunamadı' });
  const { platform, days = 30 } = req.query;
  const listing = platform
    ? product.listings.find(l => l.platformId === platform)
    : product.listings.find(l => l.platformId === product.bestPlatform);
  if (!listing) return res.status(404).json({ error: 'Platform bulunamadı' });
  const prediction = predictPrice(listing.priceHistory, parseInt(days));
  res.json({ productId: product.id, platform: listing.platformId, currentPrice: listing.currentPrice, prediction });
});

// GET /api/products/category/:category
router.get('/category/:category', (req, res) => {
  const products = db.get('products');
  const filtered = products.filter(p => p.category === decodeURIComponent(req.params.category));
  res.json(filtered);
});

module.exports = router;

