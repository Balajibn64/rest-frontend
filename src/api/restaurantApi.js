import axiosInstance from './axiosInstance';

const BASE_URL = 'http://localhost:8080/api/restaurant'; // Replace with backend base URL

// ✅ Get all menu items
export const getMenuItems = () => axiosInstance.get(`${BASE_URL}/menu`);

// ✅ Add a new menu item
export const addMenuItem = (itemData) => axiosInstance.post(`${BASE_URL}/menu`, itemData);

// ✅ Update menu item
export const updateMenuItem = (id, itemData) => axiosInstance.put(`${BASE_URL}/menu/${id}`, itemData);

// ✅ Delete menu item
export const deleteMenuItem = (id) => axiosInstance.delete(`${BASE_URL}/menu/${id}`);

// ✅ Get restaurant profile (details) - now uses GET
export const getRestaurantProfile = () =>
  axiosInstance.get('/restaurant/details');

// ✅ Update restaurant profile (details)
export const updateRestaurantProfile = (profileData, profilePic) => {
  const formData = new FormData();
  if (profileData) {
    formData.append('update', JSON.stringify(profileData));
  }
  if (profilePic) {
    formData.append('profilePic', profilePic);
  }
  return axiosInstance.post('/restaurant/details', formData);
};

// ✅ Get all orders for this restaurant
export const getRestaurantOrders = () => axiosInstance.get(`${BASE_URL}/orders`);

// ✅ Update order status
export const updateOrderStatus = (orderId, status) =>
  axiosInstance.put(`${BASE_URL}/orders/${orderId}/status`, { status });

// ✅ Get restaurant dashboard statistics
export const getRestaurantDashboardStats = () => axiosInstance.get(`${BASE_URL}/dashboard`);

// Address APIs
export const getRestaurantAddress = (id) =>
  axiosInstance.get(`/restaurant/address?id=${id}`);

export const addRestaurantAddress = (data) =>
  axiosInstance.post('/restaurant/address', data);

export const updateRestaurantAddress = (data) =>
  axiosInstance.put('/restaurant/address', data);

export const deleteRestaurantAddress = (data) =>
  axiosInstance.delete('/restaurant/address', { data });

// Order Management APIs
export const getCurrentOrders = () =>
  axiosInstance.get('/restaurant/receiveOrders');

export const acceptOrRejectOrder = (orderId, accept) =>
  axiosInstance.put('/restaurant/acceptOrRejectOrder', { oId: orderId, accept });

export const getAcceptedOrders = () =>
  axiosInstance.get('/restaurant/acceptedOrders');

export const getDeliveredOrders = () =>
  axiosInstance.get('/restaurant/deliveredOrders');