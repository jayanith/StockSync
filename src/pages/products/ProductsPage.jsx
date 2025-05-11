
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, PlusCircle, Edit, Trash2, Search, Filter, DollarSign, Tag, Barcode } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProducts, getCategories, deleteProduct } from '@/lib/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch products from API
        const productsResponse = await getProducts();
        setProducts(productsResponse.data);
        
        // Fetch categories from API
        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse.data.map(c => c.name));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p._id !== productId));
      toast({ 
        title: "Product Deleted", 
        description: "The product has been removed.", 
        variant: "destructive" 
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || 
                            (product.category && 
                             (typeof product.category === 'string' ? 
                              product.category === categoryFilter : 
                              product.category.name === categoryFilter));
    return matchesSearchTerm && matchesCategory;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Package className="h-10 w-10 animate-spin text-sky-500" /></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 bg-slate-800/50 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center">
          <Package className="mr-3 h-8 w-8" /> Manage Products
        </h1>
        <Link to="/products/new">
          <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
          </Button>
        </Link>
      </div>

      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Filter & Search Products</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 focus:border-sky-500 text-white w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px] bg-slate-700 border-slate-600 text-white focus:ring-sky-500">
                <Filter className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all" className="hover:bg-sky-700/50 focus:bg-sky-600">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} className="hover:bg-sky-700/50 focus:bg-sky-600">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <AnimatePresence>
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-slate-800/70 border-slate-700 hover:shadow-sky-500/20 transition-shadow duration-300 flex flex-col h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">{product.name}</CardTitle>
                      <img  class="w-16 h-16 object-cover rounded-md ml-2 bg-slate-700" alt={product.name} src="https://images.unsplash.com/photo-1675627452873-41eddc681439" />
                    </div>
                    <CardDescription className="text-gray-400 pt-1 flex items-center"><Tag className="mr-2 h-4 w-4 text-sky-400" /> {typeof product.category === 'string' ? product.category : (product.category ? product.category.name : 'Uncategorized')}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2">
                    <p className="text-sm text-gray-300 flex items-center"><Barcode className="mr-2 h-4 w-4 text-gray-500" />SKU: <span className="font-semibold text-gray-200 ml-1">{product.sku}</span></p>
                    <p className="text-sm text-gray-300 flex items-center"><DollarSign className="mr-2 h-4 w-4 text-green-400" />Price: <span className="font-semibold text-green-400 ml-1">${product.price.toFixed(2)}</span></p>
                    <p className="text-sm text-gray-300">Quantity: <span className={`font-semibold ml-1 ${product.quantity > 10 ? 'text-sky-300' : 'text-red-400'}`}>{product.quantity}</span></p>
                    <p className="text-sm text-gray-300">Supplier: <span className="font-semibold text-gray-200 ml-1">{typeof product.supplier === 'string' ? product.supplier : (product.supplier ? product.supplier.name : 'Unknown')}</span></p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-slate-700 flex justify-end space-x-2">
                    <Link to={`/products/${product._id}`}>
                      <Button variant="outline" size="sm" className="text-sky-400 border-sky-500 hover:bg-sky-500/10">
                        <Edit className="mr-1 h-4 w-4" /> View/Edit
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="bg-red-600/80 hover:bg-red-600 text-white">
                          <Trash2 className="mr-1 h-4 w-4" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-800 border-slate-700 text-gray-200">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-400">Confirm Deletion</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete "{product.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="text-gray-300 border-slate-600 hover:bg-slate-700">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProduct(product._id)} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-slate-800/50 rounded-xl shadow-xl"
          >
            <Package className="h-20 w-20 text-sky-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-2xl font-semibold text-gray-200 mb-2">No Products Found</h2>
            <p className="text-gray-400 mb-6">
              {searchTerm || categoryFilter !== 'all' ? 'No products match your current filters.' : 'Your product inventory is empty.'}
            </p>
            <Link to="/products/new">
              <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg">
                <PlusCircle className="mr-2 h-5 w-5" /> Add First Product
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductsPage;
  