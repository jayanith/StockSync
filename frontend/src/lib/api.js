// API utility functions for the inventory management system

const API_URL = import.meta.env.VITE_API_URL || 'demo';
const DEMO_MODE = API_URL === 'demo' || API_URL === 'browser';

const demoSeed = {
  users: [
    { id: 1, name: 'Alexander Sterling', email: 'admin@example.com', password: 'admin123', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Victoria Windsor', email: 'manager@example.com', password: 'manager123', role: 'Manager', status: 'Active' },
    { id: 3, name: 'Arthur Pendelton', email: 'staff@example.com', password: 'staff123', role: 'Warehouse Staff', status: 'Active' },
    { id: 4, name: 'Henri de Montmollin', email: 'supplier@example.com', password: 'supplier123', role: 'Supplier', status: 'Active' },
    { id: 5, name: 'Catherine Client', email: 'customer@example.com', password: 'customer123', role: 'Customer', status: 'Active' }
  ],
  categories: [
    { id: 1, name: 'Fine Watches & Timepieces', description: 'Haute horlogerie and chronographs' },
    { id: 2, name: 'Leather Goods & Luggage', description: 'Handcrafted Italian leather accessories' },
    { id: 3, name: 'Heritage Tailoring & Apparel', description: 'Cashmere, tweed and formal evening wear' }
  ],
  products: [
    { id: 1, name: 'Royal Oak Chronograph 18k Rose Gold', sku: 'RO-CHRONO-RG01', price: 42500, quantity: 8, category: { id: 1, name: 'Fine Watches & Timepieces' }, isActive: true },
    { id: 2, name: 'Double-Breasted Cashmere Overcoat', sku: 'SR-COAT-CSH02', price: 3850, quantity: 15, category: { id: 3, name: 'Heritage Tailoring & Apparel' }, isActive: true },
    { id: 3, name: 'Chesterfield Deep-Tufted Leather Armchair', sku: 'CH-LEATH-ARM03', price: 2900, quantity: 12, category: { id: 2, name: 'Leather Goods & Luggage' }, isActive: true }
  ],
  suppliers: [
    { id: 1, name: 'Geneva Horological Guild', contactPerson: 'Henri de Montmollin', email: 'supplier@example.com', productsSupplied: 4 },
    { id: 2, name: 'Savile Row Clothiers', contactPerson: 'Charles Beauchamp', email: 'bespoke@savilerow.co.uk', productsSupplied: 6 }
  ],
  warehouses: [
    { id: 1, name: 'Mayfair Vault & Depository', location: 'London, Mayfair', capacity: 5000, status: 'Active' },
    { id: 2, name: 'Edinburgh Highland Depot', location: 'Edinburgh, Scotland', capacity: 8000, status: 'Active' }
  ],
  orders: [],
  'purchase-orders': [],
  deliveries: []
};

const readDemoData = () => {
  const stored = localStorage.getItem('stocksync-demo-data');
  if (stored) {
    const data = JSON.parse(stored);
    const existingEmails = new Set((data.users || []).map((user) => user.email));
    const missingUsers = demoSeed.users.filter((user) => !existingEmails.has(user.email));
    if (missingUsers.length > 0) {
      data.users = [...(data.users || []), ...missingUsers];
      writeDemoData(data);
    }
    return data;
  }
  localStorage.setItem('stocksync-demo-data', JSON.stringify(demoSeed));
  return JSON.parse(JSON.stringify(demoSeed));
};

const writeDemoData = (data) => localStorage.setItem('stocksync-demo-data', JSON.stringify(data));

const demoFetch = async (endpoint, options = {}) => {
  const data = readDemoData();
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : {};

  if (endpoint === '/auth/login' && method === 'POST') {
    const user = data.users.find((candidate) => candidate.email === body.email && candidate.password === body.password);
    if (!user) throw new Error('Invalid email or password');
    const { password, ...safeUser } = user;
    return { token: `demo-token-${user.id}`, user: safeUser };
  }

  if (endpoint === '/auth/register' && method === 'POST') {
    const user = { id: Date.now(), ...body, role: body.role || 'Staff', status: 'Active' };
    data.users.push(user);
    writeDemoData(data);
    const { password, ...safeUser } = user;
    return { token: `demo-token-${user.id}`, user: safeUser };
  }

  if (endpoint === '/auth/me') {
    const id = Number((localStorage.getItem('authToken') || '').replace('demo-token-', ''));
    const user = data.users.find((candidate) => candidate.id === id);
    if (!user) throw new Error('401 Unauthorized');
    const { password, ...safeUser } = user;
    return { user: safeUser };
  }

  const match = endpoint.match(/^\/(products|categories|suppliers|warehouses|orders|purchase-orders|deliveries|users)(?:\/(\d+))?/);
  if (!match) return {};
  const [, resource, id] = match;
  const collection = data[resource] || [];
  if (method === 'GET' && !id) return collection;
  if (method === 'GET' && id) return collection.find((item) => item.id === Number(id)) || {};
  if (method === 'POST') {
    const item = { id: Date.now(), ...body };
    collection.push(item);
    data[resource] = collection;
    writeDemoData(data);
    return item;
  }
  if ((method === 'PUT' || method === 'PATCH') && id) {
    const index = collection.findIndex((item) => item.id === Number(id));
    if (index >= 0) collection[index] = { ...collection[index], ...body };
    writeDemoData(data);
    return collection[index] || {};
  }
  if (method === 'DELETE' && id) {
    data[resource] = collection.filter((item) => item.id !== Number(id));
    writeDemoData(data);
    return { message: 'Deleted successfully' };
  }
  return {};
};

// Helper function to handle fetch requests
const fetchData = async (endpoint, options = {}) => {
  if (DEMO_MODE) return demoFetch(endpoint, options);

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
