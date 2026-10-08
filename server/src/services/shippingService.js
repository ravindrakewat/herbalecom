/**
 * Centralized Shipping Calculation Service
 * Standard rule: Orders >= ₹999 get free shipping. Otherwise ₹50 standard shipping charge.
 */
const FREE_SHIPPING_THRESHOLD = parseFloat(process.env.FREE_SHIPPING_THRESHOLD || '999');
const DEFAULT_SHIPPING_CHARGE = parseFloat(process.env.DEFAULT_SHIPPING_CHARGE || '50');

const calculateShipping = (subtotal, shippingAddress = null) => {
  if (!subtotal || subtotal <= 0) return 0;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return DEFAULT_SHIPPING_CHARGE;
};

module.exports = {
  calculateShipping,
  FREE_SHIPPING_THRESHOLD,
  DEFAULT_SHIPPING_CHARGE,
};
