const { Coupon, Cart, Product } = require('../models');
const ApiError = require('../utils/ApiError');

const validateCoupon = async (userId, code, cartItems = []) => {
  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    throw new ApiError(400, 'Coupon code is required.');
  }

  const cleanCode = code.toUpperCase().trim();
  const coupon = await Coupon.findOne({ code: cleanCode, isActive: true }).lean();
  if (!coupon) {
    throw new ApiError(404, 'Invalid or expired coupon code.');
  }

  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    throw new ApiError(400, 'Coupon code has expired.');
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(400, 'Coupon usage limit reached.');
  }

  let subtotal = 0;
  if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
    for (const item of cartItems) {
      const prodId = item.product?._id || item.product;
      const prod = await Product.findById(prodId).select('sellingPrice isActive').lean();
      if (prod && prod.isActive !== false) {
        subtotal += (prod.sellingPrice || 0) * (item.quantity || 1);
      }
    }
  } else {
    const cart = await Cart.findOne({ user: userId }).populate('items.product', 'sellingPrice isActive').lean();
    if (cart && cart.items && cart.items.length > 0) {
      for (const item of cart.items) {
        if (item.product && item.product.isActive !== false) {
          subtotal += (item.product.sellingPrice || 0) * (item.quantity || 1);
        }
      }
    }
  }

  if (subtotal <= 0) {
    throw new ApiError(400, 'Cannot apply coupon to an empty cart.');
  }

  if (coupon.minPurchaseAmount > 0 && subtotal < coupon.minPurchaseAmount) {
    throw new ApiError(400, 'Minimum order amount of ' + '₹' + coupon.minPurchaseAmount + ' required for coupon ' + cleanCode + '.');
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    const rawDiscount = Math.round((subtotal * coupon.discountAmount) / 100);
    discount = coupon.maxDiscountAmount > 0 ? Math.min(rawDiscount, coupon.maxDiscountAmount) : rawDiscount;
  } else {
    discount = Math.min(coupon.discountAmount, subtotal);
  }

  return {
    code: coupon.code,
    discountType: coupon.discountType,
    discountAmount: discount,
    minPurchaseAmount: coupon.minPurchaseAmount,
    message: 'Coupon code applied successfully.',
  };
};

module.exports = { validateCoupon };
