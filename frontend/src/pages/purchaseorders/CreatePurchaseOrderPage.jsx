import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { FilePlus, ArrowLeft, Users2, Package, PlusCircle, Trash2, DollarSign } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { getSuppliers, getProducts, createPurchaseOrder } from '@/lib/api';

const CreatePurchaseOrderPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [supplierId, setSupplierId] = useState('');
  const [poDate, setPoDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1, unitCost: 0 }]);
  const [availableSuppliers, setAvailableSuppliers] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [supRes, prodRes] = await Promise.allSettled([
          getSuppliers(),
          getProducts()
        ]);

        if (supRes.status === 'fulfilled' && supRes.value?.data) {
          setAvailableSuppliers(supRes.value.data.map(s => ({
            id: String(s.id || s._id),
            name: s.name
          })));
        }

        if (prodRes.status === 'fulfilled' && prodRes.value?.data) {
          setAvailableProducts(prodRes.value.data.map(p => ({
            id: String(p.id || p._id),
            name: p.name,
            cost: p.cost || (Number(p.price || 0) * 0.65)
          })));
        }
      } catch (e) {
        console.error('Error loading PO dependencies:', e);
      }
    };
    loadDependencies();
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'productId') {
      const product = availableProducts.find(p => p.id === value);
      newItems[index].unitCost = product ? Number(product.cost).toFixed(2) : 0;
    }
    
    if (field === 'quantity') {
      const parsed = parseInt(value) || 1;
      newItems[index].quantity = parsed < 1 ? 1 : parsed;
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, unitCost: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) {
      toast({ title: "Notice", description: "A purchase order must include at least one item." });
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSubtotal = (item) => {
    return (Number(item.quantity) || 0) * (Number(item.unitCost) || 0);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + calculateSubtotal(item), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplierId || !poDate || items.some(item => !item.productId)) {
      toast({ title: "Validation Error", description: "Please select a supplier, PO date, and ensure items are selected.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    const supObj = availableSuppliers.find(s => s.id === supplierId);

    const poPayload = {
      supplierId: supplierId,
      supplierName: supObj?.name || 'Selected Merchant',
      date: poDate,
      expectedDeliveryDate: expectedDeliveryDate || undefined,
      notes: notes.trim() || undefined,
      status: 'Approved',
      total: calculateTotal(),
      items: items.map(item => ({
        productId: item.productId,
        productName: availableProducts.find(p => p.id === item.productId)?.name || 'Restock Product',
        quantity: parseInt(item.quantity),
        unitCost: parseFloat(item.unitCost)
      }))
    };

    try {
      await createPurchaseOrder(poPayload);
      toast({ title: "Purchase Order Created", description: "Purchase contract saved to MySQL." });
      navigate('/purchase-orders');
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast({ title: "Error", description: error.message || "Failed to save purchase order.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <Button 
        variant="outline" 
        onClick={() => navigate('/purchase-orders')} 
        className="text-[#c5a059] border-[#3a4d41] hover:bg-[#1f2e25] hover:text-[#f8f6f0]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Purchase Orders
      </Button>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="old-money-card border-[#2e4034] rounded-xl shadow-xl">
              <CardHeader className="border-b border-[#202f25] p-6 bg-[#0f1712]/70">
                <CardTitle className="text-xl font-serif text-[#f8f6f0] flex items-center">
                  <FilePlus className="mr-3 h-5 w-5 text-[#c5a059]" /> Create Acquisition Contract
                </CardTitle>
                <CardDescription className="text-xs text-[#9ea8a1]">Supplier details and fulfillment timeframe</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">Supplier / Merchant *</Label>
                    <div className="mt-1.5">
                      <Select value={supplierId} onValueChange={setSupplierId}>
                        <SelectTrigger className="w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-11">
                          <SelectValue placeholder="Select vendor guild" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                          {availableSuppliers.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">PO Issue Date *</Label>
                    <Input 
                      type="date" 
                      value={poDate} 
                      onChange={(e) => setPoDate(e.target.value)} 
                      className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] text-xs h-11" 
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-[#9ea8a1]">Expected Delivery Date</Label>
                  <Input 
                    type="date" 
                    value={expectedDeliveryDate} 
                    onChange={(e) => setExpectedDeliveryDate(e.target.value)} 
                    className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] text-xs h-11" 
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-[#9ea8a1]">Acquisition Notes & Terms</Label>
                  <Textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="e.g. Standard wholesale terms, freight insured..." 
                    className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] min-h-[70px]" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="old-money-card border-[#2e4034] rounded-xl shadow-xl">
              <CardHeader className="border-b border-[#202f25] p-5 bg-[#0f1712]/70">
                <CardTitle className="text-lg font-serif text-[#f8f6f0] flex items-center">
                  <Package className="mr-2 h-5 w-5 text-[#c5a059]" /> Restock Inventory Lines
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {items.map((item, index) => (
                  <div 
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-[3fr_1fr_1.5fr_auto] gap-3 items-end p-3.5 bg-[#111a14] border border-[#26372c] rounded-lg"
                  >
                    <div>
                      <Label className="text-[11px] uppercase tracking-wider text-[#9ea8a1]">Catalog Product *</Label>
                      <div className="mt-1">
                        <Select value={item.productId} onValueChange={(val) => handleItemChange(index, 'productId', val)}>
                          <SelectTrigger className="w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-10">
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                            {availableProducts.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-[11px] uppercase tracking-wider text-[#9ea8a1]">Units</Label>
                      <Input 
                        type="number" 
                        min="1" 
                        value={item.quantity} 
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
                        className="mt-1 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-10" 
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] uppercase tracking-wider text-[#9ea8a1]">Unit Cost ($)</Label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        value={item.unitCost} 
                        onChange={(e) => handleItemChange(index, 'unitCost', e.target.value)} 
                        className="mt-1 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-10 font-serif text-[#c5a059]" 
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(index)} 
                      className="h-10 w-10 text-red-400 hover:bg-red-950/40 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addItem} 
                  className="w-full text-[#c5a059] border-[#2e4034] hover:bg-[#19271f] hover:text-[#f8f6f0] mt-2 text-xs uppercase tracking-wider py-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item Line
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="old-money-card border-[#2e4034] rounded-xl shadow-xl sticky top-20">
              <CardHeader className="border-b border-[#202f25] p-5 bg-[#0f1712]/70">
                <CardTitle className="text-lg font-serif text-[#f8f6f0]">Contract Valuation</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {items.map((item, index) => {
                  const product = availableProducts.find(p => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <div key={index} className="flex justify-between text-xs text-[#d8d3c5]">
                      <span className="truncate max-w-[170px]">{product.name} × {item.quantity}</span>
                      <span className="font-serif text-[#c5a059]">${calculateSubtotal(item).toFixed(2)}</span>
                    </div>
                  );
                })}
                <hr className="border-[#25352c] my-2" />
                <div className="flex justify-between text-sm font-serif font-bold text-[#f8f6f0]">
                  <span>Total Capital Outlay</span>
                  <span className="text-[#c5a059] text-base">${calculateTotal().toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full old-money-gold-btn text-xs uppercase tracking-wider py-3 shadow-lg"
                >
                  <DollarSign className="mr-1.5 h-4 w-4" /> {isSubmitting ? 'Issuing PO...' : 'Issue Purchase Order'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CreatePurchaseOrderPage;