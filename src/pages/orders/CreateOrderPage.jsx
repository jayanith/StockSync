import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Package, PlusCircle, Trash2, DollarSign } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { getProducts, createOrder } from '@/lib/api';

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1, unitPrice: 0 }]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProds = async () => {
      try {
        const response = await getProducts();
        if (response && response.data) {
          setAvailableProducts(response.data.map(p => ({
            id: String(p.id || p._id),
            name: p.name,
            price: p.price,
            stock: p.quantity
          })));
        }
      } catch (e) {
        console.error('Error fetching products:', e);
      }
    };
    fetchProds();
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'productId') {
      const product = availableProducts.find(p => p.id === value);
      newItems[index].unitPrice = product ? product.price : 0;
    }
    
    if (field === 'quantity') {
      const parsed = parseInt(value) || 1;
      newItems[index].quantity = parsed < 1 ? 1 : parsed;
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) {
      toast({ title: "Notice", description: "An order must contain at least one item." });
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSubtotal = (item) => {
    return (item.quantity || 0) * (item.unitPrice || 0);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + calculateSubtotal(item), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !shippingAddress.trim() || items.some(item => !item.productId)) {
      toast({ title: "Validation Error", description: "Please complete customer details and select products for all lines.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      shippingAddress: shippingAddress.trim(),
      notes: notes.trim() || undefined,
      status: 'Pending',
      total: calculateTotal(),
      items: items.map(item => ({
        productId: item.productId,
        productName: availableProducts.find(p => p.id === item.productId)?.name || 'Selected Item',
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };

    try {
      await createOrder(orderPayload);
      toast({ title: "Order Created", description: "Client order has been logged into MySQL." });
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Order Failed",
        description: error.message || "Failed to save order to database.",
        variant: "destructive"
      });
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
        onClick={() => navigate('/orders')} 
        className="text-[#c5a059] border-[#3a4d41] hover:bg-[#1f2e25] hover:text-[#f4efe6]"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
      </Button>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="old-money-card border-[#2e4034] rounded-xl shadow-xl">
              <CardHeader className="border-b border-[#202f25] p-6 bg-[#0f1712]/70">
                <CardTitle className="text-xl font-serif text-[#f8f6f0] flex items-center">
                  <ShoppingCart className="mr-3 h-5 w-5 text-[#c5a059]" /> Client Requisition
                </CardTitle>
                <CardDescription className="text-xs text-[#9ea8a1]">Client information and destination details</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">Customer / Client Name *</Label>
                    <Input 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)} 
                      placeholder="e.g. Lord Alexander Sterling" 
                      className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059]" 
                    />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">Client Email *</Label>
                    <Input 
                      type="email" 
                      value={customerEmail} 
                      onChange={(e) => setCustomerEmail(e.target.value)} 
                      placeholder="client@estates.co.uk" 
                      className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059]" 
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">Shipping Address *</Label>
                  <Textarea 
                    value={shippingAddress} 
                    onChange={(e) => setShippingAddress(e.target.value)} 
                    placeholder="22 Berkeley Square, Mayfair, London W1J 6ES" 
                    className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] min-h-[70px]" 
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-[#9ea8a1]">Order Notes & Instructions (Optional)</Label>
                  <Textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="Private courier required with signature upon delivery..." 
                    className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] min-h-[60px]" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="old-money-card border-[#2e4034] rounded-xl shadow-xl">
              <CardHeader className="border-b border-[#202f25] p-5 bg-[#0f1712]/70">
                <CardTitle className="text-lg font-serif text-[#f8f6f0] flex items-center">
                  <Package className="mr-2 h-5 w-5 text-[#c5a059]" /> Line Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {items.map((item, index) => (
                  <div 
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-[3fr_1fr_1.5fr_auto] gap-3 items-end p-3.5 bg-[#111a14] border border-[#26372c] rounded-lg"
                  >
                    <div>
                      <Label className="text-[11px] uppercase tracking-wider text-[#9ea8a1]">Product Item *</Label>
                      <div className="mt-1">
                        <Select value={item.productId} onValueChange={(val) => handleItemChange(index, 'productId', val)}>
                          <SelectTrigger className="w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-10">
                            <SelectValue placeholder="Select catalog item" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                            {availableProducts.map(p => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name} (${Number(p.price).toFixed(2)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-[11px] uppercase tracking-wider text-[#9ea8a1]">Quantity</Label>
                      <Input 
                        type="number" 
                        min="1" 
                        value={item.quantity} 
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} 
                        className="mt-1 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-10" 
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] uppercase tracking-wider text-[#9ea8a1]">Unit Price</Label>
                      <p className="mt-1 px-3 py-2 rounded-md bg-[#141f18] border border-[#2c3d32] text-xs font-serif text-[#c5a059] font-medium h-10 flex items-center">
                        ${Number(item.unitPrice || 0).toFixed(2)}
                      </p>
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
                <CardTitle className="text-lg font-serif text-[#f8f6f0]">Order Summary</CardTitle>
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
                  <span>Total Valuation</span>
                  <span className="text-[#c5a059] text-base">${calculateTotal().toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full old-money-gold-btn text-xs uppercase tracking-wider py-3 shadow-lg"
                >
                  <DollarSign className="mr-1.5 h-4 w-4" /> {isSubmitting ? 'Placing Order...' : 'Submit Client Order'}
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