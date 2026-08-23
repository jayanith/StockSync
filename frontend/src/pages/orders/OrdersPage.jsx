import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, PlusCircle, Search, Filter, Eye, DollarSign, Calendar, User, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getOrders } from '@/lib/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getOrders();
      if (response && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load client orders from MySQL.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-[#173022] text-[#6ee7b7] border-[#225039]';
      case 'Processing':
      case 'Shipped':
        return 'bg-[#182833] text-[#7dd3fc] border-[#224458]';
      case 'Pending':
        return 'bg-[#332612] text-[#fde047] border-[#55401e]';
      case 'Cancelled':
        return 'bg-[#331b1b] text-[#fca5a5] border-[#522525]';
      default:
        return 'bg-[#253028] text-[#d1d5db] border-[#37473c]';
    }
  };

  const filteredOrders = orders.filter(order => {
    const cust = order.customerName || '';
    const oid = String(order.id || order._id || '');
    const matchesSearch = cust.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          oid.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status?.toLowerCase() === statusFilter.toLowerCase();
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
          <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Requisitions</span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#f8f6f0] mt-1 flex items-center">
            <ShoppingCart className="mr-3 h-7 w-7 text-[#c5a059]" /> Client Orders
          </h1>
          <p className="text-xs text-[#9ea8a1] mt-0.5">Manage customer transactions & order fulfillment</p>
        </div>
        <Link to="/orders/new">
          <Button className="old-money-gold-btn text-xs uppercase tracking-wider py-2 px-4 shadow-lg">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Order
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
                placeholder="Search orders by customer or reference ID..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <ShoppingCart className="h-10 w-10 animate-spin text-[#c5a059]" />
        </div>
      ) : (
        <Card className="old-money-card border-[#2e4034] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-[#d8d3c5]">
              <thead className="text-[11px] uppercase tracking-wider text-[#9ea8a1] bg-[#121b16] border-b border-[#202f25]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order Ref</th>
                  <th className="px-6 py-4 font-semibold">Client Name</th>
                  <th className="px-6 py-4 font-semibold">Items</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Valuation</th>
                  <th className="px-6 py-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2820]">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, idx) => {
                    const oid = order.id || order._id || `ORD-${idx + 1}`;
                    const itemCount = order.items ? order.items.length : 0;
                    return (
                      <tr key={oid} className="hover:bg-[#16211a]/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-[#f8f6f0]">#{oid}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#e5dec9]">{order.customerName}</div>
                          <div className="text-[10px] text-[#718277]">{order.customerEmail}</div>
                        </td>
                        <td className="px-6 py-4">{itemCount} items</td>
                        <td className="px-6 py-4 text-[#9ea8a1]">{order.date || 'Today'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(order.status)}`}>
                            {order.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-serif text-[#c5a059] font-semibold text-sm">
                          ${Number(order.total || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link to={`/orders/${oid}`}>
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
                    <td colSpan="7" className="text-center py-12 text-[#9ea8a1]">
                      No orders found in database.
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

export default OrdersPage;