import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { FilePlus, ArrowLeft, Package, CheckCircle2, Clock, Truck, DollarSign, PackageCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPurchaseOrder, updatePurchaseOrderStatus, receiveItems, cancelPurchaseOrder } from '@/lib/api';

const PurchaseOrderDetailsPage = () => {
  const { poId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [po, setPo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchPODetails = async () => {
    setIsLoading(true);
    try {
      const res = await getPurchaseOrder(poId);
      if (res && res.data) {
        setPo(res.data);
        setSelectedStatus(res.data.status);
      }
    } catch (e) {
      console.error('Error fetching PO details:', e);
      toast({ title: 'Error', description: 'Failed to retrieve purchase order.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPODetails();
  }, [poId]);

  const handleStatusChange = async (newStatus) => {
    setSelectedStatus(newStatus);
    try {
      if (newStatus === 'Cancelled') {
        await cancelPurchaseOrder(poId);
      } else {
        await updatePurchaseOrderStatus(poId, { status: newStatus });
      }
      setPo(prev => ({ ...prev, status: newStatus }));
      toast({ title: "Status Updated", description: `Purchase Order marked as ${newStatus}.` });
    } catch (e) {
      toast({ title: "Update Failed", description: e.message || "Failed to update PO.", variant: "destructive" });
    }
  };

  const handleReceiveAll = async () => {
    if (!po || !po.items) return;
    try {
      const receivePayload = {
        items: po.items.map(i => ({
          productId: i.productId,
          receivedQuantity: (i.quantity || 0) - (i.receivedQuantity || 0)
        }))
      };
      const updated = await receiveItems(poId, receivePayload);
      if (updated && updated.data) {
        setPo(updated.data);
        setSelectedStatus(updated.data.status);
      }
      toast({ title: "Inventory Received", description: "All items marked as received into warehouse stock." });
    } catch (e) {
      toast({ title: "Failed", description: e.message || "Could not receive items.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <FilePlus className="h-10 w-10 animate-spin text-[#c5a059]" />
      </div>
    );
  }

  if (!po) {
    return (
      <div className="text-center py-20 old-money-card border-[#2e4034] rounded-xl max-w-lg mx-auto">
        <h2 className="text-xl font-serif text-[#f8f6f0] mb-3">Purchase Order Not Found</h2>
        <Button onClick={() => navigate('/purchase-orders')} className="old-money-gold-btn text-xs uppercase tracking-wider">
          Return to Purchase Orders
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
          onClick={() => navigate('/purchase-orders')} 
          className="text-[#c5a059] border-[#3a4d41] hover:bg-[#1f2e25] hover:text-[#f8f6f0]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Purchase Orders
        </Button>
        <div className="flex items-center gap-3">
          <Button onClick={handleReceiveAll} className="old-money-gold-btn text-xs uppercase tracking-wider h-9">
            <PackageCheck className="mr-1.5 h-4 w-4" /> Receive All Items
          </Button>
          <div className="w-44">
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-9">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Partially Received">Partially Received</SelectItem>
                <SelectItem value="Received">Received</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="old-money-card border-[#2e4034] rounded-xl shadow-xl">
            <CardHeader className="border-b border-[#202f25] p-6 bg-[#0f1712]/70">
              <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Procurement Contract</span>
              <CardTitle className="text-2xl font-serif text-[#f8f6f0] mt-1">PO #{po.id || po._id}</CardTitle>
              <CardDescription className="text-xs text-[#9ea8a1]">Supplier: {po.supplierName || po.supplier?.name}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#c5a059]">Items Ordered & Receipt Status</h3>
              <div className="space-y-2">
                {po.items && po.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-[#111a14] border border-[#243328] text-xs">
                    <div>
                      <span className="font-medium text-[#f4efe6]">{item.productName || 'Stock Line'}</span>
                      <p className="text-[11px] text-[#9ea8a1]">
                        Ordered: {item.quantity} | Received: <span className="text-[#6ee7b7]">{item.receivedQuantity || 0}</span> @ ${Number(item.unitCost || 0).toFixed(2)}
                      </p>
                    </div>
                    <span className="font-serif text-[#c5a059] font-semibold">
                      ${(Number(item.quantity || 0) * Number(item.unitCost || 0)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              {po.notes && (
                <div className="p-3.5 rounded-lg bg-[#111a14] border border-[#243328] text-xs text-[#9ea8a1]">
                  <span className="text-[#c5a059] font-medium block mb-1">Contract Notes:</span>
                  {po.notes}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="old-money-card border-[#2e4034] rounded-xl shadow-xl p-5 space-y-4 text-xs text-[#d8d3c5]">
            <h4 className="font-serif font-semibold text-base text-[#f8f6f0]">Contract Summary</h4>
            <div>
              <span className="text-[#9ea8a1] block text-[10px] uppercase tracking-wider">Merchant</span>
              <span className="font-medium text-[#f8f6f0]">{po.supplierName || po.supplier?.name}</span>
            </div>
            <div>
              <span className="text-[#9ea8a1] block text-[10px] uppercase tracking-wider">Issued Date</span>
              <span>{po.date || 'Recent'}</span>
            </div>
            <div>
              <span className="text-[#9ea8a1] block text-[10px] uppercase tracking-wider">Expected Arrival</span>
              <span>{po.expectedDeliveryDate || 'Standard Schedule'}</span>
            </div>
            <hr className="border-[#202f25] my-2" />
            <div className="flex justify-between items-center text-sm font-serif">
              <span className="text-[#f8f6f0] font-semibold">Total Outlay:</span>
              <span className="text-[#c5a059] font-bold text-lg">${Number(po.total || 0).toFixed(2)}</span>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default PurchaseOrderDetailsPage;