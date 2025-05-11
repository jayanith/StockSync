
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Warehouse, PlusCircle, Search, Filter, ArrowRightLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WarehouseTransfersPage = () => {
  const [transfers, setTransfers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const mockTransfers = [
    { id: 'TRN-001', date: '2025-04-15', fromWarehouse: 'Main Warehouse', toWarehouse: 'Downtown Hub', status: 'Completed', itemsCount: 5, totalValue: 1250.00 },
    { id: 'TRN-002', date: '2025-05-01', fromWarehouse: 'North Depot', toWarehouse: 'Main Warehouse', status: 'In Transit', itemsCount: 12, totalValue: 3400.50 },
    { id: 'TRN-003', date: '2025-05-08', fromWarehouse: 'Main Warehouse', toWarehouse: 'East Outlet', status: 'Pending', itemsCount: 8, totalValue: 850.75 },
  ];

  const transferStatuses = ["Pending", "In Transit", "Completed", "Cancelled"];

  useEffect(() => {
    setIsLoading(true);
    const storedTransfers = JSON.parse(localStorage.getItem('inventoryTransfers')) || mockTransfers;
    setTransfers(storedTransfers);
    setIsLoading(false);
    if (!localStorage.getItem('inventoryTransfers')) {
        localStorage.setItem('inventoryTransfers', JSON.stringify(mockTransfers));
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-400 bg-yellow-600/20';
      case 'In Transit': return 'text-blue-400 bg-blue-600/20';
      case 'Completed': return 'text-green-400 bg-green-600/20';
      case 'Cancelled': return 'text-red-400 bg-red-600/20';
      default: return 'text-gray-400 bg-gray-600/20';
    }
  };

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearchTerm = transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              transfer.fromWarehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              transfer.toWarehouse.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    return matchesSearchTerm && matchesStatus;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Warehouse className="h-10 w-10 animate-spin text-sky-500" /></div>;
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
          <Warehouse className="mr-3 h-8 w-8" /> Warehouse Transfers
        </h1>
        <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
          <PlusCircle className="mr-2 h-5 w-5" /> New Transfer Request
        </Button>
      </div>

      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Filter & Search Transfers</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search by ID or Warehouse Name..."
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
                {transferStatuses.map(status => (
                  <SelectItem key={status} value={status} className="hover:bg-sky-700/50 focus:bg-sky-600">{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {filteredTransfers.length > 0 ? (
        <div className="overflow-x-auto bg-slate-800/70 border border-slate-700 rounded-lg shadow-md">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3">Transfer ID</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">From</th>
                <th scope="col" className="px-6 py-3">To</th>
                <th scope="col" className="px-6 py-3 text-center">Items</th>
                <th scope="col" className="px-6 py-3 text-right">Total Value</th>
                <th scope="col" className="px-6 py-3 text-center">Status</th>
                {/* <th scope="col" className="px-6 py-3 text-center">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredTransfers.map((transfer, index) => (
                <motion.tr
                  key={transfer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-slate-700 hover:bg-slate-700/30"
                >
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{transfer.id}</td>
                  <td className="px-6 py-4">{transfer.date}</td>
                  <td className="px-6 py-4">{transfer.fromWarehouse}</td>
                  <td className="px-6 py-4">{transfer.toWarehouse}</td>
                  <td className="px-6 py-4 text-center">{transfer.itemsCount}</td>
                  <td className="px-6 py-4 text-right">${transfer.totalValue.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transfer.status)}`}>
                      {transfer.status}
                    </span>
                  </td>
                  {/* Actions column can be added here if needed */}
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
          <ArrowRightLeft className="h-20 w-20 text-sky-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">No Transfers Found</h2>
          <p className="text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all' ? 'No transfers match your current filters.' : 'There are no warehouse transfers to display.'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WarehouseTransfersPage;
  