const express = require('express');
const router = express.Router();

// In-memory reviews store
const reviewsStore = {
  1: [
    { id: 1, userId: '1', userName: 'Ahmet K.', rating: 5, comment: 'Mükemmel telefon, fiyat performans dengesi harika! Kesinlikle tavsiye ederim.', date: '2024-03-15', platform: 'trendyol' },
    { id: 2, userId: null, userName: 'Zeynep A.', rating: 4, comment: 'Çok iyi ürün, kamera kalitesi üst düzey. Pil ömrü biraz daha iyi olabilirdi.', date: '2024-03-10', platform: 'amazon' },
    { id: 3, userId: null, userName: 'Mehmet Y.', rating: 5, comment: 'Beklentilerimin çok üzerinde bir ürün. Tasarımı ve performansı mükemmel.', date: '2024-02-28', platform: 'hepsiburada' },
  ],
  5: [
    { id: 4, userId: null, userName: 'Selin T.', rating: 5, comment: 'M3 çipi inanılmaz hızlı. MacBook Pro\'yu bir kez kullandın mı bırakamazsın.', date: '2024-03-20', platform: 'amazon' },
  ],
};

let nextReviewId = 100;

// GET /api/reviews/:productId
router.get('/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const reviews = reviewsStore[productId] || [];
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  res.json({ reviews, avgRating: Math.round(avgRating * 10) / 10, total: reviews.length });
});

// POST /api/reviews/:productId
router.post('/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const { userName, rating, comment, platform } = req.body;
  if (!userName || !rating || !comment) return res.status(400).json({ error: 'Kullanıcı adı, puan ve yorum gerekli' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Puan 1-5 arasında olmalı' });
  if (!reviewsStore[productId]) reviewsStore[productId] = [];
  const review = { id: nextReviewId++, userId: req.headers['x-user-id'] || null, userName, rating: parseInt(rating), comment, date: new Date().toISOString().split('T')[0], platform: platform || 'genel' };
  reviewsStore[productId].unshift(review);
  res.status(201).json({ message: 'Yorum eklendi', review });
});

module.exports = router;
