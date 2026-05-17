const app = require('./app');
const scraperService = require('./services/scraperService');
const aiService = require('./services/aiService');

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`\n🚀 PriceHunter AI Backend çalışıyor: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  
  // Start background monitoring task
  console.log('[System] Background monitoring started...');
  setInterval(async () => {
    try {
      const products = aiService.getProducts();
      // Only check a subset or all depending on scale
      const updates = await scraperService.updateAllProductPrices(products.slice(0, 5));
      await aiService.processPriceUpdates(updates);
    } catch (err) {
      console.error('[System] Monitoring task error:', err.message);
    }
  }, 60000); // Check every 60 seconds for demo (production: 10-30 mins)
});
