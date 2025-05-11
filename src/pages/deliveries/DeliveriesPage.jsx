
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Truck, Eye, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const mockDeliveries = [
    { id: 'DEL-001', orderId: 'ORD-002', customerName: 'Bob The Builder', assignedDriver: 'Driver Dan', status: 'In Transit', estimatedDelivery: '2025-05-10' },
    { id: 'DEL-002', orderId: 'ORD-003', customerName: 'Charlie Brown', assignedDriver: 'Driver Alice', status: 'Delivered', estimatedDelivery: '2025-05-06' },
    { id: 'DEL-003', orderId: 'ORD-005', customerName: 'Edward Scissorhands', assignedDriver: 'Driver Dan', status: 'Dispatched', estimatedDelivery: '2025-05-12' },
  ];
  
  const deliveryStatuses = ["Pending Assignment", "Dispatched", "In Transit", "Delivered", "Delayed", "Failed"];

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching deliveries - in a real app, this would be an API call
    // For now, we'll use mock data or data derived from orders
    const storedDeliveries = JSON.parse(localStorage.getItem('inventoryDeliveries')) || mockDeliveries;
    setDeliveries(storedDeliveries);
    setIsLoading(false);
    if (!localStorage.getItem('inventoryDeliveries')) {
        localStorage.setItem('inventoryDeliveries', JSON.stringify(mockDeliveries));
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Assignment': return 'text-gray-400 bg-gray-600/20';
      case 'Dispatched': return 'text-blue-400 bg-blue-600/20';
      case 'In Transit': return 'text-purple-400 bg-purple-600/20';
      case 'Delivered': return 'text-green-400 bg-green-600/20';
      case 'Delayed': return 'text-orange-400 bg-orange-600/20';
      case 'Failed': return 'text-red-400 bg-red-600/20';
      default: return 'text-gray-400 bg-gray-600/20';
    }
  };
  
  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearchTerm = delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (delivery.assignedDriver && delivery.assignedDriver.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    return matchesSearchTerm && matchesStatus;
  });


  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Truck className="h-10 w-10 animate-spin text-sky-500" /></div>;
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
          <Truck className="mr-3 h-8 w-8" /> Delivery Tracking
        </h1>
        {/* Button to manually create a delivery could go here if needed */}
      </div>

      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Filter & Search Deliveries</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search by Delivery ID, Order ID, Customer, Driver..."
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
                {deliveryStatuses.map(status => (
                  <SelectItem key={status} value={status} className="hover:bg-sky-700/50 focus:bg-sky-600">{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {filteredDeliveries.length > 0 ? (
        <div className="overflow-x-auto bg-slate-800/70 border border-slate-700 rounded-lg shadow-md">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3">Delivery ID</th>
                <th scope="col" className="px-6 py-3">Order ID</th>
                <th scope="col" className="px-6 py-3">Customer</th>
                <th scope="col" className="px-6 py-3">Driver</th>
                <th scope="col" className="px-6 py-3">Est. Delivery</th>
                <th scope="col" className="px-6 py-3 text-center">Status</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((delivery, index) => (
                <motion.tr
                  key={delivery.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-slate-700 hover:bg-slate-700/30"
                >
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{delivery.id}</td>
                  <td className="px-6 py-4">{delivery.orderId}</td>
                  <td className="px-6 py-4">{delivery.customerName}</td>
                  <td className="px-6 py-4">{delivery.assignedDriver || 'N/A'}</td>
                  <td className="px-6 py-4">{delivery.estimatedDelivery}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(delivery.status)}`}>
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link to={`/deliveries/${delivery.id}`}>
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
          <Truck className="h-20 w-20 text-sky-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">No Deliveries Found</h2>
          <p className="text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all' ? 'No deliveries match your current filters.' : 'There are no deliveries to display.'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DeliveriesPage;
  