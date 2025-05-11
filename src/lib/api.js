// API utility functions for the inventory management system

const API_URL = 'http://localhost:5000/api';

// Helper function to handle fetch requests
const fetchData = async (endpoint, options = {}) => {
  // Get token from localStorage
  const token = localStorage.getItem('authToken');
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Add authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API calls
export const loginUser = (credentials) => {
  return fetchData('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const registerUser = (userData) => {
  return fetchData('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

export const getCurrentUser = () => {
  return fetchData('/auth/me');
};

// Product API calls
export const getProducts = () => {
  return fetchData('/products');
};

export const getProduct = (id) => {
  return fetchData(`/products/${id}`);
};

export const createProduct = (productData) => {
  return fetchData('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  });
};

export const updateProduct = (id, productData) => {
  return fetchData(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  });
};

export const deleteProduct = (id) => {
  return fetchData(`/products/${id}`, {
    method: 'DELETE'
  });
};

export const searchProducts = (query) => {
  return fetchData(`/products/search?query=${encodeURIComponent(query)}`);
};

// Category API calls
export const getCategories = () => {
  return fetchData('/categories');
};

export const getCategory = (id) => {
  return fetchData(`/categories/${id}`);
};

export const createCategory = (categoryData) => {
  return fetchData('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData)
  });
};

export const updateCategory = (id, categoryData) => {
  return fetchData(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData)
  });
};

export const deleteCategory = (id) => {
  return fetchData(`/categories/${id}`, {
    method: 'DELETE'
  });
};

export const getCategoryProducts = (id) => {
  return fetchData(`/categories/${id}/products`);
};

// Order API calls
export const getOrders = () => {
  return fetchData('/orders');
};

export const getOrder = (id) => {
  return fetchData(`/orders/${id}`);
};

export const createOrder = (orderData) => {
  return fetchData('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
};

export const updateOrderStatus = (id, statusData) => {
  return fetchData(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData)
  });
};

export const cancelOrder = (id) => {
  return fetchData(`/orders/${id}/cancel`, {
    method: 'PUT'
  });
};

// Warehouse API calls
export const getWarehouses = () => {
  return fetchData('/warehouses');
};

export const getWarehouse = (id) => {
  return fetchData(`/warehouses/${id}`);
};

export const createWarehouse = (warehouseData) => {
  return fetchData('/warehouses', {
    method: 'POST',
    body: JSON.stringify(warehouseData)
  });
};

export const updateWarehouse = (id, warehouseData) => {
  return fetchData(`/warehouses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(warehouseData)
  });
};

export const deleteWarehouse = (id) => {
  return fetchData(`/warehouses/${id}`, {
    method: 'DELETE'
  });
};

export const getWarehouseInventory = (id) => {
  return fetchData(`/warehouses/${id}/inventory`);
};

export const transferInventory = (transferData) => {
  return fetchData('/warehouses/transfer', {
    method: 'POST',
    body: JSON.stringify(transferData)
  });
};

// Supplier API calls
export const getSuppliers = () => {
  return fetchData('/suppliers');
};

export const getSupplier = (id) => {
  return fetchData(`/suppliers/${id}`);
};

export const createSupplier = (supplierData) => {
  return fetchData('/suppliers', {
    method: 'POST',
    body: JSON.stringify(supplierData)
  });
};

export const updateSupplier = (id, supplierData) => {
  return fetchData(`/suppliers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(supplierData)
  });
};

export const deleteSupplier = (id) => {
  return fetchData(`/suppliers/${id}`, {
    method: 'DELETE'
  });
};

export const getSupplierProducts = (id) => {
  return fetchData(`/suppliers/${id}/products`);
};

// Purchase Order API calls
export const getPurchaseOrders = () => {
  return fetchData('/purchase-orders');
};

export const getPurchaseOrder = (id) => {
  return fetchData(`/purchase-orders/${id}`);
};

export const createPurchaseOrder = (poData) => {
  return fetchData('/purchase-orders', {
    method: 'POST',
    body: JSON.stringify(poData)
  });
};

export const updatePurchaseOrderStatus = (id, statusData) => {
  return fetchData(`/purchase-orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData)
  });
};

export const cancelPurchaseOrder = (id) => {
  return fetchData(`/purchase-orders/${id}/cancel`, {
    method: 'PUT'
  });
};

export const receiveItems = (id, itemsData) => {
  return fetchData(`/purchase-orders/${id}/receive`, {
    method: 'PUT',
    body: JSON.stringify(itemsData)
  });
};

// Delivery API calls
export const getDeliveries = () => {
  return fetchData('/deliveries');
};

export const getDelivery = (id) => {
  return fetchData(`/deliveries/${id}`);
};

export const createOutboundDelivery = (deliveryData) => {
  return fetchData('/deliveries/outbound', {
    method: 'POST',
    body: JSON.stringify(deliveryData)
  });
};

export const createInboundDelivery = (deliveryData) => {
  return fetchData('/deliveries/inbound', {
    method: 'POST',
    body: JSON.stringify(deliveryData)
  });
};

export const updateDeliveryStatus = (id, statusData) => {
  return fetchData(`/deliveries/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData)
  });
};

export const cancelDelivery = (id) => {
  return fetchData(`/deliveries/${id}/cancel`, {
    method: 'PUT'
  });
};

// User API calls
export const getUsers = () => {
  return fetchData('/users');
};

export const getUser = (id) => {
  return fetchData(`/users/${id}`);
};

export const createUser = (userData) => {
  return fetchData('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

export const updateUser = (id, userData) => {
  return fetchData(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  });
};

export const deleteUser = (id) => {
  return fetchData(`/users/${id}`, {
    method: 'DELETE'
  });
};

export const updateUserPassword = (id, passwordData) => {
  return fetchData(`/users/${id}/password`, {
    method: 'PUT',
    body: JSON.stringify(passwordData)
  });
};
