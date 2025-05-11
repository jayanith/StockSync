
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
import { Package, ArrowLeft, DollarSign, Hash, Layers, ShoppingBag, Image as ImageIcon, Edit3, Save, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [description, setDescription] = useState('');
  const [productImage, setProductImage] = useState(null); // File object
  const [imagePreview, setImagePreview] = useState(''); // Data URL for preview
  
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('inventoryCategories')) || [];
    setCategories(storedCategories.map(c => ({ value: c.name, label: c.name })));

    const fetchProduct = () => {
      setIsLoading(true);
      const allProducts = JSON.parse(localStorage.getItem('inventoryProducts')) || [];
      const foundProduct = allProducts.find(p => p.id === productId);
      
      if (foundProduct) {
        setProduct(foundProduct);
        setProductName(foundProduct.name);
        setSku(foundProduct.sku);
        setBarcode(foundProduct.barcode || '');
        setCategory(foundProduct.category);
        setPrice(foundProduct.price.toString());
        setQuantity(foundProduct.quantity.toString());
        setSupplier(foundProduct.supplier || '');
        setDescription(foundProduct.description || '');
        setImagePreview(foundProduct.imageUrl || 'https://via.placeholder.com/150?text=No+Image');
      } else {
        toast({ title: "Error", description: "Product not found.", variant: "destructive" });
        navigate('/products');
      }
      setIsLoading(false);
    };
    fetchProduct();
  }, [productId, navigate, toast]);

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
      setProductImage(file); // Store file object if you plan to upload
      setImagePreview(URL.createObjectURL(file)); // Update preview
    }
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: "Validation Error", description: "Please fill all required fields correctly.", variant: "destructive" });
      return;
    }

    const updatedProductData = {
      ...product,
      name: productName,
      sku,
      barcode,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      supplier,
      description,
      imageUrl: imagePreview, // If productImage is new, this would be a new URL after upload
    };

    const allProducts = JSON.parse(localStorage.getItem('inventoryProducts')) || [];
    const updatedProducts = allProducts.map(p => p.id === productId ? updatedProductData : p);
    localStorage.setItem('inventoryProducts', JSON.stringify(updatedProducts));

    setProduct(updatedProductData);
    setIsEditing(false);
    toast({ title: "Product Updated", description: `${productName} has been successfully updated.` });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Package className="h-12 w-12 animate-spin text-sky-500" /></div>;
  }

  if (!product) {
    return <div className="text-center py-10 text-red-500">Product not found.</div>;
  }

  const DetailItem = ({ label, value, icon, className, error }) => (
    <div className={cn("mb-3", className)}>
      <Label className={cn("text-sm font-medium text-gray-400 flex items-center", error && "text-red-400")}>
        {icon && React.cloneElement(icon, { className: "mr-2 h-4 w-4"})}
        {label}
      </Label>
      <p className={cn("text-gray-100", error && "text-red-400")}>{value || 'N/A'}</p>
      {error && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{error}</p>}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button variant="outline" onClick={() => navigate('/products')} className="mb-6 text-sky-400 border-sky-500 hover:bg-sky-500/10">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>

      <form onSubmit={handleSaveChanges}>
        <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center">
                <Package className="mr-3 h-7 w-7" /> {isEditing ? "Edit Product" : product.name}
              </CardTitle>
              {!isEditing && <CardDescription className="text-gray-400">SKU: {product.sku}</CardDescription>}
            </div>
            <Button type={isEditing ? "submit" : "button"} onClick={() => { if(!isEditing) setIsEditing(true);}} className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
              {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit3 className="mr-2 h-4 w-4" />}
              {isEditing ? "Save Changes" : "Edit Product"}
            </Button>
          </CardHeader>
          
          <CardContent className="grid md:grid-cols-3 gap-6 pt-6">
            {/* Image Column */}
            <div className="md:col-span-1 space-y-3">
              <Label htmlFor="productImage" className="text-gray-300">Product Image</Label>
              <img  src={imagePreview} alt={productName} className="w-full h-auto max-h-80 object-contain rounded-md border border-slate-600 bg-slate-700 p-2" src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
              {isEditing && (
                <Input id="productImage" type="file" onChange={handleImageChange} accept="image/*" className="bg-slate-700 border-slate-600 file:text-sky-400 file:font-medium hover:file:bg-sky-700/20" />
              )}
            </div>

            {/* Details Column */}
            <div className="md:col-span-2 grid md:grid-cols-2 gap-x-6 gap-y-1">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="productName" className={cn("text-gray-300", errors.productName && "text-red-400")}>Product Name*</Label>
                    <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} className={cn("bg-slate-700 border-slate-600", errors.productName && "border-red-500")} />
                    {errors.productName && <p className="text-xs text-red-400 mt-1">{errors.productName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="sku" className={cn("text-gray-300", errors.sku && "text-red-400")}>SKU*</Label>
                    <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} className={cn("bg-slate-700 border-slate-600", errors.sku && "border-red-500")} />
                    {errors.sku && <p className="text-xs text-red-400 mt-1">{errors.sku}</p>}
                  </div>
                  <div>
                    <Label htmlFor="barcode" className="text-gray-300">Barcode</Label>
                    <Input id="barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} className="bg-slate-700 border-slate-600" />
                  </div>
                  <div>
                    <Label htmlFor="category" className={cn("text-gray-300", errors.category && "text-red-400")}>Category*</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className={cn("w-full bg-slate-700 border-slate-600 text-white", errors.category && "border-red-500")}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {categories.map(cat => <SelectItem key={cat.value} value={cat.value} className="hover:bg-sky-700/50 focus:bg-sky-600">{cat.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
                  </div>
                  <div>
                    <Label htmlFor="price" className={cn("text-gray-300", errors.price && "text-red-400")}>Price ($)*</Label>
                    <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={cn("bg-slate-700 border-slate-600", errors.price && "border-red-500")} />
                    {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
                  </div>
                  <div>
                    <Label htmlFor="quantity" className={cn("text-gray-300", errors.quantity && "text-red-400")}>Quantity*</Label>
                    <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={cn("bg-slate-700 border-slate-600", errors.quantity && "border-red-500")} />
                    {errors.quantity && <p className="text-xs text-red-400 mt-1">{errors.quantity}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="supplier" className="text-gray-300">Supplier</Label>
                    <Input id="supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} className="bg-slate-700 border-slate-600" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-slate-700 border-slate-600 min-h-[100px]" />
                  </div>
                </>
              ) : (
                <>
                  <DetailItem label="Product Name" value={product.name} icon={<Package />} />
                  <DetailItem label="SKU" value={product.sku} icon={<Hash />} />
                  <DetailItem label="Barcode" value={product.barcode} icon={<Hash />} />
                  <DetailItem label="Category" value={product.category} icon={<Layers />} />
                  <DetailItem label="Price" value={`$${product.price.toFixed(2)}`} icon={<DollarSign />} />
                  <DetailItem label="Quantity in Stock" value={product.quantity} icon={<ShoppingBag />} />
                  <div className="md:col-span-2"><DetailItem label="Supplier" value={product.supplier} /></div>
                  <div className="md:col-span-2"><DetailItem label="Description" value={product.description} /></div>
                </>
              )}
            </div>
          </CardContent>
          {isEditing && (
            <CardFooter className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
              <Button type="button" variant="outline" onClick={() => { setIsEditing(false); /* Reset changes if needed */ }} className="text-gray-300 border-slate-600 hover:bg-slate-700">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>
      </form>
    </motion.div>
  );
};

export default ProductDetailsPage;
  