const mongoose = require('mongoose');

const storeSettingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'Herbal E-Commerce' },
    supportEmail: { type: String, default: 'support@herbal.com' },
    supportPhone: { type: String, default: '+91 98765 43210' },
    currency: { type: String, default: '₹' },
    freeShippingThreshold: { type: Number, default: 999 },
    defaultShippingCharge: { type: Number, default: 50 },
    taxRate: { type: Number, default: 0.00 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StoreSettings', storeSettingsSchema);
