const fs = require('fs');
const path = require('path');
const { products: mockProducts, users: mockUsers } = require('../data/mockData');

const DB_PATH = path.join(__dirname, '../data/database.json');

class Database {
  constructor() {
    this.data = {
      products: [],
      users: [],
      favorites: {}, // { userId: [productId] }
      alerts: {},    // { userId: [alertObject] }
      reviews: {}    // { productId: [reviewObject] }
    };
    this.init();
  }

  init() {
    if (fs.existsSync(DB_PATH)) {
      try {
        const fileContent = fs.readFileSync(DB_PATH, 'utf8');
        this.data = JSON.parse(fileContent);
        console.log('Database loaded from disk.');
      } catch (err) {
        console.error('Error loading database:', err);
        this.reset();
      }
    } else {
      console.log('Database file not found, initializing with mock data.');
      this.reset();
    }
  }

  reset() {
    this.data.products = mockProducts;
    this.data.users = mockUsers;
    this.data.favorites = { '1': [1, 5, 10] };
    this.data.alerts = {};
    this.data.reviews = require('../data/mockData').reviews || {};
    this.save();
  }

  save() {
    try {
      const dataDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  // Generic methods
  get(collection) {
    return this.data[collection];
  }

  set(collection, value) {
    this.data[collection] = value;
    this.save();
  }

  // Specific helpers
  findUserById(id) {
    return this.data.users.find(u => u.id === parseInt(id) || u.id === id);
  }

  findProductById(id) {
    return this.data.products.find(p => p.id === parseInt(id));
  }

  getFavorites(userId) {
    return this.data.favorites[userId] || [];
  }

  addFavorite(userId, productId) {
    if (!this.data.favorites[userId]) this.data.favorites[userId] = [];
    if (!this.data.favorites[userId].includes(productId)) {
      this.data.favorites[userId].push(productId);
      this.save();
    }
  }

  removeFavorite(userId, productId) {
    if (this.data.favorites[userId]) {
      this.data.favorites[userId] = this.data.favorites[userId].filter(id => id !== productId);
      this.save();
    }
  }

  getAlerts(userId) {
    return this.data.alerts[userId] || [];
  }

  saveAlert(userId, alert) {
    if (!this.data.alerts[userId]) this.data.alerts[userId] = [];
    const index = this.data.alerts[userId].findIndex(a => a.id === alert.id || a.productId === alert.productId);
    if (index !== -1) {
      this.data.alerts[userId][index] = alert;
    } else {
      this.data.alerts[userId].push(alert);
    }
    this.save();
  }

  deleteAlert(userId, alertId) {
    if (this.data.alerts[userId]) {
      this.data.alerts[userId] = this.data.alerts[userId].filter(a => a.id !== parseInt(alertId));
      this.save();
    }
  }
}

const db = new Database();
module.exports = db;
