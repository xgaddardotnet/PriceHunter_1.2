require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const searchRoutes = require('./routes/search');
const productRoutes = require('./routes/products');
const alertRoutes = require('./routes/alerts');
const favoriteRoutes = require('./routes/favorites');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve local product images from project root selenium_product_images folder
app.use('/images', express.static(path.join(__dirname, '..', '..', 'selenium_product_images')));

// Routes
app.use('/api/search', searchRoutes);
app.use('/api/products', productRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PriceHunter AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: ['/api/search', '/api/products', '/api/alerts', '/api/favorites', '/api/reviews', '/api/auth'],
  });
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  const db = require('./lib/db');
  const products = db.get('products');
  res.json({
    totalProducts: products.length,
    platforms: 4,
    avgPrice: Math.round(products.reduce((s, p) => s + p.bestPrice, 0) / products.length),
    categories: [...new Set(products.map(p => p.category))].length,
  });
});

// 404
app.use((req, res) => res.status(404).json({ error: 'Endpoint bulunamadı' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Sunucu hatası' });
});

module.exports = app;
