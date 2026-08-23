import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Building, ArrowLeft, MapPin, User, Mail, Phone, Package, ArrowRightLeft } from 'lucide-react';
import { getWarehouse, getWarehouseInventory } from '@/lib/api';

const WarehouseDetailsPage = () => {
  const { warehouseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [warehouse, setWarehouse] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const wRes = await getWarehouse(warehouseId);
        if (wRes && wRes.data) {
          setWarehouse(wRes.data);
        }
        const invRes = await getWarehouseInventory(warehouseId);
        if (invRes && invRes.data) {
          setInventory(invRes.data);
        }
      } catch (e) {
        console.error('Error fetching warehouse details:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [warehouseId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Building className="h-10 w-10 animate-spin text-[#c5a059]" />
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="text-center py-20 old-money-card border-[#2e4034] rounded-xl max-w-lg mx-auto">
        <h2 className="text-xl font-serif text-[#f8f6f0] mb-3">Facility Not Found</h2>
        <Button onClick={() => navigate('/inventory/warehouses')} className="old-money-gold-btn text-xs uppercase tracking-wider">
          Return to Warehouses
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => navigate('/inventory/warehouses')} 
          className="text-[#c5a059] border-[#3a4d41] hover:bg-[#1f2e25] hover:text-[#f8f6f0]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Warehouses
        </Button>
        <Link to="/inventory/transfers">
          <Button className="old-money-gold-btn text-xs uppercase tracking-wider py-2 px-4">
            <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer Stock Between Vaults
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="old-money-card border-[#2e4034] rounded-xl shadow-xl">
            <CardHeader className="border-b border-[#202f25] p-6 bg-[#0f1712]/70">
              <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Depository Facility</span>
              <CardTitle className="text-2xl font-serif text-[#f8f6f0] mt-1">{warehouse.name}</CardTitle>
              <CardDescription className="text-xs text-[#9ea8a1]">Location: {warehouse.location}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs text-[#d8d3c5]">
              <div className="grid sm:grid-cols-2 gap-4">
                {warehouse.address && (
                  <p className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-[#c5a059]" /> {warehouse.address}</p>
                )}
                {warehouse.manager && (
                  <p className="flex items-center"><User className="h-4 w-4 mr-2 text-[#c5a059]" /> Manager: {warehouse.manager}</p>
                )}
                {warehouse.phone && (
                  <p className="flex items-center"><Phone className="h-4 w-4 mr-2 text-[#c5a059]" /> {warehouse.phone}</p>
                )}
                {warehouse.email && (
                  <p className="flex items-center"><Mail className="h-4 w-4 mr-2 text-[#c5a059]" /> {warehouse.email}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="old-money-card border-[#2e4034] rounded-xl shadow-xl">
            <CardHeader className="border-b border-[#202f25] p-5 bg-[#0f1712]/70">
              <CardTitle className="text-base font-serif text-[#f8f6f0] flex items-center">
                <Package className="mr-2 h-4 w-4 text-[#c5a059]" /> Vault Inventory Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {inventory.length > 0 ? (
                <div className="divide-y divide-[#1e2c22]">
                  {inventory.map((inv, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-medium text-[#f8f6f0]">{inv.product?.name || 'Stock Item'}</span>
                        <p className="text-[10px] text-[#718277]">SKU: {inv.product?.sku}</p>
                      </div>
                      <span className="font-mono text-[#6ee7b7] font-semibold px-2.5 py-0.5 rounded bg-[#16291f] border border-[#234734]">
                        {inv.quantity} units stored
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#9ea8a1] py-4 text-center">No inventory allocations recorded for this facility.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="old-money-card border-[#2e4034] rounded-xl shadow-xl p-5 space-y-4 text-xs text-[#d8d3c5]">
            <h4 className="font-serif font-semibold text-base text-[#f8f6f0]">Storage Capacity</h4>
            <div>
              <span className="text-[#9ea8a1] block text-[10px] uppercase tracking-wider">Total Max Storage</span>
              <span className="text-lg font-serif font-bold text-[#c5a059]">{warehouse.capacity || 5000} units</span>
            </div>
            <div>
              <span className="text-[#9ea8a1] block text-[10px] uppercase tracking-wider">Facility Status</span>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-[#173022] text-[#6ee7b7] border border-[#225039] font-medium text-[11px]">
                {warehouse.status || 'Active Operation'}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default WarehouseDetailsPage;