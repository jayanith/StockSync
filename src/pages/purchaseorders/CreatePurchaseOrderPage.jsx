
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { FilePlus, ArrowLeft, Users2, Package, PlusCircle, Trash2, DollarSign, CalendarDays } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

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

  useEffect(() => {
    const storedSuppliers = JSON.parse(localStorage.getItem('inventorySuppliers')) || [];
    setAvailableSuppliers(storedSuppliers);
    const storedProducts = JSON.parse(localStorage.getItem('inventoryProducts')) || [];
    // For POs, we might want all products, not just those from a specific supplier initially
    setAvailableProducts(storedProducts.map(p => ({ id: p.id, name: p.name, cost: p.cost || p.price * 0.7, stock: p.quantity }))); // Assuming cost if not present
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'productId') {
      const product = availableProducts.find(p => p.id === value);
      newItems[index].unitCost = product ? product.cost : 0;
    }
    
    if (field === 'quantity' && parseInt(value) < 1) {
      newItems[index].quantity = 1;
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, unitCost: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateSubtotal = (item) => {
    return item.quantity * item.unitCost;
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + calculateSubtotal(item), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!supplierId || !poDate || items.some(item => !item.productId)) {
      toast({ title: "Validation Error", description: "Please select a supplier, PO date, and ensure all items have a product selected.", variant: "destructive" });
      return;
    }

    const newPO = {
      id: `PO-${Date.now().toString().slice(-6)}`,
      supplierId,
      supplierName: availableSuppliers.find(s => s.id === supplierId)?.name || 'Unknown Supplier',
      date: poDate,
      expectedDeliveryDate,
      items: items.map(item => ({
        ...item,
        productName: availableProducts.find(p => p.id === item.productId)?.name || 'Unknown Product'
      })),
      total: calculateTotal(),
      status: 'Draft', // Default status
      notes,
      itemsCount: items.length,
    };

    const existingPOs = JSON.parse(localStorage.getItem('inventoryPurchaseOrders')) || [];
    localStorage.setItem('inventoryPurchaseOrders', JSON.stringify([...existingPOs, newPO]));

    toast({ title: "Purchase Order Created", description: `PO ${newPO.id} has been successfully created as a draft.` });
    navigate('/purchase-orders');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button variant="outline" onClick={() => navigate('/purchase-orders')} className="mb-6 text-sky-400 border-sky-500 hover:bg-sky-500/10">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Purchase Orders
      </Button>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center">
                  <FilePlus className="mr-3 h-7 w-7" /> Create New Purchase Order
                </CardTitle>
                <CardDescription className="text-gray-400">Fill in supplier and PO details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="supplierId" className="text-gray-300">Supplier*</Label>
                    <Select value={supplierId} onValueChange={setSupplierId}>
                      <SelectTrigger id="supplierId" className="w-full bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {availableSuppliers.map(s => (
                          <SelectItem key={s.id} value={s.id} className="hover:bg-sky-700/50 focus:bg-sky-600">{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="poDate" className="text-gray-300">PO Date*</Label>
                    <Input id="poDate" type="date" value={poDate} onChange={(e) => setPoDate(e.target.value)} className="bg-slate-700 border-slate-600" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="expectedDeliveryDate" className="text-gray-300">Expected Delivery Date</Label>
                  <Input id="expectedDeliveryDate" type="date" value={expectedDeliveryDate} onChange={(e) => setExpectedDeliveryDate(e.target.value)} className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-gray-300">Notes (Optional)</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Payment terms, specific instructions" className="bg-slate-700 border-slate-600 min-h-[80px]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-sky-400 flex items-center"><Package className="mr-2 h-6 w-6" /> PO Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end p-3 border border-slate-700 rounded-md"
                  >
                    <div>
                      <Label htmlFor={`product-${index}`} className="text-xs text-gray-400">Product*</Label>
                      <Select value={item.productId} onValueChange={(value) => handleItemChange(index, 'productId', value)}>
                        <SelectTrigger id={`product-${index}`} className="w-full bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                          {availableProducts.map(p => (
                            <SelectItem key={p.id} value={p.id} className="hover:bg-sky-700/50 focus:bg-sky-600">{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`quantity-${index}`} className="text-xs text-gray-400">Quantity*</Label>
                      <Input id={`quantity-${index}`} type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))} className="bg-slate-700 border-slate-600" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-400">Unit Cost</Label>
                      <Input type="number" step="0.01" value={item.unitCost} onChange={(e) => handleItemChange(index, 'unitCost', parseFloat(e.target.value))} className="bg-slate-700 border-slate-600" placeholder="0.00"/>
                    </div>
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)} className="h-10 w-10 bg-red-600/80 hover:bg-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
                <Button type="button" variant="outline" onClick={addItem} className="w-full text-sky-400 border-sky-500 hover:bg-sky-500/10">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-slate-800/70 border-slate-700 shadow-xl sticky top-20">
              <CardHeader>
                <CardTitle className="text-xl text-sky-400">PO Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item, index) => {
                  const product = availableProducts.find(p => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <div key={index} className="flex justify-between text-sm text-gray-300">
                      <span>{product.name} x {item.quantity}</span>
                      <span>${calculateSubtotal(item).toFixed(2)}</span>
                    </div>
                  );
                })}
                <hr className="border-slate-700" />
                <div className="flex justify-between text-lg font-semibold text-white">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md text-base py-3">
                  <DollarSign className="mr-2 h-5 w-5" /> Create Purchase Order
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
  