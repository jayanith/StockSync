
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Will create this component
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { PackagePlus, ArrowLeft, DollarSign, Hash, Layers, ShoppingBag, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategories, createProduct } from '@/lib/api';

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
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  // Function to fetch categories from the backend
  const fetchCategories = async () => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        throw new Error('Authentication required');
      }

      // Directly use fetch with authentication header instead of the helper function
      const response = await fetch('http://localhost:5000/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const data = await response.json();
      console.log('Categories response:', data); // Debug log
      
      if (data && data.data) {
        // Backend returns { success: true, data: [...] }
        const formattedCategories = data.data.map(c => ({ 
          value: c._id, 
          label: c.name 
        }));
        console.log('Formatted categories:', formattedCategories); // Debug log
        setCategories(formattedCategories);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error Loading Categories",
        description: "Could not load categories from the server. Using fallback options.",
        variant: "destructive"
      });
      
      // Fallback to hardcoded categories if API fails
      const fallbackCategories = [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'books', label: 'Books' },
        { value: 'furniture', label: 'Furniture' },
        { value: 'groceries', label: 'Groceries' },
        { value: 'toys', label: 'Toys' }
      ];
      setCategories(fallbackCategories);
    }
  };

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
    
    // Set up an interval to refresh categories every 5 seconds while on this page
    const intervalId = setInterval(() => {
      fetchCategories();
    }, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
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
      setProductImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: "Validation Error", description: "Please fill all required fields correctly.", variant: "destructive" });
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({ 
        title: "Authentication Error", 
        description: "You must be logged in to add products. Please log in and try again.", 
        variant: "destructive" 
      });
      navigate('/login');
      return;
    }

    // Make sure category is a valid MongoDB ID
    if (!category || category.length < 12) {
      toast({ 
        title: "Invalid Category", 
        description: "Please select a valid category from the dropdown.", 
        variant: "destructive" 
      });
      return;
    }

    // Format product data to match the backend model
    const productData = {
      name: productName,
      sku,
      // Only include non-empty fields
      ...(barcode ? { barcode } : {}),
      category, // This should be a valid MongoDB ObjectId
      price: parseFloat(price),
      quantity: parseInt(quantity),
      // Remove supplier field if empty to avoid ObjectId validation errors
      ...(supplier && supplier.trim() !== '' ? { supplier } : {}),
      ...(description && description.trim() !== '' ? { description } : {}),
      // Add images array instead of imageUrl to match the model
      ...(imagePreview ? { images: [imagePreview] } : {}),
      isActive: true
    };

    console.log('Submitting product data:', productData); // Debug log

    try {
      // Get authentication token
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Use direct fetch with authentication header
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();
      console.log('Product creation response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product');
      }
      
      toast({ 
        title: "Product Added", 
        description: `${productName} has been successfully added to inventory.` 
      });
      
      // Clear form fields
      setProductName('');
      setSku('');
      setBarcode('');
      setCategory('');
      setPrice('');
      setQuantity('');
      setSupplier('');
      setDescription('');
      setProductImage(null);
      setImagePreview('');
      
      // Navigate to products page
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      
      // More detailed error handling
      let errorMessage = "Failed to add product. Please try again.";
      if (error.message.includes("category")) {
        errorMessage = "Invalid category selected. Please choose a valid category.";
      } else if (error.message.includes("SKU")) {
        errorMessage = "This SKU already exists. Please use a unique SKU.";
      } else if (error.message.includes("authorized") || error.message.includes("token")) {
        errorMessage = "Authentication error. Please log in again.";
        // Clear invalid token
        localStorage.removeItem('authToken');
        setTimeout(() => navigate('/login'), 1500);
      }
      
      toast({
        title: "Error Adding Product",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6 text-sky-400 border-sky-500 hover:bg-sky-500/10">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>

      <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center">
            <PackagePlus className="mr-3 h-7 w-7" /> Add New Product
          </CardTitle>
          <CardDescription className="text-gray-400">Fill in the details for the new product.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="productName" className={cn("text-gray-300", errors.productName && "text-red-400")}>Product Name*</Label>
                  <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., Wireless Keyboard" className={cn("bg-slate-700 border-slate-600", errors.productName && "border-red-500")} />
                  {errors.productName && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.productName}</p>}
                </div>
                <div>
                  <Label htmlFor="sku" className={cn("text-gray-300", errors.sku && "text-red-400")}>SKU (Stock Keeping Unit)*</Label>
                  <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g., WK-001-BLK" className={cn("bg-slate-700 border-slate-600", errors.sku && "border-red-500")} />
                  {errors.sku && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.sku}</p>}
                </div>
                 <div>
                  <Label htmlFor="barcode" className="text-gray-300">Barcode (Optional)</Label>
                  <Input id="barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="e.g., 123456789012" className="bg-slate-700 border-slate-600" />
                </div>
                <div>
                  <Label htmlFor="category" className={cn("text-gray-300", errors.category && "text-red-400")}>Category*</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className={cn("w-full bg-slate-700 border-slate-600 text-white", errors.category && "border-red-500")}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value} className="hover:bg-sky-700/50 focus:bg-sky-600">{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.category}</p>}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price" className={cn("text-gray-300", errors.price && "text-red-400")}>Price ($)*</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className={cn("pl-8 bg-slate-700 border-slate-600", errors.price && "border-red-500")} />
                  </div>
                  {errors.price && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.price}</p>}
                </div>
                <div>
                  <Label htmlFor="quantity" className={cn("text-gray-300", errors.quantity && "text-red-400")}>Quantity in Stock*</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className={cn("pl-8 bg-slate-700 border-slate-600", errors.quantity && "border-red-500")} />
                  </div>
                  {errors.quantity && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertCircle size={14} className="mr-1"/>{errors.quantity}</p>}
                </div>
                <div>
                  <Label htmlFor="supplier" className="text-gray-300">Supplier (Optional)</Label>
                  <Input id="supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="e.g., Tech Supplies Inc." className="bg-slate-700 border-slate-600" />
                </div>
                 <div>
                  <Label htmlFor="productImage" className="text-gray-300">Product Image</Label>
                  <Input id="productImage" type="file" onChange={handleImageChange} accept="image/*" className="bg-slate-700 border-slate-600 file:text-sky-400 file:font-medium hover:file:bg-sky-700/20" />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Product Preview" className="h-32 w-32 object-cover rounded-md border border-slate-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-300">Description (Optional)</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed product description..." className="bg-slate-700 border-slate-600 min-h-[100px]" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
            <Button type="button" variant="outline" onClick={() => navigate('/products')} className="text-gray-300 border-slate-600 hover:bg-slate-700">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
              <PackagePlus className="mr-2 h-5 w-5" /> Add Product
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default AddProductPage;
  