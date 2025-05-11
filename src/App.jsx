
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import LoginPage from '@/pages/auth/LoginPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';

import DashboardPage from '@/pages/dashboard/DashboardPage';
import CategoriesPage from '@/pages/categories/CategoriesPage';

import ProductsPage from '@/pages/products/ProductsPage';
import ProductDetailsPage from '@/pages/products/ProductDetailsPage';
import AddProductPage from '@/pages/products/AddProductPage';

import OrdersPage from '@/pages/orders/OrdersPage';
import OrderDetailsPage from '@/pages/orders/OrderDetailsPage';
import CreateOrderPage from '@/pages/orders/CreateOrderPage';

import DeliveriesPage from '@/pages/deliveries/DeliveriesPage';
import DeliveryDetailsPage from '@/pages/deliveries/DeliveryDetailsPage';

import InventoryPage from '@/pages/inventory/InventoryPage';
import WarehouseTransfersPage from '@/pages/inventory/WarehouseTransfersPage';
import WarehousesPage from '@/pages/inventory/WarehousesPage';
import WarehouseDetailsPage from '@/pages/inventory/WarehouseDetailsPage';

import SuppliersPage from '@/pages/suppliers/SuppliersPage';
import AddSupplierPage from '@/pages/suppliers/AddSupplierPage';
import SupplierDetailsPage from '@/pages/suppliers/SupplierDetailsPage';

import PurchaseOrdersPage from '@/pages/purchaseorders/PurchaseOrdersPage';
import CreatePurchaseOrderPage from '@/pages/purchaseorders/CreatePurchaseOrderPage';
import PurchaseOrderDetailsPage from '@/pages/purchaseorders/PurchaseOrderDetailsPage';

import ReportsPage from '@/pages/reports/ReportsPage';
import SalesReportPage from '@/pages/reports/SalesReportPage';
import InventoryValuationPage from '@/pages/reports/InventoryValuationPage';
import StockMovementPage from '@/pages/reports/StockMovementPage';
import PurchaseOrderSummaryPage from '@/pages/reports/PurchaseOrderSummaryPage';
import CustomerOrderSummaryPage from '@/pages/reports/CustomerOrderSummaryPage';
import SupplierPerformancePage from '@/pages/reports/SupplierPerformancePage';

import UsersPage from '@/pages/users/UsersPage';
import UserProfilePage from '@/pages/users/UserProfilePage';
import AddUserPage from '@/pages/users/AddUserPage';

import SettingsPage from '@/pages/settings/SettingsPage';
import CompanySettingsPage from '@/pages/settings/CompanySettingsPage';
import NotificationSettingsPage from '@/pages/settings/NotificationSettingsPage';

import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  const { currentUser, loading } = useAuth();
  
  // Check for token in localStorage directly to prevent redirect flicker on reload
  const hasToken = localStorage.getItem('authToken') !== null;
  const isAuthenticated = !!currentUser || hasToken;
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
        <Route index element={<DashboardPage />} />
        
        <Route path="categories" element={<CategoriesPage />} />
        
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<AddProductPage />} />
        <Route path="products/:productId" element={<ProductDetailsPage />} />
        
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/new" element={<CreateOrderPage />} />
        <Route path="orders/:orderId" element={<OrderDetailsPage />} />
        
        <Route path="deliveries" element={<DeliveriesPage />} />
        <Route path="deliveries/:deliveryId" element={<DeliveryDetailsPage />} />
        
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="inventory/transfers" element={<WarehouseTransfersPage />} />
        <Route path="inventory/warehouses" element={<WarehousesPage />} />
        <Route path="inventory/warehouses/:warehouseId" element={<WarehouseDetailsPage />} />

        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="suppliers/new" element={<AddSupplierPage />} />
        <Route path="suppliers/:supplierId" element={<SupplierDetailsPage />} />

        <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="purchase-orders/new" element={<CreatePurchaseOrderPage />} />
        <Route path="purchase-orders/:poId" element={<PurchaseOrderDetailsPage />} />
        
        <Route path="reports" element={<ReportsPage />} />
        <Route path="reports/sales" element={<SalesReportPage />} />
        <Route path="reports/inventory-valuation" element={<InventoryValuationPage />} />
        <Route path="reports/stock-movement" element={<StockMovementPage />} />
        <Route path="reports/po-summary" element={<PurchaseOrderSummaryPage />} />
        <Route path="reports/customer-order-summary" element={<CustomerOrderSummaryPage />} />
        <Route path="reports/supplier-performance" element={<SupplierPerformancePage />} />
        
        <Route path="users" element={<UsersPage />} />
        <Route path="users/new" element={<AddUserPage />} />
        <Route path="users/:userId" element={<UserProfilePage />} />
        <Route path="profile" element={<UserProfilePage />} /> 

        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/company" element={<CompanySettingsPage />} />
        <Route path="settings/notifications" element={<NotificationSettingsPage />} />

      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
  