import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { FilePlus, PlusCircle, Search, Filter, Eye, DollarSign, Calendar, Users2, PackageCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPurchaseOrders } from '@/lib/api';

const PurchaseOrdersPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const fetchPOs = async () => {
    setIsLoading(true);
    try {
      const response = await getPurchaseOrders();
      if (response && response.data) {
        setPurchaseOrders(response.data);
      }
    } catch (e) {
      console.error('Error loading purchase orders:', e);
      toast({ title: 'Notice', description: 'Failed to fetch purchase orders from MySQL.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPOs();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Received':
        return 'bg-[#173022] text-[#6ee7b7] border-[#225039]';
      case 'Approved':
      case 'Ordered':
        return 'bg-[#182833] text-[#7dd3fc] border-[#224458]';
      case 'Partially Received':
      case 'Draft':
        return 'bg-[#332612] text-[#fde047] border-[#55401e]';
      case 'Cancelled':
        return 'bg-[#331b1b] text-[#fca5a5] border-[#522525]';
      default:
        return 'bg-[#253028] text-[#d1d5db] border-[#37473c]';
    }
  };

  const filtered = purchaseOrders.filter(po => {
    const sName = po.supplierName || (po.supplier?.name || '');
    const pId = String(po.id || po._id || '');
    const matchesSearch = sName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 old-money-card border-[#2e4034] rounded-xl shadow-xl">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Procurement Logistics</span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#f8f6f0] mt-1 flex items-center">
            <FilePlus className="mr-3 h-7 w-7 text-[#c5a059]" /> Purchase Orders
          </h1>
          <p className="text-xs text-[#9ea8a1] mt-0.5">Supplier acquisition contracts & incoming inventory restocks</p>
        </div>
        <Link to="/purchase-orders/new">
          <Button className="old-money-gold-btn text-xs uppercase tracking-wider py-2 px-4 shadow-lg">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Purchase Order
          </Button>
        </Link>
      </div>

      <Card className="old-money-card border-[#2e4034] rounded-xl">
        <CardHeader className="p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#c5a059]" />
              <Input 
                type="text"
                placeholder="Search POs by supplier or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] text-xs h-11"
              />
            </div>
            <div className="w-full md:w-60">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-11">
                  <Filter className="mr-2 h-3.5 w-3.5 text-[#c5a059]" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="partially received">Partially Received</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <FilePlus className="h-10 w-10 animate-spin text-[#c5a059]" />
        </div>
      ) : (
        <Card className="old-money-card border-[#2e4034] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-[#d8d3c5]">
              <thead className="text-[11px] uppercase tracking-wider text-[#9ea8a1] bg-[#121b16] border-b border-[#202f25]">
                <tr>
                  <th className="px-6 py-4 font-semibold">PO Number</th>
                  <th className="px-6 py-4 font-semibold">Supplier / Guild</th>
                  <th className="px-6 py-4 font-semibold">Items</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Expected Arrival</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Total Cost</th>
                  <th className="px-6 py-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2820]">
                {filtered.length > 0 ? (
                  filtered.map((po, idx) => {
                    const pId = po.id || po._id || `PO-${idx + 1}`;
                    const supName = po.supplierName || (po.supplier?.name || 'Authorized Merchant');
                    const itemCount = po.items ? po.items.length : (po.itemsCount || 0);

                    return (
                      <tr key={pId} className="hover:bg-[#16211a]/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-[#f8f6f0]">#{pId}</td>
                        <td className="px-6 py-4 font-medium text-[#e5dec9]">{supName}</td>
                        <td className="px-6 py-4">{itemCount} items</td>
                        <td className="px-6 py-4 text-[#9ea8a1]">{po.date || 'Recent'}</td>
                        <td className="px-6 py-4 text-[#9ea8a1]">{po.expectedDeliveryDate || 'TBD'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(po.status)}`}>
                            {po.status || 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-serif text-[#c5a059] font-semibold text-sm">
                          ${Number(po.total || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link to={`/purchase-orders/${pId}`}>
                            <Button variant="ghost" size="sm" className="h-8 text-xs text-[#c5a059] hover:bg-[#1f2e25] hover:text-[#f8f6f0]">
                              <Eye className="h-3.5 w-3.5 mr-1" /> View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-12 text-[#9ea8a1]">
                      No purchase orders recorded in MySQL.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default PurchaseOrdersPage;