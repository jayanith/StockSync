import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Package, ArrowLeft, DollarSign, Tag, Barcode, Building2, Save, Trash2 } from 'lucide-react';
import { getProduct, updateProduct, deleteProduct, getCategories, getSuppliers } from '@/lib/api';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [supplier, setSupplier] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProductData = async () => {
      setIsLoading(true);
      try {
        const [prodRes, catRes, supRes] = await Promise.allSettled([
          getProduct(productId),
          getCategories(),
          getSuppliers()
        ]);

        if (catRes.status === 'fulfilled' && catRes.value?.data) {
          setCategories(catRes.value.data.map(c => ({ id: String(c.id || c._id), name: c.name })));
        }

        if (supRes.status === 'fulfilled' && supRes.value?.data) {
          setSuppliers(supRes.value.data.map(s => ({ id: String(s.id || s._id), name: s.name })));
        }

        if (prodRes.status === 'fulfilled' && prodRes.value?.data) {
          const p = prodRes.value.data;
          setProduct(p);
          setName(p.name || '');
          setSku(p.sku || '');
          setBarcode(p.barcode || '');
          setPrice(p.price !== undefined && p.price !== null ? String(p.price) : '0');
          setQuantity(p.quantity !== undefined && p.quantity !== null ? String(p.quantity) : '0');
          
          let catId = '';
          if (p.category) {
            catId = typeof p.category === 'object' ? String(p.category.id || p.category._id || '') : String(p.category);
          }
          setCategory(catId);

          let supId = '';
          if (p.supplier) {
            supId = typeof p.supplier === 'object' ? String(p.supplier.id || p.supplier._id || '') : String(p.supplier);
          }
          setSupplier(supId);

          setDescription(p.description || '');
        }
      } catch (e) {
        console.error('Error loading product details:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadProductData();
  }, [productId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) {
      toast({ title: "Validation Error", description: "Product name and SKU are required.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const parsedPrice = parseFloat(price);
      const parsedQty = parseInt(quantity);

      const payload = {
        name: name.trim(),
        sku: sku.trim(),
        barcode: barcode.trim() || undefined,
        price: isNaN(parsedPrice) ? 0.0 : parsedPrice,
        quantity: isNaN(parsedQty) ? 0 : parsedQty,
        category: category && category !== 'undefined' ? category : undefined,
        supplier: supplier && supplier !== 'undefined' ? supplier : undefined,
        description: description.trim() || undefined
      };

      await updateProduct(productId, payload);
      toast({ title: "Product Updated", description: "Catalog changes synchronized with MySQL." });
    } catch (e) {
      console.error('Update error:', e);
      toast({ title: "Failed to Update", description: e.message || "Failed to update product.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(productId);
      toast({ title: "Product Deleted", description: "Item removed from inventory." });
      navigate('/products');
    } catch (e) {
      toast({ title: "Failed", description: "Could not delete product.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Package className="h-10 w-10 animate-spin text-[#c5a059]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 old-money-card border-[#2e4034] rounded-xl max-w-lg mx-auto">
        <h2 className="text-xl font-serif text-[#f8f6f0] mb-3">Product Not Found</h2>
        <Button onClick={() => navigate('/products')} className="old-money-gold-btn text-xs uppercase tracking-wider">
          Return to Catalog
        </Button>
      </div>
    );
  }

  const img = (product.images && product.images.length > 0)
    ? product.images[0]
    : "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop";

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
          onClick={() => navigate('/products')} 
          className="text-[#c5a059] border-[#3a4d41] hover:bg-[#1f2e25] hover:text-[#f8f6f0]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleDelete} 
          className="bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/50 text-xs"
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" /> Remove from Catalog
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="old-money-card border-[#2e4034] rounded-xl shadow-xl">
            <CardHeader className="border-b border-[#202f25] p-6 bg-[#0f1712]/70">
              <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Catalog Specification</span>
              <CardTitle className="text-2xl font-serif text-[#f8f6f0] mt-1">{product.name}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="p-6 space-y-4 text-xs">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-[#c5a059]">Product Name *</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 bg-[#141f18] border-[#2c3d32] text-[#f4efe6]" />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-[#c5a059]">SKU Reference *</Label>
                    <Input value={sku} onChange={(e) => setSku(e.target.value)} className="mt-1 bg-[#141f18] border-[#2c3d32] text-[#f4efe6]" />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-[#c5a059]">Unit Retail Price ($) *</Label>
                    <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] font-serif text-[#c5a059]" />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-[#c5a059]">Warehouse Stock Quantity *</Label>
                    <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1 bg-[#141f18] border-[#2c3d32] text-[#f4efe6]" />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-[#9ea8a1]">Category</Label>
                    <div className="mt-1">
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-10">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                          {categories.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-[#9ea8a1]">Supplier Guild</Label>
                    <div className="mt-1">
                      <Select value={supplier} onValueChange={setSupplier}>
                        <SelectTrigger className="w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-10">
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                          {suppliers.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider text-[#9ea8a1]">Description & Specs</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] min-h-[80px]" />
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 border-t border-[#202f25] bg-[#0f1712]/50 flex justify-end">
                <Button type="submit" disabled={isSaving} className="old-money-gold-btn text-xs uppercase tracking-wider px-6 py-2">
                  <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Update Product'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-5">
          <Card className="old-money-card border-[#2e4034] rounded-xl overflow-hidden shadow-xl">
            <img src={img} alt={product.name} className="w-full h-52 object-cover" />
            <CardContent className="p-5 text-xs text-[#d8d3c5] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#9ea8a1]">SKU</span>
                <span className="font-mono text-[#f8f6f0]">{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9ea8a1]">Total Asset Value</span>
                <span className="font-serif text-[#c5a059] font-semibold">${((Number(product.quantity) || 0) * (Number(product.price) || 0)).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailsPage;