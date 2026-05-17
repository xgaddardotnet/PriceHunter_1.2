const express = require('express');
const router = express.Router();
const db = require('../lib/db');

// GET /api/alerts
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id'] || '1';
  const alerts = db.getAlerts(userId).map(alert => {
    const product = db.findProductById(alert.productId);
    const triggered = product && product.bestPrice <= alert.targetPrice;
    return { 
      ...alert, 
      product: product ? { 
        id: product.id, 
        name: product.name, 
        image: product.image, 
        bestPrice: product.bestPrice, 
        bestPlatform: product.bestPlatform 
      } : null, 
      triggered 
    };
  });
  res.json(alerts);
});

// POST /api/alerts
router.post('/', (req, res) => {
  const userId = req.headers['x-user-id'] || '1';
  const { productId, targetPrice } = req.body;
  
  if (!productId || !targetPrice) {
    return res.status(400).json({ error: 'productId ve targetPrice gerekli' });
  }
  
  const product = db.findProductById(parseInt(productId));
  if (!product) {
    return res.status(404).json({ error: 'Ürün bulunamadı' });
  }

  const alert = { 
    id: Date.now(), 
    productId: parseInt(productId), 
    targetPrice: parseFloat(targetPrice), 
    createdAt: new Date().toISOString(), 
    active: true 
  };
  
  db.saveAlert(userId, alert);
  res.status(201).json({ message: 'Alarm oluşturuldu', alert });
});

// DELETE /api/alerts/:id
router.delete('/:id', (req, res) => {
  const userId = req.headers['x-user-id'] || '1';
  db.deleteAlert(userId, req.params.id);
  res.json({ message: 'Alarm silindi' });
});

module.exports = router;

