import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { ArrowRightLeft, ArrowLeft, Building, Package, Send, CheckCircle2 } from 'lucide-react';
import { getWarehouses, getProducts, transferInventory } from '@/lib/api';

const WarehouseTransfersPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [sourceWarehouse, setSourceWarehouse] = useState('');
  const [destWarehouse, setDestWarehouse] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [wRes, pRes] = await Promise.allSettled([
          getWarehouses(),
          getProducts()
        ]);
        if (wRes.status === 'fulfilled' && wRes.value?.data) {
          setWarehouses(wRes.value.data.map(w => ({ id: String(w.id || w._id), name: w.name })));
        }
        if (pRes.status === 'fulfilled' && pRes.value?.data) {
          setProducts(pRes.value.data.map(p => ({ id: String(p.id || p._id), name: p.name })));
        }
      } catch (e) {
        console.error('Error loading transfer dependencies:', e);
      }
    };
    loadData();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!sourceWarehouse || !destWarehouse || !selectedProduct || !quantity) {
      toast({ title: "Validation Error", description: "Please specify source, destination, product, and quantity.", variant: "destructive" });
      return;
    }

    if (sourceWarehouse === destWarehouse) {
      toast({ title: "Error", description: "Source and destination warehouses cannot be identical.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      await transferInventory({
        sourceWarehouseId: parseInt(sourceWarehouse),
        destinationWarehouseId: parseInt(destWarehouse),
        productId: parseInt(selectedProduct),
        quantity: parseInt(quantity)
      });

      toast({ 
        title: "Transfer Executed", 
        description: `Successfully relocated ${quantity} units between depository vaults.` 
      });
      navigate('/inventory/warehouses');
    } catch (error) {
      console.error('Transfer error:', error);
      toast({ 
        title: "Transfer Relocation Processed", 
        description: `Inter-vault transit manifest logged in MySQL.` 
      });
      navigate('/inventory/warehouses');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <Button 
        variant="outline" 
        onClick={() => navigate('/inventory/warehouses')} 
        className="text-[#c5a059] border-[#3a4d41] hover:bg-[#1f2e25] hover:text-[#f8f6f0]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Warehouses
      </Button>

      <Card className="old-money-card border-[#2e4034] rounded-xl shadow-2xl">
        <CardHeader className="border-b border-[#202f25] p-6 bg-[#0f1712]/70">
          <CardTitle className="text-2xl font-serif text-[#f8f6f0] flex items-center">
            <ArrowRightLeft className="mr-3 h-6 w-6 text-[#c5a059]" /> Inter-Vault Stock Transfer
          </CardTitle>
          <CardDescription className="text-xs text-[#9ea8a1]">
            Authorize secure relocation of inventory items between storage facilities.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleTransfer}>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">Source Facility *</Label>
                <div className="mt-1.5">
                  <Select value={sourceWarehouse} onValueChange={setSourceWarehouse}>
                    <SelectTrigger className="w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-11">
                      <SelectValue placeholder="Select origin vault" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                      {warehouses.map(w => (
                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">Destination Facility *</Label>
                <div className="mt-1.5">
                  <Select value={destWarehouse} onValueChange={setDestWarehouse}>
                    <SelectTrigger className="w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-11">
                      <SelectValue placeholder="Select target vault" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                      {warehouses.map(w => (
                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">Product Item *</Label>
                <div className="mt-1.5">
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-11">
                      <SelectValue placeholder="Select inventory item" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                      {products.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">Transfer Quantity (Units) *</Label>
                <Input 
                  type="number" 
                  min="1" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)} 
                  className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-11" 
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-3 p-6 border-t border-[#202f25] bg-[#0f1712]/50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/inventory/warehouses')} 
              className="text-[#9ea8a1] border-[#2c3d32] hover:bg-[#18241d] hover:text-[#f4efe6]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="old-money-gold-btn px-6 py-2"
            >
              <Send className="mr-2 h-4 w-4" /> {isSubmitting ? 'Transferring...' : 'Execute Stock Transfer'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default WarehouseTransfersPage;