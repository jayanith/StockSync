
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Users2, PlusCircle, Edit, Trash2, Search, Filter, Mail, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
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

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const mockSuppliers = [
    { id: 'sup1', name: 'TechSupply Co.', email: 'sales@techsupply.com', phone: '555-0101', contactPerson: 'John Doe', productsSupplied: 50 },
    { id: 'sup2', name: 'EcoThreads Ltd.', email: 'info@ecothreads.com', phone: '555-0102', contactPerson: 'Jane Smith', productsSupplied: 120 },
    { id: 'sup3', name: 'LearnWell Publishers', email: 'orders@learnwell.com', phone: '555-0103', contactPerson: 'Robert Brown', productsSupplied: 300 },
    { id: 'sup4', name: 'KitchenPro Inc.', email: 'support@kitchenpro.com', phone: '555-0104', contactPerson: 'Alice Green', productsSupplied: 80 },
  ];

  useEffect(() => {
    setIsLoading(true);
    const storedSuppliers = JSON.parse(localStorage.getItem('inventorySuppliers')) || mockSuppliers;
    setSuppliers(storedSuppliers);
    setIsLoading(false);
    if (!localStorage.getItem('inventorySuppliers')) {
      localStorage.setItem('inventorySuppliers', JSON.stringify(mockSuppliers));
    }
  }, []);

  const handleDeleteSupplier = (supplierId) => {
    const updatedSuppliers = suppliers.filter(s => s.id !== supplierId);
    setSuppliers(updatedSuppliers);
    localStorage.setItem('inventorySuppliers', JSON.stringify(updatedSuppliers));
    toast({ title: "Supplier Deleted", description: "The supplier has been removed.", variant: "destructive" });
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.contactPerson && supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Users2 className="h-10 w-10 animate-spin text-sky-500" /></div>;
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
          <Users2 className="mr-3 h-8 w-8" /> Manage Suppliers
        </h1>
        <Link to="/suppliers/new">
          <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Supplier
          </Button>
        </Link>
      </div>

      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Search Suppliers</CardTitle>
          <div className="relative pt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 mt-2" />
            <Input 
              type="text"
              placeholder="Search by name, email, or contact person..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 focus:border-sky-500 text-white w-full"
            />
          </div>
        </CardHeader>
      </Card>

      <AnimatePresence>
        {filteredSuppliers.length > 0 ? (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier, index) => (
              <motion.div
                key={supplier.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-slate-800/70 border-slate-700 hover:shadow-sky-500/20 transition-shadow duration-300 flex flex-col h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">{supplier.name}</CardTitle>
                      <img  class="w-12 h-12 object-contain rounded-md ml-2 bg-slate-700 p-1" alt={supplier.name + " logo"} src="https://images.unsplash.com/photo-1485531865381-286666aa80a9" />
                    </div>
                    <CardDescription className="text-gray-400 pt-1">Contact: {supplier.contactPerson || 'N/A'}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2">
                    <p className="text-sm text-gray-300 flex items-center"><Mail className="mr-2 h-4 w-4 text-gray-500" />{supplier.email}</p>
                    <p className="text-sm text-gray-300 flex items-center"><Phone className="mr-2 h-4 w-4 text-gray-500" />{supplier.phone}</p>
                    <p className="text-sm text-gray-300">Products Supplied: <span className="font-semibold text-sky-300">{supplier.productsSupplied}</span></p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-slate-700 flex justify-end space-x-2">
                    <Link to={`/suppliers/${supplier.id}`}>
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
                            Are you sure you want to delete supplier "{supplier.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="text-gray-300 border-slate-600 hover:bg-slate-700">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteSupplier(supplier.id)} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
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
            <Users2 className="h-20 w-20 text-sky-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-2xl font-semibold text-gray-200 mb-2">No Suppliers Found</h2>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'No suppliers match your search.' : 'Your supplier list is empty.'}
            </p>
            <Link to="/suppliers/new">
              <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg">
                <PlusCircle className="mr-2 h-5 w-5" /> Add First Supplier
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SuppliersPage;
  