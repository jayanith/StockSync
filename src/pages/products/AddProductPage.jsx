import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { PackagePlus, ArrowLeft, DollarSign, Hash, Layers, Image as ImageIcon, AlertCircle, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategories, getSuppliers, createProduct } from '@/lib/api';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await getCategories();
        if (catRes && catRes.data) {
          setCategories(catRes.data.map(c => ({
            value: String(c.id || c._id),
            label: c.name
          })));
        }
      } catch (err) {
        console.warn('Using default categories fallback', err);
        setCategories([
          { value: '1', label: 'Electronics' },
          { value: '2', label: 'Clothing' },
          { value: '3', label: 'Books' },
          { value: '4', label: 'Furniture' },
          { value: '5', label: 'Groceries' },
          { value: '6', label: 'Toys' }
        ]);
      }

      try {
        const supRes = await getSuppliers();
        if (supRes && supRes.data) {
          setSuppliers(supRes.data.map(s => ({
            value: String(s.id || s._id),
            label: s.name
          })));
        }
      } catch (err) {
        console.warn('Suppliers fetch failed', err);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!productName.trim()) newErrors.productName = 'Product name is required.';
    if (!sku.trim()) newErrors.sku = 'SKU is required.';
    if (!category) newErrors.category = 'Category is required.';
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) newErrors.price = 'Valid price is required.';
    if (!quantity || isNaN(parseInt(quantity)) || parseInt(quantity) < 0) newErrors.quantity = 'Valid quantity is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: "Validation Error", description: "Please fill all required fields correctly.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    const productData = {
      name: productName.trim(),
      sku: sku.trim(),
      barcode: barcode.trim() || undefined,
      category: category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      supplier: supplier || undefined,
      description: description.trim() || undefined,
      images: imagePreview ? [imagePreview] : ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop"],
      isActive: true
    };

    try {
      await createProduct(productData);
      
      toast({ 
        title: "Product Added to Inventory", 
        description: `${productName} has been saved directly to MySQL database.` 
      });
      
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Failed to Add Product",
        description: error.message || "Could not save to MySQL backend. Please verify your backend is running.",
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
      className="max-w-5xl mx-auto space-y-6"
    >
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)} 
        className="text-[#c5a059] border-[#3a4d41] hover:bg-[#1f2e25] hover:text-[#f4efe6] transition-all"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>

      <Card className="old-money-card border-[#36493e] rounded-xl overflow-hidden shadow-2xl">
        <CardHeader className="border-b border-[#25352c] pb-6 bg-[#0f1712]/70">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-[#1a2920] border border-[#c5a059]/30 text-[#c5a059]">
              <PackagePlus className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-serif tracking-tight text-[#f8f6f0]">
                Add New Product
              </CardTitle>
              <CardDescription className="text-[#9ea8a1]">
                Catalog a new item in the central database.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="productName" className={cn("text-xs uppercase tracking-wider font-medium text-[#c5a059]", errors.productName && "text-red-400")}>
                    Product Name *
                  </Label>
                  <Input 
                    id="productName" 
                    value={productName} 
                    onChange={(e) => setProductName(e.target.value)} 
                    placeholder="e.g. Royal Oak Chronograph" 
                    className={cn("mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] focus:ring-[#c5a059]", errors.productName && "border-red-500")} 
                  />
                  {errors.productName && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={13} className="mr-1"/>{errors.productName}</p>}
                </div>

                <div>
                  <Label htmlFor="sku" className={cn("text-xs uppercase tracking-wider font-medium text-[#c5a059]", errors.sku && "text-red-400")}>
                    SKU (Stock Keeping Unit) *
                  </Label>
                  <Input 
                    id="sku" 
                    value={sku} 
                    onChange={(e) => setSku(e.target.value)} 
                    placeholder="e.g. LUX-8802-GOLD" 
                    className={cn("mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] focus:ring-[#c5a059]", errors.sku && "border-red-500")} 
                  />
                  {errors.sku && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={13} className="mr-1"/>{errors.sku}</p>}
                </div>

                <div>
                  <Label htmlFor="barcode" className="text-xs uppercase tracking-wider font-medium text-[#9ea8a1]">
                    Barcode / EAN (Optional)
                  </Label>
                  <Input 
                    id="barcode" 
                    value={barcode} 
                    onChange={(e) => setBarcode(e.target.value)} 
                    placeholder="e.g. 7350000000000" 
                    className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059]" 
                  />
                </div>

                <div>
                  <Label htmlFor="category" className={cn("text-xs uppercase tracking-wider font-medium text-[#c5a059]", errors.category && "text-red-400")}>
                    Category *
                  </Label>
                  <div className="mt-1.5">
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className={cn("w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6]", errors.category && "border-red-500")}>
                        <SelectValue placeholder="Select an inventory category" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.category && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={13} className="mr-1"/>{errors.category}</p>}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price" className={cn("text-xs uppercase tracking-wider font-medium text-[#c5a059]", errors.price && "text-red-400")}>
                    Unit Price ($) *
                  </Label>
                  <div className="relative mt-1.5">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#c5a059]" />
                    <Input 
                      id="price" 
                      type="number" 
                      step="0.01" 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)} 
                      placeholder="0.00" 
                      className={cn("pl-9 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] focus:ring-[#c5a059]", errors.price && "border-red-500")} 
                    />
                  </div>
                  {errors.price && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={13} className="mr-1"/>{errors.price}</p>}
                </div>

                <div>
                  <Label htmlFor="quantity" className={cn("text-xs uppercase tracking-wider font-medium text-[#c5a059]", errors.quantity && "text-red-400")}>
                    Initial Stock Quantity *
                  </Label>
                  <div className="relative mt-1.5">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#c5a059]" />
                    <Input 
                      id="quantity" 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(e.target.value)} 
                      placeholder="0" 
                      className={cn("pl-9 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] focus:ring-[#c5a059]", errors.quantity && "border-red-500")} 
                    />
                  </div>
                  {errors.quantity && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={13} className="mr-1"/>{errors.quantity}</p>}
                </div>

                <div>
                  <Label htmlFor="supplier" className="text-xs uppercase tracking-wider font-medium text-[#9ea8a1]">
                    Supplier (Optional)
                  </Label>
                  <div className="mt-1.5">
                    <Select value={supplier} onValueChange={setSupplier}>
                      <SelectTrigger className="w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6]">
                        <SelectValue placeholder="Select primary vendor" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                        {suppliers.map(sup => (
                          <SelectItem key={sup.value} value={sup.value}>
                            {sup.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="productImage" className="text-xs uppercase tracking-wider font-medium text-[#9ea8a1]">
                    Product Photo (Optional)
                  </Label>
                  <Input 
                    id="productImage" 
                    type="file" 
                    onChange={handleImageChange} 
                    accept="image/*" 
                    className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] file:text-[#c5a059] file:bg-[#1e2e24] file:border-0 file:rounded-md file:mr-3 file:py-1 file:px-3 file:text-xs" 
                  />
                  {imagePreview && (
                    <div className="mt-3 flex items-center gap-3 p-2 rounded-lg bg-[#111a14] border border-[#2e4034]">
                      <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-md border border-[#c5a059]/40" />
                      <span className="text-xs text-[#9ea8a1]">Image attached</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-xs uppercase tracking-wider font-medium text-[#9ea8a1]">
                Description & Specifications
              </Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Comprehensive details and notes about the item..." 
                className="mt-1.5 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] min-h-[90px]" 
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-3 p-6 border-t border-[#25352c] bg-[#0f1712]/50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/products')} 
              className="text-[#9ea8a1] border-[#2c3d32] hover:bg-[#18241d] hover:text-[#f4efe6]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="old-money-gold-btn px-6 py-2"
            >
              <PackagePlus className="mr-2 h-4 w-4" /> {isSubmitting ? 'Saving to Database...' : 'Save Product'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default AddProductPage;