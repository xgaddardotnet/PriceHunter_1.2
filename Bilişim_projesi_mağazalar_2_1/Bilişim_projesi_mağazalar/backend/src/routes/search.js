const express = require('express');
const router = express.Router();
const { fuse, getCache, setCache, getProducts } = require('../services/aiService');

// GET /api/search?q=iphone&category=...&sortBy=price&platform=...
router.get('/', (req, res) => {
  const { q = '', category, sortBy = 'bestPrice', platform, minPrice, maxPrice, page = 1, limit = 5000 } = req.query;
  const products = getProducts();
  
  if (!q.trim()) {
    // Return all or filtered products if no query
    let results = products;
    if (category) results = results.filter(p => p.category === category);
    if (platform) results = results.filter(p => p.listings.some(l => l.platformId === platform));
    if (minPrice) results = results.filter(p => p.bestPrice >= parseFloat(minPrice));
    if (maxPrice) results = results.filter(p => p.bestPrice <= parseFloat(maxPrice));
    
    const total = results.length;
    const start = (parseInt(page) - 1) * parseInt(limit);
    const paginated = results.slice(start, start + parseInt(limit));
    return res.json({ results: paginated, total, query: q, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  }

  const cacheKey = `search:${q}:${category}:${sortBy}:${platform}:${minPrice}:${maxPrice}:${page}`;
  const cached = getCache(cacheKey);
  if (cached) return res.json({ ...cached, fromCache: true });

  let results = q.length > 1 ? fuse.search(q).map(r => ({ ...r.item, score: r.score })) : products;

  // Filters
  if (category) results = results.filter(p => p.category === category);
  if (platform) results = results.filter(p => p.listings.some(l => l.platformId === platform));
  if (minPrice) results = results.filter(p => p.bestPrice >= parseFloat(minPrice));
  if (maxPrice) results = results.filter(p => p.bestPrice <= parseFloat(maxPrice));

  // Sort
  if (sortBy === 'bestPrice') results.sort((a, b) => a.bestPrice - b.bestPrice);
  else if (sortBy === 'bestPrice_desc') results.sort((a, b) => b.bestPrice - a.bestPrice);
  else if (sortBy === 'discount') results.sort((a, b) => {
    const discA = Math.max(...a.listings.map(l => l.discount));
    const discB = Math.max(...b.listings.map(l => l.discount));
    return discB - discA;
  });
  else if (sortBy === 'rating') results.sort((a, b) => {
    const rA = Math.max(...a.listings.map(l => parseFloat(l.rating)));
    const rB = Math.max(...b.listings.map(l => parseFloat(l.rating)));
    return rB - rA;
  });

  const total = results.length;
  const start = (parseInt(page) - 1) * parseInt(limit);
  const paginated = results.slice(start, start + parseInt(limit));

  const data = { results: paginated, total, query: q, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) };
  setCache(cacheKey, data);
  res.json(data);
});

// GET /api/search/suggestions?q=...
router.get('/suggestions', (req, res) => {
  const { q = '' } = req.query;
  if (q.length < 2) return res.json([]);
  const results = fuse.search(q, { limit: 5 });
  const suggestions = results.map(r => ({ id: r.item.id, name: r.item.name, category: r.item.category, bestPrice: r.item.bestPrice }));
  res.json(suggestions);
});

// GET /api/search/categories
router.get('/categories', (req, res) => {
  const products = getProducts();
  const cats = [...new Set(products.map(p => p.category))];
  res.json(cats);
});

module.exports = router;

