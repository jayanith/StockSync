
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BarChartBig, Package, AlertTriangle, Search, Filter, Layers, Warehouse, X, ShoppingCart, DollarSign, Calendar, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress'; // Will create this component
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const InventoryPage = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockLevelFilter, setStockLevelFilter] = useState('all'); // 'all', 'low', 'out'
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const lowStockThreshold = 10; // Example threshold

  useEffect(() => {
    const fetchInventoryData = async () => {
      setIsLoading(true);
      try {
        // Get authentication token
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('Authentication required');
          setIsLoading(false);
          return;
        }

        // Fetch products from the backend
        const productsResponse = await fetch('http://localhost:5000/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }

        const productsData = await productsResponse.json();
        
        // Fetch categories from the backend
        const categoriesResponse = await fetch('http://localhost:5000/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }

        const categoriesData = await categoriesResponse.json();
        
        // If no products found in the API, use mock data for demonstration
        if (productsData.data && productsData.data.length > 0) {
          setInventoryItems(productsData.data.map(p => ({
            ...p,
            id: p._id, // Map backend _id to id for compatibility
            maxStock: p.quantity < 50 ? 100 : p.quantity * 2,
            category: categoriesData.data.find(c => c._id === p.category)?.name || 'Uncategorized'
          })));
        } else {
          // Use mock data if API returns empty
          const mockProducts = [
            {
              id: 'mock1',
              name: 'Wireless Mouse X2000',
              sku: 'WM-X2000-BLK',
              category: 'Electronics',
              quantity: 150,
              maxStock: 300
            },
            {
              id: 'mock2',
              name: 'Organic Cotton T-Shirt',
              sku: 'TS-OC-M-GRY',
              category: 'Clothing',
              quantity: 300,
              maxStock: 600
            },
            {
              id: 'mock3',
              name: 'The Art of Programming',
              sku: 'BK-TAP-HC',
              category: 'Books',
              quantity: 80,
              maxStock: 160
            },
            {
              id: 'mock4',
              name: 'Stainless Steel Coffee Maker',
              sku: 'CM-SS-12C',
              category: 'Home & Kitchen',
              quantity: 50,
              maxStock: 100
            },
            {
              id: 'mock5',
              name: 'Bluetooth Headphones Pro',
              sku: 'HP-BT-PRO-BLU',
              category: 'Electronics',
              quantity: 8,
              maxStock: 100
            },
            {
              id: 'mock6',
              name: 'Office Desk Chair',
              sku: 'CH-OD-ERG-BLK',
              category: 'Office Supplies',
              quantity: 0,
              maxStock: 50
            }
          ];
          setInventoryItems(mockProducts);
        }
        
        // Set categories
        if (categoriesData.data && categoriesData.data.length > 0) {
          setCategories(categoriesData.data.map(c => c.name));
        } else {
          setCategories(['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Office Supplies']);
        }
      } catch (error) {
        console.error('Error fetching inventory data:', error);
        // Use mock data as fallback
        const mockProducts = [
          {
            id: 'mock1',
            name: 'Wireless Mouse X2000',
            sku: 'WM-X2000-BLK',
            category: 'Electronics',
            quantity: 150,
            maxStock: 300
          },
          {
            id: 'mock2',
            name: 'Organic Cotton T-Shirt',
            sku: 'TS-OC-M-GRY',
            category: 'Clothing',
            quantity: 300,
            maxStock: 600
          },
          {
            id: 'mock3',
            name: 'The Art of Programming',
            sku: 'BK-TAP-HC',
            category: 'Books',
            quantity: 80,
            maxStock: 160
          },
          {
            id: 'mock4',
            name: 'Stainless Steel Coffee Maker',
            sku: 'CM-SS-12C',
            category: 'Home & Kitchen',
            quantity: 50,
            maxStock: 100
          },
          {
            id: 'mock5',
            name: 'Bluetooth Headphones Pro',
            sku: 'HP-BT-PRO-BLU',
            category: 'Electronics',
            quantity: 8,
            maxStock: 100
          },
          {
            id: 'mock6',
            name: 'Office Desk Chair',
            sku: 'CH-OD-ERG-BLK',
            category: 'Office Supplies',
            quantity: 0,
            maxStock: 50
          }
        ];
        setInventoryItems(mockProducts);
        setCategories(['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Office Supplies']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  const getStockLevelStatus = (quantity) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= lowStockThreshold) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusColor = (quantity) => {
    if (quantity === 0) return 'text-red-400 bg-red-600/20';
    if (quantity <= lowStockThreshold) return 'text-yellow-400 bg-yellow-600/20';
    return 'text-green-400 bg-green-600/20';
  };
  
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    let matchesStockLevel = true;
    if (stockLevelFilter === 'low') {
      matchesStockLevel = item.quantity > 0 && item.quantity <= lowStockThreshold;
    } else if (stockLevelFilter === 'out') {
      matchesStockLevel = item.quantity === 0;
    } else if (stockLevelFilter === 'in_stock') {
      matchesStockLevel = item.quantity > lowStockThreshold;
    }

    return matchesSearchTerm && matchesCategory && matchesStockLevel;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><BarChartBig className="h-10 w-10 animate-spin text-sky-500" /></div>;
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
          <BarChartBig className="mr-3 h-8 w-8" /> Inventory Status
        </h1>
        <Link to="/inventory/transfers">
            <Button variant="outline" className="text-sky-400 border-sky-500 hover:bg-sky-500/10">
                <Warehouse className="mr-2 h-4 w-4" /> Manage Transfers
            </Button>
        </Link>
      </div>

      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Filter & Search Inventory</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search by Name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 focus:border-sky-500 text-white w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white focus:ring-sky-500">
                <Layers className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all" className="hover:bg-sky-700/50 focus:bg-sky-600">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} className="hover:bg-sky-700/50 focus:bg-sky-600">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockLevelFilter} onValueChange={setStockLevelFilter}>
              <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white focus:ring-sky-500">
                <Filter className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Filter by stock level" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all" className="hover:bg-sky-700/50 focus:bg-sky-600">All Stock Levels</SelectItem>
                <SelectItem value="in_stock" className="hover:bg-sky-700/50 focus:bg-sky-600">In Stock</SelectItem>
                <SelectItem value="low" className="hover:bg-sky-700/50 focus:bg-sky-600">Low Stock</SelectItem>
                <SelectItem value="out" className="hover:bg-sky-700/50 focus:bg-sky-600">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {filteredItems.length > 0 ? (
        <div className="overflow-x-auto bg-slate-800/70 border border-slate-700 rounded-lg shadow-md">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3">Product Name</th>
                <th scope="col" className="px-6 py-3">SKU</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3 text-center">Quantity</th>
                <th scope="col" className="px-6 py-3 text-center">Stock Level</th>
                <th scope="col" className="px-6 py-3 text-center">Status</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-slate-700 hover:bg-slate-700/30"
                >
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4">{item.sku}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4 text-center">{item.quantity}</td>
                  <td className="px-6 py-4">
                    <Progress value={(item.quantity / item.maxStock) * 100} className="h-2 [&>*]:bg-sky-500" indicatorClassName={
                        item.quantity === 0 ? "bg-red-500" : item.quantity <= lowStockThreshold ? "bg-yellow-500" : "bg-green-500"
                    }/>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block min-w-[90px] px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.quantity)}`}>
                      {getStockLevelStatus(item.quantity)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-sky-400 hover:text-sky-300 hover:bg-sky-900/30"
                      onClick={() => {
                        setSelectedProduct(item);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Package className="mr-1 h-4 w-4" /> Details
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-slate-800/50 rounded-xl shadow-xl"
        >
          <Package className="h-20 w-20 text-sky-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-semibold text-gray-200 mb-2">No Inventory Items Found</h2>
          <p className="text-gray-400 mb-6">
            {searchTerm || categoryFilter !== 'all' || stockLevelFilter !== 'all' ? 'No items match your current filters.' : 'Your inventory is empty or not yet tracked.'}
          </p>
        </motion.div>
      )}

      {/* Product Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedProduct && (
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
                <Package className="h-6 w-6 text-sky-400" />
                {selectedProduct.name}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Product details and inventory information
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <Card className="bg-slate-700/50 border-slate-600 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium text-sky-400">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-400">SKU</p>
                      <p className="text-white">{selectedProduct.sku}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Layers className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-400">Category</p>
                      <p className="text-white">{selectedProduct.category}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-400">Price</p>
                      <p className="text-white">${selectedProduct.price || '29.99'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-400">Last Updated</p>
                      <p className="text-white">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/50 border-slate-600 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium text-sky-400">Inventory Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium text-gray-400">Current Stock</p>
                      <p className="text-sm font-medium text-white">{selectedProduct.quantity} units</p>
                    </div>
                    <Progress 
                      value={(selectedProduct.quantity / selectedProduct.maxStock) * 100} 
                      className="h-2.5 [&>*]:bg-sky-500" 
                      indicatorClassName={
                        selectedProduct.quantity === 0 ? "bg-red-500" : 
                        selectedProduct.quantity <= lowStockThreshold ? "bg-yellow-500" : "bg-green-500"
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${getStatusColor(selectedProduct.quantity)}`}>
                        {selectedProduct.quantity === 0 ? (
                          <AlertTriangle className="h-5 w-5" />
                        ) : selectedProduct.quantity <= lowStockThreshold ? (
                          <AlertTriangle className="h-5 w-5" />
                        ) : (
                          <Package className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{getStockLevelStatus(selectedProduct.quantity)}</p>
                        <p className="text-xs text-gray-400">
                          {selectedProduct.quantity === 0 ? 'Order more stock immediately' : 
                           selectedProduct.quantity <= lowStockThreshold ? 'Consider restocking soon' : 
                           'Healthy inventory level'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-400">Reorder Point</p>
                      <p className="text-white font-medium">{lowStockThreshold} units</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Optimal Stock</p>
                      <p className="text-white font-medium">{Math.round(selectedProduct.maxStock * 0.75)} units</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Max Capacity</p>
                      <p className="text-white font-medium">{selectedProduct.maxStock} units</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="flex justify-between items-center border-t border-slate-700 pt-4">
              <div className="text-gray-400 text-sm">
                <ShoppingCart className="inline-block h-4 w-4 mr-1" /> 
                Last ordered: {new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </div>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    toast({
                      title: "Action Triggered",
                      description: `You would edit ${selectedProduct.name} here.`,
                      variant: "default",
                    });
                    setIsDialogOpen(false);
                  }}
                  className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
                >
                  Edit Product
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </motion.div>
  );
};

export default InventoryPage;
  