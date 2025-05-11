
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, PlusCircle, Edit, Trash2, Search, MapPin, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger
} from "@/components/ui/dialog.jsx";
import { Label } from '@/components/ui/label';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [warehouseName, setWarehouseName] = useState('');
  const [warehouseLocation, setWarehouseLocation] = useState('');
  const [warehouseCapacity, setWarehouseCapacity] = useState('');
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  const mockWarehouses = [
    { id: 'wh1', name: 'Main Warehouse', location: '123 Industrial Rd, Anytown', capacity: 10000, currentStockItems: 5670 },
    { id: 'wh2', name: 'Downtown Hub', location: '45 Market St, Anytown', capacity: 2000, currentStockItems: 1500 },
    { id: 'wh3', name: 'North Depot', location: '789 North Ave, Anytown', capacity: 5000, currentStockItems: 3200 },
  ];

  useEffect(() => {
    setIsLoading(true);
    const storedWarehouses = JSON.parse(localStorage.getItem('inventoryWarehouses')) || mockWarehouses;
    setWarehouses(storedWarehouses);
    setIsLoading(false);
    if (!localStorage.getItem('inventoryWarehouses')) {
      localStorage.setItem('inventoryWarehouses', JSON.stringify(mockWarehouses));
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!warehouseName.trim()) newErrors.warehouseName = 'Warehouse name is required.';
    if (!warehouseLocation.trim()) newErrors.warehouseLocation = 'Location is required.';
    if (warehouseCapacity && (isNaN(parseInt(warehouseCapacity)) || parseInt(warehouseCapacity) <=0)) newErrors.warehouseCapacity = 'Valid capacity is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrUpdateWarehouse = (e) => {
    e.preventDefault();
    if(!validateForm()) {
      toast({ title: "Validation Error", description: "Please fill required fields correctly.", variant: "destructive" });
      return;
    }
    let updatedWarehouses;
    if (editingWarehouse) {
      updatedWarehouses = warehouses.map(wh => wh.id === editingWarehouse.id ? { ...wh, name: warehouseName, location: warehouseLocation, capacity: parseInt(warehouseCapacity) || 0 } : wh);
      toast({ title: "Warehouse Updated", description: `Warehouse "${warehouseName}" updated.` });
    } else {
      const newWarehouse = {
        id: `wh${Date.now()}`,
        name: warehouseName,
        location: warehouseLocation,
        capacity: parseInt(warehouseCapacity) || 0,
        currentStockItems: 0,
      };
      updatedWarehouses = [...warehouses, newWarehouse];
      toast({ title: "Warehouse Added", description: `Warehouse "${warehouseName}" added.` });
    }
    setWarehouses(updatedWarehouses);
    localStorage.setItem('inventoryWarehouses', JSON.stringify(updatedWarehouses));
    resetForm();
  };

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setWarehouseName(warehouse.name);
    setWarehouseLocation(warehouse.location);
    setWarehouseCapacity(warehouse.capacity.toString());
    setErrors({});
    setIsFormOpen(true);
  };

  const handleDelete = (warehouseId) => {
    const updatedWarehouses = warehouses.filter(wh => wh.id !== warehouseId);
    setWarehouses(updatedWarehouses);
    localStorage.setItem('inventoryWarehouses', JSON.stringify(updatedWarehouses));
    toast({ title: "Warehouse Deleted", description: "Warehouse has been removed.", variant: "destructive" });
  };

  const resetForm = () => {
    setEditingWarehouse(null);
    setWarehouseName('');
    setWarehouseLocation('');
    setWarehouseCapacity('');
    setErrors({});
    setIsFormOpen(false);
  };

  const filteredWarehouses = warehouses.filter(wh => 
    wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wh.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Building className="h-10 w-10 animate-spin text-sky-500" /></div>;
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
          <Building className="mr-3 h-8 w-8" /> Manage Warehouses
        </h1>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
              <PlusCircle className="mr-2 h-5 w-5" /> {editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700 text-gray-200">
            <DialogHeader>
              <DialogTitle className="text-sky-400">{editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}</DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingWarehouse ? 'Update warehouse details.' : 'Enter details for the new warehouse.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddOrUpdateWarehouse} className="grid gap-4 py-4">
              <div>
                <Label htmlFor="warehouseName" className={cn("text-gray-300", errors.warehouseName && "text-red-400")}>Name*</Label>
                <Input id="warehouseName" value={warehouseName} onChange={(e) => setWarehouseName(e.target.value)} className={cn("bg-slate-700 border-slate-600", errors.warehouseName && "border-red-500")} />
                {errors.warehouseName && <p className="text-xs text-red-400 mt-1">{errors.warehouseName}</p>}
              </div>
              <div>
                <Label htmlFor="warehouseLocation" className={cn("text-gray-300", errors.warehouseLocation && "text-red-400")}>Location*</Label>
                <Input id="warehouseLocation" value={warehouseLocation} onChange={(e) => setWarehouseLocation(e.target.value)} className={cn("bg-slate-700 border-slate-600", errors.warehouseLocation && "border-red-500")} />
                {errors.warehouseLocation && <p className="text-xs text-red-400 mt-1">{errors.warehouseLocation}</p>}
              </div>
              <div>
                <Label htmlFor="warehouseCapacity" className={cn("text-gray-300", errors.warehouseCapacity && "text-red-400")}>Capacity (Units)</Label>
                <Input id="warehouseCapacity" type="number" value={warehouseCapacity} onChange={(e) => setWarehouseCapacity(e.target.value)} className={cn("bg-slate-700 border-slate-600", errors.warehouseCapacity && "border-red-500")} />
                {errors.warehouseCapacity && <p className="text-xs text-red-400 mt-1">{errors.warehouseCapacity}</p>}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm} className="text-gray-300 border-slate-600 hover:bg-slate-700">Cancel</Button>
                <Button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white">{editingWarehouse ? 'Save Changes' : 'Add Warehouse'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Search Warehouses</CardTitle>
          <div className="relative pt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 mt-2" />
            <Input 
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 focus:border-sky-500 text-white w-full"
            />
          </div>
        </CardHeader>
      </Card>

      <AnimatePresence>
        {filteredWarehouses.length > 0 ? (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWarehouses.map((wh, index) => (
              <motion.div
                key={wh.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-slate-800/70 border-slate-700 hover:shadow-sky-500/20 transition-shadow duration-300 flex flex-col h-full">
                  <CardHeader>
                    <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">{wh.name}</CardTitle>
                    <CardDescription className="text-gray-400 pt-1 flex items-center"><MapPin className="mr-2 h-4 w-4 text-gray-500" />{wh.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2">
                    <p className="text-sm text-gray-300">Capacity: <span className="font-semibold text-sky-300">{wh.capacity.toLocaleString()} units</span></p>
                    <p className="text-sm text-gray-300">Current Stock: <span className="font-semibold text-sky-300">{wh.currentStockItems.toLocaleString()} items</span></p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-slate-700 flex justify-end space-x-2">
                    <Link to={`/inventory/warehouses/${wh.id}`}>
                      <Button variant="outline" size="sm" className="text-sky-400 border-sky-500 hover:bg-sky-500/10">
                        <Package className="mr-1 h-4 w-4" /> View Stock
                      </Button>
                    </Link>
                     <Button onClick={() => handleEdit(wh)} variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/30 h-8 w-8">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" className="bg-red-600/80 hover:bg-red-600 text-white h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-800 border-slate-700 text-gray-200">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-400">Confirm Deletion</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete warehouse "{wh.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="text-gray-300 border-slate-600 hover:bg-slate-700">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(wh.id)} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
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
            <Building className="h-20 w-20 text-sky-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-2xl font-semibold text-gray-200 mb-2">No Warehouses Found</h2>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'No warehouses match your search.' : 'Your warehouse list is empty.'}
            </p>
            <Button onClick={() => setIsFormOpen(true)} className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg">
              <PlusCircle className="mr-2 h-5 w-5" /> Add First Warehouse
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WarehousesPage;
  