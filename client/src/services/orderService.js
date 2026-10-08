import api from './api';

export const previewCheckout = async (addressId) => {
  const response = await api.post('/orders/preview', { addressId });
  return response.data;
};

export const createOrder = async ({ addressId, paymentMethod = 'COD' }) => {
  const response = await api.post('/orders', { addressId, paymentMethod });
  return response.data;
};

export const getUserOrders = async (page = 1, limit = 10) => {
  const response = await api.get('/orders', { params: { page, limit } });
  return response.data;
};

export const getOrderByNumber = async (orderNumber) => {
  const response = await api.get(`/orders/${orderNumber}`);
  return response.data;
};

export const cancelOrder = async (orderNumber, reason = '') => {
  const response = await api.post(`/orders/${orderNumber}/cancel`, { reason });
  return response.data;
};

export default {
  previewCheckout,
  createOrder,
  getUserOrders,
  getOrderByNumber,
  cancelOrder,
};
