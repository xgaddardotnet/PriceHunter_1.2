const axios = require('axios');

/**
 * NotificationService
 * Handles sending alerts to users via Telegram, Email, and internal logs.
 */
class NotificationService {
  constructor() {
    this.telegramToken = process.env.TELEGRAM_BOT_TOKEN || null;
    this.smtpConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    };
  }

  /**
   * Main entry point for sending a price alert
   * @param {Object} alertData { user, product, targetPrice, currentPrice }
   */
  async sendPriceAlert(alertData) {
    const { user, product, targetPrice, currentPrice } = alertData;
    const savings = targetPrice - currentPrice;
    
    console.log(`[Notification] 🔔 Alert triggered for ${user.email} on product: ${product.name}`);
    console.log(`[Notification] Target: ${targetPrice} ₺ | Current: ${currentPrice} ₺`);

    const message = `
🚀 *Fiyat Fırsatı Yakalandı!*

*${product.name}* ürünü hedeflediğiniz fiyata düştü!

🎯 Hedef Fiyat: ${targetPrice.toLocaleString('tr-TR')} ₺
📉 Güncel Fiyat: ${currentPrice.toLocaleString('tr-TR')} ₺
💰 Kazancınız: ${Math.abs(savings).toLocaleString('tr-TR')} ₺

Hemen incelemek için tıklayın:
http://localhost:3000/product/${product.id}
    `;

    // 1. Send to Console/System Log
    this.sendToLog(message);

    // 2. Send to Telegram (if user has telegramId)
    if (user.telegramId) {
      await this.sendTelegramMessage(user.telegramId, message);
    }

    // 3. Send to Email
    await this.sendEmail(user.email, 'PriceHunter AI - Fiyat Alarmı!', message);
  }

  sendToLog(msg) {
    console.log('--- SYSTEM ALERT ---');
    console.log(msg);
    console.log('--------------------');
  }

  async sendTelegramMessage(chatId, text) {
    if (!this.telegramToken) {
      console.warn('[Notification] Telegram token missing, skipping message.');
      return;
    }
    try {
      const url = `https://api.telegram.org/bot${this.telegramToken}/sendMessage`;
      await axios.post(url, {
        chat_id: chatId,
        text,
        parse_mode: 'Markdown'
      });
      console.log(`[Notification] Telegram message sent to ${chatId}`);
    } catch (err) {
      console.error('[Notification] Error sending Telegram message:', err.message);
    }
  }

  async sendEmail(to, subject, text) {
    // This would use nodemailer
    // For now, we simulate success
    console.log(`[Notification] Email simulation: Sending to ${to}...`);
    // await transporter.sendMail({ from: 'no-reply@pricehunter.ai', to, subject, text });
  }
}

module.exports = new NotificationService();
