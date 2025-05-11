
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { FilePlus, PlusCircle, Eye, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PurchaseOrdersPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [suppliers, setSuppliers] = useState([]);

  const mockPOs = [
    { id: 'PO-001', supplierId: 'sup1', supplierName: 'TechSupply Co.', date: '2025-04-20', total: 2500.00, status: 'Sent', itemsCount: 3 },
    { id: 'PO-002', supplierId: 'sup2', supplierName: 'EcoThreads Ltd.', date: '2025-04-25', total: 1200.50, status: 'Received', itemsCount: 5 },
    { id: 'PO-003', supplierId: 'sup1', supplierName: 'TechSupply Co.', date: '2025-05-01', total: 850.00, status: 'Draft', itemsCount: 2 },
  ];
  
  const poStatuses = ["Draft", "Sent", "Partially Received", "Received", "Cancelled"];

  useEffect(() => {
    setIsLoading(true);
    const storedPOs = JSON.parse(localStorage.getItem('inventoryPurchaseOrders')) || mockPOs;
    const storedSuppliers = JSON.parse(localStorage.getItem('inventorySuppliers')) || [];
    setPurchaseOrders(storedPOs.map(po => ({
        ...po,
        supplierName: storedSuppliers.find(s => s.id === po.supplierId)?.name || 'Unknown Supplier'
    })));
    setSuppliers(storedSuppliers);
    setIsLoading(false);
    if (!localStorage.getItem('inventoryPurchaseOrders')) {
        localStorage.setItem('inventoryPurchaseOrders', JSON.stringify(mockPOs));
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'text-gray-400 bg-gray-600/20';
      case 'Sent': return 'text-blue-400 bg-blue-600/20';
      case 'Partially Received': return 'text-orange-400 bg-orange-600/20';
      case 'Received': return 'text-green-400 bg-green-600/20';
      case 'Cancelled': return 'text-red-400 bg-red-600/20';
      default: return 'text-gray-400 bg-gray-600/20';
    }
  };

  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearchTerm = po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              po.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearchTerm && matchesStatus;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><FilePlus className="h-10 w-10 animate-spin text-sky-500" /></div>;
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
          <FilePlus className="mr-3 h-8 w-8" /> Purchase Orders
        </h1>
        <Link to="/purchase-orders/new">
          <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New PO
          </Button>
        </Link>
      </div>

      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Filter & Search POs</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search by PO ID or Supplier Name..."
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
                {poStatuses.map(status => (
                  <SelectItem key={status} value={status} className="hover:bg-sky-700/50 focus:bg-sky-600">{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {filteredPOs.length > 0 ? (
        <div className="overflow-x-auto bg-slate-800/70 border border-slate-700 rounded-lg shadow-md">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3">PO ID</th>
                <th scope="col" className="px-6 py-3">Supplier</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3 text-center">Items</th>
                <th scope="col" className="px-6 py-3 text-right">Total</th>
                <th scope="col" className="px-6 py-3 text-center">Status</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPOs.map((po, index) => (
                <motion.tr
                  key={po.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-slate-700 hover:bg-slate-700/30"
                >
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{po.id}</td>
                  <td className="px-6 py-4">{po.supplierName}</td>
                  <td className="px-6 py-4">{po.date}</td>
                  <td className="px-6 py-4 text-center">{po.itemsCount}</td>
                  <td className="px-6 py-4 text-right">${po.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(po.status)}`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link to={`/purchase-orders/${po.id}`}>
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
          <FilePlus className="h-20 w-20 text-sky-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">No Purchase Orders Found</h2>
          <p className="text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all' ? 'No POs match your current filters.' : 'There are no purchase orders to display.'}
          </p>
          <Link to="/purchase-orders/new">
            <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg">
              <PlusCircle className="mr-2 h-5 w-5" /> Create First PO
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PurchaseOrdersPage;
  