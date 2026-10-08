const orderService = require('../services/orderService');
const { sendSuccess } = require('../utils/apiResponse');

const previewOrder = async (req, res, next) => {
  try {
    const summary = await orderService.previewCheckout(req.user._id, req.body.addressId, req.body.couponCode);
    return sendSuccess(res, 200, 'Checkout preview calculated successfully', summary);
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user._id, req.body);
    return sendSuccess(res, 201, 'Order created successfully', order);
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const { orders, pagination } = await orderService.getUserOrders(
      req.user._id,
      req.query.page,
      req.query.limit
    );
    return sendSuccess(res, 200, 'Orders retrieved successfully', orders, pagination);
  } catch (error) {
    next(error);
  }
};

const getOrderByNumber = async (req, res, next) => {
  try {
    const order = await orderService.getOrderByNumber(req.user._id, req.params.orderNumber);
    return sendSuccess(res, 200, 'Order details fetched successfully', order);
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(
      req.user._id,
      req.params.orderNumber,
      req.body.reason
    );
    return sendSuccess(res, 200, 'Order cancelled successfully', order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  previewOrder,
  createOrder,
  getUserOrders,
  getOrderByNumber,
  cancelOrder,
};
