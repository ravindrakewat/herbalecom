import api from './api';

export const getAddresses = async () => {
  const response = await api.get('/users/addresses');
  return response.data;
};

export const addAddress = async (addressData) => {
  const response = await api.post('/users/addresses', addressData);
  return response.data;
};

export const updateAddress = async (addressId, addressData) => {
  const response = await api.put(`/users/addresses/${addressId}`, addressData);
  return response.data;
};

export const deleteAddress = async (addressId) => {
  const response = await api.delete(`/users/addresses/${addressId}`);
  return response.data;
};

export default {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
