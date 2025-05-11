
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, User, Package, PlusCircle, Trash2, DollarSign } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1, unitPrice: 0 }]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('inventoryProducts')) || [];
    setAvailableProducts(storedProducts.map(p => ({ id: p.id, name: p.name, price: p.price, stock: p.quantity })));
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'productId') {
      const product = availableProducts.find(p => p.id === value);
      newItems[index].unitPrice = product ? product.price : 0;
      if (product && newItems[index].quantity > product.stock) {
        newItems[index].quantity = product.stock; // Cap quantity at available stock
        toast({ title: "Stock Alert", description: `Quantity for ${product.name} capped at available stock: ${product.stock}`, variant: "destructive", duration: 2000 });
      }
    }
    
    if (field === 'quantity') {
      const product = availableProducts.find(p => p.id === newItems[index].productId);
      if (product && parseInt(value) > product.stock) {
        newItems[index].quantity = product.stock; // Cap quantity
        toast({ title: "Stock Alert", description: `Quantity for ${product.name} capped at available stock: ${product.stock}`, variant: "destructive", duration: 2000 });
      } else if (parseInt(value) < 1) {
        newItems[index].quantity = 1; // Minimum quantity is 1
      }
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateSubtotal = (item) => {
    return item.quantity * item.unitPrice;
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + calculateSubtotal(item), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !shippingAddress.trim() || items.some(item => !item.productId)) {
      toast({ title: "Validation Error", description: "Please fill all required fields and select products for all items.", variant: "destructive" });
      return;
    }

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customerName,
      customerEmail,
      shippingAddress,
      items: items.map(item => ({
        ...item,
        productName: availableProducts.find(p => p.id === item.productId)?.name || 'Unknown Product'
      })),
      total: calculateTotal(),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending', // Default status
      notes,
    };

    // Update stock levels
    const updatedProducts = [...availableProducts];
    let stockError = false;
    newOrder.items.forEach(orderItem => {
      const productIndex = updatedProducts.findIndex(p => p.id === orderItem.productId);
      if (productIndex !== -1) {
        if (updatedProducts[productIndex].stock >= orderItem.quantity) {
          updatedProducts[productIndex].stock -= orderItem.quantity;
        } else {
          stockError = true;
          toast({ title: "Stock Error", description: `Not enough stock for ${updatedProducts[productIndex].name}. Order not placed.`, variant: "destructive" });
        }
      }
    });

    if (stockError) {
      return; // Stop if there was a stock issue
    }
    
    localStorage.setItem('inventoryProducts', JSON.stringify(updatedProducts.map(p => ({...p, quantity: p.stock })))); // Save updated stock

    const existingOrders = JSON.parse(localStorage.getItem('inventoryOrders')) || [];
    localStorage.setItem('inventoryOrders', JSON.stringify([...existingOrders, newOrder]));

    toast({ title: "Order Created", description: `Order ${newOrder.id} has been successfully created.` });
    navigate('/orders');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button variant="outline" onClick={() => navigate('/orders')} className="mb-6 text-sky-400 border-sky-500 hover:bg-sky-500/10">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
      </Button>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Details & Customer Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center">
                  <ShoppingCart className="mr-3 h-7 w-7" /> Create New Order
                </CardTitle>
                <CardDescription className="text-gray-400">Fill in customer and order details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName" className="text-gray-300">Customer Name*</Label>
                    <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="John Doe" className="bg-slate-700 border-slate-600" />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail" className="text-gray-300">Customer Email*</Label>
                    <Input id="customerEmail" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="john.doe@example.com" className="bg-slate-700 border-slate-600" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="shippingAddress" className="text-gray-300">Shipping Address*</Label>
                  <Textarea id="shippingAddress" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="123 Main St, Anytown, USA" className="bg-slate-700 border-slate-600 min-h-[80px]" />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-gray-300">Order Notes (Optional)</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Gift wrap, specific delivery instructions" className="bg-slate-700 border-slate-600 min-h-[80px]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-sky-400 flex items-center"><Package className="mr-2 h-6 w-6" /> Order Items</CardTitle>
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
                            <SelectItem key={p.id} value={p.id} disabled={p.stock === 0} className="hover:bg-sky-700/50 focus:bg-sky-600">
                              {p.name} (Stock: {p.stock})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`quantity-${index}`} className="text-xs text-gray-400">Quantity*</Label>
                      <Input id={`quantity-${index}`} type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))} className="bg-slate-700 border-slate-600" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-400">Unit Price</Label>
                      <p className="text-gray-200 p-2 rounded-md bg-slate-700/50 border border-slate-600">${item.unitPrice.toFixed(2)}</p>
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

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/70 border-slate-700 shadow-xl sticky top-20">
              <CardHeader>
                <CardTitle className="text-xl text-sky-400">Order Summary</CardTitle>
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
                <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md text-base py-3">
                  <DollarSign className="mr-2 h-5 w-5" /> Place Order
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateOrderPage;
  