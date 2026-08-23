import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Truck, PlusCircle, Search, Filter, Eye, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDeliveries } from '@/lib/api';

const DeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const { toast } = useToast();

  const fetchDeliveries = async () => {
    setIsLoading(true);
    try {
      const response = await getDeliveries();
      if (response && response.data) {
        setDeliveries(response.data);
      }
    } catch (e) {
      console.error('Error fetching deliveries:', e);
      toast({ title: 'Notice', description: 'Failed to fetch deliveries from database.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-[#173022] text-[#6ee7b7] border-[#225039]';
      case 'In Transit':
      case 'Out for Delivery':
        return 'bg-[#182833] text-[#7dd3fc] border-[#224458]';
      case 'Pending':
        return 'bg-[#332612] text-[#fde047] border-[#55401e]';
      case 'Cancelled':
        return 'bg-[#331b1b] text-[#fca5a5] border-[#522525]';
      default:
        return 'bg-[#253028] text-[#d1d5db] border-[#37473c]';
    }
  };

  const filtered = deliveries.filter(d => {
    const tracking = d.trackingNumber || '';
    const carrier = d.carrier || '';
    const matchesSearch = tracking.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          carrier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || d.type?.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
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
          <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Logistics Pipeline</span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#f8f6f0] mt-1 flex items-center">
            <Truck className="mr-3 h-7 w-7 text-[#c5a059]" /> Freight & Deliveries
          </h1>
          <p className="text-xs text-[#9ea8a1] mt-0.5">Track armored couriers, inward freight, and outbound consignments</p>
        </div>
      </div>

      <Card className="old-money-card border-[#2e4034] rounded-xl">
        <CardHeader className="p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#c5a059]" />
              <Input 
                type="text"
                placeholder="Search by tracking number, carrier, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] text-xs h-11"
              />
            </div>
            <div className="w-full md:w-60">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-11">
                  <Filter className="mr-2 h-3.5 w-3.5 text-[#c5a059]" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                  <SelectItem value="all">All Freight Types</SelectItem>
                  <SelectItem value="inbound">Inbound (Supplier)</SelectItem>
                  <SelectItem value="outbound">Outbound (Client)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Truck className="h-10 w-10 animate-spin text-[#c5a059]" />
        </div>
      ) : (
        <Card className="old-money-card border-[#2e4034] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-[#d8d3c5]">
              <thead className="text-[11px] uppercase tracking-wider text-[#9ea8a1] bg-[#121b16] border-b border-[#202f25]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Tracking #</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Carrier</th>
                  <th className="px-6 py-4 font-semibold">Origin & Destination</th>
                  <th className="px-6 py-4 font-semibold">ETA / Delivered</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2820]">
                {filtered.length > 0 ? (
                  filtered.map((del, idx) => {
                    const dId = del.id || del._id || idx + 1;
                    const isOut = del.type?.toUpperCase() === 'OUTBOUND';
                    return (
                      <tr key={dId} className="hover:bg-[#16211a]/70 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-[#f8f6f0]">{del.trackingNumber || `TRK-00${dId}`}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                            isOut ? 'bg-[#1d2d38] text-[#38bdf8]' : 'bg-[#291f38] text-[#c084fc]'
                          }`}>
                            {isOut ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {del.type || 'OUTBOUND'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-[#e5dec9]">{del.carrier || 'Brinks Secure Express'}</td>
                        <td className="px-6 py-4">
                          <div className="text-[#f4efe6] truncate max-w-[200px]">{del.destination || 'Client Residence'}</div>
                          <div className="text-[10px] text-[#718277] truncate max-w-[200px]">From: {del.origin || 'Mayfair Depository'}</div>
                        </td>
                        <td className="px-6 py-4 text-[#9ea8a1]">{del.actualDelivery || del.estimatedDelivery || 'In Transit'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(del.status)}`}>
                            {del.status || 'In Transit'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link to={`/deliveries/${dId}`}>
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
                      No active consignments found in database.
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

export default DeliveriesPage;