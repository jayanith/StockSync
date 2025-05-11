
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { FilePlus, ArrowLeft, Users2, CalendarDays, DollarSign, Edit3, Package, Printer, FileText as FileTextIcon, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';

const PurchaseOrderDetailsPage = () => {
  const { poId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');

  const poStatuses = ["Draft", "Sent", "Partially Received", "Received", "Cancelled"];

  useEffect(() => {
    setIsLoading(true);
    const allPOs = JSON.parse(localStorage.getItem('inventoryPurchaseOrders')) || [];
    const foundPO = allPOs.find(p => p.id === poId);

    if (foundPO) {
      setPurchaseOrder(foundPO);
      setCurrentStatus(foundPO.status);
    } else {
      toast({ title: "Error", description: "Purchase Order not found.", variant: "destructive" });
      navigate('/purchase-orders');
    }
    setIsLoading(false);
  }, [poId, navigate, toast]);

  const handleStatusUpdate = () => {
    if (currentStatus === purchaseOrder.status) {
      setIsEditingStatus(false);
      return;
    }
    const allPOs = JSON.parse(localStorage.getItem('inventoryPurchaseOrders')) || [];
    const updatedPOs = allPOs.map(p => 
      p.id === poId ? { ...p, status: currentStatus } : p
    );
    localStorage.setItem('inventoryPurchaseOrders', JSON.stringify(updatedPOs));
    setPurchaseOrder(prev => ({ ...prev, status: currentStatus }));
    setIsEditingStatus(false);
    toast({ title: "Status Updated", description: `PO status changed to ${currentStatus}.` });
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'text-gray-400 bg-gray-600/20 border-gray-500';
      case 'Sent': return 'text-blue-400 bg-blue-600/20 border-blue-500';
      case 'Partially Received': return 'text-orange-400 bg-orange-600/20 border-orange-500';
      case 'Received': return 'text-green-400 bg-green-600/20 border-green-500';
      case 'Cancelled': return 'text-red-400 bg-red-600/20 border-red-500';
      default: return 'text-gray-400 bg-gray-600/20 border-gray-500';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><FilePlus className="h-12 w-12 animate-spin text-sky-500" /></div>;
  }

  if (!purchaseOrder) {
    return <div className="text-center py-10 text-red-500">Purchase Order not found.</div>;
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/purchase-orders')} className="text-sky-400 border-sky-500 hover:bg-sky-500/10 self-start md:self-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Purchase Orders
        </Button>
        <div className="flex gap-2">
            <Button variant="outline" className="text-sky-400 border-sky-500 hover:bg-sky-500/10">
                <Printer className="mr-2 h-4 w-4" /> Print PO
            </Button>
        </div>
      </div>

      <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
        <CardHeader className="border-b border-slate-700 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                Purchase Order {purchaseOrder.id}
              </CardTitle>
              <CardDescription className="text-gray-400 flex items-center mt-1">
                <CalendarDays className="mr-2 h-4 w-4" /> Created on: {new Date(purchaseOrder.date).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(purchaseOrder.status)}`}>
              Status: {purchaseOrder.status}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader><CardTitle className="text-lg text-sky-300">Supplier Information</CardTitle></CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <DetailItem label="Supplier Name" value={purchaseOrder.supplierName} icon={<Users2 />} />
                <Link to={`/suppliers/${purchaseOrder.supplierId}`} className="text-sm text-sky-400 hover:underline">View Supplier Details</Link>
                <DetailItem label="PO Date" value={new Date(purchaseOrder.date).toLocaleDateString()} icon={<CalendarDays />} />
                <DetailItem label="Expected Delivery" value={purchaseOrder.expectedDeliveryDate ? new Date(purchaseOrder.expectedDeliveryDate).toLocaleDateString() : 'N/A'} icon={<CalendarDays />} />
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader><CardTitle className="text-lg text-sky-300">Items Ordered</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-gray-400">
                      <tr>
                        <th className="py-2 text-left">Product</th>
                        <th className="py-2 text-center">Quantity</th>
                        <th className="py-2 text-right">Unit Cost</th>
                        <th className="py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-200">
                      {purchaseOrder.items.map((item, index) => (
                        <tr key={index} className="border-b border-slate-600 last:border-b-0">
                          <td className="py-3">{item.productName}</td>
                          <td className="py-3 text-center">{item.quantity}</td>
                          <td className="py-3 text-right">${item.unitCost.toFixed(2)}</td>
                          <td className="py-3 text-right">${(item.quantity * item.unitCost).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
             {purchaseOrder.notes && (
                 <Card className="bg-slate-700/50 border-slate-600">
                    <CardHeader><CardTitle className="text-lg text-sky-300">PO Notes</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-gray-300 whitespace-pre-wrap">{purchaseOrder.notes}</p>
                    </CardContent>
                </Card>
            )}
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader><CardTitle className="text-lg text-sky-300">PO Summary</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-gray-300"><span>Subtotal</span><span>${purchaseOrder.total.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-300"><span>Shipping (Est.)</span><span>$0.00</span></div>
                <div className="flex justify-between text-gray-300"><span>Tax (Est.)</span><span>$0.00</span></div>
                <hr className="border-slate-600 my-2"/>
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span>${purchaseOrder.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

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
                        {poStatuses.map(status => (
                          <SelectItem key={status} value={status} className="hover:bg-sky-600/50 focus:bg-sky-500">{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button onClick={handleStatusUpdate} size="sm" className="flex-1 bg-sky-500 hover:bg-sky-600 text-white">Save</Button>
                      <Button onClick={() => { setIsEditingStatus(false); setCurrentStatus(purchaseOrder.status); }} size="sm" variant="outline" className="flex-1 text-gray-300 border-slate-500 hover:bg-slate-600">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditingStatus(true)} variant="outline" className="w-full text-yellow-400 border-yellow-500 hover:bg-yellow-500/10">
                    <Edit3 className="mr-2 h-4 w-4" /> Change Status
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PurchaseOrderDetailsPage;
  