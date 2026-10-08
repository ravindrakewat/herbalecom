/**
 * Centralized Tax Calculation Service
 * Standard configurable GST rate (e.g. 0% by default unless specified via env)
 */
const TAX_RATE = parseFloat(process.env.TAX_RATE || '0.00'); // 0.05 for 5%

const calculateTax = (subtotal) => {
  if (!subtotal || subtotal <= 0) return 0;
  return Math.round(subtotal * TAX_RATE);
};

module.exports = {
  calculateTax,
  TAX_RATE,
};
