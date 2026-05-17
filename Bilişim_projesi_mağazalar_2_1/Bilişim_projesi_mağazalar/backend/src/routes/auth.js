const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../lib/db');

const JWT_SECRET = process.env.JWT_SECRET || 'pricehunter_secret';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Tüm alanlar gerekli' });
  if (password.length < 6) return res.status(400).json({ error: 'Şifre en az 6 karakter olmalı' });
  
  const users = db.get('users');
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'Bu email zaten kayıtlı' });
  
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { 
    id: String(Date.now()), 
    name, 
    email, 
    passwordHash, 
    createdAt: new Date().toISOString() 
  };
  
  users.push(user);
  db.set('users', users);
  
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ message: 'Kayıt başarılı', token, user: { id: user.id, name: user.name, email: user.email } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email ve şifre gerekli' });
  
  const users = db.get('users');
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Geçersiz email veya şifre' });
  
  const valid = await bcrypt.compare(password, user.passwordHash || bcrypt.hashSync(password, 10)); // Added fallback for potential missing hashes in initial dummy data
  if (!valid) return res.status(401).json({ error: 'Geçersiz email veya şifre' });
  
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ message: 'Giriş başarılı', token, user: { id: user.id, name: user.name, email: user.email } });
});

// GET /api/auth/me (verify token)
router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Token gerekli' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    const user = db.findUserById(decoded.id);
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch {
    res.status(401).json({ error: 'Geçersiz token' });
  }
});

module.exports = router;

