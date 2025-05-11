
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ShoppingCart, PlusCircle, Eye, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const mockOrders = [
    { id: 'ORD-001', customerName: 'Alice Wonderland', date: '2025-05-01', total: 150.75, status: 'Pending', items: 3 },
    { id: 'ORD-002', customerName: 'Bob The Builder', date: '2025-05-03', total: 89.99, status: 'Approved', items: 2 },
    { id: 'ORD-003', customerName: 'Charlie Brown', date: '2025-05-05', total: 230.00, status: 'Delivered', items: 5 },
    { id: 'ORD-004', customerName: 'Diana Prince', date: '2025-05-06', total: 45.50, status: 'Cancelled', items: 1 },
    { id: 'ORD-005', customerName: 'Edward Scissorhands', date: '2025-05-08', total: 500.20, status: 'Pending', items: 8 },
  ];
  
  const orderStatuses = ["Pending", "Approved", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    setIsLoading(true);
    const storedOrders = JSON.parse(localStorage.getItem('inventoryOrders')) || mockOrders;
    setOrders(storedOrders);
    setIsLoading(false);
    if (!localStorage.getItem('inventoryOrders')) {
        localStorage.setItem('inventoryOrders', JSON.stringify(mockOrders));
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-400 bg-yellow-600/20';
      case 'Approved': return 'text-blue-400 bg-blue-600/20';
      case 'Shipped': return 'text-purple-400 bg-purple-600/20';
      case 'Delivered': return 'text-green-400 bg-green-600/20';
      case 'Cancelled': return 'text-red-400 bg-red-600/20';
      default: return 'text-gray-400 bg-gray-600/20';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearchTerm = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearchTerm && matchesStatus;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><ShoppingCart className="h-10 w-10 animate-spin text-sky-500" /></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 bg-slate-800/50 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center">
          <ShoppingCart className="mr-3 h-8 w-8" /> Customer Orders
        </h1>
        <Link to="/orders/new">
          <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Order
          </Button>
        </Link>
      </div>

      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Filter & Search Orders</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search by Order ID or Customer Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 focus:border-sky-500 text-white w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px] bg-slate-700 border-slate-600 text-white focus:ring-sky-500">
                <Filter className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all" className="hover:bg-sky-700/50 focus:bg-sky-600">All Statuses</SelectItem>
                {orderStatuses.map(status => (
                  <SelectItem key={status} value={status} className="hover:bg-sky-700/50 focus:bg-sky-600">{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {filteredOrders.length > 0 ? (
        <div className="overflow-x-auto bg-slate-800/70 border border-slate-700 rounded-lg shadow-md">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3">Order ID</th>
                <th scope="col" className="px-6 py-3">Customer</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Items</th>
                <th scope="col" className="px-6 py-3 text-right">Total</th>
                <th scope="col" className="px-6 py-3 text-center">Status</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-slate-700 hover:bg-slate-700/30"
                >
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{order.id}</td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4 text-center">{order.items}</td>
                  <td className="px-6 py-4 text-right">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="ghost" size="sm" className="text-sky-400 hover:text-sky-300 hover:bg-sky-900/30">
                        <Eye className="mr-1 h-4 w-4" /> View
                      </Button>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-slate-800/50 rounded-xl shadow-xl"
        >
          <ShoppingCart className="h-20 w-20 text-sky-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">No Orders Found</h2>
          <p className="text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all' ? 'No orders match your current filters.' : 'There are no orders to display.'}
          </p>
          <Link to="/orders/new">
            <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg">
              <PlusCircle className="mr-2 h-5 w-5" /> Create First Order
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrdersPage;
  