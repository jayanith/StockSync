
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Truck, ArrowLeft, User, MapPin, CalendarDays, Edit3, PackageSearch, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';

const DeliveryDetailsPage = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [delivery, setDelivery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');

  const deliveryStatuses = ["Pending Assignment", "Dispatched", "In Transit", "Delivered", "Delayed", "Failed"];

  useEffect(() => {
    setIsLoading(true);
    const allDeliveries = JSON.parse(localStorage.getItem('inventoryDeliveries')) || [];
    const foundDelivery = allDeliveries.find(d => d.id === deliveryId);

    if (foundDelivery) {
      setDelivery(foundDelivery);
      setCurrentStatus(foundDelivery.status);
    } else {
      toast({ title: "Error", description: "Delivery not found.", variant: "destructive" });
      navigate('/deliveries');
    }
    setIsLoading(false);
  }, [deliveryId, navigate, toast]);

  const handleStatusUpdate = () => {
     if (currentStatus === delivery.status) {
      setIsEditingStatus(false);
      return;
    }
    const allDeliveries = JSON.parse(localStorage.getItem('inventoryDeliveries')) || [];
    const updatedDeliveries = allDeliveries.map(d => 
      d.id === deliveryId ? { ...d, status: currentStatus } : d
    );
    localStorage.setItem('inventoryDeliveries', JSON.stringify(updatedDeliveries));
    setDelivery(prev => ({ ...prev, status: currentStatus }));
    setIsEditingStatus(false);
    toast({ title: "Status Updated", description: `Delivery status changed to ${currentStatus}.` });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Assignment': return 'text-gray-400 bg-gray-600/20 border-gray-500';
      case 'Dispatched': return 'text-blue-400 bg-blue-600/20 border-blue-500';
      case 'In Transit': return 'text-purple-400 bg-purple-600/20 border-purple-500';
      case 'Delivered': return 'text-green-400 bg-green-600/20 border-green-500';
      case 'Delayed': return 'text-orange-400 bg-orange-600/20 border-orange-500';
      case 'Failed': return 'text-red-400 bg-red-600/20 border-red-500';
      default: return 'text-gray-400 bg-gray-600/20 border-gray-500';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Truck className="h-12 w-12 animate-spin text-sky-500" /></div>;
  }

  if (!delivery) {
    return <div className="text-center py-10 text-red-500">Delivery not found.</div>;
  }
  
  const DetailItem = ({ label, value, icon, className }) => (
    <div className={className}>
      <Label className="text-sm font-medium text-gray-400 flex items-center">
        {icon && React.cloneElement(icon, { className: "mr-2 h-4 w-4"})}
        {label}
      </Label>
      <p className="text-gray-100">{value || 'N/A'}</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <Button variant="outline" onClick={() => navigate('/deliveries')} className="mb-6 text-sky-400 border-sky-500 hover:bg-sky-500/10">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deliveries
      </Button>

      <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
        <CardHeader className="border-b border-slate-700 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                Delivery {delivery.id}
              </CardTitle>
              <CardDescription className="text-gray-400 flex items-center mt-1">
                Order ID: <Link to={`/orders/${delivery.orderId}`} className="ml-1 text-sky-400 hover:underline">{delivery.orderId}</Link>
              </CardDescription>
            </div>
            <div className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(delivery.status)}`}>
              Status: {delivery.status}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader><CardTitle className="text-lg text-sky-300">Delivery Information</CardTitle></CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <DetailItem label="Customer" value={delivery.customerName} icon={<User />} />
                <DetailItem label="Assigned Driver" value={delivery.assignedDriver || 'Not Assigned'} icon={<User />} />
                <DetailItem label="Estimated Delivery" value={new Date(delivery.estimatedDelivery).toLocaleDateString()} icon={<CalendarDays />} />
                {/* Add more delivery specific details here if available, e.g. actual delivery date, tracking number */}
                <DetailItem label="Tracking Number" value={delivery.trackingNumber || 'N/A'} icon={<PackageSearch />} />
                <DetailItem label="Last Update" value={delivery.lastUpdate ? new Date(delivery.lastUpdate).toLocaleString() : 'N/A'} icon={<Clock />} className="sm:col-span-2"/>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader><CardTitle className="text-lg text-sky-300">Update Status</CardTitle></CardHeader>
              <CardContent>
                {isEditingStatus ? (
                  <div className="space-y-3">
                    <Select value={currentStatus} onValueChange={setCurrentStatus}>
                      <SelectTrigger className="w-full bg-slate-600 border-slate-500 text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600 text-white">
                        {deliveryStatuses.map(status => (
                          <SelectItem key={status} value={status} className="hover:bg-sky-600/50 focus:bg-sky-500">{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button onClick={handleStatusUpdate} size="sm" className="flex-1 bg-sky-500 hover:bg-sky-600 text-white">Save</Button>
                      <Button onClick={() => { setIsEditingStatus(false); setCurrentStatus(delivery.status); }} size="sm" variant="outline" className="flex-1 text-gray-300 border-slate-500 hover:bg-slate-600">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditingStatus(true)} variant="outline" className="w-full text-yellow-400 border-yellow-500 hover:bg-yellow-500/10">
                    <Edit3 className="mr-2 h-4 w-4" /> Change Status
                  </Button>
                )}
              </CardContent>
            </Card>
            {/* Placeholder for map integration or delivery history */}
            <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader><CardTitle className="text-lg text-sky-300">Delivery Route (Placeholder)</CardTitle></CardHeader>
                <CardContent className="h-48 flex items-center justify-center">
                    <MapPin className="h-16 w-16 text-slate-500" />
                    <p className="text-slate-500 ml-2">Map integration coming soon.</p>
                </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DeliveryDetailsPage;
  