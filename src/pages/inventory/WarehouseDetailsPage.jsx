
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Building, ArrowLeft, MapPin, Package, Search, Layers } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const WarehouseDetailsPage = () => {
  const { warehouseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [warehouse, setWarehouse] = useState(null);
  const [stockItems, setStockItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const allWarehouses = JSON.parse(localStorage.getItem('inventoryWarehouses')) || [];
    const foundWarehouse = allWarehouses.find(wh => wh.id === warehouseId);
    const warehouseIndex = allWarehouses.findIndex(wh => wh.id === warehouseId);


    if (foundWarehouse) {
      setWarehouse(foundWarehouse);
      const allProducts = JSON.parse(localStorage.getItem('inventoryProducts')) || [];
      const warehouseProducts = allProducts
        .filter((p, productIndex) => productIndex % (allWarehouses.length || 1) === warehouseIndex) 
        .map((p, productIndex) => ({ ...p, quantityInWarehouse: Math.floor(p.quantity / (allWarehouses.length || 1)) + (productIndex % 3) }));
      setStockItems(warehouseProducts);
    } else {
      toast({ title: "Error", description: "Warehouse not found.", variant: "destructive" });
      navigate('/inventory/warehouses');
    }
    setIsLoading(false);
  }, [warehouseId, navigate, toast]);
  
  const filteredStockItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Building className="h-12 w-12 animate-spin text-sky-500" /></div>;
  }

  if (!warehouse) {
    return <div className="text-center py-10 text-red-500">Warehouse not found.</div>;
  }

  const totalStockInWarehouse = stockItems.reduce((sum, item) => sum + item.quantityInWarehouse, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <Button variant="outline" onClick={() => navigate('/inventory/warehouses')} className="mb-6 text-sky-400 border-sky-500 hover:bg-sky-500/10">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Warehouses
      </Button>

      <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
        <CardHeader className="border-b border-slate-700 pb-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
            {warehouse.name}
          </CardTitle>
          <CardDescription className="text-gray-400 flex items-center mt-1">
            <MapPin className="mr-2 h-4 w-4" /> {warehouse.location}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 bg-slate-700/50 border-slate-600 p-4">
                <h3 className="text-lg font-semibold text-sky-300 mb-2">Warehouse Stats</h3>
                <p className="text-sm text-gray-300">Capacity: <span className="font-bold text-white">{warehouse.capacity.toLocaleString()} units</span></p>
                <p className="text-sm text-gray-300">Total Items: <span className="font-bold text-white">{totalStockInWarehouse.toLocaleString()}</span></p>
                <p className="text-sm text-gray-300 mb-1">Utilization:</p>
                <Progress value={(totalStockInWarehouse / warehouse.capacity) * 100} className="h-3 [&>*]:bg-sky-500" />
            </Card>
            <div className="md:col-span-2">
                 <Input 
                    type="text"
                    placeholder="Search products in this warehouse..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 focus:border-sky-500 text-white w-full mb-4"
                />
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 sr-only" /> {/* Icon for visual consistency, hidden if input has own */}
            </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
        <CardHeader>
            <CardTitle className="text-xl text-sky-300">Stock in {warehouse.name}</CardTitle>
        </CardHeader>
        <CardContent>
        {filteredStockItems.length > 0 ? (
            <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
                <tr>
                    <th scope="col" className="px-6 py-3">Product Name</th>
                    <th scope="col" className="px-6 py-3">SKU</th>
                    <th scope="col" className="px-6 py-3">Category</th>
                    <th scope="col" className="px-6 py-3 text-center">Quantity in Warehouse</th>
                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredStockItems.map((item, index) => (
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
                    <td className="px-6 py-4 text-center">{item.quantityInWarehouse}</td>
                    <td className="px-6 py-4 text-center">
                        <Link to={`/products/${item.id}`}>
                        <Button variant="ghost" size="sm" className="text-sky-400 hover:text-sky-300 hover:bg-sky-900/30">
                            <Package className="mr-1 h-4 w-4" /> View Product
                        </Button>
                        </Link>
                    </td>
                    </motion.tr>
                ))}
                </tbody>
            </table>
            </div>
        ) : (
            <p className="text-center text-gray-400 py-8">No products found in this warehouse {searchTerm && 'matching your search'}.</p>
        )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WarehouseDetailsPage;
  