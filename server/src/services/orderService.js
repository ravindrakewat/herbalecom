const { Order, Cart, Address, Product, Payment } = require('../models');
const ApiError = require('../utils/ApiError');
const { calculateShipping } = require('./shippingService');
const { calculateTax } = require('./taxService');
const { generateOrderNumber } = require('../utils/orderNumberGenerator');

/**
 * Validates cart and address, calculates complete checkout summary dynamically from DB Product prices.
 */
const validateAndCalculateCheckout = async (userId, addressId) => {
  const cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name slug sku thumbnail sellingPrice mrp stockQuantity trackInventory isActive',
  });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new ApiError(400, 'Checkout failed: Your cart is empty.');
  }

  const validAddress = await Address.findOne({ _id: addressId, user: userId }).lean();
  if (!validAddress) {
    throw new ApiError(400, 'Invalid shipping address. Please select a valid address from your account.');
  }

  let subtotal = 0;
  const itemsSnapshot = [];

  for (const item of cart.items) {
    const prod = item.product;
    if (!prod || prod.isActive === false) {
      throw new ApiError(400, `Product "${prod ? prod.name : 'Item'}" is no longer available.`);
    }

    if (prod.trackInventory && item.quantity > prod.stockQuantity) {
      throw new ApiError(
        400,
        `Insufficient stock for "${prod.name}". Available: ${prod.stockQuantity}, Requested: ${item.quantity}`
      );
    }

    const sellingPrice = prod.sellingPrice;
    const mrp = prod.mrp || sellingPrice;
    const itemSubtotal = sellingPrice * item.quantity;
    subtotal += itemSubtotal;

    itemsSnapshot.push({
      product: prod._id,
      name: prod.name,
      sku: prod.sku || '',
      thumbnail: prod.thumbnail || '',
      quantity: item.quantity,
      mrp,
      sellingPrice,
      discount: Math.max(0, mrp - sellingPrice),
      subtotal: itemSubtotal,
    });
  }

  const shippingCharge = calculateShipping(subtotal, validAddress);
  const tax = calculateTax(subtotal);
  const grandTotal = subtotal + shippingCharge + tax;

  return {
    cart,
    addressSnapshot: {
      fullName: validAddress.fullName,
      phone: validAddress.phone,
      addressLine1: validAddress.addressLine1,
      addressLine2: validAddress.addressLine2 || '',
      area: validAddress.area || '',
      city: validAddress.city,
      state: validAddress.state,
      pincode: validAddress.pincode,
      landmark: validAddress.landmark || '',
      country: validAddress.country || 'India',
    },
    itemsSnapshot,
    subtotal,
    discount: 0,
    shippingCharge,
    tax,
    grandTotal,
  };
};

/**
 * Preview checkout summary without creating order or deducting inventory
 */
const previewCheckout = async (userId, addressId, couponCode = '') => {
  const calc = await validateAndCalculateCheckout(userId, addressId, couponCode);
  return {
    items: calc.itemsSnapshot,
    shippingAddress: calc.addressSnapshot,
    subtotal: calc.subtotal,
    shippingCharge: calc.shippingCharge,
    tax: calc.tax,
    grandTotal: calc.grandTotal,
  };
};

/**
 * Create Order (COD or Online initiation)
 */
const createOrder = async (userId, { addressId, paymentMethod = 'COD', couponCode = '', idempotencyKey = '' }) => {
  const calc = await validateAndCalculateCheckout(userId, addressId);
  const orderNumber = generateOrderNumber();

  const isCOD = paymentMethod === 'COD';

  const order = new Order({
    orderNumber,
    user: userId,
    items: calc.itemsSnapshot,
    shippingAddress: calc.addressSnapshot,
    billingAddress: calc.addressSnapshot,
    subtotal: calc.subtotal,
    shippingCharge: calc.shippingCharge,
    tax: calc.tax,
    grandTotal: calc.grandTotal,
    paymentMethod: isCOD ? 'COD' : 'ONLINE',
    paymentStatus: 'PENDING',
    orderStatus: isCOD ? 'PLACED' : 'PAYMENT_PENDING',
    idempotencyKey,
    placedAt: isCOD ? new Date() : null,
  });

  await order.save();

  if (isCOD) {
    // Atomic inventory deduction for COD
    for (const item of calc.itemsSnapshot) {
      await Product.updateOne(
        { _id: item.product, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } }
      );
    }

    // Create Payment Record for COD
    await Payment.create({
      user: userId,
      order: order._id,
      provider: 'COD',
      providerOrderId: `COD_${orderNumber}`,
      amount: calc.grandTotal,
      status: 'PENDING',
      method: 'COD',
    });

    // Clear cart
    await Cart.updateOne({ user: userId }, { $set: { items: [] } });
  }

  return order;
};

/**
 * Get User Order History
 */
const getUserOrders = async (userId, page = 1, limit = 10) => {
  const p = Math.max(1, parseInt(page) || 1);
  const l = Math.min(50, Math.max(1, parseInt(limit) || 10));
  const skip = (p - 1) * l;

  const filter = { user: userId };
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l).lean(),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      total,
      page: p,
      limit: l,
      pages: Math.ceil(total / l),
    },
  };
};

/**
 * Get Order Details with Strict IDOR check
 */
const getOrderByNumber = async (userId, orderNumber) => {
  const order = await Order.findOne({ orderNumber, user: userId }).lean();
  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }
  return order;
};

/**
 * Cancel Order
 */
const cancelOrder = async (userId, orderNumber, reason = '') => {
  const order = await Order.findOne({ orderNumber, user: userId });
  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  const cancellableStatuses = ['PAYMENT_PENDING', 'PLACED', 'CONFIRMED'];
  if (!cancellableStatuses.includes(order.orderStatus)) {
    throw new ApiError(400, `Order cannot be cancelled in its current state (${order.orderStatus}).`);
  }

  const wasStockDeducted = order.orderStatus === 'CONFIRMED' || order.paymentMethod === 'COD';

  order.orderStatus = 'CANCELLED';
  order.cancelledAt = new Date();
  order.cancelReason = reason || 'Cancelled by customer';
  await order.save();

  // Restore inventory if stock was previously deducted
  if (wasStockDeducted && order.items && order.items.length > 0) {
    for (const item of order.items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stockQuantity: item.quantity } });
    }
  }

  return order;
};

module.exports = {
  previewCheckout,
  createOrder,
  getUserOrders,
  getOrderByNumber,
  cancelOrder,
  validateAndCalculateCheckout,
};
