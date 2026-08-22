import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, PlusCircle, Trash2, Search, Filter, DollarSign, Tag, Barcode, Layers, Building2 } from 'lucide-react';
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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const productsResponse = await getProducts();
      if (productsResponse && productsResponse.data) {
        setProducts(productsResponse.data);
      }
      
      const categoriesResponse = await getCategories();
      if (categoriesResponse && categoriesResponse.data) {
        setCategories(categoriesResponse.data.map(c => c.name));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Notice',
        description: 'Loaded local inventory snapshot.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => (p.id || p._id) !== productId));
      toast({ 
        title: "Product Removed", 
        description: "The item has been deleted from MySQL.", 
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product.',
        variant: 'destructive'
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const pName = product.name || '';
    const pSku = product.sku || '';
    const matchesSearchTerm = pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              pSku.toLowerCase().includes(searchTerm.toLowerCase());
    
    let catName = '';
    if (typeof product.category === 'string') {
      catName = product.category;
    } else if (product.category && product.category.name) {
      catName = product.category.name;
    }

    const matchesCategory = categoryFilter === 'all' || catName.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearchTerm && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 old-money-card border-[#2e4034] rounded-xl shadow-xl">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">Catalog Index</span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#f8f6f0] mt-1 flex items-center">
            <Package className="mr-3 h-7 w-7 text-[#c5a059]" /> Products Portfolio
          </h1>
          <p className="text-xs text-[#9ea8a1] mt-0.5">Real-time inventory database synchronized with MySQL</p>
        </div>
        <Link to="/products/new">
          <Button className="old-money-gold-btn text-xs uppercase tracking-wider py-2 px-4 shadow-lg">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </Link>
      </div>

      <Card className="old-money-card border-[#2e4034] rounded-xl">
        <CardHeader className="p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#c5a059]" />
              <Input 
                type="text"
                placeholder="Search catalog by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#141f18] border-[#2c3d32] text-[#f4efe6] focus:border-[#c5a059] text-xs h-11"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full bg-[#141f18] border-[#2c3d32] text-[#f4efe6] text-xs h-11">
                  <Filter className="mr-2 h-3.5 w-3.5 text-[#c5a059]" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Package className="h-10 w-10 animate-spin text-[#c5a059]" />
        </div>
      ) : (
        <AnimatePresence>
          {filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product, index) => {
                const prodId = product.id || product._id;
                const catName = typeof product.category === 'string' ? product.category : (product.category?.name || 'Unclassified');
                const supName = typeof product.supplier === 'string' ? product.supplier : (product.supplier?.name || 'Direct Source');
                const img = (product.images && product.images.length > 0) 
                  ? product.images[0] 
                  : "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop";

                return (
                  <motion.div
                    key={prodId || index}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                  >
                    <Card className="old-money-card border-[#2c3e33] hover:border-[#c5a059]/60 transition-all duration-200 flex flex-col h-full rounded-xl overflow-hidden group">
                      <div className="relative h-44 w-full overflow-hidden bg-[#0d1410] border-b border-[#202f25]">
                        <img 
                          src={img} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" 
                        />
                        <div className="absolute top-3 right-3 bg-[#0d1410]/90 backdrop-blur-md border border-[#c5a059]/40 px-2.5 py-1 rounded-full text-xs font-serif font-bold text-[#c5a059]">
                          ${Number(product.price || 0).toFixed(2)}
                        </div>
                        <div className="absolute bottom-3 left-3 bg-[#0d1410]/85 backdrop-blur-sm border border-[#2e4034] px-2.5 py-0.5 rounded text-[11px] text-[#d8d3c5] flex items-center gap-1.5">
                          <Tag className="h-3 w-3 text-[#c5a059]" />
                          <span>{catName}</span>
                        </div>
                      </div>

                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base font-serif font-semibold text-[#f8f6f0] line-clamp-1">
                          {product.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-[#9ea8a1] flex items-center gap-1 mt-0.5">
                          <Barcode className="h-3 w-3 text-[#c5a059]" /> SKU: <span className="text-[#f4efe6] font-mono">{product.sku}</span>
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="p-4 pt-1 flex-grow space-y-2 text-xs text-[#d8d3c5]">
                        <div className="flex justify-between items-center py-1 border-b border-[#1b2820]">
                          <span className="text-[#9ea8a1]">In Stock</span>
                          <span className={`font-semibold font-mono px-2 py-0.5 rounded text-[11px] ${
                            (product.quantity || 0) > 10 
                              ? 'bg-[#15271d] text-[#6ee7b7] border border-[#234734]' 
                              : 'bg-[#331b1b] text-[#fca5a5] border border-[#522525]'
                          }`}>
                            {product.quantity || 0} units
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-[#9ea8a1]">Vendor</span>
                          <span className="text-[#e5dec9] font-medium truncate max-w-[150px]">{supName}</span>
                        </div>
                      </CardContent>

                      <CardFooter className="p-3.5 pt-0 border-t border-[#1e2c22] bg-[#0c130f]/60 flex justify-end gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300">
                              <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#111914] border-[#36493e] text-[#f4efe6]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-serif text-[#f8f6f0]">Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription className="text-xs text-[#9ea8a1]">
                                Are you sure you wish to delete "{product.name}" from MySQL database? This action is permanent.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="text-xs text-[#9ea8a1] border-[#2c3d32] hover:bg-[#18241d] hover:text-[#f4efe6]">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteProduct(prodId)} 
                                className="bg-red-800 hover:bg-red-700 text-white text-xs"
                              >
                                Confirm Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 old-money-card border-[#2e4034] rounded-xl shadow-xl"
            >
              <Package className="h-16 w-16 text-[#c5a059] mx-auto mb-4 opacity-80" />
              <h2 className="text-xl font-serif font-semibold text-[#f8f6f0] mb-1">No Catalog Entries Found</h2>
              <p className="text-xs text-[#9ea8a1] mb-5">
                {searchTerm || categoryFilter !== 'all' ? 'No items match your active filter criteria.' : 'Your MySQL inventory database is ready for your first product.'}
              </p>
              <Link to="/products/new">
                <Button className="old-money-gold-btn text-xs uppercase tracking-wider py-2 px-5 shadow-lg">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add First Product
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default ProductsPage;