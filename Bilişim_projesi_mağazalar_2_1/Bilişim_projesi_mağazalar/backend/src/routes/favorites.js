const express = require('express');
const router = express.Router();
const db = require('../lib/db');

// GET /api/favorites
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id'] || '1';
  const ids = db.getFavorites(userId);
  const favoriteProducts = ids.map(id => {
    const p = db.findProductById(id);
    if (!p) return null;
    return { 
      id: p.id, 
      name: p.name, 
      brand: p.brand, 
      category: p.category, 
      image: p.image, 
      bestPrice: p.bestPrice, 
      bestPlatform: p.bestPlatform, 
      bestListing: p.listings.find(l => l.platformId === p.bestPlatform) 
    };
  }).filter(Boolean);
  res.json(favoriteProducts);
});

// POST /api/favorites/:productId
router.post('/:productId', (req, res) => {
  const userId = req.headers['x-user-id'] || '1';
  const productId = parseInt(req.params.productId);
  
  const ids = db.getFavorites(userId);
  if (ids.includes(productId)) {
    return res.json({ message: 'Zaten favorilerde', isFavorite: true });
  }
  
  db.addFavorite(userId, productId);
  res.status(201).json({ message: 'Favorilere eklendi', isFavorite: true });
});

// DELETE /api/favorites/:productId
router.delete('/:productId', (req, res) => {
  const userId = req.headers['x-user-id'] || '1';
  const productId = parseInt(req.params.productId);
  
  db.removeFavorite(userId, productId);
  res.json({ message: 'Favorilerden kaldırıldı', isFavorite: false });
});

// GET /api/favorites/check/:productId
router.get('/check/:productId', (req, res) => {
  const userId = req.headers['x-user-id'] || '1';
  const productId = parseInt(req.params.productId);
  const isFavorite = db.getFavorites(userId).includes(productId);
  res.json({ isFavorite });
});

module.exports = router;

