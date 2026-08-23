import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, User, MapPin, Mail, Calendar, CheckCircle2, Clock, Truck, XCircle, DollarSign, Package } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getOrder, updateOrderStatus, cancelOrder } from '@/lib/api';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    try {
      const res = await getOrder(orderId);
      if (res && res.data) {
        setOrder(res.data);
        setSelectedStatus(res.data.status);
      }
    } catch (error) {
      console.error('Error loading order:', error);
      toast({
        title: 'Error',
        description: 'Failed to retrieve order details from database.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    setSelectedStatus(newStatus);
    try {
      if (newStatus === 'Cancelled') {
        await cancelOrder(orderId);
      } else {
        await updateOrderStatus(orderId, { status: newStatus });
      }
      setOrder(prev => ({ ...prev, status: newStatus }));
      toast({ title: "Status Updated", description: `Order status changed to ${newStatus}.` });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({ title: "Update Failed", description: error.message || "Could not update status.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <ShoppingCart className="h-10 w-10 animate-spin text-[#c5a059]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 old-money-card border-[#2e4034] rounded-xl max-w-lg mx-auto">
        <h2 className="text-xl font-serif text-[#f8f6f0] mb-3">Order Not Found</h2>
        <Button onClick={() => navigate('/orders')} className="old-money-gold-btn text-xs uppercase tracking-wider">
          Return to Orders
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
          onClick={() => navigate('/orders')} 
          className="text-[#c5a059] border-[#3a4d41] hover:bg-[#1f2e25] hover:text-[#f8f6f0]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-[#9ea8a1]">Order Status:</span>
          <div className="w-44">
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-9">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
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
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Requisition Details</span>
                  <CardTitle className="text-2xl font-serif text-[#f8f6f0] mt-0.5">
                    Order #{order.id || order._id}
                  </CardTitle>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#9ea8a1]">Recorded Date</span>
                  <p className="text-sm font-medium text-[#f4efe6]">{order.date || 'Today'}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#c5a059]">Items Ordered</h3>
              <div className="space-y-2">
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-[#111a14] border border-[#243328] text-xs">
                    <div>
                      <span className="font-medium text-[#f4efe6]">{item.productName || 'Catalog Item'}</span>
                      <p className="text-[11px] text-[#9ea8a1]">Qty: {item.quantity} × ${Number(item.unitPrice || 0).toFixed(2)}</p>
                    </div>
                    <span className="font-serif text-[#c5a059] font-semibold">
                      ${(Number(item.quantity || 0) * Number(item.unitPrice || 0)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              {order.notes && (
                <div className="p-3.5 rounded-lg bg-[#111a14] border border-[#243328] text-xs text-[#9ea8a1]">
                  <span className="text-[#c5a059] font-medium block mb-1">Notes:</span>
                  {order.notes}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card className="old-money-card border-[#2e4034] rounded-xl shadow-xl">
            <CardHeader className="border-b border-[#202f25] p-5 bg-[#0f1712]/70">
              <CardTitle className="text-base font-serif text-[#f8f6f0]">Client Information</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs text-[#d8d3c5]">
              <div>
                <span className="text-[#9ea8a1] block text-[10px] uppercase tracking-wider">Account</span>
                <span className="font-medium text-[#f8f6f0]">{order.customerName}</span>
              </div>
              <div>
                <span className="text-[#9ea8a1] block text-[10px] uppercase tracking-wider">Email</span>
                <span className="text-[#c5a059]">{order.customerEmail}</span>
              </div>
              <div>
                <span className="text-[#9ea8a1] block text-[10px] uppercase tracking-wider">Destination</span>
                <span className="text-[#e5dec9]">{order.shippingAddress}</span>
              </div>
              <hr className="border-[#202f25] my-2" />
              <div className="flex justify-between items-center text-sm font-serif">
                <span className="text-[#f8f6f0] font-semibold">Total:</span>
                <span className="text-[#c5a059] font-bold text-lg">${Number(order.total || 0).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetailsPage;