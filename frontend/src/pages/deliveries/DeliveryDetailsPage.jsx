import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Truck, ArrowLeft, MapPin, Calendar, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDelivery, updateDeliveryStatus } from '@/lib/api';

const DeliveryDetailsPage = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [delivery, setDelivery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchDelivery = async () => {
      setIsLoading(true);
      try {
        const res = await getDelivery(deliveryId);
        if (res && res.data) {
          setDelivery(res.data);
          setSelectedStatus(res.data.status);
        }
      } catch (e) {
        console.error('Error fetching delivery:', e);
        toast({ title: 'Error', description: 'Failed to fetch delivery details.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDelivery();
  }, [deliveryId]);

  const handleStatusChange = async (newStatus) => {
    setSelectedStatus(newStatus);
    try {
      await updateDeliveryStatus(deliveryId, { status: newStatus });
      setDelivery(prev => ({ ...prev, status: newStatus }));
      toast({ title: "Status Updated", description: `Freight status set to ${newStatus}.` });
    } catch (e) {
      toast({ title: "Failed", description: e.message || "Could not update delivery status.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Truck className="h-10 w-10 animate-spin text-[#c5a059]" />
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="text-center py-20 old-money-card border-[#2e4034] rounded-xl max-w-lg mx-auto">
        <h2 className="text-xl font-serif text-[#f8f6f0] mb-3">Delivery Consignment Not Found</h2>
        <Button onClick={() => navigate('/deliveries')} className="old-money-gold-btn text-xs uppercase tracking-wider">
          Return to Deliveries
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
          onClick={() => navigate('/deliveries')} 
          className="text-[#c5a059] border-[#3a4d41] hover:bg-[#1f2e25] hover:text-[#f8f6f0]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deliveries
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-[#9ea8a1]">Freight Status:</span>
          <div className="w-44">
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-9">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
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
              <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Consignment Tracking</span>
              <CardTitle className="text-2xl font-serif text-[#f8f6f0] mt-1">{delivery.trackingNumber || `TRK-00${delivery.id}`}</CardTitle>
              <CardDescription className="text-xs text-[#9ea8a1]">Carrier: {delivery.carrier || 'Armored Freight Logistics'}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs text-[#d8d3c5]">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[#9ea8a1] block text-[10px] uppercase tracking-wider mb-1">Origin Facility</span>
                  <p className="font-medium text-[#f8f6f0] flex items-center"><MapPin className="h-3.5 w-3.5 mr-1 text-[#c5a059]" /> {delivery.origin || 'London Mayfair Vault'}</p>
                </div>
                <div>
                  <span className="text-[#9ea8a1] block text-[10px] uppercase tracking-wider mb-1">Destination Address</span>
                  <p className="font-medium text-[#f8f6f0] flex items-center"><MapPin className="h-3.5 w-3.5 mr-1 text-[#c5a059]" /> {delivery.destination || 'Highland Manor, Scotland'}</p>
                </div>
              </div>
              <hr className="border-[#202f25] my-2" />
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#c5a059] mb-2">Manifest Items</h4>
                {delivery.items && delivery.items.length > 0 ? (
                  <div className="space-y-2">
                    {delivery.items.map((i, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-[#111a14] border border-[#243328] flex justify-between">
                        <span>{i.productName || 'Catalog Consignment Item'}</span>
                        <span className="text-[#c5a059] font-semibold">{i.quantity} units</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#9ea8a1]">Single consignment parcel.</p>
                )}
              </div>
              {delivery.notes && (
                <div className="p-3.5 rounded-lg bg-[#111a14] border border-[#243328] mt-4">
                  <span className="text-[#c5a059] font-medium block mb-1">Courier Notes:</span>
                  {delivery.notes}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="old-money-card border-[#2e4034] rounded-xl shadow-xl p-5 space-y-4 text-xs text-[#d8d3c5]">
            <h4 className="font-serif font-semibold text-base text-[#f8f6f0]">Transit Metrics</h4>
            <div>
              <span className="text-[#9ea8a1] block text-[10px] uppercase tracking-wider">Classification</span>
              <span className="font-semibold text-[#c5a059]">{delivery.type || 'OUTBOUND'}</span>
            </div>
            <div>
              <span className="text-[#9ea8a1] block text-[10px] uppercase tracking-wider">Estimated Delivery</span>
              <span>{delivery.estimatedDelivery || 'In Scheduled Transit'}</span>
            </div>
            <div>
              <span className="text-[#9ea8a1] block text-[10px] uppercase tracking-wider">Confirmed Receipt</span>
              <span>{delivery.actualDelivery || 'Pending Final Delivery'}</span>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default DeliveryDetailsPage;